
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  video_preview_url TEXT,
  instructor_id UUID REFERENCES public.users(id) NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  is_published BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  duration INTEGER, -- in seconds
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- Enrollments table
CREATE TABLE public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  UNIQUE(user_id, course_id)
);

-- Lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  watch_time INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-images', 'course-images', true),
  ('course-videos', 'course-videos', false),
  ('user-avatars', 'user-avatars', true);

-- Row Level Security Policies

-- Users policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Categories policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Courses policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can view their own courses" ON public.courses FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can manage their own courses" ON public.courses FOR ALL USING (auth.uid() = instructor_id);
CREATE POLICY "Admins can manage all courses" ON public.courses FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Lessons policies
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view published lessons of enrolled courses" ON public.lessons FOR SELECT USING (
  is_published = true AND 
  EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND course_id = lessons.course_id)
);
CREATE POLICY "Instructors can manage lessons of their courses" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = lessons.course_id AND instructor_id = auth.uid())
);
CREATE POLICY "Admins can manage all lessons" ON public.lessons FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Enrollments policies
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all enrollments" ON public.enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Lesson progress policies
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all lesson progress" ON public.lesson_progress FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update course progress
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS trigger AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  new_progress DECIMAL(5,2);
BEGIN
  -- Get total lessons for the course
  SELECT COUNT(*) INTO total_lessons
  FROM public.lessons l
  JOIN public.lesson_progress lp ON l.id = NEW.lesson_id
  JOIN public.courses c ON l.course_id = c.id
  WHERE c.id = (SELECT course_id FROM public.lessons WHERE id = NEW.lesson_id);

  -- Get completed lessons for the user in this course
  SELECT COUNT(*) INTO completed_lessons
  FROM public.lesson_progress lp
  JOIN public.lessons l ON lp.lesson_id = l.id
  WHERE lp.user_id = NEW.user_id 
    AND l.course_id = (SELECT course_id FROM public.lessons WHERE id = NEW.lesson_id)
    AND lp.completed = true;

  -- Calculate progress
  IF total_lessons > 0 THEN
    new_progress := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
  ELSE
    new_progress := 0;
  END IF;

  -- Update enrollment progress
  UPDATE public.enrollments
  SET progress = new_progress,
      completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE NULL END
  WHERE user_id = NEW.user_id 
    AND course_id = (SELECT course_id FROM public.lessons WHERE id = NEW.lesson_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating course progress
CREATE TRIGGER on_lesson_progress_updated
  AFTER UPDATE ON public.lesson_progress
  FOR EACH ROW 
  WHEN (OLD.completed IS DISTINCT FROM NEW.completed)
  EXECUTE PROCEDURE public.update_course_progress();

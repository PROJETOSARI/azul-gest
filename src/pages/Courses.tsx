
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BookOpen, Users, Clock } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: courses, isLoading, error } = useCourses();

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar cursos</h2>
        <p className="text-gray-600">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os cursos disponíveis</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/courses/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Publicados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses?.filter(course => course.is_published).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses?.filter(course => !course.is_published).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            {course.image_url && (
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge variant={course.is_published ? "default" : "secondary"}>
                  {course.is_published ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Instrutor: {course.users?.name}</span>
                <span>R$ {course.price?.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to={`/dashboard/courses/${course.id}`}>
                  Ver Detalhes
                </Link>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <Link to={`/dashboard/courses/edit/${course.id}`}>
                  Editar
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm ? 'Nenhum curso encontrado' : 'Nenhum curso cadastrado'}
          </h3>
          <p className="mt-2 text-gray-600">
            {searchTerm 
              ? 'Tente ajustar sua busca para encontrar cursos.'
              : 'Comece criando seu primeiro curso.'
            }
          </p>
          {!searchTerm && (
            <Button className="mt-4" asChild>
              <Link to="/dashboard/courses/new">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Curso
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;

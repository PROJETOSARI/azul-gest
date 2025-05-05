
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-white dark:bg-gray-800 shadow-sm"
      onClick={handleGoBack}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;

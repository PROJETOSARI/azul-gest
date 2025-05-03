
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const PreparingData = () => {
  const { finishPreparation } = useAuth();
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate loading progress
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            // When progress reaches 100%, show the button after a short delay and update message
            setTimeout(() => {
              setShowButton(true);
              setLoadingComplete(true);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-6 rounded-full bg-blue-50">
              <Loader className="h-12 w-12 animate-spin text-brand-blue" />
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-800">
              {loadingComplete ? "Tudo Pronto" : "Quase pronto, estamos preparando os seus dados"}
            </h1>
            
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-right text-sm text-gray-600">{progress}%</p>
            </div>

            {showButton && (
              <Button
                onClick={finishPreparation}
                className="w-full h-12 text-base font-semibold rounded-lg transition-all duration-300 animate-fade-in"
              >
                Iniciar
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PreparingData;


import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="w-full py-4 px-6 border-t text-gray-600 text-sm">
      <div className="container mx-auto space-y-2">
        <p className="text-center">© 2025 OUT Sistemas. Todos os direitos reservados.</p>
        <p className="text-center">Desenvolvido para otimizar a gestão pública com tecnologia e inovação.</p>
        <p className="text-center">CNPJ: 12.345.678/0001-90 | Suporte: suporte@outsistemas.com.br</p>
      </div>
    </footer>
  );
};

export default Footer;

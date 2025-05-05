
import { Button } from "@/components/ui/button";

type MobileMenuButtonProps = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
};

const MobileMenuButton = ({ isMobileMenuOpen, toggleMobileMenu }: MobileMenuButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-white dark:bg-gray-800"
      onClick={toggleMobileMenu}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
        />
      </svg>
    </Button>
  );
};

export default MobileMenuButton;

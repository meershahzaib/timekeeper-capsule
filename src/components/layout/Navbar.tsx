
import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Logo from '@/assets/logo';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-subtle" : "bg-transparent",
        className
      )}
    >
      <div className="container flex justify-between items-center">
        <Logo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</a>
          <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
          <AnimatedButton 
            size="sm" 
            className="bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
          >
            Create a Time Capsule
          </AnimatedButton>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-20",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
          "md:hidden"
        )}
      >
        <nav className="container flex flex-col space-y-6 p-6">
          <a 
            href="#features" 
            className="text-lg font-medium py-2 border-b border-muted"
            onClick={toggleMobileMenu}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-lg font-medium py-2 border-b border-muted"
            onClick={toggleMobileMenu}
          >
            How it Works
          </a>
          <a 
            href="#faq" 
            className="text-lg font-medium py-2 border-b border-muted"
            onClick={toggleMobileMenu}
          >
            FAQ
          </a>
          <AnimatedButton 
            className="mt-4 bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
            onClick={toggleMobileMenu}
          >
            Create a Time Capsule
          </AnimatedButton>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

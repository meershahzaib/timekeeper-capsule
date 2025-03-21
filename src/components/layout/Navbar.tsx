
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import Logo from '@/assets/logo';
import { Menu, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserMenu } from '@/components/layout/UserMenu';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        <Link to="/">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {!user ? (
            <>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/create-capsule" className="text-sm font-medium hover:text-primary transition-colors">Create Capsule</Link>
              <Link to="/my-capsules" className="text-sm font-medium hover:text-primary transition-colors">My Capsules</Link>
              <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">Profile</Link>
              <Link to="/rewards" className="text-sm font-medium hover:text-primary transition-colors">Rewards</Link>
            </>
          )}
          <UserMenu />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <UserMenu />
          <button 
            className="flex items-center justify-center" 
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
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-20",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
          "md:hidden"
        )}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="container flex flex-col space-y-6 p-6">
          {!user ? (
            <>
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
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className="text-lg font-medium py-2 border-b border-muted"
                onClick={toggleMobileMenu}
              >
                Dashboard
              </Link>
              <Link 
                to="/create-capsule" 
                className="text-lg font-medium py-2 border-b border-muted"
                onClick={toggleMobileMenu}
              >
                Create Capsule
              </Link>
              <Link 
                to="/my-capsules" 
                className="text-lg font-medium py-2 border-b border-muted"
                onClick={toggleMobileMenu}
              >
                My Capsules
              </Link>
              <Link 
                to="/profile" 
                className="text-lg font-medium py-2 border-b border-muted"
                onClick={toggleMobileMenu}
              >
                Profile
              </Link>
              <Link 
                to="/rewards" 
                className="text-lg font-medium py-2 border-b border-muted"
                onClick={toggleMobileMenu}
              >
                Rewards
              </Link>
            </>
          )}
          
          {!user && (
            <AnimatedButton 
              className="mt-4 bg-gradient-to-r from-time-blue to-time-purple hover:from-time-blue/90 hover:to-time-purple/90"
              onClick={() => {
                toggleMobileMenu();
                navigate("/create-capsule");
              }}
            >
              Create a Time Capsule
            </AnimatedButton>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

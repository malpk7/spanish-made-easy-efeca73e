import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { href: '/', label: t('nav.home'), action: () => navigate('/') },
    { href: '#packs', label: t('nav.courses'), action: () => handleScrollTo('packs-section') },
    { href: '#features', label: t('nav.about'), action: () => handleScrollTo('features-section') },
    { href: '#contact', label: t('nav.contact'), action: () => handleScrollTo('footer-section') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold text-spanish-red">Español</span>
            <span className="font-display text-2xl font-bold text-spanish-gold">Fácil</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={link.action}
                className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              {t('nav.login')}
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
              {t('nav.register')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={link.action}
                  className="text-foreground/80 hover:text-primary font-medium py-2 transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <LanguageSwitcher />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                    {t('nav.login')}
                  </Button>
                  <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
                    {t('nav.register')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

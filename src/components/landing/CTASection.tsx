import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Spanish flag colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-spanish-red via-spanish-red-dark to-spanish-red" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-spanish-gold/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-spanish-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {language === 'fr' 
              ? 'Prêt à commencer votre aventure hispanophone ?' 
              : 'Ready to start your Spanish-speaking adventure?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
            {language === 'fr'
              ? 'Rejoignez des centaines d\'apprenants et découvrez une nouvelle façon d\'apprendre l\'espagnol.'
              : 'Join hundreds of learners and discover a new way to learn Spanish.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="group">
              {t('nav.register')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="hero-outline" size="lg">
              {t('nav.contact')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

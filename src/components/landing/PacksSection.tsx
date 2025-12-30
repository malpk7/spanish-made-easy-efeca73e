import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface Pack {
  id: string;
  code: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  isActive: boolean;
}

// Mock data for demonstration
const mockPacks: Pack[] = [
  {
    id: '1',
    code: 'PACK-1AZ',
    title: 'Español Básico',
    description: 'Parfait pour les débutants. Apprenez les bases de la langue espagnole avec des exercices pratiques et interactifs.',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-30'),
    registrationDeadline: new Date('2025-01-25'),
    isActive: true,
  },
  {
    id: '2',
    code: 'PACK-2BX',
    title: 'Español Intermedio',
    description: 'Consolidez vos acquis et développez votre vocabulaire. Conversation, grammaire avancée et culture hispanique.',
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-05-15'),
    registrationDeadline: new Date('2025-02-10'),
    isActive: true,
  },
  {
    id: '3',
    code: 'PACK-3CY',
    title: 'Español Avanzado',
    description: 'Maîtrisez l\'espagnol à un niveau professionnel. Débats, présentations et préparation aux certifications.',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-06-01'),
    registrationDeadline: new Date('2025-02-25'),
    isActive: true,
  },
];

const CountdownTimer: React.FC<{ targetDate: Date; label: string }> = ({ targetDate, label }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex gap-2 justify-center">
        {[
          { value: timeLeft.days, label: 'J' },
          { value: timeLeft.hours, label: 'H' },
          { value: timeLeft.minutes, label: 'M' },
          { value: timeLeft.seconds, label: 'S' },
        ].map((item, index) => (
          <div key={index} className="bg-foreground/5 rounded-lg px-2 py-1 min-w-[40px]">
            <span className="font-display text-lg font-bold text-spanish-red">{item.value}</span>
            <span className="text-xs text-muted-foreground ml-0.5">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PackCard: React.FC<{ pack: Pack; index: number }> = ({ pack, index }) => {
  const { t, language } = useLanguage();
  const isRegistrationOpen = new Date() < pack.registrationDeadline;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-spanish-gold/50 hover:shadow-xl transition-all duration-500 animate-fade-in flex flex-col"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Header with gradient */}
      <div className="relative h-32 bg-gradient-to-br from-spanish-red to-spanish-red-dark p-6">
        <div className="absolute top-4 right-4 bg-spanish-gold text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {pack.code}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">
          {pack.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {pack.description}
        </p>

        {/* Dates */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-spanish-gold" />
            <span className="text-muted-foreground">{t('packs.startsOn')}:</span>
            <span className="font-medium">{formatDate(pack.startDate)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-spanish-red" />
            <span className="text-muted-foreground">{t('packs.deadline')}:</span>
            <span className="font-medium">{formatDate(pack.registrationDeadline)}</span>
          </div>
        </div>

        {/* Countdown */}
        {isRegistrationOpen && (
          <div className="mb-6 p-4 bg-muted rounded-xl">
            <CountdownTimer
              targetDate={pack.registrationDeadline}
              label={language === 'fr' ? "Temps restant pour s'inscrire" : 'Time left to register'}
            />
          </div>
        )}

        {/* CTA */}
        <Button
          variant={isRegistrationOpen ? 'hero' : 'outline'}
          className="w-full group/btn"
          disabled={!isRegistrationOpen}
        >
          {isRegistrationOpen ? (
            <>
              {t('packs.enroll')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </>
          ) : (
            t('packs.closed')
          )}
        </Button>
      </div>
    </div>
  );
};

const PacksSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="packs-section" className="py-24 bg-gradient-warm">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-spanish-red">{t('packs.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('packs.subtitle')}
          </p>
        </div>

        {/* Packs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockPacks.map((pack, index) => (
            <PackCard key={pack.id} pack={pack} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PacksSection;

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Clock, Award, Heart } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t('features.native.title'),
      description: t('features.native.desc'),
      color: 'bg-spanish-red/10 text-spanish-red',
    },
    {
      icon: Clock,
      title: t('features.flexible.title'),
      description: t('features.flexible.desc'),
      color: 'bg-spanish-gold/20 text-spanish-gold',
    },
    {
      icon: Award,
      title: t('features.certified.title'),
      description: t('features.certified.desc'),
      color: 'bg-spanish-red/10 text-spanish-red',
    },
    {
      icon: Heart,
      title: t('features.community.title'),
      description: t('features.community.desc'),
      color: 'bg-spanish-gold/20 text-spanish-gold',
    },
  ];

  return (
    <section id="features-section" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">{t('features.title')} </span>
            <span className="text-spanish-gold">{t('features.titleHighlight')}</span>
            <span className="text-foreground"> ?</span>
          </h2>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 bg-background rounded-2xl border border-border hover:border-spanish-gold/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.courses': { fr: 'Nos Cours', en: 'Our Courses' },
  'nav.about': { fr: 'À Propos', en: 'About' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },
  'nav.login': { fr: 'Connexion', en: 'Login' },
  'nav.register': { fr: 'S\'inscrire', en: 'Register' },
  
  // Hero
  'hero.title': { fr: 'Apprenez l\'Espagnol', en: 'Learn Spanish' },
  'hero.titleHighlight': { fr: 'Facilement', en: 'Easily' },
  'hero.subtitle': { fr: 'Découvrez une méthode d\'apprentissage innovante avec des professeurs natifs qualifiés. Rejoignez notre communauté et maîtrisez l\'espagnol à votre rythme.', en: 'Discover an innovative learning method with qualified native teachers. Join our community and master Spanish at your own pace.' },
  'hero.cta': { fr: 'Découvrir nos cours', en: 'Discover our courses' },
  'hero.ctaSecondary': { fr: 'En savoir plus', en: 'Learn more' },
  
  // Features
  'features.title': { fr: 'Pourquoi choisir', en: 'Why choose' },
  'features.titleHighlight': { fr: 'Español Fácil', en: 'Español Fácil' },
  'features.native.title': { fr: 'Professeurs Natifs', en: 'Native Teachers' },
  'features.native.desc': { fr: 'Apprenez avec des enseignants hispanophones qualifiés et expérimentés.', en: 'Learn with qualified and experienced Spanish-speaking teachers.' },
  'features.flexible.title': { fr: 'Horaires Flexibles', en: 'Flexible Schedule' },
  'features.flexible.desc': { fr: 'Des cours adaptés à votre emploi du temps, en ligne ou en présentiel.', en: 'Courses adapted to your schedule, online or in-person.' },
  'features.certified.title': { fr: 'Certification', en: 'Certification' },
  'features.certified.desc': { fr: 'Obtenez une certification reconnue à la fin de votre formation.', en: 'Obtain a recognized certification at the end of your training.' },
  'features.community.title': { fr: 'Communauté', en: 'Community' },
  'features.community.desc': { fr: 'Rejoignez une communauté d\'apprenants passionnés par la langue espagnole.', en: 'Join a community of learners passionate about the Spanish language.' },
  
  // Packs
  'packs.title': { fr: 'Nos Packs de Formation', en: 'Our Training Packs' },
  'packs.subtitle': { fr: 'Choisissez le pack qui correspond à vos besoins et commencez votre aventure hispanophone dès aujourd\'hui.', en: 'Choose the pack that suits your needs and start your Spanish-speaking adventure today.' },
  'packs.startsOn': { fr: 'Début le', en: 'Starts on' },
  'packs.endsOn': { fr: 'Fin le', en: 'Ends on' },
  'packs.deadline': { fr: 'Inscription jusqu\'au', en: 'Register until' },
  'packs.enroll': { fr: 'S\'inscrire', en: 'Enroll Now' },
  'packs.viewDetails': { fr: 'Voir détails', en: 'View Details' },
  'packs.closed': { fr: 'Inscriptions fermées', en: 'Registration closed' },
  
  // Footer
  'footer.description': { fr: 'Votre partenaire de confiance pour apprendre l\'espagnol. Une approche pédagogique moderne et personnalisée.', en: 'Your trusted partner for learning Spanish. A modern and personalized pedagogical approach.' },
  'footer.quickLinks': { fr: 'Liens Rapides', en: 'Quick Links' },
  'footer.contact': { fr: 'Contact', en: 'Contact' },
  'footer.followUs': { fr: 'Suivez-nous', en: 'Follow Us' },
  'footer.rights': { fr: 'Tous droits réservés.', en: 'All rights reserved.' },
  
  // Auth
  'auth.email': { fr: 'Email', en: 'Email' },
  'auth.password': { fr: 'Mot de passe', en: 'Password' },
  'auth.login': { fr: 'Se connecter', en: 'Login' },
  'auth.register': { fr: 'Créer un compte', en: 'Create account' },
  'auth.noAccount': { fr: 'Pas encore de compte ?', en: 'No account yet?' },
  'auth.hasAccount': { fr: 'Déjà un compte ?', en: 'Already have an account?' },
  
  // Common
  'common.loading': { fr: 'Chargement...', en: 'Loading...' },
  'common.error': { fr: 'Erreur', en: 'Error' },
  'common.success': { fr: 'Succès', en: 'Success' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.save': { fr: 'Enregistrer', en: 'Save' },
  'common.delete': { fr: 'Supprimer', en: 'Delete' },
  'common.edit': { fr: 'Modifier', en: 'Edit' },
  'common.view': { fr: 'Voir', en: 'View' },
  
  // Payment statuses
  'status.pending': { fr: 'En attente', en: 'Pending' },
  'status.validated': { fr: 'Validé', en: 'Validated' },
  'status.rejected': { fr: 'Refusé', en: 'Rejected' },
  
  // Course access
  'course.accessButton': { fr: 'Accéder au cours', en: 'Access Course' },
  'course.startsAt': { fr: 'Le cours commencera le', en: 'The course will start on' },
  'course.at': { fr: 'à', en: 'at' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('espanol-facil-lang');
      return (saved as Language) || 'fr';
    }
    return 'fr';
  });

  useEffect(() => {
    localStorage.setItem('espanol-facil-lang', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

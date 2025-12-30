// Mock data for the MVP - will be replaced with database later

export type AppRole = 'admin' | 'professor' | 'student';
export type UserStatus = 'active' | 'inactive';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  role: AppRole;
  code: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  date_of_birth: string;
  profession?: string;
  date_inscription: string;
  status: UserStatus;
}

export interface Pack {
  id: string;
  code: string;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  date_deadline: string;
  course_link: string;
  media_type: 'video' | 'image';
  media_link: string;
  status: 'active' | 'inactive';
  assigned_professors: string[];
}

export interface Payment {
  id: string;
  student_id: string;
  pack_id: string;
  proof_image: string;
  status: 'pending' | 'validated' | 'rejected';
  date_payment: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  pack_id: string;
  payment_id: string;
}

// Demo credentials for each role
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@espanolfacil.com', password: 'admin123' },
  professor: { email: 'prof@espanolfacil.com', password: 'prof123' },
  student: { email: 'student@espanolfacil.com', password: 'student123' },
};

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 'admin-1',
    email: 'admin@espanolfacil.com',
    password: 'admin123',
    role: 'admin',
    code: '00001',
    first_name: 'Admin',
    last_name: 'Principal',
    phone: '+212 600 000 001',
    city: 'Casablanca',
    date_of_birth: '1985-01-15',
    date_inscription: '2024-01-01',
    status: 'active',
  },
  {
    id: 'prof-1',
    email: 'prof@espanolfacil.com',
    password: 'prof123',
    role: 'professor',
    code: '10001',
    first_name: 'María',
    last_name: 'García',
    phone: '+212 600 000 002',
    city: 'Rabat',
    date_of_birth: '1990-05-20',
    date_inscription: '2024-01-15',
    status: 'active',
  },
  {
    id: 'prof-2',
    email: 'prof2@espanolfacil.com',
    password: 'prof123',
    role: 'professor',
    code: '10002',
    first_name: 'Carlos',
    last_name: 'Martinez',
    phone: '+212 600 000 003',
    city: 'Tanger',
    date_of_birth: '1988-08-10',
    date_inscription: '2024-02-01',
    status: 'active',
  },
  {
    id: 'student-1',
    email: 'student@espanolfacil.com',
    password: 'student123',
    role: 'student',
    code: '20001',
    first_name: 'Ahmed',
    last_name: 'Benali',
    phone: '+212 600 000 004',
    city: 'Marrakech',
    date_of_birth: '1995-03-25',
    profession: 'Ingénieur',
    date_inscription: '2024-03-01',
    status: 'active',
  },
  {
    id: 'student-2',
    email: 'student2@espanolfacil.com',
    password: 'student123',
    role: 'student',
    code: '20002',
    first_name: 'Fatima',
    last_name: 'Zahra',
    phone: '+212 600 000 005',
    city: 'Fès',
    date_of_birth: '1998-07-12',
    profession: 'Étudiante',
    date_inscription: '2024-03-05',
    status: 'active',
  },
  {
    id: 'student-3',
    email: 'student3@espanolfacil.com',
    password: 'student123',
    role: 'student',
    code: '20003',
    first_name: 'Youssef',
    last_name: 'El Amrani',
    phone: '+212 600 000 006',
    city: 'Agadir',
    date_of_birth: '1992-11-30',
    profession: 'Commercial',
    date_inscription: '2024-03-10',
    status: 'inactive',
  },
];

// Mock Packs
export const mockPacks: Pack[] = [
  {
    id: 'pack-1',
    code: 'PACK-1AZ',
    title: 'Español Básico A1',
    description: 'Cours d\'initiation à la langue espagnole. Apprenez les bases de la grammaire, du vocabulaire quotidien et de la prononciation.',
    date_start: '2025-02-01',
    date_end: '2025-04-30',
    date_deadline: '2025-01-25',
    course_link: 'https://meet.google.com/abc-defg-hij',
    media_type: 'video',
    media_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'active',
    assigned_professors: ['prof-1'],
  },
  {
    id: 'pack-2',
    code: 'PACK-2BX',
    title: 'Español Intermedio B1',
    description: 'Perfectionnez votre espagnol avec des cours de niveau intermédiaire. Conversations, grammaire avancée et culture hispanique.',
    date_start: '2025-02-15',
    date_end: '2025-05-15',
    date_deadline: '2025-02-10',
    course_link: 'https://teams.microsoft.com/l/meetup-join/xyz',
    media_type: 'image',
    media_link: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800',
    status: 'active',
    assigned_professors: ['prof-1', 'prof-2'],
  },
  {
    id: 'pack-3',
    code: 'PACK-3CY',
    title: 'Español Avanzado C1',
    description: 'Niveau avancé pour maîtriser parfaitement l\'espagnol. Littérature, expressions idiomatiques et préparation DELE.',
    date_start: '2025-03-01',
    date_end: '2025-06-30',
    date_deadline: '2025-02-25',
    course_link: 'https://zoom.us/j/1234567890',
    media_type: 'video',
    media_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'active',
    assigned_professors: ['prof-2'],
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    student_id: 'student-1',
    pack_id: 'pack-1',
    proof_image: 'https://via.placeholder.com/400x300?text=Payment+Proof+1',
    status: 'validated',
    date_payment: '2024-12-20',
  },
  {
    id: 'payment-2',
    student_id: 'student-2',
    pack_id: 'pack-1',
    proof_image: 'https://via.placeholder.com/400x300?text=Payment+Proof+2',
    status: 'pending',
    date_payment: '2024-12-25',
  },
  {
    id: 'payment-3',
    student_id: 'student-3',
    pack_id: 'pack-2',
    proof_image: 'https://via.placeholder.com/400x300?text=Payment+Proof+3',
    status: 'rejected',
    date_payment: '2024-12-28',
  },
  {
    id: 'payment-4',
    student_id: 'student-1',
    pack_id: 'pack-2',
    proof_image: 'https://via.placeholder.com/400x300?text=Payment+Proof+4',
    status: 'validated',
    date_payment: '2024-12-22',
  },
];

// Mock Enrollments (only for validated payments)
export const mockEnrollments: Enrollment[] = [
  {
    id: 'enroll-1',
    student_id: 'student-1',
    pack_id: 'pack-1',
    payment_id: 'payment-1',
  },
  {
    id: 'enroll-2',
    student_id: 'student-1',
    pack_id: 'pack-2',
    payment_id: 'payment-4',
  },
];

// Moroccan cities for dropdown
export const moroccanCities = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kenitra',
  'Tétouan',
  'Salé',
  'Nador',
  'Mohammedia',
  'El Jadida',
  'Khouribga',
  'Béni Mellal',
  'Safi',
  'Khémisset',
  'Taza',
  'Essaouira',
];

// Bank transfer information
export const bankInfo = {
  bankName: 'Banque Populaire',
  accountHolder: 'Español Fácil SARL',
  rib: '101 780 0001234567890123 45',
  swift: 'BCPOMAMC',
  motif: 'INSCRIPTION-{PACK_CODE}-{STUDENT_CODE}',
};

// Tipos TypeScript para Orosi

export interface User {
  _id: string;
  tokenIdentifier: string;
  name: string;
  email: string;
  role: string;
}

export interface Season {
  _id: string;
  name: string;
  isActive: boolean;
  registrationStart: string;
  registrationEnd: string;
  groupStart: string;
  groupEnd: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface District {
  _id: string;
  name: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  seasonId: string;
  categoryId: string;
  districtId: string;
  day: string;
  time: string;
  modality: string;
  address?: string;
  updatedAt?: number;
  
  // Datos relacionados
  season?: Season;
  category?: Category;
  district?: District;
  registrationsCount?: number;
}

export interface Registration {
  _id: string;
  groupId: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  timestamp: number;
  
  // Datos relacionados
  group?: Group;
}

// Tipos para formularios
export interface CreateGroupForm {
  name: string;
  description: string;
  capacity: number;
  seasonId: string;
  categoryId: string;
  districtId: string;
  day: string;
  time: string;
  modality: string;
  address?: string;
}

export interface RegistrationForm {
  groupId: string;
  fullName: string;
  email: string;
  phone: string;
}

// Tipos para componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

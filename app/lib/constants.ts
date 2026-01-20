// Constantes de la aplicación Orosi

export const APP_CONFIG = {
  name: "Orosi",
  description: "Sistema de Gestión de Grupos Pequeños",
  version: "1.0.0",
} as const;

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  GROUPS: "/groups",
  REGISTRATIONS: "/registrations",
} as const;

export const GROUP_MODALITIES = {
  PRESENCIAL: "presencial",
  VIRTUAL: "virtual",
  HIBRIDO: "hibrido",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  LEADER: "leader", 
  MEMBER: "member",
} as const;

export const DAYS_OF_WEEK = [
  "Lunes",
  "Martes", 
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

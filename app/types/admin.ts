// ============================================
// Admin Panel Types
// ============================================

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DataTableWrapperProps {
  children: React.ReactNode;
  title?: string;
  toolbar?: React.ReactNode;
}

// ============================================
// Temporadas Types
// ============================================

export interface Temporada {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activa' | 'inactiva' | 'finalizada';
  totalGrupos: number;
}

// ============================================
// Grupos Types
// ============================================

export interface Grupo {
  id: string;
  nombre: string;
  lider: string;
  distrito: string;
  categoria: string;
  miembros: number;
  estado: 'activo' | 'inactivo';
}

export interface GroupsToolbarProps {
  onSearch?: (query: string) => void;
  onDistritoChange?: (distrito: string) => void;
  onCategoriaChange?: (categoria: string) => void;
}

// ============================================
// Configuración Types
// ============================================

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  color?: string;
  activa: boolean;
}

export interface Distrito {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

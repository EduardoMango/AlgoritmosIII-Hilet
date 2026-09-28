import type { ReactNode } from 'react';

export interface IndicadorEstadoProps {
  estado: string;
  tipo?: 'activo' | 'inactivo' | 'alerta';
}

export interface BotonAccionProps {
  texto?: string;
  variante?: 'primario' | 'secundario' | 'exito' | 'peligro';
  deshabilitado?: boolean;
  onClick?: () => void;
}

export interface TarjetaProductoProps {
  id: number;
  titulo: string;
  precio: number;
  disponible?: boolean;
}

export interface PanelContenedorProps {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
}

export interface ComparativaItem {
  atributo: string;
  enfoqueImperativo: string;
  enfoqueDeclarativo: string;
  explicacion: string;
}


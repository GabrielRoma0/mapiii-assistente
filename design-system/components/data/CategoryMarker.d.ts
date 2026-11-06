export type CategoryKey = 'sem_rampa_ou_degrau' | 'obstaculo_no_caminho' | 'calcada_quebrada' | 'calcada_estreita' | 'sem_problema';
export declare const CATEGORIES: Record<CategoryKey, { label: string; short: string; icon: string; shapeName: string; tone: string; shape: string; iy: number }>;
/** Marcador de categoria para mapa, tags e listas. */
export interface CategoryMarkerProps {
  category: CategoryKey;
  /** px. Mapa 40; tags 22–26. */
  size?: number;
  title?: string;
}
export declare function CategoryMarker(props: CategoryMarkerProps): JSX.Element;

/** Tag de categoria: marcador + rótulo sobre o tom 100 da categoria. */
export interface CategoryTagProps {
  category: import('./CategoryMarker').CategoryKey;
  size?: 'sm' | 'md';
  /** Usa o rótulo curto (ex.: "Quebrada"). */
  short?: boolean;
}
export declare function CategoryTag(props: CategoryTagProps): JSX.Element;

/** Filtro em pílula de 48 px para o mapa. Selecionado = fundo invertido. */
export interface FilterChipProps {
  label: string;
  category?: import('../data/CategoryMarker').CategoryKey;
  selected?: boolean;
  onClick?: () => void;
}
export declare function FilterChip(props: FilterChipProps): JSX.Element;

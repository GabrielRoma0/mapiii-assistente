/**
 * Cartão de ocorrência com foto, categoria, endereço e gravidade.
 * @startingPoint section="Componentes" subtitle="Cartão de ocorrência com foto" viewport="700x340"
 */
export interface OccurrenceCardProps {
  category: import('./CategoryMarker').CategoryKey;
  address: string;
  /** Ex.: "Consolação · há 2 dias · 120 m" */
  meta?: string;
  severity?: 0 | 1 | 2 | 3;
  /** URL da foto. Sem foto mostra placeholder listrado. */
  photo?: string;
  /** Mostra o selo "IA tem dúvida – revisar". */
  needsReview?: boolean;
  onClick?: () => void;
}
export declare function OccurrenceCard(props: OccurrenceCardProps): JSX.Element;

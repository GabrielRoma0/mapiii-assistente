/**
 * Selo de status com ícone + texto (nunca só cor).
 * @startingPoint section="Componentes" subtitle="Selo IA tem dúvida, sucesso e erro" viewport="700x200"
 */
export interface BadgeProps {
  /** review: "IA tem dúvida – revisar" (âmbar, com borda) · success · error · neutral. */
  tone?: 'review' | 'success' | 'error' | 'neutral';
  /** Texto. Em review o padrão é "IA tem dúvida – revisar". */
  children?: React.ReactNode;
  size?: 'sm' | 'md';
}
export declare function Badge(props: BadgeProps): JSX.Element;

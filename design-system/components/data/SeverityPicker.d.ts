/**
 * Seletor de gravidade 0–3: número + barras + rótulo.
 * @startingPoint section="Componentes" subtitle="Seletor de gravidade 0 a 3" viewport="700x200"
 */
export interface SeverityPickerProps {
  value?: 0 | 1 | 2 | 3;
  onChange?: (n: 0 | 1 | 2 | 3) => void;
  /** Versão de 64 px sem ícone, para telas de detalhe. */
  compact?: boolean;
  label?: string;
}
export declare function SeverityPicker(props: SeverityPickerProps): JSX.Element;

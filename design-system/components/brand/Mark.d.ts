/** Símbolo do Mapiii (pinha-pino com piso tátil). */
export interface MarkProps {
  /** px. Mínimo 16; até 34 px os relevos ficam maiores automaticamente. */
  size?: number;
  /** Cor da pinha. Padrão Dusty Grape. */
  color?: string;
  /** Cor dos relevos vazados — use a cor do fundo. */
  cut?: string;
  title?: string;
}
export declare function Mark(props: MarkProps): JSX.Element;

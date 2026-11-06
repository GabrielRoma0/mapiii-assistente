/**
 * Botão do Mapiii. Alvo mínimo 48 px; ações principais 56–64 px.
 * @startingPoint section="Componentes" subtitle="Botões primário, secundário, texto e perigo" viewport="700x380"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** primary: Space Indigo cheio · secondary: contorno 2 px · text: link sublinhado · danger: coral 700. */
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  /** md 48 px · lg 56 px (padrão) · xl 64 px (enviar foto, registrar). */
  size?: 'md' | 'lg' | 'xl';
  icon?: import('../icons/Icon').IconName;
  fullWidth?: boolean;
  pill?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;

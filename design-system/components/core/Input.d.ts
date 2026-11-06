/** Campo de texto com rótulo visível sempre acima. Altura mínima 56 px. */
export interface InputProps {
  label?: string;
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean;
  hint?: string;
  /** Mensagem de erro — também troca a borda para coral 700 e prefixa ✕. */
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
  id?: string;
}
export declare function Input(props: InputProps): JSX.Element;

/** Botão só com ícone. Sempre exige label (nome acessível). Mínimo 48 × 48 px. */
export interface IconButtonProps {
  icon: import('../icons/Icon').IconName;
  /** Nome acessível, obrigatório. */
  label: string;
  size?: number;
  /** surface: fundo branco · outline: contorno 2 px · tint: lilás claro redondo (ex.: filtro na busca). */
  variant?: 'surface' | 'outline' | 'tint';
  onClick?: () => void;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;

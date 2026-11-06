/** Opção marcável em formato de linha grande (48 px). Selecionado: borda 3 px + caixa cheia + check. */
export interface CheckboxProps {
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;

/** Barra de abas inferior do app (3–4 itens), sempre com ícone + rótulo. */
export interface TabBarProps {
  items: { id: string; label: string; icon: import('../icons/Icon').IconName }[];
  value: string;
  onChange?: (id: string) => void;
}
export declare function TabBar(props: TabBarProps): JSX.Element;

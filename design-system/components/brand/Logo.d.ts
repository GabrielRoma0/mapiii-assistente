/**
 * Logo horizontal do Mapiii.
 * @startingPoint section="Marca" subtitle="Logo horizontal em cor, mono e invertida" viewport="700x260"
 */
export interface LogoProps {
  /** Tamanho da fonte em px (altura do "a" ≈ 0,48 × size). Mínimo 24. */
  size?: number;
  /** color: sobre Seashell/branco · mono: impressão 1 cor · inverse: sobre Space Indigo. */
  tone?: 'color' | 'mono' | 'inverse';
  /** Cor dos relevos da pinha — padrão é o fundo esperado do tom. */
  cut?: string;
  title?: string;
}
export declare function Logo(props: LogoProps): JSX.Element;

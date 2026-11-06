export type IconName = 'degrau' | 'obstaculo' | 'quebrada' | 'estreita' | 'ok' | 'camera' | 'local' | 'filtro' | 'g0' | 'g1' | 'g2' | 'g3' | 'enviar' | 'revisar' | 'mapa' | 'download' | 'voltar' | 'fechar' | 'mais' | 'check' | 'usuario' | 'lista' | 'ia' | 'busca' | 'grafico' | 'carro' | 'cacamba' | 'galeria' | 'subida' | 'descida'
  // v2.0 (assistente de direitos)
  | 'plano' | 'documento' | 'onde_ir' | 'prazo' | 'escudo_check' | 'golpe' | 'link' | 'passos' | 'conversa' | 'calendario' | 'alerta' | 'duvida';
/** Ícone de traço 24 px do Mapiii. */
export interface IconProps {
  name: IconName;
  /** px. Padrão 24. Use 20–32 no app. */
  size?: number;
  /** Cor do traço. Padrão currentColor. */
  color?: string;
  strokeWidth?: number;
  /** Nome acessível. Sem title o ícone é decorativo (aria-hidden). */
  title?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;

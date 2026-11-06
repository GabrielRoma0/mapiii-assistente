// Mapi, a pinha. Porte de design-system/MapiPersonagem.dc.html (v2.0).
// A tabela POSES e o desenho do SVG foram copiados sem mudança: não redesenhar aqui.
// Não há animações no design system: a pose é sempre estática (vale também com prefers-reduced-motion).

type Pose = {
  body: string;
  label: string;
  eyes: 'open' | 'closed';
  look?: number;
  up?: boolean;
  big?: boolean;
  brows?: string;
  mouth?: string;
  arms: string;
  h: [number, number, number, number];
  alert?: boolean;
  umbrella?: boolean;
  festa?: boolean;
  heart?: boolean;
  waves?: boolean;
  lupa?: boolean;
  spark?: boolean;
  shield?: boolean;
  question?: boolean;
};

const POSES: Record<string, Pose> = {
  bom: { body: '#DDEBE0', label: 'Mapi feliz: trecho bom', eyes: 'open', mouth: 'M62 84Q70 92 78 84', arms: 'M38 84Q28 92 27 101M102 78Q114 68 116 54', h: [27, 104, 116, 50] },
  atencao: { body: '#F7EAD2', label: 'Mapi atento: trecho com atenção', eyes: 'open', look: 3, brows: 'M76 61Q82 56 88 60', mouth: 'M61 88q3-3 6 0t6 0t6 0', arms: 'M38 84Q28 92 27 101M102 82Q114 76 112 64', h: [27, 104, 111, 61], alert: true },
  evite: { body: '#F6E2DD', label: 'Mapi preocupado: evite este trecho', eyes: 'open', brows: 'M51 64L63 60M77 60L89 64', mouth: 'M63 90Q70 83 77 90', arms: 'M38 84Q56 92 82 102M102 84Q84 92 58 102', h: [84, 103, 56, 103] },
  chuva: { body: '#E6DCE0', label: 'Mapi com guarda-chuva: chuva prevista', eyes: 'open', up: true, mouth: 'M64 85Q70 90 76 85', arms: 'M38 84Q28 92 27 101M103 82Q100 74 92 72', h: [27, 104, 91, 71], umbrella: true },
  comemorando: { body: '#C9ADA7', label: 'Mapi comemorando: você chegou', eyes: 'closed', big: true, arms: 'M38 78Q24 66 22 51M102 78Q116 66 118 51', h: [22, 48, 118, 48], festa: true },
  agradecendo: { body: '#F4E0E5', label: 'Mapi agradecendo: aviso enviado', eyes: 'closed', mouth: 'M62 84Q70 92 78 84', arms: 'M38 86Q44 100 59 103M102 86Q96 100 81 103', h: [59, 103, 81, 103], heart: true },
  ouvindo: { body: '#DDEDEA', label: 'Mapi ouvindo', eyes: 'open', brows: 'M52 62Q58 59 64 62M76 62Q82 59 88 62', mouth: 'M65 86Q70 89 75 86', arms: 'M38 84Q28 92 27 101M102 80Q112 74 108 64', h: [27, 104, 107, 62], waves: true },
  procurando: { body: '#E3E8F2', label: 'Mapi procurando', eyes: 'open', look: 3, brows: 'M76 61Q82 58 88 61', mouth: 'M65 87H75', arms: 'M38 84Q28 92 27 101M102 84Q110 84 111 76', h: [27, 104, 111, 76], lupa: true },
  achei: { body: '#E9E3F2', label: 'Mapi achou uma resposta', eyes: 'open', up: true, big: true, arms: 'M38 84Q28 92 27 101M102 80Q114 72 118 58', h: [27, 104, 118, 55], spark: true },
  verificado: { body: '#DDEBE0', label: 'Mapi com fonte verificada', eyes: 'open', mouth: 'M62 84Q70 92 78 84', arms: 'M38 84Q28 92 27 101M102 84Q112 88 114 96', h: [27, 104, 114, 97], shield: true },
  duvida: { body: '#E8DDD7', label: 'Mapi com dúvida: não encontrou', eyes: 'open', up: true, look: -2, brows: 'M51 62L63 60M77 58Q83 55 89 59', mouth: 'M63 88q3.5-2.5 7 0t7 0', arms: 'M38 84Q28 92 27 101M102 80Q114 66 101 50', h: [27, 104, 100, 48], question: true },
  recusa: { body: '#F6E4D6', label: 'Mapi recusando com gentileza', eyes: 'open', brows: 'M52 62Q58 60 64 63M76 63Q82 60 88 62', mouth: 'M64 85Q70 89 76 85', arms: 'M38 86Q46 98 58 100M102 82Q116 80 118 68', h: [58, 100, 118, 64] },
  esperando: { body: '#E6DCE0', label: 'Mapi esperando', eyes: 'open', mouth: 'M64 85Q70 90 76 85', arms: 'M38 86Q44 100 59 103M102 86Q96 100 81 103', h: [59, 103, 81, 103] }
};

// Estados do assistente → pose e rótulo ("Mapiii Mapa dos Direitos.dc.html", seção 03).
// Olá e Acolhimento não têm pose própria: o design usa "bom" e "agradecendo".
export const ESTADOS_MAPI = {
  ola: { pose: 'bom', rotulo: 'Olá' },
  ouvindo: { pose: 'ouvindo', rotulo: 'Ouvindo' },
  procurando: { pose: 'procurando', rotulo: 'Procurando' },
  achei: { pose: 'achei', rotulo: 'Achei' },
  verificado: { pose: 'verificado', rotulo: 'Verificado' },
  duvida: { pose: 'duvida', rotulo: 'Dúvida honesta' },
  atencao: { pose: 'atencao', rotulo: 'Atenção' },
  recusa: { pose: 'recusa', rotulo: 'Recusa gentil' },
  acolhimento: { pose: 'agradecendo', rotulo: 'Acolhimento' },
  comemorando: { pose: 'comemorando', rotulo: 'Comemorando' },
  esperando: { pose: 'esperando', rotulo: 'Esperando' }
} as const;

export type EstadoMapi = keyof typeof ESTADOS_MAPI;

// Estado desconhecido cai na pose neutra (Olá).
export function estadoMapi(estado: string) {
  return ESTADOS_MAPI[estado as EstadoMapi] ?? ESTADOS_MAPI.ola;
}

// Monta o SVG como texto, igual ao template do design system. Só usa valores da tabela POSES acima.
export function personagemSVG(estado: string, size = 64): string {
  const s = POSES[estadoMapi(estado).pose];
  const on = (b: unknown) => (b ? 'inline' : 'none');
  const lk = s.look || 0;
  const ey = s.up ? 69 : 72;
  const w = size;
  const h = Math.round((size * 170) / 140);
  const lx = 58 + lk, rx = 82 + lk, lhx = 59.8 + lk, rhx = 83.8 + lk, hy = ey - 1.8;
  const [h1x, h1y, h2x, h2y] = s.h;

  return `<svg viewBox="0 -20 140 170" width="${w}" height="${h}" aria-hidden="true" focusable="false" style="display:block;overflow:visible;flex:none">
<g display="${on(s.umbrella)}"><path d="M28 40c0 0 -5 6 -5 9a5 5 0 0 0 10 0c0-3-5-9-5-9z" fill="#5FA8A0" stroke="#22223B" style="stroke-width:2"></path><path d="M14 74c0 0 -4 5 -4 7.5a4 4 0 0 0 8 0c0-2.5-4-7.5-4-7.5z" fill="#5FA8A0" stroke="#22223B" style="stroke-width:2"></path><path d="M128 30c0 0 -4 5 -4 7.5a4 4 0 0 0 8 0c0-2.5-4-7.5-4-7.5z" fill="#5FA8A0" stroke="#22223B" style="stroke-width:2"></path></g>
<g display="${on(s.festa)}"><rect x="30" y="8" width="8" height="8" rx="1.5" fill="#D9A441" stroke="#22223B" transform="rotate(20 34 12)" style="stroke-width:2"></rect><circle cx="108" cy="6" r="4.5" fill="#5FA8A0" stroke="#22223B" style="stroke-width:2"></circle><circle cx="12" cy="28" r="4" fill="#CF7A93" stroke="#22223B" style="stroke-width:2"></circle><rect x="122" y="24" width="8" height="8" rx="1.5" fill="#CF7A93" stroke="#22223B" transform="rotate(-18 126 28)" style="stroke-width:2"></rect><circle cx="58" cy="-6" r="3.5" fill="#4A4E69"></circle><rect x="84" y="-12" width="7" height="7" rx="1.5" fill="#D9A441" stroke="#22223B" transform="rotate(35 87 -8)" style="stroke-width:2"></rect></g>
<path d="M60 108V132M80 108V132" fill="none" stroke="#22223B" style="stroke-width:5;stroke-linecap:round"></path>
<ellipse cx="56" cy="134" rx="8" ry="4.5" fill="#22223B"></ellipse><ellipse cx="84" cy="134" rx="8" ry="4.5" fill="#22223B"></ellipse>
<path d="M70 39V28" fill="none" stroke="#22223B" style="stroke-width:4;stroke-linecap:round"></path>
<path d="M70 30C74 20 86 18 92 22C88 31 78 34 70 30Z" fill="#36704A" stroke="#22223B" style="stroke-width:3;stroke-linejoin:round"></path>
<path d="M70 30C66 20 54 18 48 22C52 31 62 34 70 30Z" fill="#36704A" stroke="#22223B" style="stroke-width:3;stroke-linejoin:round"></path>
<path d="M70 126C56 114 36 98 36 72A34 34 0 0 1 104 72C104 98 84 114 70 126Z" fill="${s.body}" stroke="#22223B" style="stroke-width:4;stroke-linejoin:round"></path>
<path d="M89 50C94 54 97 60 97 66" fill="none" stroke="#FFFFFF" style="stroke-width:4;stroke-linecap:round"></path>
<ellipse cx="49" cy="84" rx="5.5" ry="3.2" fill="#CF7A93" opacity="0.6"></ellipse><ellipse cx="91" cy="84" rx="5.5" ry="3.2" fill="#CF7A93" opacity="0.6"></ellipse>
<g display="${on(s.eyes === 'open')}"><circle cx="${lx}" cy="${ey}" r="5.5" fill="#22223B"></circle><circle cx="${rx}" cy="${ey}" r="5.5" fill="#22223B"></circle><circle cx="${lhx}" cy="${hy}" r="1.8" fill="#FFFFFF"></circle><circle cx="${rhx}" cy="${hy}" r="1.8" fill="#FFFFFF"></circle></g>
<g display="${on(s.eyes === 'closed')}"><path d="M52 74Q58 66 64 74M76 74Q82 66 88 74" fill="none" stroke="#22223B" style="stroke-width:3.5;stroke-linecap:round"></path></g>
<g display="${on(s.brows)}"><path d="${s.brows || 'M0 0'}" fill="none" stroke="#22223B" style="stroke-width:3;stroke-linecap:round"></path></g>
<g display="${on(s.mouth && !s.big)}"><path d="${s.mouth || 'M0 0'}" fill="none" stroke="#22223B" style="stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round"></path></g>
<g display="${on(s.big)}"><path d="M60 83Q70 100 80 83Z" fill="#22223B" stroke="#22223B" style="stroke-width:3;stroke-linejoin:round"></path><path d="M65 91Q70 95 75 91" fill="none" stroke="#CF7A93" style="stroke-width:3;stroke-linecap:round"></path></g>
<g display="${on(s.heart)}"><path d="M70 116C57 108 55 99 61 95.5C65.5 93 69 95.5 70 98.5C71 95.5 74.5 93 79 95.5C85 99 83 108 70 116Z" fill="#CF7A93" stroke="#22223B" style="stroke-width:3;stroke-linejoin:round"></path></g>
<g display="${on(s.umbrella)}"><path d="M91 12V76q0 6-5.5 6" fill="none" stroke="#22223B" style="stroke-width:3.5;stroke-linecap:round"></path><path d="M42 12A49 28 0 0 1 140 12Q131.8 6 123.7 12Q115.5 6 107.3 12Q99 6 91 12Q82.8 6 74.6 12Q66.4 6 58.2 12Q50 6 42 12Z" fill="#4A4E69" stroke="#22223B" style="stroke-width:3;stroke-linejoin:round"></path><path d="M91 -16V-20" fill="none" stroke="#22223B" style="stroke-width:3.5;stroke-linecap:round"></path></g>
<g display="${on(s.alert)}"><circle cx="24" cy="40" r="13" fill="#F7EAD2" stroke="#7A5410" style="stroke-width:3"></circle><path d="M24 33V42" fill="none" stroke="#634410" style="stroke-width:3.5;stroke-linecap:round"></path><circle cx="24" cy="47.5" r="2.2" fill="#634410"></circle></g>
<g display="${on(s.waves)}"><path d="M117 56q5 6 0 12M123 51q8 11 0 22" fill="none" stroke="#4A4E69" style="stroke-width:3;stroke-linecap:round"></path></g>
<g display="${on(s.lupa)}"><path d="M115 67L111 76" fill="none" stroke="#22223B" style="stroke-width:5;stroke-linecap:round"></path><circle cx="120" cy="57" r="11" fill="#FFFFFF" stroke="#22223B" style="stroke-width:3.5"></circle><path d="M114 53q3-4 7-3" fill="none" stroke="#9A8C98" style="stroke-width:2.5;stroke-linecap:round"></path></g>
<g display="${on(s.spark)}"><path d="M124 30l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z" fill="#D9A441" stroke="#22223B" style="stroke-width:2;stroke-linejoin:round"></path></g>
<g display="${on(s.shield)}"><path d="M118 64l13 5v9c0 8-5.5 13.5-13 16-7.5-2.5-13-8-13-16v-9z" fill="#FFFFFF" stroke="#36704A" style="stroke-width:3;stroke-linejoin:round"></path><path d="M112.5 79l4 4 7.5-7.5" fill="none" stroke="#36704A" style="stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round"></path></g>
<g display="${on(s.question)}"><path d="M114 30a6.5 6.5 0 1 1 9 6c-1.8.9-2.3 2-2.3 3.8" fill="none" stroke="#4A4E69" style="stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round"></path><circle cx="120.7" cy="47" r="2.4" fill="#4A4E69"></circle></g>
<path d="${s.arms}" fill="none" stroke="#22223B" style="stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round"></path>
<circle cx="${h1x}" cy="${h1y}" r="5.5" fill="#FFFFFF" stroke="#22223B" style="stroke-width:3"></circle>
<circle cx="${h2x}" cy="${h2y}" r="5.5" fill="#FFFFFF" stroke="#22223B" style="stroke-width:3"></circle>
</svg>`;
}

/** Desenho decorativo: quem usa mostra o rótulo "Mapi · Estado" em texto ao lado. */
export function MapiPersonagem({ estado, size = 64 }: { estado: EstadoMapi; size?: number }) {
  return (
    <span aria-hidden="true" style={{ display: 'block', flex: 'none' }} dangerouslySetInnerHTML={{ __html: personagemSVG(estado, size) }} />
  );
}

// QR code próprio, sem biblioteca externa (regra do projeto). Usado no "Mostre ao motorista":
// o QR leva ao texto oficial da lei. Gera só o necessário: modo byte (UTF-8), correção nível M, versões 1 a 10
// (até 213 bytes, suficiente para um link). Segue a norma ISO/IEC 18004.

/** Por versão (1 a 10), nível M: total de codewords, blocos e codewords de correção por bloco. */
const VERSOES: Record<number, { total: number; blocos: number; ecPorBloco: number }> = {
  1: { total: 26, blocos: 1, ecPorBloco: 10 },
  2: { total: 44, blocos: 1, ecPorBloco: 16 },
  3: { total: 70, blocos: 1, ecPorBloco: 26 },
  4: { total: 100, blocos: 2, ecPorBloco: 18 },
  5: { total: 134, blocos: 2, ecPorBloco: 24 },
  6: { total: 172, blocos: 4, ecPorBloco: 16 },
  7: { total: 196, blocos: 4, ecPorBloco: 18 },
  8: { total: 242, blocos: 4, ecPorBloco: 22 },
  9: { total: 292, blocos: 5, ecPorBloco: 22 },
  10: { total: 346, blocos: 5, ecPorBloco: 26 }
};

/** Centros dos padrões de alinhamento por versão. */
const ALINHAMENTO: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50]
};

const capacidadeDados = (v: number) => VERSOES[v].total - VERSOES[v].blocos * VERSOES[v].ecPorBloco;
const bitsDoTamanho = (v: number) => (v <= 9 ? 8 : 16);
const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0;

// ---------- Reed-Solomon em GF(256), polinômio 0x11D ----------

function mult(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function divisorRS(grau: number): number[] {
  const r = new Array<number>(grau - 1).fill(0).concat([1]);
  let raiz = 1;
  for (let i = 0; i < grau; i++) {
    for (let j = 0; j < r.length; j++) {
      r[j] = mult(r[j], raiz);
      if (j + 1 < r.length) r[j] ^= r[j + 1];
    }
    raiz = mult(raiz, 0x02);
  }
  return r;
}

function restoRS(dados: number[], divisor: number[]): number[] {
  const r = divisor.map(() => 0);
  for (const b of dados) {
    const fator = b ^ (r.shift() as number);
    r.push(0);
    divisor.forEach((c, i) => (r[i] ^= mult(c, fator)));
  }
  return r;
}

// ---------- codewords ----------

function codificar(bytes: number[], v: number): number[] {
  const bits: number[] = [];
  const poe = (valor: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((valor >>> i) & 1);
  };
  poe(0b0100, 4); // modo byte
  poe(bytes.length, bitsDoTamanho(v));
  for (const b of bytes) poe(b, 8);
  const cap = capacidadeDados(v) * 8;
  poe(0, Math.min(4, cap - bits.length)); // terminador
  poe(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) poe(pad, 8);
  const dados: number[] = [];
  for (let i = 0; i < bits.length; i += 8) dados.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));

  // Divide em blocos (os curtos primeiro), calcula a correção e intercala.
  const { total, blocos: nBlocos, ecPorBloco } = VERSOES[v];
  const curtos = nBlocos - (total % nBlocos);
  const tamCurto = Math.floor(total / nBlocos);
  const divisor = divisorRS(ecPorBloco);
  const blocos: number[][] = [];
  for (let i = 0, k = 0; i < nBlocos; i++) {
    const dat = dados.slice(k, k + tamCurto - ecPorBloco + (i < curtos ? 0 : 1));
    k += dat.length;
    const ec = restoRS(dat, divisor);
    if (i < curtos) dat.push(0);
    blocos.push(dat.concat(ec));
  }
  const saida: number[] = [];
  for (let i = 0; i < blocos[0].length; i++) {
    blocos.forEach((b, j) => {
      if (i !== tamCurto - ecPorBloco || j >= curtos) saida.push(b[i]);
    });
  }
  return saida;
}

// ---------- matriz ----------

type Matriz = boolean[][];

const MASCARAS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
];

class Desenho {
  readonly tam: number;
  readonly mod: Matriz;
  readonly fixo: Matriz;

  constructor(readonly versao: number) {
    this.tam = versao * 4 + 17;
    this.mod = Array.from({ length: this.tam }, () => new Array<boolean>(this.tam).fill(false));
    this.fixo = Array.from({ length: this.tam }, () => new Array<boolean>(this.tam).fill(false));
    this.padroesFixos();
  }

  private poe(x: number, y: number, escuro: boolean) {
    this.mod[y][x] = escuro;
    this.fixo[y][x] = true;
  }

  private padroesFixos() {
    const t = this.tam;
    for (let i = 0; i < t; i++) {
      this.poe(6, i, i % 2 === 0);
      this.poe(i, 6, i % 2 === 0);
    }
    for (const [cx, cy] of [
      [3, 3],
      [t - 4, 3],
      [3, t - 4]
    ]) {
      for (let dy = -4; dy <= 4; dy++)
        for (let dx = -4; dx <= 4; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || x >= t || y < 0 || y >= t) continue;
          const d = Math.max(Math.abs(dx), Math.abs(dy));
          this.poe(x, y, d !== 2 && d !== 4);
        }
    }
    const pos = ALINHAMENTO[this.versao];
    const n = pos.length;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) this.poe(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    this.formato(0); // reserva a área; o valor certo entra depois da máscara
    if (this.versao >= 7) {
      let resto = this.versao;
      for (let i = 0; i < 12; i++) resto = (resto << 1) ^ ((resto >>> 11) * 0x1f25);
      const bits = (this.versao << 12) | resto;
      for (let i = 0; i < 18; i++) {
        const a = t - 11 + (i % 3);
        const b = Math.floor(i / 3);
        this.poe(a, b, bit(bits, i));
        this.poe(b, a, bit(bits, i));
      }
    }
  }

  /** Informação de formato: nível M (bits 00) e a máscara, com BCH e a máscara fixa 0x5412. */
  formato(mascara: number) {
    const dados = (0b00 << 3) | mascara;
    let resto = dados;
    for (let i = 0; i < 10; i++) resto = (resto << 1) ^ ((resto >>> 9) * 0x537);
    const bits = ((dados << 10) | resto) ^ 0x5412;
    const t = this.tam;
    for (let i = 0; i <= 5; i++) this.poe(8, i, bit(bits, i));
    this.poe(8, 7, bit(bits, 6));
    this.poe(8, 8, bit(bits, 7));
    this.poe(7, 8, bit(bits, 8));
    for (let i = 9; i < 15; i++) this.poe(14 - i, 8, bit(bits, i));
    for (let i = 0; i < 8; i++) this.poe(t - 1 - i, 8, bit(bits, i));
    for (let i = 8; i < 15; i++) this.poe(8, t - 15 + i, bit(bits, i));
    this.poe(8, t - 8, true); // módulo sempre escuro
  }

  dados(codewords: number[]) {
    let i = 0;
    const t = this.tam;
    for (let dir = t - 1; dir >= 1; dir -= 2) {
      if (dir === 6) dir = 5;
      for (let vert = 0; vert < t; vert++)
        for (let j = 0; j < 2; j++) {
          const x = dir - j;
          const subindo = ((dir + 1) & 2) === 0;
          const y = subindo ? t - 1 - vert : vert;
          if (!this.fixo[y][x] && i < codewords.length * 8) {
            this.mod[y][x] = bit(codewords[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
    }
  }

  mascarar(m: number) {
    for (let y = 0; y < this.tam; y++)
      for (let x = 0; x < this.tam; x++) if (!this.fixo[y][x] && MASCARAS[m](x, y)) this.mod[y][x] = !this.mod[y][x];
  }

  /** Penalidade da norma (regras 1, 2 e 4, e a 3 simplificada): só escolhe a máscara mais legível. */
  penalidade(): number {
    const t = this.tam;
    const m = this.mod;
    let p = 0;
    const linhas = (ler: (a: number, b: number) => boolean) => {
      for (let a = 0; a < t; a++) {
        let corrida = 1;
        for (let b = 1; b < t; b++) {
          if (ler(a, b) === ler(a, b - 1)) corrida++;
          else {
            if (corrida >= 5) p += corrida - 2;
            corrida = 1;
          }
        }
        if (corrida >= 5) p += corrida - 2;
        const seq = Array.from({ length: t }, (_, b) => (ler(a, b) ? 1 : 0)).join('');
        p += 40 * ((seq.match(/(?=10111010000|00001011101)/g) ?? []).length);
      }
    };
    linhas((y, x) => m[y][x]);
    linhas((x, y) => m[y][x]);
    for (let y = 0; y < t - 1; y++)
      for (let x = 0; x < t - 1; x++) {
        const c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
      }
    const escuros = m.flat().filter(Boolean).length;
    p += Math.floor(Math.abs(escuros * 20 - t * t * 10) / (t * t)) * 10;
    return p;
  }
}

/**
 * Matriz do QR (true = módulo escuro), sem a margem branca. Lança erro se o texto passar de 213 bytes.
 */
export function gerarQr(texto: string): Matriz {
  const bytes = [...new TextEncoder().encode(texto)];
  const versao = Object.keys(VERSOES)
    .map(Number)
    .find((v) => 4 + bitsDoTamanho(v) + bytes.length * 8 <= capacidadeDados(v) * 8);
  if (!versao) throw new Error('Texto longo demais para o QR (máximo de 213 bytes).');
  const codewords = codificar(bytes, versao);

  let melhor: Desenho | null = null;
  let menor = Infinity;
  for (let m = 0; m < 8; m++) {
    const d = new Desenho(versao);
    d.dados(codewords);
    d.mascarar(m);
    d.formato(m);
    const p = d.penalidade();
    if (p < menor) {
      menor = p;
      melhor = d;
    }
  }
  return melhor!.mod;
}

/** Caminho SVG (um retângulo por módulo escuro), com margem de 4 módulos. Use com viewBox "0 0 {lado} {lado}". */
export function qrParaSvg(texto: string): { lado: number; caminho: string } {
  const m = gerarQr(texto);
  const margem = 4;
  const partes: string[] = [];
  m.forEach((linha, y) =>
    linha.forEach((escuro, x) => {
      if (escuro) partes.push(`M${x + margem} ${y + margem}h1v1h-1z`);
    })
  );
  return { lado: m.length + margem * 2, caminho: partes.join('') };
}

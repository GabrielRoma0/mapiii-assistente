// Ações comuns: ouvir em voz alta, falar a pergunta, copiar, compartilhar e imprimir.
// Voz usa só a API do próprio navegador (sem biblioteca e sem servidor nosso).
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../design-system/components/icons/Icon';
import css from '../app/app.module.css';

// ---------- ouvir (síntese de voz, roda no aparelho) ----------

const temSintese = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** Fala o texto em voz alta (voz padrão do aparelho, em português). Devolve false se o navegador não tiver voz. */
export function falar(texto: string): boolean {
  if (!temSintese()) return false;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'pt-BR';
  const voz = s.getVoices().find((v) => v.lang.toLowerCase().startsWith('pt-br')) ?? s.getVoices().find((v) => v.lang.toLowerCase().startsWith('pt'));
  if (voz) u.voice = voz;
  s.speak(u);
  return true;
}

/** Botão "Ouvir": lê o texto em voz alta em português. Some se o navegador não tiver voz. */
export function BotaoOuvir({ texto, rotulo = 'Ouvir' }: { texto: string; rotulo?: string }) {
  const [falando, setFalando] = useState(false);
  useEffect(() => () => {
    if (temSintese()) window.speechSynthesis.cancel();
  }, []);
  if (!temSintese()) return null;
  const alternar = () => {
    const s = window.speechSynthesis;
    if (falando) {
      s.cancel();
      setFalando(false);
      return;
    }
    s.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    const voz = s.getVoices().find((v) => v.lang.toLowerCase().startsWith('pt-br')) ?? s.getVoices().find((v) => v.lang.toLowerCase().startsWith('pt'));
    if (voz) u.voice = voz;
    u.rate = 0.95;
    u.onend = () => setFalando(false);
    u.onerror = () => setFalando(false);
    setFalando(true);
    s.speak(u);
  };
  return (
    <button type="button" className={css.botaoSecundario} aria-pressed={falando} onClick={alternar} style={{ alignSelf: 'flex-start' }}>
      <Icon name="conversa" size={22} />
      {falando ? 'Parar de ouvir' : rotulo}
    </button>
  );
}

// ---------- falar (reconhecimento de voz do navegador) ----------

interface ResultadoFala {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface Reconhecedor {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: ResultadoFala) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type ConstrutorReconhecedor = new () => Reconhecedor;

function construtorReconhecedor(): ConstrutorReconhecedor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: ConstrutorReconhecedor; webkitSpeechRecognition?: ConstrutorReconhecedor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const AVISO_VOZ = 'O texto falado aparece no campo para você conferir antes de enviar. Alguns navegadores enviam o áudio ao serviço de voz do fabricante.';

/**
 * Botão de microfone: transforma a fala em texto e entrega em `aoOuvir`. Nada é enviado sem a pessoa confirmar.
 * Some se o navegador não tiver reconhecimento de voz.
 */
export function BotaoFalar({ aoOuvir, aoAvisar }: { aoOuvir: (texto: string) => void; aoAvisar: (mensagem: string) => void }) {
  const [ouvindo, setOuvindo] = useState(false);
  const rec = useRef<Reconhecedor | null>(null);
  useEffect(() => () => rec.current?.stop(), []);
  const Construtor = construtorReconhecedor();
  if (!Construtor) return null;
  const alternar = () => {
    if (ouvindo) {
      rec.current?.stop();
      return;
    }
    const r = new Construtor();
    r.lang = 'pt-BR';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const texto = Array.from(e.results)
        .map((res) => res[0]?.transcript ?? '')
        .join(' ')
        .trim();
      if (texto) {
        aoOuvir(texto);
        aoAvisar('Confira o texto e toque em enviar.');
      }
    };
    r.onerror = (e) =>
      aoAvisar(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'O microfone não foi liberado. Você pode escrever a pergunta.' : 'Não entendi. Tente de novo ou escreva a pergunta.');
    r.onend = () => setOuvindo(false);
    rec.current = r;
    setOuvindo(true);
    aoAvisar('Pode falar.');
    try {
      r.start();
    } catch {
      setOuvindo(false);
      aoAvisar('Não consegui ligar o microfone. Você pode escrever a pergunta.');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button type="button" className={css.botaoSecundario} aria-pressed={ouvindo} aria-describedby="aviso-voz" onClick={alternar} style={{ alignSelf: 'flex-start' }}>
        <Icon name={ouvindo ? 'fechar' : 'conversa'} size={22} />
        {ouvindo ? 'Parar o microfone' : 'Falar a pergunta'}
      </button>
      <span id="aviso-voz" className={css.apoio} style={{ margin: 0 }}>
        {AVISO_VOZ}
      </span>
    </div>
  );
}

// ---------- copiar, compartilhar, imprimir ----------

/** Copia o texto. Sem permissão, devolve false (a tela mostra o texto para a pessoa copiar). */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

/**
 * Compartilhar (WhatsApp e outros, pelo menu do aparelho), copiar e imprimir. O texto aparece numa caixa
 * só se não der para copiar sozinho.
 */
export function AcoesDeTexto({ titulo, texto, imprimir = true }: { titulo: string; texto: string; imprimir?: boolean }) {
  const [aviso, setAviso] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const podeCompartilhar = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const compartilhar = async () => {
    try {
      await navigator.share({ title: titulo, text: texto });
      setAviso('Pronto.');
    } catch {
      /* a pessoa cancelou */
    }
  };
  const copiar = async () => {
    if (await copiarTexto(texto)) {
      setAviso('Texto copiado.');
      setMostrar(false);
    } else {
      setMostrar(true);
      setAviso('Não consegui copiar sozinho. O texto está selecionado abaixo: use a opção Copiar do seu aparelho.');
      requestAnimationFrame(() => {
        area.current?.focus();
        area.current?.select();
      });
    }
  };

  return (
    <div className={`${css.pilha} naoImprimir`}>
      <div className={css.acoesLinha}>
        {podeCompartilhar && (
          <button type="button" className={css.botaoSecundario} onClick={compartilhar}>
            <Icon name="enviar" size={22} />
            Compartilhar
          </button>
        )}
        <button type="button" className={css.botaoSecundario} onClick={copiar}>
          <Icon name="documento" size={22} />
          Copiar texto
        </button>
        {imprimir && (
          <button type="button" className={css.botaoSecundario} onClick={() => window.print()}>
            <Icon name="download" size={22} />
            Imprimir
          </button>
        )}
      </div>
      {mostrar && (
        <textarea ref={area} className={css.campoTexto} value={texto} readOnly rows={8} aria-label={`Texto: ${titulo}`} onFocus={(e) => e.currentTarget.select()} />
      )}
      <p className="visualmente-oculto" aria-live="polite">
        {aviso}
      </p>
      {aviso && <p className={css.apoio} style={{ margin: 0 }}>{aviso}</p>}
    </div>
  );
}

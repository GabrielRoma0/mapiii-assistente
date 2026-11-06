// Vitrine de desenvolvimento: mostra cada componente nos estados do design system.
import type { ReactNode } from 'react';
// Os textos são de exemplo de layout: não são informação sobre direitos.
import { useState } from 'react';
import { Logo } from '../../design-system/components/brand/Logo';
import { Button } from '../../design-system/components/core/Button';
import { ESTADOS_MAPI, MapiPersonagem, type EstadoMapi } from '../ui/MapiPersonagem';
import {
  CartaoDireito,
  CartaoResposta,
  Comemoracao,
  DisclaimerBanner,
  EligibilityChip,
  FalaMapi,
  FalaVoce,
  ItemChecklist,
  LinhaDoTempo,
  OpcoesEmCartao,
  ResultadoChecagemSelo,
  SourceChip,
  SourceTypeBadge,
  AVISO_CHECAGEM
} from '../ui/assistente';
import { escolherTema, temaDoSistema, type Tema } from '../tema';
import css from './vitrine.module.css';

const EXEMPLO_URL = 'https://www.exemplo.gov.br/pagina';
const ITENS = ['Documento A', 'Documento B', 'Documento C'];

export function Vitrine() {
  const [tema, setTema] = useState<Tema>(temaDoSistema);
  const [opcao, setOpcao] = useState<string | null>('a');
  const [marcados, setMarcados] = useState<boolean[]>([true, false, false]);
  const [voto, setVoto] = useState<boolean | null>(null);

  const trocarTema = () => {
    const novo = tema === 'escuro' ? 'claro' : 'escuro';
    setTema(novo);
    escolherTema(novo);
  };

  return (
    <main className={css.pagina}>
      <header className={css.topo}>
        <Logo size={30} tone={tema === 'escuro' ? 'inverse' : 'color'} cut={tema === 'escuro' ? 'var(--bg-app)' : undefined} />
        <Button variant="secondary" size="md" onClick={trocarTema}>
          {tema === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro'}
        </Button>
      </header>
      <h1 className={css.titulo}>Vitrine de componentes</h1>
      <p className={css.nota}>Página de desenvolvimento. Os textos são só exemplos de layout.</p>

      <Secao titulo="Mapi · 11 estados (pose estática)">
        <div className={css.gradeMapi}>
          {(Object.keys(ESTADOS_MAPI) as EstadoMapi[]).map((e) => (
            <figure key={e} className={css.mapiItem}>
              <MapiPersonagem estado={e} size={64} />
              <figcaption>{ESTADOS_MAPI[e].rotulo}</figcaption>
            </figure>
          ))}
        </div>
      </Secao>

      <Secao titulo="DisclaimerBanner">
        <DisclaimerBanner />
      </Secao>

      <Secao titulo="SourceTypeBadge e EligibilityChip">
        <div className={css.linha}>
          <SourceTypeBadge tipo="oficial" />
          <SourceTypeBadge tipo="secundaria" />
          <SourceTypeBadge tipo="desatualizada" />
        </div>
        <div className={css.linha}>
          <EligibilityChip valor="pode" />
          <EligibilityChip valor="talvez" />
          <EligibilityChip valor="nao" />
        </div>
      </Secao>

      <Secao titulo="SourceChip">
        <SourceChip nome="Órgão de exemplo" url={EXEMPLO_URL} verificadoEm="2026-10-28" />
      </Secao>

      <Secao titulo="ChatBubble">
        <FalaVoce>Pergunta de exemplo da pessoa.</FalaVoce>
        <FalaMapi estado="procurando">Procurando na minha base de fontes.</FalaMapi>
      </Secao>

      <Secao titulo="WizardStep">
        <OpcoesEmCartao
          pergunta="Pergunta de exemplo?"
          opcoes={[
            { valor: 'a', texto: 'Opção A' },
            { valor: 'b', texto: 'Opção B' },
            { valor: 'c', texto: 'Ainda não sei' }
          ]}
          valor={opcao}
          aoEscolher={setOpcao}
        />
      </Secao>

      <Secao titulo="Checklist">
        <p className={css.nota}>
          {marcados.filter(Boolean).length} de {ITENS.length} prontos
        </p>
        {ITENS.map((t, i) => (
          <ItemChecklist
            key={t}
            texto={t}
            marcado={marcados[i]}
            aoAlternar={() => setMarcados((m) => m.map((v, j) => (j === i ? !v : v)))}
          />
        ))}
        {marcados.every(Boolean) && <Comemoracao titulo="Você juntou todos os documentos." texto="Texto de exemplo do próximo passo." />}
      </Secao>

      <Secao titulo="Timeline">
        <LinhaDoTempo passos={['Primeiro passo de exemplo.', 'Segundo passo de exemplo.', 'Terceiro passo de exemplo.']} />
      </Secao>

      <Secao titulo="ScamCheckResult">
        <ResultadoChecagemSelo resultado="oficial" />
        <ResultadoChecagemSelo resultado="suspeito" />
        <ResultadoChecagemSelo resultado="nao_sei" />
        <p className={css.nota}>{AVISO_CHECAGEM}</p>
      </Secao>

      <Secao titulo="RightCard">
        <CartaoDireito
          direito={{
            titulo: 'Título do direito',
            resumo: 'Resumo de uma linha.',
            elegibilidade: 'talvez',
            porque: 'Frase de exemplo explicando o porquê da classificação.',
            tipoFonte: 'secundaria',
            oQueLevar: 'Lista de exemplo.',
            ondeIr: 'Local de exemplo.',
            prazoTipico: 'Prazo de exemplo.'
          }}
          hrefDetalhes="#/componentes"
        />
      </Secao>

      <Secao titulo="AnswerCard">
        <CartaoResposta
          resposta={{
            resumo: 'Resumo de exemplo da resposta.',
            passos: ['Passo de exemplo.', 'Outro passo de exemplo.'],
            fonteNome: 'Órgão de exemplo',
            fonteUrl: EXEMPLO_URL,
            verificadoEm: '2026-03-12',
            tipoFonte: 'desatualizada',
            limitacao: 'Texto de exemplo da limitação.',
            elegibilidade: 'pode'
          }}
          voto={voto}
          aoVotar={setVoto}
        />
      </Secao>
    </main>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className={css.secao} aria-label={titulo}>
      <h2 className={css.secaoTitulo}>{titulo}</h2>
      {children}
    </section>
  );
}

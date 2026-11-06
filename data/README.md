# Base de conhecimento (`kb.json`)

`data/kb.json` é uma lista de entradas. O app só responde com o que está aqui: **sem entrada, sem resposta; sem fonte, a entrada não é aceita.** Nada de fora da base aparece na tela.

O esquema está em código em `src/core/kb-schema.ts`. As perguntas da triagem estão em `data/perguntas.json` (validadas por `src/core/perguntas.ts`).

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | texto | sim | Identificador único: minúsculas, números e hífen (ex.: `bilhete-unico-especial`). |
| `tipo` | texto | sim | `direito`, `servico` ou `norma`. |
| `titulo` | texto | sim | Nome curto que aparece no cartão (ex.: `Bilhete Único Especial`). |
| `resumo` | texto | sim | Uma ou duas frases simples, verbo no presente. Nunca escreva "você tem direito". |
| `publico` | lista de textos | sim | A quem se destina, em linguagem de pessoa primeiro (ex.: `pessoa com deficiência`, `familiar ou responsável`). |
| `cidade` | texto | sim | Por enquanto só `SP`. |
| `condicoes` | objeto | direito e serviço | Regras de elegibilidade sobre as respostas da triagem (veja abaixo). |
| `documentos` | lista de textos | direito e serviço | O que levar. Vira o checklist do detalhe. |
| `onde` | objeto | direito e serviço | `{"texto": "Onde pedir.", "link": "https://..."}`. O `link` é opcional (ex.: atendimento só por telefone). |
| `prazo_tipico` | texto | direito e serviço | Quanto costuma levar, sem prometer (ex.: `Algumas semanas. Confira o prazo atual no site.`). |
| `passos` | lista de textos | não | Passos para pedir, mostrados na resposta da pergunta livre. |
| `se_negarem` | lista de textos | direito e serviço | O que fazer se o pedido for negado, em ordem. |
| `perguntas_exemplo` | lista de textos | sim, ao menos 1 | Perguntas como uma pessoa faria. Entram na similaridade da busca. |
| `palavras_chave` | lista de textos | sim, ao menos 1 | Termos que identificam o assunto. Podem ter mais de uma palavra. Acento e plural não importam. |
| `fonte_nome` | texto | sim | Nome legível da fonte (ex.: `SPTrans`). Vira o texto do link. |
| `fonte_url` | texto | sim | Link `https://` que abre a fonte em nova aba. |
| `tipo_fonte` | texto | sim | `oficial`, `secundaria` ou `desatualizada` (veja abaixo). |
| `verificado_em` | data `AAAA-MM-DD` | sim | Dia em que alguém abriu o link e conferiu a entrada. Não pode ser futura. |
| `limitacao` | texto | sim | O que a resposta não cobre (ex.: `Não vejo o seu pedido nem decido por você. Quem analisa é a SPTrans.`). |

Em `norma`, os campos marcados "direito e serviço" são opcionais, mas seguem o mesmo formato se vierem. Normas não aparecem na Rota dos Direitos, só na pergunta livre.

Qualquer outro campo é recusado pelo validador, para pegar erro de digitação (`palavra_chave` em vez de `palavras_chave`).

## Tipos de fonte

- **`oficial`**: o texto do órgão responsável (lei, decreto, portaria, site da prefeitura, SPTrans, INSS). Mostra o selo "Fonte oficial".
- **`secundaria`**: explica ou resume o oficial (guia de associação, cartilha, notícia). Mostra o selo "Fonte secundária" e um aviso destacado pedindo para conferir no órgão responsável.
- **`desatualizada`**: a fonte existe, mas foi substituída ou pode não valer mais. Mostra "Pode estar desatualizada" e aviso destacado. Explique o motivo em `limitacao`.

**Regra automática:** se `verificado_em` tiver mais de 6 meses, a tela mostra "Pode estar desatualizada" mesmo para fonte oficial ou secundária. Para tirar o aviso, confira a fonte de novo e atualize a data.

## Condições (`condicoes`)

As condições usam os ids e valores de `data/perguntas.json`. Use exatamente o `id` da pergunta em `campo` e os `valor` das opções em `em`. Toda pergunta aceita também `prefiro_nao_responder`, que o app acrescenta sozinho.

| `campo` | Pergunta | Tipo | Valores |
|---|---|---|---|
| `p_quem` | Para quem é a orientação? | única | `eu`, `filho_filha`, `outro_familiar`, `pessoa_acompanhada`, `so_pesquisando` |
| `p_necessidade` | Que tipo de apoio a pessoa precisa no dia a dia? | múltipla | `mobilidade`, `visual`, `auditiva`, `intelectual_neurodesenvolvimento`, `outra` |
| `p_objetivo` | O que você quer resolver? | única | `transporte`, `beneficio_financeiro`, `saude_equipamentos`, `escola`, `documentos`, `calcada_acessibilidade`, `conferir_golpe` |
| `p_faixa` | Em qual faixa de idade a pessoa está? | única | `ate_11`, `12_a_17`, `18_a_59`, `60_ou_mais` |
| `p_equipamento` | Usa cadeira de rodas, andador, muleta ou outro apoio? | única | `sim`, `nao`, `nao_sei` |
| `p_laudo` | Existe laudo ou relatório médico? | única | `sim`, `nao`, `nao_sei` |
| `p_cidade` | Mora na cidade de São Paulo? | única | `sim`, `nao`, `nao_sei` |
| `p_subprefeitura` | Em qual subprefeitura? (só aparece se `p_cidade` = `sim`) | lista | as 32 subprefeituras (veja o arquivo) |
| `p_renda` | Renda por pessoa de até meio salário mínimo? | única | `sim`, `nao`, `nao_sei` |
| `p_cadunico` | Tem Cadastro Único? | única | `sim`, `nao`, `nao_sei` |
| `p_beneficios` | Já recebe algum destes? | múltipla | `bpc`, `passe_livre`, `nenhum`, `nao_sei` |
| `p_transporte` | Como costuma se deslocar? | múltipla | `onibus`, `metro_trem`, `carro`, `a_pe_ou_cadeira`, `aplicativo` |

Cada regra é `{"campo": "p_...", "em": ["valor", ...]}`. Ela vale quando a resposta (ou, em pergunta múltipla, alguma das respostas) é um dos valores de `em`. Os grupos:

- **`todas`**: cada regra precisa valer.
- **`alguma`**: pelo menos uma precisa valer.
- **`nenhuma`**: se alguma valer, a entrada provavelmente não se aplica.

Como o app classifica (motor de regras, `src/core/regras.ts`):

- **Pode ter direito**: todas as regras de `todas` valem, ao menos uma de `alguma` vale (se houver) e nenhuma de `nenhuma` vale.
- **Talvez**: nenhuma regra falhou, mas alguma depende de "não sei", "prefiro não responder" ou de pergunta não respondida.
- **Provavelmente não se aplica**: alguma regra de `todas` falhou, nenhuma de `alguma` valeu, ou alguma de `nenhuma` valeu.

O app explica o porquê em uma frase, montada a partir dos textos das perguntas e das respostas. Nunca diz "você tem direito". Exemplos:

- Pode ter direito: *Combina com o que você respondeu: “Transporte e passe livre” e “Mobilidade ou cadeira de rodas”.*
- Talvez: *Depende da resposta para “A pessoa já recebe algum destes?”, que ficou sem resposta ou como “Não sei”.*
- Provavelmente não se aplica: *Vale para quem respondeu “Transporte e passe livre” em “O que você quer resolver?”, e você respondeu “Escola e apoio na sala de aula”.*

Na Rota, os resultados aparecem nessa ordem (pode, talvez, não), mantendo a ordem do `kb.json` no empate. Normas não entram na Rota.

### Só perguntar o que a base usa

A triagem só mostra perguntas que alguma condição usa. `npm run auditar-perguntas` falha se houver pergunta sem uso ou condição que cite pergunta inexistente. Com a base vazia, todas aparecem como "sem uso": é esperado até as entradas chegarem.

Para criar uma pergunta nova: acrescente em `data/perguntas.json` (`id`, `texto`, `por_que_perguntamos`, `tipo`, `opcoes`; opcionais `fala`, `sensivel`, `mostrar_se`, `exclusivas`), use-a numa condição e rode `npm run auditar-perguntas`. Marque `"sensivel": true` em saúde, renda, idade e benefícios: essas respostas só vão para a conta se a pessoa logada marcar "Salvar meu perfil".

## Exemplo

O exemplo abaixo só mostra o formato: os textos não são informação verdadeira e não estão em `kb.json`.

```json
{
  "id": "exemplo-passe-livre",
  "tipo": "direito",
  "titulo": "Nome do direito",
  "resumo": "Uma frase sobre o que é.",
  "publico": ["pessoa com deficiência", "familiar ou responsável"],
  "cidade": "SP",
  "condicoes": {
    "todas": [{ "campo": "p_objetivo", "em": ["transporte"] }],
    "alguma": [{ "campo": "p_necessidade", "em": ["mobilidade"] }]
  },
  "documentos": ["Documento com foto", "CPF"],
  "onde": { "texto": "Site do órgão ou posto de atendimento.", "link": "https://www.exemplo.sp.gov.br/pedido" },
  "prazo_tipico": "Algumas semanas. Confira o prazo atual no site.",
  "passos": ["Primeiro passo.", "Segundo passo."],
  "se_negarem": ["Peça o motivo por escrito.", "Junte o que faltou e faça um novo pedido.", "Procure a Defensoria Pública se precisar de ajuda."],
  "perguntas_exemplo": ["Como peço o passe livre?", "Cadeirante paga ônibus em São Paulo?"],
  "palavras_chave": ["passe livre", "ônibus", "transporte"],
  "fonte_nome": "Nome do órgão",
  "fonte_url": "https://www.exemplo.sp.gov.br/norma",
  "tipo_fonte": "oficial",
  "verificado_em": "2026-10-28",
  "limitacao": "Não vejo o seu pedido nem decido por você. Quem analisa é o órgão responsável."
}
```

## Canal oficial do "Não encontrei"

Quando a pergunta livre não acha nada acima do limite, o app responde "Não encontrei isso na minha base" e indica um canal oficial. Esse canal também vem da base: cadastre uma entrada `servico` (por exemplo, a central de atendimento da Prefeitura, com fonte) e ponha o `id` dela em `canalOficialId`, em `src/core/config.ts`. Enquanto for `null`, o app só pede para procurar o órgão responsável, sem citar canal nenhum.

## Pergunta livre: o que é recusado

Antes da busca, a pergunta passa por `src/core/validar.ts`. Nenhuma recusa guarda ou devolve o texto.

| Situação | Resposta |
|---|---|
| Emergência de saúde acontecendo agora ("desmaiou", "não está respirando", "está tendo um AVC") | Só "Em emergência, ligue 192." Vem antes de qualquer outra regra. |
| CPF, telefone, e-mail ou 10+ dígitos | Pede para apagar o dado. Não processa nem guarda. |
| Vazio, menos de 3 ou mais de 300 caracteres, só símbolos ou números | Mensagem explicando o que fazer. |
| Pedido de conselho para um caso na Justiça (processar, indenização, entrar na Justiça) | Indica Defensoria Pública ou advogado. "Posso recorrer?" de um pedido negado passa. |
| Pedido de conselho de saúde (que remédio tomar, dose, diagnóstico, sintomas) | Indica serviço de saúde. "Remédio de graça", "laudo para o BPC" e "terapia pelo SUS" passam. |
| Nenhuma palavra da base nem do tema | "Esse assunto fica fora do que eu sei." |

Os limites de tamanho e da busca ficam em `src/core/config.ts`.

## "Conferir se é oficial": `dominios-oficiais.json` e `servicos-valores.json`

A checagem roda no aparelho, sem nenhuma requisição de rede (`src/core/oficial.ts`). O texto colado não é guardado. O resultado é **Oficial**, **Suspeito** ou **Não sei**, sempre com o motivo e o aviso "Esta checagem não garante nada. Confirme no site oficial."

### `dominios-oficiais.json`

| Campo | O que é |
|---|---|
| `sufixos` | Finais reservados ao poder público, cada um com `sufixo` (sem ponto no começo, ex.: `gov.br`), `descricao`, `fonte_nome`, `fonte_url` e `verificado_em`. Hoje: `gov.br`, `mil.br`, `def.br`, `jus.br`, `leg.br`, `mp.br` e `tc.br`, da categoria "Poder público" do Registro.br, conferida em 04/11/2026. |
| `dominios` | Sites oficiais que não terminam num desses sufixos: `dominio` (sem `www`), `nome` e a fonte. Hoje: `sptrans.com.br`. |
| `marcas` | Nomes que golpes costumam imitar (`inss`, `sptrans`, `prefeitura`...). Não são informação: só ajudam a marcar endereços parecidos como suspeitos. |
| `golpes_conhecidos` | Domínios de golpe já confirmados. Viram "Suspeito" direto. |
| `encurtadores` | Serviços de link encurtado (`bit.ly`...). Viram "Não sei", porque escondem o destino. |

Como um link é julgado, nesta ordem:

1. **Suspeito**: não é `http`/`https`, tem `@` antes do site, é só número (IP) ou está em `golpes_conhecidos`.
2. **Oficial**: o site é exatamente um domínio de `dominios` (ou um subdomínio dele) ou termina exatamente em `.` + um `sufixo`. `golpegov.br` não termina em `.gov.br`.
3. **Não sei**: link encurtado.
4. **Suspeito**: letras de outro alfabeto (punycode `xn--`), `gov.br` no meio do endereço (`gov.br.beneficio.com`), nome de marca com letra trocada por número ou hífen (`sptr4ns`, `sp-trans`), nome de marca com outro final (`sptrans.com`), misturado com outras palavras (`sptrans-recarga`) ou com uma letra diferente (`sptranss`), ou `gov.br` só depois da barra.
5. **Não sei**: nada disso. Pede para a pessoa digitar o endereço oficial ela mesma.

### `servicos-valores.json`

Lista de serviços com o custo oficial. **Está vazia**: cada item precisa de fonte.

```json
{
  "id": "exemplo-segunda-via",
  "servico": "a segunda via do cartão de exemplo",
  "valor_oficial": 0,
  "palavras_chave": ["segunda via", "cartão de exemplo"],
  "fonte_nome": "Órgão de exemplo",
  "fonte_url": "https://www.exemplo.sp.gov.br/precos",
  "verificado_em": "2026-10-28",
  "kb_id": "id-da-entrada-no-kb"
}
```

`valor_oficial` é em reais (`0` = gratuito). `servico` entra no meio de uma frase ("Pela fonte, a segunda via do cartão de exemplo não tem custo"), então escreva com artigo. `kb_id` é opcional e precisa existir em `kb.json`. Quando a pessoa cola um valor ("cobraram R$ 50 para liberar o cartão"), o app acha o serviço pelas `palavras_chave`: valor igual ao oficial é "Oficial", diferente é "Suspeito" e serviço fora da lista é "Não sei".

`npm run validar-kb` confere os três arquivos de `data/`.

## Como adicionar entradas

1. Cole a nova entrada dentro da lista de `data/kb.json` (separe as entradas por vírgula).
2. Rode `npm run validar-kb`. Ele lista cada problema pelo `id`.
3. Rode `npm run auditar-perguntas`. Ele confere se as condições usam perguntas que existem e se toda pergunta é usada.
4. Rode `npm test`. O teste `data/kb.json: a base real é válida` falha se a base estiver fora do esquema.
5. Se a base mudou, rode `npm run eval` para ver se alguma pergunta ou cenário do gabarito passou a dar errado.

## Dicas para a busca achar a entrada certa

- Escreva 2 a 4 `perguntas_exemplo` com jeitos diferentes de perguntar a mesma coisa, inclusive do jeito informal ("cadeirante paga ônibus?").
- Use em `palavras_chave` os termos que só essa entrada tem. Uma palavra presente em quase todas as entradas (como `deficiência`) pesa pouco; um termo raro pesa mais.
- Evite repetir as mesmas palavras-chave em entradas de assuntos diferentes: a busca fica em dúvida entre elas.
- Não coloque informação sem fonte: o que não está na fonte indicada não entra aqui.

## API Olho Vivo (SPTrans): o que foi confirmado

Usada só pelo Embarque Garantido (Fase 3, desligado por padrão). Conferido em **05/11/2026** na documentação oficial:

- Página da documentação: https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/documentacao-api/
- Guia de uso (cadastro e token): https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/

| Item | O que a documentação diz |
|---|---|
| URL base e versão | `api.olhovivo.sptrans.com.br/v2.1`. Versões disponíveis: `0` e `2.1`. |
| Protocolo | Aviso no topo da página: o HTTP seria desativado em 02/01/2024 e o acesso passa a ser só por HTTPS. Por isso o app usa `https://api.olhovivo.sptrans.com.br/v2.1` (o texto da seção "Acesso" ainda mostra `http://`). |
| Token | Cada aplicativo cadastrado em "Meus Aplicativos" (área do desenvolvedor) recebe uma chave de acesso. |
| Autenticação | `POST /Login/Autenticar?token={token}`. Retorna `true` quando autentica e `false` em caso de erro. É uma "chamada prévia" às demais. |
| Buscar linha | `GET /Linha/Buscar?termosBusca={termo}`. Aceita número ou denominação da linha, total ou parcial (ex.: `8000`, `Lapa`). Se não acha, faz busca fonética no nome. |
| Campos da linha | `cl` código único da linha **por sentido**; `lc` circular; `lt` primeira parte do letreiro numérico; `tl` segunda parte (10 = BASE; 21, 23, 32, 41 = ATENDIMENTO); `sl` sentido (1 = Terminal Principal → Secundário, 2 = Secundário → Principal); `tp` letreiro no sentido 1; `ts` letreiro no sentido 2. |
| Posição dos veículos da linha | `GET /Posicao/Linha?codigoLinha={cl}`. |
| Campos da posição | `hr` "horário de referência da geração das informações" (formato `HH:MM`); `vs` lista de veículos com `p` prefixo, **`a`**, `ta`, `py` latitude e `px` longitude. |
| Campo `a` | "Indica se o veículo é (true) ou não (false) acessível para pessoas com deficiência". |
| Campo `ta` | "Indica o horário universal (UTC) em que a localização foi capturada", no padrão ISO 8601 (ex.: `2017-05-07T22:57:02Z`). |

### O que a documentação NÃO diz (não assumir)

- **O que `a` significa na prática.** A página diz só "acessível para pessoas com deficiência". Não fala em rampa nem elevador. A tela usa o texto da SPTrans e não promete rampa ou elevador.
- **Como a sessão continua depois do login.** A página diz que o login é uma chamada prévia, mas não explica como as chamadas seguintes ficam autenticadas (cookie, cabeçalho...). Confirmar no primeiro teste com o token real antes de programar a reutilização da sessão.
- **Códigos de erro e limites de uso.** Não há menção a 401, 429, limite de pedidos nem tempo de resposta. O tratamento desses casos no app é defensivo, não baseado em regra documentada.
- **Fuso do `hr`.** A página não diz o fuso do `hr` (o `ta` é UTC). A regra de "dado desatualizado" (mais de 2 minutos) usa o `ta` de cada veículo.
- **Tipo do prefixo `p`.** A página diz `[int]`, mas o exemplo de `/Posicao/Linha` mostra texto (`"11433"`). O app trata `p` como texto.

- **Texto do sentido.** O app mostra `tp → ts` no sentido 1 e `ts → tp` no sentido 2. É uma leitura da descrição dos campos (`tp` "no sentido Terminal Principal para Terminal Secundário"), não um exemplo da página: conferir com uma linha real quando houver token.

Latitude e longitude dos veículos (`py`, `px`) não são usadas: a Edge Function descarta esses campos antes de responder ao app.

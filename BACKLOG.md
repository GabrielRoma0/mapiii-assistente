# Backlog do Mapiii

Ideias para depois do MVP. **Feito em 06/11/2026** (saiu daqui): falar e ouvir (voz do navegador) e a lista única para o laudo. As demais **não estão implementadas**. Cada uma traz o que é, por que seria bom, o esforço estimado, o risco e do que depende. Esforço: **baixo** (dias), **médio** (uma a duas semanas), **alto** (mais que isso ou com parceiros).

## 1. Modo varredura simplificado

- **Descrição:** um modo de leitura com uma pergunta por tela, texto grande, sem rolagem e com dois ou três botões grandes por vez, que dá para usar com acionador (switch) ou só com Tab e Enter.
- **Por que seria bom:** atende quem navega por varredura, pessoas com deficiência intelectual ou baixa visão, e quem está num momento de estresse e precisa de menos coisa na tela.
- **Esforço:** médio.
- **Risco:** duplicar telas e deixar as duas versões divergirem com o tempo; esconder informação importante (fonte e limitação) para caber na tela.
- **Dependência:** reaproveitar o motor de regras e as fichas como estão; teste com usuários que usam varredura.

## 2. Laudo único como ficha informativa

- **Descrição:** uma ficha na base explicando o que é o laudo ou a avaliação de deficiência, para que serve e onde pedir, com fonte oficial e data. **Sem upload de documento.**
- **Por que seria bom:** o laudo aparece em muitos pedidos (`p_laudo` já existe na triagem), e muita gente não sabe como conseguir.
- **Esforço:** baixo (é conteúdo, não código).
- **Risco:** a regra muda conforme o benefício e o órgão; uma ficha genérica pode dar a entender que um laudo serve para tudo. Precisa de limitação clara.
- **Dependência:** fonte oficial atualizada e conferida; revisão por alguém da área.

## 3. Direcionar canais por região (subprefeitura)

- **Descrição:** a lista de subprefeituras já existe na triagem (`p_subprefeitura`, só aparece para quem mora em São Paulo). A ideia é usá-la para mostrar o canal de atendimento da região da pessoa, quando a ficha tiver canais por subprefeitura.
- **Por que seria bom:** evita mandar a pessoa a um posto longe e reduz o tempo até o atendimento.
- **Esforço:** médio.
- **Risco:** endereço e horário de posto mudam com frequência; a lista das 32 subprefeituras foi escrita de memória e precisa ser conferida com a fonte da Prefeitura.
- **Dependência:** fichas com canais por região e fonte oficial; conferir a lista de subprefeituras.

## 4. IA de reformulação ligada em produção

- **Descrição:** ligar a camada de IA (Edge Function `responder`) que só reformula em linguagem simples o texto das fichas escolhidas, com o validador no app e o selo "Reformulado por IA a partir das fontes abaixo".
- **Por que seria bom:** textos oficiais costumam ser difíceis; uma versão mais simples ajuda quem lê com dificuldade.
- **Esforço:** médio.
- **Risco:** a IA acrescentar valor, prazo, lei ou link que não está na ficha; custo por uso; dependência de um serviço externo. O validador e o "texto da base, sem IA" em caso de falha reduzem o risco, mas não zeram.
- **Dependência:** projeto Supabase e chave da API guardados só no servidor; avaliação com perguntas armadilha (fora do escopo, conselho jurídico, resposta ausente da base, tentativa de fazer a IA inventar) antes de ligar.

## 5. Mapa de calçadas (visão de futuro, só no vídeo)

- **Descrição:** o mapa colaborativo de calçadas do design system v1 (fotos classificadas e painel da prefeitura). Fica só como visão de futuro no vídeo, sem nenhuma tela no app.
- **Por que seria bom:** mostra para onde o projeto pode crescer e conecta direitos com a acessibilidade da rua.
- **Esforço:** alto.
- **Risco:** fotos podem mostrar pessoas, placas e casas (dados pessoais); classificação errada; moderação; custo de manter o mapa atualizado.
- **Dependência:** parceria com a Prefeitura, política de privacidade de imagens e moderação. O design já está em `design-system/Mapiii Visao de Futuro.dc.html`.

## 6. Mais cidades além de São Paulo

- **Descrição:** fichas de outras cidades, com o campo `cidade` aceitando mais valores e a triagem perguntando a cidade em vez de "mora em São Paulo?".
- **Por que seria bom:** os direitos federais (como o BPC) valem no país todo; a mesma estrutura atenderia muito mais gente.
- **Esforço:** alto (o código muda pouco; o conteúdo, com fonte e conferência, é a maior parte).
- **Risco:** a base crescer sem conferência e ficar desatualizada; misturar regras municipais de cidades diferentes.
- **Dependência:** pessoas para pesquisar e conferir as fontes de cada cidade; separar na base o que é federal, estadual e municipal.

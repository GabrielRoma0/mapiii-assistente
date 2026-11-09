# Comprovantes da fonte: BPC para a pessoa com deficiência

Fontes da ficha `bpc-pcd` de `data/kb.json`. O gov.br abre para leitura automática, então o Claude Code baixou o texto das páginas em 09/11/2026 e o guardou aqui. O Thor confere abrindo os links no navegador e acrescenta os prints.

| Arquivo | Página | O que a ficha usa |
|---|---|---|
| `2026-11-09-inss-bpc-loas.md` | https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais/beneficio-assistencial-a-pessoa-com-deficiencia-bpc-loas (`fonte_url`) | Um salário mínimo por mês; renda por pessoa de até 1/4 do salário mínimo; sem contribuição; deficiência de longo prazo (mínimo de 2 anos); CadÚnico atualizado nos últimos 2 anos; passos no Meu INSS; avaliação social e perícia médica com a presença da pessoa; documento com foto na perícia; sem 13º e sem pensão; não soma com aposentadoria, pensão ou seguro-desemprego; Auxílio-Inclusão até 2 salários mínimos; aprendiz por 2 anos; telefone 135, de segunda a sábado, das 7h às 22h |
| `2026-11-09-inss-bpc-loas-1-topo.webp`, `-2-etapas-e-documentos.webp`, `-3-informacoes-importantes.webp` | idem (página do INSS) | Prints do Thor, 09/11: a página inteira confere com o texto baixado |
| `2026-11-09-govbr-servico-bpc.md` | https://www.gov.br/pt-br/servicos/solicitar-beneficio-assistencial-a-pessoa-com-deficiencia (`onde.link`) | Documentos da pessoa e de quem mora na casa; procuração ou termo de representação; resposta em média em 45 dias corridos; serviço gratuito; conta gov.br; 135 se o sistema estiver fora do ar |
| `2026-11-09-govbr-servico-bpc-1-topo.webp` a `-5-ouvidoria.webp` | idem (página de serviço do gov.br) | Prints do Thor, 09/11: confere com o texto baixado (documentos, 45 dias, gratuito, 135) |
| `2026-11-09-inss-recurso.md` | https://www.gov.br/inss/pt-br/direitos-e-deveres/recurso/recurso-administrativo-de-beneficio-previdenciario | "Se negarem": recurso em até 30 dias, serviço Recurso Ordinário (Inicial) no Meu INSS, razões e documentos, acompanhar em Recurso > Consultar Andamento |

| `2026-11-09-inss-recurso-1-tipos-e-prazo.webp` a `-4-reclamacao.webp` | idem (página de recurso) | Prints do Thor, 09/11: confere com o texto baixado. O último traz "Como registrar uma reclamação" (Central 135 ou Fala.BR quando o recurso passa do prazo) e o endereço consultaprocessos.inss.gov.br, acrescentados ao "Se negarem" |

| `2026-11-09-lei-8742-1993-cabecalho-e-art-2.webp` | https://www.planalto.gov.br/ccivil_03/leis/l8742.htm | Print do Thor, 09/11: cabeçalho da Lei 8.742/1993 (LOAS) e art. 2º, I, e (garantia de um salário mínimo à pessoa com deficiência sem meios de se manter). Citado no `modelo_recurso` |
| `2026-11-09-lei-8742-1993-arts-20b-a-21b.webp` | idem | Print do Thor, 09/11: art. 21 (revisão a cada 2 anos; § 4º novo pedido possível; § 5º dispensa da perícia periódica para impedimento permanente, Lei 15.157/2025) e art. 21-A (suspensão quando trabalha; § 1º volta sem nova perícia; § 2º aprendiz por 2 anos). Usados nos passos |

**Lei:** `base_legal` cita a Lei 8.742/1993, art. 2º, I, e, e arts. 21 e 21-A, com o link do Planalto (o mesmo que a página do INSS usa). O art. 20 (o limite de 1/4) não foi fotografado: esse limite vem da página do INSS, que é a `fonte_url`.

**Tudo o que a ficha usa foi conferido por print.**

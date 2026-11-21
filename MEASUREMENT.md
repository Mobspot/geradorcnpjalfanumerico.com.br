# Medição — SPEC-0032 / B-056 / item 266

## Configuração única

`analytics-config.js`: `const GA4_MEASUREMENT_ID = "";`.
Vazio (estado entregue) ou inválido: não carrega script externo, não cria gtag/dataLayer e não coleta. Um ID G- válido carrega gtag.js oficial, ativa `window.CNPJ_ANALYTICS_ENABLED = true` e exibe a nota de privacidade no rodapé. Falha de carregamento desativa os eventos e limpa a fila; não impede uso da ferramenta.

Eventos: `generate_cnpj` só no clique (não na carga inicial); `copy_cnpj` só após sucesso do clipboard; `validate_cnpj` só com booleano `valid`; `click_mobspot` só com `link_position` topbar/footer. Nunca enviar CNPJ, entrada digitada ou clipboard.

Configuração: `anonymize_ip: true`, Google Signals e personalização de anúncios desativados; consentimento publicitário (`ad_storage`, `ad_user_data`, `ad_personalization`) negado. Contexto usa URL canônica fixa e referrer vazio para evitar dados em parâmetros/fragmentos; isso também limita atribuição de origem no GA4. Não prometemos anonimato absoluto nem ausência de cookies quando ativado.

## Search Console

Em verificação por arquivo: `googlef103b718b3ec6607.html`, uma linha exata `google-site-verification: googlef103b718b3ec6607.html`. Presente na raiz (Pages publica `main:/`) e na allowlist do build `dist/`. É verificação pública, não segredo.
Após o push/publicação pelo CEO: conferir HTTP 200 e conteúdo exato na URL pública, concluir verificação da propriedade `https://geradorcnpjalfanumerico.com.br/` e enviar `sitemap.xml`. Arquivo local não comprova propriedade verificada.

## Ativação posterior e validação real

1. Sidney/responsável Google cria propriedade e stream; informa ID G- correto. Configurar privacidade, retenção e acesso de leitura do relatório. Desativar medição otimizada (especialmente formulários, busca e cliques) e coleta de dados fornecidos pelo usuário; nenhum destino Ads conectado. O bootstrap não substitui configuração administrativa do stream.
2. Preencher apenas a constante, executar `npm run check` e publicar pelo fluxo autorizado. Sem ID real nesta rodada.
3. Conferir Realtime/DebugView e rede para os quatro eventos com dados sintéticos, ausência de entrada/CNPJ/query e ausência de recursos publicitários. Testes locais simulam o coletor, não comprovam recebimento no Google.
4. Rollback: constante vazia e republicação desliga medição. Reverter commit da rodada retorna à base `bc229d7`.

## Relatório e renovação

O coletor semanal atual é `semanal.py` da Jade no Dell, que ainda ganhará a seção do gerador. O motor B-028/SPEC-0007 segue como destino futuro; integração e primeira entrega não foram executadas aqui. Confirmar acesso às fontes e destinatários antes de declarar relatório ativo.
Vencimento: **2027-02-13**, conforme RDAP consultado pelo CEO e informado no recado de 21/11. Gate de renovação depende de janela real de uso; não há meta comercial inventada.

Referências: [configuração GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) e [controles de privacidade Google](https://developers.google.com/tag-platform/security/guides/privacy).

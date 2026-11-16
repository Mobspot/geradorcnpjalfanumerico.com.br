# Instrumentação candidata — SPEC-0031 / B-056

generate_cnpj: clique explícito, carga inicial não conta. copy_cnpj: clipboard confirmado. validate_cnpj: somente booleano valid. click_mobspot: topbar/footer. Nunca enviar CNPJ, entrada digitada ou clipboard.

Por padrão não coleta, não cria fila nem carrega biblioteca externa. Envia ao gtag somente com window.CNPJ_ANALYTICS_ENABLED === true e coletor presente. Falha de medição não bloqueia ferramenta.

Faltam: acesso administrativo à propriedade GA4 e stream web correto, ID G- confirmado, instalação/configuração da tag e decisão de consentimento/privacidade; propriedade Search Console verificada, envio de sitemap.xml e identidade de leitura para relatório; destinatários/remetente e runtime B-028. Não há conector GA4/Search Console nesta sessão nem referência de credencial aprovada na ficha. Google Drive não concede esses acessos.

Ativação exige rodada autorizada de produção, DebugView/Realtime dos quatro eventos e inspeção de rede sem entrada do usuário. Search Console depende de propriedade verificada, não de evento JS. Medição real/relatório pendentes.

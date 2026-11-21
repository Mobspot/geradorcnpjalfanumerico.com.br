# geradorcnpjalfanumerico.com.br

Gerador e validador estático de CNPJ alfanumérico para desenvolvimento, QA e homologação.

## Estado

- baseline preservada da origem `SidMiranda/cnpjalfanumerico.com.br` no commit `03d9278`;
- candidato promovido à `main` após validação;
- domínio oficial confirmado como `geradorcnpjalfanumerico.com.br`;
- publicação operada pelo GitHub Pages da organização Mobspot.
- autoria e manutenção da Mobspot visíveis no topo, rodapé e dados estruturados;
- links para `mobspot.com.br` etiquetados por origem e posição para atribuição.

## Comandos

```powershell
npm run check
npm run preview
```

O build copia somente os arquivos públicos permitidos para `dist/`. A configuração atual do Pages publica `main:/`; os arquivos públicos também estão na raiz.

GA4 preparado e desligado: a única constante é `GA4_MEASUREMENT_ID` em `analytics-config.js`, entregue vazia. Search Console em verificação pelo arquivo `googlef103b718b3ec6607.html`; confirmação depende de publicação e verificação pelo CEO. Consulte [MEASUREMENT.md](MEASUREMENT.md) para ativação, privacidade e validação.

O relatório atual (`semanal.py` da Jade no Dell) ainda ganhará a seção do gerador; B-028 permanece destino futuro. Domínio vence em **2027-02-13**, segundo RDAP informado pelo CEO. Renovação depende de dados reais. Esta rodada é local, sem push ou publicação pelo Tesseract.

Testes requerem Node >=22.8. O runner executa todos os arquivos `tests/*.test.js` no mesmo processo (`--experimental-test-isolation=none`), compatível com ambientes Windows que impedem subprocessos do runner. Os cenários de navegador permanecem isolados em contextos VM próprios.

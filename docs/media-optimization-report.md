# Relatório de otimização de mídias

O inventário detalhado, com formato, dimensões e tamanho de cada arquivo antes e depois da reorganização, está em [`media-inventory.csv`](media-inventory.csv).

## Resumo

| Categoria | Arquivos originais | Tamanho anterior | Tamanho final | Diferença |
|---|---:|---:|---:|---:|
| Fotos das unidades | 46 | 11.210.235 bytes | 7.178.056 bytes | 35,97% menor |
| Vídeos das unidades e posters | 15 vídeos | 146.233.023 bytes | 114.018.442 bytes | 22,03% menor |
| Demais imagens | 20 | 22.414.194 bytes | 1.024.487 bytes | 95,43% menor |
| **Total** | **81 mídias originais** | **179.857.452 bytes** | **122.220.985 bytes** | **32,05% menor** |

A reorganização reduziu o conjunto em 57.636.467 bytes. Cada foto de unidade possui uma variante WebP de até 480px e outra de até 960px, sem ampliação de originais menores. Os 15 vídeos receberam posters WebP.

## Distribuição preservada

| Unidade | Fotos | Vídeos |
|---|---:|---:|
| Cariacica | 18 | 6 |
| Guarapari | 3 | 1 |
| Serra | 15 | 7 |
| Vila Velha | 10 | 1 |
| **Total** | **46** | **15** |

## Limitações e decisões técnicas

- Não havia uma instalação funcional do ImageMagick: o comando disponível era somente um alias da Microsoft Store.
- O FFmpeg foi instalado após a primeira otimização. Quatorze MP4 foram preservados integralmente; o maior vídeo, da unidade Serra, foi recomprimido em H.264/AAC, mantendo duração, áudio e resolução de exibição, com redução de 46,13%.
- O encoder nativo do Chrome foi usado localmente para gerar WebP com qualidade 82%, sem envio dos arquivos a serviços externos.
- Quatro pares de arquivos de Cariacica já eram cópias binárias idênticas na origem. Os 18 arquivos foram mantidos como itens distintos para respeitar a quantidade obrigatória definida para a unidade; nenhuma referência adicional foi duplicada no JavaScript.

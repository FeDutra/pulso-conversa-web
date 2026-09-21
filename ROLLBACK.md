# ROLLBACK · FIO web

## Baseline preservada

- Branch: `pulso/base`
- Commit anterior ao casco autenticado: `a206ed604bf7b394ac669c0cdebd60d3efd74df0`
- Estado remoto confirmado em `origin/pulso/base`
- Publicação anterior preservada pelos snapshots de `/var/www/fio` criados no release.

## Reversão desta etapa

1. Identificar o commit do casco autenticado com `git log --oneline`.
2. Criar um commit reversível com `git revert <commit>`; não usar `reset --hard`.
3. Rodar os mesmos gates de tipo, estilo e build.
4. Publicar o artefato revertido em `/var/www/fio`.
5. Validar `https://fio.felipedutra.com`, Matrix e cache do HTML.

## Escopo desta etapa

- Tela inicial autenticada do FIO.
- Tratamento visual do casco Element: espaços, lista de fios, cabeçalho, conversa e compositor.
- Nenhuma alteração em protocolo, criptografia, banco, Synapse ou identidade Matrix.

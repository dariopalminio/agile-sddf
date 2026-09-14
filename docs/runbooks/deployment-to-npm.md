---
type: runbook
slug: runbook-deployment-to-npm
title: "Runbook para despliegue en npm"
date: 2026-09-13
status: ACTIVE
substatus: DONE
parent: null
---

# Runbook para despliegue en npm

Este procedimiento prepara una publicación; nunca publica sin la aprobación explícita del mantenedor.

## Precondiciones

1. El árbol de trabajo está revisado y la versión objetivo sigue SemVer. La eliminación de la copia automática de `postinstall` corresponde a `3.0.0` (major).
2. `CHANGELOG.md` contiene una sola sección `## [<versión>] — <YYYY-MM-DD>` para la versión objetivo.
3. Las verificaciones deterministas pasan sin ejecutar lifecycle scripts ni evaluaciones LLM:

   ```bash
   npm ci --ignore-scripts
   npm run verify:repository
   npm pack --dry-run
   ```

4. El `npm pack --dry-run` contiene solo la allowlist esperada: skills, agentes, configuración, scripts y documentación de distribución. No debe contener secretos, `.env`, `.tmp` ni artefactos locales.

## Preparar versión y release

Usa `npm version` para mantener `package.json` y `package-lock.json` coherentes. 

```bash
npm version patch   # 1.0.0 -> 1.0.1 (bugfix)
npm version minor   # 1.0.0 -> 1.1.0 (nueva funcionalidad)
npm version major   # 1.0.0 -> 2.0.0 (cambio incompatible)
```

Por ejemplo versión, tag y release:

```bash
npm version major
git push origin main --follow-tags
gh release create "v$(node -p "require('./package.json').version")" --generate-notes
```

Confirma que el tag apunta al commit validado y que la release usa la misma versión del changelog.

## Smoke desde el tarball

Antes de publicar, verifica el paquete que npm recibirá, no el checkout:

```bash
# En la raíz del proyecto:
npm pack
mkdir -p .tmp/test-consumer
cd .\.tmp\test-consumer
move ..\..\agile-sddf-<version>.tgz .
npm install agile-sddf-<version>.tgz --ignore-scripts
npx agile-sddf install --target claude-code
npx agile-sddf --version
```

La instalación debe dejar `node_modules` sin crear directorios de runtime por sí sola. Solo el último comando crea el destino canónico. Repite el smoke para cada runtime soportado por `config/runtimes.json` según la matriz CI; para Codex, verifica `.agents/skills` y que no se cree `.agents/agents` ni `.codex/agents`.

## Publicación con aprobación humana

> **Confirmación obligatoria:** `npm publish` es irreversible para esa versión. No ejecutes el siguiente bloque hasta que el mantenedor haya revisado el dry-run y responda afirmativamente.

```bash
npm login
npm publish --dry-run --access public
# Tras aprobación explícita del mantenedor:
npm publish --access public
```

## Verificación posterior

```bash
npm view agile-sddf@"$(node -p "require('./package.json').version")"
```

Documenta la versión publicada y cualquier desviación del smoke en la release de GitHub. Los consumidores actualizan el paquete y ejecutan explícitamente `npx agile-sddf install --target <runtime>`; `npm install` no copia artefactos de runtime.

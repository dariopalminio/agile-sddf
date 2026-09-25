---
alwaysApply: false
type: guardrail
kind: content
enforcement: error
applies-to: deliver
slug: dod-story-deliver
title: "Criterios de despliegue en producción (content guardrail)"
created: 2026-09-24
updated: 2026-09-24
---

# Criterios de despliegue en producción

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] No hay secrets ni credenciales expuestos en el código ni en los archivos publicados
- [ ] La versión en `package.json` se incrementó siguiendo SemVer (patch / minor / major según el impacto)
- [ ] El `CHANGELOG.md` incluye la entrada correspondiente a la versión publicada
- [ ] El archivo `.npmignore` (o el campo `files` en `package.json`) excluye correctamente archivos de desarrollo (tests, scripts internos, `.env`)
- [ ] `npm pack --dry-run` no incluye archivos inesperados en el paquete
- [ ] El paquete publicado puede instalarse limpiamente con `npm install agile-sddf` y ejecutarse sin errores

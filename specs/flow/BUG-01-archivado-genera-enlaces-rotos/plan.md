---
type: plan
id: plan-01
slug: plan-01-actualizar-referencias-al-archivar
title: "Reparación BUG-01 — Actualizar referencias en documentación activa al archivar"
status: DRAFT
substatus: DRAFT
parent: BUG-01
created: 2026-11-05
updated: 2026-11-05
related:
  - BUG-01-archivado-genera-enlaces-rotos
---

# Plan: Reparación BUG-01 — Actualizar referencias en documentación activa al archivar

## Contexto

`/epic-complete` y `/story-complete` archivan el work item en `specs/flow/archive/<YYYY-MM-DD>-<dir>/` (ADR-0019 / ADR-0017) pero no actualizan las referencias a su ruta original en la documentación activa. El gate `check-doc-links.js` (paso «enlaces activos» de `verify-repository.js`, workflow *Repository Quality*) falla con enlaces rotos.

- Estado actual del repo: 1 enlace roto, `docs/index.md:160` → `specs/flow/EPIC-00-estructura-base-y-mecanismo-de-templates/epic.md`. EPIC-00 se archivó el 2026-11-05 (`ae44b946`), **después** de la última regeneración de `docs/index.md` (2026-11-04, `08f2cdde`).
- Los 18 enlaces rotos del reporte (EPIC-23, STORY-124, …) se resolvieron ya con esa regeneración; el patrón es el mismo: **archivar sin refrescar las referencias**.
- `docs/index.md` declara: «Generado por `memory-system index`: no edites las entradas a mano, regenera con `/memory-system index`».
- Estrategia acordada: **reescritura determinista en ambos motores** (mismo alcance que el gate) + reparación one-off del índice actual con `memory-system index`.

## Archivos que se modifican

| Archivo | Cambio |
|---|---|
| `skills/epic-complete/scripts/epic-complete.js` | Helpers de reescritura + integración en `plan`/`apply` + exports |
| `skills/story-complete/scripts/story-complete.js` | Espejo exacto del anterior (STORY-NNN, `story.md`) |
| `skills/epic-complete/SKILL.md` | Contrato JSON (`linkUpdates`/`links`), paso en el flujo, código de error, mensaje de resultado |
| `skills/story-complete/SKILL.md` | Ídem (sus códigos viven en la tabla `## Manejo de errores`; no tiene `references/`) |
| `skills/epic-complete/references/error-codes.md` | Fila `LINKS_UPDATE_FAILED` |
| `test/epic-complete.test.js` | 5–6 casos nuevos |
| `test/story-complete.test.js` | Espejo de casos |
| `skills/epic-complete/evals/evals.json` | TC opcional (evals manuales, a criterio de cuota) |
| `docs/index.md` | One-off: regeneración con `memory-system index` (EPIC-00 pasa a la sección «Épicas e historias archivadas») |

## Diseño del motor (ambos skills, espejados)

1. **`ACTIVE_DOC_ROOTS`** — misma lista que `scripts/check-doc-links.js` (`README.md`, `SECURITY.md`, `docs/index.md`, `docs/constitution.md`, `docs/policies`, `docs/guardrails`, `docs/guides`, `docs/runbooks`), pero **tolerante a raíces ausentes** (el gate lanza si falta una raíz; el motor la salta — un proyecto instalado puede no tenerlas). Solo archivos `.md` (mismo criterio que el gate).
2. **Patrón** — `specs\/flow\/<dir-escapeado>(?![A-Za-z0-9_-])` reemplazado por `specs/flow/archive/<fecha>-<dir>`.
   - El lookahead evita colisiones de prefijo (`EPIC-00-foo` no debe reescribirse si el directorio real es `EPIC-00-foo-bar`).
   - Sin auto-match de rutas ya archivadas: el segmento `archive/` intermedio rompe el patrón.
   - Preserva BOM y finales de línea (operación sobre string completo, como `completeEpicFrontmatter`).
   - Cubre links relativos (`../specs/flow/…`), absolutos a repo (`specs/flow/…`) y menciones de ruta en texto plano; las wikilinks `[[slug]]` no se tocan (el slug no cambia al archivar).
3. **`plan`** — tras resolver `to` (y tras `ARCHIVE_CONFLICT`): calcula `linkUpdates: [{ file, count }]` **solo lectura** y lo incluye en el JSON; el resumen de confirmación del SKILL.md lo muestra. `plan` sigue sin escribir nada.
4. **`apply`** — tras el move exitoso y la verificación de conteo (respetando el orden D-8): reescribe las referencias detectadas y reporta `links: { files, occurrences }` en el JSON.
   - Si falla la E/S al reescribir: `ok: false`, `code: LINKS_UPDATE_FAILED`, con el conteo y un mensaje que aclara que **el work item SÍ quedó archivado** (a diferencia de `WRITE_FAILED`/`MOVE_FAILED`, donde no se movió nada) y sugiere `node scripts/check-doc-links.js` para ver lo pendiente.
5. **Fuera de alcance** (coherente con `HISTORICAL_EXCLUSIONS` del gate): `CHANGELOG.md`, `docs/adr/`, `specs/` — conservan el contexto en el que se escribieron.

## Orden de trabajo

1. Escribir este `plan.md` (hecho al aprobarse).
2. `epic-complete.js`:
   - `ACTIVE_DOC_ROOTS`, `activeDocFiles(repoRoot)` (walk `.md` solo de raíces existentes), `findLinkUpdates(repoRoot, from)` (solo lectura), `updateLinkReferences(repoRoot, from, to)` (escribe solo los archivos con coincidencias).
   - `planCompletion`: añadir `linkUpdates` al resultado.
   - `applyCompletion`: tras el conteo, invocar `updateLinkReferences`; en éxito, `links` en el JSON y mención en `message`; en fallo, `LINKS_UPDATE_FAILED`.
   - Exportar los helpers en `module.exports` (estilo de `locateEpic`, `archiveDateOf`).
3. `story-complete.js`: espejo exacto (STORY-NNN, `story.md`).
4. SKILL.md de ambos:
   - Flujo `plan`: el JSON incluye `linkUpdates`; el resumen de confirmación lista archivos y ocurrencias.
   - Flujo `apply`: el motor reescribe las referencias tras el move y las reporta en `links`.
   - Resultado: `✅ <item> archivada en <to>/ — N referencia(s) actualizada(s) en M archivo(s)` (o «sin referencias actualizables»); nota opcional: «Para reclasificar la entrada en la sección de archivadas de `docs/index.md`, regenera el índice con `/memory-system index`».
   - Errores: fila `LINKS_UPDATE_FAILED` (en `references/error-codes.md` para epic; en la tabla `## Manejo de errores` del SKILL.md para story).
   - Conservar `<!-- SDDF-FIXED-LAYOUT: v1 -->` (lo valida `verify-fixed-layout.js`).
5. Tests (`node:test`, dirs temporales, nunca el repo real; convención de `test/epic-complete.test.js` / `test/story-complete.test.js`):
   - `plan` con un link en `docs/index.md` → `linkUpdates` reporta 1 ocurrencia y `docs/index.md` queda byte a byte igual.
   - `apply` → el link se reescribe a `../specs/flow/archive/<hoy>-<dir>/…` y el resto del archivo no cambia.
   - sin referencias en documentación activa → `linkUpdates: []` en plan; `links: { files: 0, occurrences: 0 }` en apply; nada tocado.
   - colisión de prefijo → solo se reescribe el directorio exacto archivado; el hermano más largo no toca.
   - raíces ausentes (`docs/policies`, `SECURITY.md`) → no lanza; actualiza solo lo existente.
   - múltiple ocurrencia en el mismo archivo → `count` correcto y todas reescritas.
6. One-off en este repo:
   - `node skills/memory-system/scripts/memory-system.js index` (vía canónica; EPIC-00 sale de «Épicas» y entra a «Épicas e historias archivadas» con su ruta correcta).
   - `node scripts/check-doc-links.js` debe reportar 0 enlaces rotos.
   - Fallback si el diff de regeneración es anómalo: edición quirúrgica de `docs/index.md:160` a la ruta archivada (contra la instrucción del propio archivo; solo con justificación).
7. Evals opcionales (manuales, a criterio de cuota): TC en `skills/epic-complete/evals/evals.json` y el de `story-complete` con fixture que incluya `docs/index.md`; `npm run test:eval -- epic-complete` / `-- story-complete`.
8. Verificación completa (paso Verificación).

## Riesgos

- `docs/index.md` es un artefacto generado: la reescritura in-place deja la entrada en la sección «Épicas» apuntando a archive (link válido, CI verde); la reclasificación semántica queda en la regeneración opcional `/memory-system index` (práctica actual del equipo, ya usada tras EPIC-23).
- `LINKS_UPDATE_FAILED` deja el work item archivado: el mensaje **no** puede prometer «nada movido» (difiere de `WRITE_FAILED`/`MOVE_FAILED`).
- El motor diverge deliberadamente del gate en raíces ausentes (gate = fail-closed, motor = leniente) — cubierto por test.
- `story-complete` no tiene `references/`; no se crea estructura nueva: el código se documenta en su tabla de errores.
- La reescritura también toca rutas dentro de fences/inline code (el gate las enmascara al validar, pero actualizarlas conserva los ejemplos exactos) — riesgo bajo.
- WIP: el bug está en `PLAN/IN-PROGRESS`; este plan es su artefacto de fase y no consume el WIP-Limit de épicas (1) ni de historias (2).

## Verificación

1. `npm test` — casos nuevos + regresión de los existentes (`node --test test`).
2. `node scripts/check-doc-links.js` — 0 enlaces rotos tras el one-off.
3. `npm run verify:layout` — marcadores `SDDF-FIXED-LAYOUT: v1` de los SKILL.md intactos.
4. `npm run verify:repository` — gate completo (pruebas deterministas, sintaxis, layout, perfiles, runtimes, config, evals, contrato de validación, **enlaces activos**, supply-chain, seguridad, release, tarball, smoke).
5. `graphify update .` — actualizar el grafo tras los cambios (regla del repo, costo AST-only).

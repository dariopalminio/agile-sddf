# Tasks: BUG-01 — Reparación de enlaces rotos al archivar

Checklist de progreso del plan (`plan.md`). Fuente: `specs/flow/BUG-01-archivado-genera-enlaces-rotos/plan.md`.

## Estado

| # | Tarea | Estado |
|---|---|---|
| 1 | `plan.md` escrito en el directorio del bug | ✅ DONE |
| 2 | `epic-complete.js`: helpers de reescritura + `plan`/`apply` + exports | ✅ DONE (smoke test OK, incl. `LINKS_UPDATE_FAILED`) |
| 3 | `story-complete.js`: espejo de `epic-complete.js` | ✅ DONE (smoke test OK) |
| 4 | SKILL.md de ambos + `error-codes.md` (`LINKS_UPDATE_FAILED`, contrato JSON) | ✅ DONE |
| 5 | Tests: `test/epic-complete.test.js` y `test/story-complete.test.js` | ✅ DONE (51/51 y 41/41) |
| 6 | One-off: `memory-system index` + `check-doc-links` sin rotos | ✅ DONE (EPIC-00 → archive, 0 rotos) |
| 7 | Evals opcionales en `evals.json` de ambos skills | ⏸ OPCIONAL (manual, cuota) |
| 8 | Verificación completa: `npm test`, `verify:layout`, `verify:repository`, `graphify update` | ✅ DONE (501/501, gates OK) |

## Detalle de tareas

### 2. `skills/epic-complete/scripts/epic-complete.js`
- [x] `ACTIVE_DOC_ROOTS` (misma lista que `check-doc-links.js`, tolerante a raíces ausentes)
- [x] `activeDocFiles(repoRoot)` — walk `.md` solo de raíces existentes
- [x] `findLinkUpdates(repoRoot, from)` — solo lectura, `[{ file, count }]`
- [x] `updateLinkReferences(repoRoot, from, to)` — escribe solo archivos con coincidencias
- [x] `planCompletion`: añadir `linkUpdates` al resultado
- [x] `applyCompletion`: tras el conteo, reescribir; éxito → `links` + `message`; fallo → `LINKS_UPDATE_FAILED`
- [x] Exportar helpers en `module.exports`

### 3. `skills/story-complete/scripts/story-complete.js`
- [x] Espejo exacto (STORY-NNN, `story.md`)

### 4. Documentación de skills
- [x] `skills/epic-complete/SKILL.md`: `linkUpdates`/`links` en el contrato, paso en el flujo, resultado, error
- [x] `skills/story-complete/SKILL.md`: ídem (tabla `## Manejo de errores`)
- [x] `skills/epic-complete/references/error-codes.md`: fila `LINKS_UPDATE_FAILED`
- [x] Conservar `<!-- SDDF-FIXED-LAYOUT: v1 -->` en ambos SKILL.md

### 5. Tests
- [x] `plan` con link en `docs/index.md` → `linkUpdates` 1 ocurrencia; archivo byte a byte igual
- [x] `apply` → link reescrito a `archive/<hoy>-<dir>/…`; resto intacto
- [x] Sin referencias → `linkUpdates: []` / `links: { files: 0, occurrences: 0 }`; nada tocado
- [x] Colisión de prefijo → solo el directorio exacto se reescribe
- [x] Raíces ausentes → no lanza; actualiza solo lo existente
- [x] Múltiple ocurrencia en el mismo archivo → `count` correcto
- [x] Espejo completo en `test/story-complete.test.js`

### 6. One-off en el repo
- [x] `node skills/memory-system/scripts/memory-system.js index --root docs`
- [x] `node scripts/check-doc-links.js` → 0 enlaces rotos

### 7. Evals opcionales
- [ ] TC en `skills/epic-complete/evals/evals.json` (fixture con `docs/index.md`)
- [ ] TC en `skills/story-complete/evals/evals.json`
- [ ] `npm run test:eval -- epic-complete` / `-- story-complete` (manual, cuota)

### 8. Verificación
- [x] `npm test` (501/501)
- [x] `node scripts/check-doc-links.js` (0 rotos)
- [x] `npm run verify:layout` (43 skills OK)
- [x] `npm run verify:repository` (gate determinista OK)
- [x] `graphify update .` (15552 nodos)

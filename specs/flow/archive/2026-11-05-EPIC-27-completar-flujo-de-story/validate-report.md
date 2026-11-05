---
type: epic-validate
id: EPIC-27
slug: EPIC-27-completar-flujo-de-story-validate-report
title: "Epic validate: Completar flujo de story"
epic: EPIC-27
verdict: APPROVED
created: 2026-10-26
updated: 2026-10-26
related:
  - EPIC-27-completar-flujo-de-story
---
<!-- Referencias -->
[[EPIC-27-completar-flujo-de-story]]

# Validación de épica: Completar flujo de story

## Veredicto
**Veredicto:** APPROVED (`READY-TO-SHIP`=`VALIDATE/DONE` — las tres condiciones se cumplen).
Informativo: esta validación no cambia el estado de la épica. La transición a `SHIP` la escribe un humano o CI/CD.

## Resumen

| # | Condición | Resultado |
|---|---|---|
| 1 | Historias hijas en estado terminal | ✅ Cumple |
| 2 | `epic-analyze-report.md` con Veredicto `APPROVED` | ✅ Cumple |
| 3 | Criterios de salida y smoke tests | ✅ Cumple |

## Condición 1 — Historias hijas

Las seis historias declaran `parent: EPIC-27-completar-flujo-de-story` y están en `CODE-REVIEW/DONE` (estado terminal admitido).

| Historia | Estado |
|---|---|
| STORY-159 | CODE-REVIEW/DONE |
| STORY-160 | CODE-REVIEW/DONE |
| STORY-161 | CODE-REVIEW/DONE |
| STORY-162 | CODE-REVIEW/DONE |
| STORY-163 | CODE-REVIEW/DONE |
| STORY-164 | CODE-REVIEW/DONE |

## Condición 2 — Reporte de análisis

`epic-analyze-report.md` existe en la carpeta de la épica y declara `Veredicto: APPROVED` con 0 hallazgos ERROR y 0 WARNING.

## Condición 3 — Criterios de salida y smoke tests

### Criterios de salida

| ID | Resultado | Evidencia |
|---|---|---|
| CS-1 | ✅ | `skills/story-delivery/SKILL.md` y `skills/story-complete/SKILL.md` existen y declaran `<!-- SDDF-FIXED-LAYOUT: v1 -->`; `package.json` incluye `skills/` completo en `files` |
| CS-2 | ✅ | 16 de 16 evals de `story-delivery` pasan (`npm run test:eval -- story-delivery`, ejecutado por el humano): lectura de `delivery-model` (TC-005, TC-007, TC-008), DoD criterio por criterio (TC-001, TC-003, TC-016), `--dry-run` y `--force` (TC-010 a TC-014) |
| CS-3 | ✅ | Motor `story-complete.js` probado en un repo temporal: `DELIVER/DONE` → `COMPLETED/DONE` archivada en `archive/<fecha>-STORY-NNN-<slug>/` con conteo 1 → 1; `ACCEPTANCE/DONE` rechazada con `NOT_DELIVERED`; `CANCELED/DONE` archivada conservando `CANCELED` |
| CS-4 | ✅ | `--strategy story`: 31 skills, 0 `epic-*`. `--strategy full` y sin flag ni TTY: 37 skills. `--strategy foo`: código de salida 1 y 0 archivos copiados |
| CS-5 | ✅ | `docs/domains/domain-state-management.md` (§6 y línea 129) y `docs/domains/domain-story-lifecycle.md` documentan las escrituras de `DELIVER` y `COMPLETED` con confirmación humana; ADR-0017 reemplaza a ADR-0016 (`superseded-by: ADR-0017`) |
| CS-6 | ✅ | `npm run verify:repository` aprobado; `npm test`: 352 de 352 pruebas; árbol git limpio |

### Smoke tests

| Smoke | Resultado | Evidencia |
|---|---|---|
| SMOKE-1 — Entrega y archivado | ✅ | Entrega: TC-001 (`ACCEPTANCE/DONE` → `DELIVER/DONE` tras confirmación y remisión a `/story-complete`). Archivado: motor `story-complete.js` en fixture temporal (ver CS-3) |
| SMOKE-2 — Dry-run sin efectos | ✅ | TC-010 y TC-012: se muestra la tabla del DoD y la acción que se ejecutaría, no se pregunta la confirmación final y se informa que ningún archivo se creó, modificó ni borró |
| SMOKE-3 — Instalación solo story | ✅ | `node scripts/cli.js install --strategy story --target claude-code` en un directorio vacío: 19 skills `story-*` y ningún `epic-*` |

### Tests manuales: Archiving Stories

#### Test: archivar una historia COMPLETED/DONE:
STORY-054 is already COMPLETED/DONE, so it only needs to be archived and story.md won't be edited. The archive folder date, 2026-05-02, comes from its frontmatter. Nothing has been written or moved yet.


 story-complete — STORY-054
   Estado actual:  COMPLETED/DONE
   Acción:         sin cambio de status (ya COMPLETED/DONE)
   Origen:         specs/flow/STORY-054-inicializar-entorno-sddf/
   Destino:        specs/flow/archive/2026-05-02-STORY-054-inicializar-entorno-sddf/
   Movimiento:     git-mv
¿Confirmas completar y archivar STORY-054 en specs/flow/archive/2026-05-02-STORY-054-inicializar-entorno-sddf/? (s/n)/story-complete STORY-054
 STORY-054 is archived. It stays COMPLETED/DONE and story.md wasn't edited.
 STORY-054 archivada en specs/flow/archive/2026-05-02-STORY-054-inicializar-entorno-sddf/
   El movimiento quedó en el índice de git (git-mv); el commit queda a cargo del usuario.
The total of active plus archived stories is still 156. Three renames are now staged but not committed: STORY-032, STORY-033 and STORY-054.

You had STORY-054's story.md open in the editor. That tab now points to the old location; the file is at story.md.
✅ PASS

#### Test: archivar una historia CANCELED/DONE:
/story-complete STORY-036
STORY-036 is canceled, so it can be archived as it is. Its status stays CANCELED and story.md won't be edited. Nothing has been written or moved yet.


 story-complete — STORY-036
   Estado actual:  CANCELED/DONE
   Acción:         sin cambio de status (CANCELED/DONE)
   Origen:         specs/flow/STORY-036-openspec-init-config/
   Destino:        specs/flow/archive/2026-04-23-STORY-036-openspec-init-config/
   Movimiento:     git-mv
¿Confirmas archivar STORY-036 (CANCELED/DONE, el status no cambia) en specs/flow/archive/2026-04-23-STORY-036-openspec-init-config/? (s/n)s
STORY-036 is archived. Its status stayed CANCELED/DONE and story.md wasn't edited.


 STORY-036 archivada como CANCELED (status sin cambios): specs/flow/archive/2026-04-23-STORY-036-openspec-init-config/
   El movimiento quedó en el índice de git (git-mv); el commit queda a cargo del usuario.
The total of active plus archived stories is still 156. Four renames are now staged but not committed: STORY-032, STORY-033, STORY-054 and STORY-036.

Your editor tab for story.md now points to the old location; the file is at story.md.
✅ PASS

#### Test: archivar una historia READY-FOR-VERIFY/DONE (caso negativo, debe fallar):/story-complete STORY-070
Bash Plan completion of STORY-070
IN
node skills/story-complete/scripts/story-complete.js plan --repo-root . --id STORY-070; echo "exit=$?"

OUT
{
  "ok": false,
  "code": "NOT_DELIVERED",
  "message": "La historia STORY-070 está en READY-FOR-VERIFY/DONE: story-complete requiere DELIVER/DONE, COMPLETED/DONE o CANCELED/DONE. Ejecuta antes /story-delivery STORY-070",
  "story": {
    "id": "STORY-070",
    "dir": "specs/flow/STORY-070-dod-code-review-en-story-code-review",
    "status": "READY-FOR-VERIFY",
    "substatus": "DONE"
  }
}
exit=1
7:02 PM
STORY-070 can't be archived yet: it is in READY-FOR-VERIFY/DONE, which isn't a finished state. I didn't ask for confirmation and nothing was changed or moved.


 La historia STORY-070 está en READY-FOR-VERIFY/DONE: story-complete requiere DELIVER/DONE, COMPLETED/DONE o CANCELED/DONE. Ejecuta antes /story-delivery STORY-070
The engine suggests /story-delivery, but that skill needs the story in ACCEPTANCE/DONE, so running it now would be blocked too. The usual path from here is:

/story-verify STORY-070
/story-acceptance STORY-070
/story-delivery STORY-070
/story-complete STORY-070
If STORY-070 won't go further, mark it CANCELED/DONE and /story-complete will archive it unchanged.
✅ PASS

## Limitaciones

- Los `expected` de los evals son `contains` y `not_contains` sobre el texto de salida; no inspeccionan el sistema de archivos. Que `--dry-run` no modifique nada queda respaldado por la conducta declarada del skill, no por un diff real.
- `story-delivery` no tiene motor determinista, así que SMOKE-1 y SMOKE-2 no se ejecutaron de punta a punta sobre una historia real: ninguna historia del repositorio estaba en `ACCEPTANCE/DONE`.
- Verificación opcional para cerrar el hueco: ejecutar `/story-delivery STORY-NNN --dry-run` sobre una historia temporal y comprobar que `git status` queda limpio.

## Pasos siguientes

- La transición de la épica a `SHIP` es manual o la dispara CI/CD; ningún skill la escribe.

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

## Limitaciones

- Los `expected` de los evals son `contains` y `not_contains` sobre el texto de salida; no inspeccionan el sistema de archivos. Que `--dry-run` no modifique nada queda respaldado por la conducta declarada del skill, no por un diff real.
- `story-delivery` no tiene motor determinista, así que SMOKE-1 y SMOKE-2 no se ejecutaron de punta a punta sobre una historia real: ninguna historia del repositorio estaba en `ACCEPTANCE/DONE`.
- Verificación opcional para cerrar el hueco: ejecutar `/story-delivery STORY-NNN --dry-run` sobre una historia temporal y comprobar que `git status` queda limpio.

## Pasos siguientes

- La transición de la épica a `SHIP` es manual o la dispara CI/CD; ningún skill la escribe.

---
type: implement-report
id: STORY-114
slug: STORY-114-migrate-specs-3-levels-implement-report
title: "Implement Report: migración specs de tres niveles"
story: STORY-114
created: 2026-10-11
updated: 2026-10-11
---

# Reporte de implementación: migración specs de tres niveles

## Resumen

Se incorporó `memory-system migrate --from=specs-3-levels`, con dry-run, idempotencia,
migración de producto y requisitos, movimientos de épicas e historias, reescritura de wikilinks y
reportes deterministas de conflicto. Las 35 tareas de esta historia están cerradas. La ejecución
real de los evals TC-023 y TC-024 se trasladó como QA pendiente de la épica por instrucción del
usuario; no se declara como aprobada en este reporte.

| Métrica | Valor |
|---|---:|
| Tareas de la historia | 35 |
| Tareas cerradas | 35 |
| Tareas bloqueadas | 0 |
| Validaciones de eval trasladadas | 2 (TC-023, TC-024) |

**Estado:** ✅ Implementación completa — `IMPLEMENT/DONE`.

## Trabajo realizado

| Tareas | Resultado | Evidencia |
|---|---|---|
| T001–T004 | Línea base y fixture legacy de tres niveles | `examples/specs-3-levels/` |
| T005–T025 | Motor, parser estricto, conflictos, migración, renombrados y reportes | `scripts/specs-3-levels.js` y `memory-system.js` |
| T026–T030 | Evals declarados, contrato, reglas, README y changelog | `evals/evals.json`, `SKILL.md`, referencias y `CHANGELOG.md` |
| T031, T033–T035 | Suite, CR-005, encoding, enlaces y validación manual | `.tmp/story-implement/STORY-114/ac-manual.md` y gates del repositorio |
| T032 | Traslado de la aprobación efectiva de evals | [[EPIC-21-colapsar-specs-dos-niveles]] → Seguimiento pendiente |

## Verificación ejecutada

- `npm test`: 229 pruebas aprobadas.
- `node --test test/memory-system.test.js`: 63 pruebas aprobadas.
- `npm run verify:eval-inventory`: aprobado; `TC-023` y `TC-024` están registrados.
- `npm run verify:syntax`, `npm run verify:links` y `node scripts/audit-root-resolution.js`: aprobados.
- Migración manual: dry-run inicial, aplicación, `index`, `check` con 0 problemas y dry-run final
  con 0 cambios pendientes.

## Seguimiento transferido a la épica

La tarea de QA de [[EPIC-21-colapsar-specs-dos-niveles]] debe ejecutar
`npm run test:eval -- memory-system --only TC-023,TC-024 --eval-runner codex`, aprobar ambos
casos y registrar el resultado individual. Si falla, debe corregir el skill, el motor o el runner,
sin alterar las aserciones. Esta transferencia conserva la deuda de validación explícita y no
equivale a una aprobación de los evals.

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / justificación |
|---|---|---|---|
| 1–4 | Escenarios, CNF, diseño y regresiones | ✓ | Cobertura S114, migración manual y suites de prueba aprobadas. |
| 5–14 | Convenciones, limpieza, dependencias y seguridad | ✓ | Sin dependencias nuevas ni secretos; contratos y código revisados por las tareas T005–T030. |
| 15 | Evals declarados | ✓ | `evals/evals.json` contiene TC-023 y TC-024; inventario aprobado. |
| 16 | Evals ejecutados automáticamente | ⚠️ | Ejecución y aprobación efectiva transferidas a la tarea QA de EPIC-21 por instrucción del usuario. |
| 17 | Tareas completas | ✓ | T001–T035 están marcadas `[x]`; T032 mantiene la trazabilidad hacia la épica. |
| 18–20 | Documentación, decisiones y release | ✓ | SKILL, README, reglas y CHANGELOG actualizados. |
| 21 | CI | ✓ | Suite y gates deterministas ejecutados correctamente. |
| 22–24 | Secretos, variables y reversibilidad | ✓ | Sin secretos ni variables nuevas; migración con dry-run y cambios recuperables por Git. |

**Resumen:** 23/24 criterios ✓ · 1 advertencia transferida a EPIC-21 · 0 errores bloqueantes.

---
type: smoke-report
id: EPIC-23
slug: EPIC-23-report-SMOKE-5-20261104
title: "Smoke report: SMOKE-5 de EPIC-23"
epic: EPIC-23
smoke: SMOKE-5
result: PASS
created: 2026-11-04
updated: 2026-11-04
related:
  - EPIC-23-completar-flujo-de-epic
---
[[EPIC-23-completar-flujo-de-epic]]

# Smoke report: SMOKE-5 de EPIC-23

**Resultado:** `PASS` — la historia huérfana entra al índice como línea F2 y el nuevo análisis declara `APPROVED`.

**Fecha:** 2026-11-04 | **Ejecutor:** Claude Code (Opus 5.5), recorrido a mano en sesión | **Fixture:** `skills/epic-refine/examples/huerfana-y-related-roto/`

| Paso de SMOKE-5 | Estado | Evidencia |
|---|---|---|
| Dado una épica cuyo `epic-analyze-report.md` declara `NEEDS-REFINEMENT` por una historia huérfana | ✅ | `verdict: NEEDS-REFINEMENT`, con `H-001 [ERROR] INT-02` (STORY-304) y `H-002 [WARNING] MAD-02` (STORY-999); STORY-304 no figura en el índice |
| Cuando se ejecuta `/epic-refine` con confirmación | ✅ | Plan con C-01 y C-02, respuesta `s`: 2 hallazgos aplicados · 0 ya resueltos · 0 fuera de alcance |
| Y de nuevo `/epic-analyze` | ✅ | Reporte sobrescrito, con `created` conservado (2026-10-26) y `updated: 2026-11-04` |
| Entonces el índice de `epic.md` incluye la historia como línea F2 | ✅ | `epic.md:26` (línea literal en «Efectos en disco») |
| Y el nuevo análisis declara `APPROVED` | ✅ | `verdict: APPROVED`, `errors: 0`, `warnings: 0`; contrato de salida 2/2 cubiertos; madurez de historias 4/4 listas |

## Efectos en disco

Medidos con `git status` y `git diff` contra una línea base del sandbox:

| Invocación | Archivos escritos |
|---|---|
| `/epic-refine EPIC-30` | `epic.md`, `epic.md.bak` y `epic-refine-report.md` de la épica; `story.md` y `story.md.bak` de STORY-301 |
| `/epic-analyze EPIC-30` | `epic-analyze-report.md` |

Cambios de `/epic-refine`, además de `updated` en ambos archivos:

- `epic.md:26`, línea añadida: `- [ ] **STORY-304** — Exportar pedidos a CSV: Como responsable de ventas, quiero exportar los pedidos del mes a CSV, para cargarlos en la hoja de cálculo de comisiones`
- `story.md:15` de STORY-301, línea eliminada: `  - STORY-999`

Los dos `.bak` son idénticos a la línea base, y `status` y `substatus` no cambiaron en ningún archivo.

## Alcance y límites

- **Sandbox:** copia desechable del fixture en el directorio temporal de la sesión, con su propio git y usada como `REPO_ROOT`. El recorrido no modificó ningún archivo del repositorio salvo este reporte y la nota de SMOKE-5 en `epic.md`.
- **Versiones de los skills:** `/epic-refine` siguió `skills/epic-refine/SKILL.md` y sus catálogos, porque el skill no está instalado en ningún runtime. `/epic-analyze` siguió `.claude/skills/epic-analyze/SKILL.md`, que difiere de la fuente solo en el bloque de épicas archivadas, que este recorrido no alcanza.
- **No es una ejecución aislada:** no se usó `npm run test:eval`, y el ejecutor conocía el resultado esperado. Por eso los efectos en disco se midieron con git y los cruces del análisis (índice, `parent`, `related` y menciones E1) se recalcularon con un script aparte, con el mismo resultado. La primera mitad sí tiene una ejecución aislada: `epic-refine` TC-023, registrada en el `verify-report.md` de STORY-165.

## Observación

**La cita de CS-1 del fixture no casa como E1.** El `story.md:36` de STORY-304 cita el criterio sin `**CS-1** —`, y el Paso 5b de `epic-analyze` exige el texto completo, que incluye ese prefijo. Aplicada literal, la regla deja CS-1 cubierto por E2 (`AC-1`, `story.md:30`: `Entonces se descarga "pedidos-2026-10.csv" con una fila por pedido`), no por la mención que muestra el reporte de partida del fixture. El veredicto no cambia. Ningún caso de `skills/epic-analyze/evals/evals.json` usa la forma `**CS-N** —` que declara `docs/templates/epic-template.md`, así que ningún eval fija esta lectura.

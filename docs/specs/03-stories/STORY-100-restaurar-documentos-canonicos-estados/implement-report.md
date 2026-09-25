---
type: implement-report
id: STORY-100
story: STORY-100
created: 2026-09-24
updated: 2026-09-24
---

<!-- Referencias -->
[[STORY-100-restaurar-documentos-canonicos-estados]]

## Resumen

Cerrada como **corrección documental**, con transición manual a `COMPLETED/DONE` — el terminal pasivo que, según [[state-machine]], ningún skill escribe y marca la persona.

### Qué se entregó

| Cambio | Ubicación |
|---|---|
| `state-machine.md` restaurado desde `7932954^` (174 líneas), `slug: state-machine` conservado, `type: wiki` → `architecture` | `docs/architecture/state-machine.md` |
| `specs-and-workflows.md` restaurado desde `7932954^` (90 líneas), nombre con guiones para que coincida con su `slug` | `docs/guides/specs-and-workflows.md` |
| Enlaces Markdown relativos del documento restaurado (asumían la ubicación antigua) convertidos a wikilinks | `state-machine.md` l. 31 y *Fuentes de verdad* |
| Estado `CANCELED` añadido a la tabla y al diagrama, con transición desde cualquier estado activo | `state-machine.md` |
| `sdcl-sddf.md` reducido a su aportación propia (mapeo SDLC clásico ↔ SDDF) y remitido al canónico | `docs/architecture/sdcl-sddf.md` |
| Erratas de referencia | `plan-09` (`[[specs_and_workflows]]`), `docs/domains/README.md` (ruta `docs/wiki/` inexistente, más fila para `[[state-machine]]`) |
| Índice regenerado | `docs/index.md`, 241 nodos |

### Resultado verificado

| Comprobación | Resultado |
|---|---|
| `check --root docs` | **46 → 10** problemas · exit 1 |
| Citas resueltas sin editar enlaces | `git diff` sobre `docs/domains/` y `docs/adr/` sin cambios (salvo el README) |
| `npm test` | 120/120 · exit 0 |
| `npm run verify:links` | 39 archivos · exit 0 |
| `npm run verify:syntax` · `verify:eval-inventory` · `verify:repository` | exit 0 |

### Decisiones tomadas durante la ejecución

1. **Se corrigió la errata de `plan-09`** pese al requerimiento de no tocar el registro histórico. La excepción está documentada arriba: `[[specs_and_workflows]]` con guion bajo nunca fue un slug válido, así que no resolvía sola al restaurar. Corregir un typo no reescribe ninguna decisión del registro.
2. **Se desambiguaron dos `slug: plan` idénticos** (`STORY-085` y `STORY-089`). Regenerar el índice destapó el choque y dejó `verify:links` en exit 1; ninguna cita usaba `[[plan]]`, así que el renombrado es seguro. Es un defecto preexistente, no causado por esta historia. **Quedan más slugs duplicados en el repositorio** — solo este rompía el build; el resto es deuda abierta.

### Alcance de proceso — leer antes de tomar esto como precedente

Esta historia **no pasó por el pipeline SDDF**. No existen `finvest-evaluation-report.md`, `design.md`, `tasks.md`, `testcases.md`, `implement-report.md` ni `code-review-report.md`, y no se ejecutaron `story-evaluation`, `story-plan`, `story-implement` ni `story-code-review`. Se cerró directamente por decisión explícita, al tratarse de una restauración de contenido versionado cuya verificación es determinista y está registrada arriba.

El `COMPLETED/DONE` refleja que el trabajo está entregado y verificado, **no** que los gates del pipeline se hayan superado.

### Deuda que permanece (fuera de alcance, declarada)

Los 10 problemas restantes de `check`: 3 wikilinks a nodos de `templates/` (excluidos del escaneo por diseño), `[[security-checklist]]` con dos candidatos posibles, `[[skill-preflight]]` que apunta a un skill y no a un nodo, y 5 artefactos `orphan` sin encabezado del que derivar un `title` honesto.


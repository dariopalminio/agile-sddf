---
type: epic-validate
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles-validate-report
title: "Epic validate: Colapsar specs/ a dos niveles y eliminar 01-projects/"
epic: EPIC-21
verdict: APPROVED
created: 2026-10-13
updated: 2026-10-13
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - STORY-118-requirements-srs-unico-primero
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[STORY-118-requirements-srs-unico-primero]]

# Validate report — EPIC-21

## Veredicto

**APPROVED.** Todas las historias hijas están en un estado terminal (`COMPLETED` o `CANCELED`).

Las condiciones 1, 2 y 3 se cumplen: la épica puede pasar a `READY-TO-SHIP`.

| # | Condición | Resultado |
|---|-----------|-----------|
| 1 | Todas las historias hijas están `COMPLETED` o `DELIVER/DONE` | ✅ PASA |
| 2 | Los smoke tests de la épica pasan | ✅ PASA |
| 3 | Las tareas de prueba registradas pasan (`npm run verify:release`) | ✅ PASA |

## 1. Historias hijas en estado terminal: PASA

Se revisaron los 18 `story.md` que declaran `parent: EPIC-21`. `CANCELED` se cuenta como terminal porque así lo define [state-machine.md](../../../architecture/state-machine.md) ("Estado terminal pasivo").

| Historia | status / substatus | Terminal |
|----------|--------------------|----------|
| STORY-103 | COMPLETED / DONE | ✅ |
| STORY-104 | COMPLETED / DONE | ✅ |
| STORY-105 | COMPLETED / DONE | ✅ |
| STORY-106 | COMPLETED / DONE | ✅ |
| STORY-107 | COMPLETED / DONE | ✅ |
| STORY-108 | COMPLETED / DONE | ✅ |
| STORY-109 | COMPLETED / DONE | ✅ |
| STORY-110 | COMPLETED / DONE | ✅ |
| STORY-111 | COMPLETED / DONE | ✅ |
| STORY-112 | COMPLETED / DONE | ✅ |
| STORY-113 | COMPLETED / DONE | ✅ |
| STORY-114 | COMPLETED / DONE | ✅ |
| STORY-115 | COMPLETED / DONE | ✅ |
| STORY-116 | COMPLETED / DONE | ✅ |
| STORY-117 | CANCELED / DONE | ✅ |
| **STORY-118** | **COMPLETED / DONE** | **✅** |
| STORY-119 | CANCELED / DONE | ✅ |
| STORY-123 | COMPLETED / DONE | ✅ |

El code review de STORY-118 está aprobado (`review-status: approved`, 0 HIGH, 0 MEDIUM, 14 LOW). La historia ha alcanzado `COMPLETED`, por lo que ya no le faltan fases.

## 2. Smoke tests: PASA

El repositorio es un paquete CLI y no tiene un entorno de staging. Cada smoke test se ejecutó con el motor `skills/memory-system/scripts/memory-system.js` en repositorios temporales fuera del árbol versionado.

### SMOKE-1: Scaffolding limpio crea solo dos niveles en `specs/` (PASA)

- Comando: `memory-system.js scaffold --root <tmp>/docs --cli-root <repo>`. Exit 0, 30 archivos creados.
- Se crean `docs/specs/epics/` y `docs/specs/stories/`.
- No se crean `01-projects/`, `02-epics/` ni `03-stories/`.
- Se crean `docs/product/vision.md`, `stakeholders.md` y `roadmap.md`.
- Se crea un único `docs/requirements/srs-smoke1.md`, sin carpetas `functional/` ni `non-functional/` vacías.

### SMOKE-2: Migración de un repo de tres niveles (PASA)

- Fixture: `skills/memory-system/examples/specs-3-levels`.
- Comando: `memory-system.js migrate --root <tmp>/docs --from specs-3-levels`. Exit 0. Resultado: 9 creados, 4 movidos, 2 actualizados y 9 eliminados.
- El contenido de `01-projects/` se migra así:
  - `project-intent.md` pasa a `product/vision.md`.
  - `project.md` se reparte en `product/stakeholders.md`, `product/objectives.md` y 3 FR + 2 NFR en `requirements/`.
  - `project-plan.md` pasa a `product/roadmap.md`.
  - `story-map.md` pasa a `product/story-map.md`.
  - `context-diagram.puml` pasa a `architecture/c4/context-diagram.puml`.
- `02-epics/` se renombra a `epics/` y `03-stories/` se renombra a `stories/`.
- Una segunda ejecución con `--dry-run` informa `cambios pendientes: 0` (idempotente).

### SMOKE-3: Navegabilidad intacta tras el colapso (PASA)

- El fixture original no tiene `parent`/`related` ni wikilinks entre épica e historia. Para este smoke se usó una copia enriquecida:
  - La épica declara `related: [STORY-001-a]` y enlaza a la historia con `[[STORY-001-a]]`.
  - La historia declara `parent: EPIC-00` y `related: [EPIC-00-demo]`, y enlaza a la épica con `[[EPIC-00-demo]]`.
- Tras la migración, el frontmatter de ambas conserva intactas sus referencias `parent`/`related`.
- Todos los wikilinks fuera de bloques de código resuelven, incluidos `[[EPIC-00-demo]]` y `[[STORY-001-a]]`. `[[requirements-catalog]]` se resuelve por el `slug` de `requirements/index.md`.
- `memory-system.js index` regenera `docs/index.md` con 14 nodos (0 sin frontmatter, 0 pendientes).
- `memory-system.js check` informa `problemas: 0`.
- El único enlace sin destino, `[[PROJ-01-demo]]`, está dentro de un bloque de código cercado. El fixture lo incluye a propósito para comprobar que la migración no reescribe código, así que no es un wikilink navegable.

## 3. Tareas de prueba: PASA

```text
> agile-sddf@3.3.1 verify:release
> node scripts/verify-release.js

[OK] Release gate válido para 3.3.1.
```

Exit code 0.

## Seguimiento QUALITY (2026-10-13)

Validación de la sección "Seguimiento pendiente para VALIDATE (fase QUALITY)" de `epic.md`. Las correcciones se hicieron in situ en la fase QUALITY, como autorizan los ítems 3 y 5 («ajustar el skill o el agente, no las aserciones, y repetir»). No se crearon ni se reabrieron historias.

| # | Ítem | Antes | Después | Estado |
|---|------|-------|---------|--------|
| 1 | `project-begin` con codex | 0/6 | — | ⛔ Abierto (codex) |
| 2 | `epic-from-project-plan` TC-007…TC-011 | 5/5 | 5/5 | ✅ Cumplido |
| 3 | `project-story-mapping` + `project-context-diagram` | 4/6 + 7/7 | 6/6 + 7/7 | ✅ Cumplido tras corrección |
| 4 | `memory-system` TC-023, TC-024 con codex | 0/2 (ERROR) | — | ⛔ Abierto (codex) |
| 5 | `project-flow` + `sddf-init` + `header-aggregation` | 3/8 + 10/10 + 4/5 | 8/8 + 10/10 + 5/5 | ✅ Cumplido tras corrección |
| 6 | E2E `/sddf-init` → `/project-flow` | sin ejecutar | todas las comprobaciones en verde | ✅ Cumplido |
| 7 | Validación manual F-1 a F-3 de STORY-116 | F-1 ❌ | F-1, F-2 y F-3 ✅ | ✅ Cumplido tras corrección |

Los evals se ejecutaron con `npm run test:eval -- <skill> --report` (runner `claude`) salvo los ítems 1 y 4 (`--eval-runner codex`). Los informes por caso están en `.tmp/skill-test-evals/<skill>/report-20261013.md`, que no se versiona.

### Causa común de los fallos de eval

Los skills se comportaban bien, pero su contrato de consola no fijaba el dato que verifica la aserción. La corrección añade líneas de salida obligatorias al `SKILL.md` sin cambiar la lógica ni las aserciones.

| Skill | Casos | Causa | Corrección |
|-------|-------|-------|------------|
| `project-flow` | TC-001…TC-005 | La consola no nombraba el skill compuesto (`/project-begin`, `/project-discovery`, `/project-planning`). | Paso 2: línea obligatoria `▶ Etapa <Etapa>: componiendo /<skill> → <capa>` antes de componer. |
| `project-story-mapping` | TC-002, TC-003 | No se mostraban el destino ni el inventario de requisitos leído del SRS. | Paso 1: `🗺️ Destino: …/product/story-map.md`. Paso 2: `📋 Inventario de requisitos: <n> FR` con una línea por requisito y su ruta. |
| `header-aggregation` | TC-003 | El resumen anticipado no listaba las rutas, y `N` contaba también los conflictos saltados. | §4.2: bloque fijo con la ruta de cada archivo por grupo; `N` cuenta solo los archivos que se procesarán. |

### Ítem 6: E2E `/sddf-init` → `/project-flow`

Repositorio temporal con `git init` y sin `docs/`, proyecto ficticio «tskr» (CLI de tareas). Claude condujo los skills y el usuario respondió la entrevista y los gates con `AskUserQuestion`:

- `sddf-init` (nivel `standard`, «n» en el Paso 5)
- Begin (`Confirmar`)
- `Continuar con Discovery`
- Discovery (`Confirmar`)
- `Continuar con Planning`
- Story Mapping (sí)
- Planning (`Confirmar`)

| Comprobación | Resultado |
|--------------|-----------|
| No existe `docs/specs/01-projects/`, `02-epics/` ni `03-stories/` | ✅ |
| Ningún `project-intent.md`, `project.md`, `project-plan.md` ni `PROJ-*` | ✅ |
| `docs/product/vision.md` y `stakeholders.md` con `substatus: DONE` | ✅ |
| `docs/requirements/` con 4 FR y 1 NFR | ✅ |
| `docs/product/roadmap.md` con `## Propuesta (2026-10-13)` | ✅ |
| `docs/product/story-map.md` materializado tras validar el staging | ✅ |

`project-flow` emitió la línea `▶` en cada etapa y llegó a «Pipeline completo». Tras `memory-system ensure` (scaffold + index), `check` solo informa los 7 guardarraíles `dod-story-*` que referencia el `sddf.config.yaml` generado, ausentes porque se omitió `sddf-constitution`. Es una fricción de onboarding ajena a EPIC-21.

### Ítem 7: recorridos F-1 a F-3 de STORY-116

- **F-1 (AC-1), corregido.** El README no enlazaba a `domain-work-item-hierarchy` y su árbol de `<SPECS_BASE>/` mostraba `specs/01-projects/` y `domain/`. Ahora enlaza la jerarquía bajo la tabla de niveles y el árbol refleja las capas del scaffold (`product/`, `requirements/`, `architecture/c4/`, `domains/`…). Recorrido: README → `domain-work-item-hierarchy` (dos niveles, Epic L2 y Story L1) → `domain-foundational-docs-lifecycle` («documentación, no work item») → `state-machine`. `domain-project-lifecycle` está `superseded` y remite a `domain-foundational-docs-lifecycle`.
- **F-2 (AC-3), cumplido.** La sección BREAKING de `CHANGELOG.md › [Unreleased]` cubre las rutas, los nuevos hogares, los templates, los skills cuyo output cambió y la versión 4.0.0, y lleva a `docs/guides/artifact-directory-migration.md` con la secuencia `--dry-run` → ejecución real → `check`. Discrepancia menor: la guía añade `product/objectives.md` como destino de `project-plan.md` y el CHANGELOG no lo menciona.
- **F-3 (AC-2), cumplido.** ADR-0004 y ADR-0013 cambian en el mismo commit `6b83fa3`. En ADR-0004 solo cambian `status: SUPERSEDED` y `superseded-by: ADR-0013`, y se añade la nota de reemplazo parcial; el resto del ADR no se tocó.

### Ítems abiertos (dependen de codex)

- **`scripts/run-evals.js:620`** lanza `codex` sin resolver `codex.cmd` en Windows (`spawn codex ENOENT`). Se puede reutilizar el patrón de `scripts/npm-invocation.js`.
- **YAML inválido.** Codex sigue cargando `.agents/skills/security-audit/examples/agent-skill-project/SKILL.md`, con YAML inválido: es la precondición del ítem 1.
- **Cuota de codex agotada** durante la ejecución del 2026-10-13.
- **Respuestas de codex.** En project-begin TC-001…TC-003 codex respondió que el escenario no determina una salida exacta: hay que revisarlo cuando se repita la ejecución.

### Gates deterministas tras las correcciones

- `npm test`: 250/250.
- `npm run verify:repository`: exit 0, incluido `verify:links`.

## Observaciones fuera de las tres condiciones

- Los 10 "Criterios de salida" de `epic.md` siguen sin marcar.
- `package.json` está en la versión `3.3.1`. Las notas de la épica exigen subir a `4.0.0` antes de publicar, porque es un breaking change.
- STORY-118 figura en `COMPLETED`, pero su directorio no contiene `verify-report.md` ni `acceptance-report.md`.

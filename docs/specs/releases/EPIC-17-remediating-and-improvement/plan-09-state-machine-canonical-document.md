---
type: plan
id: plan-09
slug: plan-09-state-machine-canonical-document
title: "Documento canónico de la máquina de estados SDDF"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Documento canónico de la máquina de estados SDDF

## Context

La máquina de estados del framework es **implícita**: vive distribuida en los SKILL.md de cada skill del pipeline (precondiciones de entrada, actualizaciones de salida, retrocesos), sin documento centralizado. El documento más cercano es `docs/knowledge/guides/specs_and_workflows.md:32-58`, que esboza el story workflow pero no cubre transiciones, retrocesos ni los otros dos niveles. La exploración reconstruyó la máquina completa y detectó inconsistencias: el nombre canónico del estado es **PLAN** (README y DoD usan "PLAN"), pero `story-plan/SKILL.md:62` usa `status: PLANNING` — el skill es el que está incorrecto; `BLOCKED` se usa en story-acceptance pero falta en el esquema canónico de header-aggregation; INTEGRATION y COMPLETED aparecen en el pipeline declarado pero ningún skill los escribe; mezcla de guion U+2011/ASCII en `IN-PROGRESS`.

**Decisiones del usuario:** documentar + fixes menores (la normalización masiva U+2011 queda como ítem aparte); diagramas en Mermaid stateDiagram-v2.

---

## Cambios

### 1. Crear `docs/knowledge/guides/state-machine.md` (documento canónico)

Frontmatter wiki estándar (`type: knowledge`, `slug: state-machine`). Estructura:

**a. Modelo general** — dos ejes: `status` (etapa del pipeline) + `substatus` (progreso dentro de la etapa: `TODO | IN-PROGRESS | DONE | BLOCKED`). Convención del guion: ASCII U+002D (la normalización completa es ítem pendiente del backlog). Principio: el ciclo de vida se traza con status+substatus, no con versiones (constitución, patrón 14).

**b. Nivel STORY** (la máquina principal) — diagrama Mermaid `stateDiagram-v2`:
```
SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → INTEGRATION → COMPLETED
```
con retrocesos: CODE-REVIEW→READY-FOR-IMPLEMENT (needs-changes), VERIFY→READY-FOR-IMPLEMENT (DoD fail), ACCEPTANCE→READY-FOR-IMPLEMENT (rejected), ACCEPTANCE→BLOCKED.

+ **Tabla de transiciones por skill** (la tabla reconstruida en exploración): skill | precondición de entrada | estado al iniciar | salida éxito | retroceso. Cubre story-specify, story-plan (y sus 4 sub-skills que NO tocan story.md), story-implement, story-code-review, story-verify, story-acceptance.
+ Nota explícita: **INTEGRATION y COMPLETED son transiciones manuales** — ningún skill las escribe; las marca el humano (o CI/CD) al integrar/cerrar.

**c. Nivel PROJECT** — pipeline de 3 documentos con solo substatus (sin status): project-intent.md → project.md → project-plan.md, cada uno IN-PROGRESS→DONE con gate humano entre fases (project-flow). Control WIP=1 (constitución, regla 9).

**d. Nivel RELEASE** — substatus IN-PROGRESS→DONE en release.md; status observados en la práctica (`DEFINITION`, `RELEASED`) documentados como convención de frontmatter, con la validación de estructura (`release-format-validation`) como gate antes de generar historias.

**e. Inconsistencias conocidas y pendientes** — sección honesta: normalización U+2011→ASCII pendiente (ítem EPIC-17); INTEGRATION/COMPLETED sin skill; arquitecturas distintas por nivel (story usa status+substatus, project/release solo substatus) — documentado como diseño aceptado, no bug.

**Fuentes a citar en el doc:** `header-aggregation/SKILL.md:20-38` (esquema frontmatter), `story-*/SKILL.md` (transiciones), `specs_and_workflows.md` (workflow narrativo), constitución patrones 8/14 y regla 9.

### 2. Fixes menores

- **`.claude/skills/story-plan/SKILL.md:62`**: `status: PLANNING` → `status: PLAN` (README y DoD ya usan "PLAN"; el skill es el que está desalineado).
- **`.claude/skills/header-aggregation/SKILL.md:28`**: agregar `BLOCKED` al esquema canónico de substatus (`<null | TODO | IN-PROGRESS | READY | DONE | BLOCKED>` — verificar valores exactos actuales al editar).
- **`docs/knowledge/guides/specs_and_workflows.md`**: agregar referencia al nuevo documento canónico ("la máquina de estados completa con transiciones y retrocesos está en `[[state-machine]]`") sin duplicar contenido.

### 3. Registro en índices

- **`docs/index.md`**: agregar `[[state-machine]]` en la sección "Guías teóricas" (o crear subsección Proceso si encaja mejor con el patrón existente).

### 4. Trazabilidad

- Marcar el ítem `[x]` en `docs/specs/releases/EPIC-17-remediating-and-improvement/release.md` con nota de resolución (respetando el id que el usuario asigne, presumiblemente plan-09).

---

## Verificación

1. `docs/knowledge/guides/state-machine.md` existe; los 3 bloques Mermaid renderizan (sintaxis `stateDiagram-v2` válida — verificable pegando en GitHub preview o mermaid.live).
2. La tabla de transiciones coincide con los SKILL.md fuente: spot-check de 3 transiciones contra `story-code-review/SKILL.md` (IMPLEMENT/DONE → CODE-REVIEW/DONE | READY-FOR-IMPLEMENT/DONE), `story-verify/SKILL.md` y `story-acceptance/SKILL.md`.
3. `grep -n "PLANNING" .claude/skills/story-plan/SKILL.md` → 0 resultados (corregido a PLAN).
4. `grep -n "BLOCKED" .claude/skills/header-aggregation/SKILL.md` → presente en el esquema.
5. `grep -n "state-machine" docs/index.md docs/knowledge/guides/specs_and_workflows.md` → wikilink presente en ambos.

## Reporte de implementación

Todo correcto. Resumen de lo implementado en plan-09:

Archivos creados:

state-machine.md — documento canónico con 3 diagramas Mermaid stateDiagram-v2 (story, project, release), tabla de transiciones por skill y sección de inconsistencias
Archivos modificados:

story-plan/SKILL.md — 3 ocurrencias de PLANNING → PLAN (tabla de ciclo de vida + 2 referencias en instrucciones)
header-aggregation/SKILL.md — substatus canónico ampliado: DONE y BLOCKED que faltaban
specs_and_workflows.md — referencia al nuevo documento canónico al final del Story Workflow
docs/index.md — nueva sección "Proceso" con [[state-machine]] y [[specs_and_workflows]]
release.md — plan-09 marcado [x]

# Plan — Reescribir `project.md` contra la realidad + runbook del proceso

## Context

`docs/specs/01-projects/PROJ-01-agile-sddf/project.md` es la especificación de requisitos (L3) del
framework. Fue **generada el 2026-04-19 por `/reverse-engineering`** sobre el repo de entonces y no se
ha tocado desde entonces. En los cuatro meses siguientes el proyecto cambió de forma estructural, así
que hoy el documento describe un sistema que ya no existe: sigue siendo la foto de un repo con ~15
skills, integración OpenSpec y cinco runtimes.

El resultado es que la fuente de verdad del nivel L3 contradice a `docs/index.md`, al `CHANGELOG.md`,
a la constitución y al propio filesystem. Cualquier agente que lea `project.md` para orientarse
recibe información falsa.

**Objetivo:** reescribir `project.md` contra hechos verificados en el repositorio, y dejar en
`docs/runbooks/` el procedimiento seguido para poder repetir la actualización en el futuro.

**Decisiones tomadas con el usuario:**
- Reescritura completa (renumerar FR/NFR), no parcheo incremental.
- El reporte se entrega como **runbook versionado** en `docs/runbooks/`, no como artifact.
- Alcance limitado a `project.md`. `project-plan.md` también está desfasado, pero queda fuera.

---

## Estado real verificado (línea base de la reescritura)

Contado sobre el filesystem, no inferido:

| Dimensión | Valor verificado |
|---|---|
| Épicas | 19 (`EPIC-00`…`EPIC-18`), 19 `epic.md` + 31 `plan-NN.md` |
| Historias | 79 directorios, **77** con `story.md` (084 y 085 solo tienen planes) |
| Skills | **34** en `skills/` (raíz) — 23 con `evals/`, 23 con `assets/` |
| Agentes | **10** en `agents/` + **7** subagentes locales en `skills/*/agents/` |
| Estado de historias | 66 COMPLETED · 3 VERIFY · 3 READY-FOR-IMPLEMENT · 2 IMPLEMENT · 1 READY-FOR-VERIFY · 1 READY-FOR-CODE-REVIEW · 1 BACKLOG |
| `kind` | 75 `feat` · 1 `fix` (STORY-087) · 1 `chore` (STORY-086) |
| Paquete npm | `agile-sddf` **v2.0.0**; `files: [agents/, skills/, scripts/, sddf.config.yaml, README.md, LICENSE]` |
| Runtimes | 3 — Claude Code (`.claude`), OpenCode (`.agents`), GitHub Copilot (`.github`) |
| Ejecutable | Node.js ≥18: `scripts/cli.js`, `install.js`, `postinstall.js`, `normalize-preflight-paso0.js`. Sin Python |
| CI | `.github/workflows/`: `skill-security-audit.yml` (Skill Shielder), `docker-security.yml` |

### Drift confirmado en `project.md` (qué está mal, con evidencia)

| # | Afirmación actual | Realidad |
|---|---|---|
| D1 | Skills en `.claude/skills/…` (FR-001…FR-004, NFR-002) | Fuente única en `skills/` y `agents/` de la raíz; `.claude/` es destino de instalación y está en `.gitignore` (EPIC-18 plan-08) |
| D2 | 5 runtimes: + Google Gemini Gems (`gem/`) y Atlassian Rovo (`rovo/`) | Ambos directorios **eliminados** (EPIC-17 plan-13). Quedan 3 runtimes |
| D3 | FR-027…FR-030 + «PIPELINE E» de integración OpenSpec | **No existe `openspec/`** ni ningún skill `openspec-*` en el repo |
| D4 | NFR-011: `skills-lock.json` con hash de `skill-master` | El archivo **no existe**. `skill-master` y `skill-test-evals` se retiraron (`61e38f2`) y viven en el repo externo `agile-sddf-extension`, declarados vía `sddf.config.yaml` |
| D5 | Stack: «Python 3.x, 10 archivos en `skill-master/scripts/`» | No hay Python ejecutable (los 2 `.py` restantes son *fixtures* de `story-verify/examples/`). El ejecutable es Node.js |
| D6 | Control de flujo con el campo `**Estado**: IN-PROGRESS \| Ready` (NFR-004, NFR-006, NFR-007) | Reemplazado por `status` + `substatus` en frontmatter YAML, con máquina de estados canónica (ADR-0003, `docs/guides/state-machine.md`) |
| D7 | Non-goal: «generación de código de implementación» | Es **capacidad central hoy**: `story-implement` ejecuta TDD RED→GREEN→REFACTOR |
| D8 | Ciclo de historia = `story-creation → story-evaluation → story-split → story-refine` | `story-refine` **no existe**; lo sustituye `story-specify`, y sobre él se montó todo el workflow L1 (PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE) |
| D9 | Sin nivel de épica; el árbol 3.3 salta de proyecto a historia | Existe el nivel L2 completo: 5 skills `epic-*` con gate `epic-format-validation` (ADR-0004) |
| D10 | ~15 skills documentados | 34. Ausentes por completo: `sddf-init`, `skill-preflight`, `security-audit`, `header-aggregation`, `docs-wiki-builder`, `readme-builder`, `project-context-diagram`, `project-policies-generation` y los 11 `story-*` del workflow |
| D11 | «Modelo de delegación: un solo nivel, estructura plana» | Modelo de dos mecanismos: composición inline skill→skill y delegación a subagente con contrato `.tmp/<skill>/`; prohibido agente→agente (ADR-0002, `best-practices-for-skills.md`) |
| D12 | Frontmatter con `date:` y `substatus: READY` | Esquema canónico de `header-aggregation`: `created` + `updated`; `substatus ∈ {null, TODO, IN-PROGRESS, DONE, BLOCKED}` |
| D13 | «Gaps & Next Steps» con gaps ya resueltos | `.gitignore` existe, hay proceso de release (GitHub Actions + runbook npm), hay testing (`evals/` en 23 skills), el mecanismo de sincronización multi-runtime es `scripts/install.js` |

---

## Cambios a realizar

### 1. `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` — reescritura completa

Archivo único a modificar. Se conserva la **estructura de secciones dictada por
[`docs/specs/templates/project-template.md`](docs/specs/templates/project-template.md)** (patrón 5 de
la constitución: el template es la fuente de verdad de la estructura), y se sustituye el contenido.

**Frontmatter** — alinear con el esquema canónico de
[`skills/header-aggregation/SKILL.md`](skills/header-aggregation/SKILL.md#L26-L32):

```yaml
type: project
id: PROJ-01
slug: PROJ-01-agile-sddf
title: "Especificación de Requisitos — Agile SDDF"
status: COMPLETED
substatus: DONE          # antes: READY (no canónico)
parent: null
created: 2026-04-19      # antes: date:
updated: 2026-08-30
related:
  - PROJ-01-agile-sddf-project-intent
  - project-plan
  - story-map
```

**§1 Definición del proyecto** — actualizar 1.2/1.3 para que la visión cubra el ciclo completo hasta
código (hoy corta en «backlog planificado»); 1.4 beneficios reescritos sobre capacidades reales;
**1.5 criterios de éxito** marcados `[x]` los cumplidos con su evidencia; **1.6 restricciones**
corregidas (Node ≥18, sin Python, 3 runtimes); **1.7 non-goals** — quitar «generación de código»
(D7), quitar OpenSpec, y añadir los reales de hoy: sin workers de stack en el core (viven en
`agile-sddf-extension`), sin exportación a Jira/Linear/Notion, sin multiusuario, WIP=1 deliberado;
**1.8** añadir `US-005 Mantenedor del framework` (dogfooding) y `US-006 Agente de IA consumidor`.

**§2.1 Requisitos funcionales** — reagrupar en 9 categorías que espejan los pipelines reales, con
numeración FR corrida (~50 requisitos). Cada FR lleva `**Fuente**` apuntando a **skill de `skills/` +
historia `STORY-NNN` + épica**, ya sin rutas `.claude/`:

| § | Categoría | Skills que la sustentan |
|---|---|---|
| 2.1.1 | Infraestructura y protocolo de entorno | `sddf-init`, `skill-preflight`, `SDDF_ROOT`, `sddf.config.yaml`, templates centralizados |
| 2.1.2 | Pipeline de especificación de proyecto (L3) | `project-begin`, `project-discovery`, `project-planning`, `project-flow`, `project-story-mapping`, `project-context-diagram`, `project-policies-generation` |
| 2.1.3 | Ingeniería inversa de repositorios | `reverse-engineering` + 5 agentes |
| 2.1.4 | Gestión de épicas (L2) | `epic-creation`, `epic-from-project-plan`, `epic-format-validation`, `epic-generate-stories`, `epic-generate-all-stories` |
| 2.1.5 | Especificación de historias (L1 · SPECIFY) | `story-specify`, `story-creation`, `story-evaluation`, `story-split`, `story-improve` |
| 2.1.6 | Planning de historia (L1 · PLAN) | `story-plan`, `story-design`, `story-tasking`, `story-testcases`, `story-analyze` |
| 2.1.7 | Implementación TDD y quality gates | `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance` |
| 2.1.8 | Documentación, metadatos y seguridad | `header-aggregation`, `docs-wiki-builder`, `readme-builder`, `security-audit` |
| 2.1.9 | Distribución npm e instalación multi-runtime | `scripts/cli.js`, `install.js`, `postinstall.js` |

**§2.2 Requisitos no funcionales** — renumerar en 9 categorías: multi-runtime (3, vía instalador);
Markdown declarativo + Node.js solo para lo ejecutable; filesystem como única persistencia; máquina
de estados `status`/`substatus` + WIP=1; trazabilidad (frontmatter canónico, wikilinks `[[slug]]`,
niveles DIRECT/INFERRED/SUGGESTED); **arquitectura de agentes** (composición inline vs. delegación,
contrato `.tmp/<skill>/`, prohibición agente→agente — nueva, ausente hoy); calidad y testing
(`evals/evals.json`, DoD como gate ejecutable); **seguridad** (Skill Shielder en CI, `security-audit`
con OWASP Top 10 / API / LLM — nueva); entorno Docker + devcontainer. Eliminar NFR-011
(`skills-lock.json`).

**§2.3 UX** — añadir los patrones que faltan: gates DoD que bloquean el avance, modo interactivo vs
`--auto`, `--dry-run`, `fix-directives.md` como canal de retroalimentación de `story-code-review`.

**§3.3 Mapa de navegación** — reemplazar el árbol ASCII entero. Fuera los pipelines E (OpenSpec) y G
(skill-master); dentro: infra (`sddf-init`/`skill-preflight`), L3, ingeniería inversa, **L2 épicas**,
**L1 completo SPECIFY→PLAN→IMPLEMENT→CODE-REVIEW→VERIFY→ACCEPTANCE→DELIVER→COMPLETED**, meta-skills
de docs, y distribución npm. Incluir la máquina de estados de
[`docs/guides/state-machine.md`](docs/guides/state-machine.md) como referencia, sin duplicarla.

**§4.1 Arquitectura** — rehacer la tabla de stack (Node ≥18, fs-extra, sin Python, sin OpenSpec, sin
`skills-lock.json`) y **reescribir el modelo de delegación** según ADR-0002 y
[`docs/guides/best-practices-for-skills.md`](docs/guides/best-practices-for-skills.md). Añadir la
frontera core/extensión: el core es agnóstico al stack y los workers viven en `agile-sddf-extension`,
declarados en `sddf.config.yaml`.

**§11 Referencias** — hoy dice «Sin referencias». Enlazar `docs/index.md`, los 5 ADR, la
constitución, el DoD y las guías clave.

**§12 Glosario** — quitar OpenSpec/Rovo/Gemini/`skills-lock.json`; añadir `SDDF_ROOT`,
`sddf.config.yaml`, `skill-preflight`, épica/`EPIC-NN`, `kind`, DoD, quality gate, evals, TDD
RED/GREEN/REFACTOR, DELIVER, `.tmp/<skill>/`, worker skill, `agile-sddf-extension`.

**Apéndice final** — sustituir «Gaps & Next Steps» (D13) por dos secciones nuevas:

- *Estado de implementación* — tabla de las 19 épicas y el recuento de las 77 historias por estado.
- *Brechas y deuda conocida* — **solo lo verificado**, sin preguntas inventadas:
  1. Los `epic.md` usan `status: RELEASED` / `substatus: READY`, que no pertenecen a la máquina de
     estados canónica de épica (`DEFINE→PLAN→READY-FOR-DEV→DEVELOP→VALIDATE→SHIP→COMPLETED`);
     13 de 19 épicas están así.
  2. 5 historias sin épica padre (`parent: null`): STORY-046, 074, 075, 076, 086.
  3. STORY-084 y STORY-085 tienen planes pero no `story.md`, y su ID colisiona entre EPIC-14 y EPIC-15.
  4. `STORY-043/story.md` conserva los placeholders del template en `status`/`substatus`.
  5. 8 IDs planificados nunca materializados: STORY-002, 009, 014, 016, 025, 026, 031, 045.
  6. 11 de 34 skills sin `evals/` (cobertura 68%).
  7. `README.md` sigue anunciando «Integración OpenSpec», capacidad ya retirada del repo.
  8. `project-plan.md` describe 9 épicas frente a las 19 reales (fuera de este alcance).

### 2. `docs/runbooks/actualizar-spec-de-proyecto.md` — nuevo runbook

Frontmatter estándar de runbook (`type: runbook`, `slug: runbook-actualizar-spec-de-proyecto`,
`created`/`updated: 2026-08-30`, `status: COMPLETED`, `substatus: DONE`). Documenta el procedimiento
en 7 pasos, con los comandos exactos usados:

1. **Delimitar** — leer `project.md` y `docs/specs/templates/project-template.md`. El template
   manda la estructura; el trabajo es solo de contenido.
2. **Inventariar el filesystem** — el bloque de conteos de la tabla «Estado real verificado»
   (`ls -d`, `wc -l`, `grep -h "^status:" … | sort | uniq -c`). Regla: **contar, no recordar**.
3. **Explorar en paralelo con 3 subagentes `Explore`** — uno por eje (épicas / historias / skills +
   agentes + config + scripts), cada uno devolviendo tablas resumidas, no volcados de archivos.
   Justificación: el volumen (19 + 79 + 34 documentos) no cabe en el contexto del orquestador; es el
   principio 5 de la constitución (gestión estricta de contexto).
4. **Contrastar con las fuentes de verdad transversales** — `docs/index.md` (índice wiki, el más
   actualizado), `CHANGELOG.md` (explica el *porqué* de cada cambio estructural), los ADR, la
   constitución y `docs/guides/state-machine.md`.
5. **Verificar personalmente lo que se va a afirmar** — regla explícita: todo dato que entre al
   documento se comprueba con `ls`/`grep`, incluidos los reportados por subagentes. En esta pasada
   así se detectó que `skills-lock.json`, `openspec/`, `gem/` y `rovo/` ya no existen.
6. **Construir el inventario de drift** — tabla afirmación-actual → realidad → evidencia (la sección
   D1–D13). Es lo que convierte la reescritura en verificable en vez de opinable.
7. **Reescribir y cerrar** — aplicar los cambios, actualizar `updated:` en el frontmatter, y añadir
   la entrada correspondiente en `docs/index.md` y `CHANGELOG.md`.

Incluir además: cuándo disparar el runbook (al cerrar una épica, antes de publicar una major, o
cuando `docs/index.md` y `project.md` se contradigan), y por qué **no** se usa `/reverse-engineering
--update` para esto (solo re-analiza secciones marcadas `PENDING MANUAL REVIEW`, y aquí el problema
es que las secciones sin marcar están obsoletas).

### 3. Registro (cierre)

- `docs/index.md`: añadir la entrada del runbook en la sección «Runbooks» y actualizar el pie
  «Última actualización».
- `CHANGELOG.md`: entrada en `[Unreleased] › Changed` describiendo la reescritura de `project.md` y
  el runbook nuevo.

### Actualizar epics desalineadas en status

Actualiza estados de épicas: Brechas que encontré y no toqué (quedaron documentadas en el Apéndice B): 13 de 19 épicas usan status: RELEASED, fuera de la máquina de estados canónica de ADR-0003

---

## Verificación

1. **Frontmatter canónico** — `head -15 docs/specs/01-projects/PROJ-01-agile-sddf/project.md`:
   debe tener `created` + `updated`, y `substatus` en `{null,TODO,IN-PROGRESS,DONE,BLOCKED}`.
2. **Sin referencias fantasma** — las tres búsquedas deben dar 0 resultados fuera del apéndice de
   deuda y del glosario histórico:
   ```bash
   grep -nE '\.claude/skills|skills-lock\.json|openspec|Rovo|Gemini Gems|story-refine|Python' \
     docs/specs/01-projects/PROJ-01-agile-sddf/project.md
   ```
3. **Cobertura de skills** — cada uno de los 34 nombres de `ls skills/` debe aparecer al menos una vez:
   ```bash
   for s in $(ls skills/); do grep -q "$s" docs/specs/01-projects/PROJ-01-agile-sddf/project.md \
     || echo "FALTA: $s"; done
   ```
4. **Estructura conforme al template** — los headings `#`/`##` del documento deben coincidir con los
   de `docs/specs/templates/project-template.md` (`grep -n '^#' ` en ambos y comparar).
5. **Coherencia de cifras** — reejecutar el bloque de conteos del paso 2 del runbook y comprobar que
   19 / 77 / 34 / 10 coinciden con lo escrito en el apéndice.
6. **Trazabilidad de wikilinks** — los `[[slug]]` añadidos en §11 deben resolver: cada slug existe en
   el frontmatter de algún `.md` bajo `docs/`.
7. **Runbook reproducible** — ejecutar sus comandos del paso 2 tal cual y confirmar que devuelven las
   cifras que el propio runbook documenta.

> No hay `npm test` ni `npm run build` en este repo (`package.json` solo declara `postinstall`), así
> que la verificación es documental y basada en `grep`/`ls`, no en una suite de pruebas.

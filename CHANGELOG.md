# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added

- **`.github/workflows/docker-security.yml`** — workflow de CI que construye `Dockerfile.dev` y escanea la imagen con Trivy en cada push/PR que modifique archivos Docker; falla en hallazgos CRITICAL o HIGH sin parche disponible (SEC-076)
- **`sddf.config.yaml`** en raíz del proyecto — configuración operacional del framework (comandos de test por tipo, mapeo de skills `test_generators` y `code_generator`); movida desde `docs/policies/sddf-config.yaml` para ser agnóstica al CLI de IA (`.claude/` es propiedad de Anthropic; `.agents/` podría usarse en el futuro); ahora incluida en el array `files` de `package.json` para distribución npm

### Changed

- **`skill-test-evals`** — skill unificado que absorbe la funcionalidad de `skill-verify`; ahora soporta tres modos: `generate` (crea evals.json + skeleton SKILL.md), `evals` (1 run → informe pass/fail) y `benchmark` (N runs × caso → métricas estadísticas mean ± stddev); el modo se detecta automáticamente del primer argumento; soporte para `--runs N`, `--report`, `--from-skill`, `--auto`/`--manual`; versión `2.0.0`
- **`sddf-init`** — eliminado Paso "Generar openspec/config.yaml": OpenSpec tiene su propio skill de inicialización (`openspec-init-config`) y su configuración no debe delegarse a `sddf-init` (separación de responsabilidades); se eliminó también el template huérfano `assets/config.yaml.template`; añadido nuevo Paso 3 "Generar sddf.config.yaml" que crea el archivo de configuración operacional del framework desde `assets/sddf.config.yaml.template`
- **`Dockerfile.dev`** — imagen base pineada por digest SHA-256 (`debian:bookworm-slim@sha256:0104b334...`) para builds reproducibles y detectables (SEC-076); eliminado `curl` innecesario para reducir superficie de ataque; añadido usuario no-root `appuser` (UID/GID 1001 configurables vía `ARG`) con instrucción `USER appuser` antes de `CMD` (SEC-052); `docker-compose.dev.yml` actualizado con `user: "${UID:-1001}:${GID:-1001}"` para alinear UID del contenedor con el del host

### Security

- **SEC-056 (Unicode ASCII smuggling)** — añadida función `sanitize_for_llm()` en `skill-creator/scripts/utils.py`; aplica normalización NFKC y filtra caracteres zero-width (ZWSP, ZWNJ, ZWJ, BOM, soft-hyphen) y el bloque Unicode Tag (U+E0000–U+E007F) antes de enviar texto al LLM; aplicada sobre `query` en `run_eval.py` y sobre `skill_content` en `improve_description.py`

### Removed

- **Skill `skill-verify`** — eliminado; su funcionalidad (modos verify y benchmark) fue absorbida íntegramente por `skill-test-evals` v2.0.0; todos los skills y referencias actualizadas

---

## [1.10.0] — 2026-05-31 — Skills Factory (EPIC-14 + EPIC-13)

### Added

- New skills: story-testcases, skills-master, skill-test-evals
- **Skill `/story-improve`** (FEAT-077) — aplica automáticamente las recomendaciones del reporte FINVEST sobre `story.md`; lee `finvest-evaluation-report.md` del directorio de la historia, extrae scores y recomendaciones por dimensión, y aplica mínimo 1 mejora concreta por cada dimensión con score ≤ 3; gate de decisión: si `decision: APROBADA` informa y termina sin modificar ningún archivo; carga contexto de historias hermanas condicionalmente (solo si dimensión I ≤ 3) para evitar duplicar cobertura; crea `story.md.bak` antes de cualquier modificación (idempotente: sobreescribe si ya existe); genera `story-improvement-log.md` con trazabilidad de recomendación aplicada y cambio realizado por dimensión; incluido en `package.json` files para distribución npm

### Changed
- story-implement: add TDD support and skill complementaries.
- integrar-config-sddf-init: moved sddf.config.yaml template from docs/policies to skill assets and updated sddf-init to generate it
- **`story-evaluation`** — genera `finvest-evaluation-report.md` en disco además de mostrar el reporte en conversación; el archivo incluye frontmatter YAML con `story-id`, `finvest-score`, `decision` y `evaluated`; si el input fue ID o ruta de archivo, el reporte se persiste en el directorio de la historia; sobreescribe evaluaciones anteriores (la más reciente siempre reemplaza); la actualización del frontmatter de `story.md` a `SPECIFYING/DONE` solo ocurre cuando `decision: APROBADA`

### Fixed

- **`story-evaluation`** — corregido bug de derivación de IDs idéntico al de `story-creation`: la búsqueda de IDs existentes fallaba silenciosamente cuando el directorio `specs/stories/` estaba vacío o el patrón glob no coincidía, resultando en IDs duplicados o mal formados
- **`release-generate-all-stories`** — corregido bug de derivación de IDs (misma causa raíz que `story-creation`) y eliminado caso donde INVEST se omitía sin justificación en la evaluación de historias generadas en lote
- **`release-generate-stories`** — corregido bug de derivación de IDs (misma causa raíz que `story-creation`) y eliminado caso donde INVEST se omitía sin justificación en la evaluación de historias individuales
- **`release-creation`** y **`story-creation`** — corregida asignación incorrecta de IDs cuando la búsqueda de IDs existentes fallaba silenciosamente; la falla silenciosa provocaba que los IDs se generaran desde 0 en lugar de continuar la secuencia existente
- Eliminada historia `FEAT-000` usada solo para pruebas del pipeline

### Added

- **Skill `/story-acceptance`** (FEAT-072, EPIC-13) — quality gate de validación humana final antes de INTEGRATION; guía al validador a través de los criterios de aceptación Gherkin de `story.md` y los criterios DoD ACCEPTANCE uno a uno; recopila resultado `PASS / FAIL / BLOCKED` con observaciones obligatorias para los no aprobados; genera `acceptance-report.md` con trazabilidad completa (ID, texto, resultado, observación, timestamp) y resumen ejecutivo; actualiza `story.md` a `ACCEPTANCE/DONE` si todos APPROVED o a `READY-FOR-IMPLEMENT/DONE` si hay rechazados; soporta sesiones interrumpibles y reanudables (`session-status: partial`), flag `--restart` y flag `--dry-run`; lee la sección ACCEPTANCE del DoD en runtime (dinámica) y usa solo criterios Gherkin si el DoD no tiene esa sección

- **Skill `/story-verify`** (FEAT-071, EPIC-13) — quality gate de verificación automática post-`story-code-review`; lanza el subagente QA Engineer que detecta el framework de testing del proyecto (Jest, pytest, Mocha, etc.) y ejecuta las suites; genera `verify-report.md` con resultado por suite, cobertura y estado final `VERIFY-PASSED / VERIFY-FAILED`; transiciona `story.md` a `VERIFY/DONE` si pasan o a `IMPLEMENTING/IN-PROGRESS` si fallan; incluye ejemplos de proyectos Jest y pytest y evals de detección de modo

- **Skill `/security-audit`** (EPIC-13) — auditoría de seguridad condicional y automatizada; lanza en paralelo tres subagentes especializados: Context Detector (identifica el stack y la superficie de ataque), Checklist Evaluator (evalúa el proyecto contra `security-checklist.md` con más de 100 controles por categoría: auth, input validation, secrets, dependencies, cryptography, etc.) y Report Generator (consolida hallazgos con severidades `CRITICAL / HIGH / MEDIUM / LOW / INFO`); el skill es condicional: si no detecta superficie de riesgo omite la auditoría sin error; incluye evals de detección y ejemplos de proyectos JWT y vacíos

- **Skill `/story-code-review`** (FEAT-064, FEAT-065) — ejecuta una revisión multi-agente del código implementado en una historia SDD; lanza en paralelo tres subagentes especializados: Inspector de Código (convenciones, complejidad, seguridad), Guardián de Requisitos (cobertura de ACs) e Inspector de Integración (contratos de interfaz); consolida hallazgos en `code-review-report.md` con severidades `HIGH / MEDIUM / LOW / INFO`; cuando no hay hallazgos HIGH ni MEDIUM establece `review-status: approved` y transiciona `story.md` a `READY-FOR-VERIFY/DONE`; cuando detecta bloqueantes genera `fix-directives.md` con instrucciones concretas por archivo y retrocede `story.md` a `IMPLEMENTING/IN-PROGRESS`; actúa como quality gate post-`story-implement` en el pipeline SDD

### Changed

- **`story-code-review`** (EPIC-13) — integra DoD CODE-REVIEW como quality gate; verifica los criterios de la sección `CODE-REVIEW` de `definition-of-done-story.md` antes de aprobar la revisión; el reporte `code-review-report.md` incluye sección de cumplimiento DoD; la transición a `READY-FOR-VERIFY/DONE` solo ocurre si se cumplen tanto los criterios de revisión de código como los del DoD
- **`story-implement`** (EPIC-13, FEAT-067) — integra DoD IMPLEMENTING como quality gate; verifica los criterios de la sección `IMPLEMENTING` de `definition-of-done-story.md` como paso previo a transicionar a `READY-FOR-CODE-REVIEW/DONE`; soporte para continuar implementaciones parciales: detecta tareas ya completadas en `tasks.md` (`[x]`) y procesa solo las pendientes (`[ ]`); integra automáticamente las correcciones de `fix-directives.md` si existe
- **`story-analyze`** (EPIC-13) — integra DoD PLAN como quality gate; verifica los criterios de la sección `PLAN` de `definition-of-done-story.md` (cobertura de ACs, trazabilidad en `design.md`, tareas atómicas ordenadas) como paso previo a transicionar a `READY-FOR-IMPLEMENT/DONE`
- **`definition-of-done-story.md`** (EPIC-13) — añadida sección `ACCEPTANCE` con criterios de aceptación funcional (escenarios Gherkin ejecutados manualmente, criterios no funcionales validados, valor de negocio confirmado, sin defectos bloqueantes) y criterios de documentación y trazabilidad (`acceptance-report.md` generado, confirmación explícita del validador humano); criterios de despliegue actualizados con validación npm (`npm pack --dry-run`, instalación limpia) y criterios de skills (uso de `skill-master`, inclusión en `files` de `package.json`); refactorizado junto con `constitution.md` para mejorar claridad y separación de responsabilidades por fase del pipeline
- **Máquina de estados del ciclo de vida de historias SDD** (EPIC-13) — extendida con los estados finales del pipeline: `→ READY-FOR-VERIFY/DONE → VERIFY/IN-PROGRESS → VERIFY/DONE → ACCEPTANCE/IN-PROGRESS → ACCEPTANCE/DONE → COMPLETED/DONE`; `story-verify` gestiona la transición `VERIFY`; `story-acceptance` gestiona la transición `ACCEPTANCE`; al ser rechazada en `ACCEPTANCE`, la historia regresa a `READY-FOR-IMPLEMENT/DONE` para corrección
- Renombrado `DOING` → `IN-PROGRESS` en el campo `substatus` de todos los artefactos de spec para alinear con la nomenclatura canónica de la máquina de estados
- Renombrado template `story-gherkin-template` → `story-template` como nombre canónico compartido
- **Restructura de `$SPECS_BASE/specs/`** — migrado a la convención workitem-per-directory: cada proyecto, release e historia ocupa su propio directorio con un archivo canónico (`project.md`, `release.md`, `story.md`); `project/` (flat) → `projects/PROJ-01-agile-sddf/`; 10 releases flat → `EPIC-NN-nombre/release.md`; 42 stories flat → `FEAT-NNN-nombre/story.md`; wikilinks y referencias `parent:` actualizados

---

## [1.9.4] — 2026-05-01 — Docs & Wiki Builders + Planning Pipeline (Release 09)

### Added

- **Skill `/story-design`** — genera `design.md` a partir de `story.md`, modelando el sistema antes de codificar; implementa 12 principios de diseño explícitos (P1-P12: alternativas consideradas, trazabilidad AC-N, reutilización, vocabulario de dominio, uniformidad, diseño para el cambio, degradación gradual, diseño ≠ programación, autoevaluación estructural, revisión conceptual, cohesión/acoplamiento, KISS/YAGNI); fallback chain de 3 niveles para template y resolución de historia por ID; extracción de contexto técnico del proyecto; checklist de principios (Paso 6); mecanismo de Change Requests (Paso 7); template de fallback interno
- **Template `story-design-template.md`** — template canónico del skill `/story-design`; tabla de Componentes Afectados con columna AC, tabla de Interfaces, sección de Puntos de Variación, sección "Decisiones de complejidad justificada" (P12) y sección Registro de Cambios (CR)
- **Políticas del proyecto** — skill `/project-policies-generation` genera `docs/policies/constitution.md` y `docs/policies/definition-of-done-story.md` desde templates
- **Skill `/sddf-init`** (FEAT-054) — inicializa el entorno SDDF en un proyecto nuevo: crea los directorios `specs/projects/`, `specs/releases/` y `specs/stories/` bajo `SDDF_ROOT`, genera `.env.template` documentando `SDDF_ROOT`; idempotente; aborta con `[ERROR]` si `SDDF_ROOT` no existe; distingue `[CREADO]` vs `[YA EXISTÍA]`
- **Skill `/skill-preflight`** — protocolo centralizado de verificación de entorno; verifica `SDDF_ROOT`, subdirectorios de specs, templates requeridos; produce informe `[OK] / [WARNING] / [ERROR]`; todos los skills migrados para invocarlo en Paso 0
- **Variable de entorno `SDDF_ROOT`** (FEAT-049) — todos los skills del pipeline leen `SDDF_ROOT` para determinar `SPECS_BASE`; fallback `docs` si no definida
- **Skill `/story-tasking`** (FEAT-058) — genera `tasks.md` a partir de `story.md` y `design.md`; descompone el diseño en tareas atómicas trazables a AC; modo manual e invocable por orquestador
- **Skill `/story-analyze`** (FEAT-059) — audita coherencia entre `story.md`, `design.md` y `tasks.md`; detecta 4 tipos de inconsistencias (TIPO A-D); genera `analyze.md` con tabla de cobertura por AC
- **Skill `/story-plan`** (FEAT-060) — orquestador del pipeline de planning: `story-design → story-tasking → story-analyze`; flag `--skip-analyze`; tabla de estado por paso
- **Skill `/story-implement`** (FEAT-061) — implementa una historia SDD tarea por tarea siguiendo TDD; genera test fallido → código mínimo; actualiza `tasks.md` en tiempo real; genera `implement-report.md`; precondición de estado `READY-FOR-IMPLEMENT/DONE` requerida
- **Skill `/changelog-generator`** — genera release notes y changelogs profesionales; soporta Keep a Changelog, release notes amigables y técnicas; categoriza por tipo de cambio (feat, fix, security, etc.)
- **Máquina de estados del ciclo de vida de historias SDD** (FEAT-062) — define formalmente los estados válidos y transiciones: `BACKLOG/TODO → SPECIFYING/IN‑PROGRESS → READY-FOR-PLAN/DONE → PLANNING/IN‑PROGRESS → READY-FOR-IMPLEMENT/DONE → IMPLEMENTING/IN‑PROGRESS → READY-FOR-CODE-REVIEW/DONE`

- **Skill `/docs-wiki-builder`** (FEAT-044) — reorganiza `docs/` como wiki navegable con índice central `docs/index.md` y wikilinks internos `[[slug]]`; patrón LLM Wiki (Karpathy); soporta `--update` y `--dry-run`
- **Skill `/header-aggregation`** (FEAT-040) — agrega tabla de contenido a documentos Markdown existentes
- **Skill `/readme-builder`** (FEAT-042) — genera `README.md` completo desde artefactos SDDF; descubrimiento de contenido en 3 tiers
- **Skill `/skill-master`** (FEAT-048) — ciclo iterativo de creación y mejora de skills; scripts Python y agentes `analyzer`, `comparator`, `grader`; viewer HTML de benchmarking
- **Wiki guides** — `docs/wiki/guides/` con buenas prácticas, estrategia de branching SDDF Git Flow y modelo Flight Levels
- **Runbook despliegue a npm** — `docs/runbooks/deployment-to-npm.md`

### Changed

- **`story-refine`** — añade gestión de ciclo de vida de estados: establece `status: SPECIFYING / substatus: IN‑PROGRESS` al iniciar o retomar una historia y `status: READY-FOR-PLAN / substatus: DONE` al aprobar FINVEST; reemplaza los valores `IN-PROGRESS`/`DONE` por los estados canónicos de la máquina de estados; añade sección "Modos de Ejecución" (manual y retomar backlog)
- **`story-plan`** — añade transición `status: PLANNING / substatus: IN‑PROGRESS` al inicio del pipeline (incondicional, permite re-ejecución sobre cualquier estado previo); resumen final reporta si el estado fue actualizado correctamente; añade tabla de ciclo de vida de estados
- **`story-analyze`** — añade actualización de frontmatter a `status: READY-FOR-IMPLEMENT / substatus: DONE` al finalizar sin ERROREs; si hay inconsistencias ERROR-level el estado permanece en `PLAN/IN‑PROGRESS`; aplica tanto en modo manual como en modo Agent; confirmación final refleja el estado resultante
- **`story-implement`** — añade precondición de estado (`READY-FOR-IMPLEMENT/DONE` requerido); error descriptivo con estado actual si no se cumple; actualización a `IMPLEMENTING/IN‑PROGRESS` antes de la primera tarea; actualización a `READY-FOR-CODE-REVIEW/DONE` y checklist del release al finalizar
- **`story-evaluation`** — añade sección "Modos de Ejecución" (manual y Agent), documentando qué retorna en cada modo para que el orquestador actualice el estado de `story.md`

- **Restructura de `$SPECS_BASE/specs/`** — migrado a la convención workitem-per-directory: cada proyecto, release e historia ocupa su propio directorio con un archivo canónico (`project.md`, `release.md`, `story.md`); wikilinks y referencias `parent:` actualizados
- **`substatus` en lugar de `Estado`** — reemplazado el campo `**Estado:**` por `substatus` en todos los skills y agentes del pipeline; afecta 17 archivos; incluye actualización del template `release-spec-template.md`
- **Assets empaquetados por skill** (FEAT-048) — renombradas todas las carpetas `templates/` dentro de los skills a `assets/`; actualizadas todas las referencias en SKILL.md, agentes y documentación
- **Skills multicliente con rutas relativas** (FEAT-047) — los skills del pipeline actualizados para usar rutas relativas a su directorio base; eliminada dependencia de paths absolutos

---

## [1.5.6] — 2026-04-25

### Fixed

- `package.json` — corrección de campos de metadata del paquete npm

---

## [1.5.5] — 2026-04-25

### Changed

- Eliminada integración por comandos `opsx:*` en favor de invocación por skills
- Añadida entrada en `.gitignore` para excluir archivos generados de `openspec/`

---

## [1.5.4] — 2026-04-25 — npm Package & Local Install

### Added

- **Publicación como paquete npm** (FEAT-039) — `package.json` con metadata completa; `npm install -g agile-sddf` instala el framework globalmente con script `postinstall` que copia skills y agentes a `~/.claude/`
- **Instalación local** (FEAT-041) — `npm install agile-sddf` copia skills y agentes a `./.claude/` del proyecto actual sin afectar la instalación global; `scripts/postinstall.js` detecta automáticamente el tipo de instalación (global vs local)
- **Assets empaquetados por skill** — cada directorio de skill incluye su propio subdirectorio `assets/` para portabilidad multi-cliente; los templates y recursos se copian junto con el skill en la instalación

### Fixed

- `scripts/postinstall.js` — incluido el directorio de agentes en el paso de copia (resuelto en 3 iteraciones de fix)

---

## [1.4.0] — 2026-04-23 — Release & Story Generator + OpenSpec Utilities

### Added

- **Skill `/release-generate-stories`** (FEAT-029) — genera archivos `story-[ID]-[nombre-kebab].md` en `$SPECS_BASE/specs/stories/` a partir de las features de un archivo de release; acepta nombre corto, nombre con extensión o ruta relativa como input; solicita confirmación antes de sobreescribir historias existentes
- **Skill `/release-generate-all-stories`** (FEAT-035) — procesa en modo batch todos los archivos `.md` de `$SPECS_BASE/specs/releases/` en orden alfabético; detecta conflictos anticipadamente con confirmación global única (sobreescribir todo / saltar todos / decidir uno por uno); muestra resumen consolidado con contadores al finalizar
- **Skill `/openspec-init-config`** (FEAT-036) — carga el contexto del proyecto en `openspec/config.yaml` leyendo exhaustivamente `README.md`, `CLAUDE.md` y `AGENTS.md`; actualiza únicamente el campo `context:` preservando `schema:` y `rules:`; ejecutado sobre el propio proyecto SDDF para inicializar el contexto de OpenSpec
- **Skill `/openspec-generate-baseline`** (FEAT-037) — genera una línea base de especificaciones OpenSpec mediante ingeniería inversa del código fuente (`src/`, `README.md`, `AGENTS.md`); invoca `/opsx:propose baseline` con instrucción de reverse engineering y archiva el change directamente sin fase de apply; detecta conflictos si ya existe un change `baseline` (opción de sobreescribir o usar sufijo de fecha)

### Changed

- **Centralización de skills y agentes** — `.claude/` es ahora la fuente única de verdad para skills y agentes; `.agents/` y `.github/` apuntan via symlinks a `.claude/skills/` y `.claude/agents/`
- **Rovo agents actualizados** — agentes Rovo (`release-creator`, `release-validator`) alineados con las convenciones de naming y estructura actuales del proyecto

### OpenSpec

- Specs archivadas y promovidas a `openspec/specs/`:
  - `release-generate-stories/spec.md` — 7 requisitos
  - `release-generate-all-stories/spec.md` — 5 requisitos
  - `openspec-load-context/spec.md` — 3 requisitos (renombrado a `openspec-init-config`)
  - `openspec-generate-baseline/spec.md` — 4 requisitos

---

## [1.3.3] — 2026-04-18

### Changed
- Clarified automatic rejection rule in `story-evaluation` to explicitly scope `INVE-T` as all INVEST dimensions except `S` (Small)
- Strengthened `story-product-owner` guidance with stricter story-writing checks:
  - Added explicit guardrails for a real, concrete user role in `Como`
  - Added explicit clarity criteria for `Quiero`
  - Expanded refinement guidance to include `DIVIDIR` decisions and separate weak cohesion from pure size issues

### Added
- Archived OpenSpec change `add-skill-story-refine` under `openspec/changes/archive/2026-04-18-add-skill-story-refine/` with full proposal/design/spec/tasks artifacts
- Promoted capability spec to `openspec/specs/story-refine-skill/spec.md`

---

## [1.3.2] — 2026-04-18

### Added
- Skill `/project-flow` as a single entry-point orchestrator for the full ProjectSpecFactory pipeline (`project-begin` → `project-discovery` → `project-planning`) in one interactive session
- Review gates between phases to enforce explicit confirmation and transition each output document from `**substatus**: IN‑PROGRESS` to `**substatus**: DONE`
- Startup state detection logic in `project-flow` to resume from the appropriate phase based on existing outputs in `$SPECS_BASE/specs/projects/`
- Main OpenSpec capability spec for `project-flow-skill` at `openspec/specs/project-flow-skill/spec.md`

---

## [1.3.1] — 2026-04-17

### Changed
- Renamed skill `finvest-evaluation` → `story-finvest-evaluation` for consistency with the `story-` prefix convention used by sibling skills (`story-creation`, `story-split`)
  - Renamed directories in `.claude/skills/`, `.agents/skills/`, `.github/skills/`
  - Updated `name:` and heading in all three copies of `SKILL.md`
  - Updated all references in `story-creation`, `story-split`, `rovo/` agents, and `README.md`

### Added
- **Restricciones de entrada** section in `story-finvest-evaluation/SKILL.md`: el skill ahora ignora adjuntos de imagen (wireframes, screenshots) y evalúa únicamente el texto Markdown de la historia de usuario

---

## [1.3.0] — 2026-04-17 — Reverse Engineering

### Added
- Skill `reverse-engineering` (invocation: `/reverse-engineering`)
- Reverse-engineering agents to follow `reverse-engineer-<rol>` convention:
  - `reverse-engineer-architect.agent.md`
  - `reverse-engineer-business-analyst.agent.md`
  - `reverse-engineer-ux-flow-mapper.agent.md`
  - `reverse-engineer-product-discovery.agent.md`
  - `reverse-engineer-synthesizer.agent.md`

---

## [1.2.1]

### Changed
- Renamed agent files to follow `project-` prefix convention:
  - `architect.agent.md` → `project-architect.agent.md` (`name: project-architect`)
  - `product-manager.agent.md` → `project-pm.agent.md` (`name: project-pm`)
  - `ux-designer.agent.md` → `project-ux.agent.md` (`name: project-ux`)
- Renamed skill directories and commands to follow `project-` prefix convention:
  - `/ps-begin-intention` → `/project-begin-intention`
  - `/ps-discovery` → `/project-discovery`
  - `/ps-planning` → `/project-planning`
- Updated all skill invocations, agent cross-references, specs, and documentation to reflect new names

---

## [1.2.0] — 2026-04-16 — ProjectSpecFactory CLI

### Added
- **ProjectSpecFactory CLI pipeline** — three-skill workflow for project specification:
  - `/ps-begin-intention` — captures project intent and produces `$SPECS_BASE/specs/projects/project-intent.md`
  - `/ps-discovery` — conducts user discovery and produces `$SPECS_BASE/specs/projects/project.md`
  - `/ps-planning` — generates prioritized release backlog and produces `$SPECS_BASE/specs/projects/project-plan.md`
- **Role-based agents** — three specialized agents replacing task-based agents:
  - `architect.agent.md` — technical architect for Specifying and Planning phases
  - `product-manager.agent.md` — PM for Begin Intention and Discovery phases
  - `ux-designer.agent.md` — UX Designer supporting Discovery phase
- **Skill templates** — `project-intent-template.md`, `project-template.md`, `project-plan-template.md`
- **Gem prompts** — standalone prompt files for `ps-begin-intention`, `ps-discovery`, `ps-planning`
- **OpenSpec workflow** — `opsx:propose`, `opsx:apply`, `opsx:archive`, `opsx:explore` skills and commands
- **OpenSpec specs** — baseline specifications for all pipeline capabilities
- **Sample output documents** — `project-intent.md`, `requirement-spec.md`, `project-plan.md` for ProjectSpecFactory itself

---

## [1.1.0] — 2026-04-09 — Features-spec-builder

### Added
- **`/story-creation`** — creates a user story in story-gherkin format (Como/Quiero/Para + Gherkin) applying Mike Cohn, 3 C's, and INVEST principles
- **`/story-split`** — splits a large story into smaller independent stories using 8 splitting patterns
- **`/finvest-evaluation`** — evaluates story quality with the FINVEST rubric (Formato + INVEST) on a Likert 1–5 scale; produces per-dimension scores, global score, and Ready / Refine / Reject decision
- **`story-template.md`** — canonical template shared across story skills
- **`output-template.md`** — evaluation output template for finvest-evaluation
- **Examples** — `example-ready.md`, `example-refinar.md`, `example-rechazar.md` for finvest-evaluation
- **Dockerization** — Docker support for local development
- **`CLAUDE.md`** — global project instructions
- **`skills-lock.json`** — skill dependency lock file

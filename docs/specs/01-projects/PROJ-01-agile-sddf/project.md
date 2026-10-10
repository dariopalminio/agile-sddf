---
type: project
id: PROJ-01
slug: PROJ-01-agile-sddf
title: "Especificación de Requisitos — Agile SDDF"
status: COMPLETED
substatus: DONE
parent: null
created: 2026-04-19
updated: 2026-08-30
related:
  - vision
  - roadmap
  - story-map
---

<!-- Referencias -->
[[vision]] · [[roadmap]] · [[story-map]]

> **Nota de vigencia.** La primera versión de este documento (2026-04-19) fue generada por
> `/reverse-engineering` sobre el repositorio de entonces. Esta revisión (2026-08-30) es una
> reescritura completa contra el estado verificado del repositorio: 34 skills, 10 agentes, 19 épicas
> y 77 historias. El procedimiento seguido está documentado en [[runbook-actualizar-spec-de-proyecto]].

# 1. Definición del proyecto

## 1.1. Nombre de Proyecto

Agile SDDF — Agile Spec-Driven Development Framework (paquete npm `agile-sddf`)

## 1.2. Definición del Problema

Los builders, freelancers, desarrolladores y equipos ágiles que usan IA para construir software
carecen de un proceso estructurado y reproducible que vaya desde la intención inicial hasta el código
verificado. El flujo habitual es ad-hoc: prompts inconsistentes, sin trazabilidad entre intención y
código, sin puntos de revisión humana, sin control de scope y sin forma de demostrar que lo
implementado corresponde a lo especificado.

El impacto es doble. Aguas arriba, requisitos incompletos y productos que no resuelven el problema
original. Aguas abajo, código generado por IA que nadie puede auditar contra una especificación,
porque esa especificación nunca existió como artefacto versionado: se disolvió en el historial de una
conversación.

## 1.3. Visión (elevator pitch)

- **Para:** Builders, freelancers, desarrolladores y equipos ágiles que usan IA para acelerar el desarrollo de software
- **Quiénes:** Sufren de procesos manuales, prompts inconsistentes y falta de estructura para transformar ideas en especificaciones y código de calidad de manera predecible y auditable
- **Nuestro producto:** Agile SDDF (Agile Spec-Driven Development Framework)
- **Es un:** software AI-CLI tipo framework de automatización multiagente — un harness de LLM y un conjunto de skills preconstruidos que cubren el ciclo completo de especificación e implementación en tres niveles de vuelo (proyecto → épica → historia)
- **Que provee:** un workflow ágil y secuencial con control de WIP, gates de revisión humana, quality gates ejecutables basados en el Definition of Done, implementación guiada por TDD (RED → GREEN → REFACTOR) y trazabilidad completa desde la intención inicial hasta el código y sus pruebas, todo gestionado con archivos Markdown versionados en el propio repositorio
- **A diferencia de:** escribir prompts ad-hoc, usar herramientas monolíticas o frameworks rígidos que no se adaptan al contexto del proyecto, o asistentes que generan código sin ninguna especificación que auditarlo contra
- **Nuestro producto:** es el único sistema que extrae dinámicamente la estructura de los templates en tiempo de ejecución para generar preguntas y comportamientos contextuales, mantiene el repositorio como sistema (specs, políticas y ADRs versionados junto al código), y permanece agnóstico al stack tecnológico delegando los generadores de tests y de código a skills *worker* declarados en configuración

## 1.4. Beneficios Clave

- **Ciclo completo automatizado en tres niveles:** de la intención (`project-intent.md`) al plan de
  épicas, de la épica al backlog de historias, y de la historia al código implementado con TDD, sin
  salir del framework y con gates de revisión humana entre etapas
- **Trazabilidad verificable:** IDs jerárquicos (`PROJ-NN` → `EPIC-NN` → `STORY-NNN`), frontmatter de
  estado en cada artefacto y correspondencia explícita entre cada criterio Gherkin, su elemento de
  diseño (`// satisface: AC-N`), su tarea y su caso de prueba
- **El Definition of Done como gate ejecutable, no como checklist decorativa:** `story-analyze`,
  `story-code-review`, `story-verify` y `story-acceptance` bloquean el avance de la historia si el
  DoD de su fase no se cumple
- **Agnóstico al stack y a la plataforma:** los mismos skills operan en Claude Code, OpenCode y
  GitHub Copilot eligiendo la carpeta destino al instalar; los generadores de tests y código se
  declaran en `sddf.config.yaml` y viven fuera del core
- **Ingeniería inversa de codebases existentes:** un repositorio sin especificación puede producir su
  `project.md` automáticamente mediante análisis paralelo de cuatro agentes y un sintetizador
- **Calidad de historias garantizada:** rúbrica FINVEST (Formato + INVEST) con scores Likert 1-5,
  decisión accionable y ciclo de refinamiento automatizado con gate anti-bucle

## 1.5. Criterios de Éxito

- [x] El pipeline de proyecto (`project-begin` → `project-discovery` → `project-planning`) produce
      los 3 documentos canónicos en una sesión continua — *evidencia: los propios
      `project-intent.md`, `project.md` y `project-plan.md` de este repositorio*
- [x] El skill `story-evaluation` aplica la rúbrica FINVEST y produce una decisión (APROBADA /
      REFINAR / RECHAZAR / DIVIDIR) con score Likert 1-5 por dimensión
- [x] El skill `reverse-engineering` genera un `project.md` completo desde un repositorio existente
      con al menos el 80% de secciones completadas automáticamente
- [x] El control WIP=1 impide activar un segundo ítem sin confirmación explícita del usuario
- [x] Cualquier skill puede adoptarse en otro runtime de IA sin modificar su `SKILL.md` — *evidencia:
      `scripts/install.js` copia la misma fuente a `.claude/`, `.agents/` o `.github/`*
- [x] El framework está publicado en npm e instalable en un proyecto ajeno — *evidencia:
      `agile-sddf` v2.0.0*
- [x] El framework se especifica a sí mismo con sus propios skills (dogfooding) — *evidencia: 19
      épicas y 77 historias en `docs/specs/`*
- [x] Una historia puede recorrer el workflow completo `SPECIFY → PLAN → READY-FOR-IMPLEMENT →
      IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE` produciendo sus artefactos en cada fase
- [ ] Todos los skills críticos tienen `evals/evals.json` — *parcial: 23 de 34 (68%)*
- [x] Todas las épicas usan la máquina de estados canónica de épica — *evidencia: migración del
      2026-08-30 conforme a [[migracion-retroactiva-de-estados-de-epica]] (ADR-0006)*

## 1.6. Restricciones

- **Technical**: El framework es declarativo — skills, agentes y templates son exclusivamente
  Markdown. La única parte ejecutable es Node.js ≥ 18 (`scripts/cli.js`, `install.js`,
  `postinstall.js`), con `fs-extra` como única dependencia de runtime. Sin base de datos: la
  persistencia es el sistema de archivos. Requiere un runtime de IA compatible (Claude Code como
  primario; OpenCode y GitHub Copilot soportados). El entorno de desarrollo reproducible usa Docker
  (`debian:bookworm-slim`).
- **Time**: Sin deadline definido — proyecto continuo que evoluciona orgánicamente.
- **Resources**: Un solo desarrollador. Los skills *worker* específicos por stack tecnológico no se
  mantienen en este repositorio: viven en el repositorio de extensiones
  [`agile-sddf-extension`](https://github.com/dariopalminio/agile-sddf-extension) y se declaran en
  `sddf.config.yaml`.

## 1.7. Fuera de alcance (Non-Goals)

- **Workers de stack tecnológico en el core.** Los generadores de tests y de código específicos por
  tecnología (React Testing Library, Playwright/Cucumber, Cypress/Cucumber, librerías UI) se instalan
  aparte desde `agile-sddf-extension`. El core permanece agnóstico al stack.
- **Exportación a herramientas externas:** PDF, Jira, Linear, Notion o GitHub Issues.
- **Autenticación de usuarios o control de acceso por roles.** El framework es CLI monousuario; el
  único control de avance es la precondición de estado del artefacto de entrada.
- **Mensajería, notificaciones push o dashboards.**
- **Gestión de múltiples work items activos en paralelo por nivel.** WIP=1 es una restricción de
  diseño deliberada, no una limitación pendiente de resolver.
- **Despliegue a producción.** Los estados `DELIVER` y `COMPLETED` son transiciones manuales o de
  CI/CD; ningún skill las escribe.
- **Un motor de ejecución propio.** El framework no ejecuta LLMs: se apoya en el harness del runtime
  de IA del usuario.

## 1.8. Características de los Usuarios

Los perfiles de usuario (US-001 a US-006) viven en [[stakeholders]] › Usuarios y roles.

# 2. Requisitos

## 2.1 Requisitos Funcionales

Los 53 requisitos funcionales (FR-001 a FR-054, sin FR-049) viven como un documento por requisito en docs/requirements/functional/; índice por categoría en [[requirements-index]].

## 2.2. Requisitos No Funcionales

Los 24 requisitos no funcionales (NFR-001 a NFR-024) viven como un documento por requisito en docs/requirements/non-functional/; índice por categoría en [[requirements-index]].

## 2.3. Experiencia de usuario (UX) y Diseño de Interfaz (UI)

El sistema es un framework CLI/conversacional sin interfaz gráfica. La «interfaz» es la conversación
entre el usuario y los agentes dentro del runtime de IA. Los patrones de UX establecidos son:

- **Entrevista conversacional acotada**: los agentes formulan 3-4 preguntas por ronda y esperan
  respuesta antes de continuar, derivando las preguntas del template activo.
- **Gates de revisión explícitos**: antes de avanzar entre fases, el sistema presenta un resumen y
  solicita confirmación binaria («Sí, continuar» / «No, necesito ajustes»).
- **Quality gates que bloquean**: a diferencia del gate de revisión (que pide opinión), el quality
  gate evalúa el DoD y **retrocede la historia** si no se cumple, sin negociación.
- **Conflictos de WIP con opciones cerradas**: ante conflicto WIP=1 el sistema ofrece exactamente dos
  opciones («Sobrescribir» / «Retomar»), sin ambigüedad.
- **Gate anti-bucle en refinamiento**: `story-specify` siempre pide confirmación antes de reiterar,
  con tres salidas explícitas: seguir iterando, cerrar manualmente, o dejar en curso.
- **Modo interactivo por defecto, automático bajo demanda**: el ciclo TDD pausa entre fases salvo que
  se invoque con `--auto`, pensado para CI.
- **`--dry-run` antes de escribir**: los skills que modifican múltiples archivos permiten previsualizar.
- **Retroalimentación como artefacto, no como mensaje**: cuando la revisión de código encuentra
  bloqueantes, produce `fix-directives.md` — un documento accionable que `story-implement` consume
  para reanudar, en vez de un texto que se pierde en el hilo de conversación.
- **Reportes auditables por fase**: cada gate deja un reporte en el directorio de la historia, de
  modo que el estado del trabajo es legible sin releer la conversación.

# 3. Diseño de interfaz gráfica (UI) y experiencia de usuario (UX)

## 3.1. Design Vibe

Minimalista y conversacional — el framework no tiene interfaz gráfica propia. La experiencia visual es
Markdown renderizado en el runtime de IA del usuario. El estilo de los documentos generados es
profesional, estructurado y con trazabilidad visible: IDs jerárquicos, estados en frontmatter, niveles
de confianza y checkboxes de progreso.

- **Ejemplos:**
  - «Profesional y técnico, con estructura clara de documentos Markdown»
  - «Conversacional y guiado, con preguntas contextuales derivadas del template»

## 3.2. Visual Inspiration

- **Referencias:** No aplica como interfaz web. Los artefactos visuales del proyecto son el diagrama
  de contexto C4 (`context-diagram.puml`), los diagramas Mermaid de la máquina de estados en
  `docs/guides/state-machine.md`, y el grafo de la wiki visualizable con
  [Foam](https://foambubble.github.io/foam/) sobre los wikilinks de `docs/index.md`.
- **Estilo:** CLI / conversacional.
- **Mood board:** documentos Markdown bien estructurados con encabezados jerárquicos, tablas, árboles
  ASCII, diagramas Mermaid y checkboxes de estado.

## 3.3. Mapas de Navegación

Estilo Árbol Jerárquico (Tree). El árbol siguiente refleja los pipelines reales del framework; la
semántica completa de los estados vive en `[[state-machine]]` y no se duplica aquí.

```
AGILE SDDF — Sistema de invocación de skills (34 skills · 10 agentes + 7 subagentes locales)
│
├── PASO 0 — Protocolo de entorno (transversal, obligatorio en todo skill)
│   ├── sddf-init            → crea specs/{01-projects,02-epics,03-stories,templates},
│   │                          sddf.config.yaml, .env.template  ·  idempotente
│   │                          └── invoca project-policies-generation
│   └── skill-preflight      → verifica SDDF_ROOT + estructura + templates → OK | WARNING | ERROR
│
├── NIVEL L3 — PROYECTO  (control por substatus · WIP=1 · gate humano entre fases)
│   │
│   ├── project-flow  ← orquestador de las 3 fases en una sesión
│   │   ├── [Fase 1] project-begin       → agente project-pm
│   │   │              Precondición: ninguna (entry point)      Output: project-intent.md
│   │   ├── [Fase 2] project-discovery   → agentes project-pm + project-architect (+ project-ux)
│   │   │              Precondición: project-intent.md en DONE  Output: project.md
│   │   └── [Fase 3] project-planning    → agente project-architect
│   │                  Precondición: project.md en DONE         Output: project-plan.md
│   │                  └── usa story-map.md como guía si existe
│   │
│   ├── project-story-mapping  → agente project-story-mapper    Output: story-map.md
│   ├── project-context-diagram   [--interactive | --from-files] Output: context-diagram.puml
│   └── project-policies-generation  Output: constitution.md + dod-story.md
│
├── ENTRADA ALTERNATIVA — Ingeniería inversa (repo existente → especificación)
│   └── reverse-engineering        [--focus <path> | --update | --verbose]
│       ├── Fase 1 — 4 agentes en paralelo, cada uno escribe en .tmp/<skill-name>/
│       │   ├── reverse-engineer-architect          → arquitectura y stack
│       │   ├── reverse-engineer-product-discovery  → inventario de features
│       │   ├── reverse-engineer-business-analyst   → catálogo de reglas de negocio
│       │   └── reverse-engineer-ux-flow-mapper     → mapa de navegación
│       ├── Fase 2 — reverse-engineer-synthesizer   → project.md
│       └── Fase 3 — recuento de secciones PENDING MANUAL REVIEW
│
├── NIVEL L2 — ÉPICA  (DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED)
│   ├── epic-creation          [--quick]     Output: EPIC-NN-slug/epic.md   (interactivo)
│   ├── epic-from-project-plan               Output: EPIC-NN-slug/epic.md × N (desde project-plan.md)
│   ├── epic-format-validation  ← GATE       Veredicto: APROBADO | REFINAR | RECHAZADO
│   ├── epic-generate-stories                Output: STORY-NNN-slug/story.md × N (una épica)
│   └── epic-generate-all-stories            Output: STORY-NNN-slug/story.md × N (todas, batch)
│
└── NIVEL L1 — HISTORIA
    │   SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY
    │           → ACCEPTANCE → DELIVER → COMPLETED
    │
    ├── [SPECIFY]  story-specify  ← orquestador con gate anti-bucle
    │   ├── story-creation      → story.md (Como/Quiero/Para + Gherkin)
    │   ├── story-evaluation    → finvest-evaluation-report.md
    │   │   ├── F_score < 2.5              → RECHAZAR sin evaluar INVEST
    │   │   └── decisión: APROBADA (≥4.0) | REFINAR (3.0–4.0) | RECHAZAR (<3.0) | DIVIDIR (S=1)
    │   ├── story-split         [--pattern N | --core N | --dry-run]  → N × story.md (8 patrones)
    │   ├── story-improve       → story.md mejorado + .bak + story-improvement-log.md
    │   └── agente story-product-owner  (fortalece la redacción antes de re-evaluar)
    │                                                              Salida: SPECIFY/DONE
    │
    ├── [PLAN]  story-plan  ← orquestador   [--only-tasks | --only-testcases | --skip-analyze]
    │   ├── story-design        → design.md      (cada elemento: // satisface: AC-N)
    │   ├── story-tasking       → tasks.md       (atómicas, ordenadas por dependencia)
    │   ├── story-testcases     → testcases.md   (TC-NNN tipificados UT/CT/IT/API/E2E/EV)
    │   └── story-analyze  ← GATE DoD PLAN → analyze.md
    │                          sin ERRORs → READY-FOR-IMPLEMENT/DONE
    │
    ├── [IMPLEMENT]  story-implement   [--auto]   ← ciclo TDD, agnóstico al stack
    │   ├── RED       genera pruebas que fallan  → delega en test_generators de sddf.config.yaml
    │   ├── GREEN     implementa el mínimo       → delega en code_generators de sddf.config.yaml
    │   ├── REFACTOR  mejora sin romper la suite
    │   ├── reanudación desde IMPLEMENT/IN-PROGRESS leyendo fix-directives.md
    │   └── variante story-implement-tasks (tarea por tarea sobre tasks.md)
    │                                       Output: código + implement-report.md → IMPLEMENT/DONE
    │
    ├── [CODE-REVIEW]  story-code-review   [--single-agent]   ← GATE DoD CODE-REVIEW
    │   ├── 3 agentes locales en paralelo: tech-lead · product-owner · integration
    │   ├── invoca security-audit cuando el cambio lo amerita
    │   └── [Bifurcación]
    │       ├── aprobado    → code-review-report.md            → CODE-REVIEW/DONE
    │       └── bloqueantes → fix-directives.md                → READY-FOR-IMPLEMENT/DONE
    │
    ├── [VERIFY]  story-verify  [--mode | --dry-run | --verbose]  ← agente local qa-engineer
    │   ├── modo: config (sddf.config.yaml) | delegado | e2e | unit | manual
    │   └── verify-report.md   →  DoD ✓ VERIFY/DONE   ·   DoD ✗ READY-FOR-IMPLEMENT/DONE
    │
    ├── [ACCEPTANCE]  story-acceptance  [--restart | --dry-run | --validator]
    │   └── acceptance-report.md por criterio: APPROVED | REJECTED | BLOCKED
    │       ├── todos APPROVED → ACCEPTANCE/DONE
    │       ├── ≥1 REJECTED    → READY-FOR-IMPLEMENT/DONE
    │       └── ≥1 BLOCKED     → ACCEPTANCE/BLOCKED
    │
    └── [DELIVER → COMPLETED]  transición manual o de CI/CD — ningún skill la escribe

SKILLS TRANSVERSALES (invocables en cualquier momento)
├── header-aggregation    → frontmatter YAML canónico (individual o batch por directorio)
├── docs-wiki-builder     [--update | --dry-run] → index.md con wikilinks [[slug]]
└── security-audit        → audit-report.md (OWASP Top 10 · API Top 10 · LLM Top 10)

DISTRIBUCIÓN
└── agile-sddf install  [--global | --target .claude|.agents|.github | --force]
    ├── scripts/cli.js         parseo de comandos y flags
    ├── scripts/install.js     copia skills/ y agents/ al destino elegido
    └── scripts/postinstall.js hook de npm — instalación silenciosa a .claude/
```

## 3.4. Wireframe ASCII (Box Drawing)

No aplica: el sistema no tiene interfaz gráfica. La representación visual del framework son el
diagrama de contexto C4 (`context-diagram.puml`) y los diagramas de estado en Mermaid de
`docs/guides/state-machine.md`.

# 4. Arquitectura Técnica

## 4.1. Stack tecnológico

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Lenguaje de definición | Markdown (`.md`) con frontmatter YAML | Skills, agentes, templates y specs |
| Lenguaje ejecutable | Node.js ≥ 18 | Solo `scripts/`: instalación y mantenimiento |
| Dependencia de runtime | `fs-extra` ^11 | Única dependencia del paquete |
| Distribución | npm — paquete público `agile-sddf` v2.0.0 | `files`: `agents/`, `skills/`, `scripts/`, `sddf.config.yaml`, `README.md`, `LICENSE` |
| Runtime primario | Claude Code | Instala en `.claude/` |
| Runtime alternativo | OpenCode | Instala en `.agents/` |
| Runtime alternativo | GitHub Copilot | Instala en `.github/` |
| Configuración operacional | `sddf.config.yaml` | Comandos de prueba por tipo + workers de test/código por capa |
| Configuración de rutas | Variable de entorno `SDDF_ROOT` | Default `docs/` |
| Persistencia | Sistema de archivos | Sin base de datos |
| Canal entre agentes | `.tmp/<skill-name>/` | No versionado (`.gitignore`) |
| Contenedor de desarrollo | Docker + docker-compose, `debian:bookworm-slim` | `Dockerfile.dev`, `docker-compose.dev.yml` |
| IDE | VS Code Dev Container | `.devcontainer/devcontainer.json` |
| CI | GitHub Actions | `skill-security-audit.yml` (Skill Shielder), `docker-security.yml` |
| Control de versiones | Git / GitHub, SemVer + `CHANGELOG.md` | Estrategia de ramas: `[[branching-strategy-sddf-git-flow]]` |

**Patrón arquitectónico.** Framework de agentes multi-plataforma con orquestación por skills. No es
monolito ni microservicio: es un sistema de instrucciones declarativas distribuidas que se ejecutan
dentro del harness de un runtime de IA. El repositorio es el sistema — specs, políticas, ADRs y
memoria de decisiones viven versionados dentro de él.

**Modelo de delegación.** Dos mecanismos, con una regla de profundidad estricta:

```
skill orquestador (sesión principal)
    ├── skill B (composición inline — misma sesión, contexto compartido, cadenas cortas)
    ├── agent A (subagente — contexto nuevo y aislado)
    └── agent C (subagente — contexto nuevo y aislado)
                  └── ✗ prohibido: un subagente no delega en otro subagente
```

Cada subagente escribe su resultado en `.tmp/<skill-name>/` y devuelve el control; el orquestador lee
solo esos archivos para consolidar y nunca le pasa al subagente su contexto heredado completo. Los
subagentes tampoco invocan skills orquestadores: si necesitan la lógica de un skill, el orquestador se
la pasa en el prompt o les indica el archivo que deben leer. Un subagente sí puede seguir un skill
*worker* — sin interacción con el usuario, sin lanzar subagentes y sin depender de contexto
conversacional no provisto. Detalle completo en `[[best-practices-for-skills]]` y ADR-0002.

**Agentes.** Diez agentes globales en `agents/` (`project-pm`, `project-architect`, `project-ux`,
`project-story-mapper`, `story-product-owner` y los cinco `reverse-engineer-*`) y siete subagentes
locales que viven dentro del skill que los usa: tres revisores en `story-code-review/agents/`, tres
en `security-audit/agents/` y `qa-engineer` en `story-verify/agents/`.

**Frontera core / extensión.** El core es agnóstico al stack tecnológico: `story-implement` y
`story-verify` no saben nada de React, Playwright ni npm scripts. Los skills *worker* específicos por
tecnología viven en el repositorio de extensiones `agile-sddf-extension`, se instalan aparte y se
declaran en `sddf.config.yaml` bajo `implement.test_generators` e `implement.code_generators`. Esta
frontera permite que el core evolucione sin arrastrar el ciclo de vida de cada stack soportado. La
extensión aloja además utilidades documentales como `readme-builder`, cuya plantilla evoluciona con
las convenciones de presentación de cada proyecto y no con el pipeline SDD.

## 11. Referencias

- [[index]] — `docs/index.md`, cursor de entrada a toda la documentación del repositorio
- [[vision]] — visión del producto (antes project-intent.md)
- [[roadmap]] — roadmap de épicas y plan original (antes project-plan.md) · [[story-map]] — mapa de historias
- [[constitution]] — principios técnicos inamovibles, stack y estándares de construcción de skills
- [[dod-story-checklist]] — Definition of Done por estado del workflow de historia
- [[state-machine]] — máquina de estados canónica (proyecto, épica, historia)
- [[specs-and-workflows]] — contratos, trazabilidad, `status` y `substatus`
- [[sddf-commands-pipeline]] — qué skill corre en cada fase
- [[best-practices-for-skills]] — modelo de delegación y contrato `.tmp/<skill>/`
- [[flight-leves-model]] — modelo de Niveles de Vuelo aplicado a los tres niveles del framework
- [[branching-strategy-sddf-git-flow]] — modelo de ramas (`<kind>/<id>-<slug>`)
- ADRs aceptados (inmutables — ver [[adr-index]]):
  [[centralizar-templates-compartidos]] (ADR-0001),
  [[invocacion-agentes-locales-de-skill]] (ADR-0002),
  [[workflow-canonico-story-y-epic]] (ADR-0003),
  [[nivel-l2-epic-y-directorios-numerados]] (ADR-0004),
  [[prefijo-story-para-el-nivel-l1]] (ADR-0005)
- [[runbook-deployment-to-npm]] — procedimiento de publicación del paquete
- [[runbook-actualizar-spec-de-proyecto]] — procedimiento de actualización de este documento

## 12. Definiciones y Acrónimos

| Término / Acrónimo | Definición |
|--------------------|-----------|
| **SDD** | Spec-Driven Development — desarrollo dirigido por especificaciones formales |
| **SDDF** | Spec-Driven Development Framework — este sistema |
| **Skill** | Archivo `SKILL.md` que define una capacidad especializada. Actúa como orquestador: lee contexto, delega y escribe output. No contiene lógica de dominio |
| **Skill worker** | Skill sin interacción con el usuario ni delegación, ejecutable por un subagente. Los workers específicos por stack viven en `agile-sddf-extension` |
| **Agente / Subagente** | Procesador especializado definido en `*.agent.md`, invocado por un skill en un contexto nuevo y aislado |
| **Agente local** | Subagente que vive dentro del directorio de su skill (`<skill>/agents/`) en vez de en `agents/` de la raíz. Ver ADR-0002 |
| **`SDDF_ROOT`** | Variable de entorno que define la raíz de artefactos. Default `docs/` |
| **`$SPECS_BASE`** | Ruta base resuelta de especificaciones: el valor de `SDDF_ROOT` o `docs/` |
| **`sddf.config.yaml`** | Configuración operacional por proyecto: comandos de prueba por tipo y skills worker delegados para generar tests y código |
| **`skill-preflight`** | Protocolo obligatorio de verificación de entorno, ejecutado como Paso 0 de todo skill |
| **`.tmp/<skill-name>/`** | Canal de comunicación entre subagentes y skill orquestador. No versionado. Evita el «teléfono descompuesto» |
| **Nivel L3 / L2 / L1** | Proyecto (`PROJ-NN`) / Épica (`EPIC-NN`) / Historia (`STORY-NNN`). Ver [[flight-leves-model]] |
| **Épica** | Work item de nivel medio. Desde ADR-0004, `release` queda reservado exclusivamente para CI/CD |
| **`kind`** | Campo de frontmatter de historia que declara el tipo de trabajo: `feat` \| `fix` \| `chore` \| `hotfix`. Compone el nombre de rama. Ver ADR-0005 |
| **`status`** | Etapa del pipeline en la que está un work item |
| **`substatus`** | Progreso dentro de la etapa: `TODO` \| `IN-PROGRESS` \| `DONE` \| `BLOCKED` |
| **WIP** | Work In Progress — restricción de máximo 1 documento con `substatus: IN-PROGRESS` por nivel |
| **DoD** | Definition of Done — criterios por estado que condicionan el avance. Gate ejecutable, no checklist |
| **Quality gate** | Punto de control que evalúa el DoD y **bloquea o retrocede** el work item si no se cumple |
| **Gate de revisión** | Punto de control que solicita confirmación humana antes de avanzar |
| **Gate anti-bucle** | Mecanismo de `story-specify` que impide iteraciones infinitas pidiendo confirmación explícita |
| **FINVEST** | Rúbrica de evaluación de historias: Formato + INVEST |
| **INVEST** | Independent, Negotiable, Valuable, Estimable, Small, Testable |
| **F_score** | Score de la dimensión Formato: `(puntaje_historia × 0.4) + (puntaje_criterios × 0.3) + (puntaje_gherkin × 0.3)` |
| **FINVEST_Score** | Score combinado final: `(F_score + INVEST_Score) / 2` |
| **TAD** | Tiny Act of Discovery — experimento de investigación generado por el patrón 8 de `story-split` cuando la historia tiene demasiadas incógnitas |
| **Gherkin** | Lenguaje de criterios de aceptación: Dado/Cuando/Entonces (Given/When/Then) |
| **TDD** | Test-Driven Development. Ciclo RED (test que falla) → GREEN (código mínimo) → REFACTOR |
| **`evals/evals.json`** | Casos de prueba declarados de un skill, definidos antes que su `SKILL.md` |
| **`TC-NNN`** | Identificador de caso de prueba en `testcases.md`, tipificado UT/CT/IT/API/E2E/EV |
| **`fix-directives.md`** | Artefacto que produce `story-code-review` ante hallazgos bloqueantes; `story-implement` lo consume para reanudar |
| **DELIVER** | Estado en que el incremento está listo para producción o ya desplegado. Transición manual o de CI/CD |
| **Walking Skeleton** | En User Story Mapping: versión mínima que demuestra la arquitectura de extremo a extremo |
| **Backbone** | En User Story Mapping: fila superior de actividades del usuario que organiza la secuencia |
| **DIRECT / INFERRED / SUGGESTED** | Niveles de confianza: confirmado en el código / derivado por análisis / hipótesis a confirmar |
| **Wikilink** | Enlace interno con sintaxis de doble corchete, resuelto contra el campo `slug` del frontmatter del documento destino |
| **ADR** | Architecture Decision Record. Los aceptados son inmutables: se reemplazan con uno nuevo (`superseded-by`) |
| **Skill Shielder** | Escáner de seguridad de skills ejecutado en CI |
| **`agile-sddf-extension`** | Repositorio externo con los skills worker específicos por stack tecnológico |

---

# Apéndice A — Estado de implementación

> Recuento verificado contra el filesystem el 2026-08-30.

## A.1 Épicas (19)

| ID | Slug | `status` / `substatus` | Capacidad aportada |
|----|------|------------------------|--------------------|
| EPIC-00 | estructura-base-y-mecanismo-de-templates | COMPLETED / DONE | Estructura fundacional y templates dinámicos |
| EPIC-01 | features-spec-builder | COMPLETED / DONE | Creación, evaluación y división de historias |
| EPIC-02 | project-spec-builder | COMPLETED / DONE | Pipeline de especificación de proyecto (L3) |
| EPIC-03 | reverse-engineering | COMPLETED / DONE | Ingeniería inversa de repositorios |
| EPIC-04 | refactor-features-spec-builder | COMPLETED / DONE | Consolidación y calidad de los skills de historia |
| EPIC-05 | enhance-project-spec | COMPLETED / DONE | Orquestación del pipeline, story mapping y refinamiento |
| EPIC-06 | release-and-story-generator | COMPLETED / DONE | Generación de épicas e historias derivadas |
| EPIC-07 | publicacion-framework-npm | COMPLETED / DONE | Publicación del framework en npm |
| EPIC-08 | npm-install-locally | COMPLETED / DONE | Instalación local del paquete |
| EPIC-09 | docs-and-wiki-builders | COMPLETED / DONE | README, wiki de documentación y metadatos |
| EPIC-10 | mejora-estructura-artefactos-nuevos-skills | COMPLETED / DONE | `SDDF_ROOT`, artefactos por work item, preflight, diagrama C4 |
| EPIC-11 | centralizar-templates | COMPLETED / DONE | Templates centralizados como fuente única (ADR-0001) |
| EPIC-12 | story-sdd-workflow | COMPLETED / DONE | Workflow SDD de historia end-to-end |
| EPIC-13 | quality-gates-con-dod-en-story-workflow | **DEFINE / IN-PROGRESS** | DoD como gate ejecutable, fases VERIFY y ACCEPTANCE |
| EPIC-14 | fabrica-de-skills | COMPLETED / DONE | Fábrica de skills y ciclo TDD en `story-implement` |
| EPIC-15 | e2e-capability | COMPLETED / DONE | Skills de testing especializado y capacidad E2E |
| EPIC-16 | enhancement-and-security | COMPLETED / DONE | Seguridad y fortificación de skills |
| EPIC-17 | remediating-and-improvement | **DEVELOP / DONE** | Remediación de deuda técnica y gobernanza (17 planes) |
| EPIC-18 | workflow-hardening | COMPLETED / DONE | Robustecimiento del workflow y traslado de `skills/` a la raíz |

Las 19 épicas usan valores de la máquina de estados canónica de épica: 17 en `COMPLETED/DONE`, una en
`DEVELOP/DONE` (EPIC-17) y una en `DEFINE/IN-PROGRESS` (EPIC-13). Los valores del esquema antiguo
(`RELEASED`, `DEFINITION`, `IMPLEMENT`, `substatus: READY`) se migraron el 2026-08-30 conforme a
[[migracion-retroactiva-de-estados-de-epica]] (ADR-0006).

## A.2 Historias (77 con `story.md`, en 79 directorios)

| `status` | Cantidad |
|----------|----------|
| COMPLETED | 66 |
| VERIFY | 3 |
| READY-FOR-IMPLEMENT | 3 |
| IMPLEMENT | 2 |
| READY-FOR-VERIFY | 1 |
| READY-FOR-CODE-REVIEW | 1 |
| BACKLOG | 1 |

Por tipo de trabajo (`kind`): 75 `feat`, 1 `fix` (STORY-087), 1 `chore` (STORY-086).
Dos directorios (`STORY-084`, `STORY-085`) contienen solo documentos de plan, sin `story.md`.

## A.3 Superficie del framework

| Componente | Cantidad |
|------------|----------|
| Skills en `skills/` | 34 |
| — con `evals/evals.json` | 23 (68%) |
| — con `assets/` (templates seed) | 23 |
| Agentes globales en `agents/` | 10 |
| Subagentes locales en `skills/*/agents/` | 7 |
| Templates centrales en `docs/specs/templates/` | 5 |
| ADRs aceptados | 5 |
| Guías en `docs/guides/` | 18 |
| Runbooks en `docs/runbooks/` | 4 |

# Apéndice B — Brechas y deuda conocida

> Solo hallazgos verificados contra el filesystem. Cada uno es accionable.

1. **Cinco historias sin épica padre.** STORY-046, STORY-074, STORY-075, STORY-076 y STORY-086
   declaran `parent: null`, rompiendo la trazabilidad L1 → L2. Las tres de `story-integrate`
   (074-076) forman un grupo coherente que justificaría una épica propia.
2. **STORY-084 y STORY-085 no tienen `story.md`**, solo documentos de plan; además sus IDs colisionan
   entre EPIC-14 y EPIC-15, donde designan trabajos distintos. Requiere reconciliar la numeración.
3. **`STORY-043/story.md` conserva los placeholders del template** en `status` y `substatus`
   (`[ BACKLOG | IN-PROGRESS | COMPLETED ]`), por lo que no es procesable por los skills que filtran
   por estado.
4. **Ocho IDs planificados nunca materializados:** STORY-002, 009, 014, 016, 025, 026, 031 y 045
   figuran en `project-plan.md` y `story-map.md` pero no existen como directorio. Algunos fueron
   cubiertos de facto por otro trabajo (STORY-045 por STORY-052, diagrama C4). Deben retirarse del
   backlog o marcarse explícitamente como no implementados.
5. **Cobertura de `evals/` incompleta:** 11 de 34 skills no declaran casos de prueba, frente al
   principio 11 de la constitución (TDD para skills).
6. **`README.md` anuncia una capacidad retirada:** sigue listando «Integración OpenSpec» entre las
   features, pero no existe ningún skill `openspec-*` ni el directorio `openspec/` en el repositorio.
7. **`project-plan.md` está desfasado respecto a este documento:** describe 9 épicas y un backlog de
   `STORY-001`…`STORY-048` sin estado, frente a las 19 épicas y 77 historias reales. Actualizarlo es
   trabajo aparte, no cubierto por esta revisión.
8. **Dos épicas con el estado posiblemente desalineado de su avance real.** La migración de ADR-0006
   tradujo etiquetas, no reevaluó progreso, así que preservó dos afirmaciones dudosas: **EPIC-13**
   queda en `DEFINE/IN-PROGRESS` —el estado inicial del workflow— pese a tener sus 7 historias
   marcadas, aunque sus criterios de éxito siguen sin marcar y tres de ellas no están cerradas
   (STORY-070 en `READY-FOR-VERIFY`, STORY-071 en `READY-FOR-CODE-REVIEW`, STORY-077 en `IMPLEMENT`);
   y **EPIC-17** queda en `DEVELOP/DONE` con sus 17 planes cerrados, sin haber transitado `VALIDATE`
   ni `SHIP`. Ambos casos requieren una revisión de avance, no de nomenclatura.
9. **Diez épicas conservan el campo `date:`** en vez del par canónico `created:` / `updated:` que
   define `header-aggregation` (EPIC-00 a EPIC-09). Es la misma deriva de esquema que se corrigió en
   este documento, pendiente en el nivel L2.

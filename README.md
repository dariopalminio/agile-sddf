![agile-sddf](assets/logo/agile-sddf-logo-v1.png)
# Agile SDDF — Spec-Driven Development Framework

Sistema multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software usando solo archivos Markdown como agentes, skills y templates.

[![npm version](https://img.shields.io/npm/v/agile-sddf.svg)](https://npmjs.com/package/agile-sddf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Los developers y equipos que trabajan con IA para desarrollar software carecen de un proceso estructurado y reproducible para transformar ideas en especificaciones de calidad. Agile SDDF resuelve esto con un workflow ágil y secuencial que cubre desde la intención inicial hasta el backlog planificado de historias de usuario, con control de WIP, gates de revisión humana y trazabilidad completa en cada etapa. A diferencia de los prompts ad-hoc o frameworks rígidos, el sistema extrae dinámicamente la estructura de los templates en runtime para generar preguntas y comportamientos contextuales, y opera en etapa de especificación sin modificar código subyacente en múltiples runtimes de IA (Claude Code, GitHub Copilot, OpenCode, Google Gemini, Atlassian Rovo). En etapa de implenetación, SDDF genera código de producción + tests con TDD, y reportes de implementación y revisión de código para garantizar calidad y coherencia con la especificación.

![agile-sddf](assets/diagrams/context-diagram.png)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Initialization](#initialization)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Ingeniería inversa de repositorios**: genera `requirement-spec.md` automáticamente desde código existente mediante análisis paralelo de 4 agentes especializados
- **Pipeline a nivel de proyecto**: workflow secuencial Begin Intention → Discovery → Planning con gates de revisión humana entre cada fase
- **Control WIP=1**: impide proyectos activos simultáneos, ofreciendo exactamente las opciones Sobrescribir o Retomar
- **User Story Mapping**: sesión colaborativa al estilo Jeff Patton para construir backbone, walking skeleton y release slices
- **Gestión de épicas de releases**: planificación de releases con `project-plan.md` y generación automática de artefactos de release (feature specs, historias de usuario) con trazabilidad completa
- **Gestión de historias de usuario**: creación (Como/Quiero/Para + Gherkin), evaluación con rúbrica FINVEST (Likert 1–5), splitting con 8 patrones y refinamiento iterativo
- **SDD workflow**: Se implemente un workflow a nivel de story "SPECIFYING --> PLANNING --> READY-FOR-IMPLEMENT --> IMPLEMENTING --> CODE-REVIEW --> VERIFY --> ACCEPTANCE --> INTEGRATION --> COMPLETED" con skills dedicados para cada fase y generación de artefactos específicos (design.md, tasks.md, analyze.md, implement-report.md, code-review-report.md)
- **Pipeline SDD completo de historia**: planning y implementación tarea a tarea — `story-plan` orquesta `story-design` → `story-tasking` → `story-testcases` → `story-analyze` en un solo comando; `story-implement` ejecuta el ciclo TDD completo (RED→GREEN→REFACTOR) delegando a skills configurables por stack tecnológico (`sddf.config.yaml`): genera tests con el skill `test_generator` declarado, implementa código con el `code_generator` y refactoriza sin romper suites; soporta modo interactivo (con pausas de confirmación entre fases) y modo automático (`--auto`) para CI; `story-code-review` para revisión multi-agente post-implementación
- **Testing especializado y E2E**: skills plug-in para generar pruebas reales ejecutables en proyectos existentes — `test-component-react-testing-library` genera tests de componentes React con RTL trazables a criterios de aceptación; `test-e2e-playwright-cucumber` y `test-e2e-cypress-cucumber` generan archivos `.feature` y step definitions TypeScript directamente desde escenarios Gherkin de `story.md`; `impl-frontend-library-react-component` implementa componentes de librerías UI (MUI, Shadcn, etc.) desde el diseño técnico; todos configurables en `sddf.config.yaml` como `test_generators` o `code_generator`
- **Configuración operacional por stack (`sddf.config.yaml`)**: archivo de configuración en la raíz del proyecto que declara los skills activos para cada fase del pipeline TDD (qué skill genera los tests de componente, qué skill genera los E2E, qué skill implementa el código); permite añadir nuevos skills de testing o implementación sin modificar los orquestadores; generado automáticamente por `sddf-init` desde un template canónico con soporte para ejemplos de configuración por stack (ej. `sddf.config.yaml.example` para librería UI React)
- **Políticas de proyecto**: generación de `constitution.md` y `definition-of-done-story.md` con `project-policies-generation`, registrando referencias automáticamente en `CLAUDE.md` / `AGENTS.md`
- **Integración OpenSpec**: exploración, propuesta, implementación y archivado de cambios con trazabilidad completa
- **Multi-runtime**: los mismos skills operan en Claude Code, GitHub Copilot, Codex/Cursor/OpenCode, Google Gemini Gems y Atlassian Rovo sin modificar el SKILL.md fuente
- **Meta-framework de skills**: crea y benchmarkea nuevas skills con ciclo iterativo — `skill-master` orquesta el flujo completo de creación; `skill-test-evals` gestiona el ciclo de vida de los evals (generar, ejecutar, benchmarkear) con tres modos: `generate` (crea `evals/evals.json` + skeleton SKILL.md desde descripción libre o SKILL.md existente), `evals` (1 run → informe pass/fail con evidencia) y `benchmark` (N runs × caso → métricas estadísticas mean ± stddev); integrado en el ciclo TDD RED del `story-implement`
- **Trazabilidad completa**: IDs únicos FEAT-NNN y manejo de sub-estados IN‑PROGRESS/Ready en cada documento del pipeline
- **Docs as Wiki**: skill docs-wiki-builder para generar documentación de proyecto en formato wiki navegable. Incluye un skill header-aggregation para generar encabezados frontmatter de archivo '.md'. Permite navegación bidireccional entre documentos, generación de índices automáticos y visualización de grafos con "Foam for VSCode".
- **Fábrica de skills**: Un skill-master para crear nuevos skills con ciclo iterativo de generación → benchmarking → ajuste. Y un skill skill-test-evals para gestionar el ciclo de vida completo de pruebas y benchmarking de skills propios personalizados.
- **Auditoría de seguridad**: skill `security-audit` para análisis automático de vulnerabilidades en código fuente, con evaluación OWASP Top 10, OWASP API Top 10 y OWASP Top 10 para LLMs.

## Installation

### Global — disponible en todos tus proyectos

```bash
npm install -g agile-sddf
```

Después de la instalación, el script `postinstall` copia automáticamente los skills y agentes a `~/.claude/` para que estén disponibles en Claude Code de forma global.

### Local — solo para el proyecto actual

```bash
npm install agile-sddf
```

Los skills y agentes se copian a `./.claude/` del directorio actual.

### Prerequisites

- Node.js >= 18
- Runtime compatible: Claude Code (Anthropic), GitHub Copilot, OpenCode.
- Foam for VSCode: opcional, recomendado para navegación de docs como wiki.
- PlantUML extension para VSCode: opcional, recomendado para visualizar diagramas c4 generados.
- Herramientas externas alternativas: Jira con Rovo, Google Gemini Gems.

## Initialization

Después de instalar el paquete, inicializa la estructura de directorios SDDF en tu proyecto con:

```bash
/sddf-init
```

Este skill crea los directorios base de artefactos bajo `<SPECS_BASE>/specs/` (por defecto `docs/`), genera `sddf.config.yaml` con la configuración operacional del framework y el archivo `.env.template` con la variable `SDDF_ROOT`. Solo es necesario ejecutarlo una vez por proyecto.

```
── sddf-init ────────────────────────────────────
[CREADO]     docs/specs/projects/
[CREADO]     docs/specs/releases/
[CREADO]     docs/specs/stories/
[CREADO]     sddf.config.yaml
[CREADO]     .env.template
─────────────────────────────────────────────────
✓ Entorno SDDF inicializado correctamente en docs/
```

Si `SDDF_ROOT` está definida como variable de entorno y la ruta no existe, el skill lo reporta como error antes de crear cualquier archivo. Consulta la sección [Configuration](#configuration) para más detalles sobre `SDDF_ROOT`.

> **skill-preflight:** todos los skills SDDF invocan automáticamente `/skill-preflight` como Paso 0 antes de cualquier operación. Verifica `SDDF_ROOT`, los subdirectorios de specs y produce un informe OK/WARNING/ERROR. No es necesario invocarlo manualmente; se puede ejecutar directamente para diagnosticar el entorno antes de un workflow.

## Quick Start

Inicia el pipeline completo de especificación en una sola sesión desde Claude Code:

```bash
# Ejecuta las tres fases del pipeline en una sesión continua
/project-flow
```

O ejecuta cada fase individualmente:

```bash
# Fase 1 — Captura la intención del proyecto
/project-begin

# Fase 2 — Discovery de usuarios y especificación de requisitos
/project-discovery

# Fase 3 — Planificación de releases y backlog de features
/project-planning
```

### Inicialización de políticas del proyecto

Antes de iniciar el pipeline, genera las políticas del proyecto para que todos los skills operen con las mismas reglas de calidad y convenciones técnicas:

```bash
# Genera constitution.md y definition-of-done-story.md con preguntas guiadas
/project-policies-generation
```

Los archivos se crean en `docs/policies/` y se referencian automáticamente en `CLAUDE.md` / `AGENTS.md`. Solo es necesario ejecutarlo una vez; actualízalos cuando cambien las convenciones del equipo.

## Usage

### Flujos principales SDDF

SDDF se organiza en 4 niveles principales que cubren todo el ciclo de vida de la especificación, desde la intención inicial (nivel de proyecto o L3), la especificación de entregas releases (L2), la especificaciòn de historias (L1), y con integración opcional de OpenSpec para gestión de cambios (L0). Cada nivel tiene su pipeline y se compone de un conjunto de skills que operan sobre documentos Markdown con control de sub-estado `IN‑PROGRESS`/`DONE` para garantizar un flujo estructurado, reproducible y automatizable.

#### 1. L3: Pipeline de especificación de proyecto (iniciativa)

project-begin → project-discovery → project-planning → project-story-mapping

project-flow orquesta los 3 primeros pasos en una sola sesión con gates de revisión entre etapas. project-story-mapping se ejecuta de forma opcional como sesión de mapeo colaborativo post-planning.

#### 2. L2: Pipeline de generación de releases e historias

releases-from-project-plan

#### 3. L1: Pipeline de generación y refinamiento de historias (SPECIFYING)

release-generate-stories →

story-creation → story-evaluation → story-split → story-refine →

story-plan ( story-design → story-tasking → story-analyze ) → story-implement

`story-plan` orquesta los tres sub-skills de planning en secuencia con fail-fast y visibilidad de progreso. `story-implement` ejecuta TDD tarea por tarea y genera `implement-report.md` al finalizar.

#### 4. L0: Pipeline granular SDD integración con OpenSpec

openspec-init-config → openspec-generate-baseline → 

( propose → apply → archive )

### Estructura de artefactos

### Estructura de políticas explícitas

Las políticas del proyecto son documentos Markdown versionados en el repositorio que actúan como fuente de verdad para todos los agentes IA y miembros del equipo. Se generan con `/project-policies-generation` y se referencian automáticamente desde `CLAUDE.md` y `AGENTS.md` para que todos los skills las lean en cada sesión.

```
docs/policies/
├── constitution.md              # principios técnicos inamovibles
└── definition-of-done-story.md # criterios de terminado por estado
```

#### constitution.md

Define los principios que ningún skill ni agente puede violar. Contiene:

| Sección | Contenido |
|---------|-----------|
| Stack tecnológico | Lenguaje, runtime, frameworks y librerías core |
| Infraestructura | Control de versiones, contenedores, paquete npm |
| Convenciones de código | Estilo, formato y nomenclatura (kebab-case) |
| Estándares de skills | Estructura de directorios, frontmatter YAML, Preflight como Paso 0, patrón de delegación único |
| Patrones de nomenclatura | IDs jerárquicos (PROJ-NN, EPIC-NN, FEAT-NNN), frontmatter canónico |
| Reglas de comportamiento | Control WIP=1, gates secuenciales, idempotencia, flags opcionales |
| Principios técnicos inamovibles | 10 principios — repositorio como sistema, orquestación multiagente, Spec-first, KISS, etc. |

Los skills leen `constitution.md` para mantener coherencia de patrones sin que el usuario tenga que repetir las reglas en cada sesión.

#### definition-of-done-story.md

Define los criterios de "terminado" para cada estado del ciclo de vida de una historia. Un skill de transición de estado verifica estos criterios antes de avanzar:

| Estado | Criterios clave |
|--------|-----------------|
| `SPECIFYING` | Título claro, formato Como/Quiero/Para, Gherkin cubriendo escenarios principales, cumple INVEST, frontmatter completo |
| `PLAN` | `design.md` con trazabilidad a cada AC, `tasks.md` con tareas atómicas ordenadas, `analyze.md` sin ambigüedades técnicas abiertas |
| `IMPLEMENTING` | Todos los escenarios Gherkin pasan, código sin TODOs ni imports sin usar, tests deterministas, cobertura no decrece |
| `CODE-REVIEW` | Sin hallazgos HIGH/MEDIUM, `tasks.md` sin tareas pendientes, `code-review-report.md` con `review-status: approved` |
| `ACCEPTANCE` | Escenarios validados manualmente, `acceptance-report.md` con resultado `ACCEPTANCE-APPROVED`, aprobación humana explícita |

#### Integración en el flujo

Los skills comprueban estas políticas en dos momentos:

1. **Preflight (Paso 0):** `skill-preflight` verifica que los archivos de políticas existen y son legibles antes de ejecutar cualquier lógica.
2. **Gate de transición:** skills como `story-code-review` y `story-acceptance` leen `definition-of-done-story.md` para decidir si el artefacto cumple los criterios del estado destino antes de actualizar `status`/`substatus` en el frontmatter.

```bash
# Genera o actualiza ambas políticas con preguntas guiadas
/project-policies-generation
```

### Estructura de artefactos de especificación

Los artefactos de especificación se organizan en directorios por workitem bajo `{SDDF_ROOT}/specs/`:

```
docs/specs/
├── projects/
│   └── PROJ-01-nombre-proyecto/         # un directorio por proyecto
│       ├── project-intent.md
│       ├── requirement-spec.md
│       ├── project-plan.md
│       └── story-map.md
├── releases/
│   └── EPIC-01-nombre-release/          # un directorio por release
│       └── release.md
└── stories/
    └── FEAT-001-nombre-historia/        # un directorio por historia
        ├── story.md                     # historia (story-creation)
        ├── finvest-evaluation-report.md # evaluación FINVEST (story-evaluation)
        ├── story-improvement-log.md     # log de mejoras aplicadas (story-improve)
        ├── design.md                    # diseño técnico (story-design)
        ├── tasks.md                     # plan de tareas (story-tasking)
        ├── analyze.md                   # reporte de coherencia (story-analyze)
        ├── testcases.md                 # tabla de casos de prueba tipificados UT/CT/IT/API/E2E/EV (story-testcases)
        ├── implement-report.md          # reporte de implementación (story-implement)
        ├── code-review-report.md        # reporte de revisión de código (story-code-review)
        ├── fix-directives.md            # instrucciones de corrección cuando hay bloqueantes (story-code-review)
        └── verify-report.md             # reporte de verificación (story-verify)
```

Cada archivo principal usa un nombre canónico (`project-intent.md`, `release.md`, `story.md`) e incluye frontmatter con `type`, `id`, `title`, `status`, `parent`, `created` y `updated`. Las relaciones jerárquicas se expresan mediante el campo `parent` (ej. una release tiene `parent: PROJ-01`).

El ciclo de vida de una historia atraviesa los estados `SPECIFYING → PLANNING → READY-FOR-IMPLEMENT → IMPLEMENTING → ... → COMPLETED`, y cada skill de la cadena genera o actualiza uno o más artefactos del directorio.

### Basic Usage

**Documentación y visualización de proyecto:**

```bash
# Sesión interactiva de User Story Mapping (Jeff Patton) para construir backbone y release slices
/project-story-mapping

# Genera diagrama de contexto C4 Nivel 1 en PlantUML con preguntas guiadas
/project-context-diagram --interactive

# Genera diagrama de contexto C4 Nivel 1 infiriendo desde documentos de specs existentes
/project-context-diagram --from-files

# Genera README.md completo a partir de los artefactos de specs del proyecto
/readme-builder

# Políticas del proyecto: Genera o actualiza constitution.md y definition-of-done-story.md
/project-policies-generation
```

**Generar artefactos de release (Release Epics):**

```bash
# Genera el plan de releases
/release-creation

# Genera todos los directorios de release desde project-plan.md
/releases-from-project-plan

# Genera las historias de usuario de un release específico
/release-generate-stories EPIC-01-features-spec-builder

# Genera las historias de todos los releases
/release-generate-all-stories

# Valida que un release cumple la estructura obligatoria antes de generar historias
/release-format-validation EPIC-01-features-spec-builder
```

**Crear y refinar una historia de usuario:**

```bash
# Ciclo completo: creación → evaluación FINVEST → split → mejora
/story-refine

# Solo crear una historia
/story-creation "Como usuario quiero poder registrarme para acceder al sistema"

# Evaluar una historia existente con rúbrica FINVEST (genera finvest-evaluation-report.md)
/story-evaluation FEAT-001

# Mejorar una historia aplicando las recomendaciones del reporte FINVEST
/story-improve FEAT-001

# Dividir una historia grande
/story-split docs/specs/stories/FEAT-001-nombre/story.md
```

**Planificar e implementar una historia (pipeline SDD completo):**

```bash
# Pipeline de planning completo: genera design.md + tasks.md + analyze.md
/story-plan FEAT-001

# Solo generar el diseño técnico de una historia
/story-design FEAT-001

# Solo generar el plan de tareas (requiere design.md previo)
/story-tasking FEAT-001

# Auditar coherencia entre story.md, design.md y tasks.md
/story-analyze FEAT-001

# Implementar una historia tarea por tarea con TDD (requiere READY-FOR-IMPLEMENT/DONE)
/story-implement FEAT-001

# Revisión de código post-implementación
/story-code-review
```


### Advanced Usage

**Ingeniería inversa de un repositorio existente:**

```bash
# Genera requirement-spec.md desde el código fuente
/reverse-engineering

# Analiza solo un subdirectorio
/reverse-engineering --focus src/auth

# Actualiza solo las secciones pendientes de un spec existente
/reverse-engineering --update
```

**Gestión de cambios con OpenSpec:**

Usar OpenSpec es algo opcional. Esta sección asume que tienes OpenSpec configurado en tu proyecto. SDDF proporciona skills para integrar el proceso de gestión de cambios de OpenSpec directamente en tu flujo de especificación, permitiéndote generar propuestas de cambio, implementarlas y archivarlas sin salir del entorno SDDF.

```bash
# Inicializar el contexto del proyecto en openspec/config.yaml
/openspec-init-config

# Generar baseline de especificaciones OpenSpec desde código fuente existente
/openspec-generate-baseline

# Explorar una idea sin implementar
/openspec-explore

# Proponer un cambio con todos los artefactos generados
/openspec-propose "agregar soporte para exportar historias a CSV"

# Implementar las tareas de un cambio
/openspec-apply-change

# Archivar un cambio completado
/openspec-archive-change
```

**Docs wiki y frontmatter:**

```bash
# Reorganizar docs/ como wiki navegable con índice central (LLM Wiki pattern)
/docs-wiki-builder

# Añadir o actualizar frontmatter YAML canónico en archivos spec Markdown
/header-aggregation docs/specs/stories/FEAT-001-nombre/story.md
```

**Crear una nueva skill:**

```bash
# Ciclo iterativo de creación y benchmarking
/skill-master
```

## Configuration

El framework es declarativo y su flujo se controla mediante el campo `substatus` en los documentos Markdown del pipeline.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SDDF_ROOT` | No | `docs` | Directorio raíz donde los skills leen y escriben artefactos (`specs/projects/`, `specs/releases/`, `specs/stories/`) |

El runtime de IA (Claude Code, GitHub Copilot, etc.) gestiona su propia autenticación de forma independiente al framework.

### SDDF_ROOT

`SDDF_ROOT` define el directorio raíz donde todos los skills del framework buscan y crean artefactos. Permite alojar la carpeta de especificaciones en cualquier ubicación del repositorio sin modificar los skills.

```bash
# Usar un directorio personalizado
export SDDF_ROOT=".sdd"

# Usar el valor por defecto (docs/) — equivale a no definirla
export SDDF_ROOT="docs"
```

**Comportamiento:**
- Si `SDDF_ROOT` está definida y la ruta existe → los skills usan esa ruta como raíz.
- Si `SDDF_ROOT` no está definida → los skills usan `docs` (retrocompatible con versiones anteriores).
- Si `SDDF_ROOT` apunta a una ruta inexistente → los skills emiten una advertencia y vuelven a `docs`:
  ```
  ⚠️ La ruta definida en SDDF_ROOT no existe. Se usará el valor por defecto: docs
  ```

> **Nota sobre rutas con espacios:** si el valor de `SDDF_ROOT` contiene espacios, enciérralo entre comillas al exportarlo: `export SDDF_ROOT="mi carpeta/specs"`.

### Estado de documentos

El único mecanismo de control de flujo es el campo `substatus` en cada documento:

| Valor | Significado |
|-------|-------------|
| `IN‑PROGRESS` | Documento en progreso — el pipeline puede retomarlo |
| `DONE` | Documento completo — actúa como precondición para la siguiente fase |

## Contributing

1. Fork del repositorio
2. Crea tu rama de feature (`git checkout -b feature/nueva-skill`)
3. Haz commit de tus cambios (`git commit -m 'feat: agrega skill X'`)
4. Push a la rama (`git push origin feature/nueva-skill`)
5. Abre un Pull Request

### Development Setup

```bash
git clone https://github.com/dariopalminio/agile-sddf.git
cd agile-sddf
npm install
```

**Con Docker (entorno reproducible):**

```bash
docker-compose -f docker-compose.dev.yml up
```

El contenedor usa imagen `debian:bookworm-slim` con git, curl y bash.

### Running Tests

El framework no tiene suite de tests automatizados para el pipeline principal. La calidad de los skills se valida con el meta-skill `skill-master` mediante ejecución paralela (con skill vs sin skill) y un viewer HTML de benchmarking:

```bash
/skill-master
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

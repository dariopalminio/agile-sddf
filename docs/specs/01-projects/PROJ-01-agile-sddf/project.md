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
  - PROJ-01-agile-sddf-project-intent
  - project-plan
  - story-map
---

<!-- Referencias -->
[[PROJ-01-agile-sddf-project-intent]] · [[project-plan]] · [[story-map]]

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

- **US-001**: Desarrollador / Builder Individual
    - **Descripción**: Desarrollador o freelancer que usa un runtime de IA para crear software.
      Necesita estructurar su proceso sin overhead metodológico. Invoca skills directamente desde el
      CLI del agente de IA y trabaja normalmente una historia a la vez.

- **US-002**: Equipo Ágil
    - **Descripción**: Equipo que adopta el framework para estandarizar la especificación y la
      implementación. Usa el pipeline de proyecto y de épicas para generar un backlog compartido que
      sirve de fuente de verdad. Cada miembro puede usar el runtime que prefiera.

- **US-003**: Product Owner / Analista de Negocio
    - **Descripción**: Responsable de la calidad de las historias. Usa `story-specify`,
      `story-evaluation`, `story-split` e `story-improve` para garantizar que las historias cumplen
      la rúbrica FINVEST antes de entrar a planning, y `story-acceptance` para la validación humana
      final.

- **US-004**: Arquitecto de Software
    - **Descripción**: Rol representado por el agente `project-architect`. Conduce la entrevista de
      requisitos, extrae las historias y planifica las épicas con criterio de priorización (valor de
      negocio → dependencias → riesgo técnico → esfuerzo). También consume `story-design` y
      `project-context-diagram`.

- **US-005**: Mantenedor del Framework
    - **Descripción**: Quien evoluciona el propio SDDF. Usa el framework sobre sí mismo
      (*dogfooding*): las capacidades nuevas del framework se especifican como historias en
      `docs/specs/03-stories/` y se implementan con `story-implement`. Necesita además `security-audit`,
      los `evals/evals.json` de cada skill y el runbook de publicación en npm.

- **US-006**: Agente de IA consumidor
    - **Descripción**: No es una persona: es el propio LLM que opera dentro del runtime. Lee
      `docs/index.md` como cursor de entrada, abre solo los nodos que necesita y escribe artefactos
      conformes al template activo. Es el usuario para el que están escritos el frontmatter, los
      wikilinks y el contrato `.tmp/<skill-name>/`.

# 2. Requisitos

## 2.1 Requisitos Funcionales

> **Convención de fuente.** Cada requisito referencia el skill que lo implementa (bajo `skills/` en
> la raíz del repositorio, que es la fuente única de verdad), la historia que lo especificó y la
> épica que lo agrupa.

### 2.1.1 Infraestructura y protocolo de entorno

- **FR-001**: Inicialización del entorno SDDF
    - **Descripción**: El sistema SHALL crear la estructura base de artefactos
      (`$SPECS_BASE/specs/01-projects/`, `02-epics/`, `03-stories/`, `templates/`), el archivo de
      configuración `sddf.config.yaml`, el `.env.template` y los templates centrales, delegando la
      generación de políticas a `project-policies-generation`. La operación SHALL ser idempotente: no
      sobrescribe archivos existentes.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: `sddf-init` · STORY-054 · EPIC-10

- **FR-002**: Protocolo de verificación de entorno como Paso 0
    - **Descripción**: El sistema SHALL exponer un protocolo centralizado de verificación que todo
      skill invoca **antes** de ejecutar cualquier lógica de negocio, comprobando `SDDF_ROOT`, la
      estructura de directorios y la disponibilidad de los templates requeridos, y devolviendo un
      informe `OK` / `WARNING` / `ERROR`. Ningún skill SHALL ejecutar lógica de dominio con el
      entorno en `ERROR`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-006
    - **Fuente**: `skill-preflight` · STORY-053 · EPIC-10 · constitución, principio 7

- **FR-003**: Raíz de artefactos configurable
    - **Descripción**: El sistema SHALL resolver la ruta base de especificaciones desde la variable
      de entorno `SDDF_ROOT`, con `docs/` como valor por defecto. Si `SDDF_ROOT` está definida pero
      la ruta no existe, SHALL usar el valor por defecto y emitir una advertencia explícita.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: STORY-049 · EPIC-10

- **FR-004**: Organización de artefactos por work item
    - **Descripción**: Cada work item SHALL agrupar todos sus artefactos en un directorio propio
      nombrado por su ID y slug (`STORY-NNN-slug/`), conteniendo el documento principal (`story.md`)
      y los artefactos derivados de cada fase (`design.md`, `tasks.md`, `testcases.md`, `analyze.md`,
      `implement-report.md`, `code-review-report.md`, `verify-report.md`, `acceptance-report.md`,
      `fix-directives.md`, `finvest-evaluation-report.md`).
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-006
    - **Fuente**: STORY-050 · EPIC-10

- **FR-005**: Templates centralizados como fuente única
    - **Descripción**: Los templates de spec SHALL residir en `$SPECS_BASE/specs/templates/` como
      fuente única de verdad. Cada skill SHALL resolverlos con la cadena de fallback
      `central → seed local del skill → error`, emitiendo un `WARNING` cuando cae al seed.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-006
    - **Fuente**: STORY-055 · EPIC-11 · ADR-0001

- **FR-006**: Extracción dinámica de secciones de templates en runtime
    - **Descripción**: El sistema SHALL leer los headers `##` y los comentarios `<!-- -->` del
      template activo en tiempo de ejecución para derivar preguntas y completar secciones, sin lógica
      hardcodeada. Modificar un template SHALL alterar el comportamiento del skill sin editar su
      `SKILL.md`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004, US-006
    - **Fuente**: EPIC-00 · constitución, patrón 5

- **FR-007**: Configuración operacional por stack tecnológico
    - **Descripción**: El sistema SHALL leer `sddf.config.yaml` de la raíz del proyecto para resolver
      (a) el modelo de entrega (`batch` | `continuous`), (b) el comando y la obligatoriedad de cada
      tipo de prueba (`unit`, `component`, `integration`, `contract`, `e2e` y sus variantes,
      `performance`, `eval`) consumidos por `story-verify`, y (c) los skills *worker* delegados para
      generar tests (`test_generators`) e implementar código por capa (`code_generators`) consumidos
      por `story-implement`. Añadir soporte a un stack nuevo SHALL requerir solo editar este archivo.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-005
    - **Fuente**: `sddf.config.yaml` · STORY-085 · EPIC-14, EPIC-16

### 2.1.2 Pipeline de especificación de proyecto (nivel L3)

- **FR-008**: Captura de intención inicial del proyecto
    - **Descripción**: El sistema SHALL conducir una entrevista interactiva guiada para capturar
      nombre, problema, visión, beneficios clave, criterios de éxito, restricciones y non-goals,
      escribiendo el resultado en `$SPECS_BASE/specs/01-projects/<PROJ-NN-slug>/project-intent.md`
      con `substatus: IN-PROGRESS`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: `project-begin` → agente `project-pm` · STORY-001 · EPIC-02

- **FR-009**: Discovery de usuarios y especificación de requisitos
    - **Descripción**: El sistema SHALL colaborar con el usuario en dos sub-fases —descubrimiento de
      perfiles de usuario y sus dolores, y entrevista de especificación sección por sección del
      template— produciendo `project.md`. Precondición: `project-intent.md` con `substatus: DONE`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002, US-003
    - **Fuente**: `project-discovery` → agentes `project-pm`, `project-architect`, `project-ux` · STORY-003 · EPIC-02

- **FR-010**: Planificación de proyecto con épicas y backlog
    - **Descripción**: El sistema SHALL extraer historias atómicas con IDs `STORY-NNN` desde
      `project.md`, priorizarlas (valor de negocio → dependencias → riesgo técnico → esfuerzo) y
      agruparlas en épicas incrementales, produciendo `project-plan.md`. Precondición: `project.md`
      con `substatus: DONE`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004
    - **Fuente**: `project-planning` → agente `project-architect` · STORY-004, STORY-011 · EPIC-02, EPIC-05

- **FR-011**: Ejecución del pipeline de proyecto en una sola sesión
    - **Descripción**: El sistema SHALL permitir ejecutar las tres fases del nivel L3 en una sesión
      continua, detectando automáticamente el estado actual del pipeline y aplicando los gates de
      revisión humana entre etapas.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: `project-flow` · STORY-015 · EPIC-05

- **FR-012**: Sesión interactiva de User Story Mapping
    - **Descripción**: El sistema SHALL conducir una sesión colaborativa estilo Jeff Patton para
      identificar personas, construir el backbone de actividades, definir el walking skeleton y
      trazar los slices, produciendo `story-map.md` con mapa ASCII.
    - **Prioridad**: Media
    - **Usuario**: US-002, US-003
    - **Fuente**: `project-story-mapping` → agente `project-story-mapper` · STORY-005 · EPIC-05

- **FR-013**: Integración del story map como guía de planificación
    - **Descripción**: Durante la planificación el sistema SHALL detectar si existe `story-map.md` y,
      si existe, usarlo como guía estructural para agrupar historias en épicas respetando el backbone.
      Si no existe, SHALL ofrecer generarlo primero.
    - **Prioridad**: Media
    - **Usuario**: US-002, US-004
    - **Fuente**: `project-planning` · STORY-011 · EPIC-05

- **FR-014**: Generación del diagrama de contexto C4
    - **Descripción**: El sistema SHALL generar un diagrama de contexto C4 Nivel 1 en formato
      PlantUML (`context-diagram.puml`), en modo `--interactive` (por preguntas, por defecto) o
      `--from-files` (derivado de los artefactos de spec existentes).
    - **Prioridad**: Media
    - **Usuario**: US-004
    - **Fuente**: `project-context-diagram` · STORY-052 · EPIC-10

- **FR-015**: Generación de políticas de proyecto
    - **Descripción**: El sistema SHALL inicializar o actualizar `constitution.md` (principios
      técnicos inamovibles, stack, convenciones) y `definition-of-done-story.md` (DoD por estado del
      workflow), y SHALL registrar la referencia a ambos en el archivo de instrucciones del runtime
      (`CLAUDE.md` / `AGENTS.md`) para que se carguen en cada sesión.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-005
    - **Fuente**: `project-policies-generation` · STORY-056 · EPIC-12

- **FR-016**: Control de Work-In-Progress (WIP = 1) por nivel
    - **Descripción**: El sistema SHALL verificar, antes de activar un work item, que no exista otro
      documento con `substatus: IN-PROGRESS` en el mismo nivel del pipeline. Ante conflicto SHALL
      presentar exactamente dos opciones: «Sobrescribir» o «Retomar». No SHALL permitir dos ítems
      activos simultáneos en un nivel sin confirmación explícita.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: STORY-008 · EPIC-02 · constitución, regla 9

- **FR-017**: Gates de revisión humana entre fases
    - **Descripción**: El sistema SHALL presentar un resumen del documento generado y solicitar
      confirmación del usuario antes de avanzar a la siguiente fase. El documento SHALL avanzar a
      `substatus: DONE` solo tras la confirmación. Si el usuario pide ajustes, el control regresa al
      agente correspondiente sin perder el trabajo hecho.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: STORY-010 · EPIC-02

### 2.1.3 Ingeniería inversa de repositorios

- **FR-018**: Generación de la especificación desde código existente
    - **Descripción**: El sistema SHALL analizar un repositorio existente mediante cuatro agentes
      especializados **en paralelo** más un agente sintetizador, generando automáticamente
      `project.md`. Cada agente SHALL escribir su hallazgo en `.tmp/<skill-name>/` y el sintetizador
      SHALL leer únicamente esos archivos. Las secciones sin datos suficientes SHALL marcarse
      `<!-- PENDING MANUAL REVIEW -->`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002, US-004
    - **Fuente**: `reverse-engineering` · STORY-017, STORY-022 · EPIC-03

- **FR-019**: Análisis de arquitectura técnica del repositorio
    - **Descripción**: El sistema SHALL detectar stack tecnológico, dependencias, frameworks,
      patrones arquitectónicos y puntos de integración, marcando cada hallazgo con su nivel de
      confianza (`DIRECT` / `INFERRED` / `SUGGESTED`).
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: agente `reverse-engineer-architect` · STORY-018 · EPIC-03

- **FR-020**: Extracción de features desde la perspectiva del usuario
    - **Descripción**: El sistema SHALL analizar rutas, endpoints, textos de UI, botones y
      componentes para producir un inventario de features agrupado por dominio de negocio.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: agente `reverse-engineer-product-discovery` · STORY-019 · EPIC-03

- **FR-021**: Extracción de reglas de negocio desde el código
    - **Descripción**: El sistema SHALL analizar validaciones, permisos, workflows y lógica
      condicional para producir un catálogo de reglas de negocio clasificadas por tipo (Validación /
      Permiso / Workflow / Negocio / Cálculo) y expresadas en formato Dado/Cuando/Entonces.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: agente `reverse-engineer-business-analyst` · STORY-020 · EPIC-03

- **FR-022**: Reconstrucción del mapa de navegación y flujos de usuario
    - **Descripción**: El sistema SHALL mapear la estructura de navegación (rutas, pantallas, guards,
      flujos) y producir un árbol ASCII compatible con el template de requisitos.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: agente `reverse-engineer-ux-flow-mapper` · STORY-021 · EPIC-03

- **FR-023**: Análisis con scope acotado
    - **Descripción**: El sistema SHALL permitir limitar el análisis a una ruta específica del
      repositorio mediante el flag `--focus <path>`.
    - **Prioridad**: Media
    - **Usuario**: US-001, US-004
    - **Fuente**: STORY-023 · EPIC-03

- **FR-024**: Modo incremental de actualización
    - **Descripción**: Con el flag `--update`, el sistema SHALL re-analizar únicamente las secciones
      marcadas `<!-- PENDING MANUAL REVIEW -->`, preservando verbatim las secciones ya completas.
    - **Prioridad**: Media
    - **Usuario**: US-001, US-004
    - **Fuente**: STORY-024 · EPIC-03

### 2.1.4 Gestión de épicas (nivel L2)

- **FR-025**: Creación interactiva de una épica
    - **Descripción**: El sistema SHALL crear `EPIC-NN-slug/epic.md` conduciendo al usuario sección
      por sección según el template activo, con un flag `--quick` para el modo abreviado. Al terminar
      SHALL invocar la validación de formato.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004
    - **Fuente**: `epic-creation` · STORY-051 · EPIC-10

- **FR-026**: Generación de épicas desde el plan de proyecto
    - **Descripción**: El sistema SHALL derivar todas las épicas propuestas en la sección
      `## Propuesta de Épicas` de `project-plan.md`, creando un `epic.md` por cada una.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004
    - **Fuente**: `epic-from-project-plan` · STORY-028 · EPIC-06

- **FR-027**: Validación de formato de épica (gate)
    - **Descripción**: El sistema SHALL validar que un `epic.md` cumple la estructura obligatoria
      derivada en runtime del template, produciendo un veredicto `APROBADO`, `REFINAR` (con la lista
      de secciones faltantes) o `RECHAZADO`. Esta validación SHALL ser precondición de la generación
      de historias.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004
    - **Fuente**: `epic-format-validation` · STORY-027 · EPIC-06 · constitución, patrón 15

- **FR-028**: Generación de historias desde una épica
    - **Descripción**: El sistema SHALL crear un directorio `STORY-NNN-slug/` con su `story.md` por
      cada ítem de la sección `## Historias` de una épica dada, calculando el siguiente ID libre
      mediante el glob `03-stories/STORY-*/`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-003
    - **Fuente**: `epic-generate-stories` · STORY-029 · EPIC-06

- **FR-029**: Generación de historias de todas las épicas en batch
    - **Descripción**: El sistema SHALL iterar sobre todas las épicas existentes y generar sus
      historias en una sola operación, siguiendo el mismo proceso que la generación individual.
    - **Prioridad**: Media
    - **Usuario**: US-002
    - **Fuente**: `epic-generate-all-stories` · STORY-035 · EPIC-06

### 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)

- **FR-030**: Creación de historias de usuario
    - **Descripción**: El sistema SHALL generar historias en formato Como/Quiero/Para con criterios
      de aceptación Gherkin (Dado/Cuando/Entonces), incluyendo como mínimo un escenario principal y
      un escenario alternativo o de error, aplicando el modelo de Cohn, las 3 C's y los criterios
      INVEST. El output es `STORY-NNN-slug/story.md`.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: `story-creation` · STORY-006 · EPIC-01

- **FR-031**: Evaluación de calidad con rúbrica FINVEST
    - **Descripción**: El sistema SHALL evaluar historias aplicando la rúbrica FINVEST (Formato +
      INVEST) con scores Likert 1-5 por dimensión, produciendo `finvest-evaluation-report.md`. La
      decisión SHALL ser una de: `APROBADA` (FINVEST ≥ 4.0), `REFINAR` (3.0 ≤ FINVEST < 4.0),
      `RECHAZAR` (FINVEST < 3.0 o dimensión crítica = 1), `DIVIDIR` (S = 1). Si `F_score` < 2.5, el
      sistema SHALL rechazar sin evaluar INVEST.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: `story-evaluation` · STORY-007 · EPIC-01

- **FR-032**: División de historias grandes (story splitting)
    - **Descripción**: El sistema SHALL dividir historias grandes aplicando uno de los 8 patrones de
      Richard Lawrence (pasos de flujo, variaciones de reglas de negocio, variaciones de datos,
      complejidad de criterios, esfuerzo mayor, dependencias externas, pasos DevOps, TADs). SHALL
      reutilizar el directorio original como historia *core* (`--core N`) en vez de dejarlo huérfano,
      y SHALL soportar `--pattern N` y `--dry-run`. Las historias derivadas del patrón 8 (TADs) no se
      guardan como archivos de historia.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: `story-split` · STORY-012, STORY-063 · EPIC-01, EPIC-12

- **FR-033**: Mejora automática de una historia desde su reporte de evaluación
    - **Descripción**: El sistema SHALL aplicar sobre `story.md` las recomendaciones de las
      dimensiones con score ≤ 3 del `finvest-evaluation-report.md`, preservando una copia `.bak` y
      registrando los cambios en `story-improvement-log.md`.
    - **Prioridad**: Media
    - **Usuario**: US-003
    - **Fuente**: `story-improve` · STORY-077 · EPIC-13

- **FR-034**: Orquestación del ciclo de especificación con gate anti-bucle
    - **Descripción**: El sistema SHALL orquestar el ciclo completo creación → evaluación → división
      → mejora, apoyándose en el agente `story-product-owner` para fortalecer la redacción antes de
      re-evaluar. SHALL solicitar confirmación explícita del usuario antes de cada iteración
      adicional, ofreciendo tres salidas: seguir iterando, cerrar manualmente, o dejar en curso para
      retomar después. Salida exitosa: historia en `SPECIFY/DONE`.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: `story-specify` · STORY-013 · EPIC-05, EPIC-16

### 2.1.6 Planificación de historia (nivel L1 · fase PLAN)

- **FR-035**: Diseño técnico de la historia
    - **Descripción**: El sistema SHALL producir `design.md` como puente entre los criterios de
      aceptación y el código: componentes, contratos, decisiones y estructura. Cada elemento de
      diseño SHALL declarar explícitamente el criterio que satisface (`// satisface: AC-N`), y todo
      AC de `story.md` SHALL estar cubierto por al menos un elemento de diseño.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: `story-design` · STORY-057 · EPIC-12

- **FR-036**: Descomposición en tareas atómicas
    - **Descripción**: El sistema SHALL producir `tasks.md` con tareas atómicas ordenadas por
      dependencia (setup → componentes → soporte → verificación), cada una marcable como `- [ ]` /
      `- [x]`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-004
    - **Fuente**: `story-tasking` · STORY-058 · EPIC-12

- **FR-037**: Generación de casos de prueba tipificados
    - **Descripción**: El sistema SHALL producir `testcases.md` a partir de `story.md` y `design.md`,
      con casos identificados `TC-NNN` y tipificados (UT / CT / IT / API / E2E / EV), trazables 1:1
      contra los escenarios Gherkin. Precondición: ambos documentos de entrada deben existir.
    - **Prioridad**: Alta
    - **Usuario**: US-003, US-004
    - **Fuente**: `story-testcases` · STORY-079 · EPIC-14

- **FR-038**: Análisis transversal de coherencia (gate del DoD PLAN)
    - **Descripción**: El sistema SHALL auditar la coherencia entre `story.md`, `design.md`,
      `testcases.md` y `tasks.md`, detectando inconsistencias, omisiones y ambigüedades técnicas no
      resueltas, y verificando el cumplimiento del DoD del estado PLAN. Produce `analyze.md`. Sin
      hallazgos de severidad `ERROR`, SHALL promover la historia a `READY-FOR-IMPLEMENT/DONE`.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: `story-analyze` · STORY-059, STORY-068 · EPIC-12, EPIC-13

- **FR-039**: Orquestación de la fase de planning
    - **Descripción**: El sistema SHALL ejecutar en secuencia `story-design` → `story-tasking` →
      `story-testcases` → `story-analyze` para una historia objetivo, con flags para ejecutar solo
      parte del ciclo (`--only-tasks`, `--only-testcases`, `--skip-analyze`).
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-004
    - **Fuente**: `story-plan` · STORY-060 · EPIC-12

### 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)

- **FR-040**: Implementación guiada por TDD
    - **Descripción**: El sistema SHALL implementar la historia siguiendo el ciclo TDD completo:
      **RED** (validar configuración y generar las pruebas que fallan), **GREEN** (implementar el
      código mínimo que las hace pasar) y **REFACTOR** (mejorar el código sin romper la suite). Las
      fases de generación de tests y de código SHALL delegarse a los skills *worker* declarados en
      `sddf.config.yaml` (`test_generators` / `code_generators`), de modo que el orquestador
      permanezca agnóstico al stack. Produce código, pruebas e `implement-report.md`, y deja la
      historia en `IMPLEMENT/DONE`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: `story-implement` · STORY-061, STORY-078, STORY-081 · EPIC-12, EPIC-14

- **FR-041**: Modos de ejecución y reanudación de la implementación
    - **Descripción**: El sistema SHALL ofrecer un modo interactivo con pausas de confirmación entre
      fases del ciclo TDD y un modo automático (`--auto`) apto para CI. SHALL poder reanudar una
      implementación parcial desde `IMPLEMENT/IN-PROGRESS`, incorporando las correcciones pendientes
      de `fix-directives.md` si existen.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-005
    - **Fuente**: `story-implement` · STORY-067, STORY-082 · EPIC-12, EPIC-14

- **FR-042**: Implementación tarea por tarea
    - **Descripción**: El sistema SHALL ofrecer una variante que recorre `tasks.md` marcando cada
      tarea como completada a medida que la implementa, para historias donde se prefiere el control
      granular sobre el ciclo TDD completo.
    - **Prioridad**: Media
    - **Usuario**: US-001
    - **Fuente**: `story-implement-tasks` · STORY-061 · EPIC-12

- **FR-043**: Revisión de código multi-agente (gate del DoD CODE-REVIEW)
    - **Descripción**: El sistema SHALL ejecutar en paralelo tres agentes revisores especializados
      (calidad técnica, cumplimiento de requisitos e integración arquitectónica) sobre la
      implementación, verificando que cada escenario Gherkin tiene correspondencia en el código, que
      los componentes respetan `design.md` y que se cumplen los estándares de `constitution.md`.
      SHALL validar la existencia de los artefactos requeridos antes de revisar, y SHALL invocar
      `security-audit` cuando el cambio lo amerite. Produce `code-review-report.md` si aprueba, o
      `fix-directives.md` con instrucciones accionables si hay hallazgos bloqueantes (severidad
      `HIGH` o `MEDIUM`), retrocediendo entonces la historia a `READY-FOR-IMPLEMENT/DONE`. Dispone de
      un modo degradado `--single-agent`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004
    - **Fuente**: `story-code-review` · STORY-064, STORY-065, STORY-066, STORY-070 · EPIC-12, EPIC-13

- **FR-044**: Verificación por ejecución de pruebas (fase VERIFY)
    - **Descripción**: El sistema SHALL ejecutar las pruebas automatizadas de la historia en un
      entorno controlado, detectando el modo de operación (por configuración de `sddf.config.yaml`,
      delegado a un worker, e2e, unitario o manual) y produciendo `verify-report.md`. Precondición:
      `CODE-REVIEW/DONE`. Si el DoD del estado VERIFY no se cumple, SHALL retroceder la historia a
      `READY-FOR-IMPLEMENT/DONE`. Soporta `--mode`, `--dry-run` y `--verbose`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-005
    - **Fuente**: `story-verify` → agente local `qa-engineer` · STORY-071 · EPIC-13

- **FR-045**: Aceptación humana final (fase ACCEPTANCE)
    - **Descripción**: El sistema SHALL conducir una validación humana criterio por criterio contra
      los escenarios de `story.md`, registrando para cada uno un resultado `APPROVED` / `REJECTED` /
      `BLOCKED` con observaciones, y produciendo `acceptance-report.md`. Con todos los criterios
      aprobados la historia pasa a `ACCEPTANCE/DONE`; con al menos uno rechazado retrocede a
      `READY-FOR-IMPLEMENT/DONE`; con bloqueantes sin rechazos queda en `ACCEPTANCE/BLOCKED`. La
      aprobación SHALL requerir confirmación explícita del validador humano.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: `story-acceptance` · STORY-072 · EPIC-13

- **FR-046**: Gestión de estados a lo largo del workflow
    - **Descripción**: Cada skill del workflow SHALL actualizar los campos `status` y `substatus` del
      frontmatter de `story.md` al iniciar y al terminar, conforme a la máquina de estados canónica.
      Los sub-skills invocados por un orquestador (`story-design`, `story-tasking`,
      `story-testcases`) NO SHALL modificar `story.md`: solo producen su artefacto. Las transiciones
      a `DELIVER` y `COMPLETED` SHALL ser manuales o disparadas por CI/CD, nunca escritas por un skill.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-006
    - **Fuente**: STORY-062, STORY-069 · EPIC-12, EPIC-13 · ADR-0003

### 2.1.8 Documentación, metadatos y seguridad

- **FR-047**: Estandarización de frontmatter en documentos de spec
    - **Descripción**: El sistema SHALL añadir o actualizar el frontmatter YAML canónico (`type`,
      `id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated`, `related`) en
      archivos de spec, individualmente o en batch por directorio, derivando cada campo de reglas
      explícitas y verificando que los slugs referenciados en `parent` y `related` existen (marcando
      `[pendiente]` los que no).
    - **Prioridad**: Alta
    - **Usuario**: US-005, US-006
    - **Fuente**: `header-aggregation` · STORY-043 · EPIC-09

- **FR-048**: Generación del índice wiki de documentación
    - **Descripción**: El sistema SHALL reorganizar `$SPECS_BASE/` como wiki navegable con un
      `index.md` que enlace cada nodo mediante wikilink `[[slug]]` y ruta relativa, de modo que un
      agente lea primero el índice y abra solo los nodos necesarios (recuperación O(índice), no
      O(todos-los-archivos)). Soporta `--update` y `--dry-run`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-006
    - **Fuente**: `docs-wiki-builder` · STORY-044 · EPIC-09

- **FR-049**: Generación del README del proyecto
    - **Descripción**: El sistema SHALL generar o sobrescribir el `README.md` del proyecto a partir
      de los artefactos SDDF disponibles, degradando en tres niveles según lo que exista:
      especificación formal → contexto del repositorio → ingeniería inversa.
    - **Prioridad**: Media
    - **Usuario**: US-001, US-005
    - **Fuente**: `readme-builder` · STORY-042 · EPIC-09

- **FR-050**: Auditoría de seguridad condicional
    - **Descripción**: El sistema SHALL analizar el código fuente contra un checklist de seguridad
      condicional (OWASP Top 10, OWASP API Top 10 y OWASP Top 10 para LLMs), detectando primero el
      contexto tecnológico para aplicar solo los controles pertinentes, y produciendo
      `audit-report.md`. SHALL ser invocable de forma autónoma o como parte de la revisión de código.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-005
    - **Fuente**: `security-audit` → 3 agentes locales · STORY-073 · EPIC-13, EPIC-16

### 2.1.9 Distribución e instalación multi-runtime

- **FR-051**: Distribución del framework como paquete npm
    - **Descripción**: El sistema SHALL publicarse como paquete público `agile-sddf` conteniendo
      `agents/`, `skills/`, `scripts/` y `sddf.config.yaml`, versionado según SemVer y con entrada
      correspondiente en el `CHANGELOG.md`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: STORY-039 · EPIC-07

- **FR-052**: Instalación automática tras `npm install`
    - **Descripción**: El script `postinstall` SHALL copiar skills y agentes al destino por defecto
      (`.claude/` local, o `~/.claude/` en instalación global) de forma silenciosa y sin prompts
      interactivos, respetando la variable `SDDF_TARGET` si está definida.
    - **Prioridad**: Alta
    - **Usuario**: US-001
    - **Fuente**: `scripts/postinstall.js` · STORY-040, STORY-041, STORY-087 · EPIC-07, EPIC-08

- **FR-053**: Instalación interactiva con selección de runtime
    - **Descripción**: El CLI `agile-sddf install` SHALL permitir elegir la carpeta destino
      (`.claude` para Claude Code, `.agents` para OpenCode, `.github` para GitHub Copilot) de forma
      interactiva o mediante `--target`, con `--global` para instalación en el home del usuario y
      `--force` para sobrescribir instalaciones previas. Sin `--force`, no SHALL sobrescribir.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: `scripts/cli.js`, `scripts/install.js` · EPIC-16 · plan-01

- **FR-054**: Publicación automatizada desde CI
    - **Descripción**: Al crear un release en GitHub, el sistema SHALL publicar automáticamente la
      nueva versión en npm sin pasos manuales.
    - **Prioridad**: Media
    - **Usuario**: US-005
    - **Fuente**: STORY-046 · EPIC-07

## 2.2. Requisitos No Funcionales

### 2.2.1 Plataforma y compatibilidad de runtimes

- **NFR-001**: Compatibilidad multi-runtime por instalación, no por duplicación
    - **Descripción**: El sistema SHALL ser compatible con Claude Code (primario), OpenCode y GitHub
      Copilot. La fuente única de skills y agentes SHALL ser `skills/` y `agents/` en la raíz del
      repositorio; los directorios `.claude/`, `.agents/` y `.github/` son **destinos de instalación**
      producidos por `scripts/install.js`, no fuentes. El soporte a otros CLI/LLM se evalúa en
      releases futuros.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Un skill se ejecuta correctamente en Claude Code y en GitHub Copilot
      sin modificar su `SKILL.md` fuente.

- **NFR-002**: Independencia del cliente de IA en el texto de los skills
    - **Descripción**: Los `SKILL.md` NO SHALL contener referencias codificadas a un cliente concreto
      (por ejemplo rutas `.claude/`). Las rutas de artefactos SHALL expresarse relativas a
      `$SPECS_BASE`, y las de skills y agentes relativas a la raíz de instalación.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `grep -rl "\.claude/" skills/` no devuelve rutas operativas en la
      lógica de ningún skill.

### 2.2.2 Formato declarativo y superficie ejecutable

- **NFR-003**: Markdown como lenguaje de definición
    - **Descripción**: Skills, agentes y templates SHALL definirse exclusivamente en Markdown, con
      frontmatter YAML estandarizado. No SHALL haber lógica de negocio fuera de archivos Markdown en
      el pipeline principal: la lógica de dominio vive en los templates (estructura) y en los agentes
      (criterios); el skill orquesta.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `skills/` y `agents/` contienen solo `.md` y subdirectorios de
      recursos (`assets/`, `examples/`, `evals/`, `agents/`, `scripts/`).

- **NFR-004**: Superficie ejecutable mínima en Node.js
    - **Descripción**: La única parte ejecutable SHALL ser Node.js ≥ 18 para instalación,
      empaquetado y mantenimiento (`scripts/`), con `fs-extra` como única dependencia de runtime. El
      repositorio NO SHALL declarar pipeline propio de build, test o lint (`package.json` solo
      declara `postinstall`).
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `package.json` declara `engines.node >= 18` y una sola dependencia.

### 2.2.3 Almacenamiento y persistencia

- **NFR-005**: Sistema de archivos como única capa de persistencia
    - **Descripción**: El sistema SHALL usar exclusivamente el sistema de archivos local. No SHALL
      requerir base de datos, servicio de almacenamiento externo ni servidor propio. Todos los
      outputs son archivos `.md` (o `.puml`, `.json`, `.yaml`) bajo `$SPECS_BASE/specs/`.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: No existe ningún archivo de configuración de base de datos en el
      repositorio.

### 2.2.4 Máquina de estados y control de flujo

- **NFR-006**: Control de ciclo de vida con `status` + `substatus`
    - **Descripción**: El ciclo de vida de un artefacto SHALL trazarse con dos ejes ortogonales en el
      frontmatter —`status` (etapa del pipeline) y `substatus` (progreso dentro de la etapa:
      `TODO` | `IN-PROGRESS` | `DONE` | `BLOCKED`)— y nunca con versiones numéricas. Los estados
      canónicos por nivel están definidos en `[[state-machine]]`: story
      (`SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE →
      DELIVER → COMPLETED`), épica (`DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP →
      COMPLETED`) y proyecto (solo `substatus`).
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Todo `story.md` y `epic.md` declara `status` y `substatus` con
      valores pertenecientes a la máquina de estados de su nivel.

- **NFR-007**: Límite de trabajo en curso por nivel
    - **Descripción**: Solo un documento SHALL tener `substatus: IN-PROGRESS` a la vez por nivel del
      pipeline (proyecto, épica, historia). Todo skill que active un ítem SHALL verificarlo antes.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Ante un segundo ítem activo, el skill se detiene y presenta las
      opciones «Sobrescribir» / «Retomar».

- **NFR-008**: Gates secuenciales con precondiciones explícitas
    - **Descripción**: Cada skill SHALL verificar que el artefacto del paso anterior existe y es
      válido antes de ejecutar, deteniéndose con un mensaje accionable si la precondición no se
      cumple. Ningún skill SHALL avanzar sobre un documento de entrada que no esté en el estado
      requerido.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `story-verify` no ejecuta si `story.md` no está en `CODE-REVIEW/DONE`;
      `epic-generate-stories` no ejecuta si la épica no supera `epic-format-validation`.

### 2.2.5 Trazabilidad y auditoría

- **NFR-009**: Metadatos de trazabilidad en todos los documentos generados
    - **Descripción**: Todo documento de spec generado SHALL incluir el frontmatter canónico con
      `type`, `id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` y
      `related`, con IDs jerárquicos `PROJ-NN` / `EPIC-NN` / `STORY-NNN`. El prefijo del ID nombra el
      **nivel**, nunca el tipo de trabajo: el tipo de una historia vive en el campo `kind`
      (`feat` | `fix` | `chore` | `hotfix`) y en el prefijo de su rama.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Ningún directorio de `03-stories/` usa un prefijo distinto de
      `STORY-`; el glob `03-stories/STORY-*/story.md` alcanza todas las historias.

- **NFR-010**: Navegación por índice y wikilinks
    - **Descripción**: La documentación SHALL ser navegable como grafo mediante wikilinks `[[slug]]`
      resueltos contra el campo `slug` del frontmatter, con `docs/index.md` como cursor de entrada
      único. Un agente SHALL poder orientarse leyendo solo el índice, sin cargar el corpus completo.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `docs/index.md` no contiene wikilinks rotos.

- **NFR-011**: Niveles de confianza explícitos en contenido inferido
    - **Descripción**: Todo contenido generado por inferencia SHALL marcarse con su nivel de
      confianza: `DIRECT` (confirmado en el código), `INFERRED` (derivado por análisis), `SUGGESTED`
      (hipótesis que requiere confirmación). El contenido no provisto por el usuario SHALL marcarse
      `[inferido]` en el documento resultante.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Los archivos intermedios en `.tmp/<skill-name>/` contienen etiquetas
      de confianza por ítem.

- **NFR-012**: Output parcial ante datos insuficientes
    - **Descripción**: El sistema SHALL producir el documento de salida aunque algunas secciones no
      puedan completarse, marcándolas `<!-- PENDING MANUAL REVIEW -->`. Output parcial es preferible
      a ningún output.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `reverse-engineering` genera `project.md` aun si falta alguno de los
      archivos intermedios de los agentes.

### 2.2.6 Arquitectura de agentes y gestión de contexto

- **NFR-013**: Composición inline y un solo salto de delegación
    - **Descripción**: El sistema SHALL admitir dos mecanismos de invocación: **composición inline**
      (skill → skill, misma sesión, cadenas cortas porque el contexto se acumula) y **delegación**
      (skill → subagente, contexto nuevo y aislado). Solo la sesión que ejecuta skills SHALL delegar
      en subagentes; **un subagente NUNCA SHALL delegar en otro subagente**. Los subagentes no
      invocan skills orquestadores; si necesitan su lógica, el orquestador se la pasa en el prompt o
      referencia el archivo para que lo lean.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Ningún `*.agent.md` ni agente local invoca la herramienta de
      delegación. Ver `[[best-practices-for-skills]]` y ADR-0002.

- **NFR-014**: Contrato `.tmp/<skill-name>/` contra el «teléfono descompuesto»
    - **Descripción**: El agente orquestador NO SHALL pasar a sus subagentes todo su contexto
      heredado. Cada subagente SHALL escribir su resultado en `.tmp/<skill-name>/` y devolver el
      control; el orquestador SHALL leer únicamente esos archivos para consolidar. El directorio
      `.tmp/` NO SHALL versionarse.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `.tmp` está en `.gitignore`; los skills multiagente
      (`reverse-engineering`, `story-code-review`, `security-audit`, `story-verify`) escriben y leen
      por ese canal.

- **NFR-015**: Templates y assets como contrato de interfaz
    - **Descripción**: Los archivos en `*/assets/*.md` y en `$SPECS_BASE/specs/templates/` SHALL ser
      el contrato entre skills y agentes. Un cambio en un template SHALL alterar automáticamente el
      comportamiento de todos los agentes que lo leen en runtime, sin requerir cambios en el código
      del agente.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Al añadir una sección a `project-template.md`, los agentes
      `project-pm` y `project-architect` generan preguntas para ella sin editar su definición.

### 2.2.7 Calidad y verificación

- **NFR-016**: Casos de prueba declarados por skill
    - **Descripción**: Los skills críticos SHALL declarar sus casos de prueba en `evals/evals.json`
      conforme al esquema estandarizado, y los casos SHALL definirse **antes** que el `SKILL.md`
      (TDD aplicado a skills).
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Cobertura actual 23 de 34 skills (68%). Todo skill nuevo se publica
      con `evals/evals.json`.

- **NFR-017**: Definition of Done como gate ejecutable
    - **Descripción**: El Definition of Done por estado (`docs/policies/definition-of-done-story.md`)
      SHALL evaluarse programáticamente como condición de avance, no como checklist informativa. Un
      DoD incumplido SHALL bloquear la transición y retroceder la historia al estado que corresponda.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `story-analyze` (PLAN), `story-implement` (IMPLEMENT),
      `story-code-review` (CODE-REVIEW), `story-verify` (VERIFY) y `story-acceptance` (ACCEPTANCE)
      leen el DoD de su estado y condicionan la transición a su cumplimiento.

- **NFR-018**: Verificación demostrada, no declarada
    - **Descripción**: El sistema SHALL exigir evidencia de funcionamiento (ejecución de pruebas,
      reportes de revisión) en lugar de aceptar la afirmación del agente de que terminó. Todo gate
      SHALL producir un artefacto de reporte auditable.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Cada fase con gate deja su reporte en el directorio de la historia
      (`analyze.md`, `implement-report.md`, `code-review-report.md`, `verify-report.md`,
      `acceptance-report.md`).

### 2.2.8 Seguridad

- **NFR-019**: Escaneo de seguridad de skills en CI
    - **Descripción**: El repositorio SHALL ejecutar en integración continua un escaneo de seguridad
      sobre los skills publicados (Skill Shielder) y sobre la imagen de desarrollo, de modo que
      ningún skill con veredicto adverso llegue al paquete distribuido.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `.github/workflows/` contiene `skill-security-audit.yml` y
      `docker-security.yml`, ambos en verde en la rama principal.

- **NFR-020**: Ausencia de secretos en el paquete distribuido
    - **Descripción**: El paquete publicado NO SHALL incluir secretos, credenciales ni archivos de
      desarrollo. El array `files` de `package.json` SHALL delimitar explícitamente lo publicable.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: `npm pack --dry-run` no incluye archivos inesperados; `.env` y
      variantes están en `.gitignore`.

### 2.2.9 Usabilidad y experiencia del desarrollador

- **NFR-021**: Límite de preguntas por ronda de entrevista
    - **Descripción**: Los agentes conversacionales SHALL agrupar un máximo de 3-4 preguntas por
      ronda, derivándolas dinámicamente de los comentarios `<!-- -->` del template activo en runtime,
      nunca de un listado hardcodeado.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: En ninguna ronda un agente formula más de 4 preguntas.

- **NFR-022**: Flags para modos alternativos de ejecución
    - **Descripción**: Los skills SHALL exponer flags para sus variantes de comportamiento
      (`--quick`, `--update`, `--dry-run`, `--interactive`, `--auto`, `--from-files`, `--force`,
      `--verbose`), con el modo seguro como valor por defecto.
    - **Prioridad**: Media
    - **Criterio de aceptación**: Todo flag que altere archivos tiene contraparte `--dry-run` o
      requiere confirmación.

- **NFR-023**: Idempotencia declarada de los skills de inicialización
    - **Descripción**: Los skills de inicialización SHALL declarar explícitamente que no sobrescriben
      archivos existentes, y SHALL poder ejecutarse repetidamente sin efectos destructivos.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Ejecutar `sddf-init` dos veces seguidas no altera ningún archivo
      creado en la primera ejecución.

### 2.2.10 Entorno de desarrollo

- **NFR-024**: Entorno de desarrollo reproducible con Docker
    - **Descripción**: El sistema SHALL proveer un entorno reproducible mediante `Dockerfile.dev` y
      `docker-compose.dev.yml` sobre imagen base `debian:bookworm-slim`, y configuración de VS Code
      Dev Container con las extensiones de trabajo del framework.
    - **Prioridad**: Media
    - **Criterio de aceptación**: `docker compose -f docker-compose.dev.yml up` levanta el entorno sin
      errores; `.devcontainer/devcontainer.json` declara las extensiones requeridas.

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
│   └── project-policies-generation  Output: constitution.md + definition-of-done-story.md
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
├── readme-builder        → README.md (3 niveles de degradación según artefactos disponibles)
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
frontera permite que el core evolucione sin arrastrar el ciclo de vida de cada stack soportado.

## 11. Referencias

- [[index]] — `docs/index.md`, cursor de entrada a toda la documentación del repositorio
- [[PROJ-01-agile-sddf-project-intent]] — intención inicial del proyecto
- [[project-plan]] — plan de épicas y backlog · [[story-map]] — mapa de historias
- [[constitution]] — principios técnicos inamovibles, stack y estándares de construcción de skills
- [[definition-of-done]] — Definition of Done por estado del workflow de historia
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

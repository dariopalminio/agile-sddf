**Nombre del Sistema**: Agile SDDF (Spec-Driven Development Framework)
**Categoría del Software**: AI-CLI Framework / Sistema Multiagente
**Título del Documento**: Especificación de Requisitos
**Versión**: 1.0
**Estado**: Ready
**Fecha**: 2026-04-19
**Generado por**: reverse-engineer-synthesizer

# 1. Definición del proyecto

## 1.1. Nombre de Proyecto

Agile SDDF — Agile Spec-Driven Development Framework

## 1.2. Definición del Problema

Los builders, freelancers, desarrolladores y equipos ágiles que usan IA para acelerar el desarrollo de software carecen de un proceso estructurado y reproducible para transformar ideas en especificaciones de calidad. El flujo actual es ad-hoc: prompts inconsistentes, sin trazabilidad entre intención y código, sin puntos de revisión humana ni control de scope. El impacto directo es pérdida de tiempo, requerimientos incompletos y productos que no resuelven el problema original.

## 1.3. Visión (elevator pitch)

- **Para:** Builders, freelancers, desarrolladores y equipos ágiles que usan IA para acelerar el desarrollo de software
- **Quiénes:** Sufren de procesos manuales, prompts inconsistentes y falta de estructura para transformar ideas en especificaciones y código de calidad de manera predecible
- **Nuestro producto:** Agile SDDF (Spec-Driven Development Framework)
- **Es un:** software AI-CLI tipo Framework de automatización de especificación (AI-native, multiagente, basado en Markdown) y un conjunto de skills preconstruidos para cubrir todo el ciclo de vida de la especificación de proyectos ágiles
- **Que provee:** Un workflow ágil y secuencial con control de WIP, automatización con IA con puntos de revisión humana integrados y trazabilidad completa desde la intención inicial hasta el backlog planificado de historias de usuario, todo gestionado con archivos Markdown
- **A diferencia de:** Escribir prompts ad-hoc, usar herramientas monolíticas o frameworks rígidos que no se adaptan al contexto del proyecto
- **Nuestro producto:** Es el único sistema que extrae dinámicamente la estructura de los templates en tiempo de ejecución para generar preguntas y comportamientos contextuales, integrando nativamente con OpenSpec y SpecKit, y siendo compatible con múltiples runtimes de IA (Claude Code, OpenCode, GitHub Copilot, Gemini) sin modificar el núcleo del framework

## 1.4. Beneficios Clave

- Automatización del ciclo completo de especificación: desde la intención inicial (`project-intent.md`) hasta el plan de releases (`project-plan.md`) con gates de revisión humana en cada etapa
- Trazabilidad completa entre intención, requisitos, historias de usuario y plan de backlog, con IDs únicos (`FEAT-NNN`) y control de estado por documento
- Flexibilidad de plataforma: los mismos skills y agentes operan en Claude Code, GitHub Copilot, Codex/Cursor/OpenCode, Google Gemini y Atlassian Rovo sin modificar el código del framework
- Calidad de historias de usuario garantizada mediante la rúbrica FINVEST (Formato + INVEST) con scores cuantitativos, decisiones accionables y ciclos de refinamiento automatizados
- Ingeniería inversa de codebases existentes para generar especificaciones de requisitos automáticamente mediante análisis paralelo de 4 agentes especializados

## 1.5. Criterios de Éxito

- [ ] El pipeline ProjectSpecFactory (Begin Intention → Discovery → Planning) produce los 3 documentos canónicos (`project-intent.md`, `requirement-spec.md`, `project-plan.md`) sin errores en una sesión continua
- [ ] El skill `story-evaluation` aplica la rúbrica FINVEST y produce una decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) con score numérico en escala Likert 1-5 por dimensión
- [ ] El skill `reverse-engineering` genera un `requirement-spec.md` completo a partir de un repositorio existente, con al menos el 80% de secciones completadas automáticamente
- [ ] El control WIP=1 impide la creación de múltiples proyectos activos sin confirmación explícita del usuario
- [ ] Cualquier skill puede ser adoptado por un nuevo runtime de IA (Claude Code, OpenCode, GitHub Copilot, Google Gemini) sin modificar el archivo SKILL.md del skill

## 1.6. Restricciones

- **Technical**: El sistema no tiene código ejecutable propio — es un framework declarativo de instrucciones Markdown. Depende de un runtime de IA compatible (Claude Code como primario, GitHub Copilot, Codex/Cursor, Google Gemini, Atlassian Rovo como alternativos). Sin base de datos: el almacenamiento es el sistema de archivos local. El entorno de desarrollo requiere Docker (imagen `debian:bookworm-slim`).
- **Time**: Sin deadline definido — proyecto continuo que evoluciona orgánicamente. [CONFIRMED]
- **Resources**: Solo developer (1 persona). La única dependencia externa de runtime confirmada es `skill-creator` (anthropics/skills, hash `57f470f5...`) gestionada vía `skills-lock.json`. [CONFIRMED]

## 1.7. Fuera de alcance (Non-Goals)

- Generación de código de implementación a partir de especificaciones (la visión menciona "hasta el código desplegado" pero no hay skill confirmado para esta capacidad en el repositorio actual)
- Exportación de documentos a formatos externos: PDF, Jira, Linear, Notion, GitHub Issues
- Autenticación de usuarios o control de acceso basado en roles (el sistema es CLI sin multiusuario)
- Sistema de mensajería o notificaciones push
- Gestión de múltiples proyectos en paralelo en el mismo repositorio (WIP=1 es una restricción de diseño deliberada)

## 1.8. Características de los Usuarios

- **US-001**: Desarrollador / Builder Individual
    - **Descripción**: Desarrollador o freelancer que usa Claude Code u otro runtime de IA para crear software. Necesita estructurar su proceso de especificación de forma ágil sin overhead metodológico. Invoca skills directamente desde el CLI del agente de IA.

- **US-002**: Equipo Ágil
    - **Descripción**: Equipo de desarrollo que adopta el framework para estandarizar la especificación de proyectos. Usa el pipeline ProjectSpecFactory para generar documentos compartidos que sirven como fuente de verdad del backlog. Puede usar múltiples runtimes (Claude Code, GitHub Copilot) según la preferencia de cada miembro.

- **US-003**: Product Owner / Analista de Negocio
    - **Descripción**: Rol responsable de la calidad de las historias de usuario. Usa los skills `story-evaluation`, `story-split` y `story-refine` para garantizar que las historias cumplan la rúbrica FINVEST antes de entrar al sprint.

- **US-004**: Arquitecto de Software
    - **Descripción**: Rol representado por el agente `project-architect`. Conduce la entrevista de requisitos, extrae features FEAT-NNN y planifica releases con criterio de priorización (valor de negocio → dependencias → riesgo técnico → esfuerzo).

# 2. Requisitos

## 2.1 Pipeline de Especificación de Proyectos (ProjectSpecFactory)

- **FR-001**: Captura de intención inicial del proyecto
    - **Descripción**: El sistema SHALL conducir una entrevista interactiva guiada para capturar el nombre del proyecto, el problema que resuelve, la visión, los beneficios clave, los criterios de éxito, las restricciones y los non-goals. El resultado se escribe en `docs/specs/project/project-intent.md` con `Estado: Doing`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: FEAT-001, `.claude/skills/project-begin/SKILL.md`

- **FR-002**: Discovery del proyecto con descubrimiento de usuarios y especificación de requisitos
    - **Descripción**: El sistema SHALL colaborar con el usuario en dos sub-fases: (1) Discovery de perfiles de usuario y sus dolores, y (2) Entrevista de especificación sección por sección del template de requisitos. El output es `docs/specs/project/requirement-spec.md`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002, US-003
    - **Fuente**: FEAT-002, `.claude/skills/project-discovery/SKILL.md`

- **FR-003**: Planificación de proyecto con releases y backlog de features
    - **Descripción**: El sistema SHALL extraer features atómicas con IDs FEAT-NNN desde el `requirement-spec.md`, priorizarlas según criterios (valor de negocio → dependencias → riesgo técnico → esfuerzo) y agruparlas en releases incrementales con MVP en Release 1 (mínimo 3-5 features, desplegable, con 2+ criterios de éxito medibles). El output es `docs/specs/project/project-plan.md`.
    - **Prioridad**: Alta
    - **Usuario**: US-002, US-004
    - **Fuente**: FEAT-003, BR-043, BR-044, BR-045, `.claude/skills/project-planning/SKILL.md`

- **FR-004**: Ejecución del pipeline de proyecto completo en una sola sesión
    - **Descripción**: El sistema SHALL permitir ejecutar las tres fases (Begin Intention → Discovery → Planning) en una sola sesión continua mediante el skill `project-flow`, con gates de revisión humana entre cada etapa y detección automática del estado actual del pipeline.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: FEAT-004, BR-023, `.claude/skills/project-flow/SKILL.md`

- **FR-005**: Retoma de proyecto interrumpido
    - **Descripción**: El sistema SHALL detectar automáticamente el campo `Estado` de los documentos existentes en `docs/specs/project/` y reanudar el trabajo desde la fase o sección incompleta sin requerir configuración manual. El agente NO debe re-preguntar secciones ya completadas.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: FEAT-005, BR-039, BR-040

- **FR-006**: Control de Pipeline de Proyecto con Work-In-Progress (WIP=1)
    - **Descripción**: El sistema SHALL verificar al inicio de cada pipeline si existe un documento con `Estado: Doing`. Si existe, presenta al usuario las opciones "Sobrescribir" o "Retomar". No permite proyectos activos simultáneos sin confirmación explícita.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: FEAT-006, BR-037, BR-038

- **FR-007**: Gates de revisión humana entre fases
    - **Descripción**: El sistema SHALL presentar un resumen del documento generado y solicitar confirmación del usuario antes de avanzar a la siguiente fase. El documento avanza a `Estado: Ready` solo cuando el usuario confirma. Si el usuario pide ajustes, el sistema regresa al agente correspondiente.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002
    - **Fuente**: FEAT-007, BR-025, BR-026

- **FR-008**: Extracción dinámica de secciones de templates en runtime
    - **Descripción**: El sistema SHALL leer los headers `##` y los comentarios `<!-- -->` de los templates en tiempo de ejecución para derivar preguntas y completar secciones, sin lógica hardcodeada. Cambiar un template modifica automáticamente el comportamiento del agente.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002, US-004
    - **Fuente**: FEAT-008, BR-041

## 2.1.2 User Story Mapping

- **FR-009**: Sesión interactiva de User Story Mapping
    - **Descripción**: El sistema SHALL conducir una sesión colaborativa para identificar personas, construir el backbone de actividades, definir el walking skeleton y trazar release slices. El output es `docs/specs/project/story-map.md` con mapa ASCII estilo Jeff Patton.
    - **Prioridad**: Media
    - **Usuario**: US-002, US-003
    - **Fuente**: FEAT-009

- **FR-010**: Integración del story map como guía de planificación
    - **Descripción**: El sistema SHALL detectar si existe `story-map.md` durante la fase de Planning y, si existe, usarlo como guía estructural para agrupar features en releases respetando el backbone como organizador de actividades del usuario.
    - **Prioridad**: Media
    - **Usuario**: US-002, US-004
    - **Fuente**: FEAT-010, BR-021, BR-027

## 2.1.3 Gestión de Historias de Usuario

- **FR-011**: Creación de historias de usuario
    - **Descripción**: El sistema SHALL generar historias completas en formato Como/Quiero/Para con criterios de aceptación Gherkin (Dado/Cuando/Entonces), incluyendo mínimo 1 escenario principal y 1 escenario alternativo o de error. El output se guarda como `story-{slug}.md` en `docs/specs/stories/`.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: FEAT-011, BR-007, BR-008, BR-009, BR-010

- **FR-012**: Evaluación de calidad de historias con rúbrica FINVEST
    - **Descripción**: El sistema SHALL evaluar historias de usuario aplicando la rúbrica FINVEST (Formato + INVEST) con scores en escala Likert 1-5 por dimensión. La decisión final SHALL ser una de: APROBADA (FINVEST ≥ 4.0), REFINAR (3.0 ≤ FINVEST < 4.0), RECHAZAR (FINVEST < 3.0 o dimensión crítica = 1), DIVIDIR (S = 1). Si F_score < 2.5, el sistema rechaza sin evaluar INVEST.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: FEAT-012, BR-001, BR-002, BR-003, BR-011, BR-056, BR-057

- **FR-013**: División de historias grandes (Story Splitting)
    - **Descripción**: El sistema SHALL dividir historias grandes en historias más pequeñas e independientes aplicando uno de los 8 patrones de splitting (pasos de flujo de trabajo, variaciones de reglas de negocio, variaciones de datos, complejidad de criterios, esfuerzo mayor, dependencias externas, pasos DevOps, TADs). Las historias derivadas del Patrón 8 (TADs) no se guardan como archivos de historia.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: FEAT-013, BR-006, BR-049

- **FR-014**: Refinamiento iterativo de historias con ciclo completo
    - **Descripción**: El sistema SHALL orquestar un ciclo completo de creación → evaluación → división → mejora de historias con control de backlog (Estado: Doing/Ready) y gate anti-bucle que solicita confirmación del usuario antes de reiterar. El sistema SHALL invocar al agente `story-product-owner` para fortalecer la redacción antes de re-evaluar.
    - **Prioridad**: Alta
    - **Usuario**: US-003
    - **Fuente**: FEAT-014, BR-028, BR-029, BR-030, BR-031, BR-036

- **FR-015**: Búsqueda de historias por término o nombre de archivo
    - **Descripción**: El sistema SHALL permitir invocar los skills de story-creation o story-split con un término corto, buscar automáticamente en `docs/specs/stories/` el archivo correspondiente, y solicitar selección al usuario si hay múltiples coincidencias.
    - **Prioridad**: Media
    - **Usuario**: US-003
    - **Fuente**: FEAT-015, BR-053

- **FR-016**: Backlog de historias con trazabilidad de origen
    - **Descripción**: El sistema SHALL mantener un registro de backlog de sesión con ID, archivo, origen (original o derivado de split), estado y decisión FINVEST por historia, incluyendo trazabilidad de historias derivadas mediante IDs únicos (ST-00X).
    - **Prioridad**: Media
    - **Usuario**: US-003
    - **Fuente**: FEAT-016, BR-031, BR-032

## 2.1.4 Ingeniería Inversa de Repositorios

- **FR-017**: Generación automática de requisitos desde código existente
    - **Descripción**: El sistema SHALL analizar un repositorio existente mediante 4 agentes especializados en paralelo y un agente sintetizador, generando automáticamente `docs/specs/project/requirement-spec.md`. Las secciones sin datos suficientes se marcan como `<!-- PENDING MANUAL REVIEW -->`.
    - **Prioridad**: Alta
    - **Usuario**: US-001, US-002, US-004
    - **Fuente**: FEAT-017, BR-034, BR-052

- **FR-018**: Análisis de arquitectura técnica del repositorio
    - **Descripción**: El sistema SHALL detectar el stack tecnológico, dependencias, frameworks, patrones arquitectónicos y puntos de integración del repositorio con niveles de confianza explícitos (DIRECT / INFERRED / SUGGESTED).
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-018

- **FR-019**: Extracción de features desde perspectiva del usuario
    - **Descripción**: El sistema SHALL analizar rutas, endpoints, textos de UI, botones y componentes del repositorio para producir un inventario de features agrupado por dominio de negocio.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-019

- **FR-020**: Extracción de reglas de negocio desde el código
    - **Descripción**: El sistema SHALL analizar validaciones, permisos, workflows y lógica condicional del repositorio para producir un catálogo de reglas de negocio clasificadas por tipo (Validación / Permiso / Workflow / Negocio / Cálculo).
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-020

- **FR-021**: Reconstrucción del mapa de navegación y flujos de usuario
    - **Descripción**: El sistema SHALL mapear la estructura de navegación del repositorio (rutas, pantallas, guards, flujos) y producir un árbol ASCII compatible con el template de requisitos.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-021

- **FR-022**: Análisis con scope acotado (--focus)
    - **Descripción**: El sistema SHALL permitir limitar el análisis de ingeniería inversa a una ruta específica del repositorio usando el flag `--focus <path>`.
    - **Prioridad**: Media
    - **Usuario**: US-001, US-004
    - **Fuente**: FEAT-024

- **FR-023**: Modo incremental de actualización de especificación (--update)
    - **Descripción**: El sistema SHALL re-analizar solo las secciones marcadas como `<!-- PENDING MANUAL REVIEW -->` en el documento existente al ejecutarse con el flag `--update`, preservando verbatim las secciones ya completas.
    - **Prioridad**: Media
    - **Usuario**: US-001, US-004
    - **Fuente**: FEAT-023

## 2.1.5 Gestión y Creación de Skills (Meta-Framework)

- **FR-024**: Creación de nuevas skills con ciclo iterativo
    - **Descripción**: El sistema SHALL permitir crear nuevas skills mediante un ciclo: captura de intención → redacción del SKILL.md → generación de casos de prueba → ejecución paralela (con/sin skill) → review del usuario → mejora hasta satisfacción.
    - **Prioridad**: Media
    - **Usuario**: US-001, US-004
    - **Fuente**: FEAT-025

- **FR-025**: Benchmarking comparativo de versiones de skills
    - **Descripción**: El sistema SHALL ejecutar casos de prueba en paralelo (con skill vs sin skill o versión anterior), gradear resultados contra aserciones y generar un viewer HTML para comparación cualitativa y cuantitativa.
    - **Prioridad**: Baja
    - **Usuario**: US-001
    - **Fuente**: FEAT-026

- **FR-026**: Empaquetado y distribución de skills
    - **Descripción**: El sistema SHALL permitir empaquetar una skill finalizada en un archivo `.skill` para distribuirla e instalarla en otros entornos.
    - **Prioridad**: Baja
    - **Usuario**: US-001
    - **Fuente**: FEAT-028

## 2.1.6 Integración OpenSpec

- **FR-027**: Propuesta de cambio con artefactos completos (OpenSpec Propose)
    - **Descripción**: El sistema SHALL crear un cambio OpenSpec con los artefactos `proposal.md`, `design.md` y `tasks.md` en `openspec/changes/<name>/` a partir de una descripción del usuario. Si el input es ambiguo, el sistema pregunta antes de proceder.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-029, BR-050

- **FR-028**: Exploración y pensamiento previo al cambio (OpenSpec Explore)
    - **Descripción**: El sistema SHALL proveer un modo "thinking partner" para explorar ideas e investigar el codebase sin implementar código, generando artefactos OpenSpec solo a elección del usuario.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-030

- **FR-029**: Implementación de tareas de un cambio OpenSpec
    - **Descripción**: El sistema SHALL implementar las tareas pendientes de un cambio OpenSpec en secuencia, marcando checkboxes `- [ ]` → `- [x]`, y pausar ante ambigüedades o problemas de diseño revelados durante la implementación.
    - **Prioridad**: Alta
    - **Usuario**: US-004
    - **Fuente**: FEAT-031, BR-051

- **FR-030**: Archivado de cambio completado con sincronización de specs
    - **Descripción**: El sistema SHALL verificar artefactos y tareas pendientes antes de archivar un cambio, ofrecer sincronizar delta specs hacia los specs principales, y mover el directorio a `openspec/changes/archive/YYYY-MM-DD-<name>/`.
    - **Prioridad**: Media
    - **Usuario**: US-004
    - **Fuente**: FEAT-032, BR-033

## 2.2. Requisitos No Funcionales

### 2.2.1 Plataforma y Compatibilidad de Runtimes

- **NFR-001**: Compatibilidad multi-runtime de IA
    - **Descripción**: El sistema SHALL ser compatible con al menos 5 runtimes de IA: Claude Code (Anthropic) como primario, GitHub Copilot, Codex/Cursor/OpenCode, Google Gemini Gems y Atlassian Rovo. Los skills se duplican en `.claude/`, `.agents/`, `.github/` y `rovo/` para cada runtime.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Un skill puede ejecutarse correctamente en Claude Code y GitHub Copilot sin modificar el archivo SKILL.md de la fuente primaria.

- **NFR-002**: Formato declarativo Markdown como lenguaje de definición
    - **Descripción**: El sistema SHALL definir todos sus agentes, skills y templates exclusivamente en archivos Markdown (`.md`). No debe haber lógica de negocio hardcodeada fuera de archivos Markdown en el pipeline principal.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: El directorio `.claude/agents/` y `.claude/skills/` contienen solo archivos `.md` y subdirectorios de recursos (templates, examples, scripts de soporte).

### 2.2.2 Almacenamiento y Persistencia

- **NFR-003**: Sistema de archivos como única capa de persistencia
    - **Descripción**: El sistema SHALL usar exclusivamente el sistema de archivos local para persistencia. No debe requerir base de datos, servicio de almacenamiento externo ni servidor propio.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Todos los outputs del pipeline son archivos `.md` en `docs/specs/project/` y `docs/specs/stories/`. No existe ningún archivo de configuración de base de datos en el repositorio.

- **NFR-004**: Control de estado mediante campo `**Estado**` en documentos
    - **Descripción**: El sistema SHALL usar el campo `**Estado**: Doing | Ready` en los documentos Markdown como mecanismo de control de flujo y lock distribuido. Este campo es el único mecanismo de estado persistente reconocido por todos los skills y agentes.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Ningún skill avanza al siguiente paso si el documento de entrada no tiene `Estado: Ready`.

### 2.2.3 Trazabilidad y Auditoría

- **NFR-005**: Niveles de confianza explícitos en contenido generado
    - **Descripción**: El sistema SHALL marcar todo contenido generado por inferencia con etiquetas de confianza: `[DIRECT]` para datos confirmados en el código, `[INFERRED]` para datos derivados, `[SUGGESTED]` para hipótesis. El contenido no provisto por el usuario SHALL marcarse con `[inferido]` en el documento de output.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Los archivos `.tmp/rfc-*.md` contienen etiquetas de confianza en cada ítem. Los agentes incluyen `[inferido]` en el documento generado para contenido no confirmado por el usuario.

- **NFR-006**: Metadatos de trazabilidad en todos los documentos generados
    - **Descripción**: El sistema SHALL incluir en cada documento generado los metadatos: `**Versión**`, `**Estado**`, `**Fecha**` y `**Generado por**`.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Todos los documentos en `docs/specs/project/` incluyen estos 4 campos en el encabezado. [DIRECT — BR-055]

### 2.2.4 Seguridad y Control de Acceso

- **NFR-007**: Control de acceso basado en precondiciones de documento
    - **Descripción**: El sistema SHALL implementar el control de avance de pipeline exclusivamente mediante verificación del campo `**Estado**` del documento de entrada requerido. No se implementa autenticación de usuarios ni roles de sistema.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: El skill `project-discovery` no ejecuta si `project-intent.md` no existe o tiene `Estado: Doing`. El skill `project-planning` no ejecuta si `requirement-spec.md` no está en `Estado: Ready`. [DIRECT — BR-013, BR-014, BR-015, BR-016]

### 2.2.5 Usabilidad y Experiencia del Desarrollador

- **NFR-008**: Límite de preguntas por ronda de entrevista
    - **Descripción**: Los agentes `project-pm` y `project-architect` SHALL agrupar un máximo de 3-4 preguntas por ronda de entrevista. No deben usar preguntas hardcodeadas — las derivan dinámicamente de los comentarios `<!-- -->` del template activo en runtime.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: En ninguna sesión de entrevista el agente hace más de 4 preguntas en una sola respuesta. [DIRECT — BR-041]

- **NFR-009**: Output parcial ante datos insuficientes
    - **Descripción**: El sistema SHALL producir el documento de output aunque algunas secciones no puedan completarse automáticamente, marcando esas secciones como `<!-- PENDING MANUAL REVIEW -->`. Output parcial es preferible a ningún output.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: El skill `reverse-engineering` genera `requirement-spec.md` incluso si algún archivo `.tmp/rfc-*.md` está ausente. [DIRECT — BR-034]

### 2.2.6 Mantenibilidad y Extensibilidad

- **NFR-010**: Templates como contrato de interfaz entre skills y agentes
    - **Descripción**: Los archivos en `*/templates/*.md` SHALL ser el contrato entre skills y agentes. Un cambio en un template debe alterar automáticamente el comportamiento de todos los agentes que lo leen en runtime, sin requerir cambios en el código del agente.
    - **Prioridad**: Alta
    - **Criterio de aceptación**: Al modificar `requirement-spec-template.md`, los agentes `project-pm` y `project-architect` generan preguntas basadas en las nuevas secciones sin actualizar su propio SKILL.md.

- **NFR-011**: Versionado de dependencias externas de skills
    - **Descripción**: El sistema SHALL gestionar las dependencias de skills externos mediante `skills-lock.json`, incluyendo hash de verificación de integridad para cada skill externo instalado.
    - **Prioridad**: Media
    - **Criterio de aceptación**: `skills-lock.json` existe en la raíz del repositorio y contiene el hash del skill `skill-creator` (anthropics/skills).

### 2.2.7 Entorno de Desarrollo

- **NFR-012**: Entorno de desarrollo reproducible con Docker
    - **Descripción**: El sistema SHALL proveer un entorno de desarrollo reproducible mediante Docker (`Dockerfile.dev`, `docker-compose.dev.yml`) con imagen base `debian:bookworm-slim` con git, curl y bash.
    - **Prioridad**: Media
    - **Criterio de aceptación**: `docker-compose up` levanta el entorno de desarrollo sin errores en un sistema con Docker instalado.

- **NFR-013**: Configuración de VS Code Dev Container
    - **Descripción**: El sistema SHALL incluir configuración de VS Code Dev Container con extensiones: `anthropic.claude-code`, `Continue.continue`, `yzhang.markdown-all-in-one`, `davidanson.vscode-markdownlint`, `redhat.vscode-yaml`.
    - **Prioridad**: Baja
    - **Criterio de aceptación**: `.devcontainer/devcontainer.json` existe y lista las 5 extensiones mencionadas.

## 2.3. Experiencia de usuario (UX) y Diseño de Interfaz (UI)

El sistema es un framework CLI/conversacional sin interfaz gráfica. La "interfaz" es la conversación entre el usuario y los agentes de IA dentro del runtime (Claude Code, GitHub Copilot, etc.). Los patrones de UX detectados son:

- **Entrevista conversacional**: Los agentes formulan preguntas en grupos de 3-4 por ronda, esperando respuesta antes de continuar.
- **Gates de revisión explícitos**: Antes de avanzar entre fases, el sistema presenta un resumen y solicita confirmación con opciones binarias ("Sí, continuar" / "No, necesito ajustes").
- **Control de conflictos WIP con opciones claras**: Ante conflicto WIP=1, el sistema presenta exactamente dos opciones ("Sobrescribir" / "Retomar") sin lógica ambigua.
- **Gate anti-bucle en refinamiento**: En `story-refine`, el sistema siempre pide confirmación antes de reiterar, ofreciendo tres salidas explícitas: "Seguir iterando ahora" / "Cerrar manualmente en Ready" / "Dejar en Doing para retomar luego".

# 3. Diseño de interfaz gráfica (UI) y experiencia de usuario (UX)

## 3.1. Design Vibe

Minimalista y conversacional — el framework no tiene interfaz gráfica propia. La experiencia visual es texto en Markdown renderizado en el runtime de IA del usuario. El estilo de documentos generados es profesional, estructurado y con trazabilidad visible (IDs, niveles de confianza, estados de documento).

- **Ejemplos:**
  - "Profesional y técnico, con estructura clara de documentos Markdown"
  - "Conversacional y guiado, con preguntas contextuales derivadas del template"

## 3.2. Visual Inspiration

- **Referencias:** No aplica — el sistema es CLI sin interfaz web. El único artefacto visual es el `eval_review.html` generado por el skill `skill-creator` para comparación de benchmarks.
- **Estilo:** No aplica (CLI/conversacional)
- **Mood board:** Documentos Markdown bien estructurados con encabezados jerárquicos, tablas de datos, árboles ASCII y checkboxes de estado.

## 3.3. Mapas de Navegación

Estilo Árbol Jerárquico (Tree)

```
AGILE SDDF — Sistema de Invocación de Skills
│
├── PIPELINE A: ProjectSpecFactory — Full (skill: project-flow) 
│   │   Entry: unified orchestrator que detecta estado y reanuda donde corresponde
│   │
│   ├── [Fase 1] project-begin 
│   │   ├── Precondición: ninguna (entry point del pipeline)
│   │   ├── Guard WIP=1: detecta doc en Estado: Doing 
│   │   ├── Agente delegado: project-pm
│   │   ├── Output: docs/specs/project/project-intent.md
│   │   └── [Bifurcación] Estado del output:
│   │       ├── No existe → Crear (flujo normal)
│   │       ├── Estado: Doing → Retomar (flujo de retoma)
│   │       └── Estado: Ready → Confirmar sobrescritura
│   │
│   ├── [Fase 2] project-discovery 
│   │   ├── Precondición: project-intent.md con Estado: Ready 
│   │   ├── Sub-fase Discovery: agente project-pm  (+ apoyo opcional project-ux)
│   │   ├── Sub-fase Specifying: agente project-architect  (+ apoyo opcional project-ux)
│   │   ├── Output: docs/specs/project/requirement-spec.md
│   │   └── [Bifurcación] Estado del output:
│   │       ├── No existe → Crear
│   │       ├── Estado: Doing → Retomar
│   │       └── Estado: Ready → Confirmar sobrescritura
│   │
│   └── [Fase 3] project-planning 
│       ├── Precondición: requirement-spec.md con Estado: Ready 
│       ├── Sub-fase Story Mapping (opcional):
│       │   ├── Si story-map.md existe → usar como guía estructural
│       │   └── Si no existe → ofrecer ejecutar project-story-mapping primero
│       ├── Agente delegado: project-architect
│       ├── Output: docs/specs/project/project-plan.md
│       └── [Bifurcación] Estado del output:
│           ├── No existe → Crear
│           ├── Estado: Doing → Retomar
│           └── Estado: Ready → Pipeline completo
│
├── PIPELINE B: ProjectSpecFactory — Pasos individuales 
│   ├── project-begin          (mismo que Fase 1 arriba)
│   ├── project-discovery      (mismo que Fase 2 arriba)
│   └── project-planning       (mismo que Fase 3 arriba)
│
├── PIPELINE C: User Story Mapping 
│   └── project-story-mapping
│       ├── Precondición: ninguna (lee project-intent.md y requirement-spec.md si existen)
│       ├── Agente delegado: project-story-mapper
│       └── Output: docs/specs/project/story-map.md
│
├── PIPELINE D: Story Management 
│   │
│   ├── story-creation 
│   │   ├── Input: texto libre | ruta de archivo .md | término de búsqueda
│   │   ├── [Bifurcación] Tipo de input:
│   │   │   ├── Tipo A (texto libre) → generar historia desde cero
│   │   │   ├── Tipo B (ruta) → leer archivo como base
│   │   │   └── Tipo C (búsqueda) → buscar en docs/specs/stories/
│   │   │       ├── 1 coincidencia → usar como base
│   │   │       ├── N coincidencias → mostrar lista y pedir selección
│   │   │       └── Sin coincidencia → tratar como Tipo A
│   │   └── Output: docs/specs/stories/story-{slug}.md
│   │
│   ├── story-evaluation 
│   │   ├── Input: texto de historia de usuario (texto libre o archivo)
│   │   ├── Algoritmo: FINVEST (Formato + INVEST) con escala Likert 1–5
│   │   ├── [Bifurcación] Fase 1 (F_score):
│   │   │   ├── F_score < 2.5 → RECHAZAR sin evaluar INVEST
│   │   │   └── F_score >= 2.5 → continuar a Fase 2 (INVEST)
│   │   └── [Decisión final]:
│   │       ├── APROBADA (FINVEST >= 4.0)
│   │       ├── REFINAR (3.0 <= FINVEST < 4.0)
│   │       ├── RECHAZAR (FINVEST < 3.0 o dimensión crítica = 1)
│   │       └── DIVIDIR (S = 1, historia demasiado grande)
│   │
│   ├── story-split 
│   │   ├── Input: historia grande (texto libre | ruta | búsqueda)
│   │   ├── Proceso: diagnosticar → seleccionar patrón (8 patrones) → escribir splits
│   │   └── Output: N × docs/specs/stories/story-{slug}.md
│   │
│   └── story-refine   ← orquestador del ciclo completo
│       ├── Precondición: ninguna (detecta historias en Estado: Doing en docs/specs/stories/)
│       ├── [Bifurcación] Estado inicial:
│       │   ├── Historias en Estado: Doing → ofrecer retomar o crear nueva
│       │   └── Sin historias en Doing → crear historia nueva
│       ├── Ciclo (por historia activa):
│       │   ├── story-creation → genera historia
│       │   ├── [Opcional] story-product-owner → aclarar contexto, mejorar redacción
│       │   ├── story-evaluation → evalúa con FINVEST
│       │   ├── Si DIVIDIR/RECHAZAR → story-split → historias derivadas al backlog
│       │   └── Si REFINAR/RECHAZAR → story-product-owner → mejorar → re-evaluar
│       ├── Gate anti-bucle: pide confirmación al usuario antes de reiterar
│       └── Output: historias en docs/specs/stories/ con Estado: Doing o Ready
│
├── PIPELINE E: OpenSpec Change Management 
│   │
│   ├── openspec-explore 
│   │   ├── Modo: thinking partner (lectura, sin implementación)
│   │   └── Output: artefactos OpenSpec opcionales (a elección del usuario)
│   │
│   ├── openspec-propose 
│   │   ├── Input: descripción de cambio o nombre kebab-case
│   │   ├── CLI: openspec new change <name> → openspec status --json → artifacts en orden
│   │   └── Output: openspec/changes/<name>/{proposal.md, design.md, tasks.md, specs/}
│   │
│   ├── openspec-apply-change 
│   │   ├── Precondición: change con artefactos requeridos en estado done
│   │   ├── Input: nombre del change (opcional, se infiere del contexto)
│   │   ├── CLI: openspec instructions apply --change <name> --json
│   │   └── Output: implementación de tareas + checkboxes - [ ] → - [x]
│   │
│   └── openspec-archive-change 
│       ├── Precondición: change activo existente
│       ├── Input: nombre del change (obligatorio seleccionar si hay ambigüedad)
│       ├── [Bifurcación] Delta specs:
│       │   ├── Existen → ofrecer sincronizar con specs principales antes de archivar
│       │   └── No existen → archivar directamente
│       └── Output: openspec/changes/archive/YYYY-MM-DD-<name>/
│
├── PIPELINE F: Reverse Engineering 
│   └── reverse-engineering
│       ├── Flags: --focus <path> | --update | --verbose
│       ├── Fase 0 — Setup: parsear flags + verificar template 
│       ├── Fase 1 — Análisis paralelo (4 agentes simultáneos): 
│       │   ├── reverse-engineer-architect         → .tmp/rfc-architecture.md
│       │   ├── reverse-engineer-product-discovery → .tmp/rfc-features.md
│       │   ├── reverse-engineer-business-analyst  → .tmp/rfc-business-rules.md
│       │   └── reverse-engineer-ux-flow-mapper    → .tmp/rfc-navigation.md
│       ├── Fase 2 — Síntesis: 
│       │   └── reverse-engineer-synthesizer → docs/specs/project/requirement-spec.md
│       └── Fase 3 — Confirmación: contar secciones PENDING MANUAL REVIEW
│
└── PIPELINE G: Skill Creator 
    └── skill-creator
        ├── Captura de intención → Entrevista → Draft SKILL.md
        ├── Definición de casos de prueba → evals/evals.json
        ├── Ejecución paralela de runs (with-skill + baseline como subagentes)
        ├── Agentes: analyzer.md, comparator.md, grader.md
        ├── Grading + Benchmark → grading.json + benchmark.json
        ├── Eval viewer: generate_review.py → assets/eval_review.html
        ├── Iteración: feedback usuario → mejora SKILL.md → re-eval
        ├── Optimización de description: run_loop.py (triggering accuracy)
        └── Output: <skill-name>/SKILL.md + .skill package
```

## 3.4. Wireframe ASCII (Box Drawing)

El sistema no tiene interfaz gráfica. El único artefacto visual interactivo es el `eval_review.html` generado por `skill-creator`.

# 4. Arquitectura Técnica

## 4.1. Stack tecnológico

**Fuente primaria**: `.tmp/rfc-architecture.md`

| Capa | Tecnología | Versión / Notas | Confianza |
|------|-----------|-----------------|-----------|
| Lenguaje primario | Markdown (`.md`) | 100+ archivos — lenguaje dominante del repositorio | |
| Lenguaje secundario | Python 3.x | 10 archivos `.py` en `.claude/skills/skill-creator/scripts/` | |
| Runtime primario | Claude Code (Anthropic Claude Agent SDK) | Lee `.claude/agents/` y `.claude/skills/` | |
| Runtime alternativo | GitHub Copilot | Lee `.github/skills/` y `.github/prompts/` | |
| Runtime alternativo | Codex / Cursor / OpenCode | Lee `.agents/skills/` | |
| Runtime alternativo | Google Gemini Gems | Consume `gem/prompts/` | |
| Runtime alternativo | Atlassian Rovo | Consume `rovo/` | |
| Sistema de change management | OpenSpec | `openspec/config.yaml`, estructura `changes/specs` | |
| Contenedor de desarrollo | Docker + docker-compose | `Dockerfile.dev`, `docker-compose.dev.yml`, imagen `debian:bookworm-slim` | |
| IDE | VS Code Dev Container | `.devcontainer/devcontainer.json` | |
| Gestión de dependencias de skills | `skills-lock.json` | Análogo a `package-lock.json` para skills externos | |
| CLI externo | `openspec` CLI | Requerido por skills `openspec-*` | |
| CLI externo | `claude -p` | Invocado por scripts Python de `skill-creator` | |

**Patrón arquitectónico**: Framework de agentes multi-plataforma con orquestación por skills. No es monolito ni microservicio tradicional — es un sistema de instrucciones distribuidas para múltiples runtimes de IA.

**Modelo de delegación**: Un solo nivel — el skill actúa como punto de entrada y coordinador que invoca agentes especializados (subagentes). Estructura plana: Sesión → Subagente.

## 11. Referencias

Sin referencias.

## 12. Definiciones y Acrónimos

| Término / Acrónimo | Definición |
|--------------------|-----------|
| **SDDF** | Spec-Driven Development Framework — metodología del sistema que guía el desarrollo desde especificaciones formales |
| **Skill** | Archivo Markdown (SKILL.md) que define una habilidad especializada para un agente de IA. Actúa como punto de entrada y orquestador. |
| **Agente** | Subprocesador especializado definido en un archivo Markdown (`.agent.md`). Invocado por un skill. |
| **Pipeline ProjectSpecFactory** | Flujo secuencial de tres fases: Begin Intention → Discovery → Planning |
| **WIP** | Work In Progress — en este sistema, restricción de máximo 1 proyecto activo (`Estado: Doing`) simultáneamente |
| **Estado: Doing** | Campo de control de flujo que indica que un documento está en progreso y puede ser retomado |
| **Estado: Ready** | Campo de control de flujo que indica que un documento está completo y actúa como precondición para el siguiente paso del pipeline |
| **FINVEST** | Rúbrica de evaluación de historias: Formato + INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) |
| **INVEST** | Criterios de calidad de historias de usuario: Independent, Negotiable, Valuable, Estimable, Small, Testable |
| **F_score** | Score de la dimensión Formato en la rúbrica FINVEST. Fórmula: `(puntaje_historia × 0.4) + (puntaje_criterios × 0.3) + (puntaje_gherkin × 0.3)` |
| **FINVEST_Score** | Score combinado final. Fórmula: `(F_score + INVEST_Score) / 2` |
| **FEAT-NNN** | Identificador único de feature en el plan de proyecto (ej: FEAT-001) |
| **TAD** | Tiny Act of Discovery — experimento de investigación generado por el Patrón 8 de story-split cuando la historia tiene demasiadas incógnitas para escribir historias concretas |
| **OpenSpec** | Sistema propio de spec-driven change management con estructura `changes/specs` y CLI `openspec` |
| **Gherkin** | Lenguaje de especificación de comportamiento usado en criterios de aceptación: Dado/Cuando/Entonces (Given/When/Then) |
| **Walking Skeleton** | En User Story Mapping: la versión mínima del sistema que demuestra la arquitectura de extremo a extremo |
| **Backbone** | En User Story Mapping: la fila superior de actividades del usuario que organiza la secuencia del sistema |
| **DIRECT** | Nivel de confianza: dato confirmado directamente en el código o documentación del repositorio |
| **INFERRED** | Nivel de confianza: dato derivado por análisis lógico del código, no explícitamente documentado |
| **SUGGESTED** | Nivel de confianza: hipótesis basada en evidencia indirecta, requiere confirmación |
| **Runtime de IA** | Plataforma de ejecución de agentes: Claude Code, GitHub Copilot, Codex, Cursor, Google Gemini Gems, Atlassian Rovo |
| **skill-creator** | Meta-skill para crear y mejorar skills mediante ciclos iterativos de evaluación y benchmarking |
| **`skills-lock.json`** | Archivo de versionado de dependencias externas de skills, análogo a `package-lock.json` |
| **Gate de revisión** | Punto de control en el pipeline donde el sistema solicita confirmación humana antes de avanzar |
| **Gate anti-bucle** | Mecanismo en `story-refine` que impide iteraciones infinitas solicitando confirmación explícita del usuario |

---

## Gaps & Next Steps

> Esta sección fue generada automáticamente. Las secciones marcadas con `<!-- PENDING MANUAL REVIEW -->` requieren información que no pudo inferirse del código fuente.

### Architecture Gaps

- No se detectó mecanismo de sincronización entre plataformas (.claude/, .agents/, .github/, rovo/). **Pregunta sugerida**: ¿Existe un script de sincronización automática de skills entre directorios de plataforma o se mantienen manualmente?
- ~~El directorio `openspec/specs/` parece vacío~~ **RESUELTO**: Contiene specs activas en `openspec/specs/project-story-mapping/spec.md` y `openspec/specs/project-planning-skill/spec.md`.
- Los scripts Python en `skill-creator/` invocan `claude -p` via subprocess. **Pregunta sugerida**: ¿Funciona esta integración en el entorno de CI/CD del equipo?
- No se detectó archivo `.gitignore`. **Pregunta sugerida**: ¿Los archivos temporales en `.tmp/` se commitean accidentalmente? ¿Debe agregarse un `.gitignore`?
- No hay documentación de configuración de autenticación con Claude API, Gemini API o Rovo en distintos entornos. **Pregunta sugerida**: ¿Cómo se configura la autenticación para cada runtime en un nuevo entorno de usuario?
- No hay proceso de release/publish detectado. **Pregunta sugerida**: ¿Existe un proceso de release para distribuir actualizaciones del framework a usuarios?
- No hay testing automatizado del pipeline ProjectSpecFactory. **Pregunta sugerida**: ¿Hay planes de agregar testing automatizado al pipeline principal?

### Feature Gaps

- No hay skill confirmado para generación de código a partir de especificaciones, aunque la visión lo menciona como objetivo. **Pregunta sugerida**: ¿Existe o está planificado un skill de generación de código para una versión futura?
- ~~Ruta de template inconsistente en `project-discovery`~~ **RESUELTO**: El template `requirement-spec-template.md` fue centralizado en `docs/specs/templates/` y todas las referencias en `project-discovery/SKILL.md` y `reverse-engineering/SKILL.md` fueron actualizadas.
- No hay skill para exportar documentos a formatos externos (PDF, Jira, Linear, Notion, GitHub Issues). **Pregunta sugerida**: ¿Está planificada alguna integración de exportación para futuras versiones?
- ~~`openspec-sync-specs` no encontrado en el repositorio~~ **ACLARADO**: Es el skill `opsx:archive` del CLI externo OpenSpec, no del framework SDDF directamente. No es un gap interno.
- No se detectó directorio `tests/` para el framework SDDF (mencionado en CLAUDE.md). **Pregunta sugerida**: ¿Existe un plan de testing para el framework o el `tests/` del CLAUDE.md es aspiracional?

### Business Rule Gaps

- Límite máximo de features por release no especificado para Release 2+. BR-043 define "3-5 features ideal" solo para MVP. **Pregunta sugerida**: ¿Cuántas features como máximo puede tener un release no-MVP?
- Criterio de completitud de secciones en retoma no completamente especificado. **Pregunta sugerida**: ¿Una sección con una sola palabra o frase muy breve se considera completa o incompleta al retomar?
- No existe regla explícita que vincule `story-*.md` con `FEAT-NNN` del plan. **Pregunta sugerida**: ¿Cómo se debe vincular una historia de usuario con su feature correspondiente para garantizar trazabilidad bidireccional?
- No hay límite de iteraciones máximo en `story-refine`. **Pregunta sugerida**: ¿Cuántas veces puede una historia iterarse antes de forzar una decisión definitiva?
- Las reglas internas del CLI `openspec` no son visibles en el repositorio analizado. **Pregunta sugerida**: ¿Hay documentación del CLI openspec disponible que deba incluirse en esta especificación?
- No hay política de nombres únicos de proyectos para múltiples proyectos en el mismo repositorio más allá de WIP=1. **Pregunta sugerida**: ¿Puede el mismo repositorio gestionar múltiples proyectos con carpetas separadas?

### UX & Navigation Gaps

- La generación dinámica de preguntas por los agentes no puede mapearse estáticamente — el árbol de navegación es una aproximación. **Pregunta sugerida**: ¿Se requiere documentación adicional de los flujos de entrevista?
- Coexistencia de dos paths de output: `docs/specs/project/` (canónico en skills actuales) y `docs/project-spec-factory/` (donde están los documentos reales del proyecto). **Aclaración**: `docs/project-spec-factory/` es el path legacy — los skills están actualizados para usar `docs/specs/project/`. Los documentos reales en `docs/project-spec-factory/` son documentos de una ejecución anterior y no han sido migrados. Se recomienda migrarlos o dejarlos como referencia histórica.
- Relación entre `project-flow` y los skills individuales no está completamente documentada. **Pregunta sugerida**: ¿El skill `project-flow` reemplaza o complementa a los skills individuales `project-begin`, `project-discovery` y `project-planning`? Ambos existen en el repositorio.
- El directorio `.agents/skills/` parece estar vacío o sin contenido activo observable. **Pregunta sugerida**: ¿Es un residuo o está en uso activo por algún runtime?

### Secciones completadas tras revisión manual

- **Sección 1.6 — Restricciones (Time)**: ✅ Completado — Sin deadline definido, proyecto continuo.
- **Sección 1.6 — Restricciones (Resources)**: ✅ Completado — Solo developer (1 persona).

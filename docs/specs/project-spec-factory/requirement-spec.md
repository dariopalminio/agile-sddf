**Nombre del Sistema**: ProjectSpecFactory
**Categoría del Software**: CLI
**Título del Documento**: Especificación de Requisitos
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-04
**Generado por**: architect-agent

# 1. Definición del proyecto

## 1.1. Nombre de Proyecto

ProjectSpecFactory

## 1.2. Definición del Problema

El ciclo de especificación de software con IA es inconsistente y no estructurado. Developers, builders, freelancers y PMs técnicos pierden horas corrigiendo outputs de IA porque no cuentan con un sistema que traduzca la intención inicial en requisitos precisos y accionables.

Los síntomas concretos por perfil:

- El **Developer** usa Claude, Cursor o Copilot sin un sistema estructurado. Sus prompts son directos pero sin persistencia ni contexto entre sesiones, lo que genera iteraciones correctivas excesivas.
- El **Builder con idea** tiene la idea clara, pero al explicársela a la IA el resultado no se parece a lo que imaginó.
- El **Freelancer y Consultor** empieza cada proyecto desde cero con prompts inconsistentes, perdiendo horas rehaciendo lo que la IA genera mal.
- El **PM / Founder Técnico** tiene la visión del producto pero sin estructura la IA no acorta el gap entre visión y ejecución.

El impacto es retrabajo, inconsistencia entre proyectos y pérdida de confianza en la IA como herramienta de desarrollo.

## 1.3. Visión (elevator pitch)

- **Para:** Builders, freelancers, developers y PMs técnicos que usan IA para construir software.
- **Quiénes:** Pierden tiempo y calidad porque no tienen un sistema estructurado para traducir su intención en especificaciones precisas que la IA pueda ejecutar de forma predecible.
- **Nuestro producto:** ProjectSpecFactory.
- **Es un/a:** Sistema multiagente minimalista de especificación de proyectos software, implementado como skills, agentes y templates para Claude Code.
- **Que provee:** Un workflow secuencial (begin-intention → ps-discovery → ps-planning) que convierte la intención inicial en un backlog planificado, con control de WIP y revisión humana en cada etapa.
- **A diferencia de:** Escribir prompts a mano, usar plantillas sueltas o frameworks genéricos como BMAD que no integran el ciclo completo ni adaptan las preguntas al contexto del proyecto.
- **Nuestro producto:** Es el único sistema que extrae dinámicamente las secciones de los templates en runtime para derivar las preguntas, garantizando que el proceso de especificación evolucione junto con los templates sin necesidad de actualizar lógica hardcodeada.

## 1.4. Beneficios Clave

- Reducción del retrabajo con IA: al proveer requisitos precisos y contexto cerrado, la generación de código se vuelve una consecuencia predecible en lugar de un punto de partida para correcciones.
- Consistencia entre proyectos: el mismo workflow y los mismos criterios de calidad se aplican a cada proyecto, independientemente del desarrollador o el momento.
- Trazabilidad del proceso de especificación: cada documento incluye metadatos de estado y generación, permitiendo rastrear quién generó qué y en qué momento del ciclo.
- Retoma sin fricción: el sistema detecta automáticamente el estado de cada fase leyendo el campo `Estado` de los documentos existentes, permitiendo continuar desde donde se dejó sin configuración manual. [inferido]

## 1.5. Criterios de Éxito

- [ ] Al menos 3 usuarios activos utilizan el sistema dentro de los primeros 3 meses desde el lanzamiento.
- [ ] Un proyecto completo puede especificarse de inicio a fin (begin-intention → ps-planning) sin intervención manual fuera de las revisiones humanas previstas en el workflow.
- [ ] Los documentos generados no requieren reescritura significativa: el usuario puede avanzar al siguiente estado con ajustes menores o sin ajustes. [inferido: "reescritura significativa" se define como cambios estructurales o de contenido que superen el 30% del documento generado]

## 1.6. Restricciones

- **Technical**: Solución implementada exclusivamente como skills, agentes y templates para Claude Code. Sin UI gráfica, interacción exclusivamente mediante CLI y comandos. Los agentes extraen headers `##` y comentarios `<!-- -->` de los templates en runtime para derivar preguntas y completar documentos. Sin integraciones externas ni dependencias de terceros fuera del ecosistema de Claude.
- **Time**: MVP a entregar en un plazo de 1 mes desde el inicio del desarrollo.
- **Resources**: Proyecto individual o equipo pequeño. [inferido] Sin presupuesto de infraestructura; el almacenamiento es exclusivamente en archivos locales bajo `docs/specs/project/`.

## 1.7. Fuera de alcance (Non-Goals)

- No incluye interfaz gráfica (UI). La interacción es exclusivamente mediante CLI y comandos.
- No incluye ejecución de código ni despliegue de aplicaciones.
- No maneja múltiples proyectos en paralelo (WIP=1).
- No incluye integración con herramientas de gestión como Jira o Linear.
- No incluye validación semántica avanzada de requisitos.
- No incluye generación automática de código a partir de las especificaciones.
- No incluye autenticación ni control de acceso entre usuarios. [inferido]

## 1.8. Características de los Usuarios

- **US-001**: Developer
  - **Descripción**: Ya usa Claude, Cursor o Copilot. Vive en la terminal y en Claude Code. Instala el sistema clonando el repositorio y configurando agentes y skills. Usa el sistema una vez por proyecto nuevo para obtener specs precisas y reutilizables. Su necesidad principal es un sistema estructurado que convierta la intención inicial en specs accionables sin depender de prompts manuales inconsistentes.

- **US-002**: Builder con idea
  - **Descripción**: Tiene una idea de producto clara pero sin experiencia técnica formal en especificación. Instala el sistema y lo usa para externalizar la estructura del proceso de especificación a los agentes. Su necesidad principal es que el output de la IA se parezca a lo que imaginó, sin necesidad de iterar extensamente.

- **US-003**: Freelancer / Consultor
  - **Descripción**: Trabaja en múltiples proyectos para distintos clientes. Instala el sistema para estandarizar su proceso de especificación entre proyectos. Su necesidad principal es consistencia y reutilización: el mismo nivel de calidad sin empezar desde cero en cada proyecto.

- **US-004**: PM / Founder Técnico
  - **Descripción**: Tiene visión de producto y depende parcialmente de un equipo técnico para construirlo. Instala el sistema para cerrar el gap entre visión y ejecución. Su necesidad principal es obtener un backlog planificado por releases que pueda entregar a un equipo o a la IA para su implementación.

# 2. Requisitos

## 2.1. Gestión del Workflow de Especificación

- **FR-001**: Ejecución del workflow secuencial
  - **Descripción**: El sistema SHALL soportar un workflow secuencial de tres fases: `begin-intention → ps-discovery → ps-planning`, donde cada fase produce un documento de output que sirve como input de la siguiente.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-002**: Detección automática de estado
  - **Descripción**: El sistema SHALL detectar automáticamente el estado de cada fase leyendo el campo `Estado: [Doing | Ready]` del documento correspondiente en `docs/specs/project/`. Si el documento no existe, la fase se considera pendiente de ejecución. Si existe con estado `Doing`, la fase está incompleta.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-003**: Retoma de proyecto en curso
  - **Descripción**: El sistema SHALL permitir retomar un proyecto en cualquier fase ejecutando el comando correspondiente a esa fase. El agente leerá automáticamente los documentos existentes en `docs/specs/project/` y continuará desde el estado detectado, sin requerir configuración manual del usuario.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-004**: Control de WIP=1 con decisión del usuario
  - **Descripción**: El sistema SHALL detectar si existe un proyecto activo (con algún documento en estado `Doing`) al intentar iniciar uno nuevo. En ese caso, SHALL avisar al usuario del conflicto y presentar dos opciones: sobrescribir e iniciar un nuevo proyecto, o retomar el proyecto existente. La decisión final es del usuario.
  - **Prioridad**: Media
  - **Usuario**: US-001, US-002, US-003, US-004

## 2.2. Generación de Documentos

- **FR-005**: Generación de project-intent.md
  - **Descripción**: El sistema SHALL generar el documento `docs/specs/project/project-intent.md` durante la fase `begin-intention`, completando todas las secciones del template correspondiente con la información provista por el usuario y el contenido inferido marcado con `[inferido]`.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-006**: Generación de requirement-spec.md
  - **Descripción**: El sistema SHALL generar el documento `docs/specs/project/requirement-spec.md` durante la fase `ps-discovery`, completando todas las secciones del template con la información del discovery, el project-intent y las respuestas del usuario en la entrevista de especificación.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-007**: Generación de project-plan.md
  - **Descripción**: El sistema SHALL generar el documento `docs/specs/project/project-plan.md` durante la fase `ps-planning`, produciendo un backlog de features organizado en releases incrementales con criterios de éxito medibles por release.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-008**: Metadatos de trazabilidad en documentos generados
  - **Descripción**: El sistema SHALL incluir en cada documento generado los metadatos: nombre del sistema, versión, estado (`Doing` al generarse), fecha de generación y agente generador. Estos metadatos deben actualizarse correctamente al transicionar de `Doing` a `Ready`.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

## 2.3. Extracción Dinámica de Templates

- **FR-009**: Extracción de secciones del template en runtime
  - **Descripción**: El sistema SHALL extraer dinámicamente las secciones de cada template en runtime, identificando los headers `##` como nombres de sección y los comentarios `<!-- -->` inmediatamente siguientes como guía para formular preguntas. Esta lógica no debe estar hardcodeada en los agentes.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-010**: Adaptación automática a cambios en templates
  - **Descripción**: El sistema SHALL adaptar su comportamiento automáticamente cuando se modifica un template (agregar, eliminar o renombrar secciones), sin requerir cambios en el código de los agentes. Agregar una nueva sección con su comentario `<!-- -->` al template debe ser suficiente para que el agente la incorpore en la siguiente ejecución.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

## 2.4. Entrevista de Especificación

- **FR-011**: Pre-relleno desde contexto disponible
  - **Descripción**: El sistema SHALL pre-rellenar cada sección del documento de output con la información ya disponible en los documentos de input de la fase, evitando preguntar al usuario información que ya fue capturada en fases anteriores.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-012**: Agrupación de preguntas por rondas
  - **Descripción**: El sistema SHALL agrupar las preguntas al usuario en rondas de máximo 3-4 preguntas, en el orden de aparición de las secciones del template, para reducir la fricción de la entrevista de especificación.
  - **Prioridad**: Media
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-013**: Inferencia y marcado de contenido faltante
  - **Descripción**: El sistema SHALL inferir el contenido de secciones que el usuario no complete con suficiente detalle, usando el contexto del proyecto y la experiencia del agente como arquitecto o PM. Todo contenido inferido SHALL marcarse con la etiqueta `[inferido]` al final de la frase o bullet correspondiente.
  - **Prioridad**: Alta
  - **Usuario**: US-001, US-002, US-003, US-004

## 2.5. Validación de Documentos

- **FR-014**: Validación automática de placeholders (modo automático)
  - **Descripción**: En modo automático, el sistema SHALL verificar que no existan placeholders sin completar (campos con formato `[...]`) en el documento antes de marcarlo como `Ready`. Si se detectan placeholders, SHALL notificar al usuario con la lista de campos pendientes.
  - **Prioridad**: Media
  - **Usuario**: US-001, US-002, US-003, US-004

- **FR-015**: Validación manual por el usuario (modo manual)
  - **Descripción**: En modo manual, el sistema SHALL informar al usuario que debe revisar el documento generado y cambiar el campo `Estado` a `Ready` cuando esté conforme con el contenido. El sistema no bloqueará el avance ni validará el contenido automáticamente en este modo.
  - **Prioridad**: Media
  - **Usuario**: US-001, US-002, US-003, US-004

## 2.2. Requisitos No Funcionales

### 2.2.1 Extensibilidad

- **NFR-001**: Extensibilidad mediante templates
  - **Descripción**: El sistema SHALL ser extensible mediante la modificación exclusiva de templates Markdown, sin necesidad de cambiar la lógica de los agentes. Agregar un nuevo estado al workflow, una nueva sección a un documento o un nuevo agente debe ser posible sin alterar los agentes existentes.
  - **Prioridad**: Alta
  - **Criterio de aceptación**: Se puede agregar una nueva sección con comentario `<!-- -->` a un template y el agente la incorpora en la siguiente ejecución sin cambios en su código.

### 2.2.2 Mantenibilidad

- **NFR-002**: Estructura de archivos autodescriptiva
  - **Descripción**: Cada skill SHALL ser autónomo: sus templates deben residir en `templates/` dentro del mismo directorio del skill. Los agentes deben estar documentados con su rol y estados del pipeline que cubren.
  - **Prioridad**: Alta
  - **Criterio de aceptación**: Un nuevo colaborador puede identificar el template correspondiente a cada skill sin consultar documentación adicional. [inferido]

- **NFR-003**: Idempotencia de ejecución
  - **Descripción**: Re-ejecutar un comando sobre una fase ya completada NO SHALL duplicar contenido ni sobrescribir datos sin confirmación del usuario.
  - **Prioridad**: Alta
  - **Criterio de aceptación**: Ejecutar `/ps-discovery` sobre un `requirement-spec.md` en estado `Ready` genera un aviso al usuario antes de cualquier modificación.

### 2.2.3 Usabilidad (CLI)

- **NFR-004**: Comandos mnemónicos y consistentes
  - **Descripción**: Los comandos del sistema SHALL seguir una convención de nomenclatura consistente con prefijo `/ps-` seguido del nombre del estado (ej: `/ps-begin-intention`, `/ps-discovery`, `/ps-planning`). [inferido]
  - **Prioridad**: Media
  - **Criterio de aceptación**: Un usuario que conoce un comando puede inferir los demás por analogía.

- **NFR-005**: Feedback claro en cada transición
  - **Descripción**: El sistema SHALL informar al usuario el resultado de cada operación completada, incluyendo la ruta del documento generado y el próximo paso recomendado en el workflow.
  - **Prioridad**: Media
  - **Criterio de aceptación**: Al finalizar cualquier fase, el agente indica el path absoluto del documento generado y el comando a ejecutar para continuar.

### 2.2.4 Confiabilidad del Output

- **NFR-006**: Completitud de secciones
  - **Descripción**: Los documentos generados NO SHALL contener secciones vacías ni placeholders sin completar (`[...]`). Todo campo debe tener contenido: capturado del usuario, derivado del contexto o inferido y marcado con `[inferido]`.
  - **Prioridad**: Alta
  - **Criterio de aceptación**: Ningún documento en estado `Ready` contiene campos con formato `[...]` sin reemplazar.

- **NFR-007**: Fidelidad al contexto del proyecto
  - **Descripción**: El contenido generado SHALL ser fiel a la información provista por el usuario, sin introducir alucinaciones ni supuestos no marcados. Todo supuesto SHALL marcarse con `[inferido]`.
  - **Prioridad**: Alta
  - **Criterio de aceptación**: El usuario puede revisar el documento y distinguir claramente qué fue capturado de sus respuestas y qué fue inferido por el agente.

### 2.2.5 Portabilidad

- **NFR-008**: Sin dependencias externas al ecosistema Claude
  - **Descripción**: El sistema SHALL funcionar sin dependencias de servicios externos, bases de datos, APIs de terceros ni herramientas de gestión de proyectos. El único requisito de entorno es tener Claude Code con soporte para agentes y skills.
  - **Prioridad**: Alta
  - **Criterio de aceptación**: El sistema funciona en cualquier máquina con Claude Code instalado, tras clonar el repositorio.

## 2.3. Experiencia de usuario (UX) y Diseño de Interfaz (UI)

No aplica. El sistema es 100% CLI. La interacción ocurre exclusivamente a través de comandos en Claude Code. No existe interfaz gráfica, elementos visuales, navegación ni wireframes.

# 3. Diseño de interfaz gráfica (UI) y experiencia de usuario (UX)

No aplica para este proyecto. ProjectSpecFactory es un sistema CLI sin interfaz gráfica. Las secciones Design Vibe, Visual Inspiration, Mapas de Navegación y Wireframe ASCII quedan fuera de alcance.

# 4. Arquitectura Técnica

## 4.1. Stack tecnológico

- **Runtime**: Claude Code (CLI) con soporte para agentes y skills.
- **Lenguaje de definición**: Markdown exclusivamente — templates, documentos de output y definiciones de agentes son archivos `.md`.
- **Agentes**: Archivos individuales en `.claude/agents/` con frontmatter YAML (`name`, `description`, `tools`, `model`). Tres agentes definidos: `product-manager-agent`, `architect-agent`, `ux-designer-agent`.
- **Skills**: Directorios en `.claude/skills/<nombre>/` con un `SKILL.md` y un subdirectorio `templates/` con los templates propios del skill.
- **Persistencia**: Sistema de archivos local. Los documentos de output se escriben en `docs/specs/project/`. No hay base de datos ni almacenamiento remoto.
- **Control de flujo**: Campo `Estado: [Doing | Ready]` en los metadatos de cada documento Markdown. La lógica de orquestación reside en los agentes, no en infraestructura externa.
- **Sin UI**: No hay frontend, servidor web ni API REST. [inferido]

# 11. Referencias

Esta sección debe ser completada por el usuario cuando existan documentos relevantes a registrar. Ejemplos de referencias a incluir: discovery.md, project-intent.md, ADRs, mockups, documentación técnica externa, repositorios de referencia.

# 12. Definiciones y Acrónimos

| Término | Definición |
|---|---|
| **Agente** | Archivo `.md` en `.claude/agents/` con frontmatter YAML que define el rol, herramientas y modelo de un agente de Claude Code. |
| **Skill** | Directorio en `.claude/skills/<nombre>/` que agrupa un `SKILL.md` y sus templates. Reemplaza al sistema legacy de commands. |
| **Template** | Archivo Markdown con headers `##` y comentarios `<!-- -->` que definen la estructura de un documento de output y las guías para completarlo. |
| **Estado** | Campo de metadatos en cada documento con valor `Doing` (en progreso) o `Ready` (completo y revisado por el usuario). |
| **WIP** | Work In Progress. El sistema aplica WIP=1: un solo proyecto activo a la vez. |
| **Workflow** | Secuencia de fases del pipeline: `begin-intention → ps-discovery → ps-planning`. |
| **Pre-relleno** | Proceso por el cual el agente completa secciones de un documento usando información ya capturada en documentos de fases anteriores, sin preguntar al usuario. |
| **[inferido]** | Etiqueta que indica que el contenido fue generado por el agente a partir del contexto del proyecto, no capturado explícitamente del usuario. |
| **FR** | Functional Requirement. Requisito funcional del sistema. |
| **NFR** | Non-Functional Requirement. Requisito no funcional del sistema. |
| **CLI** | Command Line Interface. Interfaz de línea de comandos. En este sistema, Claude Code es el entorno de ejecución CLI. |
| **MVP** | Minimum Viable Product. Conjunto mínimo de features que resuelve el problema central y puede entregarse a usuarios reales. |
| **ADR** | Architecture Decision Record. Documento que registra una decisión de arquitectura con su contexto y consecuencias. [inferido] |

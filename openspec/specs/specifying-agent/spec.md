## ADDED Requirements

### Requirement: Agente specifying-agent valida el estado de discovery.md
El sistema SHALL proveer un agente `specifying-agent` en `.claude/agents/specifying-agent.md` que, al iniciarse, lee `docs/specs/project/discovery.md` y verifica el campo `**Estado**`.

#### Scenario: discovery.md tiene Estado Ready
- **WHEN** el `specifying-agent` lee `discovery.md` y el campo `**Estado**` es `Ready`
- **THEN** el agente continúa directamente a la entrevista sin interrumpir al usuario

#### Scenario: discovery.md tiene Estado Doing
- **WHEN** el `specifying-agent` lee `discovery.md` y el campo `**Estado**` es `Doing`
- **THEN** el agente pregunta al usuario con `AskUserQuestion` si confirma que el discovery está listo

#### Scenario: Usuario confirma avanzar con Estado Doing
- **WHEN** el usuario confirma avanzar a pesar del Estado `Doing`
- **THEN** el agente usa `Edit` para cambiar el campo `**Estado**` en `discovery.md` de `Doing` a `Ready` y continúa

#### Scenario: Usuario rechaza avanzar con Estado Doing
- **WHEN** el usuario rechaza avanzar
- **THEN** el agente informa que debe completarse el discovery primero y detiene la ejecución

### Requirement: Agente extrae secciones del template en runtime
El sistema SHALL proveer que el `specifying-agent` extraiga dinámicamente los headers `##` y comentarios `<!-- -->` del template `requirement-spec-template.md` para derivar las preguntas de la entrevista.

#### Scenario: Extracción exitosa de secciones
- **WHEN** el agente lee el template `requirement-spec-template.md`
- **THEN** extrae cada header `##` como nombre de sección y el comentario `<!-- -->` inmediato como guía para formular preguntas, sin hardcodear ninguna pregunta

#### Scenario: Template cambia de estructura
- **WHEN** el template tiene secciones nuevas, eliminadas o renombradas respecto a una versión anterior
- **THEN** el agente adapta automáticamente su comportamiento a las nuevas secciones sin requerir cambios en el agente

### Requirement: Agente conduce entrevista sección por sección
El sistema SHALL proveer que el `specifying-agent` conduzca la entrevista de especificación en rondas de máximo 3-4 preguntas, agrupadas en orden de aparición en el template.

#### Scenario: Pre-relleno desde discovery.md
- **WHEN** una sección del template puede responderse con información ya disponible en `discovery.md`
- **THEN** el agente pre-rellena esa sección sin preguntar al usuario

#### Scenario: Agrupación de preguntas
- **WHEN** el agente necesita información del usuario para múltiples secciones
- **THEN** agrupa máximo 3-4 preguntas por ronda y espera las respuestas antes de continuar

### Requirement: Agente produce requirement-spec.md
El sistema SHALL proveer que el `specifying-agent` escriba el documento final `docs/specs/project/requirement-spec.md` usando el template como estructura base.

#### Scenario: Documento generado con metadatos
- **WHEN** el agente finaliza la entrevista
- **THEN** usa `Write` para crear `docs/specs/project/requirement-spec.md` con metadatos: Versión 1.0, Estado Doing, Fecha actual, Generado por specifying-agent

#### Scenario: Comentarios HTML excluidos del output
- **WHEN** el agente escribe el documento final
- **THEN** no incluye los comentarios `<!-- -->` del template en el output

#### Scenario: Contenido inferido marcado
- **WHEN** el agente infiere contenido que el usuario no proporcionó
- **THEN** marca ese contenido con `[inferido]` al final de la frase o bullet

#### Scenario: Propuesta de revisión al usuario
- **WHEN** el agente termina de escribir el documento
- **THEN** propone al usuario que revise el resultado, lo edite si es necesario y menciona que el siguiente paso es `/ps-approve`

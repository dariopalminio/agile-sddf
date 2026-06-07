## ADDED Requirements

### Requirement: story-specify skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/story-specify/SKILL.md` con frontmatter YAML valido (`name: story-specify`, `description`) que sea invocable mediante `/story-specify`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/story-specify`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/story-specify/SKILL.md`

### Requirement: story-specify orchestrates the three existing story skills in sequence
El skill `story-specify` SHALL orquestar el flujo interactivo usando los skills existentes sin modificarlos, en la secuencia `story-creation` -> `story-evaluation` -> `story-split`.

#### Scenario: Initial story creation follows sequence start
- **WHEN** inicia una nueva historia en `story-specify`
- **THEN** el orquestador MUST ejecutar primero la logica de `story-creation` antes de cualquier evaluacion o division

#### Scenario: Evaluation and split happen after creation
- **WHEN** una historia fue creada o actualizada en una iteracion
- **THEN** el orquestador MUST ejecutar `story-evaluation` y luego `story-split` en ese orden

#### Scenario: Existing skills remain unchanged
- **WHEN** se implementa `story-specify`
- **THEN** el sistema MUST NOT modificar archivos ni comportamiento interno de `story-creation`, `story-evaluation` o `story-split`

### Requirement: story files maintain explicit state transitions
Cada historia en refinamiento SHALL mantener los campos `status` y `substatus` en el frontmatter YAML de `story.md`, y el orquestador SHALL gestionar la transiciÃ³n segÃºn el resultado de `story-evaluation` y las decisiones del usuario.

Los valores vÃ¡lidos para el ciclo de refinement son:
- `status: SPECIFY` / `substatus: INâ€‘PROGRESS` â€” mientras el refinamiento estÃ¡ activo
- `status: READY-FOR-PLAN` / `substatus: DONE` â€” cuando `story-evaluation` retorna `APROBADA`

#### Scenario: Story remains SPECIFY/INâ€‘PROGRESS during active refinement
- **WHEN** una historia aÃºn no cumple criterios de cierre (evaluaciÃ³n no aprobada)
- **THEN** su `story.md` MUST tener `status: SPECIFY` y `substatus: INâ€‘PROGRESS`

#### Scenario: Story becomes READY-FOR-PLAN/DONE when FINVEST is approved
- **WHEN** `story-evaluation` retorna decisiÃ³n `APROBADA`
- **THEN** el orquestador MUST actualizar `story.md` a `status: READY-FOR-PLAN` y `substatus: DONE`

#### Scenario: User decides to pause refinement
- **WHEN** la decisiÃ³n FINVEST es `REFINAR` o `RECHAZAR` y el usuario elige pausar
- **THEN** el orquestador MUST permitir finalizar la sesiÃ³n dejando la historia en `status: SPECIFY` / `substatus: INâ€‘PROGRESS`

### Requirement: story-specify sets SPECIFY/INâ€‘PROGRESS at the start of refinement
The system SHALL update `status: SPECIFY` and `substatus: INâ€‘PROGRESS` in `story.md` frontmatter when `story-specify` (or `story-creation` as the entry point) begins processing a story.

#### Scenario: Status updated at refinement start
- **WHEN** `/story-specify` (or `/story-creation`) begins a new or existing story
- **THEN** `story.md` frontmatter MUST be updated to `status: SPECIFY` and `substatus: INâ€‘PROGRESS` before any sub-skill is invoked

### Requirement: story-specify sets READY-FOR-PLAN/DONE when FINVEST approves
The system SHALL update `status: READY-FOR-PLAN` and `substatus: DONE` in `story.md` frontmatter when `story-evaluation` returns `APROBADA`.

#### Scenario: Status updated on FINVEST approval
- **WHEN** `story-evaluation` returns decision `APROBADA` during the `story-specify` flow
- **THEN** `story.md` frontmatter MUST be updated to `status: READY-FOR-PLAN` and `substatus: DONE` before the skill terminates

#### Scenario: Status remains SPECIFY/INâ€‘PROGRESS on non-approved evaluation
- **WHEN** `story-evaluation` returns `REFINAR` or `RECHAZAR`
- **THEN** `story.md` frontmatter MUST remain at `status: SPECIFY` and `substatus: INâ€‘PROGRESS` to signal that refinement is still in progress

### Requirement: story-specify tracks and processes derived stories
El orquestador SHALL mantener registro de cuantas historias existen en el flujo, cuales son derivadas por split y cuales siguen pendientes de refinamiento.

#### Scenario: Split creates derived stories
- **WHEN** `story-split` divide una historia en multiples historias hijas
- **THEN** el orquestador MUST registrar cada historia derivada y agregarla al conjunto de historias pendientes

#### Scenario: Derived stories continue full cycle
- **WHEN** existen historias derivadas pendientes
- **THEN** el orquestador MUST continuar aplicando para cada una la secuencia `creation/evaluation/split` hasta cierre o pausa explicita

#### Scenario: Flow summary is available to user
- **WHEN** cambia el backlog de historias por una division o cierre
- **THEN** el orquestador MUST informar al usuario el total de historias y su estado (`INâ€‘PROGRESS`/`DONE`)

### Requirement: non-approved stories require explicit iteration decision
Para evitar bucles infinitos, el orquestador SHALL pedir decision explicita del usuario en cada ciclo no aprobado (`REFINAR` o `RECHAZAR`) para continuar iterando o terminar.

#### Scenario: Continue iterating after non-approved score
- **WHEN** FINVEST retorna `REFINAR` o `RECHAZAR` y el usuario elige continuar
- **THEN** el orquestador MUST iniciar una nueva iteracion de refinamiento sobre esa historia

#### Scenario: Stop iterating after non-approved score
- **WHEN** FINVEST retorna `REFINAR` o `RECHAZAR` y el usuario elige no continuar
- **THEN** el orquestador MUST cerrar el ciclo actual sin forzar iteraciones adicionales

### Requirement: story-specify uses Product Owner agent for elicitation and improvement
El skill `story-specify` SHALL invocar el agente `.claude/agents/story-product-owner.agent.md` para indagar contexto, analizar problemas, proponer mejoras de redaccion y enriquecer historias cuando sea necesario.

#### Scenario: Product Owner supports questioning and analysis
- **WHEN** falten detalles de negocio, valor, alcance o criterios de aceptacion
- **THEN** el orquestador MUST delegar al agente `story-product-owner` para conducir preguntas y analisis con el usuario

#### Scenario: Product Owner proposes writing improvements
- **WHEN** una historia necesita mayor claridad o mejor redaccion para subir su calidad
- **THEN** el agente `story-product-owner` MUST proponer ajustes concretos antes de la siguiente evaluacion

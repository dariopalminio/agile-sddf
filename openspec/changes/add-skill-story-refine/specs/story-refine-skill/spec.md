## ADDED Requirements

### Requirement: story-refine skill exists and is invocable
El sistema SHALL incluir un skill en `.claude/skills/story-refine/SKILL.md` con frontmatter YAML valido (`name: story-refine`, `description`) que sea invocable mediante `/story-refine`.

#### Scenario: Skill is invocable
- **WHEN** el usuario ejecuta `/story-refine`
- **THEN** el sistema MUST cargar y ejecutar `.claude/skills/story-refine/SKILL.md`

### Requirement: story-refine orchestrates the three existing story skills in sequence
El skill `story-refine` SHALL orquestar el flujo interactivo usando los skills existentes sin modificarlos, en la secuencia `story-creation` -> `story-evaluation` -> `story-split`.

#### Scenario: Initial story creation follows sequence start
- **WHEN** inicia una nueva historia en `story-refine`
- **THEN** el orquestador MUST ejecutar primero la logica de `story-creation` antes de cualquier evaluacion o division

#### Scenario: Evaluation and split happen after creation
- **WHEN** una historia fue creada o actualizada en una iteracion
- **THEN** el orquestador MUST ejecutar `story-evaluation` y luego `story-split` en ese orden

#### Scenario: Existing skills remain unchanged
- **WHEN** se implementa `story-refine`
- **THEN** el sistema MUST NOT modificar archivos ni comportamiento interno de `story-creation`, `story-evaluation` o `story-split`

### Requirement: story files maintain explicit state transitions
Cada historia en refinamiento SHALL mantener el encabezado `**Estado**: Doing | Ready` y el orquestador SHALL gestionar la transicion segun resultado y decisiones del usuario.

#### Scenario: Story remains Doing during active refinement
- **WHEN** una historia aun no cumple criterios de cierre
- **THEN** su archivo markdown MUST mantenerse con `**Estado**: Doing`

#### Scenario: Story becomes Ready when FINVEST is approved
- **WHEN** `story-evaluation` retorna decision `APROBADA`
- **THEN** el orquestador MUST actualizar el archivo de la historia a `**Estado**: Ready`

#### Scenario: User decides to pause refinement
- **WHEN** la decision FINVEST es `REFINAR` o `RECHAZAR` y el usuario elige pausar
- **THEN** el orquestador MUST permitir finalizar la sesion dejando la historia en `**Estado**: Doing`

### Requirement: story-refine tracks and processes derived stories
El orquestador SHALL mantener registro de cuantas historias existen en el flujo, cuales son derivadas por split y cuales siguen pendientes de refinamiento.

#### Scenario: Split creates derived stories
- **WHEN** `story-split` divide una historia en multiples historias hijas
- **THEN** el orquestador MUST registrar cada historia derivada y agregarla al conjunto de historias pendientes

#### Scenario: Derived stories continue full cycle
- **WHEN** existen historias derivadas pendientes
- **THEN** el orquestador MUST continuar aplicando para cada una la secuencia `creation/evaluation/split` hasta cierre o pausa explicita

#### Scenario: Flow summary is available to user
- **WHEN** cambia el backlog de historias por una division o cierre
- **THEN** el orquestador MUST informar al usuario el total de historias y su estado (`Doing`/`Ready`)

### Requirement: non-approved stories require explicit iteration decision
Para evitar bucles infinitos, el orquestador SHALL pedir decision explicita del usuario en cada ciclo no aprobado (`REFINAR` o `RECHAZAR`) para continuar iterando o terminar.

#### Scenario: Continue iterating after non-approved score
- **WHEN** FINVEST retorna `REFINAR` o `RECHAZAR` y el usuario elige continuar
- **THEN** el orquestador MUST iniciar una nueva iteracion de refinamiento sobre esa historia

#### Scenario: Stop iterating after non-approved score
- **WHEN** FINVEST retorna `REFINAR` o `RECHAZAR` y el usuario elige no continuar
- **THEN** el orquestador MUST cerrar el ciclo actual sin forzar iteraciones adicionales

### Requirement: story-refine uses Product Owner agent for elicitation and improvement
El skill `story-refine` SHALL invocar el agente `.claude/agents/story-product-owner.agent.md` para indagar contexto, analizar problemas, proponer mejoras de redaccion y enriquecer historias cuando sea necesario.

#### Scenario: Product Owner supports questioning and analysis
- **WHEN** falten detalles de negocio, valor, alcance o criterios de aceptacion
- **THEN** el orquestador MUST delegar al agente `story-product-owner` para conducir preguntas y analisis con el usuario

#### Scenario: Product Owner proposes writing improvements
- **WHEN** una historia necesita mayor claridad o mejor redaccion para subir su calidad
- **THEN** el agente `story-product-owner` MUST proponer ajustes concretos antes de la siguiente evaluacion

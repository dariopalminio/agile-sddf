# AI-Driven Development Lifecycle (AI-DLC)

## Propósito

Esta guía presenta AI-DLC y una aproximación práctica de dos niveles de flujo de trabajo.

## ¿Qué es AI-DLC?

AI-DLC es un enfoque de desarrollo en el que la inteligencia artificial participa en la elaboración
de planes, requisitos, diseño, implementación y validación, con supervisión humana. La IA propone,
plantea preguntas y ejecuta el trabajo acordado; las personas aportan el contexto, revisan la
evidencia y toman las decisiones relevantes de negocio y técnicas.

En la descripción introductoria de AWS, el ciclo comprende tres fases:

1. **Inception:** entender la intención de negocio, aclarar dudas y elaborar requisitos, historias
   y unidades de trabajo.
2. **Construction:** diseñar, implementar y probar el trabajo con el contexto validado.
3. **Operations:** utilizar el contexto acumulado para apoyar el despliegue y la operación,
   manteniendo la supervisión del equipo.

El contexto y las decisiones se conservan en artefactos accesibles para las personas y los agentes.
Los detalles concretos del flujo y sus aprobaciones dependen de la implementación adoptada.
[Fuente: AWS, 2025](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/).

## Mapeo conceptual: Agile tradicional y AI-DLC

| Nivel de abstracción | Agile / Scrum tradicional | Analogía en AI-DLC | Función en el ciclo |
|---|---|---|---|
| Estratégico / negocio | Iniciativa o meta | **Business Intent** | Expresar el problema, el resultado buscado y el contexto necesario para orientar la elaboración del trabajo. |
| Bloque modular de entrega | Épica | **Unit of Work** | Agrupar una parte de la solución que pueda implementarse y validarse con un alcance identificable. |
| Requerimiento granular | Historia de usuario o elemento de trabajo | **Historia de usuario con criterios de aceptación** | Precisar el comportamiento o resultado esperado y servir de base para ejemplos y pruebas verificables. |
| Cadencia de trabajo | Sprint | **Bolt** | Organizar un ciclo corto de construcción y validación de trabajo seleccionado. |

AWS presenta las Units como el equivalente metodológico de las épicas y los Bolts como ciclos
más cortos que los sprints. La relación entre **Intent** e iniciativa es una analogía útil, no
una equivalencia obligatoria: un Intent puede ser más acotado que una iniciativa tradicional.
Una historia expresa una necesidad desde la perspectiva de un usuario; no todo elemento de trabajo técnico tiene que adoptar ese formato.

La jerarquía conceptual «iniciativa → épica → historia» es una convención frecuente de organización, no una estructura exigida por Scrum. La [Guía Scrum](https://scrumguides.org/scrum-guide.html) define
los Sprints y el Product Backlog, pero no exige iniciativas, épicas ni historias de usuario.
[Atlassian](https://www.atlassian.com/agile/project-management/epics-stories-themes) describe
esa jerarquía como una forma habitual de agrupar trabajo.

## El matiz de tamaño: Intent, Unit y Bolt

- **Intent:** explica el porqué, el resultado esperado, los límites y el contexto de una necesidad.
  Su tamaño depende del problema; no necesariamente equivale a una iniciativa de varios equipos.
- **Unit of Work:** es una porción vertical, autónoma, identificable e implementable de la solución, con límites y
  criterios de validación. Puede depender de otras Units: «autónoma» no implica ausencia de
  dependencias ni un servicio o repositorio independiente.
- **Historia y criterios de aceptación:** detallan una necesidad verificable. Una Unit puede
  relacionarse o contener varias historias u otros requisitos; no se exige una relación uno a uno.
- **Bolt:** es una agrupación temporal de trabajo, no otro nivel de la jerarquía de requisitos.
  Puede abarcar una o varias Units relacionadas; no se debe asumir que cada Unit exige exactamente
  un Bolt. La implementación de AWS Labs describe esta distinción en su
  [glosario](https://github.com/awslabs/aidlc-workflows/blob/8839e5b733b7fd7afe53e0c2bf18d5e0a202c171/docs/guide/glossary.md).

Los Bolts se plantean en horas o pocos días, pero esa duración es una guía, no una garantía de
entrega. Un Sprint de Scrum tiene duración fija de **un mes o menos**; dos a cuatro semanas son
frecuentes, no un requisito universal. El tamaño efectivo del trabajo debe ajustarse al riesgo,
las dependencias y la capacidad de validarlo, no solo al tiempo disponible.

## Del Intent a la entrega

```text
Business Intent
  └─ Requisitos y criterios de éxito
       ├─ Unit de trabajo A → historias o requisitos → validaciones
       └─ Unit de trabajo B → historias o requisitos → validaciones

Bolts: organizan la construcción y validación de una o varias Units,
respetando sus dependencias y los puntos de revisión acordados.
```

La descomposición es una propuesta que el equipo revisa, no una jerarquía rígida. La IA puede
ayudar a redactar historias y proponer pruebas, pero los criterios de aceptación no producen por
sí solos pruebas automatizadas ni garantizan que el código sea correcto.

### Contenido por nivel

| Elemento | Pregunta principal | Contenido recomendado |
|---|---|---|
| Intent | ¿Qué problema queremos resolver y para qué? | Problema, resultado esperado, usuarios afectados, contexto, restricciones, exclusiones y condiciones verificables de cierre. |
| Unit (slice) | ¿Qué parte del resultado construiremos? | Alcance, dependencias, decisiones técnicas relevantes, requisitos asociados y condiciones de terminación propias. |
| Historia, requisito o feature | ¿Qué debe poder hacer el usuario o qué condición debe cumplirse? | Necesidad, alcance, escenarios y criterios de aceptación observables. |
| Bolt | ¿Qué trabajo abordaremos y validaremos en este ciclo? | Units seleccionadas, objetivo, dependencias, validaciones y revisión del resultado. |

El **resultado esperado** (*outcome*) es el beneficio buscado; la **solución** (*output*) es lo que
se entrega. Las condiciones **Done when** indican qué evidencia permite cerrar el trabajo. Una
iniciativa puede estar entregada antes de que su impacto de negocio sea medible.

## Implementación práctica: dos niveles de workflow

Aunque el trabajo pueda descomponerse en **Intent → Units → historias o tareas**, no es necesario
gestionar los tres niveles como flujos independientes en un tablero. Una opción operativa es
coordinar dos flujos: uno para el objetivo completo o Intent y otro para cada Unit. Las historias y tareas
se conservan como contenido trazable de la especificación y el plan de la Unit. Es decir que una Unit puede contener historias de usuario, requerimientos, escenarios y criterios de aceptación asociados.

Esta organización es una **propuesta de adopción**, no una regla universal de AI-DLC. El equipo
puede usar workitems adicionales cuando la coordinación, la auditoría o el seguimiento independiente
lo justifiquen.

### Flujo 1: Intent — macro-workflow

El Intent representa el objetivo de negocio completo y puede gestionarse como elemento padre,
por ejemplo una iniciativa o *feature* en una herramienta de seguimiento.

```text
Inception → Units Plan → Construction (Units) → Operations 
```

1. **Inception:** el equipo y la IA analizan contexto, problema a resolver, idean solición, alcance y restricciones; aclaran preguntas y
   elaboran los requisitos y criterios de éxito.
2. **Planificación de Units:** la IA propone una división (vertical slicing), sus dependencias y un orden de trabajo.
   El equipo la revisa y aprueba antes de iniciar la construcción.
3. **Construction:** el Intent permanece en progreso mientras se implementan y validan sus Units.
   Pueden ejecutarse en secuencia o en paralelo cuando sus dependencias y límites de edición lo
   permitan; los Bolts organizan ciclos de trabajo sobre una o varias Units.
4. **Operations:** según el alcance, se verifica el despliegue integrado, la observabilidad y la
   retroalimentación. El cierre requiere la evidencia acordada para el Intent.

Los artefactos pueden incluir `intent.md`, `requirements.md` con los requisitos y el catálogo
general de historias, y `units-plan.md`; un PRFAQ puede acompañar la elaboración cuando aporte
valor. Son nombres ilustrativos, no archivos obligatorios ni una afirmación de que ya existan en
este repositorio.

### Flujo 2: Unit / Spec — micro-workflow

Cada Unit es el elemento operativo del cambio (change); su especificación delimita el alcance y sirve de referencia
para la implementación del cambio y la validación del cambio. Este flujo puede ejecutarse dentro de un Bolt, pero
**Unit y Bolt no son sinónimos**: un Bolt puede agrupar varias Units relacionadas.

```text
Specify → Plan → Tasks → Implement → Verify → Deliver  (Checkpoint & Integration)
```

1. **Specify:** elaborar o completar la especificación funcional y los contratos, datos, políticas
   e invariantes técnicos que sean pertinentes.
2. **Plan:** identificar cambios previstos, dependencias, límites de edición y estrategia de pruebas.
3. **Tasks:** planificar las tareas
   con asistencia de IA, según las prácticas del equipo.
4. **Implement:** ejecutar las tareas acordadas y crear o actualizar código y pruebas
   con asistencia de IA, según las prácticas del equipo.
5. **Verify:** ejecutar las comprobaciones aplicables, como compilación, pruebas automatizadas y
   análisis de seguridad, y registrar resultados y limitaciones.
6. **Deliver (Checkpoint & Integration):** las personas responsables revisan la evidencia y aprueban o
   solicitan cambios antes de integrar. La revisión puede ser colaborativa y sincrónica; la forma
   concreta depende del equipo. El despliegue requiere su propia autorización cuando corresponda.

La Unit puede apoyarse en `spec.md` o `design.md` y en un `plan.md`.
Son ejemplos de artefactos: la estructura efectiva debe seguir las convenciones del proyecto y/o herramienta de SDD AI Harness usada (OpenSpec, Speckit, etc.).

### Historias y tareas sin un tercer workflow

Como opción predeterminada, las historias con sus criterios de aceptación pueden mantenerse en
la especificación de la Unit y las tareas en su plan o checklist. Así el agente y el equipo pueden
seguir cada requisito hasta su implementación y evidencia, sin mover necesariamente cada elemento
por otro tablero.

Si una historia necesita responsables, plazos, contexto pequeño o auditoría propios, puede representar un Unit independiente y tener
un ticket o workitem independiente sin cambiar el modelo conceptual. Lo mismo podrìa suceder con un Bug independiente, que requiera seguimiento específico.

No hay un número obligatorio de historias por Unit ni una duración garantizada de ejecución.
Que una Unit pequeña pueda completarse en horas no elimina la necesidad de revisar dependencias,
errores, seguridad e integración.

### Sincronización y resumen operativo

| Nivel | Elemento de seguimiento | Estados orientativos | Frecuencia o duración orientativa |
|---|---|---|---|
| Macro | Intent o iniciativa o epic | `Inception` → `Units Plan` → `Construction` → `Operations` → `Done` | Días o semanas, según alcance. |
| Micro | Unit y su especificación o units pequeñas (Story, Bug) | `Specify` → `Plan` → `Implement` → `Verify` → `Deliver (Checkpoint & Integration)` → `Done` | Horas o pocos días para trabajo acotado, sin garantía. |
| Contenido interno | Historias y tareas vinculadas a la Unit | Criterios y checklist con su evidencia; ticket separado si es necesario. | Seguimiento continuo durante la ejecución. |

El Intent solo avanza hacia su cierre cuando las Units requeridas están integradas y se cumplen
sus criterios globales, incluidas las comprobaciones operativas aplicables. Una Unit bloqueada o
una validación fallida permanece visible y no se considera completada; sus hallazgos pueden
actualizar el plan del Intent. Registrar para cada Unit sus dependencias, estado, historias y
evidencia de validación mantiene la trazabilidad entre ambos flujos.

## Colaboración, evidencia y controles

- **El equipo decide:** la IA puede recomendar alternativas; las personas responsables validan
  alcance, políticas, riesgos y decisiones relevantes.
- **El contexto es trazable:** conservar referencias a la fuente vigente y distinguir hechos
  observados, hipótesis y decisiones aprobadas.
- **La validación es explícita:** acordar criterios de aceptación, pruebas apropiadas y evidencia
  de integración. Una prueba unitaria simulada no demuestra por sí sola un flujo real completo.
- **Las obligaciones operativas siguen vigentes:** seguridad, tratamiento de datos, permisos,
  documentación y preparación para operar se revisan según el alcance. La velocidad no sustituye
  estos controles.
- **El trabajo se adapta:** volver a elaborar el alcance cuando aparezcan incertidumbres o
  dependencias, en lugar de forzar una duración o una descomposición predeterminada.

## Fuentes

- [AWS: AI-Driven Development Life Cycle](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/),
  introducción a las fases, colaboración y terminología.
- [AWS Labs: glosario de AI-DLC Workflows](https://github.com/awslabs/aidlc-workflows/blob/8839e5b733b7fd7afe53e0c2bf18d5e0a202c171/docs/guide/glossary.md),
  referencia de una implementación concreta y su distinción entre Unit y Bolt.
- [Guía Scrum 2020](https://scrumguides.org/scrum-guide.html), marco y duración del Sprint.
- [Atlassian: épicas, historias e iniciativas](https://www.atlassian.com/agile/project-management/epics-stories-themes),
  ejemplo de organización habitual del trabajo.

  
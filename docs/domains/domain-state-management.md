---
type: domain
slug: domain-state-management
title: "Documentación del Dominio: Gestión de Estados (State Management)"
---

# Documentación del Dominio: Gestión de Estados (State Management)

> **Bounded Context:** State Management  
> **Nivel:** Transversal — aplica a Story y Epic; la documentación fundacional solo usa `substatus` sin pipeline.  
> **Fuente canónica de transiciones:** [[state-machine]]  
> **Workflow narrativo:** [[specs-and-workflows]]  
> **Dominios específicos:** [[domain-story-lifecycle]], [[domain-epic-lifecycle]], [[domain-foundational-docs-lifecycle]]

---

## 1. Visión General

* **Nombre del dominio:** Gestión de Estados y Transiciones (State Management)
* **Objetivo del sistema:** Proveer el modelo conceptual, las reglas y los invariantes que gobiernan el ciclo de vida de los work items Epic y Story.
* **Principales actores:**
  * **PO / PM** — Define el estado de especificación y aceptación.
  * **Equipo de desarrollo** — Ejecuta transiciones de planificación, implementación y verificación.
  * **Agentes IA** — Ejecutan skills que leen y escriben el estado en el frontmatter.
  * **CI/CD** — Dispara transiciones terminales y valida gates.
  * **Sistema SDDF** — Coordina el pipeline y aplica reglas de WIP y gates humanos.
* **Bounded Contexts que extienden este dominio:**
  * **Story Lifecycle** — Ciclo de vida de una historia de usuario (L1).
  * **Epic Lifecycle** — Ciclo de vida de un entregable/release (L2).
  * **Foundational Docs Lifecycle** — ciclo de visión, requisitos y roadmap; no es un work item.

> **Alcance de este documento:** conceptos, modelo táctico e invariantes transversales. Los pipelines específicos, los estados concretos, las máquinas de estado y las tablas de transiciones por skill viven en los dominios de cada nivel.

---

## 2. Lenguaje Ubicuo (Glosario)

* **WorkItem:** Unidad de trabajo `spec` gestionada por el framework (`epic` o `story`). Tiene identidad única (`STORY-001`, `EPIC-001`).
* **Status:** Etapa del pipeline. Representa una **acción** que el equipo debe realizar (nombrado con verbos en infinitivo: `SPECIFY`, `IMPLEMENT`, `VERIFY`).
* **Substatus:** Nivel de avance dentro de un status. Conjunto cerrado: `TODO`, `IN-PROGRESS`, `DONE`, `BLOCKED`.
* **Transición:** Cambio válido de un `status` a otro, gobernado por un skill, un gate humano o CI/CD.
* **Gate:** Punto de control (humano o automático) que valida una condición antes de permitir una transición.
* **WIP Limit:** Límite de work items con `substatus: IN-PROGRESS` por nivel (constitución §9). No se aplica a ninguna cola.
* **Rework:** Retorno a la etapa de ejecución tras un rechazo en revisión, verificación o aceptación: en Story, `IMPLEMENT/TODO`.
* **Pipeline:** Secuencia ordenada de estados que un work item recorre. La secuencia concreta depende del nivel.
* **Artefacto:** Documento Markdown que materializa el trabajo de un estado (`story.md`, `design.md`, `epic.md`).
* **Frontmatter:** Bloque YAML al inicio de cada artefacto con `status` y `substatus`.

---

## 3. Modelo Táctico

### Entidades vs. Objetos de Valor

| Elemento | Tipo (Entidad/VO) | ¿Por qué? (Identidad/Inmutabilidad) |
| :--- | :--- | :--- |
| `WorkItem` | Entidad | Tiene identidad única (`STORY-001`) que lo rastrea a lo largo de su ciclo de vida. Su estado cambia con el tiempo. |
| `Skill` | Entidad | Tiene identidad por nombre (`story-specify`) y ejecuta acciones que modifican el estado del work item. |
| `Artifact` | Entidad | Tiene identidad por ruta (`story.md`, `design.md`) y persiste el estado del work item. |
| `Status` | Objeto de Valor | Inmutable. Se identifica por su nombre. El conjunto de valores válidos depende del nivel. |
| `Substatus` | Objeto de Valor | Inmutable. Conjunto cerrado: `TODO`, `IN-PROGRESS`, `DONE`, `BLOCKED`. |
| `Transition` | Objeto de Valor | Inmutable. Se define por origen, destino y condición. |
| `WipLimit` | Objeto de Valor | Inmutable. Se define por nivel de work item y aplica solo a `IN-PROGRESS`. |
| `Gate` | Objeto de Valor | Inmutable. Se define por condición y actor responsable. |
| `Frontmatter` | Objeto de Valor | Inmutable por transacción. Se reemplaza completamente en cada actualización. |


### Agregados y Aggregate Root (AR)

* **Agregado Principal:** `WorkItem` (AR)
* **Contenido interno:**
  * `Status` (VO)
  * `Substatus` (VO)
  * `Artifacts` (Entidades) — documentos asociados
  * `Gates` (VO) — condiciones de avance
  * `WipLimit` (VO) — aplicable solo a `substatus: IN-PROGRESS`

---

## 4. Invariantes Transversales

Aplican a **todo `WorkItem`**, independientemente de su nivel:

1. Todo `WorkItem` debe tener **exactamente un `status`** y **exactamente un `substatus`** en todo momento.
2. Los `substatus` válidos son: `TODO`, `IN-PROGRESS`, `DONE`, `BLOCKED`. `TODO` significa «pendiente de iniciar» en cualquier estado activo, no solo en el primero.
3. `BLOCKED` **no retrocede** el status: el work item permanece en su status actual mientras espera resolución.
4. Las transiciones deben seguir la máquina de estados canónica definida para el nivel correspondiente.
5. El **WIP limit** de cada nivel limita solo los work items en `IN-PROGRESS` (constitución §9); ninguna cola tiene WIP.
6. `SHIP` de épica la escribe `epic-ship` solo tras **confirmación humana explícita** de que el humano completó los pasos de liberación manuales (commit, tag, merge y despliegue); ningún skill ejecuta esos pasos. `COMPLETED` de épica la escribe `epic-complete` desde `SHIP/DONE`, solo con **confirmación humana explícita**, y archiva la épica en `changes/archive/<YYYY-MM-DD>-EPIC-NNN-<slug>/`; `epic-complete` además archiva sin cambiar el status las épicas que ya están en `COMPLETED/DONE` o `CANCELED/DONE`, siempre con confirmación humana (ADR-0019). `DELIVER` de story la escribe `story-delivery` y `COMPLETED` de story la escribe `story-complete` desde `DELIVER/DONE`, ambas siempre con **confirmación humana explícita**; `story-complete` además archiva sin cambiar el status las historias que ya están en `COMPLETED/DONE`, y archiva sin cambiar el status las historias `CANCELED/DONE`, siempre con confirmación humana (ADR-0017).
7. Un `WorkItem` en estado terminal pasivo no puede retroceder sin una acción explícita de reapertura.
8. Los nombres de `status` usan **verbos en infinitivo** (ADR-0003) para reflejar acción, no concepto estático.
9. El conjunto de `status` válidos es **específico por nivel** y se define en el dominio de cada nivel.

> **Nota:** los estados terminales y pipelines concretos se definen en [[domain-story-lifecycle]] y [[domain-epic-lifecycle]]. La documentación estratégica se describe en [[domain-foundational-docs-lifecycle]].

---

## Fases compartidas entre niveles

| Fase | Story | Epic |
|------|-------|------|
| DEFINITION | SPECIFY | DEFINE |
| PLANNING | PLAN | PLAN |
| EXECUTION | IMPLEMENT | DEVELOP |
| QUALITY | CODE-REVIEW → VERIFY → ACCEPTANCE | VALIDATE (+ gates opcionales) |
| RELEASE | DELIVER | SHIP |
| CLOSURE | COMPLETED | COMPLETED |

Los nombres difieren porque los conceptos difieren, pero la estructura es la misma. Las herramientas pueden operar por `phase_type` para uniformidad. No hay fase de cola: la cola de listos es una consulta (§5.5).

---

## 5. Tipos de Transición (patrones transversales)

Independientemente del nivel, existen cuatro tipos de transición:

### 5.1 Transiciones automáticas (por skill)

* Se ejecutan cuando la precondición de estado se cumple.
* El skill actualiza el frontmatter del artefacto con el nuevo `status` y `substatus`.
* Si el skill falla, **no avanza** el estado: el work item permanece donde estaba.

### 5.2 Transiciones manuales (por humano o CI/CD)

* Aplican a estados terminales (según el nivel: `DELIVER`, `SHIP`, `COMPLETED`).
* Requieren acción explícita: merge a `main`, publicación del artefacto, cierre administrativo.
* Una transición terminal escrita por un skill solo ocurre tras confirmación humana explícita: es el caso de `DELIVER` de story, que escribe `story-delivery` después de verificar el DoD de entrega, y de `COMPLETED` de story, que escribe `story-complete` desde `DELIVER/DONE` antes de archivar la historia en `changes/archive/`. Si el humano no confirma, el work item no cambia.

### 5.3 Transiciones de retroceso (rework)

* Ocurren cuando una revisión, verificación o aceptación rechaza el trabajo.
* El work item regresa a su etapa de ejecución: una historia, a `IMPLEMENT/TODO` desde cualquiera de los tres gates (`story-code-review`, `story-verify`, `story-acceptance`); una épica, a `DEVELOP` con un veredicto distinto de `APPROVED` de `epic-validate`.
* No existe estado ni substatus de rework.
* El motivo del rechazo se documenta en el reporte del gate (`code-review-report.md`, `verify-report.md`, `acceptance-report.md`), y el gate escribe `fix-directives.md` con `based-on` igual a su reporte.
* El skill de implementación detecta el rework solo por la existencia de `fix-directives.md` en el directorio de la historia, no por el estado ni por un substatus (ADR-0022, [[workflows-sin-estados-buffer]]).

### 5.4 Transiciones con `BLOCKED`

* `BLOCKED` no cambia el `status`; solo el `substatus`.
* El work item permanece en su status actual mientras espera resolución.
* Al resolverse, vuelve al `substatus` previo (`TODO` o `IN-PROGRESS`).

### 5.5 Flujo de la cola de listos (consulta, no estado)

* Las historias listas para implementar se obtienen con la consulta: **primero `IMPLEMENT/TODO`, después `PLAN/DONE`**.
* La cola de listos es una consulta, no un estado, un gate ni un límite WIP.
* `TODO` significa «pendiente de iniciar» en cualquier estado activo: `IMPLEMENT/TODO` es una historia pendiente de iniciar en `IMPLEMENT` (un rework si existe `fix-directives.md`) y `PLAN/DONE` es una planificación aprobada que nadie empezó a implementar.
* Fuente: ADR-0022, [[workflows-sin-estados-buffer]].

---

## 6. Categorías de Gate (transversales)

| Categoría | Descripción | Ejemplos |
|-----------|-------------|----------|
| **Gate de calidad automático** | Validación ejecutada por CI/CD (compilación, tests, linters). | CI en el PR, CI post-merge. |
| **Gate de revisión humana** | Validación de un artefacto por una persona (diseño, seguridad, estándares). | Revisión por pares, aceptación del PO. |
| **Gate de formato** | Validación estructural de un artefacto contra un template o esquema. | `epic-format-validation`. |
| **Gate de capacidad (WIP)** | Control del número máximo de work items en `IN-PROGRESS` por nivel. | Constitución §9. |
| **Gate de aceptación de negocio** | Confirmación de que el valor de negocio se cumple. | Aceptación del PO en `ACCEPTANCE`. |

> Los gates concretos y sus condiciones específicas se definen en el dominio de cada nivel.

---

## 7. Trazabilidad y Persistencia

* **Frontmatter YAML** en cada artefacto (`story.md`, `epic.md`) con `status` y `substatus`.
* **Convención de guion:** usar ASCII U+002D `-` (ver nota en [[state-machine]] sobre normalización de guiones no-ASCII).
* **Reapertura:** un `WorkItem` en estado terminal pasivo solo puede reabrirse con acción explícita y registro del motivo.
* **Idempotencia:** ejecutar un skill dos veces sobre el mismo estado no debe producir transiciones duplicadas.

---

## 8. Fuentes de Verdad

* **Esquema canónico de frontmatter:** `header-aggregation/SKILL.md`
* **Máquina de estados completa:** [[state-machine]]
* **Workflow narrativo:** [[specs-and-workflows]]
* **Principios aplicables:** [[constitution]] (patrones 8, 14; reglas 9 y 15)
* **Decisión de arquitectura:** [[workflows-sin-estados-buffer]] (ADR-0022) — fuente de los workflows y las transiciones de story y epic; [[workflow-canonico-story-y-epic]] (ADR-0003) — rationale de los nombres de `status` en infinitivo

---

## 9. Referencias Cruzadas

* [[state-machine]] — Máquina de estados del framework SDDF (fuente canónica)
* [[specs-and-workflows]] — Specs y workflows narrativos
* [[domain-story-lifecycle]] — Ciclo de vida de Story (L1)
* [[domain-epic-lifecycle]] — Ciclo de vida de Epic (L2)
* [[domain-foundational-docs-lifecycle]] — Ciclo de vida de la documentación fundacional
* [[constitution]] — Constitución del proyecto
* [[workflow-canonico-story-y-epic]] — Workflow canónico de story y epic (nombres en infinitivo)
* [[workflows-sin-estados-buffer]] — ADR-0022: workflows de story y epic, rework en `IMPLEMENT/TODO` y cola de listos como consulta

---

Esta versión es **puramente transversal**: define conceptos, modelo táctico, invariantes, tipos de transición, categorías de gate y trazabilidad, sin entrar en pipelines ni estados concretos de ningún nivel. Los detalles de cada nivel viven en sus respectivos documentos `domain-<nivel>-lifecycle.md`.


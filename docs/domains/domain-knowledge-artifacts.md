# Documentación del Dominio: Artefactos de Conocimiento (Knowledge Artifacts)

> **Bounded Context:** Knowledge Artifacts  
> **Alcance:** Modelo transversal de los artefactos de conocimiento del proyecto  
> **Dominio relacionado:** [[domain-work-item-hierarchy]]  
> **Dominio relacionado:** [[domain-state-management]]  
> **Decisión de arquitectura:** [[ADR-0004]] — documentación en capas

---

## 1. Visión General

* **Nombre del dominio:** Artefactos de Conocimiento (Knowledge Artifacts)
* **Objetivo del sistema:** Definir de forma canónica los tipos de artefactos de conocimiento que viven en el repositorio —requisitos, decisiones, propuestas, especificaciones, dominios, guardrails, políticas, guías—, sus capas de organización, sus relaciones de trazabilidad y sus invariantes, para que humanos y agentes IA puedan escribir, leer y mantener documentación viva sin duplicación ni ambigüedad.
* **Principales actores:**
  * **PO / PM** — Redacta requisitos y valida su cobertura.
  * **Equipo** — Redacta ADRs, RFCs y guías operativas.
  * **Arquitecto** — Mantiene el modelo de dominio y las decisiones arquitectónicas.
  * **Agentes IA** — Leen y escriben artefactos siguiendo las convenciones del dominio.
  * **Sistema SDDF** — Valida invariantes, trazabilidad y coherencia entre capas.
* **Bounded Contexts relacionados:**
  * **Work Item Hierarchy** — Los specs (Project, Epic, Story) son un tipo de artefacto.
  * **State Management** — Los artefactos tienen estados y subestados, y son gobernados por transiciones.
* **Alcance de este documento:** el modelo de artefactos de conocimiento: tipos, capas, relaciones, invariantes y convenciones. **No** describe ciclos de vida ni transiciones (eso vive en [[domain-state-management]]).

---

## 2. Lenguaje Ubicuo (Glosario)

* **Artifact:** Unidad de conocimiento persistida en el repositorio con identidad única, tipo, capa y frontmatter.
* **ArtifactId:** Identificador único global del artefacto (`FR-001`, `ADR-0003`, `STORY-042`).
* **ArtifactType:** Tipo del artefacto. Conjunto cerrado: `requirement`, `adr`, `rfc`, `spec`, `domain`, `guardrail`, `policy`, `guide`, `how-to`, `runbook`, `knowledge`.
* **Layer:** Capa de organización del artefacto dentro de `docs/`. Conjunto cerrado: `domains`, `requirements`, `adr`, `rfcs`, `specs`, `guardrails`, `policies`, `guides`, `how-to`, `runbooks`, `knowledge`.
* **Requirement:** Artefacto que describe qué debe hacer el sistema. Puede ser funcional (`FR-`) o no funcional (`NFR-`).
* **ADR (Architecture Decision Record):** Artefacto inmutable que registra una decisión arquitectónica con su contexto, alternativas y consecuencias.
* **RFC (Request for Comments):** Artefacto que propone un cambio grande que atraviesa múltiples áreas, con un período de revisión.
* **Spec:** Artefacto de especificación de un work item (Project, Epic, Story). Ver [[domain-work-item-hierarchy]].
* **Domain document:** Artefacto DDD que modela un bounded context del proyecto.
* **Guardrail:** Artefacto que define **restricciones operativas o técnicas verificables** que un agente IA (o un humano) no debe violar. Se expresa como checklist con niveles de severidad (`error`, `warn`) y se comprueba mediante comandos deterministas (grep, git ls-files, linters). Es **ejecutable** y su incumplimiento **bloquea**.
* **Policy:** Artefacto que define **reglas de gobernanza** del proyecto (convenciones, estándares, principios). Puede ser declarativo y no siempre verificable automáticamente. Su incumplimiento puede requerir juicio humano.
* **Guide:** Artefacto que explica cómo hacer algo de forma didáctica (tutorial, guía).
* **How-to:** Artefacto que describe un procedimiento paso a paso para una tarea concreta.
* **Runbook:** Artefacto operativo que describe procedimientos de despliegue, recuperación o incidentes.
* **TraceLink:** Relación tipada entre dos artefactos. Conjunto cerrado: `parent`, `related`, `verified-by`, `implements`, `traces-to`, `supersedes`, `superseded-by`, `originates-from`, `enforced-by`, `applied-by`, `modeled-by`.
* **Frontmatter:** Bloque YAML obligatorio al inicio de cada artefacto.

---

## 3. Modelo Táctico

### Entidades vs. Objetos de Valor

| Elemento | Tipo (Entidad/VO) | ¿Por qué? (Identidad/Inmutabilidad) |
| :--- | :--- | :--- |
| `Artifact` | Entidad | Tiene identidad única (`ArtifactId`) que lo rastrea a lo largo de su vida. Su contenido cambia (excepto ADR y RFC, que son inmutables). |
| `ArtifactId` | Objeto de Valor | Inmutable. Se define por prefijo + número (`FR-001`, `ADR-0003`). Único globalmente. |
| `ArtifactType` | Objeto de Valor | Inmutable. Conjunto cerrado de tipos. |
| `Layer` | Objeto de Valor | Inmutable. Conjunto cerrado de capas. |
| `Frontmatter` | Objeto de Valor | Inmutable por transacción. Se reemplaza completamente al actualizar. |
| `TraceLink` | Objeto de Valor | Inmutable. Se define por origen, destino y tipo de relación. |
| `ArtifactStatus` | Objeto de Valor | Inmutable. Conjunto cerrado: `draft`, `active`, `deprecated`, `superseded`, `archived`. |
| `Enforcement` | Objeto de Valor | Inmutable. Aplica solo a `Guardrail`. Conjunto cerrado: `error`, `warn`. |
| `PolicyScope` | Objeto de Valor | Inmutable. Aplica solo a `Policy`. Conjunto cerrado: `project`, `team`, `repository`, `agent`. |

### Agregado y Aggregate Root (AR)

* **Agregado Principal:** `Artifact` (AR)
* **Contenido interno:**
  * `ArtifactId` (VO)
  * `ArtifactType` (VO)
  * `Layer` (VO)
  * `Frontmatter` (VO)
  * `TraceLinks` (VO) — colección de relaciones tipadas
  * `ArtifactStatus` (VO)
  * `Enforcement` (VO) — solo si `ArtifactType = Guardrail`
  * `PolicyScope` (VO) — solo si `ArtifactType = Policy`
* **Relación con otros agregados:**
  * Un `Artifact` puede referenciar a otros `Artifact` mediante `TraceLink`.
  * Un `Artifact` de tipo `spec` es también un `WorkItem` (ver [[domain-work-item-hierarchy]]).

---

## 4. Tipos de Artefacto

| Tipo | Prefijo | Capa | ¿Inmutable? | Propósito |
|------|---------|------|-------------|-----------|
| **Requirement** | `FR-`, `NFR-` | `requirements/` | ❌ Evoluciona | Qué debe hacer el sistema. |
| **ADR** | `ADR-` | `adr/` | ✅ Inmutable | Decisión arquitectónica con rationale. |
| **RFC** | `RFC-` | `rfcs/` | ✅ Inmutable tras aprobación | Propuesta de cambio grande. |
| **Spec (Project)** | `PROJ-` | `specs/01-projects/` | ❌ Evoluciona | Documentación fundacional del proyecto. |
| **Spec (Epic)** | `EPIC-` | `specs/02-epics/` | ❌ Evoluciona | Entregable o release. |
| **Spec (Story)** | `STORY-` | `specs/03-stories/` | ❌ Evoluciona | Historia de usuario atómica. |
| **Domain** | `DOMAIN-` (implícito) | `domains/` | ❌ Evoluciona (lento) | Modelo DDD de un bounded context. |
| **Guardrail** | `GR-` (opcional) | `guardrails/` | ❌ Evoluciona | Restricción operativa verificable que bloquea el avance. |
| **Policy** | `POLICY-` (opcional) | `policies/` | ❌ Evoluciona (lento) | Regla de gobernanza del proyecto. |
| **Guide** | — | `guides/` | ❌ Evoluciona | Documento didáctico. |
| **How-to** | — | `how-to/` | ❌ Evoluciona | Procedimiento paso a paso. |
| **Runbook** | — | `runbooks/` | ❌ Evoluciona | Procedimiento operativo. |
| **Knowledge** | — | `knowledge/` | ❌ Evoluciona | Conocimiento general (glosarios, referencias). |

---

## 5. Capas de Documentación

```
docs/
├── domains/          # Modelo DDD (estable)
├── requirements/     # Catálogo de requisitos (vivo)
│   ├── functional/
│   └── non-functional/
├── adr/              # Decisiones arquitectónicas (inmutables)
├── rfcs/             # Propuestas de cambio grandes
├── specs/            # Work items (Project, Epic, Story)
│   ├── 01-projects/
│   ├── 02-epics/
│   └── 03-stories/
├── guardrails/       # Restricciones operativas verificables
├── policies/         # Reglas de gobernanza
├── guides/           # Guías didácticas
├── how-to/           # Procedimientos paso a paso
├── runbooks/         # Procedimientos operativos
└── knowledge/        # Conocimiento general
```

### Rol de cada capa

| Capa | Responde a | Frecuencia de cambio | Fuente de verdad |
|------|-----------|----------------------|-------------------|
| **domains/** | ¿Cuál es el modelo del negocio? | Muy baja | Invariantes y entidades |
| **requirements/** | ¿Qué debe hacer el sistema? | Media | Requisitos con ID estable |
| **adr/** | ¿Por qué se tomó esta decisión? | Baja (inmutable) | Decisiones arquitectónicas |
| **rfcs/** | ¿Cómo se propone un cambio grande? | Baja | Propuestas de cambio |
| **specs/** | ¿Qué estamos construyendo? | Alta | Work items |
| **guardrails/** | ¿Qué restricciones operativas deben cumplirse siempre? | Baja | Restricciones verificables |
| **policies/** | ¿Qué reglas de gobernanza rigen el proyecto? | Baja | Reglas del proyecto |
| **guides/** | ¿Cómo se hace algo? | Media | Guías didácticas |
| **how-to/** | ¿Cómo se ejecuta un procedimiento? | Media | Procedimientos |
| **runbooks/** | ¿Cómo se opera el sistema? | Baja | Procedimientos operativos |
| **knowledge/** | ¿Qué conocimiento general existe? | Media | Referencias, glosarios |

---

## 6. Guardrail vs Policy

Aunque ambos son artefactos normativos, cumplen funciones distintas:

| Aspecto | Guardrail | Policy |
|---------|-----------|--------|
| **Naturaleza** | Restricción operativa/técnica | Regla de gobernanza |
| **Formato** | Checklist con severidades (`error`, `warn`) | Documento declarativo (principios, convenciones) |
| **Verificación** | Determinista (grep, git ls-files, linters, scripts) | Humana o semiautomática |
| **Consecuencia de incumplimiento** | Bloquea (si `error`) o advierte (si `warn`) | Requiere juicio; puede escalarse |
| **Audiencia primaria** | Agentes IA y CI | Humanos y equipos |
| **Ejemplo** | "No usar `shell=True` en scripts Python" | "Todas las APIs deben versionarse" |
| **Ubicación** | `docs/guardrails/` | `docs/policies/` |
| **Frecuencia de cambio** | Baja (cambian cuando cambia el harness) | Baja (cambian cuando cambia la gobernanza) |
| **Prefijo de ID** | `GR-` (opcional) | `POLICY-` (opcional) |

### Relación entre guardrail y policy

* Una **policy** puede generar uno o más **guardrails** que la hagan verificable.
* Un **guardrail** puede referenciar la **policy** que lo origina (`originates-from`).
* Una **policy** puede declarar qué guardrails la hacen cumplir (`enforced-by`).
* La verificación de un guardrail puede ser requisito de una policy.

### Ejemplo de relación

```yaml
# docs/guardrails/security-checklist.md
---
type: guardrail
id: GR-SEC-001
title: "Security checklist for repository content"
originates-from: POLICY-SEC
enforcement: error
---
```

```yaml
# docs/policies/security-policy.md
---
type: policy
id: POLICY-SEC
title: "Security Policy"
scope: repository
status: active
enforced-by:
  - GR-SEC-001
---
```

---

## 7. Relaciones entre Artefactos (TraceLinks)

| Relación | Significado | Ejemplo |
|----------|-------------|---------|
| `parent` | Artefacto superior en una jerarquía. | `STORY-042` → `parent: EPIC-003` |
| `related` | Artefacto relacionado sin jerarquía. | `FR-001` → `related: [FR-002, NFR-001]` |
| `verified-by` | Un requisito es verificado por una historia. | `FR-001` → `verified-by: [STORY-042]` |
| `implements` | Una historia implementa un requisito. | `STORY-042` → `implements: [FR-001]` |
| `traces-to` | Trazabilidad genérica entre artefactos. | `STORY-042` → `traces-to: [ADR-0003]` |
| `supersedes` | Un artefacto reemplaza a otro. | `ADR-0005` → `supersedes: ADR-0003` |
| `superseded-by` | Un artefacto fue reemplazado. | `ADR-0003` → `superseded-by: ADR-0005` |
| `originates-from` | Un guardrail deriva de una policy. | `GR-SEC-001` → `originates-from: POLICY-SEC` |
| `enforced-by` | Una policy es verificada por un guardrail. | `POLICY-SEC` → `enforced-by: GR-SEC-001` |
| `applied-by` | Una decisión es aplicada por historias. | `ADR-0003` → `applied-by: [STORY-042]` |
| `modeled-by` | Un dominio es modelado por requisitos. | `domain-state-management` → `modeled-by: [FR-001]` |

---

## 8. Invariantes

### 8.1 Invariantes de identidad y tipo

1. Todo `Artifact` tiene **exactamente un `ArtifactId`** único globalmente.
2. Todo `Artifact` tiene **exactamente un `ArtifactType`** del conjunto cerrado.
3. Todo `Artifact` pertenece a **exactamente una `Layer`**.
4. El prefijo del `ArtifactId` corresponde al tipo y la capa (ej. `FR-` → `requirement` en `requirements/`).

### 8.2 Invariantes de estructura

5. Todo `Artifact` tiene **frontmatter YAML** con campos obligatorios: `type`, `id`, `title`, `date`, `status`.
6. Todo `Artifact` tiene **exactamente un archivo `.md`** como cuerpo principal.
7. Los artefactos de tipo `requirement` viven en `requirements/functional/` o `requirements/non-functional/`.
8. Los artefactos de tipo `spec` viven en `specs/01-projects/`, `specs/02-epics/` o `specs/03-stories/` según su nivel.
9. Los artefactos de tipo `guardrail` viven en `guardrails/` y usan checklist con severidades.
10. Los artefactos de tipo `policy` viven en `policies/` y declaran un `scope`.

### 8.3 Invariantes de trazabilidad

11. Todo `Requirement` debe tener **al menos un `verified-by`** que apunte a una `Story` existente.
12. Toda `Story` debe tener **al menos un `implements`** que apunte a un `Requirement` existente.
13. Las relaciones `parent` son **obligatorias** para `Epic` y `Story`, y **prohibidas** para `Project`.
14. Las relaciones `supersedes` y `superseded-by` son **bidireccionales**: si A supersede a B, B debe declarar superseded-by A.
15. Las relaciones `originates-from` y `enforced-by` son **bidireccionales**: si un guardrail origina de una policy, la policy debe listar el guardrail en `enforced-by`.

### 8.4 Invariantes de duplicación

16. **Sin duplicación entre capas:** una regla de negocio vive en `domains/` o en `requirements/`, no en ambos. Si está en ambos, uno debe referenciar al otro.
17. **Sin duplicación entre Gherkin y casos de uso:** el Gherkin en `story.md` es el caso de uso ejecutable. No se mantienen ambos.
18. **Sin duplicación entre ADR y dominio:** una decisión arquitectónica vive en `adr/`; el modelo que la refleja vive en `domains/`. Se enlazan con `traces-to`.
19. **Sin duplicación entre guardrail y policy:** una restricción verificable vive en `guardrails/`; la regla que la origina vive en `policies/`. Se enlazan con `originates-from` y `enforced-by`.

### 8.5 Invariantes de inmutabilidad

20. Los `ADR` son **inmutables** una vez aceptados. Si cambia la decisión, se crea un nuevo ADR que `supersedes` al anterior.
21. Los `RFC` son **inmutables** tras su aprobación. Si cambia la propuesta, se crea un nuevo RFC.
22. Los `Spec` (Project, Epic, Story) **evolucionan** con el proyecto.
23. Los `Guardrail` y `Policy` **evolucionan** lentamente con el harness del proyecto.

### 8.6 Invariantes de estado

24. Todo `Artifact` tiene un `status` del conjunto cerrado: `draft`, `active`, `deprecated`, `superseded`, `archived`.
25. Un artefacto en `superseded` debe tener un `superseded-by` que apunte al artefacto que lo reemplaza.
26. Un artefacto en `archived` no puede ser referenciado por artefactos activos (salvo por relaciones `supersedes` o `superseded-by`).

### 8.7 Invariantes específicas de guardrails

27. Todo `Guardrail` declara un `enforcement` del conjunto cerrado: `error`, `warn`.
28. Todo `Guardrail` declara los comandos o scripts que lo verifican.
29. Un `Guardrail` con `enforcement: error` debe poder ejecutarse de forma determinista (sin juicio humano).
30. Todo `Guardrail` debe estar referenciado por al menos una `Policy` (`originates-from`) o declarar explícitamente que no tiene policy asociada.
31. Un `Guardrail` no puede contradecir una `Policy`. Si lo hace, el conflicto debe resolverse antes de activar el guardrail.
32. Un `Guardrail` con `enforcement: error` debe fallar el pipeline de CI si se incumple.

### 8.8 Invariantes específicas de policies

33. Toda `Policy` declara su ámbito (`scope`): `project`, `team`, `repository`, `agent`.
34. Toda `Policy` declara su estado: `draft`, `active`, `deprecated`.
35. Una `Policy` activa debe estar referenciada por al menos un `Guardrail` o justificar por qué no es verificable automáticamente.

---

## 9. Convenciones

### 9.1 Nomenclatura de archivos

* **Formato:** `<PREFIJO>-<NNN>-<slug-kebab-case>.md` o `<slug-kebab-case>.md` para artefactos sin ID numérico.
* **Ejemplos:**
  * `FR-001-captura-intencion.md`
  * `ADR-0003-workflow-canonico.md`
  * `RFC-001-wiki-docs.md`
  * `domain-work-item-hierarchy.md`
  * `security-checklist.md` (guardrail)
  * `security-policy.md` (policy)
  * `how-to-write-requirements.md`

### 9.2 Frontmatter obligatorio

```yaml
---
type: <artifact-type>
id: <artifact-id>
title: "<título legible>"
date: YYYY-MM-DD
status: draft | active | deprecated | superseded | archived
related:
  - <artifact-id>
---
```

### 9.3 Frontmatter específico para guardrails

```yaml
---
type: guardrail
id: GR-SEC-001
title: "Security checklist for repository content"
date: YYYY-MM-DD
status: active
enforcement: error | warn
originates-from: POLICY-SEC
---
```

### 9.4 Frontmatter específico para policies

```yaml
---
type: policy
id: POLICY-SEC
title: "Security Policy"
date: YYYY-MM-DD
status: active
scope: project | team | repository | agent
enforced-by:
  - GR-SEC-001
---
```

### 9.5 Wikilinks

* **Sintaxis:** `[[artifact-id]]` o `[[artifact-id|texto visible]]`.
* **Resolución:** el sistema busca el `artifact-id` en el índice central o en la capa correspondiente.

### 9.6 Convención de guion

* Usar ASCII U+002D `-`. No usar guiones no-ASCII (U+2011, U+2013, etc.).

---

## 10. Trazabilidad Cruzada

### 10.1 De requisito a historia

Un `Requirement` declara sus historias verificadoras:

```yaml
verified-by:
  - STORY-042
  - STORY-051
```

### 10.2 De historia a requisito

Una `Story` declara los requisitos que implementa:

```yaml
implements:
  - FR-001
  - NFR-002
```

### 10.3 De decisión a implementación

Un `ADR` declara las historias que lo aplican:

```yaml
applied-by:
  - STORY-042
  - EPIC-003
```

### 10.4 De dominio a requisitos

Un `Domain` document declara los requisitos que modela:

```yaml
modeled-by:
  - FR-001
  - FR-002
```

### 10.5 De policy a guardrail

Una `Policy` declara los guardrails que la verifican:

```yaml
enforced-by:
  - GR-SEC-001
  - GR-SEC-002
```

### 10.6 De guardrail a policy

Un `Guardrail` declara la policy que lo origina:

```yaml
originates-from: POLICY-SEC
```

### 10.7 Navegación bidireccional

Toda relación debe poder navegarse en ambas direcciones:

* Si `FR-001` tiene `verified-by: STORY-042`, entonces `STORY-042` debe tener `implements: FR-001`.
* Si `ADR-0005` tiene `supersedes: ADR-0003`, entonces `ADR-0003` debe tener `superseded-by: ADR-0005`.
* Si `GR-SEC-001` tiene `originates-from: POLICY-SEC`, entonces `POLICY-SEC` debe tener `enforced-by: GR-SEC-001`.

---

## 11. Fuentes de Verdad

* **Esquema canónico de frontmatter:** `header-aggregation/SKILL.md`
* **Jerarquía de work items:** [[domain-work-item-hierarchy]]
* **Modelo de estados:** [[domain-state-management]]
* **Máquina de estados completa:** [[state-machine]]
* **Workflow narrativo:** [[specs-and-workflows]]
* **Guardrails:** `docs/guardrails/README.md` — convenciones de checklists y severidades
* **Policies:** `docs/policies/constitution.md` — principios y reglas del proyecto
* **Decisión de arquitectura:** [[ADR-0004]] — documentación en capas

---

## 12. Referencias Cruzadas

* [[domain-work-item-hierarchy]] — Estructura de work items (Project, Epic, Story)
* [[domain-state-management]] — Modelo transversal de estados y transiciones
* [[domain-project-lifecycle]] — Ciclo de vida del nivel L3
* [[domain-epic-lifecycle]] — Ciclo de vida del nivel L2
* [[domain-story-lifecycle]] — Ciclo de vida del nivel L1
* [[constitution]] — Constitución del proyecto (policy raíz)
* [[security-checklist]] — Ejemplo de guardrail (GR-SEC-001)
* [[ADR-0004]] — Documentación en capas


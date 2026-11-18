---
type: adr
id: ADR-0014
slug: skills-independientes
title: "Independencia de skills y agentes: sin dependencia de skills hacia `agents/`"
status: ACCEPTED
date: 2026-10-14
supersedes: null
superseded-by: null
---


# ADR-0014: Independencia de skills y agentes: sin dependencia de skills hacia `agents/`

> **Fe de erratas (2026-10-15):** excepción explícita a la regla de inmutabilidad, aprobada por el PO. La decisión (Reglas 1–3) no cambia. Se corrigieron el título y `supersedes` del frontmatter, que estaban copiados de ADR-0013, y dos premisas falsas del contexto: `project-ux` no delega en otro subagente (la sesión de `project-discovery` lo invoca directamente) y `project-flow` ya compone `/project-begin`, `/project-discovery` y `/project-planning` sin agentes propios. También se retiró una consecuencia ajena a la decisión (la limpieza de `story-code-review/SKILL.md`).

## Contexto y problema

El framework SDDF mantiene una carpeta global `agents/` con subagentes que son invocados desde skills de `skills/`. Un análisis de trazabilidad `agents/` → `skills/` reveló dos problemas estructurales (1 y 3) y dos restricciones que la migración debe preservar (2 y 4):

1. **Baja cohesión en agentes compartidos.** `project-pm` contiene dos agentes en un archivo (una sección "Begin Intention" y otra "Discovery" que no se solapan). `project-architect` repite el patrón (Discovery y Planning). El agente elige qué parte aplicar según el skill que lo llama. Lo realmente compartido son ~10–30 líneas de "Principios" por agente. Duplicarlas cuesta menos que mantener el acoplamiento.

2. **Un solo nivel de delegación (ADR-0002).** Hoy la sesión de `project-discovery` invoca `project-pm`, `project-ux` y `project-architect` en secuencia, en un solo nivel. La migración no debe introducir delegación entre subagentes: ADR-0002 prohíbe que un subagente delegue en otro subagente.

3. **Acoplamiento oculto entre skills y `agents/`.** Varios skills no pueden ejecutarse sin que exista la carpeta `agents/` y sus archivos. Esto reduce la capacidad autónoma de los skills y rompe el principio de independencia de skills.

4. **Orquestadores que componen skills.** `project-flow` ya compone `/project-begin`, `/project-discovery` y `/project-planning` sin agentes propios. Este patrón debe mantenerse: un orquestador que copia los pasos y agentes de sus workers genera copias que derivan de los originales.

Origen: propuesta de mejora 008 derivada del análisis de trazabilidad `agents/` → `skills/` y de los hallazgos colaterales 1–6.

## Decisión

La decisión se articula en tres reglas, en este orden de prioridad:

### Regla 1 — Los skills deben ser independientes de `agents/`

Ningún skill puede requerir la existencia de la carpeta `agents/` para ejecutarse. Las precondiciones de un skill se expresan en términos de **archivos y estado**, no en términos de **haber invocado otro skill ni de depender de archivos globales**.

Los roles y subagentes que un skill necesita viven dentro de su propio directorio, en `skills/<skill>/assets/agents/<rol>.md`, y se distinguen por tipo:

| Tipo | Qué hace | Cómo se invoca |
|------|----------|----------------|
| **Entrevistador** | Hace preguntas al usuario, conduce una conversación | La **sesión del skill** lee el archivo de rol y sigue sus instrucciones |
| **Analizador** | Trabaja aislado, escribe en `.tmp/`, devuelve el control | El skill lo invoca como subagente aislado |

**Agentes entrevistadores** que migran a archivos de rol dentro de sus skills: `project-pm` (partido en `begin-intent` y `discovery-pm`), `project-architect` (partido en `discovery-architect` y `planning`), `project-ux` (como `discovery-ux`), `project-story-mapper`, `story-product-owner`.

**Agentes analizadores** que migran a subagentes locales de sus skills: los cinco `reverse-engineer-*` (`architect`, `product-discovery`, `business-analyst`, `ux-flow-mapper`, `synthesizer`).

### Regla 2 — No se prohíbe la existencia de `agents/`

El framework puede funcionar con soporte de la carpeta `agents/`. No se elimina por decreto. Si un agente vive en `agents/`, debe cumplir dos condiciones:

- **Ser realmente independiente**: útil por sí solo, sin depender de que otro agente o skill lo invoque.
- **Ser útil por sí solo**: un humano o un agente puede invocarlo directamente (por ejemplo, `@reverse-engineer-architect`) y obtener valor sin ejecutar ningún skill.

Un agente en `agents/` es una **utilidad global de primera clase**, no un componente interno de un skill. Si un agente solo tiene sentido cuando lo invoca un skill concreto, **no pertenece a `agents/`**: pertenece al `assets/agents/` de ese skill.

### Regla 3 — skill orquestador invoca skills, no copia agentes

Un skill orquestador (por ejemplo, `project-flow`) no tiene agentes propios: invoca directamente los skills workers (por ejemplo `project-begin`, `project-discovery` y `project-planning`). Cada uno lleva sus propios roles locales.

## Principio: Independencia de skills

Este ADR adopta como criterio explícito de diseño del framework:

> Un skill es independiente si puede ejecutarse **sin que ningún otro skill haya corrido antes en la misma sesión**, y sus precondiciones se expresan en términos de **archivos y estado**, no en términos de **haber invocado otro skill ni de depender de `agents/`**.

Tres consecuencias verificables:

1. **Precondiciones basadas en artefactos.** Un skill declara "`story.md` debe existir", no "debe haberse ejecutado `story-specify` antes". Esto permite invocarlo directamente sobre un repositorio con los artefactos ya presentes.

2. **Verificable de forma estática.** Un skill es independiente si su `SKILL.md` no contiene referencias a `agents/` ni a otros skills fuera de la sección "Dependencias" (que documenta relaciones, no acoplamiento de ejecución).

3. **Verificable de forma dinámica.** Un skill es independiente si se ejecuta con éxito contra un fixture sin que la carpeta `agents/` exista y sin que ningún otro skill haya corrido antes.

La independencia de skills es lo que hace posible la **portabilidad multi-runtime** y la **capacidad autónoma** que persigue este ADR. Un skill que depende de que otro skill haya corrido previamente no puede ejecutarse en un runtime que no soporte orquestación, y no puede copiarse a otro proyecto sin arrastrar la cadena de dependencias.

La migración de agentes globales a agentes locales refuerza este principio porque elimina una causa de acoplamiento entre skills: hoy, dos skills que invocan al mismo agente global están acoplados a través de ese archivo externo. Con agentes locales, cada skill lleva sus propios roles y subagentes, y ninguno depende de archivos fuera de su directorio.

## Rationale

1. **Interoperabilidad multi-runtime.** Sin dependencia de `agents/`, el framework funciona en cualquier runtime que soporte invocación de skills y lectura de archivos: Claude Code, Codex, Copilot, runtimes locales. El objetivo declarado del framework es ser agnóstico al cliente IA.

2. **Capacidad autónoma de los skills.** Un skill que lleva sus roles y subagentes en su propio `assets/` es autónomo: se puede copiar, distribuir e invocar sin necesidad de archivos externos. Es una aplicación concreta del principio de independencia.

3. **Cohesión y separación de responsabilidades.** Partir `project-pm` y `project-architect` en roles especializados elimina la ambigüedad de "¿qué parte del agente se aplica aquí?". Cada rol local tiene una sola responsabilidad.

4. **Un solo nivel de delegación (ADR-0002).** Los entrevistadores se ejecutan en la sesión del skill y los analizadores locales no invocan a otros subagentes, así que ningún subagente delega en otro.

5. **DRY sin deriva.** Un orquestador compone los skills workers, como ya hace `project-flow`, en lugar de copiar sus pasos o agentes: hay una sola fuente de verdad por fase.

6. **Agentes globales como ciudadanos de primera clase.** No prohibir `agents/` permite que el framework ofrezca utilidades reutilizables que cualquier sesión puede invocar directamente (`@reverse-engineer-architect`), sin convertirlas en dependencias ocultas de skills.

7. **Independencia verificable.** El principio se verifica de forma estática (`grep`) y dinámica (fixtures). La decisión es auditable, no una aspiración.

Además, la decisión respeta los principios de la constitución:

- **KISS**: menos acoplamiento, menos archivos compartidos.
- **Repositorio-como-sistema**: cada skill lleva lo que necesita.
- **Agnóstico al harness**: no depende de capacidades específicas de un runtime.

## Alternativas consideradas

- **Mantener `agents/` como dependencia de skills:** descartada porque perpetúa el acoplamiento oculto y la baja cohesión. Impide que el framework sea realmente multi-runtime.

- **Prohibir por completo la carpeta `agents/`:** descartada porque elimina la posibilidad de ofrecer utilidades globales legítimas que un humano o agente quiera invocar directamente. La decisión correcta es regularlas, no prohibirlas.

- **Convertir todos los agentes en subagentes locales:** descartada porque los entrevistadores pueden no poder preguntar al usuario desde un subagente, y Codex puede no tener subagentes. La distinción entrevistador/analizador es necesaria.

- **Convertir todos los agentes en archivos de rol leídos por la sesión:** descartada porque los analizadores se benefician del aislamiento de contexto (escriben en `.tmp/`, devuelven el control).

- **Permitir que un orquestador copie los pasos y agentes de sus workers:** descartada porque genera una copia por orquestador de cada agente, que deriva de los skills originales.

- **Duplicar los agentes compartidos en cada skill sin partir `pm`/`architect`:** descartada porque cada skill cargaría la parte que no le corresponde. Partirlos por responsabilidad es más limpio.

- **Independencia de skills + agentes globales regulados (decisión adoptada):** elegida por coherencia, DRY y alineación con el objetivo multi-runtime.

## Consecuencias

**Positivas:**

- El framework funciona en runtimes sin soporte de `agents/`.
- Cada skill es autocontenido: lleva sus roles y subagentes en `assets/agents/`.
- Ningún subagente delega en otro subagente (ADR-0002): es una restricción verificable de la migración.
- Los orquestadores componen skills en lugar de copiar sus pasos o agentes, como ya hace `project-flow`.
- `project-pm` y `project-architect` se parten en roles especializados.
- Los agentes globales que sobrevivan en `agents/` son utilidades legítimas, invocables directamente.
- La independencia de skills se vuelve verificable y auditable.

**Negativas / trade-offs:**

- **Migración incremental:** una historia por skill afectado, de menor a mayor riesgo (EPIC-24), y el retiro de `agents/` al final.
- **Renombrado de roles:** `project-pm (Begin)` → `begin-intent`, `project-pm (Discovery)` → `discovery-pm`, `project-architect (Discovery)` → `discovery-architect`, `project-ux` → `discovery-ux`, `project-architect (Planning)` → `planning`. Los tres roles de `project-discovery` llevan el sufijo de origen para no colisionar en `skills/project-discovery/assets/agents/`. Los skills que los invocan deben actualizarse.
- **Cambio de mecanismo para entrevistadores:** pasan de subagentes a archivos de rol leídos por la sesión.
- **Entrevistadores como archivos de rol:** `project-story-mapper` y `story-product-owner` se migran como archivos de rol porque no está garantizado que un subagente genérico pueda preguntar al usuario.
- **Documentación a actualizar:** `docs/architecture/sddf-architecture.md`, `docs/domains/domain-knowledge-artifacts.md`, `README.md`, `CHANGELOG.md`.
- **Breaking change:** la reorganización de roles y la posible eliminación de agentes globales debe introducirse en una versión major con guía de migración.
- **`evals/evals.json`** de los skills afectados deben actualizarse.
- **Verificación de independencia requiere inversión:** crear `scripts/verify-skill-independence.js` y fixtures por skill.

**Aclaración sobre `agents/`:**

Este ADR **no prohíbe la existencia de `agents/`**. Un agente en `agents/` es legítimo si:
- Puede invocarse directamente por un humano o agente (ej. `@reverse-engineer-architect`).
- Aporta valor sin depender de un skill específico.
- Su documentación declara explícitamente que es una utilidad global.

Un agente que solo tiene sentido cuando un skill concreto lo invoca **no pertenece a `agents/`**: pertenece al `assets/agents/` de ese skill. La regla es: **utilidad global → `agents/`; dependencia interna de un skill → `skills/<skill>/assets/agents/`**.

## Referencias

- [[ADR-0002]] — Modelo de un solo nivel de delegación (skill → subagente, sin subagente → subagente)



---
type: adr
id: ADR-0014
slug: skills-independientes
title: "Eliminar `specs/01-projects/` y migrar su contenido a `product/` y `requirements/`"
status: ACCEPTED
date: 2026-10-05
supersedes: ADR-0004
superseded-by: null
---


# ADR-0014: Independencia de skills y agentes: sin dependencia de skills hacia `agents/`

## Contexto y problema

El framework SDDF mantiene una carpeta global `agents/` con subagentes que son invocados desde skills de `skills/`. Un análisis de trazabilidad `agents/` → `skills/` reveló cuatro problemas estructurales:

1. **Baja cohesión en agentes compartidos.** `project-pm` contiene dos agentes en un archivo (una sección "Begin Intention" y otra "Discovery" que no se solapan). `project-architect` repite el patrón (Discovery y Planning). El agente elige qué parte aplicar según el skill que lo llama. Lo realmente compartido son ~10–30 líneas de "Principios" por agente. Duplicarlas cuesta menos que mantener el acoplamiento.

2. **Violación de ADR-0002.** Los skills `project-discovery` y `project-flow` instruyen a `project-pm`/`project-architect` a invocar `project-ux`, lo que constituye delegación entre subagentes. ADR-0002 prohíbe que un subagente delegue en otro subagente.

3. **Acoplamiento oculto entre skills y `agents/`.** Varios skills no pueden ejecutarse sin que exista la carpeta `agents/` y sus archivos. Esto reduce la capacidad autónoma de los skills y rompe el principio de independencia de skills.

4. **`project-flow` con agentes propios.** El skill `project-flow` copia los pasos y agentes de `project-begin`, `project-discovery` y `project-planning`, generando deriva entre las tres copias.

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

**Agentes entrevistadores** que migran a archivos de rol dentro de sus skills: `project-pm` (partido en `begin-intent` y `discovery`), `project-architect` (partido en `discovery` y `planning`), `project-ux`, `project-story-mapper`, `story-product-owner`.

**Agentes analizadores** que migran a subagentes locales de sus skills: los cinco `reverse-engineer-*` (`architect`, `product-discovery`, `business-analyst`, `ux-flow-mapper`, `synthesizer`).

### Regla 2 — No se prohíbe la existencia de `agents/`

El framework puede funcionar con soporte de la carpeta `agents/`. No se elimina por decreto. Si un agente vive en `agents/`, debe cumplir dos condiciones:

- **Ser realmente independiente**: útil por sí solo, sin depender de que otro agente o skill lo invoque.
- **Ser útil por sí solo**: un humano o un agente puede invocarlo directamente (por ejemplo, `@reverse-engineer-architect`) y obtener valor sin ejecutar ningún skill.

Un agente en `agents/` es una **utilidad global de primera clase**, no un componente interno de un skill. Si un agente solo tiene sentido cuando lo invoca un skill concreto, **no pertenece a `agents/`**: pertenece al `assets/agents/` de ese skill.

### Regla 3 — skill orquestador invoca skills, no copia agentes

Un skill orquestado (por ejemplo, `project-flow`) deja de tener agentes propios y pasa a invocar directamente los skills workers (por ejemplo `project-begin`, `project-discovery` y `project-planning`). Cada uno lleva sus propios roles locales.

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

4. **Resolución de la violación de ADR-0002.** Al convertir `project-ux` en rol local de `project-discovery`, se elimina la delegación entre subagentes. La sesión del skill lee el rol directamente.

5. **DRY y eliminación de deriva.** `project-flow` deja de replicar pasos y agentes. Al invocar los tres skills directamente, hay una sola fuente de verdad por fase.

6. **Agentes globales como ciudadanos de primera clase.** No prohibir `agents/` permite que el framework ofrezca utilidades reutilizables que cualquier sesión puede invocar directamente (`@reverse-engineer-architect`), sin convertirlas en dependencias ocultas de skills.

7. **Independencia verificable.** El principio se verifica de forma estática (`grep`) y dinámica (fixtures). La decisión es auditable, no una aspiración.

Además, la decisión respeta los principios de la constitución:

- **KISS**: menos acoplamiento, menos archivos compartidos.
- **Repositorio-como-sistema**: cada skill lleva lo que necesita.
- **Agnóstico al harness**: no depende de capacidades específicas de un runtime.

## Alternativas consideradas

- **Mantener `agents/` como dependencia de skills:** descartada porque perpetúa el acoplamiento oculto, la baja cohesión y la violación de ADR-0002. Impide que el framework sea realmente multi-runtime.

- **Prohibir por completo la carpeta `agents/`:** descartada porque elimina la posibilidad de ofrecer utilidades globales legítimas que un humano o agente quiera invocar directamente. La decisión correcta es regularlas, no prohibirlas.

- **Mantener `agents/` global pero eliminar la delegación entre subagentes:** descartada porque resuelve solo el punto 2 (violación de ADR-0002) y deja intactos los puntos 1, 3 y 4.

- **Convertir todos los agentes en subagentes locales:** descartada porque los entrevistadores pueden no poder preguntar al usuario desde un subagente, y Codex puede no tener subagentes. La distinción entrevistador/analizador es necesaria.

- **Convertir todos los agentes en archivos de rol leídos por la sesión:** descartada porque los analizadores se benefician del aislamiento de contexto (escriben en `.tmp/`, devuelven el control).

- **Mantener `project-flow` con agentes propios:** descartada porque genera tres copias de cada agente y deriva con los skills originales.

- **Duplicar los agentes compartidos en cada skill sin partir `pm`/`architect`:** descartada porque cada skill cargaría la parte que no le corresponde. Partirlos por responsabilidad es más limpio.

- **Independencia de skills + agentes globales regulados (decisión adoptada):** elegida por coherencia, DRY y alineación con el objetivo multi-runtime.

## Consecuencias

**Positivas:**

- El framework funciona en runtimes sin soporte de `agents/`.
- Cada skill es autocontenido: lleva sus roles y subagentes en `assets/agents/`.
- Se elimina la violación de ADR-0002 (`project-ux` deja de delegar entre subagentes).
- `project-flow` deja de replicar pasos y agentes.
- `project-pm` y `project-architect` se parten en roles especializados.
- Se elimina el análisis conversacional pegado en `story-code-review/SKILL.md:673-842`.
- Los agentes globales que sobrevivan en `agents/` son utilidades legítimas, invocables directamente.
- La independencia de skills se vuelve verificable y auditable.

**Negativas / trade-offs:**

- **Migración en fases:** seis fases con riesgos crecientes.
- **Renombrado de roles:** `project-pm (Begin)` → `begin-intent`, `project-pm (Discovery)` → `discovery`, `project-architect (Discovery)` → `discovery`, `project-architect (Planning)` → `planning`. Los skills que los invocan deben actualizarse.
- **Cambio de mecanismo para entrevistadores:** pasan de subagentes a archivos de rol leídos por la sesión.
- **Verificación pendiente:** `project-story-mapper` y `story-product-owner` requieren comprobar si un subagente genérico puede preguntar. Si no, se convierten en archivos de rol.
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



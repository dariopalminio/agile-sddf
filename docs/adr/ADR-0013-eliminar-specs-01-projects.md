---
type: adr
id: ADR-0013
slug: eliminar-specs-01-projects
title: "Eliminar `specs/01-projects/` y migrar su contenido a `product/` y `requirements/`"
status: PROPOSED
date: 2026-10-05
supersedes: null
superseded-by: null
---

# ADR-0013: Eliminar `specs/01-projects/` y migrar su contenido a `product/` y `requirements/`

## Contexto y problema

La estructura de memoria de SDDF define tres niveles en `docs/specs/`:

```
specs/
├── 01-projects/    # PROJ-NN/ → project-intent.md, project.md, project-plan.md
├── 02-epics/       # EPIC-NN/ → epic.md
└── 03-stories/     # STORY-NN/ → story.md + artefactos
```

El nivel `01-projects/` fue diseñado para representar el nivel estratégico de Flight Levels (L3). Sin embargo, su contenido solapa de forma casi total con las capas de documentación `product/` y `requirements/`:

| Archivo en `01-projects/` | Solapa con | Naturaleza del solapamiento |
|---------------------------|-----------|----------------------------|
| `project-intent.md` (intención, objetivo, visión) | `product/vision.md` | 🔴 Duplicación casi total |
| `project.md` (stakeholders, FR y NFR) | `product/stakeholders.md` + `requirements/functional/` + `requirements/non-functional/` | 🔴 Duplicación casi total |
| `project-plan.md` (plan alto nivel, epic slicing) | — | ✅ Sin solapamiento |

Además, `01-projects/` es el único nivel que **no se comporta como un work item**:

- No tiene `status`, solo `substatus` (a diferencia de Epic y Story).
- No tiene transiciones gobernadas por skills (a diferencia de Epic y Story).
- No tiene DoD de transición (a diferencia de Epic y Story).
- Es un contenedor de **documentación fundacional**, no un work item.

La consecuencia es una **doble fuente de verdad** con deriva garantizada: cuando `product/vision.md` cambie, alguien olvidará actualizar `project-intent.md`. Es exactamente el anti-patrón que el framework ya rechazó con `ADR-0001` (templates centralizados) y `ADR-0007` (templates como capa propia).

Origen: análisis de estructura de memoria del release "Skill Guardian" y discusión sobre Flight Levels.

## Decisión

Se **elimina `docs/specs/01-projects/`** y se migra su contenido a las capas de documentación existentes:

| Contenido actual | Nuevo hogar |
|------------------|-------------|
| `project-intent.md` | `docs/product/vision.md` (visión, objetivo, intención) |
| Parte de stakeholders de `project.md` | `docs/product/stakeholders.md` |
| FR y NFR de `project.md` | `docs/requirements/functional/FR-NNN-*.md` + `docs/requirements/non-functional/NFR-NNN-*.md` |
| `project-plan.md` (epic slicing) | `docs/product/roadmap.md` (nuevo archivo en la capa `product/`) |

La estructura resultante de specs/ queda con dos niveles sin prefijos numéricos:

```
specs/
├── epics/       # antes 02-epics/
└── stories/     # antes 03-stories/
```

Los prefijos 01-, 02-, 03- se eliminan. Existían solo para reflejar el orden L3 → L2 → L1 (Flight Levels). Sin 01-projects/, la numeración pierde su ancla y se convierte en ruido. Las demás capas de docs/ (domains/, adr/, guardrails/) no usan prefijos; specs/ ahora es consistente con ellas.

La jerarquía conceptual de Flight Levels se preserva:

```
Estratégico  →  product/ + requirements/    (documentación, no work item)
Coordinación →  specs/epics/             (work item)
Operativo    →  specs/stories/           (work item)
```

## Rationale

1. **DRY y fuente de verdad única.** Eliminar la duplicación entre `01-projects/` y `product/`+`requirements/` evita la deriva. Es el mismo principio que ya se aplicó en `ADR-0001` y `ADR-0007`: una sola copia activa, sin maquinaria de sincronización.

2. **Coherencia con la naturaleza de cada capa.** Las capas `product/` y `requirements/` ya documentan el nivel estratégico. Duplicarlas en `specs/01-projects/` es una redundancia que confunde a humanos y agentes: ¿dónde está la visión, en `product/vision.md` o en `project-intent.md`?

3. **Coherencia con el modelo de work items.** `specs/` debe contener **work items** (Epic, Story), no documentación fundacional. Un "project" no es un work item: no tiene transiciones, no tiene DoD, no tiene status. Sacarlo de `specs/` alinea el modelo con la realidad.

4. **Alineación con Flight Levels.** Flight Levels distingue tres **niveles de abstracción para el flujo de valor**, no exige que cada nivel sea un work item. El nivel estratégico puede representarse como documentación (`product/` + `requirements/`), mientras que Epic y Story son los dos niveles operativos de construcción. La jerarquía se preserva.

5. **Simplificación del scaffolding.** El skill `memory-system` ya no necesita crear `specs/01-projects/`. El skill `project-flow` ya no necesita gestionar los tres documentos fundacionales como work items. Se reduce complejidad.

6. **Compatibilidad con los tres modos SDD:**
   - **Intent-First:** la intención vive en `product/vision.md` (única fuente).
   - **Spec-Anchored:** las specs (Epic, Story) son el ancla; `product/` y `requirements/` son soporte.
   - **Spec-as-Source:** las specs son el artefacto principal; la estructura no cambia.

7. **Trazabilidad intacta.** La relación entre el nivel estratégico y el nivel de construcción se mantiene mediante:
   - Los Epics referencian requisitos de `requirements/` con `implements: [FR-NNN]`.
   - Las Stories referencian requisitos de `requirements/` con `implements: [FR-NNN]`.
   - El roadmap en `product/roadmap.md` lista los Epics planificados.

8. **Coherencia con el principio de "no crear capas vacías".** `specs/01-projects/` es una capa que en la práctica contiene tres archivos de documentación, no un work item. Es una capa disfrazada.

## Alternativas consideradas

- **Mantener `01-projects/` tal cual:** descartada porque perpetúa la doble fuente de verdad y la deriva entre `product/vision.md` y `project-intent.md`. El framework ya rechazó este patrón en `ADR-0001` y `ADR-0007`.

- **Renombrar `01-projects/` a `00-charter/`:** descartada porque solo cambia el nombre, no la naturaleza. El contenido sigue solapando con `product/` y `requirements/`. La ambigüedad persiste.

- **Fusionar `01-projects/` dentro de `product/`:** descartada porque `product/` es una capa de documentación, no un contenedor de work items. Meter `project-plan.md` (epic slicing) en `product/` como documento fundacional es lo correcto, pero no requiere mantener un directorio separado por "proyecto".

- **Mantener `01-projects/` pero eliminar `product/` y `requirements/`:** descartada porque las capas de documentación son transversales (aplican a todos los proyectos) mientras que `01-projects/` es por proyecto. Invertir la jerarquía rompería el modelo multi-proyecto.

- **Convertir `01-projects/` en un work item real (con status, transiciones, DoD):** descartada porque duplicaría el nivel de Epic. Un "project" con transiciones y gates sería indistinguible de una Epic. Flight Levels ya tiene su nivel estratégico cubierto por `product/` + `requirements/`.

- **Eliminar `01-projects/` y migrar su contenido (decisión adoptada):** elegida por coherencia, DRY y alineación con Flight Levels.

## Consecuencias

**Positivas:**
- Una sola fuente de verdad para visión, stakeholders y requisitos.
- Eliminación de la deriva entre `product/vision.md` y `project-intent.md`.
- Modelo de work items coherente: `specs/` contiene solo Epic y Story.
- Scaffolding más simple (`memory-system` crea 2 niveles en lugar de 3).
- Alineación explícita con Flight Levels sin forzar un work item por nivel.
- Menos tokens en la resolución de rutas de los skills (`SPECS_BASE/specs/01-projects/` desaparece).

**Negativas / trade-offs:**
- **Migración de contenido:** los repos existentes con `specs/01-projects/PROJ-NN/` necesitan migrar su contenido a `product/` y `requirements/`. El skill `memory-system migrate` debe implementar esta migración (optativo).
- **Renumeración de `specs/`:** si se decide renumerar `02-epics/` → `epics/` y `03-stories/` → `stories/`, los skills que referencian rutas absolutas deben actualizarse.
- **Pérdida de la noción de "proyecto" como entidad:** en un repo multi-proyecto, la estructura actual (`docs/specs/01-projects/PROJ-NN/`) permitía tener múltiples proyectos en un mismo `docs/`. Al eliminar `01-projects/`, un repo multi-proyecto necesita una estructura alternativa (por ejemplo, un `docs/` por proyecto). Este ADR asume el caso común: **single-project per `docs/` root** o mono repo o repositorio `host`. El caso multi-proyecto complejos se abordará en un ADR separado si surge la necesidad.
- **Actualización de skills:** `project-flow`, `project-pm`, `project-architect`, `project-ux`, `project-story-mapping`, `memory-system`, y cualquier skill que referencie `specs/01-projects/` deben actualizarse.
- **Actualización de documentación:** `docs/domains/domain-project-lifecycle.md` (si existe), `docs/architecture/memory-system.md`, `docs/architecture/sddf-architecture.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md` y `CHANGELOG.md`.
- **Breaking change:** la eliminación de `specs/01-projects/` es un breaking change. Debe introducirse en una versión major y documentarse en el CHANGELOG con guía de migración.

## Referencias

- [[memory-system]] — Estructura de capas y árbol canónico de la memoria
- [[domain-work-item-hierarchy]] — Relación Project → Epic → Story (a actualizar)
- [[domain-knowledge-artifacts]] — Modelo de artefactos y TraceLinks
- [[ADR-0001]] — Centralizar templates compartidos (precedente de DRY)
- [[ADR-0007]] — Templates como capa propia (precedente de capa única)
- [[ADR-0010]] — `specs/` dentro de `docs/` (decisión hermana sobre layout)
- [[ADR-0011]] — Archivos canónicos por tipo (decisión hermana sobre naming)
- [[constitution]] — Principios aplicables (KISS, DRY, repositorio-como-sistema)


## 🏁 Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Prefijos numéricos en `specs/`? | ❌ **No.** Eliminar `01-`, `02-`, `03-` |
| ¿Por qué? | Existían solo para reflejar Flight Levels. Sin `01-projects/`, no tienen ancla |
| ¿Estructura final de specs? | `specs/epics/` + `specs/stories/` |
| ¿Coherencia? | ✅ Con `docs/` (sin prefijos) |
| ¿Coste? | Medio: renombrar dos carpetas, actualizar referencias en skills y asegurar  que los skills que generan project-intent.md, project.md, project-plan.md reubiquen sus output folders|

Tu observación cierra el círculo del ADR. La eliminación de `01-projects/` no es solo quitar una carpeta: es **colapsar el sistema de tres niveles a dos**, y con ello eliminar todo lo que existía solo para sostener esa jerarquía (prefijos numéricos incluidos).


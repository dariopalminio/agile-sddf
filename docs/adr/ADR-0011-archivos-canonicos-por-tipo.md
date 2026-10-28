---
type: adr
id: ADR-0011
slug: archivos-canonicos-por-tipo
title: "Los archivos canónicos de work items se nombran por tipo (epic.md, story.md)"
status: ACCEPTED
date: 2026-09-22
supersedes: null
superseded-by: null
---

# ADR-0011: Los archivos canónicos de work items se nombran por tipo (epic.md, story.md)

## Contexto y problema

Los frameworks SDD de referencia nombran sus artefactos de forma distinta, y `spec.md` no es un estándar común:

| Herramienta | Archivo principal | Qué representa |
|-------------|-------------------|----------------|
| Spec Kit | `specs/NNN-feature/spec.md` (+ `plan.md`, `tasks.md`) | Una feature o cambio |
| OpenSpec | `openspec/specs/<capability>/spec.md` | La especificación **viva** de una capacidad: cómo se comporta hoy el sistema |
| OpenSpec | `openspec/changes/<id>/proposal.md` (+ `tasks.md`, deltas) | El cambio en curso |
| Kiro | `.kiro/specs/<feature>/requirements.md`, `design.md`, `tasks.md` | Una feature; no usa `spec.md` |
| BMAD | PRD, épicas y archivos `*.story.md` | Épicas e historias de usuario |

Solo Spec Kit usa `spec.md` para el equivalente de un work item de SDDF. En OpenSpec, `spec.md` describe el estado del
sistema, y el work item equivalente a una historia es `proposal.md`.

SDDF nombra el archivo principal de cada work item según su tipo. Desde
[ADR-0013](ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md) hay dos niveles de flujo, y desde
[ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) ambos viven como hermanos en `specs/flow/`. En
SDDF, la spec de una historia es el directorio completo (`story.md` + `design.md` + `tasks.md` + `testcases.md`), no un
archivo único, igual que en Kiro.

La pregunta que motiva este ADR es: **¿debería SDDF renombrar `epic.md` y `story.md` a `spec.md` para alinearse con
Spec Kit, o mantener su convención?**

Esta decisión se relaciona con:

- El modelo de work items descrito en [[domain-work-item-hierarchy]].
- El sistema de memoria y su indexación de otros harness, descritos en [[memory-system]].
- La raíz reservada `specs/living/` de [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md).

## Decisión

Los archivos canónicos de los work items SDDF se nombran **según su tipo**:

| Nivel | Archivo canónico | Directorio contenedor |
|-------|------------------|-----------------------|
| Épica | `epic.md` | `specs/flow/EPIC-NN-<slug>/` |
| Historia | `story.md` | `specs/flow/STORY-NNN-<slug>/` |

No se adopta `spec.md` como nombre de work item.

SDDF no crea alias, symlinks ni copias `spec.md` de los work items. Su relación con Spec Kit y OpenSpec es la que ya
ofrece `memory-system`: con los perfiles `speckit` y `openspec`, `index` indexa en modo solo lectura sus `spec.md`,
`plan.md` y `proposal.md`, y resuelve su slug desde el directorio contenedor igual que con `epic.md` y `story.md`.

## Rationale

1. **Auto-descriptivo para agentes IA.** Épica e historia tienen DoD, WIP-Limit y skills distintos. Un agente que
   recibe `specs/flow/STORY-042-x/story.md` sabe qué artefacto maneja y qué skills le aplican sin inferirlo desde la
   ruta.
2. **Diferenciación visual.** En `docs/index.md`, en un `git diff` o en un resultado de búsqueda, `epic.md` y
   `story.md` son inequívocos; N archivos `spec.md` obligan a leer la ruta para distinguirlos.
3. **Separación entre spec de cambio y spec de estado.** `specs/flow/` contiene specs de cambio (qué se va a construir)
   y `specs/living/` contendrá specs de estado (cómo se comporta el sistema). Usar `spec.md` en ambas raíces mezclaría
   dos semánticas bajo un mismo nombre; reservarlo para `specs/living/` las separa y coincide con OpenSpec.
4. **Identidad ágil del framework.** SDDF combina SDD con épicas e historias de usuario (INVEST, Gherkin, FINVEST). Los
   nombres de archivo expresan ese modelo, igual que hace BMAD.
5. **No existe un estándar que justifique el coste.** Renombrar obligaría a cambiar los skills `epic-*`, `story-*`,
   `memory-system` y `header-aggregation`, los templates, los scripts de verificación, las historias archivadas y los
   proyectos que ya usan SDDF, a cambio de alinearse con una sola herramienta.

La decisión respeta los principios de la [constitución](../constitution.md): KISS (el nombre coincide con el tipo) y repositorio como
sistema (el nombre de archivo forma parte del contrato con el agente).

## Alternativas consideradas

- **Renombrar a `spec.md` (convención de Spec Kit):** descartada. Pierde la auto-descripción y la diferenciación
  visual, ocupa el nombre que necesita `specs/living/` y exige un renombrado masivo para alinearse con una convención
  que no comparten OpenSpec, Kiro ni BMAD.
- **`spec-story.md` / `spec-epic.md` (híbrido):** descartada. Es redundante, ninguna herramienta lo espera y no aporta
  nada sobre `story.md`.
- **Alias `spec.md` mediante symlinks o copias generados por `memory-system`:** descartada. Los symlinks requieren
  privilegios en Windows y las copias físicas crean una segunda fuente de verdad que deriva. Ninguna herramienta de
  SDDF necesita el alias, y la coexistencia con Spec Kit y OpenSpec ya la resuelven los perfiles de `memory-system`.
- **Mantener `epic.md` / `story.md` y reservar `spec.md` para `specs/living/` (decisión adoptada).**

## Consecuencias

**Positivas:**

- Los agentes identifican el tipo de work item por el nombre del archivo.
- `docs/index.md`, los listados y los diffs son legibles sin leer rutas completas.
- La futura especificación viva tiene un nombre propio y alineado con OpenSpec.
- No hay coste de migración: la convención ya está implementada.

**Negativas / trade-offs:**

- Quien viene de Spec Kit esperará `spec.md` y deberá adaptarse. Se mitiga explicando la convención en la
  documentación de onboarding.
- Una herramienta externa que busque `spec.md` no encontrará los work items de SDDF sin configuración propia.
- Si un proyecto mantiene a la vez el layout de Spec Kit y el de SDDF, `specs/*/spec.md` y `specs/flow/*/story.md`
  conviven en la misma raíz `specs/`; `memory-system` los distingue por perfil.

## Referencias

- [ADR-0013](ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md) — Dos niveles de flujo: épicas e historias
- [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) — Layout fijo y raíz reservada `specs/living/`
- [[memory-system]] — Perfiles `speckit` y `openspec` e indexación de raíces externas
- [[domain-work-item-hierarchy]] — Modelo de work items
- [[domain-knowledge-artifacts]] — Modelo de artefactos y tipos
- [constitución](../constitution.md) — Principios aplicables

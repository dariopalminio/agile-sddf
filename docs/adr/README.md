---
type: wiki
slug: adr-index
title: "Índice de Architecture Decision Records (ADRs)"
date: 2026-06-12
parent: null
---

# 📐 Architecture Decision Records (ADRs)

> Registro de decisiones transversales de arquitectura y diseño del proyecto.
> Complementa los otros dos niveles de registro de decisiones del framework:
> decisiones de **historia** viven en el `design.md` de la historia (`docs/specs/stories/STORY-NNN-<slug>/design.md`),
> y decisiones de **cambio OpenSpec** en el `design.md` del change (`openspec/changes/`).

---

## ¿Cuándo escribir un ADR?

Escribe un ADR cuando la decisión:

- Afecta a **más de un skill o módulo** del framework
- **Restringe decisiones futuras** (establece un patrón, convención o contrato que otros deben seguir)
- Resuelve un trade-off arquitectónico con alternativas reales descartadas

Si la decisión afecta a una sola historia, regístrala en la sección `## Decisions` de su `design.md` — no crees un ADR.

---

## Convención

- **Nombre de archivo:** `ADR-NNNN-slug-kebab.md` (numeración secuencial de 4 dígitos)
- **Template:** [adr-template.md](adr-template.md) — copiarlo y completar todas las secciones
- **Inmutabilidad:** un ADR `ACCEPTED` no se edita. Si la decisión cambia, se crea un ADR nuevo que lo reemplaza; se actualizan `status` y `superseded-by` del antiguo y se añade una nota visible de reemplazo bajo su título (únicos cambios permitidos).
- **Estados:**

| Estado | Significado |
|--------|-------------|
| `PROPOSED` | En discusión, aún no vinculante |
| `ACCEPTED` | Vigente — los agentes y el equipo deben respetarla |
| `DEPRECATED` | Ya no aplica (el contexto desapareció), sin reemplazo |
| `SUPERSEDED` | Reemplazada por otro ADR (ver `superseded-by`) |

---

## Índice de ADRs

| ID | Título | Estado | Fecha |
|----|--------|--------|-------|
| [ADR-0001](ADR-0001-centralizar-templates-compartidos.md) | Centralizar templates compartidos en `$SPECS_BASE/specs/templates/` | SUPERSEDED → [ADR-0007](ADR-0007-templates-como-capa-propia.md) | 2026-06-12 |
| [ADR-0002](ADR-0002-invocacion-agentes-locales-de-skill.md) | Contrato de invocación de agentes locales de skill | ACCEPTED | 2026-06-12 |
| [ADR-0003](ADR-0003-workflow-canonico-story-y-epic.md) | Workflows canónicos de Story y Epic en el pipeline SDDF | SUPERSEDED → [ADR-0006](ADR-0006-migracion-retroactiva-de-estados-de-epica.md) | 2026-06-14 |
| [ADR-0004](ADR-0004-nivel-l2-epic-y-directorios-numerados.md) | El nivel L2 es una épica, y los niveles viven en directorios numerados | SUPERSEDED → [ADR-0013](ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md) | 2026-08-29 |
| [ADR-0005](ADR-0005-prefijo-story-para-el-nivel-l1.md) | El ID del nivel L1 se prefija con `STORY`; el tipo de trabajo vive en el campo `kind` | ACCEPTED | 2026-08-29 |
| [ADR-0006](ADR-0006-migracion-retroactiva-de-estados-de-epica.md) | Workflows canónicos de Story y Epic, con migración retroactiva de los estados históricos | ACCEPTED | 2026-08-30 |
| [ADR-0007](ADR-0007-templates-como-capa-propia.md) | Los templates son una capa propia, hermana de `specs/` | ACCEPTED | 2026-09-11 |
| [ADR-0008](ADR-0008-rework-sin-estado-propio.md) | Rework sin estado propio: la señal es el artefacto de fallo | ACCEPTED | 2026-09-11 |
| [ADR-0009](ADR-0009-perfiles-runtimes-e-instalacion-explicita.md) | Perfiles reproducibles, runtimes canónicos e instalación explícita | ACCEPTED | 2026-09-13 |
| [ADR-0010](ADR-0010-specs-dentro-de-docs.md) | Mantener specs/ dentro de docs/ en lugar de la raíz | SUPERSEDED → [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md) | 2026-09-20 |
| [ADR-0011](ADR-0011-archivos-canonicos-por-tipo.md) | Los archivos canónicos de work items se nombran por tipo (epic.md, story.md) | PROPOSED | 2026-09-22 |
| [ADR-0012](ADR-0012-escritor-en-templates-de-autoria-manual.md) | Los templates de autoría manual anotan `escritor: autoría manual` en línea completa | PROPOSED | 2026-09-22 |
| [ADR-0013](ADR-0013-asegurar-dos-niveles-de-flujo-epics-stories.md) | Asegurar dos niveles de flujo como epics y stories | ACCEPTED | 2026-10-05 |
| [ADR-0014](ADR-0014-skills-independientes.md) | Independencia de skills y agentes: sin dependencia de skills hacia `agents/` | ACCEPTED | 2026-10-14 |
| [ADR-0015](ADR-0015-contrato-de-validacion.md) | Contrato común de validación para los skills de gate | ACCEPTED | 2026-10-17 |
| [ADR-0016](ADR-0016-layout-fijo-de-tres-raices.md) | Layout fijo de tres raíces: docs/, specs/ y workflow/ | SUPERSEDED → [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) | 2026-10-23 |
| [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) | Layout fijo de tres raíces con archivo de historias completadas y canceladas | SUPERSEDED → [ADR-0019](ADR-0019-layout-fijo-con-archivo-de-epicas.md) | 2026-10-25 |
| [ADR-0018](ADR-0018-adoptar-cucumber-para-specs-living.md) | Adoptar Cucumber (Gherkin en archivos .feature) para specs/living/ | PROPOSED | 2026-10-28 |
| [ADR-0019](ADR-0019-layout-fijo-con-archivo-de-epicas.md) | Layout fijo de tres raíces con archivo de historias y épicas cerradas | ACCEPTED | 2026-10-30 |

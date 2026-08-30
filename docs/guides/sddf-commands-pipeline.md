---
type: guide
slug: sddf-commands-pipeline
title: "Flujos principales SDDF"
date: 2026-04-26
status: null
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - flight-leves-model
---
<!-- Referencias -->
[[flight-leves-model]]

# Flujos principales SDDF

---

## Configuración — Variable `SDDF_ROOT`

Todos los skills resuelven la ruta raíz de especificaciones a partir de la variable de entorno `SDDF_ROOT`.

| Escenario | Ruta usada |
|---|---|
| `SDDF_ROOT` no definida | `docs/` (valor por defecto — retrocompatible) |
| `SDDF_ROOT=".sdd"` y la ruta existe | `.sdd/` |
| `SDDF_ROOT` definida pero ruta inexistente | `docs/` + advertencia `⚠️ La ruta definida en SDDF_ROOT no existe` |

```bash
# Opcional: personalizar la ubicación de los artefactos
export SDDF_ROOT=".sdd"
```

---

## 1. Pipeline de especificación de proyecto

```
project-begin → project-discovery → project-planning
```

| Skill | Input | Output |
|---|---|---|
| `project-begin` | Intención del usuario (conversación) | `$SPECS_BASE/specs/01-projects/project-intent.md` |
| `project-discovery` | `project-intent.md` | `$SPECS_BASE/specs/01-projects/project.md` |
| `project-planning` | `requirement-spec.md` | `$SPECS_BASE/specs/01-projects/project-plan.md` |

> `project-flow` orquesta los 3 pasos en una sola sesión con gates de revisión entre etapas.
> `$SPECS_BASE` es `docs` por defecto, o el valor de `SDDF_ROOT` si está configurada.

---

## 2. Pipeline de generación de épicas e historias

```
epic-from-project-plan → epic-generate-stories
```

| Skill | Input | Output |
|---|---|---|
| `epic-from-project-plan` | `project-plan.md` | `$SPECS_BASE/specs/02-epics/épica-[ID]-[Nombre].md` (uno por épica) |
| `epic-generate-stories` | Un archivo `epic.md` | `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre]/story.md` (una por feature) |

> `epic-generate-all-stories` procesa todas las épicas en batch.

---

## 3. Pipeline de refinamiento de historias

```
story-creation → story-evaluation → story-split
```

| Skill | Propósito |
|---|---|
| `story-creation` | Redacta la historia (Como/Quiero/Para + Gherkin) |
| `story-evaluation` | Evalúa calidad con rúbrica FINVEST (1–5 por dimensión) → `APROBADA / REFINAR / RECHAZAR` |
| `story-split` | Divide historias grandes usando 8 patrones de splitting |

> `story-specify` orquesta el ciclo completo con control de backlog por archivo (`substatus: IN-PROGRESS / READY`).

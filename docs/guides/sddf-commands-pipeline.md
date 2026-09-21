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

## Configuración — Raíz de artefactos

Todos los skills resuelven localmente `SPECS_BASE` una vez por invocación.

| Escenario | Ruta usada |
|---|---|
| `SDDF_ROOT` válida | La ruta del override; no se lee configuración. |
| Sin override y `sddf.config.yaml.root` válida | La raíz versionada; las rutas relativas se anclan en `REPO_ROOT`. |
| Sin fuente explícita | `docs/` (compatibilidad). |
| Fuente explícita inválida | Error accionable y ninguna escritura. |

```bash
# Override opcional, por ejemplo para CI
export SDDF_ROOT="artefactos-ci"
```

---

## 0. Memoria del proyecto

```
memory-system index
```

| Skill | Input | Output |
|---|---|---|
| `memory-system index [--harness h] [--dry-run]` | `$SPECS_BASE/` (artefactos con frontmatter `slug`/`title`) y, según el harness detectado, las raíces externas de Spec-kit/OpenSpec | `$SPECS_BASE/index.md` regenerado con wikilinks `[[slug]]` por capa; resumen `nodos indexados: N · sin frontmatter: M · nodos pendientes: K` |
| `memory-system` (sin modo) | — | Informa los modos disponibles; el modo por defecto `ensure` llega con STORY-096 |

> Regenera el índice tras añadir o mover artefactos: es el mapa que los LLMs leen antes de abrir
> cualquier nodo. `--dry-run` imprime el resultado sin escribir. Los nodos sin frontmatter se
> enlazan solo por ruta; complétalos con `/header-aggregation <ruta>`.
>
> ⚠️ `docs-wiki-builder` está deprecado desde 3.3.0 (se elimina en 4.0.0): es un alias que
> delega en `/memory-system index` (`--update` → `index`, `--dry-run` → `index --dry-run`).

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
> `$SPECS_BASE` procede de `SDDF_ROOT` válida, de `sddf.config.yaml.root` válida o de `docs` si no hay fuente explícita.

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

---

## 4. Pipeline de implementación y ciclo de corrección post-review

```
story-implement | story-implement-tasks → story-code-review → approved
                                              └─ needs-changes → story-implement | story-implement-tasks → story-code-review → …
```

| Skill | Precondición (`story.md`) | Resultado |
|---|---|---|
| `story-implement` o `story-implement-tasks` | `READY-FOR-IMPLEMENT/DONE` (ejecución inicial o rework encolado) | `IMPLEMENT/DONE` + `implement-report.md`; si existe `fix-directives.md`, aplica sus correcciones |
| `story-code-review` → `approved` | `IMPLEMENT/DONE` | `CODE-REVIEW/DONE` + `code-review-report.md`; `fix-directives.md` eliminado si existía |
| `story-code-review` → `needs-changes` | `IMPLEMENT/DONE` | `READY-FOR-IMPLEMENT/DONE` + `code-review-report.md` + `fix-directives.md` con `round: N` (ronda previa + 1); mensaje `→ Ejecuta /story-implement <id>` (alternativa `/story-implement-tasks <id>` si existe `tasks.md`) |

> La señal de rework es la presencia de `fix-directives.md` en el directorio de la historia: lo crea o sobreescribe `story-code-review` en `needs-changes` (escritor único de `round`) y lo elimina en `approved`. No existe estado ni substatus de rework; el ciclo `needs-changes → ejecutor → story-code-review` se repite sin editar el frontmatter a mano hasta obtener `approved` (ver [[rework-sin-estado-propio]], ADR-0008).

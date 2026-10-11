# Reglas de `migrate --from=specs-3-levels`

El migrador reconoce exclusivamente `specs/01-projects/`, `specs/02-epics/` y
`specs/03-stories/`. Rechaza dos o más proyectos con `[NO MIGRADO]` y exit 1, sin escribir.

| Origen | Destino |
|---|---|
| `project-intent.md` | `product/vision.md` |
| usuarios y roles de `project.md` | `product/stakeholders.md` |
| FR / NFR de `project.md` | `requirements/{functional,non-functional}/` |
| `project-plan.md` | `product/objectives.md` y `product/roadmap.md` |
| `story-map.md` | `product/story-map.md` |
| `*.puml` | `architecture/c4/` |
| `02-epics/`, `03-stories/` | `epics/`, `stories/` |

Las secciones vacías y los placeholders se omiten. Todo contenido no reconocible, conflicto sin
`--force`, archivo sin destino o colisión se informa como `[NO MIGRADO]`; el origen se conserva.
`--dry-run` nunca escribe. El informe usa `[CREADO]`, `[SOBRESCRITO]`, `[PRESERVADO]`, `[MOVIDO]`,
`[ACTUALIZADO]`, `[ELIMINADO]` y sus formas condicionales, seguido de totales y de cambios pendientes.

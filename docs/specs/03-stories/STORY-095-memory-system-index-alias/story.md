---
alwaysApply: false
type: story
id: STORY-095
kind: feat
slug: STORY-095-memory-system-index-alias
title: "Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-20-memory-system
created: 2026-09-20
updated: 2026-09-21
related:
  - EPIC-20-memory-system
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-097-memory-system-check-ci
  - STORY-098-memory-system-migrate-harness
  - STORY-099-sddf-init-level-full
  - STORY-044-directorio-docs-tipo-wiki
  - STORY-043-header-aggregation
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-097-memory-system-check-ci]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-099-sddf-init-level-full]]
[[STORY-044-directorio-docs-tipo-wiki]]
[[STORY-043-header-aggregation]]
[[memory-system]]

# ðŸ“– Historia: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder

**Como** mantenedor del framework SDDF que quiere un Ãºnico punto de entrada para la memoria del proyecto
**Quiero** un skill `memory-system` cuyo modo `index` regenere `docs/index.md` con wikilinks, detecte el harness del proyecto y reemplace a `docs-wiki-builder` mediante un alias deprecado, sin fusionar `header-aggregation`
**Para** que el indexado deje de vivir en un skill aislado y exista la base sobre la que se aÃ±aden los demÃ¡s modos (`scaffold`, `ensure`, `check`, `migrate`, `rebuild`) sin duplicar lÃ³gica

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ `memory-system index` regenera el Ã­ndice con wikilinks

```gherkin
Dado un proyecto con `docs/` que contiene `constitution.md`, `adr/ADR-0001-x.md`, `guides/sdd.md` y `specs/03-stories/STORY-001-a/story.md`
Cuando ejecuto `/memory-system index`
Entonces el sistema regenera `docs/index.md` completo con una entrada `[[slug]]` por cada artefacto detectado, agrupada por capa
  Y el slug de cada entrada es el declarado en el frontmatter del artefacto o, si no lo tiene, el nombre del archivo (o del directorio para `story.md`, `epic.md` y `project.md`)
  Y los artefactos derivados de una historia (`design.md`, `tasks.md`, `testcases.md`, `*-report.md`) y el contenido de `templates/` no se listan
  Y ejecutar el comando dos veces seguidas produce el mismo `index.md` salvo la fecha de actualizaciÃ³n
```

### Escenario principal â€“ `docs-wiki-builder` pasa a ser un alias deprecado

```gherkin
Dado un proyecto con `docs-wiki-builder` instalado y utilizado en flujos previos
Cuando ejecuto `/docs-wiki-builder` (con o sin `--update` / `--dry-run`)
Entonces el sistema muestra la advertencia "âš ï¸ docs-wiki-builder estÃ¡ deprecado. Usa /memory-system index."
  Y delega la ejecuciÃ³n a `/memory-system index` (con `--dry-run` si se pasÃ³ ese flag)
  Y produce el mismo `docs/index.md` que `/memory-system index`
```

### Escenario alternativo â€“ `header-aggregation` no se fusiona y sigue siendo invocable

```gherkin
Dado cualquier proyecto con el framework SDDF instalado
Cuando ejecuto `/header-aggregation docs/specs/03-stories/STORY-001-a/story.md`
Entonces el skill aplica el frontmatter estandarizado sin depender de `memory-system`
  Y sigue disponible como utilidad transversal para otros skills
```

### Requerimiento: DetecciÃ³n de harness

`memory-system` detecta el harness del proyecto (`sddf`, `speckit`, `openspec`, `generic`) a partir de la presencia de `sddf.config.yaml`, `.specify/` u `openspec/`, en ese orden de precedencia. El parÃ¡metro `--harness` permite forzarlo. En esta historia la detecciÃ³n solo se usa para decidir quÃ© raÃ­ces se indexan; la adaptaciÃ³n del scaffolding por harness corresponde a [[STORY-098-memory-system-migrate-harness]].

### Requerimiento: Ãndice con wikilinks

El modo `index` regenera `docs/index.md` con enlaces `[[slug]]` a todos los artefactos detectados, respetando el patrÃ³n LLM Wiki ya definido por `docs-wiki-builder` y el formato de entrada vigente en `docs/index.md` (wikilink + enlace relativo + tÃ­tulo). Un wikilink cuyo slug no resuelve se marca como nodo pendiente sin bloquear la generaciÃ³n.

### Requerimiento: Alias deprecado con retirada gradual

`docs-wiki-builder` deja de ser un skill autÃ³nomo y pasa a ser un alias de `memory-system index`. Durante al menos una versiÃ³n minor el alias sigue funcionando y emite el aviso de deprecaciÃ³n; se elimina en la siguiente major. El alias conserva un caso de evaluaciÃ³n mÃ­nimo para no requerir exenciÃ³n en el inventario de evals.

### Requerimiento: Modo por defecto reservado

`/memory-system` sin modo explÃ­cito reserva el modo `ensure` (definido en [[STORY-096-memory-system-scaffold-ensure-rebuild]]). Mientras ese modo no exista, invocar el skill sin modo informa los modos disponibles y no falla.

## âš™ï¸ Criterios no funcionales

* **Idempotencia:** ejecutar `index` dos veces seguidas produce el mismo resultado y no genera errores.
* **Independencia de stack:** el skill no depende de `package.json`; funciona en proyectos de cualquier lenguaje.
* **Portabilidad:** los comandos usan rutas relativas y no dependen de utilidades Unix, o degradan elegantemente si no estÃ¡n (compatibilidad con Windows).
* **DocumentaciÃ³n:** `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md` y `CHANGELOG.md` reflejan el nuevo skill, el modo `index` y la deprecaciÃ³n del alias.
* **DeprecaciÃ³n gradual:** el alias `docs-wiki-builder` sobrevive al menos una versiÃ³n minor antes de eliminarse.

## Fuera de alcance (Non-Goals)

- Los modos `scaffold`, `ensure` y `rebuild` â†’ [[STORY-096-memory-system-scaffold-ensure-rebuild]].
- El modo `check` â†’ [[STORY-097-memory-system-check-ci]].
- El modo `migrate` y la adaptaciÃ³n del scaffolding a OpenSpec/Speckit â†’ [[STORY-098-memory-system-migrate-harness]].
- La integraciÃ³n con `sddf-init --level` â†’ [[STORY-099-sddf-init-level-full]].
- Cambios en `header-aggregation` mÃ¡s allÃ¡ de documentar su relaciÃ³n con `memory-system`.
- La reorganizaciÃ³n de archivos `.md` dispersos (Flujo B de `docs-wiki-builder`): desaparece con el alias.
- Ãndices derivados (`specs-index.json`) e interfaz grÃ¡fica.

## ðŸ“Ž Notas / contexto adicional

**Origen del split:** esta historia es la core de la divisiÃ³n de la STORY-095 original ("Unificar la gestiÃ³n de memoria en un skill memory-system con modos"), que agrupaba seis modos, detecciÃ³n de harness, un alias deprecado y una integraciÃ³n con `sddf-init` (10 escenarios). Se aplicÃ³ el patrÃ³n de complejidad de criterios de aceptaciÃ³n con incrementos tÃ©cnicos: el nÃºcleo `index` es la base sobre la que las hermanas aÃ±aden modos. Orden sugerido: 095 â†’ 096 â†’ 097 â†’ 098 â†’ 099.

**Artefactos del alcance previo:** `pre-split/` conserva `design.md`, `tasks.md`, `testcases.md` y `analyze.md` generados para la historia sin dividir; sirven de referencia (decisiones D-1, D-2, D-4, D-7 y CRs) pero no son los artefactos de planning de esta historia. Ejecutar `/story-plan STORY-095` para regenerarlos con el alcance acotado.

**Artefactos afectados (fuente en `skills/`, no en `.claude/`):**

| Artefacto | Cambio |
|-----------|--------|
| `skills/memory-system/` | Nuevo skill con el modo `index`, detecciÃ³n de harness y estructura preparada para los modos restantes |
| `skills/docs-wiki-builder/SKILL.md` | Deprecar: redirigir a `memory-system index` con aviso; retirar su template de Ã­ndice |
| `config/eval-exemptions.json` | Retirar la exenciÃ³n de `docs-wiki-builder` |
| `skills/header-aggregation/SKILL.md` | Sin cambios funcionales; nota sobre su relaciÃ³n con `memory-system` |
| `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | DocumentaciÃ³n del skill, el modo `index` y la deprecaciÃ³n |

**VerificaciÃ³n sugerida:**

1. Buscar `docs-wiki-builder` en `skills/` devuelve solo el alias deprecado.
2. `/memory-system index` en este repositorio produce un `docs/index.md` con las mismas entradas que el Ã­ndice manual vigente (comparaciÃ³n por entradas â€” slug y ruta â€”, no por descripciones: la entrada generada usa el `title` del frontmatter; CR-003).
3. `/docs-wiki-builder` produce el mismo `index.md` que `/memory-system index`, con aviso.
4. `header-aggregation` sigue siendo invocable de forma independiente.

**Dependencia de runtime (CR-001):** la reproducibilidad de `index` exige Node â‰¥ 18 en PATH (solo mÃ³dulos nativos, sin `package.json` en el proyecto consumidor). Sin Node, el skill degrada a generaciÃ³n inline y avisa que la reproducibilidad byte a byte no estÃ¡ garantizada.

Referencias:
- Fuente de verdad: [[memory-system]] location: docs/architecture/memory-system.md

---
alwaysApply: false
type: story
id: STORY-097
kind: feat
slug: STORY-097-memory-system-check-ci
title: "Verificar la consistencia de la memoria con un modo check apto para CI"
status: VERIFY
substatus: DONE
parent: EPIC-20-memory-system
created: 2026-09-20
updated: 2026-09-23
related:
  - EPIC-20-memory-system
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-098-memory-system-migrate-harness
  - STORY-099-sddf-init-level-full
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[STORY-095-memory-system-index-alias]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-099-sddf-init-level-full]]
[[memory-system]]

# ðŸ“– Historia: Verificar la consistencia de la memoria con un modo check apto para CI

**Como** mantenedor de un proyecto SDDF que integra la memoria de `docs/` en su pipeline de integraciÃ³n continua
**Quiero** que `memory-system check` detecte capas faltantes, artefactos sin frontmatter vÃ¡lido y wikilinks rotos sin escribir nada, con salida parseable y exit code
**Para** bloquear en CI los cambios que dejan la memoria inconsistente, sin depender de una revisiÃ³n manual del Ã­ndice

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ modo `check` es determinista y reporta los problemas

```gherkin
Dado un proyecto con memoria potencialmente inconsistente
Cuando ejecuto `/memory-system check`
Entonces el sistema reporta, sin escribir ningÃºn archivo: capas faltantes, artefactos huÃ©rfanos (sin frontmatter vÃ¡lido), wikilinks rotos (slug inexistente) y frontmatters invÃ¡lidos (campos obligatorios ausentes)
  Y devuelve exit code 1 si encuentra al menos un problema
  Y devuelve exit code 0 si todo estÃ¡ en orden
```

### Escenario alternativo â€“ salida JSON para CI

```gherkin
Dado un proyecto con un wikilink `[[slug-inexistente]]` en una guÃ­a
Cuando ejecuto `/memory-system check --json`
Entonces la salida es un Ãºnico objeto JSON con el harness detectado, la raÃ­z analizada, `ok: false`, un resumen con el conteo por familia de problema y la lista de problemas con tipo, ruta y detalle
  Y el exit code es 1
  Y tras corregir el wikilink la misma orden devuelve `ok: true` y exit code 0
```

### Requerimiento: Familias de problemas

`check` evalÃºa cuatro familias: capa faltante (segÃºn las once capas esperadas), artefacto huÃ©rfano (archivo `.md` sin bloque de frontmatter), frontmatter invÃ¡lido (sin `type`, `slug` o `title`; para `project`, `epic` y `story` tambiÃ©n sin `id` o `status`) y wikilink roto (`[[slug]]` que no resuelve a ningÃºn artefacto). Los wikilinks dentro de cÃ³digo inline o bloques de cÃ³digo, y el contenido de `templates/`, no se evalÃºan.

### Requerimiento: Solo lectura y exit codes

`check` nunca escribe ni modifica archivos. Exit code `0` sin problemas, `1` con al menos un problema, `2` ante un error tÃ©cnico (raÃ­z inexistente, runtime incompatible).

## âš™ï¸ Criterios no funcionales

* **Determinismo:** dos ejecuciones sobre el mismo estado producen la misma salida y el mismo exit code.
* **Rendimiento:** en un repositorio con ~300 archivos `.md` (como este) el chequeo completa en menos de 5 segundos.
* **Independencia de stack:** no depende de `package.json`; requiere Ãºnicamente Node â‰¥ 18 disponible en PATH. Si no estÃ¡, el skill emite el informe textual y avisa que no puede devolver exit code.
* **Portabilidad:** rutas relativas y separadores normalizados; mismo resultado en Windows y Linux.
* **DocumentaciÃ³n:** `docs/architecture/memory-system.md` describe las familias de problemas y el esquema JSON; `docs/guides/sddf-commands-pipeline.md` muestra cÃ³mo invocarlo en CI.

## Fuera de alcance (Non-Goals)

- Corregir automÃ¡ticamente los problemas detectados (eso corresponde a `ensure`, [[STORY-096-memory-system-scaffold-ensure-rebuild]], y a `header-aggregation`).
- Validar la bidireccionalidad de enlaces o las relaciones tipadas (`implements`, `verified-by`).
- Verificar el contenido semÃ¡ntico de los artefactos, solo su estructura.

## ðŸ“Ž Notas / contexto adicional

**Origen del split:** historia hermana de la divisiÃ³n de la STORY-095 original. Comparte con [[STORY-095-memory-system-index-alias]] el escÃ¡ner de artefactos y las reglas de derivaciÃ³n de slug; si esta historia se implementa antes, define esas reglas y la core las reutiliza.

**DecisiÃ³n heredada del diseÃ±o previo** (`STORY-095-memory-system-index-alias/pre-split/design.md`, D-5): el chequeo vive en un ejecutable determinista dentro del skill para poder devolver exit code; el conjunto de campos obligatorios verificados es un subconjunto del esquema canÃ³nico de `header-aggregation`. La divergencia entre ese conjunto y el invariante 2 de `docs/architecture/memory-system.md` (`date` vs `created/updated`) debe resolverse al documentar esta historia.

**VerificaciÃ³n sugerida:**

1. `/memory-system check` en este repositorio devuelve exit code 0 o lista problemas reales (sin falsos positivos por wikilinks en cÃ³digo o templates).
2. Romper un wikilink en una guÃ­a â†’ exit code 1 y el problema aparece en `--json`.
3. NingÃºn hash de `docs/` cambia tras ejecutar `check`.

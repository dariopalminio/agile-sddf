---
alwaysApply: false
type: story
id: STORY-097
kind: feat
slug: STORY-097-memory-system-check-ci
title: "Verificar la consistencia de la memoria con un modo check apto para CI"
status: VERIFY
substatus: IN-PROGRESS
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

# 📖 Historia: Verificar la consistencia de la memoria con un modo check apto para CI

**Como** mantenedor de un proyecto SDDF que integra la memoria de `docs/` en su pipeline de integración continua
**Quiero** que `memory-system check` detecte capas faltantes, artefactos sin frontmatter válido y wikilinks rotos sin escribir nada, con salida parseable y exit code
**Para** bloquear en CI los cambios que dejan la memoria inconsistente, sin depender de una revisión manual del índice

## ✅ Criterios de aceptación

### Escenario principal – modo `check` es determinista y reporta los problemas

```gherkin
Dado un proyecto con memoria potencialmente inconsistente
Cuando ejecuto `/memory-system check`
Entonces el sistema reporta, sin escribir ningún archivo: capas faltantes, artefactos huérfanos (sin frontmatter válido), wikilinks rotos (slug inexistente) y frontmatters inválidos (campos obligatorios ausentes)
  Y devuelve exit code 1 si encuentra al menos un problema
  Y devuelve exit code 0 si todo está en orden
```

### Escenario alternativo – salida JSON para CI

```gherkin
Dado un proyecto con un wikilink `[[slug-inexistente]]` en una guía
Cuando ejecuto `/memory-system check --json`
Entonces la salida es un único objeto JSON con el harness detectado, la raíz analizada, `ok: false`, un resumen con el conteo por familia de problema y la lista de problemas con tipo, ruta y detalle
  Y el exit code es 1
  Y tras corregir el wikilink la misma orden devuelve `ok: true` y exit code 0
```

### Requerimiento: Familias de problemas

`check` evalúa cuatro familias: capa faltante (según las once capas esperadas), artefacto huérfano (archivo `.md` sin bloque de frontmatter), frontmatter inválido (sin `type`, `slug` o `title`; para `project`, `epic` y `story` también sin `id` o `status`) y wikilink roto (`[[slug]]` que no resuelve a ningún artefacto). Los wikilinks dentro de código inline o bloques de código, y el contenido de `templates/`, no se evalúan.

### Requerimiento: Solo lectura y exit codes

`check` nunca escribe ni modifica archivos. Exit code `0` sin problemas, `1` con al menos un problema, `2` ante un error técnico (raíz inexistente, runtime incompatible).

## ⚙️ Criterios no funcionales

* **Determinismo:** dos ejecuciones sobre el mismo estado producen la misma salida y el mismo exit code.
* **Rendimiento:** en un repositorio con ~300 archivos `.md` (como este) el chequeo completa en menos de 5 segundos.
* **Independencia de stack:** no depende de `package.json`; requiere únicamente Node ≥ 18 disponible en PATH. Si no está, el skill emite el informe textual y avisa que no puede devolver exit code.
* **Portabilidad:** rutas relativas y separadores normalizados; mismo resultado en Windows y Linux.
* **Documentación:** `docs/architecture/memory-system.md` describe las familias de problemas y el esquema JSON; `docs/guides/sddf-commands-pipeline.md` muestra cómo invocarlo en CI.

## Fuera de alcance (Non-Goals)

- Corregir automáticamente los problemas detectados (eso corresponde a `ensure`, [[STORY-096-memory-system-scaffold-ensure-rebuild]], y a `header-aggregation`).
- Validar la bidireccionalidad de enlaces o las relaciones tipadas (`implements`, `verified-by`).
- Verificar el contenido semántico de los artefactos, solo su estructura.

## 📎 Notas / contexto adicional

**Origen del split:** historia hermana de la división de la STORY-095 original. Comparte con [[STORY-095-memory-system-index-alias]] el escáner de artefactos y las reglas de derivación de slug; si esta historia se implementa antes, define esas reglas y la core las reutiliza.

**Decisión heredada del diseño previo** (`STORY-095-memory-system-index-alias/pre-split/design.md`, D-5): el chequeo vive en un ejecutable determinista dentro del skill para poder devolver exit code; el conjunto de campos obligatorios verificados es un subconjunto del esquema canónico de `header-aggregation`. La divergencia entre ese conjunto y el invariante 2 de `docs/architecture/memory-system.md` (`date` vs `created/updated`) debe resolverse al documentar esta historia.

**Verificación sugerida:**

1. `/memory-system check` en este repositorio devuelve exit code 0 o lista problemas reales (sin falsos positivos por wikilinks en código o templates).
2. Romper un wikilink en una guía → exit code 1 y el problema aparece en `--json`.
3. Ningún hash de `docs/` cambia tras ejecutar `check`.

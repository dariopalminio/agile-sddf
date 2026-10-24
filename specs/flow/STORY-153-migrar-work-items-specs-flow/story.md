---
alwaysApply: false
type: story
id: STORY-153
kind: chore
slug: STORY-153-migrar-work-items-specs-flow
title: "Migrar y archivar los work items a specs/flow"
status: IMPLEMENT
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-24
related:
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-157
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar y archivar los work items a specs/flow

**Como** mantenedor de Agile-SDDF que dogfoodea el framework
**Quiero** migrar las épicas y stories de `docs/specs/` a `specs/flow/`, archivando las `COMPLETED`, de forma reproducible, segura de ensayar y conservando su historial git
**Para** adoptar el layout fijo en este repo sin perder la trazabilidad de ningún work item

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – migrar y archivar
```gherkin
Dado "docs/specs/" con épicas, stories COMPLETED y stories en otros estados
Cuando se ejecuta el script de migración única
Entonces cada épica queda en "specs/flow/EPIC-NN-<slug>/"
  Y cada story COMPLETED queda en "specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/" con la fecha de su "updated:" (o "created:" si falta, o "date:" si faltan ambos)
  Y cada story en otro estado queda en "specs/flow/STORY-NNN-<slug>/"
  Y "docs/specs/" deja de existir
  Y el total de stories activas + archivadas es igual al previo a la migración
```

### AC-2 — Escenario alternativo – ejecución segura (dry-run e idempotencia)
```gherkin
Dado "docs/specs/" sin migrar
Cuando se ejecuta el script con "--dry-run"
Entonces se lista cada movimiento planificado (origen → destino)
  Pero no se mueve ni modifica ningún archivo
  Y al ejecutar el script de nuevo sobre el repositorio ya migrado no se produce ningún cambio en el árbol de trabajo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Un solo uso:** no se crea ningún skill ni script de archivado reutilizable; el script no escribe eventos ni log (CS-11).
- **CNF-2 — Stack:** Node.js en JavaScript, sin dependencias nuevas; estados distintos de `COMPLETED` (incluido `CANCELED`) no se archivan.
- **CNF-3 — Historial:** los movimientos conservan el historial git de cada work item (CS-6); la verificación con `git log --follow` se cubre en STORY-157.
- **CNF-4 — Alcance del movimiento:** `docs/requirements/` no se mueve ni se modifica (CS-10).

## Fuera de alcance (Non-Goals)

- Reescribir los enlaces y wikilinks que apuntan a rutas movidas y validar `npm run verify:repository` (STORY-157).
- Archivar épicas, el estado `ARCHIVED`, `workflow/log.jsonl` y el board (épica de Workflow).
- Migrar proyectos instalados: el script es solo de este repo.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-153 — Migración única de work items del repo (dividida con `/story-split`; core que conserva el ID, ver STORY-157 para la reparación de enlaces).
Cubre CS-4, CS-5, CS-6, CS-7, CS-10, CS-11 y SMOKE-4.

**Criterio de salida de la épica que cubre por decisión de diseño** (lo fija CNF-1; cita literal para la trazabilidad de `/epic-analyze`):

- **CS-11** — No se crea ningún skill ni script de archivado reutilizable; el único script nuevo de movimiento es la migración de un solo uso.

**Precondiciones:**
- Ejecutar después de implementar las historias de migración de skills (STORY-149 a STORY-152, STORY-155, STORY-156 y STORY-158), para que los skills ya apunten a `specs/flow/`.
- La historia se entrega antes que STORY-157: tras mover los work items los enlaces quedan por reescribir.

**Inventario aproximado al 2026-10-22:** 27 épicas y 147 directorios de stories bajo `docs/specs/` (alrededor de 98 con `status: COMPLETED` y 11 `CANCELED`, que no se archivan). EPIC-26 vive hoy en `docs/specs/epics/` y será movida por el propio script.

**Casos límite a definir en diseño:** directorios sin versionar o con cambios locales, donde `git mv` falla, y la épica en curso que se mueve a sí misma.

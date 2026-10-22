---
alwaysApply: false
type: story
id: STORY-153
kind: chore
slug: STORY-153-migracion-unica-de-work-items-del-repo
title: "Migración única de work items del repo"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migración única de work items del repo

**Como** mantenedor de Agile-SDDF que dogfoodea el framework
**Quiero** un script reproducible de un solo uso, con `--dry-run` e idempotente, que mueva con `git mv` las épicas y stories de `docs/specs/` a `specs/flow/` y archive las `COMPLETED`
**Para** adoptar el layout fijo en este repo conservando el historial git de cada work item y sin enlaces rotos

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – migrar y archivar
```gherkin
Dado "docs/specs/" con épicas, stories COMPLETED y stories en otros estados
Cuando se ejecuta el script de migración única
Entonces cada épica queda en "specs/flow/EPIC-NN-<slug>/"
  Y cada story COMPLETED queda en "specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/" con la fecha de su "updated:" (o "created:" si falta)
  Y cada story en otro estado queda en "specs/flow/STORY-NNN-<slug>/"
  Y "docs/specs/" deja de existir
  Y el total de stories activas + archivadas es igual al previo a la migración
```

### AC-2 — Escenario alternativo – dry-run
```gherkin
Dado "docs/specs/" sin migrar
Cuando se ejecuta el script con "--dry-run"
Entonces se lista cada movimiento planificado (origen → destino)
  Pero no se mueve ni modifica ningún archivo
```

### AC-3 — Escenario alternativo – idempotencia
```gherkin
Dado el repositorio ya migrado
Cuando se ejecuta el script de nuevo
Entonces no se produce ningún cambio en el árbol de trabajo
```

### AC-4 — Escenario alternativo – historial y enlaces
```gherkin
Dado el repositorio migrado
Cuando se ejecuta "git log --follow" sobre un "story.md" archivado
Entonces muestra su historial previo a la migración
  Y "npm run verify:repository" termina sin enlaces rotos
  Y "docs/requirements/" no cambia de ubicación ni de contenido
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Un solo uso:** no se crea ningún skill ni script de archivado reutilizable; el script no escribe eventos ni log (CS-11).
- **CNF-2 — Stack:** Node.js en JavaScript, sin dependencias nuevas; estados distintos de `COMPLETED` (incluido `CANCELED`) no se archivan.

## Fuera de alcance (Non-Goals)

- Archivar épicas, el estado `ARCHIVED`, `workflow/log.jsonl` y el board (épica de Workflow).
- Migrar proyectos instalados: el script es solo de este repo.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-153 — Migración única de work items del repo
Cubre CS-4, CS-5, CS-6, CS-7, CS-10, CS-11 y SMOKE-4, SMOKE-5. Conviene ejecutarlo después de STORY-150 a STORY-152 para que los skills ya apunten a `specs/flow/`. Ojo: EPIC-26 vive hoy en `docs/specs/epics/` y será movida por el propio script.

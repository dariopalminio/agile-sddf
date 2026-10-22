---
alwaysApply: false
type: story
id: STORY-149
kind: feat
slug: STORY-149-sddf-init-crea-el-nuevo-layout
title: "sddf-init crea el nuevo layout"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: sddf-init crea el nuevo layout

**Como** practitioner que inicializa SDDF en un proyecto
**Quiero** que `/sddf-init` cree `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` en la raíz y deje de escribir la clave `root` en `sddf.config.yaml`
**Para** empezar a especificar con el layout fijo sin configurar nada, y sin duplicar estructura si mi proyecto aún usa `docs/specs/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – repo limpio
```gherkin
Dado un repositorio sin estructura SDDF
Cuando el usuario ejecuta "/sddf-init"
Entonces existen "specs/flow/", "specs/flow/archive/", "specs/living/" y "workflow/" en la raíz, cada uno con ".gitkeep"
  Y los templates quedan en "docs/templates/"
  Y "sddf.config.yaml" no declara la clave "root"
  Y no existe "docs/specs/"
```

### AC-2 — Escenario alternativo – proyecto con el layout legado
```gherkin
Dado un repositorio que ya tiene "docs/specs/"
Cuando el usuario ejecuta "/sddf-init"
Entonces se emite un aviso de deprecación con la ruta de "docs/guides/artifact-directory-migration.md"
  Y no se crea "specs/flow/"
  Y "docs/specs/" queda sin cambios
```

### AC-3 — Escenario alternativo – re-ejecución sobre el layout nuevo
```gherkin
Dado un repositorio ya inicializado con el layout fijo
Cuando el usuario ejecuta "/sddf-init" de nuevo
Entonces no se sobrescriben archivos existentes en "specs/" ni en "workflow/"
  Y el resultado informa que el layout ya existe
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin escritura en layout legado:** ante `docs/specs/`, el skill no crea ni modifica ningún archivo de work items.
- **CNF-2 — Evals:** los evals de `skills/sddf-init/evals/evals.json` cubren AC-1 y AC-2.

## Fuera de alcance (Non-Goals)

- Migrar automáticamente `docs/specs/` a `specs/flow/` en proyectos instalados (STORY-153 solo migra este repo).
- Contenido de `workflow/` y `specs/living/` más allá de crear los directorios (épicas de Workflow y Living Spec).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-149 — sddf-init crea el nuevo layout
Cubre CS-3 (parte de `sddf-init`), CS-8, CS-13 y SMOKE-3, SMOKE-6. La guía de migración a la que remite el aviso la completa STORY-154.

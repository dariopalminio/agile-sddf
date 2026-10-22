---
alwaysApply: false
type: story
id: STORY-152
kind: feat
slug: STORY-152-migrar-los-skills-de-proyecto-y-transversales
title: "Migrar los skills de proyecto y transversales"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de proyecto y transversales

**Como** practitioner que usa los skills de proyecto y de mantenimiento de la memoria
**Quiero** que `project-*`, `memory-system`, `header-aggregation`, `reverse-engineering`, `sddf-constitution` y `skill-preflight` usen rutas fijas, que `skill-preflight` diagnostique el layout legado y que el alias deprecado `docs-wiki-builder` se elimine en lugar de migrarse
**Para** que ningún skill dependa de `SDDF_ROOT`, `root` o `SPECS_BASE`, que un proyecto sin migrar sepa cómo hacerlo y que no se invierta esfuerzo en migrar un skill cuya eliminación ya estaba anunciada

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – skills transversales con rutas fijas
```gherkin
Dado los skills "project-*", "memory-system", "header-aggregation", "reverse-engineering" y "sddf-constitution" migrados
Cuando se ejecuta grep -rnE "SPECS_BASE|SDDF_ROOT" sobre esos skills
Entonces no hay coincidencias
  Y ninguno lee la clave "root" de "sddf.config.yaml"
  Y "memory-system" indexa los work items desde "specs/flow/"
```

### AC-2 — Escenario alternativo – preflight sobre layout legado
```gherkin
Dado un repositorio con "docs/specs/", la clave "root" en "sddf.config.yaml" o la variable "SDDF_ROOT" definida
Cuando el usuario ejecuta "/skill-preflight"
Entonces el diagnóstico lista cada señal de layout legado detectada
  Y remite a "docs/guides/artifact-directory-migration.md"
  Pero no modifica ningún archivo
```

### AC-3 — Escenario alternativo – preflight sobre layout fijo
```gherkin
Dado un repositorio inicializado con el layout fijo y sin señales legadas
Cuando el usuario ejecuta "/skill-preflight"
Entonces el diagnóstico confirma "specs/flow/", "specs/flow/archive/", "specs/living/", "workflow/" y "docs/templates/"
  Y no emite avisos de layout legado
```

### AC-4 — Escenario principal – eliminación de docs-wiki-builder
```gherkin
Dado que "docs-wiki-builder" es un alias deprecado de "/memory-system index" desde 3.3.0, anunciado para eliminarse en 4.0.0
Cuando se completa la historia
Entonces "skills/docs-wiki-builder/" no existe
  Y "memory-system" (SKILL.md y evals) ya no declara el alias ni su sección de deprecación
  Y "docs/architecture/memory-system.md" y "docs/guides/sddf-commands-pipeline.md" ya no lo presentan como skill disponible
  Y el CHANGELOG registra la eliminación como cambio incompatible y remite a "/memory-system index"
  Pero las menciones históricas (CHANGELOG previo, historias cerradas, "docs/requirements/") se conservan
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Excepción acotada:** `skill-preflight` es el único skill donde `SPECS_BASE`/`SDDF_ROOT` pueden aparecer, y solo como texto de diagnóstico (CS-2).
- **CNF-2 — Evals actualizados:** los evals de los skills afectados usan rutas fijas; su ejecución queda a criterio humano.

## Fuera de alcance (Non-Goals)

- Validar `sddf.config.yaml` o rutas viejas en `/memory-system check` (épica de Enforcement).
- Convertir `docs/requirements/` a `specs/living/` (épica de Living Spec).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-152 — Migrar los skills de proyecto y transversales
Cubre parte de CS-2 y CS-3. Depende de STORY-148.

**Decisión sobre `docs-wiki-builder`:** se elimina en lugar de migrarse. Es un alias sin lógica propia de `/memory-system index`, deprecado desde 3.3.0 con eliminación anunciada en 4.0.0, y el paquete ya está en 4.1.0. EPIC-26 requiere versión mayor, así que la eliminación cae en el mismo corte incompatible. Referencias vigentes a revisar en el diseño: `skills/memory-system/SKILL.md`, `skills/memory-system/evals/evals.json`, `docs/architecture/memory-system.md` §10.6, `docs/guides/sddf-commands-pipeline.md` y `docs/runbooks/actualizar-spec-de-proyecto.md`. Las copias ya instaladas en los destinos de runtime de otros proyectos no las borra `agile-sddf install`; la guía de migración (STORY-154) debe indicar que se eliminen a mano.

---
alwaysApply: false
type: story
id: STORY-152
kind: feat
slug: STORY-152-migrar-los-skills-de-proyecto-y-transversales
title: "Migrar los skills de proyecto y transversales"
status: VERIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-25
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de proyecto y transversales

**Como** practitioner que usa los skills de proyecto y de mantenimiento de la memoria
**Quiero** que `project-*`, `memory-system`, `header-aggregation`, `reverse-engineering`, `sddf-constitution` y `skill-preflight` usen rutas fijas, que `skill-preflight` diagnostique el layout legado y que el alias deprecado `docs-wiki-builder` se elimine en lugar de migrarse
**Para** que esos skills funcionen en un repo recién inicializado sin `sddf.config.yaml` ni `SDDF_ROOT`, que un proyecto con layout legado reciba al ejecutar `/skill-preflight` un diagnóstico que nombra cada señal detectada y la guía de migración, y que no se invierta esfuerzo en migrar un alias cuya eliminación ya estaba anunciada

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – skills transversales con rutas fijas
```gherkin
Dado los skills "project-*", "memory-system", "header-aggregation", "reverse-engineering" y "sddf-constitution" retirados de la lista transitoria de pendientes del gate de layout fijo
Cuando se ejecuta "npm run verify:repository"
Entonces el gate no reporta referencias legadas en ninguno de esos skills
  Y "/memory-system index" lista los work items de "specs/flow/"
```

### AC-2 — Escenario alternativo – preflight sobre layout legado
```gherkin
Dado un repositorio con al menos una de las señales legadas "docs/specs/", la clave "root" en "sddf.config.yaml" o la variable "SDDF_ROOT" definida
Cuando el usuario ejecuta "/skill-preflight"
Entonces el diagnóstico nombra cada señal presente y omite las ausentes
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
Dado que "docs-wiki-builder" es un alias deprecado de "/memory-system index" con eliminación anunciada para 4.0.0
Cuando se completa la historia
Entonces "skills/docs-wiki-builder/" no existe
  Y ningún archivo bajo "skills/", "docs/architecture/", "docs/guides/", "docs/runbooks/" ni "README.md" contiene "docs-wiki-builder"
  Y el CHANGELOG registra la eliminación como cambio incompatible y remite a "/memory-system index"
  Pero "docs/guides/artifact-directory-migration.md" puede nombrarlo para indicar que se borren a mano las copias instaladas
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Excepción acotada:** `skill-preflight` es el único skill donde `SPECS_BASE`/`SDDF_ROOT` pueden aparecer, y solo como texto de diagnóstico (CS-2).
- **CNF-2 — Evals actualizados:** los evals de los skills afectados usan rutas fijas; su ejecución queda a criterio humano.
- **CNF-3 — Métrica de cierre:** 0 coincidencias de `SPECS_BASE` o `SDDF_ROOT` en los skills de AC-1 (hoy son 26 archivos).

## Fuera de alcance (Non-Goals)

- Validar `sddf.config.yaml` o rutas viejas en `/memory-system check` (épica de Enforcement).
- Convertir `docs/requirements/` a `specs/living/` (épica de Living Spec).
- Redactar el contenido de `docs/guides/artifact-directory-migration.md` (STORY-154).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-152 — Migrar los skills de proyecto y transversales
Cubre parte de CS-2 y CS-3.

**Dependencias y desacople:**

- **STORY-148 (gate de layout fijo):** esta historia retira sus skills de la lista transitoria de pendientes del gate. Mientras el gate no esté entregado, AC-1 se verifica con `grep -rnE "SPECS_BASE|SDDF_ROOT"` sobre esos skills y comprobando que ninguno lee la clave `root` de `sddf.config.yaml`.
- **STORY-154 (documentación del layout):** AC-2 solo exige que el diagnóstico remita a la ruta `docs/guides/artifact-directory-migration.md`. Ese archivo ya existe y STORY-154 redacta su sección de migración, así que el contenido de la guía no es un criterio de esta historia. La guía también debe indicar que se borren a mano las copias instaladas de `docs-wiki-builder`, porque `agile-sddf install` no las elimina en los destinos de runtime de otros proyectos.

**Inventario de alcance**, con los archivos que hoy contienen `SPECS_BASE` o `SDDF_ROOT`:

| Skill | Archivos |
|---|:-:|
| `project-begin` | 2 |
| `project-context-diagram` | 4 |
| `project-discovery` | 2 |
| `project-flow` | 1 |
| `project-planning` | 3 |
| `project-story-mapping` | 2 |
| `memory-system` | 7 |
| `header-aggregation` | 1 |
| `reverse-engineering` | 2 |
| `sddf-constitution` | 2 |
| `skill-preflight` (solo pasa a texto de diagnóstico) | 3 |

**Decisión sobre `docs-wiki-builder`:** se elimina en lugar de migrarse. Es un alias sin lógica propia de `/memory-system index`, deprecado desde 3.3.0 con eliminación anunciada en 4.0.0, y el paquete ya está en 4.1.0. EPIC-26 requiere versión mayor, así que la eliminación cae en el mismo corte incompatible. Referencias vigentes a revisar en el diseño: `skills/memory-system/SKILL.md`, `skills/memory-system/evals/evals.json`, `docs/architecture/memory-system.md` §10.6, `docs/guides/sddf-commands-pipeline.md`, `docs/runbooks/actualizar-spec-de-proyecto.md` y `README.md`. Las menciones históricas (CHANGELOG previo, historias cerradas, `docs/index.md` como título de STORY-095, `docs/requirements/`) se conservan.

**Tamaño:** la evaluación FINVEST (S = 2) recomienda dividir la historia con `/story-split` en tres entregas independientes:

1. Migración a rutas fijas (AC-1).
2. Diagnóstico en `skill-preflight` (AC-2 y AC-3).
3. Eliminación de `docs-wiki-builder` (AC-4).

Si se mantiene unida, el orden sugerido de implementación es 3 → 1 → 2. Eliminar primero el alias reduce los archivos que hay que migrar.

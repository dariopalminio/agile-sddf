---
alwaysApply: false
type: story
id: STORY-151
kind: feat
slug: STORY-151-migrar-los-skills-de-epica-a-specs-flow
title: "Migrar los skills de épica a specs/flow"
status: SPECIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-22
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de épica a specs/flow

**Como** practitioner que crea y analiza épicas con SDDF
**Quiero** que `epic-creation`, `epic-format-validation`, `epic-from-project-plan`, `epic-generate-stories`, `epic-generate-all-stories` y `epic-analyze` lean y escriban en `specs/flow/EPIC-NN-<slug>/` sin usar `SPECS_BASE`
**Para** gestionar épicas en el layout fijo y que el análisis de una épica encuentre también sus historias archivadas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – epic-creation en un repo limpio
```gherkin
Dado un repositorio limpio inicializado con "/sddf-init"
Cuando el usuario ejecuta "/epic-creation" para una épica nueva
Entonces se crea "specs/flow/EPIC-01-<slug>/epic.md"
  Y no existe "docs/specs/epics/"
```

### AC-2 — Escenario principal – generar historias de una épica
```gherkin
Dado una épica en "specs/flow/EPIC-NN-<slug>/epic.md" con historias F1
Cuando el usuario ejecuta "/epic-generate-stories EPIC-NN"
Entonces cada historia se crea en "specs/flow/STORY-NNN-<slug>/story.md"
  Y el máximo ID se calcula sobre "specs/flow/STORY-*", "specs/flow/archive/*-STORY-*" y las épicas de "specs/flow/"
```

### AC-3 — Escenario alternativo – historias hijas archivadas
```gherkin
Dado una épica cuyas historias completadas están en "specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/"
Cuando el usuario ejecuta "/epic-analyze EPIC-NN"
Entonces las historias archivadas se cuentan como hijas de la épica
  Pero no se reportan como huérfanas ni faltantes
```

### AC-4 — Escenario alternativo / error – sin referencias legadas
```gherkin
Dado los skills "epic-*" migrados
Cuando se ejecuta grep -rnE "SPECS_BASE|SDDF_ROOT" sobre "skills/epic-*"
Entonces no hay coincidencias
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals actualizados:** los `evals/evals.json` de los skills `epic-*` usan rutas `specs/flow/`; su ejecución queda a criterio humano.
- **CNF-2 — Unicidad de IDs:** ningún `STORY-NNN` nuevo colisiona con uno archivado.

## Fuera de alcance (Non-Goals)

- Archivar épicas (épica de Workflow).
- Crear `epic-specify`, `epic-plan` o `epic-implement`, que no existen hoy.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-151 — Migrar los skills de épica a specs/flow
Cubre parte de CS-2 y SMOKE-2. Depende de STORY-148.

**Ampliación de alcance (2026-10-22):** incluye también `epic-refine`, creado después de especificar esta historia con el contrato `SDDF-ROOT-RESOLUTION: v1`. Su `SKILL.md` resuelve `SPECS_BASE` y sus evals usan `docs/specs/epics/`; AC-4 ya lo alcanza porque busca sobre `skills/epic-*`.

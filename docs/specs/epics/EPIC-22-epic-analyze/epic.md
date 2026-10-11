---
alwaysApply: false
type: epic
id: EPIC-22
slug: EPIC-22-epic-analyze
title: "Skill `epic-analyze`: análisis de una épica antes de desarrollarla"
status: DEVELOP
substatus: DONE
parent: null
created: 2026-10-08
updated: 2026-10-09
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - EPIC-19-framework-consistency
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[EPIC-19-framework-consistency]]

# Épica: Skill `epic-analyze`: análisis de una épica antes de desarrollarla

## Alcance
Crear el skill `/epic-analyze <EPIC-ID>`, que escribe `epic-analyze-report.md` en el directorio de la épica con hallazgos por severidad y un veredicto, para que el Product Owner decida si una épica en `PLAN` pasa a `READY-FOR-DEV`. Cubre la integridad del índice de historias, la cobertura del contrato de salida (criterios de salida y smoke tests) y la madurez de las historias hijas.

## Historias
- [x] **STORY-120** — Integridad de historias (`epic-analyze`): Crear skill, para detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo.
- [x] **STORY-121** — Editar skill, para cobertura de criterios de salida (`epic-analyze`): Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias.
- [x] **STORY-122** — Editar skill, para madurez de historias hijas (`epic-analyze`): Señalar historias hijas no especificadas o con referencias rotas al analizar una épica.

## Criterios de salida
- [ ] `skills/epic-analyze/SKILL.md` existe, resuelve `REPO_ROOT`/`SPECS_BASE` con la precedencia `SDDF_ROOT` → `sddf.config.yaml.root` → `docs` y tiene `evals/evals.json`.
- [ ] El reporte detecta historias faltantes, huérfanas y duplicadas entre la sección "Historias" de `epic.md` y los `story.md` que la declaran como `parent` (STORY-120).
- [ ] El reporte incluye una tabla de cobertura de criterios de salida y smoke tests, con un hallazgo por cada elemento sin cubrir (STORY-121).
- [ ] El reporte señala con WARNING las historias hijas no especificadas o con referencias rotas (STORY-122).
- [ ] Ante una épica inexistente, el skill informa la ruta buscada y no escribe reporte.
- [ ] `skills/epic-analyze/` está incluido en el arreglo `files` de `package.json`.

## Smoke tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### SMOKE-1 — Épica consistente obtiene veredicto APPROVED
```gherkin
Escenario: Épica consistente obtiene veredicto APPROVED
  Dado una épica cuyo índice de historias coincide con los `story.md` que la declaran como `parent`, con su contrato de salida cubierto y sus historias hijas especificadas
  Cuando ejecuto `/epic-analyze <EPIC-ID>`
  Entonces se escribe `epic-analyze-report.md` en el directorio de la épica con veredicto APPROVED y sin hallazgos
```

### SMOKE-2 — Épica inexistente
```gherkin
Escenario: Épica inexistente
  Dado que no existe ningún directorio de épica para "EPIC-77"
  Cuando ejecuto `/epic-analyze EPIC-77`
  Entonces el skill informa que "EPIC-77" no se encontró, indica la ruta buscada y no escribe ningún reporte
```

## Notas
- **Origen:** las historias STORY-120 a STORY-122 se especificaron dentro de [[EPIC-21-colapsar-specs-dos-niveles]] y se movieron a esta épica para aumentar la cohesión de ambas: `epic-analyze` no está relacionado con el colapso de `specs/` a dos niveles.
- **WIP = 1:** queda en `TODO` mientras EPIC-21 siga `IN-PROGRESS`.
- **Dependencias entre historias:**

| # | Historia | Depende de |
|---|----------|------------|
| 1 | STORY-120 (`epic-analyze` - Integridad de historias) | — |
| 2 | STORY-121 (`epic-analyze` - Cobertura de criterios de salida) | 1 |
| 3 | STORY-122 (`epic-analyze` - Madurez de historias hijas) | 1, 2 |

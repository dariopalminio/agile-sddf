---
alwaysApply: false
type: story
id: STORY-086
kind: chore
slug: STORY-086-refactor-release-to-epic
title: "Renombrar el nivel L2 de release a Ã©pica y numerar los directorios de specs"
status: COMPLETED
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-08-29
updated: 2026-08-30
related:
  - STORY-087
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]


# ðŸ“– Historia: Renombrar el nivel L2 de release a Ã©pica y numerar los directorios de specs

**Como** usuario de agile-sddf  
**Quiero** que el nivel L2 se llame **epics** (Ã©pica) y que los directorios de specs estÃ©n numerados por nivel de vuelo (`01-projects` / `02-epics` / `03-stories`)  
**Para** que el vocabulario del framework no colisione con el sentido CI/CD de "release" y la jerarquÃ­a de niveles sea evidente en el propio filesystem

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ La estructura numerada existe y los skills la resuelven
```gherkin
Dado un repositorio con SDDF instalado y SDDF_ROOT en su valor por defecto
Cuando se ejecuta cualquier skill de nivel L2 (epic-creation, epic-format-validation,
  epic-generate-stories, epic-generate-all-stories, epic-from-project-plan)
Entonces el skill resuelve sus rutas contra "$SPECS_BASE/specs/02-epics/"
  Y el artefacto de nivel L2 se llama "epic.md" con "type: epic" en su frontmatter
  Y no queda ninguna referencia a "release-*" como nombre de skill ni a "specs/releases/"
     en skills/, agents/, scripts/ ni package.json
```

### Escenario alternativo / error â€“ Vocabulario CI/CD preservado
```gherkin
Dado que "release" sigue siendo un tÃ©rmino vÃ¡lido en su sentido de despliegue
Cuando se revisa security-audit --scope release, docs/runbooks/deployment-to-npm.md
  y la secciÃ³n [Unreleased] del CHANGELOG
Entonces esas apariciones se conservan sin cambios
  Pero ninguna de ellas designa un work item de nivel L2
```

### Escenario â€“ Prefijo STORY y campo kind en el nivel L1
```gherkin
Dado el corpus de historias del repositorio
Cuando se listan los directorios con el glob "03-stories/STORY-*/story.md"
Entonces todas las historias quedan visibles bajo el prefijo STORY-NNN
  Y cada story.md declara "kind" con uno de: feat, fix, chore, hotfix
  Y el glob ya no ignora silenciosamente historias con otro prefijo
```

### Escenario â€“ El productor y el gate comparten contrato
```gherkin
Dado un project-plan.md con una secciÃ³n "## Propuesta de Ã‰picas"
Cuando se genera una Ã©pica con /epic-from-project-plan
  Y se valida el resultado con /epic-format-validation
Entonces el gate devuelve APROBADO sin retoques manuales
  Y el contrato validado (secciones y claves de frontmatter) se deriva del template en runtime
```

## âš™ï¸ Criterios no funcionales

* Trazabilidad: los renombres se hacen con `git mv` para preservar el historial.
* Compatibilidad: es un cambio incompatible; `package.json` sube a 2.0.0 (SemVer major) y el
  CHANGELOG documenta la migraciÃ³n manual para proyectos ya instalados.
* Encoding: todo archivo tocado queda en UTF-8 sin BOM.

## ðŸ“Ž Notas / contexto adicional

Ejecutada en cinco planes encadenados; cada uno narra el estado vigente en su momento:

| Plan | Alcance |
|---|---|
| `plan-01-refactor-release-to-epic.md` | Renombre de los 5 skills L2, `release.md` â†’ `epic.md`, `type: release` â†’ `type: epic` |
| `plan-02-refactor-dev-levels.md` | Directorios numerados `01-projects` / `02-epics` / `03-stories` |
| `plan-03-refactor-feat-to-story.md` | Prefijo `FEAT-` â†’ `STORY-` y campo `kind` |
| `plan-04-fix-insights.md` | AlineaciÃ³n del gate `epic-format-validation`, sus evals y la doc normativa |
| `plan-05-findings-and-remediation-plan.md` | RevisiÃ³n de la implementaciÃ³n: 14 hallazgos, correcciÃ³n de F-0 a F-11 |

Decisiones de arquitectura registradas en [[nivel-l2-epic-y-directorios-numerados]] (ADR-0004) y
[[prefijo-story-para-el-nivel-l1]] (ADR-0005). `FIX-001` se renumerÃ³ a `STORY-087` con `kind: fix`
porque su `001` colisionaba con `STORY-001`.

El `implement-report.md` es un documento histÃ³rico: contiene rutas e identificadores que ya no
existen porque eran correctos en el punto de la secuencia que narra.

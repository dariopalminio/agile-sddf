---
alwaysApply: false
type: story
id: STORY-096
kind: feat
slug: STORY-096-memory-system-scaffold-ensure-rebuild
title: "Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
status: VERIFY
substatus: DONE
parent: EPIC-20-memory-system
created: 2026-09-20
updated: 2026-09-23
related:
  - EPIC-20-memory-system
  - STORY-095-memory-system-index-alias
  - STORY-097-memory-system-check-ci
  - STORY-098-memory-system-migrate-harness
  - STORY-099-sddf-init-level-full
  - STORY-043-header-aggregation
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[STORY-095-memory-system-index-alias]]
[[STORY-097-memory-system-check-ci]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-099-sddf-init-level-full]]
[[STORY-043-header-aggregation]]
[[memory-system]]

# ðŸ“– Historia: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild

**Como** mantenedor de un proyecto SDDF cuya memoria en `docs/` estÃ¡ incompleta o desactualizada
**Quiero** que `memory-system` cree las once capas de memoria que falten (`scaffold`), las deje consistentes e indexadas en un solo paso (`ensure`, modo por defecto) y pueda regenerarlas desde cero solo con confirmaciÃ³n explÃ­cita (`rebuild --force`)
**Para** que cualquier proyecto tenga la estructura de memoria completa sin crearla a mano y sin riesgo de perder archivos existentes

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ modo `ensure` deja la memoria consistente en un solo paso

```gherkin
Dado un proyecto con `docs/` configurado y algunas capas de memoria ya presentes
Cuando ejecuto `/memory-system` (modo `ensure` por defecto)
Entonces el sistema detecta las capas faltantes entre las 11 esperadas (product, requirements, specs, domains, architecture, adr, policies, guardrails, guides, runbooks, templates)
  Y crea Ãºnicamente las capas y archivos faltantes
  Y regenera `docs/index.md` con wikilinks `[[slug]]` a todos los artefactos detectados
  Y no sobrescribe ningÃºn archivo existente
  Y reporta al final: creados N, preservados M, Ã­ndice regenerado S/N
```

### Escenario principal â€“ modo `scaffold` solo crea lo faltante y no indexa

```gherkin
Dado un proyecto sin `docs/constitution.md` ni `docs/product/`
Cuando ejecuto `/memory-system scaffold`
Entonces el sistema crea `docs/constitution.md` con frontmatter y contenido plantilla
  Y crea `docs/product/vision.md`, `docs/product/stakeholders.md` y `docs/product/objectives.md` con frontmatter inicial
  Y crea un `README.md` en cada capa faltante (`docs/domains/`, `docs/architecture/`, `docs/adr/`, etc.)
  Y crea las 6 plantillas base en `docs/templates/`
  Pero no regenera `docs/index.md` (el indexado es responsabilidad del modo `index`)
```

### Escenario alternativo / error â€“ modo `rebuild` requiere confirmaciÃ³n explÃ­cita

```gherkin
Dado un proyecto con memoria existente
Cuando ejecuto `/memory-system rebuild` sin `--force`
Entonces el sistema se detiene y muestra "âŒ rebuild es destructivo. AÃ±ade --force para confirmar."
  Y no modifica ningÃºn archivo
```

```gherkin
Dado un proyecto con memoria existente
Cuando ejecuto `/memory-system rebuild --force`
Entonces el sistema regenera todas las capas gestionadas por el scaffold y `docs/index.md` desde cero
  Y emite una advertencia clara de que los cambios manuales previos en esos archivos se han perdido
  Pero conserva intactos los artefactos de autor (ADRs, historias, guÃ­as, runbooks) que el scaffold no gestiona
```

### Requerimiento: Once capas de memoria

El scaffolding crea `product/`, `requirements/`, `specs/`, `domains/`, `architecture/`, `adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/` y `templates/`, mÃ¡s `constitution.md` en la raÃ­z de `docs/`.

### Requerimiento: Seis plantillas base

Las seis plantillas base de `docs/templates/` son `story-template.md`, `epic-template.md`, `project-template.md`, `project-intent-template.md`, `project-plan-template.md` (copiadas desde el skill dueÃ±o de cada una, con la misma regla no bloqueante que `sddf-init` cuando el dueÃ±o no estÃ¡ instalado) y `adr-template.md`.

### Requerimiento: Modos idempotentes y preservaciÃ³n

`scaffold`, `ensure` y `rebuild` verifican antes de escribir; ejecutar cualquiera dos veces seguidas produce el mismo resultado sin errores. Solo `rebuild --force` sobrescribe, y Ãºnicamente los archivos que el propio scaffold crea.

### Requerimiento: IntegraciÃ³n con `header-aggregation`

`ensure --fix-frontmatter` invoca `header-aggregation` en modo batch sobre `docs/` para normalizar frontmatters ausentes, sin abrir diÃ¡logos de merge sobre archivos que ya tienen frontmatter. Sin el flag no se invoca. `header-aggregation` no se modifica.

## âš™ï¸ Criterios no funcionales

* **Idempotencia:** ejecutar cualquier modo dos veces seguidas produce el mismo resultado y no genera errores.
* **PreservaciÃ³n:** ningÃºn modo, salvo `rebuild --force`, sobrescribe archivos existentes.
* **Trazabilidad:** `ensure` y `scaffold` reportan al final quÃ© se creÃ³ y quÃ© se preservÃ³.
* **Independencia de stack:** el skill no depende de `package.json`.
* **Portabilidad:** rutas relativas; sin dependencia de utilidades Unix (compatibilidad con Windows).
* **DocumentaciÃ³n:** `docs/architecture/memory-system.md` y `docs/guides/sddf-commands-pipeline.md` describen los tres modos y el alcance de `rebuild --force`.

## Fuera de alcance (Non-Goals)

- El modo `index` en sÃ­ y la detecciÃ³n de harness â†’ [[STORY-095-memory-system-index-alias]] (esta historia lo invoca desde `ensure` y `rebuild`).
- La adaptaciÃ³n del scaffolding a OpenSpec/Speckit (capas omitidas, archivos mapeados) â†’ [[STORY-098-memory-system-migrate-harness]]; aquÃ­ el scaffolding asume el layout `sddf`/`generic` completo.
- El modo `check` â†’ [[STORY-097-memory-system-check-ci]].
- Cambios en `header-aggregation` mÃ¡s allÃ¡ de documentar su invocaciÃ³n desde `memory-system`.
- La capa `rfcs/` y `requirement-template.md`: no forman parte de las once capas ni de las seis plantillas.

## ðŸ“Ž Notas / contexto adicional

**Origen del split:** historia hermana de la divisiÃ³n de la STORY-095 original; agrupa los tres modos que escriben la estructura de capas (`scaffold`), la componen con el indexado (`ensure`) o la regeneran (`rebuild`). Depende de que exista el skill `memory-system` con el modo `index` ([[STORY-095-memory-system-index-alias]]); si se implementa antes, `ensure` y `rebuild` deben omitir el paso de indexado con aviso.

**Decisiones heredadas del diseÃ±o previo** (`STORY-095-memory-system-index-alias/pre-split/design.md`, D-3 y D-6): el scaffold es una copia-si-falta de un Ã¡rbol semilla que vive en los assets del skill; `rebuild --force` sobrescribe solo ese Ã¡rbol semilla y regenera el Ã­ndice, nunca borra artefactos de autor.

**VerificaciÃ³n sugerida:**

1. `/memory-system ensure` en un proyecto vacÃ­o crea las 11 capas, `constitution.md`, 6 plantillas e `index.md`; una segunda ejecuciÃ³n reporta `creados 0`.
2. `/memory-system scaffold` no toca `index.md`.
3. `/memory-system rebuild` sin `--force` no cambia ningÃºn hash; con `--force` restaura los archivos semilla y conserva `ADR-*`/`STORY-*`.
4. `ensure --fix-frontmatter` procesa solo archivos sin frontmatter.

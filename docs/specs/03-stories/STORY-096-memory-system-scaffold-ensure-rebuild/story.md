---
alwaysApply: false
type: story
id: STORY-096
kind: feat
slug: STORY-096-memory-system-scaffold-ensure-rebuild
title: "Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-20-memory-system
created: 2026-09-20
updated: 2026-09-20
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

# 📖 Historia: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild

**Como** mantenedor de un proyecto SDDF cuya memoria en `docs/` está incompleta o desactualizada
**Quiero** que `memory-system` cree las once capas de memoria que falten (`scaffold`), las deje consistentes e indexadas en un solo paso (`ensure`, modo por defecto) y pueda regenerarlas desde cero solo con confirmación explícita (`rebuild --force`)
**Para** que cualquier proyecto tenga la estructura de memoria completa sin crearla a mano y sin riesgo de perder archivos existentes

## ✅ Criterios de aceptación

### Escenario principal – modo `ensure` deja la memoria consistente en un solo paso

```gherkin
Dado un proyecto con `docs/` configurado y algunas capas de memoria ya presentes
Cuando ejecuto `/memory-system` (modo `ensure` por defecto)
Entonces el sistema detecta las capas faltantes entre las 11 esperadas (product, requirements, specs, domains, architecture, adr, policies, guardrails, guides, runbooks, templates)
  Y crea únicamente las capas y archivos faltantes
  Y regenera `docs/index.md` con wikilinks `[[slug]]` a todos los artefactos detectados
  Y no sobrescribe ningún archivo existente
  Y reporta al final: creados N, preservados M, índice regenerado S/N
```

### Escenario principal – modo `scaffold` solo crea lo faltante y no indexa

```gherkin
Dado un proyecto sin `docs/constitution.md` ni `docs/product/`
Cuando ejecuto `/memory-system scaffold`
Entonces el sistema crea `docs/constitution.md` con frontmatter y contenido plantilla
  Y crea `docs/product/vision.md`, `docs/product/stakeholders.md` y `docs/product/objectives.md` con frontmatter inicial
  Y crea un `README.md` en cada capa faltante (`docs/domains/`, `docs/architecture/`, `docs/adr/`, etc.)
  Y crea las 6 plantillas base en `docs/templates/`
  Pero no regenera `docs/index.md` (el indexado es responsabilidad del modo `index`)
```

### Escenario alternativo / error – modo `rebuild` requiere confirmación explícita

```gherkin
Dado un proyecto con memoria existente
Cuando ejecuto `/memory-system rebuild` sin `--force`
Entonces el sistema se detiene y muestra "❌ rebuild es destructivo. Añade --force para confirmar."
  Y no modifica ningún archivo
```

```gherkin
Dado un proyecto con memoria existente
Cuando ejecuto `/memory-system rebuild --force`
Entonces el sistema regenera todas las capas gestionadas por el scaffold y `docs/index.md` desde cero
  Y emite una advertencia clara de que los cambios manuales previos en esos archivos se han perdido
  Pero conserva intactos los artefactos de autor (ADRs, historias, guías, runbooks) que el scaffold no gestiona
```

### Requerimiento: Once capas de memoria

El scaffolding crea `product/`, `requirements/`, `specs/`, `domains/`, `architecture/`, `adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/` y `templates/`, más `constitution.md` en la raíz de `docs/`.

### Requerimiento: Seis plantillas base

Las seis plantillas base de `docs/templates/` son `story-template.md`, `epic-template.md`, `project-template.md`, `project-intent-template.md`, `project-plan-template.md` (copiadas desde el skill dueño de cada una, con la misma regla no bloqueante que `sddf-init` cuando el dueño no está instalado) y `adr-template.md`.

### Requerimiento: Modos idempotentes y preservación

`scaffold`, `ensure` y `rebuild` verifican antes de escribir; ejecutar cualquiera dos veces seguidas produce el mismo resultado sin errores. Solo `rebuild --force` sobrescribe, y únicamente los archivos que el propio scaffold crea.

### Requerimiento: Integración con `header-aggregation`

`ensure --fix-frontmatter` invoca `header-aggregation` en modo batch sobre `docs/` para normalizar frontmatters ausentes, sin abrir diálogos de merge sobre archivos que ya tienen frontmatter. Sin el flag no se invoca. `header-aggregation` no se modifica.

## ⚙️ Criterios no funcionales

* **Idempotencia:** ejecutar cualquier modo dos veces seguidas produce el mismo resultado y no genera errores.
* **Preservación:** ningún modo, salvo `rebuild --force`, sobrescribe archivos existentes.
* **Trazabilidad:** `ensure` y `scaffold` reportan al final qué se creó y qué se preservó.
* **Independencia de stack:** el skill no depende de `package.json`.
* **Portabilidad:** rutas relativas; sin dependencia de utilidades Unix (compatibilidad con Windows).
* **Documentación:** `docs/architecture/memory-system.md` y `docs/guides/sddf-commands-pipeline.md` describen los tres modos y el alcance de `rebuild --force`.

## Fuera de alcance (Non-Goals)

- El modo `index` en sí y la detección de harness → [[STORY-095-memory-system-index-alias]] (esta historia lo invoca desde `ensure` y `rebuild`).
- La adaptación del scaffolding a OpenSpec/Speckit (capas omitidas, archivos mapeados) → [[STORY-098-memory-system-migrate-harness]]; aquí el scaffolding asume el layout `sddf`/`generic` completo.
- El modo `check` → [[STORY-097-memory-system-check-ci]].
- Cambios en `header-aggregation` más allá de documentar su invocación desde `memory-system`.
- La capa `rfcs/` y `requirement-template.md`: no forman parte de las once capas ni de las seis plantillas.

## 📎 Notas / contexto adicional

**Origen del split:** historia hermana de la división de la STORY-095 original; agrupa los tres modos que escriben la estructura de capas (`scaffold`), la componen con el indexado (`ensure`) o la regeneran (`rebuild`). Depende de que exista el skill `memory-system` con el modo `index` ([[STORY-095-memory-system-index-alias]]); si se implementa antes, `ensure` y `rebuild` deben omitir el paso de indexado con aviso.

**Decisiones heredadas del diseño previo** (`STORY-095-memory-system-index-alias/pre-split/design.md`, D-3 y D-6): el scaffold es una copia-si-falta de un árbol semilla que vive en los assets del skill; `rebuild --force` sobrescribe solo ese árbol semilla y regenera el índice, nunca borra artefactos de autor.

**Verificación sugerida:**

1. `/memory-system ensure` en un proyecto vacío crea las 11 capas, `constitution.md`, 6 plantillas e `index.md`; una segunda ejecución reporta `creados 0`.
2. `/memory-system scaffold` no toca `index.md`.
3. `/memory-system rebuild` sin `--force` no cambia ningún hash; con `--force` restaura los archivos semilla y conserva `ADR-*`/`STORY-*`.
4. `ensure --fix-frontmatter` procesa solo archivos sin frontmatter.

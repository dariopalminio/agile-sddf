---
alwaysApply: false
type: story
id: STORY-095
kind: feat
slug: STORY-095-memory-system-unificado
title: "Unificar la gestión de memoria en un skill memory-system con modos"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
created: 2026-09-20
updated: 2026-09-20
related:
  - EPIC-19-framework-consistency
  - STORY-044-directorio-docs-tipo-wiki
  - STORY-043-header-aggregation
  - STORY-054-inicializar-entorno-sddf
  - STORY-090-campos-declarados-nombran-su-escritor
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-044-directorio-docs-tipo-wiki]]
[[STORY-043-header-aggregation]]
[[STORY-054-inicializar-entorno-sddf]]
[[STORY-090-campos-declarados-nombran-su-escritor]]
[[memory-system]]

# 📖 Historia: Unificar la gestión de memoria en un skill memory-system con modos

**Como** mantenedor del framework SDDF que quiere ofrecer un sistema de memoria reutilizable por cualquier harness SDD

**Quiero** reemplazar el skill `docs-wiki-builder` por un skill unificado `memory-system` con modos `ensure`, `scaffold`, `index`, `check`, `migrate` y `rebuild`, manteniendo `header-aggregation` intacto y limitando el cambio en `sddf-init` a una invocación final

**Para** eliminar la fragmentación actual (el indexado vive en un skill y el scaffolding de capas no existe), ofrecer un único punto de entrada agnóstico al harness y habilitar la adopción de la memoria SDDF en proyectos OpenSpec o Speckit sin duplicar lógica

## ✅ Criterios de aceptación

### Escenario principal – `memory-system` reemplaza a `docs-wiki-builder` sin romper invocaciones existentes

```gherkin
Dado un proyecto con `docs-wiki-builder` instalado y utilizado en flujos previos
Cuando ejecuto `/docs-wiki-builder`
Entonces el sistema muestra la advertencia "⚠️ docs-wiki-builder está deprecado. Usa /memory-system index."
  Y delega la ejecución a `/memory-system index`
  Y produce el mismo `docs/index.md` (wikilinks regenerados) que `/memory-system index`
```

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

### Escenario principal – modo `check` es determinista y apto para CI

```gherkin
Dado un proyecto con memoria potencialmente inconsistente
Cuando ejecuto `/memory-system check`
Entonces el sistema reporta, sin escribir ningún archivo: capas faltantes, artefactos huérfanos (sin frontmatter válido), wikilinks rotos (slug inexistente) y frontmatters inválidos (campos obligatorios ausentes)
  Y devuelve exit code 1 si encuentra al menos un problema
  Y devuelve exit code 0 si todo está en orden
```

### Escenario alternativo – modo `migrate` detecta el harness y propone antes de escribir

```gherkin
Dado un proyecto que contiene `.specify/` (Speckit) pero no `sddf.config.yaml`
Cuando ejecuto `/memory-system migrate`
Entonces el sistema detecta el harness como `speckit`
  Y propone, sin escribir, un plan de migración: qué capas crear, qué archivos existentes preservar y qué mapear
  Y solicita confirmación antes de ejecutar el scaffolding
  Y al confirmar ejecuta el modo `scaffold` con la estructura adaptada al harness
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
Entonces el sistema regenera todas las capas y `docs/index.md` desde cero
  Y emite una advertencia clara de que los cambios manuales previos se han perdido
```

### Escenario alternativo – `sddf-init --level full` invoca `memory-system scaffold`

```gherkin
Dado un proyecto nuevo sin `sddf.config.yaml`
Cuando ejecuto `/sddf-init --level full`
Entonces `sddf-init` crea la configuración base y `.env.template`
  Y al finalizar invoca `/memory-system scaffold`
  Y la estructura resultante es idéntica a la de ejecutar `/sddf-init` seguido de `/memory-system scaffold`
```

### Escenario alternativo – compatibilidad con OpenSpec y Speckit

```gherkin
Dado un proyecto que usa OpenSpec (`openspec/`) o Speckit (`.specify/`)
Cuando ejecuto `/memory-system ensure --harness openspec`
Entonces el sistema crea las capas de memoria bajo `docs/` sin modificar nada dentro de `openspec/`
  Y no duplica los conceptos que OpenSpec ya modela (`changes/`, `specs/`)
  Y genera un `docs/index.md` que enlaza a los artefactos de OpenSpec mediante wikilinks
```

### Escenario – `header-aggregation` no se fusiona y sigue siendo invocable

```gherkin
Dado cualquier proyecto con el framework SDDF instalado
Cuando ejecuto `/header-aggregation --file docs/specs/03-stories/STORY-001/story.md`
Entonces el skill aplica el frontmatter estandarizado sin depender de `memory-system`
  Y sigue disponible como utilidad transversal para otros skills
```

### Requerimiento: Alias deprecado con retirada gradual

`docs-wiki-builder` deja de ser un skill autónomo y pasa a ser un alias de `memory-system index`. Durante al menos una versión minor el alias sigue funcionando y emite el aviso de deprecación; se elimina en la siguiente major.

### Requerimiento: Seis modos idempotentes

`memory-system` soporta los modos `ensure` (por defecto), `scaffold`, `index`, `check`, `migrate` y `rebuild`. Cada modo verifica antes de escribir y ejecutarlo dos veces seguidas produce el mismo resultado sin errores.

### Requerimiento: Detección de harness

El skill detecta el harness del proyecto (`sddf`, `speckit`, `openspec`, `generic`) a partir de la presencia de `sddf.config.yaml`, `.specify/` u `openspec/`. El parámetro `--harness` permite forzarlo. La estructura de memoria se adapta sin duplicar conceptos que el harness ya modela.

### Requerimiento: Once capas de memoria

El scaffolding crea `product/`, `requirements/`, `specs/`, `domains/`, `architecture/`, `adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/` y `templates/`, más `constitution.md` en la raíz de `docs/`.

### Requerimiento: Índice con wikilinks

El modo `index` regenera `docs/index.md` con enlaces `[[slug]]` a todos los artefactos detectados, respetando el patrón LLM Wiki ya definido por `docs-wiki-builder`.

### Requerimiento: Integración con `sddf-init`

`sddf-init --level full` invoca `memory-system scaffold` al finalizar. Los niveles `minimal` y `standard` no lo invocan. Hoy `sddf-init` no expone `--level`: introducir ese parámetro forma parte del cambio mínimo permitido en `sddf-init`.

### Requerimiento: Integración con `header-aggregation`

El modo `ensure` (y opcionalmente `scaffold`) puede invocar `header-aggregation --fix-frontmatter` para normalizar frontmatters ausentes o inválidos.

### Requerimiento: Salida parseable del modo `check`

El modo `check` produce salida parseable (JSON con `--json`) y exit code 1 si hay problemas, apto para CI.

## ⚙️ Criterios no funcionales

* **Idempotencia:** ejecutar cualquier modo dos veces seguidas produce el mismo resultado y no genera errores.
* **Preservación:** ningún modo, salvo `rebuild --force`, sobrescribe archivos existentes.
* **Independencia de stack:** el skill no depende de `package.json`; funciona en proyectos de cualquier lenguaje (Node, Python, Go, etc.).
* **Trazabilidad:** los modos `ensure` y `scaffold` reportan al final qué se creó y qué se preservó.
* **Documentación:** `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md` y `CHANGELOG.md` reflejan el nuevo skill, sus modos y la deprecación del alias.
* **Deprecación gradual:** el alias `docs-wiki-builder` sobrevive al menos una versión minor antes de eliminarse.
* **Portabilidad:** los comandos usan rutas relativas y no dependen de utilidades Unix, o degradan elegantemente si no están (compatibilidad con Windows).

## Fuera de alcance (Non-Goals)

- Cambios en `header-aggregation` más allá de documentar su invocación desde `memory-system`.
- Cambios en `sddf-init` salvo el parámetro `--level` y la invocación final cuando vale `full`.
- Migración automática de contenido entre harness (por ejemplo, transformar un proyecto Speckit en SDDF): el modo `migrate` solo hace scaffolding, no convierte artefactos.
- Índices derivados (`specs-index.json`) más allá del `index.md` de wikilinks.
- Interfaz gráfica o dashboard para consultar el índice.

## 📎 Notas / contexto adicional

**Origen:** `docs-wiki-builder` nació en STORY-044 para el indexado wiki de `docs/`; `header-aggregation` (STORY-043) normaliza frontmatter; `sddf-init` (STORY-054) crea la estructura base. Esta historia unifica el scaffolding y el indexado de memoria en un solo punto de entrada y deja las otras dos utilidades como colaboradores.

**Artefactos afectados (fuente en `skills/`, no en `.claude/`):**

| Artefacto | Cambio |
|-----------|--------|
| `skills/memory-system/` | Nuevo skill con seis modos y plantillas de las 11 capas y `constitution.md` |
| `skills/docs-wiki-builder/SKILL.md` | Deprecar: redirigir a `memory-system index` con aviso |
| `skills/sddf-init/SKILL.md` | Añadir `--level` e invocar `memory-system scaffold` cuando vale `full` |
| `skills/header-aggregation/SKILL.md` | Sin cambios funcionales; documentar su invocación desde `memory-system` |
| `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | Documentación del skill, sus modos y la deprecación |

**Verificación sugerida:**

1. Buscar `docs-wiki-builder` en `skills/` devuelve solo el alias deprecado.
2. `/memory-system ensure` en un proyecto vacío crea las 11 capas, `constitution.md`, 6 plantillas e `index.md`.
3. `/memory-system check` en ese proyecto devuelve exit code 0; tras romper un wikilink devuelve 1 y lo reporta.
4. `/docs-wiki-builder` produce el mismo `index.md` que `/memory-system index`, con aviso.
5. `/sddf-init --level full` produce la misma estructura que `/sddf-init` + `/memory-system scaffold`.
6. `/memory-system migrate --harness speckit` en un proyecto con `.specify/` propone un plan sin escribir.
7. `header-aggregation` sigue siendo invocable de forma independiente.

**Tamaño:** la historia agrupa seis modos, detección de harness, un alias deprecado y una integración con `sddf-init` (9 escenarios). Supera el umbral S de INVEST; candidata a `/story-split` por modo (p. ej. núcleo `index` + alias → `scaffold`/`ensure` → `check` → `migrate`/`rebuild` → integración `sddf-init`).

Referencias:
- Fuente de verdad: [[memory-system]] location: docs/architecture/memory-system.md

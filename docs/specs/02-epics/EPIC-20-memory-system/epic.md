---
alwaysApply: false
type: epic
id: EPIC-20
slug: EPIC-20-memory-system
title: "Memory System — Sistema de memoria unificado y agnóstico al harness"
status: DEFINE
substatus: TODO
parent: PROJ-01-agile-sddf
created: 2026-09-20
updated: 2026-09-20
related:
  - PROJ-01-agile-sddf
  - EPIC-19-framework-consistency
  - EPIC-09-docs-and-wiki-builders
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]
[[EPIC-19-framework-consistency]]
[[EPIC-09-docs-and-wiki-builders]]
[[memory-system]]

# Épica: Memory System — Sistema de memoria unificado y agnóstico al harness

## Descripción

La memoria del proyecto (`docs/`) está definida en `docs/architecture/memory-system.md` como once capas más `constitution.md`, pero ninguna herramienta la materializa ni la verifica: el indexado vive en `docs-wiki-builder` (inline, no reproducible y con un template obsoleto), el scaffolding de capas no existe, `sddf-init` solo crea `specs/` y `templates/`, y no hay forma determinista de detectar capas faltantes, frontmatters inválidos o wikilinks rotos. El objetivo de esta épica es reemplazar esa fragmentación por un único skill `memory-system` con modos (`index`, `scaffold`, `ensure`, `rebuild`, `check`, `migrate`) que funciona en cualquier harness (`sddf`, `speckit`, `openspec`, `generic`), deprecando `docs-wiki-builder` con retirada gradual y conectando el onboarding vía `sddf-init --level full`. `header-aggregation` se mantiene como utilidad independiente.

## Historias

- [x] **STORY-095 — Crear el skill memory-system con el modo index y deprecar docs-wiki-builder:** motor determinista con `index` y detección de harness; `docs/index.md` reproducible con wikilinks `[[slug]]`; `docs-wiki-builder` pasa a alias deprecado con aviso; `header-aggregation` intacto. — [[STORY-095-memory-system-index-alias]]
- [x] **STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild:** árbol semilla de once capas + `constitution.md` + seis plantillas; `ensure` (default) = scaffold + index sin sobrescribir; `rebuild --force` regenera solo archivos gestionados por el scaffold; `--fix-frontmatter` invoca `header-aggregation` en batch. — [[STORY-096-memory-system-scaffold-ensure-rebuild]]
- [x] **STORY-097 — Verificar la consistencia de la memoria con un modo check apto para CI:** reporta capas faltantes, huérfanos, frontmatters inválidos y wikilinks rotos sin escribir; salida `--json` y exit code 0/1/2. — [[STORY-097-memory-system-check-ci]]
- [x] **STORY-098 — Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate:** perfiles de harness (capas omitidas, mapeos, raíces externas indexadas); `migrate` propone un plan y pide confirmación antes de escribir; nunca toca los directorios del harness. — [[STORY-098-memory-system-migrate-harness]]
- [x] **STORY-099 — Inicializar la memoria completa desde sddf-init con el parámetro --level:** niveles `minimal | standard | full`; solo `full` invoca `memory-system scaffold`; el comportamiento por defecto no cambia. — [[STORY-099-sddf-init-level-full]]
- [ ] **STORY-100 — Descripción de la historia 100:** breve descripción de la historia 100. — [[STORY-100-slug]]
- [ ] **STORY-101 — Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill:** dividir `dod-story-checklist.md` en un archivo por etapa, referencia explícita desde cada `SKILL.md` y mapeo opcional en `sddf.config.yaml`. — [[STORY-101-dod-story-por-etapa]]

## Flujos Críticos / Smoke Tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### Escenario 1: Un proyecto vacío obtiene la memoria completa y verificada con dos comandos
**DADO** un directorio nuevo sin `docs/` ni `sddf.config.yaml`, con Node ≥ 18 disponible  
**CUANDO** se ejecuta `/memory-system ensure` y a continuación `/memory-system check`  
**ENTONCES** existen las once capas, `docs/constitution.md`, las seis plantillas en `docs/templates/` y `docs/index.md` con wikilinks a todo lo creado; `check` devuelve exit code 0; una segunda ejecución de `ensure` reporta `creados 0` sin errores

### Escenario 2: La deprecación de docs-wiki-builder no rompe invocaciones existentes
**DADO** un proyecto que invocaba `/docs-wiki-builder --update` en sus flujos  
**CUANDO** se ejecuta esa misma orden tras instalar esta versión  
**ENTONCES** se muestra "⚠️ docs-wiki-builder está deprecado. Usa /memory-system index." y el `docs/index.md` resultante es idéntico (salvo `updated`) al que produce `/memory-system index`

### Escenario 3: check detecta una memoria rota y bloquea en CI
**DADO** un proyecto con memoria consistente donde se introduce un wikilink `[[slug-inexistente]]` y se borra el frontmatter de una guía  
**CUANDO** se ejecuta `/memory-system check --json`  
**ENTONCES** la salida JSON tiene `ok: false`, lista un problema `broken-wikilink` y uno `orphan` con sus rutas, el exit code es 1 y ningún archivo de `docs/` cambia

### Escenario 4: Un proyecto OpenSpec adopta la memoria sin que se toque su harness
**DADO** un proyecto con `openspec/specs/` y `openspec/changes/` y sin `sddf.config.yaml`  
**CUANDO** se ejecuta `/memory-system ensure --harness openspec`  
**ENTONCES** se crean las capas bajo `docs/` sin `docs/specs/`, ningún archivo bajo `openspec/` cambia y `docs/index.md` enlaza los specs y changes de OpenSpec en una sección de artefactos externos

### Escenario 5: rebuild nunca destruye sin confirmación ni borra artefactos de autor
**DADO** un proyecto con `constitution.md` editado a mano y un `ADR-0001-*.md`  
**CUANDO** se ejecuta `/memory-system rebuild` y después `/memory-system rebuild --force`  
**ENTONCES** la primera orden se detiene con "❌ rebuild es destructivo. Añade --force para confirmar." sin cambiar ningún hash; la segunda restaura `constitution.md` a la semilla con advertencia explícita, conserva el ADR intacto y regenera el índice

## Requerimiento

- **Alias deprecado con retirada gradual:** `docs-wiki-builder` pasa a ser alias de `memory-system index`; sobrevive al menos una versión minor (entra en `3.3.0`) y se elimina en la siguiente major (`4.0.0`). Conserva un eval mínimo y sale de `config/eval-exemptions.json`.
- **Seis modos idempotentes:** `ensure` (default), `scaffold`, `index`, `check`, `migrate`, `rebuild`. Cada modo verifica antes de escribir; ejecutarlo dos veces produce el mismo resultado sin errores.
- **Preservación:** ningún modo sobrescribe archivos existentes salvo `rebuild --force`, y este solo sobrescribe los archivos que el scaffold gestiona (semillas y plantillas); ningún modo elimina archivos.
- **Agnóstico al harness:** detección `sddf | speckit | openspec | generic` con precedencia `--harness` > `sddf.config.yaml` > `.specify/` > `openspec/`; la estructura se adapta sin duplicar conceptos que el harness ya modela y sin escribir fuera de `docs/`.
- **Once capas de memoria:** `product/`, `requirements/`, `specs/`, `domains/`, `architecture/`, `adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/`, `templates/`, más `constitution.md` en la raíz de `docs/`, según `docs/architecture/memory-system.md`.
- **Seis plantillas base:** `story`, `epic`, `project`, `project-intent`, `project-plan` (copiadas desde el skill dueño, regla no bloqueante de `sddf-init`) y `adr`.
- **Índice con wikilinks:** `index` regenera `docs/index.md` completo con `[[slug]]` (patrón LLM Wiki), formato vigente `- [[slug]] — [archivo](ruta) — título`, nodos pendientes marcados sin bloquear.
- **`check` apto para CI:** solo lectura, salida parseable con `--json`, exit code 0 sin problemas / 1 con problemas / 2 ante error técnico.
- **Integraciones acotadas:** `sddf-init` solo añade `--level` y la invocación final en `full`; `header-aggregation` no cambia (se invoca desde `ensure --fix-frontmatter` en batch).
- **Independencia de stack y portabilidad:** sin dependencia de `package.json` (solo Node ≥ 18 en PATH, con degradación inline si falta); rutas relativas; mismo resultado en Windows y Linux.
- **Templates centrales:** Los templates de cada folder de cada capa del sistema de memoria DEBEN ser centrales en docs/templates/ (per ADR-0007).
- **Un README por capa:** Cada capa/folder  debe tener un README.md que haga de guía. El README es el que resuelve la discoverability y el "cómo se escribe", no la ubicación del template.
- **Modo scaffold:** El skill memory-system (modo scaffold) debe:
  1. Crear docs/templates/ con las plantillas base.
  2. Crear README.md en cada capa con una plantilla específica por capa.
  3. No crear templates dentro de las capas.
  4. Validar en modo check que:
    a. Cada capa tiene un README.
    b. Cada README enlaza a un template existente en docs/templates/.
    c. No hay templates huérfanos dentro de capas.

**Fuera de alcance:** migración automática de contenido entre harness (`migrate` solo hace scaffolding); reorganización de archivos `.md` dispersos (Flujo B de `docs-wiki-builder`); índices derivados (`specs-index.json`); interfaz gráfica; capa `rfcs/` y `requirement-template.md`.

## Impacto en Procesos Claves

- **Onboarding de proyectos:** `sddf-init --level full` deja la memoria completa en un comando; `minimal`/`standard` conservan el comportamiento actual. `/memory-system ensure` pasa a ser el comando recomendado tras `sddf-init` en `docs/guides/sddf-commands-pipeline.md`.
- **Mantenimiento de `docs/index.md`:** deja de mantenerse a mano; se regenera con `/memory-system index` (las descripciones manuales del índice actual se sustituyen por el `title` del frontmatter).
- **Integración continua:** `memory-system check --json` se puede añadir como gate que bloquea PRs con memoria inconsistente.
- **Ciclo de deprecación:** primer skill del framework con alias deprecado y calendario de retirada; `CHANGELOG.md` registra Added/Deprecated en `3.3.0` y la eliminación en `4.0.0`.
- **Adopción externa:** proyectos OpenSpec y Speckit pueden incorporar la memoria SDDF sin abandonar su harness.

## Dependencias Críticas (si las hay)

- **EPIC-19 Framework Consistency — contrato de raíz (STORY-093):** todos los modos resuelven `SPECS_BASE` con `SDDF-ROOT-RESOLUTION: v1` y `CLI_ROOT` por separado.  
  *Dueño:* mantenedor del framework  
  *Fecha compromiso:* cerrada (2026-09-12)
- **Orden interno de las historias:** 095 (motor + `index`) → 096 (`scaffold`/`ensure`/`rebuild`) → 097 (`check`) → 098 (`migrate`/harness) → 099 (`sddf-init --level`). Cada historia documenta cómo degrada si su predecesora no está implementada.  
  *Dueño:* mantenedor del framework  
  *Fecha compromiso:* al pasar cada historia a DELIVER
- **`docs/architecture/memory-system.md` como fuente de verdad de las capas:** las divergencias detectadas (invariante 2 `date` vs `created/updated`, `requirement-template.md`, `rfcs/`) se resuelven en la documentación de STORY-096 y STORY-097.  
  *Dueño:* mantenedor del framework  
  *Fecha compromiso:* al pasar STORY-097 a DELIVER

## Riesgos (opcional)

- **Regenerar `docs/index.md` pierde las descripciones escritas a mano:** – **Mitigación:** la primera regeneración se revisa con diff antes de commitear; las descripciones relevantes se trasladan al `title` del frontmatter de cada artefacto.
- **`rebuild --force` restaura `constitution.md` a plantilla en un proyecto real:** – **Mitigación:** gate `--force`, advertencia literal, alcance acotado a archivos semilla y recuperación desde git; documentado en `memory-system.md`.
- **`node` ausente en el proyecto consumidor:** – **Mitigación:** `SKILL.md` degrada a generación inline siguiendo `references/memory-rules.md` y avisa que `check` no puede devolver exit code.
- **Acoplamiento a los literales de las preguntas batch de `header-aggregation`:** – **Mitigación:** registrado como acoplamiento conocido en la nota de `header-aggregation`; un cambio en esas preguntas se propaga a `memory-system ensure`.
- **`SKILL.md` de `memory-system` supera 500 líneas con seis modos:** – **Mitigación:** secuencias en tablas compactas y reglas en `references/memory-rules.md` (< 300 líneas), verificado por el guardrail de skills.

**Criterios de éxito:**
- [ ] `grep -rn "docs-wiki-builder" skills/` devuelve solo el alias deprecado en `skills/docs-wiki-builder/SKILL.md`.
- [ ] `/memory-system ensure` en un proyecto vacío crea las 11 capas, `constitution.md`, 6 plantillas e `index.md`; repetido reporta `creados 0`.
- [ ] `/memory-system check` en ese proyecto devuelve exit code 0; tras romper un wikilink devuelve 1 y lo reporta en `--json`.
- [ ] `/docs-wiki-builder` produce el mismo `index.md` que `/memory-system index`, con aviso.
- [ ] `/sddf-init --level full` produce la misma estructura que `/sddf-init` + `/memory-system scaffold`; sin `--level` no hay cambios.
- [ ] `/memory-system migrate --harness speckit` en un proyecto con `.specify/` propone un plan sin escribir.
- [ ] `/memory-system ensure --harness openspec` no modifica nada bajo `openspec/` e indexa sus artefactos.
- [ ] `header-aggregation` sigue siendo invocable de forma independiente.
- [ ] `docs/index.md` de este repositorio regenerado con `/memory-system index` y `npm run verify:links` en verde.

## Notas adicionales

- **Origen:** esta épica nace de la STORY-095 original ("Unificar la gestión de memoria en un skill memory-system con modos", parent EPIC-19), que superaba el tamaño S de INVEST y fue dividida con `/story-split` en las cinco historias listadas. Los artefactos de planning del alcance completo se conservan en `docs/specs/03-stories/STORY-095-memory-system-index-alias/pre-split/` como referencia de decisiones (motor Node sin dependencias, tabla de perfiles de harness, reglas de slug, alcance de `rebuild`).
- **Fuente de skills:** los artefactos afectados viven en `skills/` (raíz del repositorio), no en `.claude/skills/`; el instalador los copia al runtime.
- **Versión objetivo:** `3.3.0` para las cinco historias; retirada del alias `docs-wiki-builder` en `4.0.0`.
- **Relación con EPIC-09 (Docs & wiki builders):** `docs-wiki-builder` (STORY-044) y `header-aggregation` (STORY-043) nacieron allí; esta épica los reorganiza sin invalidar esas historias.


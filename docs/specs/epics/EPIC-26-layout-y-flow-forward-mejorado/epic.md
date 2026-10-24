---
type: epic
id: EPIC-26
slug: EPIC-26-layout-y-flow-forward-mejorado
title: "Layout y flow-forward mejorado"
status: DEFINE
substatus: DONE
parent: null
created: 2026-10-21
updated: 2026-10-23
related: []
---

# Épica: Layout y flow-forward mejorado


## Objetivo

Separar el conocimiento (docs/) de las especificaciones y estado de los work items (specs/) con un layout fijo y no configurable, como base para consolidar la capacidad de flow-forward y habilitar posteriormente Living Spec.

## Alcance

Separar conocimiento de estado fijando tres raíces hermanas en la raíz del repositorio: `docs/` (conocimiento), `specs/` (estado: `specs/flow/` plano y `specs/living/` reservado) y `workflow/` (proceso, reservado). El layout deja de ser configurable: se retiran `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y la variable `SPECS_BASE`. Todos los skills pasan a leer y escribir en rutas fijas (`specs/flow/EPIC-NN-<slug>/`, `specs/flow/STORY-NNN-<slug>/`, `docs/templates/`, `docs/guardrails/`). `/sddf-init` crea el nuevo layout y, si detecta el layout legado (`docs/specs/`), no crea una estructura paralela: emite un aviso de deprecación y remite a la guía de migración. Una migración única y reproducible mueve con `git mv` el contenido de `docs/specs/` a `specs/flow/` y envía las stories `COMPLETED` a `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`. La épica deja preparado el terreno para la épica de Workflow (archivado) y la épica de Living Spec, sin implementarlas.

## Historias

- [x] **STORY-147** — ADR del layout fijo de tres raíces: Crear un ADR que fija `docs/`, `specs/` (`flow/`, `flow/archive/`, `living/`) y `workflow/` como raíces hermanas en la raíz del repo, retira `SDDF_ROOT` / `root` / `SPECS_BASE` y reemplaza a ADR-0010 (`superseded-by`)
- [x] **STORY-148** — Contrato de rutas fijas y gate determinista: Sustituir el bloque `SDDF-ROOT-RESOLUTION: v1` por un contrato de layout fijo que solo resuelve `REPO_ROOT`, y adaptar `scripts/audit-root-resolution.js` (o su reemplazo) y `verify:repository` para validarlo en todos los skills
- [x] **STORY-149** — sddf-init crea el nuevo layout: `/sddf-init` crea `specs/flow/`, `specs/flow/archive/`, `specs/living/` (vacío) y `workflow/` en `REPO_ROOT`, mantiene los templates en `docs/templates/`, deja de escribir la clave `root` en `sddf.config.yaml` y deja de usar `SPECS_BASE`/`SDDF_ROOT` en su skill, assets y evals; si ya existe `docs/specs/`, emite un aviso de deprecación, no crea `specs/flow/` en paralelo y remite a la guía de migración
- [x] **STORY-150** — Migrar los skills de especificación a specs/flow: `story-creation`, `story-evaluation`, `story-refine`, `story-improve`, `story-split` y `story-specify` (con sus subagentes) dejan de usar `SPECS_BASE` y leen/escriben en `specs/flow/STORY-NNN-<slug>/`; se actualizan sus evals
- [x] **STORY-151** — Migrar los skills de épica a specs/flow: `epic-creation`, `epic-format-validation`, `epic-from-project-plan`, `epic-generate-stories`, `epic-generate-all-stories`, `epic-analyze` y `epic-refine` dejan de usar `SPECS_BASE` y leen/escriben en `specs/flow/EPIC-NN-<slug>/`; la búsqueda de stories hijas cubre `specs/flow/` y `specs/flow/archive/`; se actualizan sus evals
- [x] **STORY-152** — Migrar los skills de proyecto y transversales: `project-*`, `memory-system`, `header-aggregation`, `reverse-engineering`, `sddf-constitution` y `skill-preflight` usan rutas fijas; `skill-preflight` diagnostica el layout legado (`docs/specs/`, `root`, `SDDF_ROOT`) y apunta a la guía de migración; el alias deprecado `docs-wiki-builder` se elimina en lugar de migrarse
- [ ] **STORY-153** — Migrar y archivar los work items a specs/flow: Script reproducible de un solo uso (con `--dry-run`, idempotente) que hace `git mv` de las épicas a `specs/flow/EPIC-*/`, de las stories no `COMPLETED` a `specs/flow/STORY-*/` y de las `COMPLETED` a `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` y elimina `docs/specs/`; sin eventos ni log
- [ ] **STORY-154** — Documentar el nuevo layout: Actualizar `AGENTS.md` (layout fijo, convención `<YYYY-MM-DD>-STORY-NNN-<slug>/` de `archive/`, nota de que `docs/requirements/` migrará a `specs/living/` en la épica de Living Spec), `docs/architecture/sddf-architecture.md`, `docs/index.md`, las guías afectadas, el CHANGELOG (cambio incompatible, versión mayor) y una sección nueva de migración en `docs/guides/artifact-directory-migration.md` para proyectos que usan `root: docs` o `docs/specs/`
- [x] **STORY-155** — Migrar los skills de planning a specs/flow: `story-design`, `story-tasking`, `story-testcases`, `story-analyze`, `story-fix-plan` y `story-plan` (con sus subagentes) dejan de usar `SPECS_BASE` y leen/escriben en `specs/flow/STORY-NNN-<slug>/`; se actualizan sus evals
- [x] **STORY-156** — Migrar los skills de implementación a specs/flow: `story-implement` y `story-implement-tasks` dejan de usar `SPECS_BASE` y escriben `implement-report.md` en `specs/flow/STORY-NNN-<slug>/`; se actualizan sus evals
- [ ] **STORY-157** — Reparar enlaces y validar el gate tras la migración: Reescribir los enlaces y wikilinks hacia las rutas movidas de `docs/specs/`, verificar el historial con `git log --follow` y cerrar la épica comprobando el contrato de salida global (grep de raíz legada sobre `skills/`, lista transitoria del gate vacía, `npm test` y `verify:repository` en verde)
- [ ] **STORY-158** — Migrar los skills de revisión, verificación y aceptación a specs/flow: `story-code-review`, `story-verify` y `story-acceptance` (con sus agentes locales) dejan de usar `SPECS_BASE` y escriben sus informes en `specs/flow/STORY-NNN-<slug>/`; se actualizan sus evals

## Criterios de salida

- [ ] **CS-1** — Existe un ADR nuevo `ACCEPTED` del layout fijo y ADR-0010 queda reemplazado (`superseded-by`) sin editarse su contenido.
- [ ] **CS-2** — `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/` no devuelve coincidencias, salvo las menciones de diagnóstico del layout legado en `skill-preflight`.
- [ ] **CS-3** — Ningún skill lee la clave `root` de `sddf.config.yaml`, y `sddf-init` ya no la escribe.
- [ ] **CS-4** — `docs/specs/` no existe; `specs/flow/` contiene todas las épicas (`EPIC-NN-<slug>/`) y las stories no `COMPLETED` (`STORY-NNN-<slug>/`), sin subniveles `epics/` ni `stories/`.
- [ ] **CS-5** — `specs/flow/archive/` contiene exactamente las stories que tenían `status: COMPLETED` antes de migrar, cada una como `<YYYY-MM-DD>-STORY-NNN-<slug>/`; el total de stories (activas + archivadas) es igual al previo a la migración.
- [ ] **CS-6** — La migración se hizo con `git mv`: `git log --follow` sobre un `story.md` archivado muestra su historial previo.
- [ ] **CS-7** — El script de migración admite `--dry-run` y es idempotente: ejecutarlo de nuevo sobre el repo migrado no produce cambios.
- [ ] **CS-8** — `/sddf-init` en un repo limpio crea `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` en la raíz (con `.gitkeep` para que git los versione), y no crea `docs/specs/`.
- [ ] **CS-9** — `AGENTS.md` documenta el layout fijo, la convención `<YYYY-MM-DD>-STORY-NNN-<slug>/` de `archive/` y el destino final de `docs/requirements/` en `specs/living/`.
- [ ] **CS-10** — `docs/requirements/` permanece sin cambios de ubicación ni contenido.
- [ ] **CS-11** — No se crea ningún skill ni script de archivado reutilizable; el único script nuevo de movimiento es la migración de un solo uso.
- [ ] **CS-12** — `npm test` y `npm run verify:repository` (incluido el chequeo de enlaces) terminan en verde.
- [ ] **CS-13** — `/sddf-init` sobre un repo con `docs/specs/` emite un aviso de deprecación que remite a la guía de migración, no crea `specs/flow/` y no modifica `docs/specs/`.
- [ ] **CS-14** — `docs/guides/artifact-directory-migration.md` incluye una sección de migración al layout fijo (de `docs/specs/` a `specs/flow/` y retiro de `root`), y el CHANGELOG la enlaza como cambio incompatible.

## Smoke tests

### SMOKE-1 — story-specify escribe en specs/flow
```gherkin
Escenario: Especificar la primera historia en un repo limpio
  Dado un repositorio limpio inicializado con /sddf-init
  Cuando el usuario ejecuta /story-specify para una historia nueva
  Entonces se crea specs/flow/STORY-001-<slug>/story.md
  Y no existe docs/specs/stories/
```

### SMOKE-2 — epic-creation escribe en specs/flow
```gherkin
Escenario: Crear la primera épica en un repo limpio
  Dado un repositorio limpio inicializado con /sddf-init
  Cuando el usuario ejecuta /epic-creation para una épica nueva
  Entonces se crea specs/flow/EPIC-01-<slug>/epic.md
  Y no existe docs/specs/epics/
```

### SMOKE-3 — sddf-init crea el layout de tres raíces
```gherkin
Escenario: Inicializar SDDF en un proyecto nuevo
  Dado un repositorio sin estructura SDDF
  Cuando el usuario ejecuta /sddf-init
  Entonces existen specs/flow/, specs/flow/archive/, specs/living/ y workflow/ en la raíz
  Y sddf.config.yaml no declara la clave root
```

### SMOKE-4 — Migración archiva las stories completadas
```gherkin
Escenario: Migrar los work items del repositorio
  Dado docs/specs/ con stories COMPLETED y stories en otros estados
  Cuando se ejecuta el script de migración única
  Entonces cada story COMPLETED queda en specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/
  Y cada story en otro estado queda en specs/flow/STORY-NNN-<slug>/
  Y docs/specs/ deja de existir
```

### SMOKE-5 — El gate determinista sigue verde
```gherkin
Escenario: Verificar el repositorio tras la migración
  Dado el repositorio con el layout migrado
  Cuando se ejecuta npm run verify:repository
  Entonces el gate termina sin errores ni enlaces rotos
```

### SMOKE-6 — sddf-init no duplica el layout en un proyecto sin migrar
```gherkin
Escenario: Inicializar SDDF en un proyecto con el layout legado
  Dado un repositorio que ya tiene docs/specs/
  Cuando el usuario ejecuta /sddf-init
  Entonces se emite un aviso de deprecación con la ruta de la guía de migración
  Y no se crea specs/flow/
  Y docs/specs/ queda sin cambios
```

## Notas

- **Decisión de layout:** de las dos opciones planteadas se adopta la de rutas fijas (sin `SDDF_ROOT`, `root` ni `SPECS_BASE`), que es la que exigen las historias de skills. `root: .` se descarta porque mantiene un mecanismo de configuración que ya no aporta. Es un cambio incompatible para los proyectos que usan `root: docs`: requiere versión mayor y guía de migración.
- **Compatibilidad hacia atrás:** mejora-013 propone una fase de compatibilidad con un resolver que respete `specs_root`, luego `root` y luego `docs`. Se descarta porque reintroduce la configuración que esta épica retira. La mitigación adoptada es detectar sin escribir: `/sddf-init` avisa y no crea estructura paralela (CS-13), `skill-preflight` diagnostica el layout legado y la guía de migración (CS-14) explica el paso a `specs/flow/`. La migración no se ejecuta sola en proyectos instalados; el script de migración única es del repo.
- **Numeración de épicas:** mejora-013 llama EPIC-1..EPIC-4 a la secuencia Layout → Workflow → Living → Enforcement. Esta épica es su EPIC-1. Las demás se citan por nombre (épica de Workflow, de Living Spec, de Enforcement) para no confundirlas con EPIC-02 y EPIC-03, que ya existen en el repo.
- **Nombre de directorio:** se conserva la convención vigente `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/` (ADR-0004). Por eso el criterio pedido ("`/story-specify` en un repo limpio crea `specs/flow/STORY-001/story.md`") se expresa en SMOKE-1 como `specs/flow/STORY-001-<slug>/story.md`. Si se prefiere el directorio sin slug, hay que decidirlo en el ADR antes de planificar.
- **Fecha del prefijo de archivo:** se usa el `updated:` del frontmatter de la story; si falta, `created:`. Así la migración es determinista y no depende del momento en que se ejecute.
- **Estados distintos de `COMPLETED`:** por la regla pedida, `CANCELED` y el resto de estados quedan en `specs/flow/`. Si las canceladas deben archivarse, lo decide la épica de Workflow.
- **Épicas:** se aplanan a `specs/flow/EPIC-*/` pero no se archivan; el archivado de épicas (solo cuando todas sus stories están archivadas) queda para la épica de Workflow.
- **Nombres de skills:** `epic-specify`, `epic-plan` y `epic-implement` no existen hoy. La historia de épicas cubre los skills `epic-*` que sí existen (verificado con `ls skills/`).
- **Fuera de alcance:** el skill/script de archivado, el estado `ARCHIVED`, `.counters.json`, `next-id`, `workflow/log.jsonl`, `state-machine.yaml`, el board y quitar `status:` del frontmatter (épica de Workflow); la conversión de `docs/requirements/` a `specs/living/` (épica de Living Spec); la validación de `sddf.config.yaml` y de rutas viejas en `/memory-system check` (épica de Enforcement).
- **Fuentes:** `.temp/propuestas-de-mejoras/living-spec/mejora-012-refactor-for-living-spec.md` (Fases 1-2 y §5.1-5.2) y `.temp/propuestas-de-mejoras/living-spec/mejora-013-refactor-for-living-spec-02.md` (EPIC-1 y riesgo de compatibilidad hacia atrás).

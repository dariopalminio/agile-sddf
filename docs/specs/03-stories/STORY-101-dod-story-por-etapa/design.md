---
alwaysApply: false
type: design
id: STORY-101
slug: STORY-101-dod-story-por-etapa-design
title: "Design: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill"
date: 2026-09-24
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-101
related:
  - STORY-101-dod-story-por-etapa
  - STORY-097-memory-system-check-ci
  - STORY-098-memory-system-migrate-harness
  - memory-system
  - state-machine
---

<!-- Referencias -->
[[STORY-101-dod-story-por-etapa]] · [[STORY-097-memory-system-check-ci]] · [[STORY-098-memory-system-migrate-harness]] · [[memory-system]] · [[state-machine]]

# Diseño técnico: DoD de Story dividido en un guardrail por etapa

## Context

El DoD de historia vive en un único archivo, `docs/guardrails/dod-story-checklist.md` (`type: guardrail`,
`kind: transition`, `enforcement: error`), con seis secciones `### Definition of Done para el estado <X>`
más el bloque `## 🚀 Criterios de Despliegue en Producción`. Cada skill consumidor lo carga entero y
extrae "la sección que contiene el término `<X>`". Además, `AGENTS.md` lo importa con
`@docs/guardrails/dod-story-checklist.md`, así que **cada sesión** carga las ~140 líneas.

Criterios de aceptación de la historia, numerados para la trazabilidad de este diseño:

| AC | Escenario |
|---|---|
| AC-1 | División en un archivo por etapa, con frontmatter `type/kind/enforcement/from/to/applies-to` y autocontenido |
| AC-2 | Cada skill referencia explícitamente su DoD en una sección `## DoD aplicable` (Opción A); ningún `SKILL.md` referencia el monolítico |
| AC-3 | Mapeo `guardrails.dod.story` en `sddf.config.yaml` con precedencia config → convención (Opción C) |
| AC-4 | Orden corregido: `CODE-REVIEW` antes de `VERIFY` en `from`/`to` |
| AC-5 | El checklist de release se convierte en `dod-story-release.md` (`kind: content`, `applies-to: release`) |
| AC-6 | Enlaces `../guardrails/gr-*.md` convertidos en wikilinks `[[gr-*]]` |
| AC-7 | El monolítico se conserva una minor como índice deprecado; CHANGELOG documenta la deprecación |
| AC-8 | `memory-system migrate --from=dod-monolithic` es idempotente: sin `--force` no sobrescribe |

Requerimientos funcionales y no funcionales: CF-01…CF-08 y CNF-01…CNF-07 de `story.md`.

**Consumidores reales del DoD hoy** (verificado con `grep` sobre `skills/`, la fuente única según
`AGENTS.md`; `.claude/skills/` y `.agents/skills/` son salida de `agile-sddf install`):

| Skill | Sección del monolítico que usa | Cómo |
|---|---|---|
| `story-design` | ninguna concreta ("criterios de calidad mínimos") | lectura de contexto |
| `story-analyze` | PLAN | quality gate antes de `READY-FOR-IMPLEMENT/DONE` |
| `story-implement` | IMPLEMENT | quality gate antes de `IMPLEMENT/DONE` |
| `story-implement-tasks` | IMPLEMENT | quality gate |
| `story-code-review` (+ 4 agentes locales vía `$DOD_PATH`) | CODE-REVIEW | quality gate |
| `story-verify` | VERIFY | quality gate, con fallback genérico |
| `story-acceptance` | ACCEPTANCE | criterios de la sesión manual |
| `story-specify`, `story-plan` | ninguna | no leen el DoD |
| `project-policies-generation` | todo el archivo | lo **genera** desde `assets/dod-story-checklist-template.md` |
| `sddf-init` | — | lo nombra en la pregunta de políticas y en el informe |

No existe ningún skill `story-release` (`ls skills/`), y la máquina de estados canónica
([[state-machine]]) no tiene estado `RELEASE`: tras `ACCEPTANCE` viene `DELIVER`, transición manual.
El bloque de despliegue del monolítico gobierna la **publicación en npm**, no una transición de historia.

Todos los consumidores conservan hoy un fallback a la ruta heredada `policies/dod-story.md`,
introducida como deprecación en la misma `3.3.0 [Unreleased]`.

## Goals / Non-Goals

**Goals:**

- Seis guardrails de transición (`dod-story-<etapa>.md`) + un guardrail de contenido
  (`dod-story-release.md`), generados **por la migración**, no a mano. // satisface: AC-1, AC-5
- Cada skill consumidor declara su etapa y la ruta de su DoD en `## DoD aplicable` y carga solo ese
  archivo. // satisface: AC-2, CNF-01
- Mapeo sobrescribible en `sddf.config.yaml › guardrails.dod.story`. // satisface: AC-3
- Cadena `from`/`to` verificable por `memory-system check`. // satisface: AC-4, CF-08
- Migración determinista e idempotente como modo de `memory-system`. // satisface: AC-8, CF-07
- Proyectos consumidores nuevos reciben directamente el DoD dividido. // satisface: AC-3, CNF-04

**Non-Goals:**

- Modificar el contenido de los criterios (solo se mueven; las únicas transformaciones son las de D-4).
- Modificar los `gr-*-checklist.md`, la máquina de estados o el DoD de épica/proyecto.
- Crear un skill `story-release` (ver CR-001).
- Resolver la deuda previa de `check` (10 problemas declarados en STORY-100).
- Reescribir artefactos de historias cerradas que citan `dod-story-checklist.md` (registro histórico).

## Decisions

### D-1 — Tabla de etapas como dato único: `DOD_STAGES`

Un solo arreglo de datos describe las siete entradas; la migración, `check` y la documentación se
derivan de él. // satisface: AC-1, AC-4, AC-5

> Actualizada por I-11: `from`/`to` expresan la transición de cierre de la etapa y `release` pasó a `deliver`.

| `stage` (clave config) | Sección origen del monolítico | `status` | `from` | `to` | `enforcement` | `kind` | `applies-to` | Skills consumidores |
|---|---|---|---|---|---|---|---|---|
| `specify` | `### Definition of Done para el estado SPECIFY` | `SPECIFY` | `SPECIFY/IN-PROGRESS` | `SPECIFY/DONE` | `warn` | `transition` | `story` | `story-specify` |
| `plan` | `… estado PLAN` | `PLAN` | `PLAN/IN-PROGRESS` | `PLAN/DONE` | `error` | `transition` | `story` | `story-plan`, `story-design`, `story-analyze` |
| `implement` | `… estado IMPLEMENT` | `IMPLEMENT` | `IMPLEMENT/IN-PROGRESS` | `IMPLEMENT/DONE` | `error` | `transition` | `story` | `story-implement`, `story-implement-tasks` |
| `code-review` | `… estado CODE-REVIEW` | `CODE-REVIEW` | `CODE-REVIEW/IN-PROGRESS` | `CODE-REVIEW/DONE` | `error` | `transition` | `story` | `story-code-review` |
| `verify` | `… estado VERIFY` | `VERIFY` | `VERIFY/IN-PROGRESS` | `VERIFY/DONE` | `error` | `transition` | `story` | `story-verify` |
| `acceptance` | `… estado ACCEPTANCE` | `ACCEPTANCE` | `ACCEPTANCE/IN-PROGRESS` | `ACCEPTANCE/DONE` | `error` | `transition` | `story` | `story-acceptance` |
| `deliver` | `## 🚀 Criterios de Despliegue en Producción` | — | — | — | `error` | `content` | `deliver` | — (sin skill por ahora; ver CR-001) |

Semántica de `from`/`to`: un DoD es la condición para **cerrar** su etapa, así que protege la transición
`<ETAPA>/IN-PROGRESS` → `<ETAPA>/DONE` que escribe el skill que lo evalúa. `status` (la etapa sin
substatus) es la clave con la que la migración reconoce las secciones del monolítico. El orden de las filas
es el orden canónico `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE`; lo fija la tabla,
y R2 de D-6 verifica que cada archivo declare exactamente la transición de su etapa.

`enforcement` por etapa: `error` conserva el comportamiento actual (todo el monolítico era `error`).
`specify` es `warn` porque es una compuerta **nueva** (hoy `story-specify` no lee DoD): informa sin
bloquear durante la minor de introducción.

| Alternativa | Por qué se descarta |
|---|---|
| Frontmatter escrito a mano en cada archivo, sin tabla | Siete fuentes de verdad para el mismo orden; `check` no tendría contra qué validar la cadena. |
| `from`/`to` con todos los estados (incluido `READY-FOR-IMPLEMENT`) | Obligaría a un DoD vacío para el buffer o rompería la cadena; el AC-4 expresa el orden solo con etapas. |
| `enforcement: error` también en `specify` | Convertiría una compuerta nueva en bloqueante sin periodo de adopción. |

### D-2 — Módulo de dominio `dod-story.js`, invocado por el motor de `memory-system`

Nuevo módulo `skills/memory-system/scripts/dod-story.js` (solo módulos nativos, CommonJS como el
motor). Contiene `DOD_STAGES`, el planificador de la división, el lector del mapeo de config y el
evaluador de `check`. `memory-system.js` solo añade el despacho. // satisface: AC-1, AC-3, AC-8, CF-07, CF-08

| Alternativa | Por qué se descarta |
|---|---|
| Todo dentro de `memory-system.js` | El motor ya tiene 988 líneas de lógica genérica de memoria; el DoD es un artefacto concreto con su propio vocabulario (etapas, secciones, cadena). |
| Script independiente en `scripts/` del repo | No llega a los consumidores como parte del skill y la historia exige el modo `memory-system migrate --from=dod-monolithic`. |
| Un skill nuevo `dod-migrate` | Duplica resolución de raíz, guardia de escritura y formato de informe que el motor ya tiene. |

### D-3 — `migrate --from dod-monolithic` como subcomando del motor

El `migrate` actual (Speckit/OpenSpec) es una **secuencia del `SKILL.md`** sobre `scaffold`, no un
subcomando del motor (STORY-098 D-3). Esta historia añade el subcomando del motor `migrate`, que
**exige** `--from` y solo admite `dod-monolithic`. En el `SKILL.md`:

- `migrate` **sin** `--from` → secuencia de harness existente (sin cambios).
- `migrate --from=dod-monolithic` (o `--from dod-monolithic`) → invoca
  `node scripts/memory-system.js migrate --root <SPECS_BASE> --from dod-monolithic [--dry-run] [--force]`.
  El skill normaliza la forma `--from=valor` a `--from valor`; el motor no admite `=` en ningún flag
  y no se cambia ese contrato.

Origen de la migración, por precedencia: `$SPECS_BASE/guardrails/dod-story-checklist.md` →
`$SPECS_BASE/policies/dod-story.md` (ubicación heredada). Así la migración absorbe también la
deprecación anterior y los skills pueden eliminar su fallback a `policies/`. // satisface: AC-7, AC-8

Salida (etiquetas de `scaffold` más `[REEMPLAZADO]`, con su propio contador `reemplazados`; el reemplazo del origen por el índice no cuenta como `sobrescritos`, que queda reservado a `--force`):

```
── memory-system migrate ── from: dod-monolithic · root: docs
[CREADO]      guardrails/dod-story-specify.md
[PRESERVADO]  guardrails/dod-story-plan.md
[REEMPLAZADO] guardrails/dod-story-checklist.md — índice deprecado
────────────────────────────────────────────────
creados: 6 · sobrescritos: 0 · preservados: 1 · reemplazados: 1
```

Con `--dry-run`: `[CREARÍA]`/`[PRESERVARÍA]`/`[REEMPLAZARÍA]` y una línea final
`cambios pendientes: N` (N = creaciones + reemplazos). Tras una migración completa, `N = 0`
(Verificación 6 de la historia).

Exit codes: 0 éxito (incluido "nada que hacer"); 1 si alguna entrada queda `[SIN ORIGEN]` o
`[NO MIGRADO]` (ver D-5); 2 ante error de uso (flag `--from` ausente o con otro valor, raíz inexistente).

| Alternativa | Por qué se descarta |
|---|---|
| Subcomando del motor `split-dod` | La superficie del skill quedaría `migrate --from` → `split-dod`: dos nombres para lo mismo. |
| Implementar la división en el `SKILL.md` (LLM) | No determinista ni idempotente verificable; CNF-02 y AC-8 exigen resultado reproducible. |
| Aceptar `--flag=valor` en `parseArgs` | Cambia el contrato de todos los subcomandos para un único caso. |

### D-4 — Reglas de transformación del contenido

Para cada fila de `DOD_STAGES`, el planificador toma el bloque desde su encabezado origen hasta el
siguiente encabezado de nivel igual o superior (o `---` separador de etapa) y compone el archivo
destino:

1. **Frontmatter** generado desde la fila: `type: guardrail`, `kind`, `enforcement`, `from`, `to`
   (omitidos en `release`), `applies-to`, `slug: dod-story-<stage>`, `title`,
   `created`/`updated` = `--date` o fecha actual. // satisface: AC-1, AC-5
2. **Título** `# DoD <ETAPA> — Story` (release: `# Criterios de despliegue en producción`).
3. **Cuerpo**: los subencabezados y criterios de la sección, en su orden; se eliminan los comentarios
   HTML y las líneas en blanco redundantes (no son criterios; requisito de CNF-01).
4. **Enlaces a guardrails**: `(el |la )?[<texto>](<ruta>/gr-<x>.md)` → `[[gr-<x>]]`. Ejemplo:
   `Se cumple el [Checklist de Seguridad de IA](../guardrails/gr-ai-security-checklist.md)` →
   `Se cumple [[gr-ai-security-checklist]]`. Se aplica a los tres checklists referenciados. // satisface: AC-6, CF-06
5. **Referencias entre etapas**: `Definition of Done para el estado <X>` → `[[dod-story-<x>]]`
   (caso único hoy: el primer criterio de CODE-REVIEW). Sin esto, el criterio apuntaría a una sección
   que deja de existir en el mismo archivo. // satisface: AC-1 (autocontenido)

Cada criterio del origen aparece en **exactamente un** archivo destino (AC-8, "no duplica contenido").

Bloques del origen que **no** migran y no bloquean: frontmatter, H1, comentarios HTML, texto previo a
la primera etapa (introducción) y `## 📎 Notas adicionales` si solo contiene el placeholder
`[Por completar]`. Cualquier otro bloque no reconocido → `[NO MIGRADO] <encabezado>` (exit 1) y el
origen **no** se reemplaza, para no perder contenido personalizado de un consumidor.

### D-5 — Idempotencia y reemplazo del monolítico por el índice deprecado

- Destino existente sin `--force` → `[PRESERVADO]`, nunca se reescribe. Con `--force` → `[SOBRESCRITO]`.
  // satisface: AC-8
- Sección ausente en el origen (monolítico personalizado) → `[SIN ORIGEN] guardrails/dod-story-<x>.md
  — sección <X> no encontrada`. El resto de etapas se migra.
- El origen se reemplaza por el índice deprecado solo si **no** hubo `[NO MIGRADO]`. Si el origen era
  `policies/dod-story.md`, el índice se escribe en `guardrails/dod-story-checklist.md` y el heredado
  se elimina (misma política de "mover" que `project-policies-generation` ya aplicaba). // satisface: AC-7
- Un origen cuyo frontmatter declara `status: deprecated` **ya es el índice**: no hay nada que dividir;
  cada destino existente se informa `[PRESERVADO]` y cada destino ausente `[SIN ORIGEN]` (exit 1,
  restaurar desde git). Segunda ejecución → `creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0`.

Esquema del índice deprecado (sustituye el contenido del monolítico durante la minor `3.3.x`):

| Campo | Valor |
|---|---|
| `type` | `guardrail` |
| `kind` | `index` (excluido de las reglas R1–R3 de D-6) |
| `status` | `deprecated` |
| `slug` | `dod-story-checklist` (se conserva: resuelven sus citas existentes) |
| `title` | `"DoD Story (deprecado)"` |
| `superseded-by` | lista de los siete slugs |
| `removal` | `4.0.0` (siguiente major, CNF-04) |

Cuerpo: `# DoD Story (deprecado) — ver [[dod-story-specify]], [[dod-story-plan]], …, [[dod-story-release]]`
más una línea que remite a `/memory-system migrate --from=dod-monolithic`.

| Alternativa | Por qué se descarta |
|---|---|
| Borrar el monolítico tras dividir | Rompe proyectos y enlaces durante la minor; AC-7 exige conservarlo. |
| Mantener el monolítico intacto y generar los archivos al lado | Dos fuentes de verdad divergentes; `check` no sabría cuál vale. |
| Hashear secciones para detectar ejecuciones previas | `status: deprecated` en el frontmatter es suficiente y legible por humanos. |

### D-6 — `check`: nueva familia `dod-guardrail`

Se añade **una** familia a `CHECK_KINDS` (al final, para no reordenar el informe) con evaluador
`dodGuardrails(ctx)` exportado por `dod-story.js`. El contexto de `checkMemory` gana `repoRoot`
(`path.dirname(specsBase)`, la misma convención que ya usa `detectHarness`), `skillsDir` y
`dodMapping`. // satisface: AC-2, AC-3, AC-4, CF-08

Reglas (todas con `detail` accionable):

| # | Regla | `path` | `detail` de ejemplo |
|---|---|---|---|
| R1 | Cada archivo de una fila `transition` declara `from`, `to`, `applies-to` y `enforcement ∈ {error, warn}`; nombre de archivo = `slug` | `guardrails/dod-story-verify.md` | `falta from` |
| R2 | `from`/`to` coinciden con `DOD_STAGES` (cadena canónica) | `guardrails/dod-story-verify.md` | `from: ACCEPTANCE — se esperaba CODE-REVIEW` |
| R3 | `dod-story-release.md` declara `kind: content` y `applies-to: release` | `guardrails/dod-story-release.md` | `applies-to: story — se esperaba release` |
| R4 | Cada entrada de `guardrails.dod.story` es una etapa conocida y su slug existe como `guardrails/<slug>.md` | `../sddf.config.yaml` | `implement: dod-story-impl — archivo inexistente` |
| R5 | Un `dod-story-checklist.md` sin `status: deprecated` es un monolítico sin migrar | `guardrails/dod-story-checklist.md` | `DoD monolítico sin migrar → /memory-system migrate --from=dod-monolithic` |
| R6 | Cada skill consumidor de `DOD_STAGES` presente en `skillsDir` tiene `## DoD aplicable` y cita `dod-story-<stage>` | `../skills/story-verify/SKILL.md` | `falta la sección DoD aplicable (dod-story-verify)` |
| R7 | Ningún `SKILL.md` de `skillsDir` contiene `dod-story-checklist` | `../skills/x/SKILL.md` | `referencia al DoD monolítico` |

**Aplicabilidad (P7, degradación):** las reglas R1–R5 solo se evalúan si existe algún
`guardrails/dod-story-*.md`, un monolítico o la clave `guardrails.dod.story`; un proyecto sin DoD no
recibe problemas (el DoD sigue siendo opcional). R6–R7 solo si se resuelve `skillsDir`:
`--skills-dir <ruta>` explícito → `<REPO_ROOT>/skills` → `<REPO_ROOT>/<--cli-root>/skills` → reglas no
aplicables (sin problema; la cabecera del informe dice `skills: —`). Las rutas fuera de `SPECS_BASE` se
reportan relativas a ella (`../…`) para mantener el contrato de `path` de §7 de `memory-rules.md`.

| Alternativa | Por qué se descarta |
|---|---|
| Tres familias (`dod-frontmatter`, `dod-mapping`, `dod-reference`) | Triplica el cambio del contrato JSON (`summary` expone todas las familias) para un solo artefacto. |
| Validar el DoD en un verificador aparte (`scripts/verify-dod.js`) | No llegaría a proyectos consumidores; CF-08 lo pide en `memory-system check`. |
| Leer siempre `<REPO_ROOT>/.claude/skills` | Acopla el motor a un runtime; los destinos viven en `config/runtimes.json` (`AGENTS.md`). |

### D-7 — Lectura del mapeo de `sddf.config.yaml`

`readDodMapping(configText)` lee **solo** la ruta `guardrails → dod → story → <stage>: <slug>` por
indentación, como ya hace `scripts/verify-config-contract.js`; el `parseFrontmatter` del motor ignora
claves anidadas y no sirve. Archivo: `<REPO_ROOT>/sddf.config.yaml`. Ausente o sin la sección → mapeo
vacío (se aplica la convención). // satisface: AC-3

Precedencia de resolución (idéntica en `check` y en la sección `## DoD aplicable` de cada skill):

1. `sddf.config.yaml › guardrails.dod.story.<stage>` → `$SPECS_BASE/guardrails/<slug>.md`
2. Convención: `$SPECS_BASE/guardrails/dod-story-<stage>.md`
3. Ninguno existe → aviso accionable (ver D-8) y el skill continúa sin validación DoD, como hoy.

| Alternativa | Por qué se descarta |
|---|---|
| Dependencia YAML (`js-yaml`) | CNF-07: sin dependencias nuevas; el motor declara "solo módulos nativos". |
| Mapeo a rutas en lugar de slugs | Una ruta fija la capa; un slug permite a `check` validar contra el conjunto de nodos. |

### D-8 — Bloque estándar `## DoD aplicable` en los `SKILL.md` (Opción A)

Cada skill consumidor de `DOD_STAGES` recibe la misma sección (nueve `SKILL.md`: ver tabla de D-1),
situada tras `## Dependencias`, con estos elementos fijos: // satisface: AC-2, AC-3, CNF-01

| Elemento | Contenido |
|---|---|
| Etapa | `` `<stage>` `` |
| Archivo | `` `$SPECS_BASE/guardrails/dod-story-<stage>.md` `` (en este repo, `docs/guardrails/…`) |
| Override | `` `sddf.config.yaml › guardrails.dod.story.<stage>` `` |
| Resolución | los tres pasos de D-7 |
| Enforcement | se lee del frontmatter del archivo: `error` bloquea la transición como hoy; `warn` registra los criterios incumplidos en el informe del skill sin bloquear |
| Ausencia | `⚠️ DoD de la etapa <stage> no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic` |

Además, en cada skill: los pasos que hoy dicen "cargar la sección `<X>` de `dod-story-checklist.md`"
pasan a "cargar el DoD aplicable"; se elimina el fallback a `policies/dod-story.md` (lo absorbe la
migración, D-3); los mensajes y tablas de errores que nombran el monolítico pasan a nombrar
`dod-story-<stage>.md`.

Casos particulares:

- `story-plan`: su DoD (`plan`) lo **evalúa** `story-analyze` en el paso 5; la sección lo declara así
  y `story-plan` no lo carga (sigue siendo un orquestador puro).
- `story-design`: declara `plan` (la etapa a la que contribuye) y lo carga como contexto de calidad.
- `story-specify`: nuevo paso de verificación antes de escribir `SPECIFY/DONE`, con `enforcement: warn`.
- `story-code-review`: `$DOD_PATH` en el `SKILL.md` y en los cuatro agentes locales pasa a describirse
  como "ruta al DoD de la etapa code-review"; los hallazgos DoD citan `dod-story-code-review.md:<línea>`.

| Alternativa | Por qué se descarta |
|---|---|
| Resolución solo por config (Opción C pura) | Sin config el skill no sabría qué cargar; la historia exige ambas. |
| Un documento compartido de resolución referenciado desde los skills | Los skills se instalan y resuelven su contexto localmente (`AGENTS.md`); una dependencia cruzada entre skills se rompe en instalaciones parciales. |

### D-9 — Proyectos consumidores: `project-policies-generation` y `sddf-init`

- `project-policies-generation` sustituye `assets/dod-story-checklist-template.md` por
  `assets/dod-story/dod-story-<stage>.md` (siete plantillas). Las plantillas se obtienen ejecutando la
  migración de D-3 sobre la plantilla monolítica actual (trazable, no reescritas a mano). El Paso 3
  crea cada archivo que falte (copia-si-falta, sin preguntar por archivo); el Paso 3d auto-completa por
  archivo. Si detecta un monolítico o un `policies/dod-story.md` sin dividir, **no** lo mueve: sugiere
  `/memory-system migrate --from=dod-monolithic`. El registro en `CLAUDE.md`/`AGENTS.md` deja de
  importar el DoD (`@…`): cada skill carga el suyo bajo demanda (CNF-01). // satisface: AC-3, AC-7, CNF-04
- `sddf-init`: la pregunta del Paso 5 y el informe de ejemplo nombran `guardrails/dod-story-*.md`;
  `assets/sddf.config.yaml.template` y `.example` añaden el bloque `guardrails.dod.story` con los
  siete valores por defecto, documentando que es opcional. // satisface: AC-3

| Alternativa | Por qué se descarta |
|---|---|
| Mantener la plantilla monolítica y ejecutar `migrate` tras generarla | Encadena dos skills para crear siete archivos; la plantilla monolítica seguiría nombrando el archivo deprecado (R7). |
| Dejar `project-policies-generation` sin cambios | Los consumidores nuevos recibirían un DoD que ningún skill carga ya. |

### D-10 — Documentación y registro

| Documento | Cambio |
|---|---|
| `docs/guardrails/README.md` | La fila del monolítico se sustituye por siete filas (una por archivo) y una nota del índice deprecado. |
| `docs/constitution.md` | El enlace al DoD pasa a `guardrails/README.md` (índice) en lugar del monolítico. |
| `AGENTS.md` | Comentario del árbol (`dod-story-*.md (transiciones)`); se retira `@docs/guardrails/dod-story-checklist.md`. |
| `README.md` | Árbol, tabla de "qué se versiona" y enlace de contribución → `docs/guardrails/`. |
| `docs/architecture/memory-system.md` | Árbol de `guardrails/`, antipatrón, subcomando `migrate` y familia `dod-guardrail`. |
| `docs/guides/sddf-commands-pipeline.md` | DoD por etapa, bloque `DoD aplicable`, mapeo en config y `migrate --from`. |
| `docs/domains/domain.md` | Fila de la tabla de artefactos → `dod-story-<etapa>.md`. |
| `skills/memory-system/SKILL.md` | Parámetros (`migrate --from`, `check --skills-dir`), §3.5 (familia) y §3.6 (rama `--from`). |
| `skills/memory-system/references/memory-rules.md` | §7 fila `dod-guardrail`; nueva sección con `DOD_STAGES` y R1–R7. |
| `CHANGELOG.md` `3.3.0 [Unreleased]` | `Changed` (división, bloque `DoD aplicable`, mapeo) y `Deprecated` (monolítico, eliminación en `4.0.0`). |
| `docs/index.md` | Se regenera con `/memory-system index` (no se edita a mano). |

No se editan: artefactos de historias cerradas, entradas publicadas del CHANGELOG ni ADRs.
// satisface: AC-7, CNF-03, CNF-05

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Módulo DoD por etapa | crear | `skills/memory-system/scripts/dod-story.js` | AC-1, AC-3, AC-4, AC-5, AC-6, AC-8 |
| Motor de memoria | modificar (despacho `migrate`, flags `--from`/`--skills-dir`, familia `dod-guardrail`, `USAGE`, exports) | `skills/memory-system/scripts/memory-system.js` | AC-8, CF-08 |
| DoD por etapa (7) | crear (por migración) | `docs/guardrails/dod-story-{specify,plan,implement,code-review,verify,acceptance,release}.md` | AC-1, AC-4, AC-5, AC-6 |
| Índice deprecado | reemplazar contenido (por migración) | `docs/guardrails/dod-story-checklist.md` | AC-7 |
| Mapeo de config | modificar | `sddf.config.yaml`, `skills/sddf-init/assets/sddf.config.yaml.{template,example}` | AC-3 |
| Skills consumidores (9) | modificar (`## DoD aplicable`, pasos de carga, mensajes) | `skills/{story-specify,story-plan,story-design,story-analyze,story-implement,story-implement-tasks,story-code-review,story-verify,story-acceptance}/SKILL.md` | AC-2 |
| Agentes de code review (4) | modificar descripción de `$DOD_PATH` | `skills/story-code-review/agents/*.agent.md` | AC-2 |
| Recursos auxiliares de skills | modificar referencias al monolítico | `skills/story-analyze/assets/analyze-report-template.md`, `skills/story-verify/README.md`, `skills/story-code-review/examples/example-needs-changes-medium/fix-directives.md`, `skills/docs-wiki-builder/assets/wiki-index-template.md` | AC-2 |
| Evals afectados | modificar fixtures | `skills/story-implement/evals/evals.json` (ruta de ejemplo), `skills/story-acceptance/evals/evals.json` (escenario "sin sección ACCEPTANCE" → "archivo ausente") | AC-2 |
| Evals de memory-system | ampliar | `skills/memory-system/evals/evals.json` (migrate --from, check dod-guardrail) | AC-4, AC-8 |
| Generador de políticas | modificar | `skills/project-policies-generation/SKILL.md`, `assets/dod-story/*.md` (crear), `assets/dod-story-checklist-template.md` (eliminar) | AC-3, AC-7 |
| Inicializador | modificar texto | `skills/sddf-init/SKILL.md` | AC-3 |
| Tests | crear/modificar | `test/dod-story.test.js` (crear), `test/memory-system.test.js` (claves de `summary`, `CHECK_KINDS`) | AC-1…AC-8 |
| Documentación | modificar | ver D-10 | AC-7, CNF-03, CNF-05 |

`.claude/skills/` y `.agents/skills/` no se editan: se regeneran con `agile-sddf install --force`
(ver CR-003).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `DOD_STAGES` | arreglo inmutable de `{ stage, heading, from, to, enforcement, kind, appliesTo, skills[] }` en el orden canónico | AC-1, AC-4, AC-5 |
| `planDodMigration(sourceText, existing, options)` | pura: `sourceText` del origen, `existing: Set<slug>` de destinos presentes, `options { force, date }` → `{ entries: [{ target, action, content? }], unmigrated: [heading], alreadyIndex: bool }`; `action ∈ create \| preserve \| overwrite \| replace-index \| no-source` | AC-1, AC-6, AC-7, AC-8 |
| `migrateDod(specsBase, { dryRun, force, date })` | lee origen (D-3), llama al planificador, aplica la guardia `assertInsideRoot` a cada destino y escribe; devuelve `{ lines, summary: { created, overwritten, preserved, replaced, pending }, exitCode }` | AC-8 |
| `readDodMapping(configText)` | pura → `Map<stage, slug>`; claves desconocidas se conservan para que R4 las reporte | AC-3 |
| `dodGuardrails(ctx)` | evaluador puro con la misma firma que los de `check` (`ctx → problem[]`), usa `ctx.nodes`, `ctx.repoRoot`, `ctx.skillsDir`, `ctx.dodMapping` | AC-2, AC-3, AC-4 |
| CLI del motor | `memory-system.js migrate --root <SPECS_BASE> --from dod-monolithic [--dry-run] [--force] [--date YYYY-MM-DD]`; `check … [--skills-dir <ruta>]` | AC-8, CF-08 |
| CLI del skill | `/memory-system migrate --from=dod-monolithic [--dry-run] [--force]` | AC-8 |
| JSON de `check` | `summary` gana la clave `dod-guardrail` (aditivo, al final) | CF-08 |
| Sección `## DoD aplicable` | elementos fijos de D-8 | AC-2 |

## Esquema de datos

**Frontmatter de un DoD de transición** (`dod-story-verify.md`):

| Campo | Valor |
|---|---|
| `type` | `guardrail` |
| `kind` | `transition` |
| `enforcement` | `error` |
| `from` | `VERIFY/IN-PROGRESS` |
| `to` | `VERIFY/DONE` |
| `applies-to` | `story` |
| `slug` | `dod-story-verify` |
| `title` | `"DoD VERIFY — Story (transition guardrail)"` |
| `created` / `updated` | fecha de la migración |

**Frontmatter del DoD de deliver** (`dod-story-deliver.md`): igual sin `from`/`to`, con `kind: content`, `applies-to: deliver`.

**Bloque de config** (`sddf.config.yaml`, nivel raíz):

| Ruta | Valor |
|---|---|
| `guardrails.dod.story.specify` … `.release` | slug del archivo (`dod-story-<stage>` por defecto) |

// satisface: AC-1, AC-3, AC-5

## Flujos clave

### F-1 — Migración en este repositorio (AC-1, AC-4, AC-5, AC-6, AC-7)

1. `/memory-system migrate --from=dod-monolithic` → el skill normaliza el flag e invoca el motor.
2. El motor resuelve `SPECS_BASE`, lee `guardrails/dod-story-checklist.md` (sin `status: deprecated`).
3. `planDodMigration` extrae las siete secciones, aplica D-4 y marca las siete como `create`, más
   `replace-index` para el origen.
4. Guardia de escritura por destino; escribe; informa `creados: 7 · sobrescritos: 0 · preservados: 0 · reemplazados: 1`.
5. `/memory-system check --skills-dir skills` antes de editar los skills → R6 y R7 reportan los nueve
   `SKILL.md`; tras editarlos → 0 problemas `dod-guardrail`.

### F-2 — Re-ejecución (AC-8)

1. El origen tiene `status: deprecated` → `alreadyIndex = true`.
2. Los siete destinos existen → `[PRESERVADO]` ×7; `creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0`; exit 0.
3. `--dry-run` → `cambios pendientes: 0`.

### F-3 — Un skill carga su DoD (AC-2, AC-3, CNF-01)

1. `story-verify` lee su `## DoD aplicable`: etapa `verify`.
2. Busca `guardrails.dod.story.verify` en `sddf.config.yaml`; si hay slug, usa `guardrails/<slug>.md`;
   si no, `guardrails/dod-story-verify.md`.
3. Lee `enforcement` del frontmatter y los criterios del cuerpo (solo ese archivo).
4. Si no existe ninguno: aviso accionable de D-8 y el fallback genérico que `story-verify` ya tiene.

### F-4 — Consumidor con override (AC-3)

1. El consumidor declara `guardrails.dod.story.implement: dod-story-implement-acme` y crea
   `docs/guardrails/dod-story-implement-acme.md`.
2. `story-implement` carga ese archivo; `check` valida R4 (existe) y R1/R2 sobre él, porque el nodo
   pertenece a la etapa `implement` por el mapeo.

### F-5 — Consumidor con monolítico personalizado (AC-7, degradación)

1. Su monolítico no tiene sección `SPECIFY` y añade `## Criterios de rendimiento`.
2. `migrate` crea las etapas presentes, informa `[SIN ORIGEN] … SPECIFY` y `[NO MIGRADO] Criterios de
   rendimiento`, **no** reemplaza el monolítico y sale con exit 1.
3. El usuario mueve el bloque a mano y re-ejecuta; los destinos creados quedan `[PRESERVADO]`.

## Decisiones de complejidad justificada

- **Un módulo nuevo en lugar de un par de funciones en el motor**: el motor es genérico (capas,
  nodos, wikilinks); el DoD introduce un vocabulario propio (etapas, cadena, secciones) que cambia por
  razones distintas. Separarlo mantiene una sola razón de cambio por archivo (P11). El módulo agrupa
  migración y evaluación porque ambas dependen de `DOD_STAGES` y de nada más del motor; separarlas
  crearía un tercer módulo solo para la tabla.
- **Un subcomando `migrate` en el motor que solo admite un `--from`**: una bandera con un único valor
  parece excesiva, pero es la superficie que fija la historia y deja el punto de variación nombrado
  (P6) sin inventar orígenes hipotéticos (P12: no se diseña ningún otro `--from`).
- **Reglas R6–R7 que miran fuera de `SPECS_BASE`**: `check` hasta ahora solo lee la raíz. Es
  necesario porque CF-08 pide verificar referencias de skills; se limita a lectura, a un directorio
  resuelto explícitamente y se desactiva sin error cuando no se resuelve.
- **Parser YAML mínimo**: un lector por indentación de una sola ruta es más simple que una dependencia
  y ya existe el precedente de `verify-config-contract.js`; no se generaliza a otras claves.
- **Nada más**: no hay jerarquía de clases, ni registro de orígenes, ni caché. `DOD_STAGES` es un
  arreglo literal.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Existen los 7 `dod-story-<stage>.md` + índice, con frontmatter de D-1 | `node --test` sobre `migrateDod` en fixture temporal; `check` R1/R3 = 0 en el repo | AC-1, AC-5 |
| 2 | Cada criterio del origen aparece en exactamente un destino | test: conjunto de líneas `- [ ]` del origen = unión disjunta de las de los destinos | AC-1, AC-8 |
| 3 | Cadena `from`/`to` canónica; ninguna inversión CODE-REVIEW/VERIFY | test de `DOD_STAGES`; test de R2 con un fixture invertido → 1 problema | AC-4 |
| 4 | Release: `kind: content`, `applies-to: release`; sus criterios no aparecen en otra etapa | test sobre la salida de la migración | AC-5 |
| 5 | Enlaces `gr-*.md` → `[[gr-*]]`; `Definition of Done para el estado IMPLEMENT` → `[[dod-story-implement]]` | test del planificador con el texto de AC-6 | AC-6 |
| 6 | Índice deprecado con `status: deprecated`, `removal: 4.0.0` y wikilinks a los siete | test + `check` sin `broken-wikilink` nuevos | AC-7 |
| 7 | Segunda ejecución: `creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0`; `--dry-run` → `cambios pendientes: 0`; destinos byte a byte iguales | test de idempotencia | AC-8 |
| 8 | Sin `--force` nunca se sobrescribe un destino modificado | test: editar un destino, re-ejecutar, contenido intacto | AC-8 |
| 9 | Nueve `SKILL.md` con `## DoD aplicable` y su `dod-story-<stage>`; ninguno cita `dod-story-checklist` | `memory-system check --root docs --skills-dir skills` → 0 `dod-guardrail`; `grep -rn "dod-story-checklist" skills/` sin resultados | AC-2 |
| 10 | Mapeo presente y válido; override de consumidor aceptado | test de `readDodMapping` + R4 con fixture de override | AC-3 |
| 11 | CNF-01: cada archivo de etapa ≤ 40 líneas de cuerpo | test: líneas tras el frontmatter ≤ 40 | CNF-01 |
| 12 | Sin regresión | `npm test`, `npm run verify:links`, `verify:syntax`, `verify:config`, `verify:eval-inventory` exit 0 | CNF-07 |
| 13 | CHANGELOG con `Changed` y `Deprecated` (eliminación `4.0.0`) | revisión en code review | AC-7, CNF-03 |

## Risks / Trade-offs

- **[Riesgo] El índice deprecado se sigue importando desde `CLAUDE.md` de consumidores** →
  Mitigación: el índice es corto (≈15 líneas); `project-policies-generation` retira el `@`-import al
  re-ejecutarse.
- **[Riesgo] Las sesiones pierden el DoD completo en contexto al retirar el `@`-import de `AGENTS.md`**
  → Es el objetivo de CNF-01; los quality gates siguen cargándolo por etapa. Un humano consulta
  `docs/guardrails/README.md`.
- **[Riesgo] Cambio aditivo en el JSON de `check`** (`summary` gana una clave) → consumidores con `jq`
  que comparen el objeto entero fallarían; es aditivo y se documenta en el CHANGELOG. Los tests que
  fijan las claves exactas se actualizan.
- **[Trade-off] `specify` con `enforcement: warn`** → una historia puede cerrar SPECIFY con criterios
  incumplidos durante la minor; queda registrado en el informe de `story-specify`.
- **[Riesgo] Los skills son Markdown: la precedencia config → convención la ejecuta el agente, no
  código** → `check` R4/R6 verifica de forma determinista que el mapeo y las referencias son
  coherentes; la carga efectiva (Verificación 7 de la historia) es comprobación manual.
- **[Limitación] `REPO_ROOT = dirname(SPECS_BASE)`** → misma suposición que `detectHarness`; una raíz
  anidada a más de un nivel no encontraría `sddf.config.yaml` y usaría la convención.

## Open Questions

Ninguna bloqueante: las ambigüedades se resolvieron en las decisiones anteriores y quedan registradas
como CR para que la historia las refleje.

## Cambios durante la implementación

Decisiones tomadas en `/story-implement` que ajustan este diseño. Prevalecen sobre las secciones anteriores.

| # | Cambio | Sustituye a | Motivo |
|---|---|---|---|
| I-1 | El origen heredado `policies/dod-story.md` **se conserva** tras migrar (`[PRESERVADO] … origen heredado conservado`); `check` R5 lo señala como `DoD heredado ya migrado: elimínalo` hasta que la persona lo retire | D-5, viñeta 3 ("el heredado se elimina") | INC-001 de `analyze.md`: la épica prohíbe que un modo elimine archivos |
| I-2 | `DOD_STAGES` y R1–R7 se documentan en `references/dod-rules.md` (97 líneas); `memory-rules.md` solo gana una fila en §7 | D-10 (nueva sección en `memory-rules.md`) | INC-003: `memory-rules.md` ya superaba 300 líneas; `SKILL.md` queda en 479 (< 500) |
| I-3 | La división reconoce también el formato de la antigua plantilla de `project-policies-generation` (etapas `## ✅ VERIFY (Definición de Hecho …)` con subgrupos `###`): la etapa es el primer token en mayúsculas del encabezado y un bloque de etapa incluye sus subencabezados más profundos | D-4 (solo `### Definition of Done para el estado X`) | Los DoD de los proyectos consumidores tienen ese formato; sin esto no podrían migrar |
| I-4 | `release` es opcional: si el origen no tiene criterios de despliegue, la acción es `skip` (`[OMITIDO]`), no `no-source`, y no afecta al exit code | D-5 ("sección ausente → `[SIN ORIGEN]`") | El checklist de despliegue es propio del framework (npm); la plantilla de consumidores no lo tiene. Por eso `assets/dod-story/` tiene seis plantillas, no siete |
| I-5 | La antigua plantilla monolítica se conserva como fixture `skills/memory-system/examples/dod-template/` (test UT-018c) en lugar de eliminarse | T042 ("eliminar") | Mantener un test del formato de consumidor |
| I-6 | Opción `keepDatePlaceholders` del planificador (no expuesta en la CLI): conserva `<YYYY-MM-DD>` al generar plantillas (T041) | D-4 paso 1 | INC-007 |
| I-7 | `memory-system.js` ejecuta `main()` después de `module.exports` | — | Con el módulo `dod-story.js` hay un require circular; como CLI, `main()` corría antes de exportar |
| I-8 | Eval EV-007 añadido a `story-specify` (`TC-006`: `enforcement: warn` no bloquea `SPECIFY/DONE`) | Gap aceptado en `testcases.md` | INC-005 |
| I-9 | `project-policies-generation` añade los criterios del stack detectado a `dod-story-implement.md` (subgrupo `## 🧩 Criterios del stack`) en lugar de a "Notas adicionales" | D-9 ("auto-completa por archivo") | Las plantillas por etapa no tienen sección de notas |
| I-10 | Las pruebas UT/IT viven en `test/dod-story.test.js` y los fixtures en `skills/memory-system/examples/dod-{monolithic,custom,legacy,template}/` | T003 (`test/fixtures/dod-story/`) | Convención existente del repo: los fixtures de `memory-system` viven en `examples/` |
| I-11 | Cada DoD de etapa declara la transición de **cierre** de su etapa: `from: <ETAPA>/IN-PROGRESS`, `to: <ETAPA>/DONE`; `DOD_STAGES` añade `status` (etapa sin substatus) y la migración clasifica por él. La entrada `release` pasa a `deliver` (`dod-story-deliver.md`, `kind: content`, `applies-to: deliver`, sin `from`/`to`, sin skill por ahora); clave de config `deliver` | D-1 (`to: <ETAPA>`, `from`: etapa anterior), D-4, D-5, R2, R3, CR-002 e I-4 en lo que nombran `release` | Decisión del usuario tras el code review: un Definition of Done es la condición del substatus `DONE` de su etapa, no la entrada a la etapa. Resuelve los bloqueantes #1–#3 de `fix-directives.md` |

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-2 exige la sección en "7 skills" incluido `story-release`, que no existe; y omite
  a los consumidores reales `story-design`, `story-analyze` (evalúa el DoD PLAN) y
  `story-implement-tasks`. `story-plan` no carga DoD: su quality gate es `story-analyze`.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño aplica la sección a los nueve `SKILL.md` de D-1; `dod-story-release`
  no tiene skill consumidor (lo usa el runbook `docs/runbooks/deployment-to-npm.md`). La Verificación 3
  debe decir "9 referencias". Crear un skill de release queda fuera de alcance.

### CR-002
- **Tipo**: inviabilidad
- **Descripción**: el orden canónico de AC-4 termina en `RELEASE`, que no es un estado de historia en
  [[state-machine]] (tras `ACCEPTANCE` viene `DELIVER`, manual). Declarar `from: ACCEPTANCE,
  to: RELEASE` inventaría un estado.
- **Documento afectado**: story.md
- **Acción requerida**: la cadena `from`/`to` termina en `ACCEPTANCE`; `dod-story-release.md` es
  `kind: content` sin `from`/`to` (coherente con AC-5 y CF-02).

### CR-003
- **Tipo**: dependencia
- **Descripción**: el mapa de implementación y las Verificaciones 2–3 usan `.claude/skills/`, que es
  salida de instalación; la fuente única es `skills/` (`AGENTS.md`).
- **Documento afectado**: story.md
- **Acción requerida**: editar `skills/`; verificar con `grep` sobre `skills/`; regenerar las copias
  locales con `agile-sddf install --force` si se quieren alinear.

### CR-004
- **Tipo**: inviabilidad
- **Descripción**: la Verificación 5 ("`memory-system check` devuelve exit 0") no es alcanzable: el repo
  arrastra 10 problemas de `check` declarados como deuda fuera de alcance en STORY-100.
- **Documento afectado**: story.md
- **Acción requerida**: el criterio pasa a "0 problemas de la familia `dod-guardrail` y ninguno nuevo en
  las demás familias respecto a la línea base".

### CR-005
- **Tipo**: ambigüedad
- **Descripción**: CF-01 habla de "7 archivos `dod-story-<stage>.md` + 1 de release", pero AC-1 lista 7
  archivos incluido el de release y la Verificación 1 cuenta 8 `dod-story-*.md`.
- **Documento afectado**: story.md
- **Acción requerida**: 6 etapas + 1 release + índice deprecado = 8 archivos `dod-story-*.md`. Corregir CF-01.

### CR-006
- **Tipo**: ambigüedad
- **Descripción**: CNF-01 (≤ 40 líneas) no define qué se cuenta. La sección IMPLEMENT tiene 24 criterios
  en 5 subgrupos: con frontmatter supera las 40 líneas.
- **Documento afectado**: story.md
- **Acción requerida**: se mide el cuerpo (líneas tras el frontmatter), sin comentarios HTML (D-4).

### CR-007
- **Tipo**: dependencia
- **Descripción**: el mapa de implementación omite archivos que referencian el monolítico y deben
  cambiar para que AC-2/Verificación 2 se cumplan: `project-policies-generation` (lo genera),
  `sddf-init`, agentes y recursos de `story-code-review`, evals de `story-implement` y
  `story-acceptance`, `story-analyze/assets`, `story-verify/README.md`, `AGENTS.md`,
  `docs/constitution.md`, `docs/guardrails/README.md`, `docs/domains/domain.md`.
- **Documento afectado**: story.md
- **Acción requerida**: incluidos en Componentes afectados y D-9/D-10.

### CR-008
- **Tipo**: ambigüedad
- **Descripción**: AC-8 cita el informe "0 archivos creados, N archivos preservados"; el motor ya tiene
  un formato de resumen establecido (`creados: N · sobrescritos: N · preservados: N`).
- **Documento afectado**: story.md
- **Acción requerida**: se usa el formato del motor (semánticamente equivalente) para no introducir un
  segundo estilo de informe.

### CR-009
- **Tipo**: ambigüedad
- **Descripción**: CF-04 termina la precedencia en "error accionable", pero todos los consumidores
  actuales degradan con aviso y continúan cuando falta el DoD, y el DoD es opcional en consumidores.
- **Documento afectado**: story.md
- **Acción requerida**: el tercer paso es un **aviso** accionable no bloqueante (D-7/D-8); convertirlo
  en error bloquearía proyectos sin DoD.

### CR-010
- **Tipo**: dependencia
- **Descripción**: la historia no menciona que añadir una familia a `check` cambia su contrato JSON
  (`summary` expone todas las familias) ni que `test/memory-system.test.js` fija las claves exactas.
- **Documento afectado**: story.md
- **Acción requerida**: cambio aditivo documentado en el CHANGELOG; tests actualizados.

### CR-011
- **Tipo**: reutilización
- **Descripción**: la deprecación anterior (`policies/dod-story.md` → `guardrails/`) sigue viva en siete
  skills como fallback. La migración puede absorberla como segundo origen.
- **Documento afectado**: design.md
- **Acción requerida**: `migrate --from=dod-monolithic` acepta ambos orígenes (D-3) y los skills eliminan
  el fallback heredado.

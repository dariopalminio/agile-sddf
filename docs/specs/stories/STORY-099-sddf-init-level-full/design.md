---
alwaysApply: false
type: design
id: STORY-099
slug: STORY-099-sddf-init-level-full-design
title: "Design: Inicializar la memoria completa desde sddf-init con el parámetro --level"
date: 2026-09-21
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-099
related:
  - STORY-099-sddf-init-level-full
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-054-inicializar-entorno-sddf
  - STORY-093-raiz-configurable-preflight-diagnostico
  - memory-system
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-054-inicializar-entorno-sddf]]
[[STORY-093-raiz-configurable-preflight-diagnostico]]
[[memory-system]]

# Diseño técnico: Inicializar la memoria completa desde sddf-init con el parámetro --level

## Context

`skills/sddf-init/SKILL.md` (STORY-054, contrato de raíz de STORY-093) ejecuta seis pasos
fijos: (1) resolver raíz, (2) directorios base `specs/01..03` y `templates/`, (2b) copiar
cinco templates compartidos desde sus skills dueños, (3) `sddf.config.yaml` desde
`assets/sddf.config.yaml.template`, (4) `.env.template`, (5) pregunta opcional de políticas
(`project-policies-generation`), (6) informe consolidado `[CREADO]/[YA EXISTÍA]`. No acepta
parámetros. Su eval (`evals/evals.json` v2.0.0) cubre bootstrap por defecto, raíz relativa
idempotente y overrides inválidos.

Tras STORY-096, `memory-system scaffold` crea las once capas, `constitution.md` y las seis
plantillas con copia-si-falta y el informe `creados · sobrescritos · preservados · mapeados ·
omitidos por harness`. Hoy un proyecto nuevo necesita dos comandos para quedar completo.

Esta historia añade `--level minimal|standard|full` a `sddf-init` y, solo en `full`, un
Paso 5b que invoca `memory-system scaffold --yes`. La constitución (patrón 12) prevé flags
opcionales para modos alternativos; el patrón 11 exige idempotencia declarada.

Solapamiento a resolver: `sddf-init` Paso 2b copia los mismos cinco templates que
`memory-system scaffold` (STORY-096 D-2, misma tabla y misma regla). En `full`, el scaffold
los encontrará ya creados y los marcará `[PRESERVADO]`; eso es exactamente lo que hace
idéntico el resultado de `--level full` y de `sddf-init` + `scaffold` (AC-1).

Numeración de criterios usada en este diseño (orden de `story.md`):

| ID | Criterio resumido |
|---|---|
| AC-1 | `sddf-init --level full` crea la configuración base y `.env.template`, invoca `/memory-system scaffold` al finalizar, concatena su informe, y el resultado es idéntico a `sddf-init` + `memory-system scaffold`. |
| AC-2 | Sin `--level` o con `standard`: comportamiento actual íntegro y sin invocar `memory-system`; `minimal`: solo directorios base, `sddf.config.yaml` y `.env.template`. |
| AC-3 | `--level` acepta `minimal`, `standard` (default) y `full` con la semántica anterior; valor no admitido detiene sin escrituras. |
| AC-4 | Cambio mínimo: `--level` y el paso final son el único cambio; pasos existentes, idempotencia y tabla de templates intactos. |

NFR-1 compatibilidad (sin argumentos, ningún cambio) · NFR-2 idempotencia (`full` ×2 todo
`[YA EXISTÍA]`/`[PRESERVADO]`) · NFR-3 trazabilidad (el informe distingue lo de `sddf-init`
de lo de `scaffold`) · NFR-4 documentación (guía, README, CHANGELOG).

## Goals / Non-Goals

**Goals:**

- Un solo comando para un proyecto completo (`--level full`) sin alterar el default.
- Un nivel `minimal` para CI o bootstrap mínimo, sin templates ni pregunta interactiva.
- Cero duplicación: `full` reutiliza `memory-system scaffold` tal cual; `sddf-init` no
  aprende nada sobre capas ni semillas.

**Non-Goals:**

- Invocar `index`, `ensure` o `check` desde `sddf-init` (el usuario los ejecuta después).
- Cambiar la resolución de raíz, el Paso 2b ni la tabla de templates de `sddf-init`.
- Que `memory-system` conozca `sddf-init` o sus niveles.

## Decisions

### D-1 — `--level` es un parámetro de `sddf-init` con tabla de pasos por nivel y default `standard`

// satisface: AC-2, AC-3, AC-4, NFR-1

Se añade a `skills/sddf-init/SKILL.md` la sección "Parámetros" con `--level
minimal|standard|full` (default `standard`) y una tabla que asigna pasos a niveles:

| Nivel | Pasos ejecutados |
|---|---|
| `minimal` | 1 (raíz), 2 (directorios base), 3 (`sddf.config.yaml`), 4 (`.env.template`), 6 (informe). Omite 2b y 5. |
| `standard` | 1, 2, 2b, 3, 4, 5, 6 — comportamiento actual, sin cambios. |
| `full` | `standard` + 5b (invocar `memory-system scaffold --yes`). |

Un valor distinto termina antes del Paso 1 con
`❌ --level no admitido: <valor>. Valores válidos: minimal, standard, full.` y sin
escrituras. Ningún paso existente cambia de contenido: la tabla solo decide cuáles se
ejecutan.

Alternativas rechazadas: (a) `--with-memory` como flag booleano — la historia fija tres
niveles y `minimal` tiene valor propio para CI; (b) leer el nivel de `sddf.config.yaml` —
en bootstrap el archivo aún no existe.

### D-2 — Paso 5b: invocar `memory-system scaffold --yes` y concatenar su informe

// satisface: AC-1, NFR-3

Nuevo Paso 5b, solo en `full`, tras el Paso 5 y antes del informe final:

1. Verificar que `$CLI_ROOT/skills/memory-system/SKILL.md` existe. Si no: emitir
   `⚠️ memory-system no está instalado — nivel full termina como standard` y continuar al
   Paso 6 (degradación que la historia prevé).
2. Invocar el skill `memory-system` en modo `scaffold --yes` (modo Agent, sin preguntas),
   pasándole la misma `SPECS_BASE` resuelta en el Paso 1 (`sddf-init` no re-resuelve nada:
   `memory-system` aplica el mismo contrato v1 y llegará a la misma raíz, porque
   `sddf.config.yaml` ya existe con `root`).
3. Capturar su informe completo (líneas `[CREADO]/[PRESERVADO]/[OMITIDO]/[WARNING]` y el
   resumen `creados: N · …`).

El informe final del Paso 6 gana un bloque separado:

```
── sddf-init ────────────────────────────────────
[CREADO]     docs/specs/01-projects/
…
[CREADO]     .env.template
── memory-system scaffold (nivel full) ──────────
[CREADO]     docs/constitution.md
[PRESERVADO] docs/templates/story-template.md
…
creados: 14 · sobrescritos: 0 · preservados: 5 · mapeados: 0 · omitidos por harness: 0
─────────────────────────────────────────────────
✓ Entorno SDDF inicializado correctamente en docs/ (nivel full)
```

Los cinco templates compartidos aparecen `[CREADO]` en el bloque de `sddf-init` y
`[PRESERVADO]` en el de `scaffold`: ese es el comportamiento esperado, no una duplicación.

Alternativas rechazadas: (a) omitir el Paso 2b en `full` y dejar que `scaffold` copie los
templates — cambia un paso existente (viola AC-4) y rompe la equivalencia con `sddf-init` +
`scaffold`; (b) invocar `ensure` en lugar de `scaffold` — la historia fija `scaffold`, y
generar el índice en un proyecto vacío añade poco.

### D-3 — Composición inline, un solo salto, sin contexto compartido

// satisface: AC-1, AC-4

`sddf-init` es un skill de sesión principal y `memory-system` también; la invocación es
composición inline (constitución, patrón 4), no delegación a subagente. `sddf-init` no pasa
argumentos más allá de `scaffold --yes`; `memory-system` resuelve su raíz y `CLI_ROOT` por
su cuenta. Así la equivalencia de AC-1 se cumple por construcción: ambos caminos ejecutan el
mismo skill con los mismos argumentos sobre el mismo estado.

### D-4 — `minimal` omite el Paso 5 sin preguntar; `standard` y `full` lo conservan

// satisface: AC-2, AC-3

El Paso 5 (pregunta de políticas) es interactivo. En `minimal` se omite y el informe
registra `[OMITIDO] project-policies-generation (nivel minimal)`. En `full` se mantiene
antes del 5b: si el usuario acepta, `project-policies-generation` crea `constitution.md` y
`guardrails/dod-story-checklist.md`, y `scaffold` los encontrará y preservará. Orden
5 → 5b garantiza que la constitución generada por políticas (más rica) gane sobre la
semilla del scaffold.

Alternativa rechazada: 5b antes de 5 — la semilla del scaffold bloquearía la creación de
`constitution.md` por `project-policies-generation`.

### D-5 — Evals de `sddf-init` con un caso por nivel y sin tocar los existentes

// satisface: AC-1, AC-2, AC-3, NFR-1

`skills/sddf-init/evals/evals.json` (v2.0.0) conserva TC-001…TC-00N intactos (NFR-1: el
caso sin flags sigue pasando sin cambios) y añade: `--level minimal` (no contiene
`templates/story-template.md` ni la pregunta de políticas), `--level full` (contiene
`memory-system scaffold (nivel full)` y `creados:`), `--level foo` (contiene `--level no
admitido`, no contiene `[CREADO]`), `--level full` sin `memory-system` instalado (contiene
`termina como standard`).

### D-6 — Documentación

// satisface: NFR-4

- `docs/guides/sddf-commands-pipeline.md` §0 y §"Configuración": los tres niveles y el
  comando recomendado `sddf-init --level full` para proyectos nuevos.
- `README.md`: tabla de comandos (`/sddf-init [--level …]`) y la línea "Preparar un
  repositorio" actualizada.
- `CHANGELOG.md` 3.3.0: Added `--level` en `sddf-init`.
- `skills/sddf-init/SKILL.md`: sección "Parámetros", tabla de niveles, Paso 5b y ejemplo de
  informe de D-2.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `sddf-init` (parámetro, tabla de niveles, Paso 5b, informe) | modificar | `skills/sddf-init/SKILL.md` | AC-1, AC-2, AC-3, AC-4 |
| Evals de `sddf-init` | modificar (añadir casos) | `skills/sddf-init/evals/evals.json` | AC-1, AC-2, AC-3 |
| Documentación | modificar | `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | NFR-4 |

`memory-system` no se modifica: la invocación usa `scaffold --yes`, ya definido en STORY-096.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `/sddf-init [--level minimal\|standard\|full]` | Default `standard`; tabla de pasos de D-1; valor no admitido → mensaje y fin sin escrituras. | AC-2, AC-3 |
| Paso 5b → `/memory-system scaffold --yes` | Invocación inline solo en `full`; si el skill no está instalado, aviso y degradación a `standard`; el informe del scaffold se concatena bajo el encabezado `── memory-system scaffold (nivel full) ──`. | AC-1, NFR-3 |
| Informe final de `sddf-init` | Bloque `sddf-init` + (en `full`) bloque `memory-system scaffold` + línea de cierre con `(nivel <n>)`. | NFR-3 |

## Esquema de datos

- **Nivel**: `minimal | standard | full`; `LEVEL_STEPS = { minimal: [1,2,3,4,6], standard: [1,2,'2b',3,4,5,6], full: [1,2,'2b',3,4,5,'5b',6] }` (documentado en el `SKILL.md`, no en código).
- **Informe compuesto**: `{ init: Line[], scaffold?: Line[], level, summary }`.

## Flujos clave

### F-1 — `sddf-init --level full` en proyecto vacío (AC-1)

1. Paso 1–4: raíz `docs`, directorios, cinco templates, `sddf.config.yaml`, `.env.template`.
2. Paso 5: pregunta de políticas (el usuario responde).
3. Paso 5b: `memory-system scaffold --yes` → crea capas, `constitution.md` (si políticas no
   lo creó), `adr-template.md`; preserva los cinco templates.
4. Paso 6: informe compuesto. Listado de archivos == `sddf-init` seguido de
   `memory-system scaffold`.

### F-2 — `sddf-init` sin argumentos (AC-2, NFR-1)

1. Nivel `standard`; Pasos 1–6 exactamente como hoy; sin mención a `memory-system`.

### F-3 — `sddf-init --level minimal` (AC-2)

1. Pasos 1, 2, 3, 4, 6; informe con `[OMITIDO] project-policies-generation (nivel
   minimal)`; sin `templates/*.md`.

### F-4 — `--level foo` y `full` sin `memory-system` (AC-3, degradación)

1. `foo`: mensaje de valor no admitido antes de cualquier escritura; exit.
2. `full` sin el skill: Pasos 1–5, aviso `termina como standard`, Paso 6 sin bloque de
   scaffold.

## Decisiones de complejidad justificada

- **Tabla de pasos por nivel** en lugar de condicionales en cada paso: tres niveles se
  leen de un vistazo y añadir uno no toca los pasos.
- **Degradación sin `memory-system`**: una comprobación de existencia evita que un
  consumidor con `sddf-init` instalado y `memory-system` ausente reciba un error opaco.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `--level full` en directorio vacío: listado de archivos idéntico a `sddf-init` + `memory-system scaffold` | eval + comparación de listados en directorio temporal | AC-1 |
| 2 | Informe de `full` contiene el bloque `memory-system scaffold (nivel full)` con los cinco templates `[PRESERVADO]` | eval | AC-1, NFR-3 |
| 3 | Sin `--level`: informe idéntico al de la versión anterior; TC existentes de `sddf-init` sin cambios y en verde | eval | AC-2, NFR-1 |
| 4 | `--level minimal`: sin `templates/*.md`, sin pregunta de políticas, con `[OMITIDO] project-policies-generation` | eval | AC-2 |
| 5 | `--level foo`: mensaje de valor no admitido, ningún archivo creado | eval | AC-3 |
| 6 | `--level full` ×2: segunda corrida todo `[YA EXISTÍA]`/`[PRESERVADO]`, sin errores | eval | NFR-2 |
| 7 | `--level full` sin `memory-system` instalado: aviso y resultado de `standard` | eval | AC-1 (degradación) |
| 8 | `skills/sddf-init/SKILL.md`: Pasos 1–6 sin cambios de contenido (diff limitado a Parámetros, tabla, 5b e informe) | revisión del diff | AC-4 |
| 9 | Guía, README y CHANGELOG mencionan los tres niveles; `verify:links` verde | grep + comando | NFR-4 |
| 10 | Guardrail `gr-skill-creation-checklist` verde para `sddf-init` | comandos del guardrail | — |

## Risks / Trade-offs

- [El Paso 5 es interactivo y `full` lo conserva] → en CI usar `minimal`, o `standard`/`full`
  solo en sesiones interactivas; documentado en la guía.
- [`memory-system` resuelve una raíz distinta a la de `sddf-init`] → imposible tras el
  Paso 3: `sddf.config.yaml` ya declara `root` y ambos aplican el contrato v1; si
  `SDDF_ROOT` está definida, `sddf-init` ya exige que la configuración exista.
- [Cambio en el formato del informe de `scaffold`] → `sddf-init` lo concatena tal cual, sin
  parsearlo; un cambio de formato no rompe nada.
- [Eval de `full` depende de `memory-system` instalado en el runner] → el caso de
  degradación (V-7) cubre la ausencia; el caso `full` completo se marca dependiente de
  STORY-096.

## Open Questions

Sin preguntas abiertas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: reutilización
- **Descripción**: los cinco templates compartidos se copian dos veces en `full` (Paso 2b de `sddf-init` y `scaffold`); la segunda copia es `[PRESERVADO]` por diseño. No se elimina el Paso 2b para respetar AC-4 y la equivalencia de AC-1.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; documentar en el `SKILL.md` de `sddf-init` que los `[PRESERVADO]` del bloque de scaffold son esperados.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la historia dice "al finalizar invoca `/memory-system scaffold`"; con el Paso 5 interactivo (políticas) hay que decidir el orden. Se fija 5 → 5b para que una constitución generada por `project-policies-generation` no sea bloqueada por la semilla del scaffold.
- **Documento afectado**: story.md
- **Acción requerida**: anotar en el requerimiento "Niveles de `sddf-init`" que en `full` el scaffold se ejecuta después de la pregunta de políticas.

### CR-003
- **Tipo**: dependencia
- **Descripción**: el nivel `full` depende de `memory-system scaffold --yes` (STORY-096). La historia ya define la degradación (aviso y terminar como `standard`); el diseño la implementa en el Paso 5b.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; el eval V-7 la cubre.

### CR-004
- **Tipo**: desviación (fase REFACTOR de story-implement)
- **Descripción**: (a) NFR-1 prevalece sobre la interfaz "línea de cierre con `(nivel <n>)`": el sufijo solo se añade cuando `--level` se pasa explícitamente (muestra el nivel efectivo; `full` sin `memory-system` cierra con `(nivel standard)`); sin argumentos la línea es idéntica a la anterior. (b) El motor de `memory-system` emite rutas relativas a `SPECS_BASE` (`[PRESERVADO] templates/story-template.md`); `sddf-init` antepone `{SPECS_BASE}/` al concatenar el bloque del Paso 5b. (c) Las cifras del ejemplo de D-2 eran ilustrativas; las reales en un proyecto vacío son `creados: 19 · preservados: 5` (segunda corrida `preservados: 24`), con las líneas `capas faltantes: …` y `✅ memory-system scaffold — harness: sddf — docs`.
- **Documento afectado**: design.md (D-2, Interfaces), skills/sddf-init/SKILL.md
- **Acción requerida**: ninguna; el SKILL.md ya refleja (a)–(c) y la E2E real lo verificó.

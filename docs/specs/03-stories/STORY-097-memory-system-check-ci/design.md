---
alwaysApply: false
type: design
id: STORY-097
slug: STORY-097-memory-system-check-ci-design
title: "Design: Verificar la consistencia de la memoria con un modo check apto para CI"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-097
related:
  - STORY-097-memory-system-check-ci
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-098-memory-system-migrate-harness
  - STORY-043-header-aggregation
  - memory-system
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]
[[STORY-095-memory-system-index-alias]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-043-header-aggregation]]
[[memory-system]]

# Diseño técnico: Verificar la consistencia de la memoria con un modo check apto para CI

## Context

La memoria de `docs/` no tiene hoy ninguna verificación estructural. `docs/index.md` marca
"nodos pendientes" al regenerarse, pero no bloquea nada; `npm run verify:links`
(`scripts/check-doc-links.js`) revisa enlaces Markdown relativos del repositorio del
framework, no wikilinks ni frontmatter, y no existe en el proyecto consumidor. Los invariantes
7 y 8 de `docs/architecture/memory-system.md` ("guardrails verificables", "wikilinks
consistentes") no tienen herramienta que los haga cumplir.

Esta historia añade el subcomando `check` al motor `scripts/memory-system.js` del skill
`memory-system` (STORY-095) y el modo `check` al `SKILL.md`. Reutiliza el escáner de nodos,
el parser de frontmatter, las reglas de slug y el catálogo `LAYERS` que STORY-095 define para
`index`, y añade la única pieza nueva: la evaluación de cuatro familias de problemas con
salida textual o JSON y exit code.

Contexto técnico relevante (extraído en STORY-095 y reutilizado aquí):

- Motor Node ≥ 18 solo con módulos `node:`; el `SKILL.md` invoca
  `node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js <sub> --root <SPECS_BASE>`.
- Nodo indexable (`{ path, relPath, layer, slug, title, hasFrontmatter, wikilinks[] }`) y
  exclusiones (`index.md`, `specs/.cache/`, `templates/`, derivados de historia, `pre-split/`)
  según `references/memory-rules.md`.
- `HARNESS_PROFILES` con `skipLayers` (vacío hasta STORY-098): `check` debe respetarlo para no
  reportar como faltante una capa que el harness omite.
- Esquema canónico de `header-aggregation`: `type`, `id`, `slug`, `title`, `status`,
  `substatus`, `parent`, `created`, `updated`; `id` solo para specs.
- `memory-system.md` §7 invariante 2 declara `type, id, title, date, status` — diverge del
  esquema canónico (`date` vs `created/updated`, `id` obligatorio para todo). Ver CR-001.
- Este repositorio tiene ~300 `.md` bajo `docs/` (NFR de rendimiento: < 5 s).

Numeración de criterios usada en este diseño (orden de `story.md`):

| ID | Criterio resumido |
|---|---|
| AC-1 | `check` reporta sin escribir: capas faltantes, huérfanos, wikilinks rotos, frontmatters inválidos; exit 1 con ≥ 1 problema, 0 sin problemas. |
| AC-2 | `check --json` emite un único objeto con harness, raíz, `ok`, resumen por familia y lista de problemas (tipo, ruta, detalle); exit 1; tras corregir, `ok: true` y exit 0. |
| AC-3 | Cuatro familias con reglas fijas: capa faltante (11 capas), huérfano (sin bloque `---`), frontmatter inválido (`type`/`slug`/`title`; + `id`/`status` en `project|epic|story`), wikilink roto; se ignoran wikilinks en código y `templates/`. |
| AC-4 | Solo lectura; exit `0`/`1`/`2` (`2` = error técnico: raíz inexistente, runtime incompatible). |

NFR-1 determinismo · NFR-2 rendimiento (< 5 s en ~300 `.md`) · NFR-3 independencia de stack
(Node ≥ 18; sin Node, informe textual sin exit code) · NFR-4 portabilidad · NFR-5
documentación (`memory-system.md`, `sddf-commands-pipeline.md`).

## Goals / Non-Goals

**Goals:**

- Un gate determinista que un pipeline de CI pueda ejecutar con una línea y leer con `jq`.
- Cero falsos positivos sobre este repositorio: wikilinks en código, placeholders de
  `templates/` y artefactos derivados de historia no generan problemas.
- Reutilizar íntegramente el escáner de STORY-095; la única lógica nueva es la evaluación.

**Non-Goals:**

- Corregir nada (`ensure`, `header-aggregation`). Bidireccionalidad ni relaciones tipadas.
- Contenido semántico. Validar YAML completo (solo el subconjunto del esquema canónico).
- Nuevas reglas de slug o exclusiones: si `check` necesitara una, se cambia en
  `references/memory-rules.md` y la hereda `index`.

## Decisions

### D-1 — `check` es un subcomando del motor que reutiliza el escáner y solo añade evaluadores

// satisface: AC-1, AC-3, AC-4, NFR-1, NFR-2

Se añade `check` a `scripts/memory-system.js`. Flujo interno: `detect` → escanear nodos (la
misma función que usa `index`, con las mismas exclusiones) → ejecutar cuatro **evaluadores**
puros, cada uno `(contexto) → problemas[]`:

| Evaluador | `kind` | Regla |
|---|---|---|
| `missingLayers` | `missing-layer` | Por cada entrada de `LAYERS` (11 capas + `constitution.md`) no presente en `SPECS_BASE` y no incluida en `HARNESS_PROFILES[h].skipLayers`. |
| `orphans` | `orphan` | Nodo con `hasFrontmatter=false`. |
| `invalidFrontmatter` | `invalid-frontmatter` | Nodo con frontmatter sin `type`, `slug` o `title`; si `type ∈ {project, epic, story}`, además sin `id` o `status`. Un problema por campo ausente (`detail: "falta <campo>"`). |
| `brokenWikilinks` | `broken-wikilink` | Cada `[[slug]]` de `node.wikilinks` cuyo slug no está en el conjunto de slugs derivados (D-3 de STORY-095, incluidas raíces externas). Un problema por ocurrencia, con `detail: "[[slug]] no resuelve"`. |

Los evaluadores no escriben, no dependen del orden entre sí y devuelven problemas ordenados
por `(kind, path, detail)`; el orden fijo garantiza NFR-1. El escaneo es un único recorrido
del árbol (NFR-2): 300 archivos leídos una vez.

Alternativas rechazadas: (a) un script independiente `memory-check.js` — duplicaría el
escáner y el parser (anti-patrón "sin duplicación"); (b) hacer `check` inline en el
`SKILL.md` — sin exit code (AC-1) ni JSON reproducible (AC-2).

### D-2 — Extracción de wikilinks: fuera de código, sin alias ni anclas, sin `templates/`

// satisface: AC-3

La extracción de `node.wikilinks` (compartida con `index`, definida en
`references/memory-rules.md`) se fija aquí porque `check` es quien la hace bloqueante:

1. Se eliminan primero los bloques cercados (```` ``` ```` o `~~~`) y después el código
   inline (`` `…` ``).
2. Sobre el resto se capturan `[[…]]`; de cada captura se toma el texto antes de `|` y de
   `#`, recortado.
3. Capturas vacías o con `<`/`>` (placeholders de plantilla como `[[<slug>]]`) se descartan.
4. Los nodos de `templates/` y los demás excluidos no se escanean, por lo que sus wikilinks
   no existen para `check`.

Alternativa rechazada: evaluar wikilinks solo en `index.md` (como el viejo `docs-wiki-builder`)
— dejaría sin detectar enlaces rotos en guías, ADRs e historias, que es donde ocurren.

### D-3 — Campos obligatorios verificados: subconjunto del esquema canónico, no el invariante 2

// satisface: AC-3

`check` exige `type`, `slug`, `title` a todo nodo, y `id`, `status` a `project|epic|story`.
No exige `date`, `created`, `updated`, `substatus` ni `parent`: son campos que
`header-aggregation` deriva y que muchos artefactos legítimos (guías, ADRs, runbooks) no
declaran de forma uniforme; exigirlos convertiría el primer `check` del repositorio en decenas
de falsos positivos. El conjunto queda declarado en `REQUIRED_FIELDS` del motor y documentado
en `references/memory-rules.md`; `memory-system.md` §7 se alinea (CR-001).

Alternativa rechazada: adoptar literalmente el invariante 2 (`type, id, title, date, status`)
— `date` no existe en el esquema canónico y `id` no aplica a guías.

### D-4 — Dos formatos de salida y tres exit codes, decididos en el motor

// satisface: AC-1, AC-2, AC-4, NFR-1

Salida por defecto (texto), agrupada por familia y ordenada:

```
── memory-system check ── harness: sddf · root: docs
[missing-layer]        product/ — capa ausente
[orphan]               guides/notas.md — sin frontmatter
[invalid-frontmatter]  adr/ADR-0003-x.md — falta title
[broken-wikilink]      guides/sdd.md — [[no-existe]] no resuelve
────────────────────────────────────────────────
problemas: 4 (missing-layer 1 · orphan 1 · invalid-frontmatter 1 · broken-wikilink 1)
```

Con `--json`, un único objeto en stdout y nada más (para `jq`):

```
{ "harness": "sddf", "root": "docs", "ok": false,
  "summary": { "missing-layer": 1, "orphan": 1, "invalid-frontmatter": 1, "broken-wikilink": 1 },
  "problems": [ { "kind": "missing-layer", "path": "product/", "detail": "capa ausente" }, … ] }
```

`path` siempre relativo a `SPECS_BASE` con `/` (NFR-4). Exit `0` si `problems` está vacío,
`1` si no, `2` ante error técnico (raíz inexistente, `--harness` no admitido, Node < 18); en
ese caso el mensaje va a stderr y, con `--json`, stdout lleva
`{ "ok": false, "error": "<mensaje>" }`.

Alternativa rechazada: exit 1 también para errores técnicos — CI no distinguiría "memoria
rota" de "herramienta mal invocada".

### D-5 — El modo `check` del `SKILL.md` propaga el exit code y degrada sin Node

// satisface: AC-1, NFR-3

`SKILL.md`, modo `check [--json] [--harness h]`: resuelve raíz y `CLI_ROOT`, invoca el motor,
reenvía stdout tal cual (imprescindible con `--json`) y termina con el mismo exit code. Sin
`node` en PATH: ejecuta las cuatro reglas inline siguiendo `references/memory-rules.md`,
imprime el informe textual y añade `⚠️ node no disponible — sin exit code; no usar en CI`.

Documentación de uso en CI (NFR-5), en `sddf-commands-pipeline.md`:
`node .claude/skills/memory-system/scripts/memory-system.js check --root docs --json`
(invocación directa del motor, sin pasar por el agente, que es lo que un pipeline necesita).

### D-6 — Documentación y alineación de la arquitectura

// satisface: NFR-5

- `docs/architecture/memory-system.md`: §10 añade el modo `check` (familias, esquema JSON,
  exit codes) y §7 invariante 2 pasa a "Frontmatter obligatorio: `type`, `slug`, `title`
  (+ `id`, `status` en specs); esquema completo en `header-aggregation`" (CR-001).
- `docs/guides/sddf-commands-pipeline.md` §0: ejemplo de gate CI.
- `README.md`: mención de `check`; `CHANGELOG.md` 3.3.0: Added.
- Ejecutar `check` sobre este repositorio y corregir los problemas reales encontrados forma
  parte de la historia (verificación sugerida 1), sin extender el alcance a rediseñar
  artefactos: solo frontmatter faltante y wikilinks rotos evidentes.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Subcomando `check` + evaluadores + `REQUIRED_FIELDS` | modificar (añadir) | `skills/memory-system/scripts/memory-system.js` | AC-1, AC-2, AC-3, AC-4 |
| Extracción de wikilinks (compartida con `index`) | modificar (fijar reglas) | `skills/memory-system/scripts/memory-system.js`, `skills/memory-system/references/memory-rules.md` | AC-3 |
| Modo `check` del skill | modificar | `skills/memory-system/SKILL.md` | AC-1, AC-2 |
| Evals del skill | modificar (añadir casos) | `skills/memory-system/evals/evals.json` | AC-1, AC-2 |
| Fixtures | crear | `skills/memory-system/examples/broken/` (un problema por familia + falsos positivos) | AC-3 |
| Tests del motor | modificar (añadir) | `test/memory-system.test.js` | AC-1…AC-4, NFR-1, NFR-2 |
| Documentación | modificar | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | NFR-5 |
| Memoria de este repositorio | corregir | `docs/**` (solo frontmatter faltante y wikilinks rotos detectados) | AC-1 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `/memory-system check [--json] [--harness h]` | Invoca el motor, reenvía stdout, propaga exit code; degradación inline sin Node con aviso. | AC-1, AC-2 |
| `node scripts/memory-system.js check --root <SPECS_BASE> [--harness h] [--json]` | Solo lectura. Texto agrupado por familia o JSON único en stdout; errores técnicos en stderr; exit 0 / 1 / 2. | AC-1, AC-2, AC-4 |
| Objeto JSON de `check` | `{ harness, root, ok, summary{kind→n}, problems[{kind, path, detail}] }`; claves y orden estables; `problems` ordenado por `(kind, path, detail)`. | AC-2, NFR-1 |
| `REQUIRED_FIELDS` | `{ all: [type, slug, title], specs: [id, status] }`; leído por `check` y documentado en `memory-rules.md`. | AC-3 |
| Evaluador | `(ctx: { nodes, layers, profile, slugSet }) → Problem[]`; sin efectos. | AC-3, AC-4 |

## Esquema de datos

- **Problem**: `{ kind: missing-layer | orphan | invalid-frontmatter | broken-wikilink, path: string, detail: string }`.
- **Resultado de check**: `{ harness, root, ok: boolean, summary: Record<kind, number>, problems: Problem[] }`.
- **Contexto de evaluación**: `{ nodes: Node[], layers: LAYERS, profile: HARNESS_PROFILES[h], slugSet: Set<string> }`.

## Flujos clave

### F-1 — `check` en CI sobre este repositorio (AC-1, AC-2)

1. `node .claude/skills/memory-system/scripts/memory-system.js check --root docs --json`.
2. `detect` → `sddf`; escaneo único de `docs/`; evaluadores.
3. stdout: objeto JSON; exit 0 si `ok`, 1 si no. Ningún archivo cambia.

### F-2 — Corrección y re-chequeo (AC-2)

1. `check --json` → `ok: false`, `broken-wikilink` en `guides/sdd.md`.
2. Se corrige el wikilink.
3. `check --json` → `ok: true`, exit 0.

### F-3 — Error técnico (AC-4)

1. `check --root no-existe` → stderr `raíz inexistente: no-existe`, exit 2; con `--json`,
   stdout `{ "ok": false, "error": "raíz inexistente: no-existe" }`.

### F-4 — `/memory-system check` sin Node (NFR-3)

1. `SKILL.md` no encuentra `node`; aplica las cuatro reglas inline; imprime el informe y el
   aviso de "sin exit code".

## Decisiones de complejidad justificada

- **Evaluadores como funciones puras separadas**: cuatro familias hoy; STORY-098 y futuras
  reglas (bidireccionalidad) se añaden sin tocar el escaneo ni la salida.
- **Tres exit codes**: distinguir "memoria rota" de "herramienta mal invocada" es lo que hace
  el gate utilizable en CI; el coste es una rama.
- **Objeto JSON estable con claves ordenadas**: sin ello dos ejecuciones podrían diferir en
  orden y romper NFR-1.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Fixture `examples/broken/`: cuatro problemas (uno por familia), exit 1, ningún hash cambia | `node --test` | AC-1, AC-3, AC-4 |
| 2 | Fixture sano: `problems: []`, `ok: true`, exit 0 | `node --test` | AC-1 |
| 3 | `--json` produce un único objeto parseable con `harness`, `root`, `ok`, `summary`, `problems` | `node --test` (`JSON.parse`) | AC-2 |
| 4 | Corregir el wikilink del fixture → `ok: true`, exit 0 (F-2) | `node --test` | AC-2 |
| 5 | Falsos positivos: `[[x]]` en código inline y fence, `[[<slug>]]` en `templates/`, `[[real\|Alias]]`, `[[real#sec]]` → 0 `broken-wikilink` | `node --test` | AC-3 |
| 6 | Guía sin `id` no es `invalid-frontmatter`; historia sin `status` sí | `node --test` | AC-3 |
| 7 | `skipLayers` del perfil no genera `missing-layer` | `node --test` | AC-3 |
| 8 | Dos ejecuciones sobre el mismo fixture → salida byte a byte idéntica | `node --test` | NFR-1 |
| 9 | Raíz inexistente y `--harness foo` → exit 2, stderr con mensaje, stdout JSON con `error` | `node --test` | AC-4 |
| 10 | `check` sobre `docs/` de este repo termina en < 5 s | `node --test` con temporizador | NFR-2 |
| 11 | `/memory-system check` propaga el exit code del motor | eval del skill | AC-1 |
| 12 | `memory-system.md` §7 y §10, `sddf-commands-pipeline.md`, README, CHANGELOG mencionan `check`; `verify:links` verde | grep + comando | NFR-5 |

## Risks / Trade-offs

- [El primer `check` sobre este repositorio devuelve muchos problemas reales] → se aceptan y
  corrigen solo frontmatter faltante y wikilinks rotos evidentes (D-6); lo demás se documenta
  en el `implement-report.md` como deuda, sin bloquear la historia.
- [Reglas de wikilink demasiado laxas o estrictas] → V-5 fija los casos límite; cualquier
  ajuste se hace en `memory-rules.md` y lo hereda `index`.
- [Node < 18 en el runner de CI] → exit 2 con mensaje explícito; documentado.
- [Salida JSON contaminada por logs del motor] → con `--json` el motor no escribe nada más en
  stdout; los avisos van a stderr.

## Open Questions

Sin preguntas abiertas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: `memory-system.md` §7 invariante 2 exige `type, id, title, date, status`; el esquema canónico de `header-aggregation` usa `slug`, `created`, `updated` y `id` solo en specs. `check` valida `type, slug, title` (+ `id`, `status` en specs) según D-3.
- **Documento afectado**: docs/architecture/memory-system.md
- **Acción requerida**: reescribir el invariante 2 con el conjunto de D-3 y remitir a `header-aggregation` como esquema completo (tarea de documentación de esta historia).

### CR-002
- **Tipo**: dependencia
- **Descripción**: `check` reutiliza el escáner, el parser y `HARNESS_PROFILES.skipLayers` de STORY-095/098. Si STORY-097 se implementa antes que STORY-095, el escáner nace aquí y `index` lo hereda (la historia ya lo prevé); `skipLayers` vacío hasta STORY-098 no afecta a `check`.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; registrar el orden recomendado 095 → 097.

### CR-003
- **Tipo**: reutilización
- **Descripción**: `scripts/check-doc-links.js` (`npm run verify:links`) valida enlaces Markdown relativos en el repositorio del framework; `check` no lo sustituye ni lo duplica: cubre wikilinks y frontmatter, que aquel no revisa.
- **Documento afectado**: design.md
- **Acción requerida**: documentar en `sddf-commands-pipeline.md` que ambos son complementarios.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: `testcases.md` (EV-003, E2E-001) usaba `examples/sddf/` como "fixture sano" con `problemas: 0`, pero ese fixture es inalcanzable para `check`: su `guides/sdd.md` **omite `slug` a propósito** para ejercitar la derivación por nombre de archivo de `index` (con tests de STORY-095 que dependen de ello) y le faltan capas de `LAYERS`. Completarlo habría roto esos tests; debilitar `missingLayers` o `REQUIRED_FIELDS` habría vaciado la regla de D-1/D-3.
- **Decisión tomada**: se crea un fixture nuevo `skills/memory-system/examples/sane/` (once capas, `constitution.md`, frontmatter completo y wikilinks que resuelven) y `examples/sddf/` queda intacto. El caso de eval TC-013 apunta a `sane`.
- **Documento afectado**: design.md, testcases.md
- **Acción requerida**: ninguna; registrado.

### CR-005
- **Tipo**: dependencia
- **Descripción**: `invalidFrontmatter` debe evaluar el campo `slug` **declarado** en el frontmatter, pero `deriveNode` ya normalizaba `slug` al valor derivado por `deriveSlug`, con lo que un artefacto sin `slug` declarado era indistinguible de uno que sí lo declara.
- **Decisión tomada**: `deriveNode` devuelve un campo adicional `declared` con el frontmatter crudo. El contrato previo (`path, relPath, layer, slug, title, hasFrontmatter, slugPlaceholder, wikilinks`) no cambia, `index` conserva su comportamiento y se evita una segunda lectura por archivo (NFR-2). Alternativas descartadas: reparsear dentro de `check` y dejar `slug` sin normalizar.
- **Documento afectado**: design.md, `references/memory-rules.md` §2
- **Acción requerida**: ninguna; registrado.

### CR-006
- **Tipo**: ambigüedad
- **Descripción**: el caso de eval TC-012 (EV-002) exigía la subcadena literal `"ok": false` **con espacio**. El motor la emite (`JSON.stringify(…, null, 2)`), pero el runner de evals transcribe la salida mediante un agente y puede devolver JSON compacto, lo que producía un falso negativo. AC-2 exige un único objeto con `ok: false`, no un espaciado concreto.
- **Decisión tomada**: la aserción pasa a `"ok"` + `false` (independiente del formato) y `not_contains` cubre ambas grafías de `ok: true`, de modo que una salida con `ok` verdadero sigue sin poder pasar. El formato exacto y la estabilidad byte a byte los verifica UT-008 de forma determinista.
- **Documento afectado**: `skills/memory-system/evals/evals.json`
- **Acción requerida**: ninguna; registrado.

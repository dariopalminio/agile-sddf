---
type: architecture
id: ARCH-MEMORY
slug: memory-system
title: "Sistema de Memoria del Framework SDDF"
date: 2026-09-20
status: active
related: []
---


# Sistema de Memoria SDDF

> **Tipo:** architecture · **ID:** ARCH-MEMORY · **Estado:** active  
> **Profundidad:** detalle → [[domain-knowledge-artifacts]], [[domain-work-item-hierarchy]]

---

## 1. Tres capas, tres preguntas

| Capa | Pregunta | Vida | Audiencia |
|------|----------|------|-----------|
| `product/` | ¿Por qué existe? | Años | PO, negocio |
| `requirements/` | ¿Qué debe hacer? | Meses | PO, equipo, QA |
| `specs/` | ¿Cómo lo construimos ahora? | Días/semanas | Equipo, IA |

**Regla dura:** un requirement describe **comportamiento del producto**; una story describe **un incremento que lo materializa** y declara `implements: [FR-NNN]`. No duplicar el "qué".

---

## 2. Capas de soporte

| Capa | Contiene | Vida |
|------|----------|------|
| `domains/` | Modelo DDD (entidades, invariantes, lenguaje ubicuo) | Muy larga |
| `architecture/` | C4, stack, vistas de sistema | Larga |
| `adr/` | Decisiones inmutables (`ADR-NNNN`) | Inmutable |
| `rfcs/` | Solicitudes de cambio de arquitectura | Larga |
| `guardrails/` | Restricciones verificables (checklists con `error`/`warn`) | Larga |
| `policies/` | Reglas de gobernanza; `constitution.md` en la raíz de `docs/` | Larga |
| `guides/` | Explicaciones didácticas y how-tos | Media |
| `runbooks/` | Procedimientos operativos (deploy, recovery) | Larga |
| `templates/` | Meta-artefactos para generar otros artefactos | Muy larga |

---

## 3. Estructura de la memoria (árbol)

```
agile-sddf/
├── AGENTS.md                          # punto de entrada para agentes IA
├── CLAUDE.md                          # (opcional) punto de entrada para Claude Code
├── sddf.config.yaml                   # configuración: skills activos por fase
│
└── docs/                              # raíz única de la memoria (configurable)
    ├── index.md                       # cursor principal wiki (wikilinks [[slug]])
    ├── constitution.md                # principios supremos (raíz de gobernanza)
    │
    ├── product/                       # capa 1: contexto del negocio
    │   ├── README.md
    │   ├── vision.md
    │   ├── stakeholders.md
    │   └── objectives.md
    │
    ├── requirements/                  # capa 2: contrato funcional (persistente)
    │   ├── README.md
    │   ├── functional/
    │   │   └── FR-NNN-*.md
    │   └── non-functional/
    │       └── NFR-NNN-*.md
    │
    ├── specs/                         # capa 3: construcción por incremento
    │   ├── 01-projects/               # L3 — documentación fundacional
    │   │   └── PROJ-NNN-*/
    │   │       └── project.md
    │   ├── 02-epics/                  # L2 — entregables
    │   │   └── EPIC-NNN-*/
    │   │       └── epic.md
    │   ├── 03-stories/                # L1 — historias atómicas
    │   │   └── STORY-NNN-*/
    │   │       └── story.md
    │   └── .cache/                    # caché regenerable (NO versionado)
    │       └── index.json
    │
    ├── domains/                       # modelo DDD del sistema
    │   ├── README.md
    │   └── domain-<name>.md
    │
    ├── architecture/                  # arquitectura técnica
    │   ├── README.md
    │   ├── system-overview.md
    │   ├── tech-stack.md
    │   └── c4/                        # diagramas c4
    │
    ├── adr/                           # decisiones inmutables
    │   ├── README.md
    │   └── ADR-0001-<adr-name>.md
    │
    ├── policies/                      # gobernanza (derivan de constitution.md)
    │   ├── README.md
    │   └── <policy-name>-policy.md
    │
    ├── guardrails/                    # restricciones verificables
    │   ├── README.md
    │   ├── dod-story-checklist.md     # transition guardrail
    │   └── <guardrail-name>-checklist.md      # content guardrail
    │
    ├── guides/                        # documentación didáctica
    │   ├── README.md
    │   ├── guide-<topic>.md
    │   └── how-to-<topic>.md
    │
    ├── runbooks/                      # procedimientos operativos
    │   ├── README.md
    │   └── runbook-<topic>.md
    │
    ├── rfcs/                          # (opcional) solicitudes de cambio de arquitectura;
    │   ├── README.md                  #   no forma parte de las once capas ni la crea el scaffold
    │   └── rfc-<topic>.md
    │
    └── templates/                     # meta-artefactos (las nueve plantillas base)
        ├── README.md
        ├── story-template.md          # dueño: story-creation
        ├── epic-template.md           # dueño: epic-creation
        ├── project-template.md        # dueño: project-discovery
        ├── project-intent-template.md # dueño: project-begin
        ├── project-plan-template.md   # dueño: project-planning
        ├── adr-template.md            # autoría manual, semilla de memory-system
        ├── domain-template.md         # autoría manual, semilla de memory-system
        ├── guardrail-template.md      # autoría manual, semilla de memory-system
        └── policy-template.md         # autoría manual, semilla de memory-system
```

Las once capas de memoria son `product/`, `requirements/`, `specs/`, `domains/`, `architecture/`,
`adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/` y `templates/`, más `constitution.md`
en la raíz. `rfcs/` es opcional y no la gestiona ningún skill. No existe `requirement-template.md`:
ningún skill escribe ese template (principio 13 de la constitución), así que no se distribuye.

### Reglas del árbol

| Regla | Detalle |
|-------|---------|
| **Raíz única** | Todo bajo `docs/`; el nombre es configurable vía `sddf.config.yaml` (`root:`). |
| **Un nivel, una responsabilidad** | Cada carpeta de primer nivel agrupa un tipo de artefacto distinto. |
| **Sin anidamiento profundo** | Máximo 2–3 niveles por debajo de `docs/` (excepto `specs/`, que tiene 3 por su jerarquía L3→L2→L1). |
| **Prefijos numéricos** | Solo en `specs/` (`01-`, `02-`, `03-`) para reflejar el orden L3→L2→L1. |
| **`.cache/` no versionado** | Los índices derivados viven en `.cache/` y se regeneran on-demand. |
| **Templates fuera de specs** | `docs/templates/` es meta-artefacto; no vive dentro de `specs/`. |
| **Constitution fuera de policies** | `docs/constitution.md` está un nivel por encima para reflejar jerarquía. |

---

## 4. Regla de decisión: ¿dónde va esto?

| Si es... | Va en... |
|----------|----------|
| Contexto del negocio (por qué, para quién) | `product/` |
| Comportamiento que el producto debe cumplir siempre | `requirements/` |
| Incremento concreto que se construye ahora | `specs/` |
| Modelo del negocio (entidades, invariantes) | `domains/` |
| Estructura técnica (C4, stack) | `architecture/` |
| Decisión arquitectónica inmutable | `adr/` |
| Restricción verificable que bloquea | `guardrails/` |
| Regla de gobernanza | `policies/` |
| Explicación didáctica | `guides/` |
| Procedimiento operativo | `runbooks/` |
| Plantilla de generación | `templates/` |
| Solicitud de cambio de arquitectura | `rfcs/` | Larga |

---

## 5. Trazabilidad (flujo canónico)

```
product/vision.md
    ↓ informs
requirements/FR-001.md
    ↓ verified-by
specs/03-stories/STORY-042/story.md
    ↓ implements
requirements/FR-001.md
```

**Bidireccionalidad obligatoria:** si A enlaza a B, B debe poder enlazar a A. Relaciones tipadas: `parent`, `implements`, `verified-by`, `traces-to`, `applied-by`, `originates-from`, `enforced-by`, `supersedes`. Ver [[domain-knowledge-artifacts]] §7.

---

## 6. Gobernanza

```
AGENTS.md                     # punto de entrada IA
    ↓
docs/constitution.md          # principios supremos (fuera de policies/)
    ├──► docs/policies/       # reglas derivadas
    └──► docs/guardrails/     # restricciones verificables
```

**Reglas:**
- La constitución no se edita a la ligera; cambio requiere aprobación y versionado.
- Toda policy declara si deriva de la constitución (`derives-from`).
- Todo guardrail declara su policy originadora (`originates-from`) o justifica su ausencia.
- Conflicto policy ↔ constitución: gana la constitución.

---

## 7. Invariantes del sistema

1. **Una raíz única**: todo bajo `docs/` (configurable vía `sddf.config.yaml`).
2. **Frontmatter obligatorio**: `type`, `slug`, `title` (+ `id`, `status` en specs); esquema completo
   en `header-aggregation`.
3. **IDs únicos globalmente**: `FR-001`, `STORY-042`, `ADR-0003` no se repiten.
4. **Sin duplicación**: una regla vive en un solo lugar; se enlaza, no se copia.
5. **Bidireccionalidad**: todo enlace es navegable en ambas direcciones.
6. **ADRs inmutables**: no se editan; se superseden.
7. **Guardrails verificables**: `enforcement: error` ⇒ verificación determinista.
8. **Wikilinks consistentes**: `[[slug]]` resuelve a un artefacto existente.
9. **Convención de guion**: ASCII U+002D `-` en slugs.

---

## 8. Anti-patrones

- ❌ Duplicar un requirement en la story.
- ❌ Editar un ADR aceptado.
- ❌ Mezclar visión y requisitos bajo el mismo nombre.
- ❌ Poner `dod-story-checklist.md` en `policies/` (es un transition guardrail).
- ❌ Indexar todo en un archivo monolítico.
- ❌ Enlazar sin bidireccionalidad.
- ❌ Usar `docs/specs/templates/` en lugar de `docs/templates/`.

---

## 9. Referencias

| Documento | Propósito |
|-----------|-----------|
| [[domain-knowledge-artifacts]] | Modelo completo de artefactos, tipos y TraceLinks |
| [[domain-work-item-hierarchy]] | Estructura Project → Epic → Story |
| [[domain-state-management]] | Estados, subestados, transiciones |
| `sddf.config.yaml` | Configuración del framework |

---

## 10. Herramienta: skill `memory-system`

El skill `memory-system` (`skills/memory-system/`, STORY-095, STORY-096 y STORY-097) es el único
punto de entrada operativo de este sistema. Expone los modos `ensure` (por defecto), `scaffold`,
`rebuild`, `index` y `check`; `migrate` llega con la historia hermana STORY-098 de EPIC-20.

### 10.1 Modos

| Modo | Estado | Qué hace |
|------|--------|----------|
| `ensure [--fix-frontmatter] [--harness h]` (= sin modo) | STORY-096 | `detect → scaffold → [header-aggregation] → index`: crea solo lo que falta de las once capas, regenera `index.md` y reporta `creados: N · preservados: M · índice regenerado: sí`. Con `--fix-frontmatter` invoca `header-aggregation` en batch con "Saltar todos los conflictos" (solo archivos sin frontmatter). Idempotente: la segunda ejecución reporta `creados: 0`. |
| `scaffold [--dry-run] [--harness h]` | STORY-096 | `detect → scaffold`: copia-si-falta del árbol semilla y de las nueve plantillas; no toca `index.md`. `--dry-run` imprime `[CREARÍA]`/`[PRESERVARÍA]` sin escribir. |
| `rebuild [--force]` | STORY-096 | Sin `--force`: `❌ rebuild es destructivo. Añade --force para confirmar.` y ningún cambio. Con `--force`: advertencia `⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán.`, `scaffold --force` (sobrescribe solo los archivos gestionados, §10.3) e `index`. Nunca borra. |
| `index [--harness h] [--dry-run]` | STORY-095 | Regenera `docs/index.md` completo desde `assets/index-template.md`: una entrada `[[slug]]` por artefacto, agrupada por capa, más "Estado del grafo" y "Nodos pendientes". `--dry-run` imprime sin escribir. |
| `check [--json] [--harness h]` | STORY-097 | Verificación en **solo lectura** de cuatro familias de problemas, con exit code para CI (§10.4). No corrige nada y no regenera `index.md`. |
| `migrate` | STORY-098 | Adaptar el scaffolding a OpenSpec/Spec-kit (`skipLayers`, `mappings`). |

### 10.2 Arquitectura

- `SKILL.md` resuelve la raíz (contrato `SDDF-ROOT-RESOLUTION: v1`), interpreta el modo y delega en
  `scripts/memory-system.js`, un motor Node ≥ 18 sin dependencias (solo `node:fs`, `node:path`,
  `node:process`) con los subcomandos `detect`, `scaffold`, `index` y `check`, que produce el mismo
  `index.md` en cada ejecución salvo `updated`. Sin `node` en PATH el skill aplica scaffold e índice
  inline con `references/memory-rules.md`, avisando de que la reproducibilidad byte a byte no está
  garantizada. El gate `--force` de `rebuild` vive en `SKILL.md` (es interacción); el motor solo
  conoce `scaffold --force`.
- **Catálogo único de capas** (`LAYERS`): las once capas se declaran una vez en el motor; `scaffold`
  las usa para detectar capas faltantes y el índice deriva de ellas sus placeholders (`specs` más
  su desglose `specs-projects|epics|stories`, `templates` excluida, más `root` y `external`).
- **Árbol semilla** (`assets/scaffold/**`, espejo del destino): `constitution.md` (secciones de la
  constitución del framework con `[Por completar]`), `product/{README,vision,stakeholders,objectives}.md`,
  un `README.md` por capa con propósito, convención de nombres y wikilink `[[index]]`,
  `specs/01-projects/`, `02-epics/`, `03-stories/` (con `.gitkeep` solo si el directorio no existe),
  `templates/README.md` y `templates/adr-template.md`. Frontmatter canónico de `header-aggregation`
  con `created`/`updated` = `{date}`, el único placeholder que el motor sustituye al copiar.
- **Plantillas compartidas**: `scaffold` aplica la misma tabla que `sddf-init` Paso 2b (ADR-0001:
  un dueño por template) copiando byte a byte desde `<CLI_ROOT>/skills/<dueño>/assets/`; si el
  dueño no está instalado emite `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)`
  y continúa con exit 0.
- **Copia-si-falta y no-eliminación**: por archivo, destino ausente → `[CREADO]`; presente →
  `[PRESERVADO]`; solo con `--force` → `[SOBRESCRITO]`. Ningún modo elimina archivos ni directorios.
  Última línea: `creados: N · sobrescritos: S · preservados: M · omitidos por harness: K` (`K` = 0
  hasta que STORY-098 rellene `skipLayers`).
- **Detección de harness** (`detect`): `--harness` > `sddf.config.yaml` > `.specify/` > `openspec/`
  > `generic`. La tabla `HARNESS_PROFILES` declara por harness el marcador y las raíces externas
  indexadas en solo lectura (`specs/*/spec.md` y `plan.md` en Spec-kit; `openspec/specs/**/spec.md`
  y `openspec/changes/*/proposal.md` en OpenSpec), y reserva `skipLayers`/`mappings` para STORY-098.
- **Reglas de nodo** (`references/memory-rules.md`): slug = `frontmatter.slug`, o el directorio para
  `story.md`/`epic.md`/`project.md`/`spec.md`/`proposal.md`/`plan.md`, o `<dir>-index` para
  `README.md`, o el nombre del archivo; título = `frontmatter.title` o primer `#`; capa = primer
  segmento de la ruta (`specs/` se divide en `specs-projects|epics|stories`, raíz = `root`, raíces
  externas = `external`). Se excluyen `index.md`, `specs/.cache/`, `templates/`, `pre-split/` y los
  derivados de historia (`design.md`, `tasks.md`, `testcases.md`, `analyze.md`, `*-report.md`,
  `fix-directives.md`, `finvest-evaluation-report.md`, `story-improvement-log.md`).
- **Template como fuente de verdad**: `assets/index-template.md` fija las secciones; el motor solo
  sustituye `{layer:<capa>}`, `{stats}` y `{date}`, y falla (exit 2, sin escribir) si un placeholder
  no corresponde a una capa conocida o una capa con nodos carece de placeholder.
- **Nodos sin frontmatter** se enlazan solo por ruta con `⚠️ sin frontmatter`; en `index` los
  wikilinks que no resuelven se listan como `⚠️ nodo pendiente` sin bloquear. `check` es quien
  impone las invariantes 2, 7 y 8: el mismo hecho es informativo en `index` y bloqueante en `check`.
- **Evaluadores puros** (`check`): el subcomando reutiliza el escáner, el parser de frontmatter y
  las reglas de slug de `index` sin duplicarlos, y añade solo cuatro funciones
  `(ctx) → Problem[]` sin efectos, donde `ctx = { root, nodes, layers, profile, slugSet }`. Añadir
  una familia (bidireccionalidad, relaciones tipadas) no toca el escaneo ni la salida.

### 10.3 Archivos gestionados por el scaffold (alcance de `rebuild --force`)

`rebuild --force` puede sobrescribir **únicamente** esta lista (fuente de verdad:
`skills/memory-system/references/memory-rules.md` §5); todo lo demás son artefactos de autor
(ADRs, historias, épicas, proyectos, guías, runbooks, policies y guardrails concretos, `rfcs/`) y
ningún modo los toca ni los elimina:

| Gestionado | Origen |
|---|---|
| `constitution.md` | semilla |
| `product/README.md`, `product/vision.md`, `product/stakeholders.md`, `product/objectives.md` | semilla |
| `requirements/README.md`, `specs/README.md`, `domains/README.md`, `architecture/README.md`, `adr/README.md`, `policies/README.md`, `guardrails/README.md`, `guides/README.md`, `runbooks/README.md`, `templates/README.md` | semilla |
| `templates/adr-template.md` | semilla (contenido de `docs/adr/adr-template.md`) |
| `templates/story-template.md`, `epic-template.md`, `project-template.md`, `project-intent-template.md`, `project-plan-template.md` | skill dueño (`story-creation`, `epic-creation`, `project-discovery`, `project-begin`, `project-planning`) |

Un proyecto real recupera una constitución personalizada desde git tras `rebuild --force`; por eso
el modo exige el flag y emite la advertencia literal antes de escribir.

### 10.4 Modo `check`: el gate de consistencia (STORY-097)

`check` es la primera verificación estructural de la memoria y el único modo con exit code
significativo. Es **solo lectura**: no crea, no modifica, no borra y no regenera `index.md`.

**Las cuatro familias de problemas.** Un único recorrido del árbol (el mismo escáner y las mismas
exclusiones de `index`) alimenta cuatro evaluadores puros:

| Familia (`kind`) | Regla | Invariante que impone |
|---|---|---|
| `missing-layer` | Falta una de las once capas como directorio de la raíz, o falta `constitution.md`, y el perfil del harness no la omite (`skipLayers`). | §3, §7.1 |
| `orphan` | Nodo indexable sin bloque de frontmatter (`---` inicial ausente o sin cerrar). | §7.2 |
| `invalid-frontmatter` | Falta `type`, `slug` o `title` en el frontmatter **declarado**; además `id` o `status` cuando `type ∈ {project, epic, story}`. Un problema por campo ausente. | §7.2, §7.3 |
| `broken-wikilink` | Ocurrencia de un wikilink que no resuelve contra el conjunto de slugs derivados. | §7.8 |

Se evalúa el campo **declarado**, no el derivado: un artefacto cuyo `slug` deduce el motor de su
nombre de archivo se indexa igual, pero `check` lo marca. El conjunto exigido es `REQUIRED_FIELDS`
= `{ all: [type, slug, title], specs: [id, status] }`, un subconjunto deliberado del esquema
canónico de `header-aggregation`: `date` no existe en ese esquema, `created`/`updated` los deriva la
herramienta y `substatus`/`parent` solo aplican dentro de un flujo. Exigirlos convertiría el primer
`check` de un repositorio real en decenas de falsos positivos. El razonamiento completo está en
`skills/memory-system/references/memory-rules.md` §6, que es la fuente de verdad ampliable.

**Falsos positivos que `check` no reporta**, por las reglas de extracción de wikilinks
(`memory-rules.md` §2): un wikilink dentro de un fence o de código inline, los placeholders de
plantilla con `<`/`>`, los nodos de `templates/` y los demás excluidos, y el alias y el anchor de
`[[destino|Alias]]` / `[[destino#seccion]]`, que se normalizan al destino.

**Esquema JSON** (`--json`, un único objeto en stdout y nada más, con las claves en este orden):

```json
{
  "harness": "sddf",
  "root": "docs",
  "ok": false,
  "summary": { "missing-layer": 1, "orphan": 1, "invalid-frontmatter": 1, "broken-wikilink": 1 },
  "problems": [
    { "kind": "missing-layer", "path": "product/", "detail": "capa ausente" },
    { "kind": "orphan", "path": "guides/notas.md", "detail": "sin frontmatter" },
    { "kind": "invalid-frontmatter", "path": "adr/ADR-0003-x.md", "detail": "falta title" },
    { "kind": "broken-wikilink", "path": "guides/sdd.md", "detail": "[[no-existe]] no resuelve" }
  ]
}
```

`path` es siempre relativa a la raíz y con `/` (portabilidad); `problems` va ordenado por
`(kind, path, detail)` con comparación ordinal, de modo que dos ejecuciones producen la misma salida
byte a byte. Sin `--json` el informe es textual, agrupado por familia, y su última línea es
`problemas: N (missing-layer n · orphan n · invalid-frontmatter n · broken-wikilink n)`.

**Los tres exit codes** son lo que hace el modo utilizable en CI:

| Exit | Significado | Salida |
|---|---|---|
| `0` | Memoria consistente | `problemas: 0` (o `"ok": true`) en stdout. |
| `1` | Al menos un problema — resultado normal del gate, no un fallo de la herramienta. En `check` es su **único** significado | El informe o el objeto JSON en stdout, sin mensaje de error. |
| `2` | Error técnico: raíz inexistente, `--harness` no admitido, argumentos mal formados, Node < 18 y cualquier error inesperado durante el chequeo | Mensaje en stderr (`❌ raíz inexistente: … (no existe o no es un directorio)`); con `--json`, stdout lleva `{ "ok": false, "error": "…" }` y nada más, también cuando el error es de parseo de argumentos. |

Distinguir `1` de `2` es deliberado: un pipeline no debe confundir "memoria rota" con "herramienta
mal invocada". Por eso en `check` **todo** error termina en `2`, no solo los tres casos que el
diseño enumeró primero (CR-008): si un fallo inesperado saliera con `1`, el gate lo leería como
"memoria con problemas" y el `1` dejaría de ser una señal fiable. Un gate de CI se escribe con el motor directamente, sin pasar por el agente:
`node .claude/skills/memory-system/scripts/memory-system.js check --root docs --json`
(ejemplo completo en [sddf-commands-pipeline.md](../guides/sddf-commands-pipeline.md) §0). `check` y
`npm run verify:links` (`scripts/check-doc-links.js`) son complementarios: aquel valida enlaces
Markdown relativos, `check` valida wikilinks y frontmatter.

Sin `node` en PATH el skill aplica las cuatro reglas inline y añade
`⚠️ node no disponible — sin exit code; no usar en CI`: el informe sirve como diagnóstico, no como
gate.

### 10.5 Deprecación de `docs-wiki-builder`

`docs-wiki-builder` (STORY-044) queda como alias desde 3.3.0: emite
`⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.`, mapea `--update` → `index` y
`--dry-run` → `index --dry-run`, y no conserva lógica propia ni template. Se elimina en 4.0.0.
`header-aggregation` no se fusiona: `memory-system` lee su esquema (`slug`, `title`) con un parser
propio y el skill sigue siendo invocable de forma independiente.

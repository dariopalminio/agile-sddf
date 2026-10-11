---
alwaysApply: false
type: design
id: STORY-110
slug: STORY-110-discovery-escribe-stakeholders-y-requisitos-design
title: "Design: project-discovery y reverse-engineering escriben stakeholders y requisitos individuales"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-110
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
  - eliminar-specs-01-projects
  - stakeholders
  - requirements-index
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-109-project-begin-escribe-vision
  - STORY-118-requirements-srs-unico-primero
---

<!-- Referencias -->
[[STORY-110-discovery-escribe-stakeholders-y-requisitos]] · [[eliminar-specs-01-projects]] · [[stakeholders]] · [[requirements-index]] · [[STORY-105-migrar-stakeholders-y-requisitos]] · [[STORY-109-project-begin-escribe-vision]] · [[STORY-118-requirements-srs-unico-primero]]

# Diseño técnico: `project-discovery` y `reverse-engineering` escriben stakeholders y requisitos individuales

## Context

[[eliminar-specs-01-projects]] (ADR-0013) reparte `project.md` en `docs/product/stakeholders.md` (perfiles) y un archivo por
requisito en `docs/requirements/functional/` y `docs/requirements/non-functional/`. STORY-105 migra el contenido de este
repositorio; esta historia cambia los **escritores**: `/project-discovery`, `/reverse-engineering` y sus agentes.

Estado actual (medido el 2026-10-07):

| Pieza | Estado |
|---|---|
| `skills/project-discovery/SKILL.md` | Resuelve `PROJ_DIR` en `01-projects/` (Paso 0b), exige `project-intent.md` en `DONE`, lee `project-template.md` (central → seed `assets/`), delega en `project-pm` (que a su vez "invoca a `project-ux`") y en `project-architect`, que escribe `01-projects/$PROJ_DIR/project.md`. |
| `skills/reverse-engineering/SKILL.md` | Resuelve o **crea** `PROJ-01-<repo>` (Configuración 0b), lee `project-template.md` (central → seed de `project-discovery`), lanza 4 agentes de análisis (salida `.tmp/rfc-*.md`) y `reverse-engineer-synthesizer`, que escribe un único `project.md` con `## Gaps & Next Steps` al final. `--update` re-intenta las secciones con `<!-- PENDING MANUAL REVIEW -->`. |
| `agents/project-architect.agent.md` | Estados *Discovery* y *Planning* con rutas fijas a `01-projects/$PROJ_DIR/` y frontmatter con `id: [PROJ-NN…]`; sugiere "apoyarse en `project-ux`" (delegación agente → agente, prohibida por AGENTS.md). |
| `agents/project-ux.agent.md` | Contribuye a las secciones UX/UI de `project-template.md` y `01-projects/project.md`. |
| `agents/reverse-engineer-synthesizer.agent.md` | Escribe `$SPECS_BASE/specs/01-projects/project.md`; mapea la sección 3.3 (navegación) y 4.x (stack) del template. |
| `project-template.md` | Seed (`skills/project-discovery/assets/`) y central (`docs/templates/`), idénticos byte a byte. Secciones: §1.1–1.7 (visión), §1.8 (usuarios), §2.1 (FR), §2.2 (NFR), §3.1–3.4 (UI/UX), §4.1 (stack), §11 (referencias), §12 (glosario). |
| `docs/product/stakeholders.md` | Semilla de `memory-system`: `type: product`, `slug: stakeholders`, `substatus: TODO`, tres secciones (`Usuarios y roles`, `Patrocinadores y decisores`, `Intereses y conflictos`) con `[Por completar: …]`. |
| `docs/requirements/` | Solo `README.md`; documenta el esquema de archivo fragmentado (`type: requirement`, `kind`, `id`, `slug`, `title`, `status: active`, `created`, `updated`, `related`) y la estrategia "SRS único primero" (> 15 requisitos o > 500 líneas → fragmentar) que STORY-118 aún especifica. STORY-105 (diseñada) fija el contrato de archivo (D-2) y la regla de slug (D-3) para FR-001…FR-054 y NFR-001…NFR-024. |
| Evals | Ninguno de los dos skills tiene `evals/`; ambos están exentos en `config/eval-exemptions.json`. `scripts/verify-eval-inventory.js` rechaza un skill con `evals.json` que siga exento. |

Consumidores de `project-template.md` (`grep -rn project-template skills scripts test config docs/templates`):
`skills/memory-system/scripts/memory-system.js:125` (`SHARED_TEMPLATES`, owner `project-discovery`),
`test/memory-system.test.js:319` (`NINE_TEMPLATES`), `skills/memory-system/references/memory-rules.md:171`,
`skills/memory-system/assets/scaffold/templates/README.md:18`, `skills/memory-system/evals/evals.json` (TC-007, texto de
`description`), `skills/sddf-init/SKILL.md:110,199,257`, `skills/skill-preflight/SKILL.md:106`,
`skills/reverse-engineering/SKILL.md:73-81` y `skills/project-flow/SKILL.md:148,167` (STORY-113, ver CR-003).

Stack (constitución + `package.json`): Markdown para skills, agentes y templates; Node.js solo en `memory-system.js`, los
verificadores y los tests (`node --test`). `docs/templates/` está excluido del índice de `memory-system`. No hay
`skills.plan` en `sddf.config.yaml`: no aplican skills complementarios.

## Goals / Non-Goals

**Goals:**

- `/project-discovery` exige `product/vision.md` en `DONE` y, tras la confirmación del desarrollador, deja los perfiles en
  `stakeholders.md › Usuarios y roles` y un archivo por FR/NFR; nunca crea `project.md` ni `specs/01-projects/`. // satisface: AC-1
- Los IDs nuevos continúan la secuencia existente (FR-054 → FR-055) y ningún `FR-*`/`NFR-*` existente se reescribe sin
  confirmación explícita, en `/project-discovery` y en `/reverse-engineering --update`. // satisface: AC-2
- Sin visión terminada, `/project-discovery` se detiene antes de escribir en `product/` o `requirements/` y remite a
  `/project-begin`. // satisface: AC-3
- Los dos skills y los tres agentes afectados quedan sin `01-projects`, `project.md` como destino ni `PROJ-`; ambos skills
  tienen evals que pasan con `npm run test:eval`. // satisface: CNF-1
- La estructura de `stakeholders.md`, de un FR y de un NFR se deriva en runtime de templates de `docs/templates/` que
  reemplazan a `project-template.md`. // satisface: CNF-2
- Todo lo escrito queda en UTF-8 sin BOM. // satisface: CNF-3

**Non-Goals:**

- `project-planning` (STORY-111), `project-context-diagram --from-files` (STORY-112), `project-flow` (STORY-113) y la migración
  del `project.md` existente (STORY-105).
- La estrategia SRS único / umbral de fragmentación, el `requirements/index.md` y la resolución corta `[[FR-NNN]]` (STORY-118, CR-001).
- Rediseñar los cuatro agentes de análisis de `reverse-engineering` o mover sus intermedios `.tmp/rfc-*.md`.
- Cambiar el estado *Visión* de `project-pm` ni la semilla `stakeholders.md` de `memory-system`.

## Decisions

### D-1 — Precondición: `vision.md` en `DONE` antes de cualquier escritura // satisface: AC-3, AC-1

`project-discovery` elimina el Paso 0b (`PROJ_DIR`) y el Paso 1 (`project-intent.md`). Su nuevo Paso 1 lee el frontmatter de
`$VISION_PATH = $SPECS_BASE/product/vision.md`:

| Estado de `vision.md` | Acción |
|---|---|
| No existe | `❌ La visión del producto no está terminada ($VISION_PATH no existe). Ejecuta primero /project-begin.` → fin |
| `substatus` ≠ `DONE` (incluido ausente) | `❌ La visión del producto no está terminada ($VISION_PATH: substatus <valor>). Ejecuta primero /project-begin.` → fin |
| `substatus: DONE` | continúa |

Es el primer paso tras resolver la raíz: ningún archivo de `product/`, `requirements/` ni `.tmp/` se escribe antes. La señal
`DONE` es la que deja STORY-109 (gate) o STORY-104 (migración); no se depende de cuál la produjo.

`reverse-engineering` **no** adopta esta precondición: extrae requisitos de código sin visión previa (comportamiento actual).

**Alternativas rechazadas:**

- *Aceptar `IN-PROGRESS` con advertencia:* contradice AC-3 ("no tiene `substatus: DONE`" → se detiene).
- *Delegar la verificación al agente:* el agente ya habría arrancado una entrevista; la orquestación y sus gates viven en el
  skill (constitución, patrón orquestador).

### D-2 — Destino de cada sección del antiguo `project-template.md` // satisface: AC-1, CNF-2

Cierra la "Decisión abierta — secciones de `project.md` sin hogar" de la historia (CR-002). Regla: solo se escribe en las capas
que ADR-0013 asigna (`product/stakeholders.md`, `requirements/`); el resto se expresa como requisito o deja de producirse.

| Sección antigua | Destino | Escritor |
|---|---|---|
| §1.1–1.7 (nombre, problema, visión, beneficios, criterios de éxito, restricciones, non-goals) | **Entrada**, no salida: `product/vision.md` (dueño `project-begin`) | — |
| §1.8 Características de los usuarios | `stakeholders.md › Usuarios y roles` | ambos skills |
| §2.1 Requisitos funcionales | `requirements/functional/FR-NNN-<slug>.md` | ambos skills |
| §2.2 Requisitos no funcionales | `requirements/non-functional/NFR-NNN-<slug>.md` | ambos skills |
| §3.1 Design vibe · §3.2 Visual inspiration | NFR de categoría `Usabilidad y diseño visual`, con criterio de verificación | ambos (en discovery con aportes de `project-ux`) |
| §3.3 Mapa de navegación | FR de categoría `Navegación`: "Estructura de navegación", árbol ASCII en `## Descripción` | ambos (en RE desde `reverse-engineer-ux-flow-mapper`) |
| §3.4 Wireframes ASCII | No se producen (eran ejemplos del template; el detalle de pantalla pertenece al `design.md` de cada historia) | — |
| §4.1 Stack tecnológico | NFR de categoría `Tecnología` (la guía del template antiguo ya pedía "incluye el stack como NFR") | ambos |
| §11 Referencias | Atributo `Fuente` de cada requisito (en RE: ruta del código fuente y nivel `[DIRECT]`/`[INFERRED]`/`[SUGGESTED]`) | ambos |
| §12 Definiciones y acrónimos | No se produce (sin capa asignada; CR-004) | — |
| `## Gaps & Next Steps` (RE) | Informe de la Fase 3 + `.tmp/reverse-engineering/gaps.md` | `reverse-engineering` |

**Alternativas rechazadas:**

- *Nuevos documentos `product/ux.md` y `architecture/tech-stack.md`:* añade dos templates y dos escritores fuera de lo que
  ADR-0013 y CNF-2 piden; en este repo `architecture/tech-stack.md` es un documento curado a mano que un escritor automático
  podría pisar.
- *Seguir escribiendo un `project.md` reducido con las secciones sin hogar:* AC-1 prohíbe crear `project.md`.
- *Descartar también la navegación y el stack:* dejaría sin salida a `project-ux` y a `reverse-engineer-ux-flow-mapper`.

### D-3 — Disposición física: siempre fragmentada // satisface: AC-1, AC-2

Ambos skills escriben un archivo por requisito, como exige AC-1, sin aplicar el umbral "SRS único primero" del README (que es
alcance de STORY-118). Si existe algún `requirements/srs-*.md`, sus encabezados `### FR-NNN` / `### NFR-NNN` cuentan para el
cálculo de IDs (D-4) y se emite `⚠️ Existe <srs> y se escribirán requisitos fragmentados; revisa la disposición (STORY-118)`.
Conflicto registrado en CR-001.

**Alternativas rechazadas:**

- *Escribir en un `srs-<slug>.md` por debajo del umbral:* contradice AC-1 y depende de templates y reglas aún no implementadas.
- *Detenerse si existe un SRS:* bloquearía a proyectos que ya adoptaron el SRS sin que la historia lo pida.

### D-4 — Inventario de requisitos y asignación de IDs // satisface: AC-2

El **skill** (no el agente) calcula, antes de delegar, el inventario y los siguientes IDs:

1. `Glob` de `$SPECS_BASE/requirements/functional/FR-*.md` y `$SPECS_BASE/requirements/non-functional/NFR-*.md`; el ID es el
   prefijo `FR-NNN`/`NFR-NNN` del nombre; el título, el `title` del frontmatter.
2. Encabezados `### FR-NNN` / `### NFR-NNN` de `$SPECS_BASE/requirements/srs-*.md`, si existen (D-3).
3. `$NEXT_FR = max(n FR) + 1` y `$NEXT_NFR = max(n NFR) + 1`; sin ninguno → `001`. Relleno a tres dígitos (cuatro a partir de 1000).
   Los huecos (p. ej. FR-049) **no** se reutilizan: los IDs nunca se renumeran ni se reciclan (README de `requirements/`).
4. Mismo criterio para los perfiles: `$NEXT_US` sobre las líneas `- **US-NNN**:` de `stakeholders.md`.

`$REQUIREMENTS_INVENTORY` (lista `ID — título — ruta`) y los tres `$NEXT_*` se inyectan al agente, que numera los requisitos
nuevos en orden consecutivo desde ellos y usa el inventario para no duplicar requisitos ya existentes.

**Alternativas rechazadas:**

- *Que el agente calcule los IDs:* no determinista y acopla el agente a la disposición física de la capa.
- *Rellenar huecos:* un ID reciclado podría colisionar con referencias históricas (`implements:`) a un requisito retirado.

### D-5 — Propuesta en staging y materialización por el skill // satisface: AC-1, AC-2, CNF-3

Los agentes **no escriben en `$SPECS_BASE`**. Escriben una propuesta en `$STAGING_DIR = .tmp/<skill>/proposal/`
(canal `.tmp/<skill-name>/` de AGENTS.md):

```
.tmp/<skill>/proposal/
├── manifest.md
├── product/stakeholders.md                      (opcional)
└── requirements/{functional,non-functional}/<ID>-<slug>.md
```

El skill la materializa con un procedimiento único, documentado una sola vez en
`skills/project-discovery/references/layer-materialization.md` y leído por `reverse-engineering` vía
`$CLI_ROOT/skills/project-discovery/references/` (mismo acoplamiento que hoy tiene con el seed del template):

1. Valida cada fila del manifiesto: ruta bajo `product/stakeholders.md` o `requirements/{functional,non-functional}/`;
   nombre `<ID>-<slug>.md` con ID = `id` del frontmatter = ID del `#`; `kind` coherente con la carpeta. Fila inválida → se
   descarta y se informa (las demás siguen).
2. Clasifica: destino inexistente → `create`; destino existente (o `stakeholders.md` con `substatus: DONE`) → `modify`,
   **diga lo que diga el manifiesto**. Un `create` con ID < `$NEXT_*` que no exista en disco (hueco) se rechaza.
3. Gate global (solo `project-discovery`, D-6).
4. Cada `modify` exige confirmación individual: `AskUserQuestion` `Sobrescribir <ID>` / `Conservar`. Sin respuesta → `Conservar`.
5. Escribe los archivos aprobados en UTF-8 sin BOM, creando `functional/` y `non-functional/` si faltan; `stakeholders.md`
   conserva `type`, `slug`, `status`, `parent` y `created` del archivo existente y actualiza `updated`.
6. Informe: creados, sobrescritos, conservados, descartados (con motivo). El staging queda en `.tmp/` para inspección.

**Alternativas rechazadas:**

- *Escritura directa por los agentes con una lista de rutas protegidas:* la garantía de AC-2 dependería de que cada agente
  cumpla la regla; el skill no podría verificar ni presentar el resultado antes de escribir (AC-1 "confirma").
- *Un script Node de materialización:* añade código mantenido y una dependencia de `node` al flujo interactivo; el
  procedimiento es corto y los skills ya leen/escriben con las herramientas del runtime (P12).
- *Duplicar el procedimiento en los dos `SKILL.md`:* dos copias que derivan (DRY).

### D-6 — Flujo de `project-discovery` y fin de la delegación anidada // satisface: AC-1, AC-2, AC-3, CNF-1

La orquestación pasa a ser secuencial desde el skill (AGENTS.md: un subagente nunca delega en otro):

| Paso | Responsable | Entrada | Salida |
|---|---|---|---|
| 0 | skill | — | `SPECS_BASE` (sin cambios) |
| 1 | skill | `$VISION_PATH` | precondición D-1 |
| 2 | skill | templates | `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH` (D-8) |
| 3 | skill | `requirements/`, `stakeholders.md` | inventario y `$NEXT_*` (D-4); limpia `$STAGING_DIR` |
| 4 | `project-pm` (estado *Discovery*) | `$VISION_PATH`, `$STAKEHOLDERS_PATH` | `.tmp/project-discovery/discovery-summary.md` |
| 5 | `project-ux` | `$VISION_PATH`, resumen del paso 4 | `.tmp/project-discovery/ux-findings.md` |
| 6 | `project-architect` (estado *Discovery*) | todo lo anterior + templates + inventario | propuesta en `$STAGING_DIR` (D-5) |
| 7 | skill | `manifest.md` | resumen + `AskUserQuestion` `Confirmar` / `Cancelar` |
| 8 | skill | aprobación | materialización (D-5); `stakeholders.md` con `substatus: DONE` |

Paso 7: el resumen lista los perfiles propuestos y cada requisito `ID — título` marcado `nuevo` o `modifica`. `Cancelar` (o sin
respuesta) → nada se escribe en `$SPECS_BASE`. Mensaje final con `Confirmar`:
`✅ Discovery completo: <n> perfiles en $SPECS_BASE/product/stakeholders.md · <x> FR y <y> NFR en $SPECS_BASE/requirements/ · Siguiente comando: /project-planning`.

Retoma: no hay documento único que retomar; cada ejecución es incremental sobre el inventario (D-4). Si `stakeholders.md`
está en `IN-PROGRESS`, el agente completa solo las secciones con `[Por completar` y conserva el resto.

**Alternativas rechazadas:**

- *Mantener `project-pm` → `project-ux` y `project-architect` → `project-ux`:* viola el modelo de delegación del repositorio.
- *Fusionar los tres agentes en uno:* cambio estructural sin necesidad; cada agente conserva su especialidad (P11).
- *Gate `Dejar en revisión` que escriba con `IN-PROGRESS`:* los requisitos no tienen `substatus`; un archivo escrito ya sería
  referenciable por historias antes de su aprobación.

### D-7 — Flujo de `reverse-engineering` // satisface: AC-2, CNF-1

| Fase | Cambio |
|---|---|
| Configuración 0b | Se elimina (`PROJ_DIR` y su creación automática). |
| Fase 0.2 (template) | Resuelve los dos templates de D-8 (central → seed de `project-discovery`) y la referencia de materialización. |
| Fase 0.3 (modo) | Calcula inventario y `$NEXT_*` (D-4). **Normal** con inventario vacío → sin preguntas. **Normal** con inventario no vacío → `⚠️ Ya existen <n> requisitos; los nuevos se numerarán desde <FR-…>/<NFR-…>. Usa --update para un análisis incremental.` + `Continuar` / `Cancelar` antes de escribir (CR-005). **`--update`** → incremental. |
| Fase 0.4 (plan) | El destino mostrado es `$SPECS_BASE/product/stakeholders.md` + `$SPECS_BASE/requirements/`. |
| Fase 1 | Sin cambios funcionales; se les pasa la ruta del template de requisito en lugar de `project-template.md`. |
| Fase 2 | El sintetizador escribe la propuesta en `.tmp/reverse-engineering/proposal/` + `.tmp/reverse-engineering/gaps.md`. |
| Fase 3 | Materializa con D-5 **sin gate global** (pasos 1, 2, 4, 5, 6); `stakeholders.md` nuevo o en `TODO` queda en `substatus: IN-PROGRESS` (contenido inferido pendiente de revisión humana). Informe: creados, `modify` confirmados/conservados, requisitos con `<!-- PENDING MANUAL REVIEW -->` y resumen de `gaps.md`. |

Semántica de `--update`: el sintetizador recibe el inventario; propone como `create` solo requisitos no cubiertos por uno
existente (mismo comportamiento observable o misma `Fuente`), y como `modify` solo los existentes cuyo cuerpo contiene
`<!-- PENDING MANUAL REVIEW -->`. Toda `modify` pasa por la confirmación individual de D-5 paso 4 (AC-2 "Pero").

**Alternativas rechazadas:**

- *Gate global también en RE:* rompe el uso actual (generación automática revisada después) y los evals no interactivos.
- *`--update` sobre cualquier requisito existente:* reescribiría requisitos ya revisados por humanos.

### D-8 — Templates que reemplazan a `project-template.md` // satisface: CNF-2

| Template | Seed (dueño `project-discovery`) | Central |
|---|---|---|
| Stakeholders | `skills/project-discovery/assets/stakeholders-template.md` | `docs/templates/stakeholders-template.md` |
| Requisito (FR y NFR) | `skills/project-discovery/assets/requirement-template.md` | `docs/templates/requirement-template.md` |

Seed y central idénticos byte a byte (ADR-0001). `project-template.md` se elimina en sus dos copias (`git rm`). Resolución en
ambos skills: central → seed (`⚠️ Usando template seed del skill. Ejecuta sddf-init para centralizarlo en $SPECS_BASE/templates/.`)
→ ninguno: `❌ Template <nombre> no encontrado. Ejecuta sddf-init.` y fin sin escribir.

**`stakeholders-template.md`** — misma forma que la semilla de `memory-system` (para que un archivo sembrado y uno escrito por
discovery coincidan):

| Elemento | Contenido |
|---|---|
| Frontmatter | `type: product`, `slug: stakeholders`, `title: "Stakeholders"`, `status: IN-PROGRESS`, `substatus: TODO`, `parent: null`, `created`, `updated` |
| `# Stakeholders` | — |
| `## Usuarios y roles` | comentario guía + ítem modelo `- **US-NNN**: [Por completar: nombre del perfil]` / `    - **Descripción**: [Por completar: rol, contexto de uso y necesidades principales]` |
| `## Patrocinadores y decisores` | comentario guía + `[Por completar: quién aprueba, financia o prioriza]` |
| `## Intereses y conflictos` | comentario guía + `[Por completar: qué espera cada parte y dónde chocan esas expectativas]` |
| Pie | `Volver al mapa: [[index]].` |

Formato de perfil idéntico al que deja STORY-105 (D-5) en este repositorio.

**`requirement-template.md`** — un solo template para ambos `kind`, con el esquema del README de `requirements/` y la forma de
archivo de STORY-105 (D-2):

| Elemento | Contenido |
|---|---|
| Frontmatter | `type: requirement`, `kind: <functional \| non-functional>`, `id: <FR-NNN \| NFR-NNN>`, `slug: <ID>-<slug>`, `title: "<título>"`, `status: active`, `created`, `updated`, `related: []` |
| `# <ID> — <título>` | — |
| `## Descripción` | comentario guía ("qué debe hacer el sistema, no cómo; forma *El sistema debe…*") + marcador |
| `## Criterios de verificación` | comentario guía (lista `- [ ]` verificable; obligatorio en NFR, recomendado en FR) + marcador |
| `## Atributos` | `- **Prioridad**: [Alta \| Media \| Baja]` · `- **Usuario**: [US-NNN…]` (solo FR; el comentario indica omitirlo en NFR) · `- **Fuente**: […]` · `- **Categoría**: […]` |

Slug: regla de STORY-105 D-3 (NFD sin diacríticos → minúsculas → `[^a-z0-9]+` → `-` → recorte ≤ 50 caracteres en límite de
palabra). Registros actualizados (sustituir `project-template.md` por los dos nuevos): `memory-system.js` (`SHARED_TEMPLATES`,
owner `project-discovery`), `test/memory-system.test.js` (lista de templates esperados), `memory-rules.md`, `scaffold/templates/README.md`,
`memory-system/evals/evals.json` (texto de TC-007), `sddf-init/SKILL.md` (tabla y dos ejemplos), `skill-preflight/SKILL.md`
(verificación 3). `project-flow` queda fuera (CR-003).

**Alternativas rechazadas:**

- *Dos templates de requisito (`functional-…`, `non-functional-…`):* el 90 % es común; el README y STORY-118 ya nombran un
  único `requirement-template.md`.
- *Template de stakeholders con una sola sección `Usuarios y roles`:* divergiría de la semilla y de AC-1, que nombra la sección
  dentro del documento completo.
- *Conservar `project-template.md` como "template maestro" del que se extraen trozos:* mantiene viva la estructura que
  ADR-0013 elimina y contradice "reemplazan" (CNF-2).

### D-9 — Contratos de los agentes, independientes de rutas // satisface: CNF-1, AC-1, AC-2

Todos los agentes reciben rutas y valores ya resueltos (como hoy `$TEMPLATE_PATH`); ninguno nombra `01-projects`, `PROJ-` ni
`project.md` como destino.

| Agente | Estado / rol | Variables inyectadas | Salida |
|---|---|---|---|
| `project-architect` | *Discovery* | `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH`, `$UX_FINDINGS_PATH`, `$STAKEHOLDERS_PATH`, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US`, `$STAGING_DIR` | propuesta + `manifest.md` |
| `project-architect` | *Planning* | `$INPUT_PATHS` (documentos de contexto), `$TEMPLATE_PATH`, `$OUTPUT_PATH` | `$OUTPUT_PATH` (método sin cambios; `project-planning` ya pasa rutas explícitas y sigue funcionando hasta STORY-111) |
| `project-ux` | soporte de Discovery | `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH`, `$OUTPUT_PATH` | hallazgos UX: perfiles refinados, journeys, criterios de usabilidad medibles, navegación, dirección visual |
| `reverse-engineer-synthesizer` | síntesis | intermedios `.tmp/rfc-*.md`, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$STAKEHOLDERS_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_*`, `$UPDATE_MODE`, `$STAGING_DIR` | propuesta + `manifest.md` + `gaps.md` |

Reglas comunes de la propuesta: secciones y orden del template, sin comentarios `<!-- -->` ni `# escritor:`; contenido inferido
marcado (`[inferido]` en discovery; `[DIRECT]`/`[INFERRED]`/`[SUGGESTED]` en RE); requisito sin datos suficientes →
`<!-- PENDING MANUAL REVIEW -->` como primera línea de `## Descripción` (solo RE); UTF-8 sin BOM; el mapeo D-2 sustituye a
las tablas por sección del template antiguo (p. ej. la fila "Mapa de navegación (sección 3.3)" del sintetizador). Se elimina de
`project-architect` la frase "puedes apoyarte en `project-ux`". Las descripciones del frontmatter de los agentes dejan de citar
`project.md`/`project-template.md`.

**Alternativas rechazadas:**

- *Dejar intacto el estado Planning de `project-architect`:* CNF-1 busca `01-projects` y `PROJ-` en todo el archivo.
- *Rutas fijas `docs/product/…` en los agentes:* ignoraría `SDDF_ROOT` y acoplaría los agentes a la raíz.

### D-10 — Evals de ambos skills // satisface: CNF-1, AC-1, AC-2, AC-3

Se crean `skills/project-discovery/evals/evals.json` y `skills/reverse-engineering/evals/evals.json` (formato
`skill`/`version`/`description`/`cases`, IDs `TC-NNN`, `expected.contains`/`not_contains`, `threshold`) y se retiran sus dos
entradas de `config/eval-exemptions.json`. Los casos describen el entorno en `input.context` (el runner ejecuta `claude -p`
en solo lectura; la entrevista cae en inferencia y el gate queda sin respuesta, por lo que se verifican decisiones de flujo).

| Skill | Caso | Escenario | Aserciones clave |
|---|---|---|---|
| discovery | TC-001 | `vision.md` DONE, requisitos vacíos | contiene `stakeholders.md`, `Usuarios y roles`, `functional/FR-001`, `non-functional/NFR-001`, `Confirmar`; no contiene `01-projects`, `PROJ-`, `project.md` |
| discovery | TC-002 | existen FR-001…FR-054 (sin FR-049) | contiene `FR-055`; no contiene `FR-049-`, `Sobrescribir FR-054` sin pregunta previa |
| discovery | TC-003 | `vision.md` en `IN-PROGRESS` | contiene `/project-begin`, `❌`; no contiene `stakeholders.md` como escrito, `FR-0` |
| discovery | TC-004 | `vision.md` inexistente | contiene `/project-begin`; no contiene `01-projects` |
| discovery | TC-005 | sin templates centrales | contiene `⚠️` y `requirement-template.md` (seed) |
| discovery | TC-006 | sin template central ni seed | contiene `❌ Template` ; no anuncia escrituras |
| RE | TC-001 | repo sin requisitos, modo normal | contiene `product/stakeholders.md`, `requirements/functional/FR-001`; no contiene `01-projects`, `PROJ-`, `project.md` |
| RE | TC-002 | `--update`, existen hasta FR-054 | contiene `FR-055`; toda reescritura de existente aparece como confirmación |
| RE | TC-003 | modo normal con requisitos existentes | contiene `--update`, `Continuar` |
| RE | TC-004 | sin template central ni seed | contiene `❌ Template`; no anuncia escrituras |

**Alternativas rechazadas:** mantener las exenciones (CNF-1 exige evals que pasen) y fixtures de repositorio completos para RE
(el corpus determinista que motivó la exención; los casos de flujo bastan para los criterios de esta historia).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `project-discovery` | modificar (flujo D-1, D-4…D-6, D-8) | `skills/project-discovery/SKILL.md` | AC-1, AC-2, AC-3, CNF-1 |
| README `project-discovery` | modificar (`Produces`, entradas) | `skills/project-discovery/README.md` | CNF-1 |
| Procedimiento de materialización | crear | `skills/project-discovery/references/layer-materialization.md` | AC-1, AC-2, CNF-3 |
| Template de stakeholders (seed + central) | crear | `skills/project-discovery/assets/stakeholders-template.md`, `docs/templates/stakeholders-template.md` | CNF-2 |
| Template de requisito (seed + central) | crear | `skills/project-discovery/assets/requirement-template.md`, `docs/templates/requirement-template.md` | CNF-2 |
| `project-template.md` (seed + central) | eliminar | `skills/project-discovery/assets/`, `docs/templates/` | CNF-2 |
| Skill `reverse-engineering` | modificar (D-7) | `skills/reverse-engineering/SKILL.md` | AC-2, CNF-1 |
| README `reverse-engineering` | modificar | `skills/reverse-engineering/README.md` | CNF-1 |
| Agente `project-architect` | modificar (D-9) | `agents/project-architect.agent.md` | AC-1, AC-2, CNF-1, CNF-3 |
| Agente `project-ux` | modificar (D-9) | `agents/project-ux.agent.md` | AC-1, CNF-1 |
| Agente `reverse-engineer-synthesizer` | modificar (D-9) | `agents/reverse-engineer-synthesizer.agent.md` | AC-2, CNF-1, CNF-3 |
| Evals | crear | `skills/project-discovery/evals/evals.json`, `skills/reverse-engineering/evals/evals.json` | CNF-1 |
| Exenciones de evals | modificar (quitar 2 entradas) | `config/eval-exemptions.json` | CNF-1 |
| Registros del template compartido | modificar | los 7 archivos de D-8 | CNF-2 |
| CHANGELOG | modificar (`[Unreleased]`, breaking) | `CHANGELOG.md` | — (trazabilidad de release) |

Se reutilizan (P3): la regla de slug y la forma de archivo de STORY-105, el patrón de resolución central → seed, el canal
`.tmp/<skill-name>/`, el Protocolo de Resiliencia de `project-pm` y el gate `AskUserQuestion` del patrón de STORY-109.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Precondición de discovery | `$SPECS_BASE/product/vision.md` con `substatus: DONE`; si no → `❌ … Ejecuta primero /project-begin.` sin escrituras | AC-3 |
| Inventario (skill → agente) | `$REQUIREMENTS_INVENTORY` = líneas `ID — título — ruta`; `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US` = siguiente ID libre por encima del máximo | AC-2 |
| Propuesta (agente → skill) | `$STAGING_DIR/manifest.md` + archivos con la estructura de los templates | AC-1, AC-2 |
| Materialización | `layer-materialization.md`: valida → clasifica `create`/`modify` → (gate) → confirma cada `modify` → escribe UTF-8 sin BOM → informa | AC-1, AC-2, CNF-3 |
| Gate de discovery | `AskUserQuestion` `Confirmar` (materializa; `stakeholders.md` → `DONE`) · `Cancelar` (sin escritura) | AC-1 |
| Confirmación de reescritura | `AskUserQuestion` por archivo: `Sobrescribir <ID>` · `Conservar` (por defecto) | AC-2 |
| Templates | `stakeholders-template.md`, `requirement-template.md`; dueño `project-discovery`; central → seed | CNF-2 |

## Esquema de datos

`manifest.md` (tabla, una fila por archivo propuesto):

| Columna | Valores |
|---|---|
| `archivo` | ruta relativa a `$STAGING_DIR` |
| `destino` | ruta relativa a `$SPECS_BASE` (`product/stakeholders.md` o `requirements/<kind>/<ID>-<slug>.md`) |
| `operación` | `create` \| `modify` (orientativo; el skill reclasifica, D-5 paso 2) |
| `id` | `FR-NNN` \| `NFR-NNN` \| `—` (stakeholders) |
| `título` | `title` del requisito o `Stakeholders` |
| `notas` | p. ej. `PENDING MANUAL REVIEW`, confianza dominante |

Ejemplo de requisito propuesto (frontmatter y esqueleto):

```
---
type: requirement
kind: functional
id: FR-055
slug: FR-055-estructura-de-navegacion
title: "Estructura de navegación"
status: active
created: <hoy>
updated: <hoy>
related: []
---
# FR-055 — Estructura de navegación
## Descripción
## Criterios de verificación
## Atributos
```

## Flujos clave

### F-1 — Discovery sobre requisitos vacíos (AC-1)

1. Raíz → `vision.md` en `DONE` → templates → inventario vacío (`$NEXT_FR = FR-001`, `$NEXT_NFR = NFR-001`, `$NEXT_US = US-001`).
2. `project-pm` → resumen; `project-ux` → hallazgos; `project-architect` → propuesta en `.tmp/project-discovery/proposal/`.
3. El skill muestra el resumen; `Confirmar` → crea `stakeholders.md` (o completa la semilla) con `substatus: DONE` y los
   archivos FR/NFR. Ningún paso referencia `specs/`.

### F-2 — Requisitos existentes (AC-2)

1. Inventario con FR-001…FR-054 → `$NEXT_FR = FR-055`.
2. La propuesta numera desde FR-055; si el agente propone cambiar FR-012, el skill lo clasifica `modify` y pregunta
   `Sobrescribir FR-012` / `Conservar`. Sin respuesta → se conserva.
3. `reverse-engineering --update`: igual, con `modify` restringido a requisitos con `<!-- PENDING MANUAL REVIEW -->`.

### F-3 — Visión no terminada (AC-3)

`vision.md` ausente o `substatus` ≠ `DONE` → mensaje `❌` con `/project-begin` y fin. No se ejecuta ningún agente ni se crea
`.tmp/project-discovery/`.

### F-4 — Degradación (P7)

- Template central ausente → seed con `⚠️`; ambos ausentes → `❌` y fin sin escritura.
- Un agente falla o no deja `manifest.md` → el skill informa y sugiere re-ejecutar; `$SPECS_BASE` intacto (nada se escribe
  antes de la materialización).
- Intermedio de RE ausente → advertencia y síntesis con lo disponible (sin cambios); requisito sin datos →
  `PENDING MANUAL REVIEW`.
- Fila de manifiesto inválida → se descarta con motivo; el resto se materializa.
- Sin respuesta del usuario → gate de discovery no confirmado (no escribe); confirmaciones individuales → `Conservar`.

## Decisiones de complejidad justificada

- **Staging + materialización en el skill (D-5).** Escribir directamente sería más corto, pero la garantía de AC-2 ("ninguno se
  sobrescribe sin confirmación") y el "confirma el resultado" de AC-1 solo son verificables si un único punto controla las
  escrituras. El procedimiento vive en un solo archivo de referencia.
- **Tres agentes secuenciales en discovery (D-6).** Añade un paso de orquestación, pero elimina la delegación agente → agente
  que el modelo de delegación del repositorio prohíbe.
- **Un solo template de requisito con atributo condicional (D-8).** Una instrucción en comentario evita mantener dos templates
  casi idénticos.
- **Tocar el estado Planning de `project-architect` (D-9).** Lo exige CNF-1; se limita a parametrizar rutas.
- **Siete registros fuera de los skills (D-8).** Consecuencia directa de reemplazar un template compartido (ADR-0001); dejarlos
  rompe `npm test` y `memory-system scaffold`.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin modelo de proyectos | `grep -rnE "01-projects\|PROJ-" skills/project-discovery skills/reverse-engineering agents/project-architect.agent.md agents/project-ux.agent.md agents/reverse-engineer-synthesizer.agent.md` → vacío; `grep -rn "project\.md"` en los mismos → ninguna aparición como ruta de salida | CNF-1, AC-1 |
| 2 | Evals pasan | `npm run test:eval -- project-discovery` y `npm run test:eval -- reverse-engineering` → exit 0 | CNF-1 |
| 3 | Inventario de evals coherente | `npm run verify:eval-inventory` → `[OK]`; ninguna de las dos entradas en `config/eval-exemptions.json` | CNF-1 |
| 4 | Precondición antes de escribir | `project-discovery/SKILL.md`: el paso de `vision.md` precede a toda delegación y escritura; mensaje con `/project-begin` | AC-3 |
| 5 | Regla de IDs | `SKILL.md` de ambos skills (o la referencia) define max + 1 por tipo, sin reutilizar huecos, contando `srs-*.md` | AC-2 |
| 6 | Confirmación de reescritura | `layer-materialization.md` reclasifica destino existente como `modify` y exige `Sobrescribir`/`Conservar` con `Conservar` por defecto | AC-2 |
| 7 | Gate de discovery | `Confirmar` es la única vía a la materialización; `stakeholders.md` → `substatus: DONE` | AC-1 |
| 8 | Templates | existen seed y central de `stakeholders-template.md` y `requirement-template.md` con `diff` vacío; no existe `project-template.md` en `skills/` ni `docs/templates/` | CNF-2 |
| 9 | Estructura de templates | encabezados de `stakeholders-template.md` = los 3 `##` de la semilla; `requirement-template.md` = `#`, `## Descripción`, `## Criterios de verificación`, `## Atributos`; frontmatter según D-8 | CNF-2 |
| 10 | Registros | `grep -rn "project-template" skills test docs/templates` → solo `skills/project-flow/SKILL.md` (CR-003); `npm test` → exit 0 | CNF-2 |
| 11 | Sin delegación anidada | `grep -n "project-ux" agents/project-architect.agent.md` sin instrucciones de invocación; `project-discovery` no pide a `project-pm` invocar agentes | CNF-1 |
| 12 | Encoding | los agentes y la referencia declaran UTF-8 sin BOM; ningún archivo tocado empieza por `EF BB BF` ni contiene `Ã`/`ðŸ` | CNF-3 |
| 13 | Enlaces | `npm run verify:links` → `[OK]` | — |

## Risks / Trade-offs

- [`project-flow` (etapa Discovery) busca `project-template.md` y ordena escribir `01-projects/project.md`] → Aceptado hasta
  STORY-113 (CR-003); las historias se integran en la rama de la épica y no se publica en medio.
- [`project-planning` sigue exigiendo `project.md`] → Un `/project-discovery` nuevo ya no lo produce; STORY-111 lo resuelve. En
  este repositorio `project.md` persiste hasta STORY-105.
- [STORY-109 edita los mismos registros de templates (`vision-template.md`)] → Cambios en líneas distintas; conflicto de merge
  trivial. Orden recomendado: STORY-109 antes (deja el estado *Discovery* de `project-pm` parametrizado con `$OUTPUT_PATH`).
- [Atributo `Categoría` en requisitos nuevos vs `Categoría de origen` en los migrados por STORY-105] → Ambos son ítems de
  `## Atributos` y nada los consume programáticamente; se acepta la diferencia de etiqueta.
- [RE en modo normal con requisitos existentes puede proponer duplicados semánticos] → Aviso + `Continuar`/`Cancelar` y
  recomendación de `--update` (D-7).
- [`gaps.md` vive en `.tmp/` y no se versiona] → Las preguntas de revisión son transitorias; las secciones sin datos quedan
  marcadas `PENDING MANUAL REVIEW` dentro de cada requisito versionado.
- [Evals de skills interactivos en modo no interactivo] → Verifican decisiones de flujo (rutas, IDs, mensajes), no la calidad
  de la entrevista.

## Open Questions

Ninguna. La decisión abierta de la historia se cierra en D-2; las dependencias y ambigüedades quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 exige un archivo por requisito siempre, mientras `docs/requirements/README.md` y STORY-118 (SPECIFY)
  establecen "SRS único primero" por debajo de 15 requisitos / 500 líneas. Ambas historias son de EPIC-21.
- **Documento afectado**: story.md (STORY-110 y STORY-118)
- **Acción requerida**: el diseño cumple AC-1 (D-3) y cuenta los IDs de un `srs-*.md` si existe. Recomendado: que STORY-118
  incluya en su alcance que los escritores (`project-discovery`, `reverse-engineering`) respeten la disposición vigente, o que
  se precise en STORY-110 que la disposición fragmentada es la única hasta STORY-118.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la nota "Decisión abierta — secciones de `project.md` sin hogar" pedía cerrarla antes de PLAN y remite a una
  historia "Reubicar las secciones restantes de `project.md`" que no figura en EPIC-21.
- **Documento afectado**: story.md
- **Acción requerida**: decisión cerrada en D-2 (UX → NFR/FR, stack → NFR, referencias → `Fuente`, wireframes y glosario no se
  producen). Actualizar la nota de la historia para apuntar a D-2.

### CR-003
- **Tipo**: dependencia
- **Descripción**: `skills/project-flow/SKILL.md:148,167` resuelve `project-template.md` e instruye a `project-pm`/`project-architect`
  con rutas de `01-projects/`. Tras eliminar el template, su etapa Discovery se detiene con "template no encontrado".
- **Documento afectado**: story.md (STORY-113)
- **Acción requerida**: STORY-113 debe delegar la etapa Discovery en `/project-discovery` (o adoptar los templates y el
  contrato de D-5/D-9).

### CR-004
- **Tipo**: dependencia
- **Descripción**: el sintetizador de RE infería problema, visión y glosario (§1.1–1.7, §12). Con D-2 esa inferencia deja de
  tener salida: `vision.md` es de `project-begin` y no hay capa asignada al glosario.
- **Documento afectado**: design.md / épica EPIC-21
- **Acción requerida**: decidido no producirlos en esta historia. Recomendado: historia aparte para que RE proponga un borrador
  de `vision.md` (solo si está en `TODO`) y para fijar el hogar del glosario (candidato: `domains/`, lenguaje ubicuo).

### CR-005
- **Tipo**: ambigüedad
- **Descripción**: el Non-Goal "`reverse-engineering` sin `--update` … conserva el comportamiento actual de confirmación antes
  de escribir" describe una confirmación que el modo normal actual no tiene (solo `--update` sobre un documento `DONE` pregunta).
- **Documento afectado**: story.md
- **Acción requerida**: el diseño lo interpreta como una confirmación `Continuar`/`Cancelar` cuando ya existen requisitos (D-7),
  sin reescribir ninguno. Precisar el Non-Goal en la historia.

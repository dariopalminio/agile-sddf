---
type: design
id: STORY-103
slug: STORY-103-replace-the-epic-template-design
title: "Design: Reemplazar el template de Epic por la versión minimalista y output-oriented"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-103
created: 2026-10-06
updated: 2026-10-06
related:
  - STORY-103-replace-the-epic-template
  - domain-epic-lifecycle
  - memory-system
  - STORY-101-dod-story-por-etapa
---

<!-- Referencias -->
[[STORY-103-replace-the-epic-template]] · [[domain-epic-lifecycle]] · [[memory-system]] · [[STORY-101-dod-story-por-etapa]]

# Diseño técnico: template de Epic minimalista y output-oriented (v2)

## Context

El template vigente de épica existe en dos copias **byte a byte idénticas** (verificado con `diff`):
el central `docs/templates/epic-template.md` y el seed `skills/epic-creation/assets/epic-template.md`
(dueño: `epic-creation`; `sddf-init` y `memory-system scaffold` copian seed → central, ver
`SHARED_TEMPLATES` en `skills/memory-system/scripts/memory-system.js`). Tiene ~60 líneas, tres
secciones marcadas `<!-- sección obligatoria -->` (`Descripción`, `Historias`,
`Flujos Críticos / Smoke Tests`) y seis opcionales (`Requerimiento`, `Impacto en Procesos Claves`,
`Dependencias Críticas`, `Riesgos`, `**Criterios de éxito:**` como párrafo en negrita, `Notas adicionales`).

Estado real del contrato en el repo (inspección del Paso 3):

| Consumidor | Cómo usa la estructura hoy |
|---|---|
| `epic-format-validation` | Deriva en runtime las secciones obligatorias (marcador `<!-- sección obligatoria`) y las claves de frontmatter (todas menos la allowlist `alwaysApply`, `parent`, `related`). Solo valida **presencia**. |
| `epic-creation` | Deriva secciones obligatorias/opcionales del template; trae una "guía de preguntas" por sección del template v1; no tiene `## DoD aplicable`. |
| `epic-from-project-plan` | Rellena el template; trae un ejemplo embebido con las secciones v1; no invoca la validación. |
| `epic-generate-stories` | Parser de `## Historias` con 5 formatos heredados; backfill `- [ ] **Nombre:** desc` → `- [ ] STORY-NNN - **Nombre:** desc`. |
| `epic-generate-all-stories` | Solo extrae líneas que **ya** tienen ID (`- [ ] STORY-NNN — Nombre: desc`); no asigna IDs. |
| `story-implement` (11d) / `story-implement-tasks` (4c) | Buscan en **todo** `epic.md` una línea con el ID y cambian `- [ ]` → `- [x]`. |
| `memory-system` | Motor Node (`scripts/memory-system.js`) con `migrate --from dod-monolithic` delegado al módulo de dominio `scripts/dod-story.js` — patrón reutilizable para una nueva migración. |

Las 22 épicas de `docs/specs/02-epics/` son heterogéneas: 12 solo tienen `Descripción` + `Historias`;
EPIC-00 no tiene ningún `##`; EPIC-17 añade `## Objetivo`; EPIC-12/14/19 tienen `## Requerimiento: <x>`;
los smoke tests usan `### Escenario N:` + `**DADO**/**CUANDO**/**ENTONCES**` salvo EPIC-14 (lista
anidada); `**Criterios de éxito:**` aparece como párrafo en negrita; las líneas de historia mezclan
`STORY-NNN - **Nombre:**`, `**STORY-NNN — Nombre:**` y `**Nombre**: desc` sin ID.

No hay `constitution.md` en `docs/policies/` (la constitución vive en `docs/constitution.md`, importada
por `AGENTS.md`); no hay `skills.plan` en `sddf.config.yaml` (sin skills complementarios de fase plan).
Stack: Markdown + Node.js (`node --test test`), sin dependencias nuevas.

Criterios de aceptación (referencia de trazabilidad):

| AC | Resumen |
|---|---|
| AC-1 | Template con exactamente 5 secciones `##` (Alcance, Historias, Criterios de salida, Smoke tests, Notas) y sin las 8 eliminadas |
| AC-2 | `Alcance` primera sección, guía output-oriented (valor de negocio en `product/vision.md` o `requirements/`) |
| AC-3 | `Historias` documenta 3 formatos (planificada sin ID / creada / completada); ejemplo por defecto sin ID |
| AC-4 | `Criterios de salida`: criterios técnicos verificables, no de negocio |
| AC-5 | Smoke tests `### SMOKE-N — nombre` + bloque `gherkin`; regla de no-renumerar; numeración opcional con uno solo |
| AC-6 | `Notas` al final, contenido opcional y evolutivo |
| AC-7 | Frontmatter mínimo; sin `implements`, `deliveryModel`, `children`; `status: DEFINE` |
| AC-8 | `epic-creation` y `epic-from-project-plan` usan el template nuevo; `## DoD aplicable` en `epic-creation`; épicas generadas pasan la validación |
| AC-9 | `epic-generate-stories` / `-all-stories` transforman F1 → F2; `story-implement` marca F3 en la épica padre |
| AC-10 | Migración de épicas existentes, sin pérdida semántica e idempotente |
| AC-11 | `epic-format-validation` verifica 5 secciones, formatos de `Historias` y patrón `SMOKE-N`, con mensajes accionables |
| CNF-1…5 | ≤ 40 líneas · docs · CHANGELOG · v1 retirado en 4.0.0 con migración automática · guion ASCII en slugs/IDs |

## Goals / Non-Goals

**Goals:**
- Un único contrato estructural v2 de `epic.md`, definido una vez (template + sección de dominio) y
  aplicado por productor (`epic-creation`, `epic-from-project-plan`), editores (`epic-generate-*`,
  `story-implement*`), gate (`epic-format-validation`) y migrador (`memory-system`).
- Migración automática, idempotente y sin pérdida de las 22 épicas del repo y de repos consumidores.

**Non-Goals:**
- No se modifica `story-template.md`, los templates de proyecto ni la máquina de estados de Epic.
- No se crea un guardrail DoD de Epic (CR-002).
- No se cambian las rutas `specs/02-epics/` → `specs/epics/` (STORY-108 de esta misma épica); el diseño
  solo evita **añadir** nuevas rutas hardcodeadas (D-7).
- No se regeneran las copias instaladas (`.claude/skills/`, `.agents/skills/`): son salida de
  `agile-sddf install`, no fuente (AGENTS.md).

## Decisions

### D-1 — Contrato v2 del template (`epic-template.md`) // satisface: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, CNF-1

Estructura exacta del archivo (central y seed idénticos). Todo campo declara su escritor
(`constitution.md` principio 13, CR-012): `# escritor:` en línea en cada clave del frontmatter y
`· escritor:` dentro del marcador de cada sección del cuerpo. Ninguna anotación suma líneas:

````markdown
---
type: epic                # escritor: epic-creation · epic-from-project-plan (valor fijo)
id: <EPIC-NN>             # escritor: epic-creation · epic-from-project-plan
slug: <nombre-del-directorio-de-la-epica>   # escritor: epic-creation · epic-from-project-plan
title: "<título de la épica>"   # escritor: epic-creation · epic-from-project-plan
status: DEFINE            # escritor: epic-creation · epic-from-project-plan (inicial)
substatus: IN-PROGRESS    # escritor: epic-creation (TODO por WIP=1) · epic-from-project-plan (inicial)
parent: null              # escritor: epic-creation (valor del template) · epic-from-project-plan (PROJ-NN o null)
created: <YYYY-MM-DD>     # escritor: epic-creation · epic-from-project-plan
updated: <YYYY-MM-DD>     # escritor: todo skill que edite el archivo
related: []               # escritor: epic-creation · epic-from-project-plan
---

# Épica: [Nombre]

## Alcance <!-- sección obligatoria · clave: alcance · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Output-oriented: qué se construye (2-4 líneas). El valor de negocio vive en product/vision.md o requirements/. -->

## Historias <!-- sección obligatoria · clave: historias · escritor: epic-creation (F1) · epic-from-project-plan (F1/F2/F3) · epic-generate-stories · epic-generate-all-stories (F1 → F2) · story-implement · story-implement-tasks (F2 → F3) · memory-system (migrate --from=epic-template-v1) -->
<!-- Planificada: `- [Nombre]: [desc]` · Creada: `- [ ] **STORY-NNN** — [Nombre]: [desc]` · Completada: `- [x] **STORY-NNN** — [Nombre]: [desc]`.
     epic-generate-stories asigna el ID (planificada → creada); story-implement marca [x] (creada → completada). -->
- [Nombre feature 1]: [descripción breve]
- [Nombre feature 2]: [descripción breve]

## Criterios de salida <!-- sección obligatoria · clave: criterios-salida · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Criterios técnicos verificables de "épica terminada". No son criterios de éxito de negocio. -->
- [ ] [Criterio técnico verificable]

## Smoke tests <!-- sección obligatoria · clave: smoke-tests · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Si uno falla: detener el despliegue o rollback. IDs SMOKE-N estables: no renumerar al insertar o eliminar. Con un único escenario la numeración es opcional. -->
### SMOKE-1 — [Nombre descriptivo]
```gherkin
Escenario: [Nombre descriptivo]
  Dado [contexto inicial]
  Cuando [acción]
  Entonces [resultado esperado]
```

## Notas <!-- sección obligatoria · contenido opcional · clave: notas · escritor: epic-creation · epic-from-project-plan · memory-system (migrate --from=epic-template-v1) -->
<!-- Opcional: decisiones emergentes, cambios de alcance y acuerdos, a medida que aparezcan. -->
````

Presupuesto: 39–40 líneas (CNF-1). Reglas que fija este contrato:

- **Marcadores:** las 5 secciones llevan `<!-- sección obligatoria` (el gate y `epic-creation` siguen
  derivándolas en runtime; ninguna lleva `<!-- sección opcional`). `Notas` es obligatoria como
  **encabezado** y opcional en **contenido** (CR-004).
- **Claves de sección (`clave:`):** cada marcador declara una clave estable (`alcance`, `historias`,
  `criterios-salida`, `smoke-tests`, `notas`). Los skills localizan las secciones **por clave** y leen
  su título del template en runtime; el título visible es libre (D-2b, CR-011). Las claves van en la
  misma línea del marcador: no suman líneas (CNF-1).
- **Escritores (`escritor:`):** cada clave del frontmatter y cada marcador de sección nombran los skills
  que los escriben (principio 13, CR-012). En el marcador, `escritor:` va **después** de `clave:`; los
  lectores del contrato solo extraen `sección obligatoria` y `clave:`, así que la anotación no altera el
  contrato (D-2b). Como todo el marcador, no se copia a las épicas generadas (R11 lo elimina al migrar).
- **Frontmatter:** se eliminan `alwaysApply` (no lo exige nadie para épicas), `deliveryModel` y
  `children` (AC-7). Se conserva `related: []`: no está en la lista de AC-7 pero es nullable, está en la
  allowlist del gate y es el canal de wikilinks del grafo (`memory-system index`) — alineado con
  `story-template.md` (CR-008). Se elimina la línea `[[<slug de project relacionado>]]` del cuerpo:
  con `parent: null` por defecto no hay project que enlazar (EPIC-21 elimina `01-projects/`).
- **Separadores:** `—` (U+2014) entre `**STORY-NNN**` y el nombre; `-` ASCII (U+002D) dentro de
  IDs y slugs (CNF-5).

**Alternativas rechazadas:**
- *Adoptar tal cual el borrador `epic-template.md` adjunto en el directorio de la historia* — contradice
  AC-7 (`alwaysApply`, `deliveryModel`, `children`), AC-3 (pone checkbox al formato planificado) y AC-6
  (no tiene `Notas`); además carece de marcadores, con lo que el gate derivaría 0 secciones (CR-006).
- *`Notas` marcada `<!-- sección opcional -->`* — rompe AC-11 ("cinco secciones obligatorias") y
  `epic-creation` la omitiría del archivo cuando el autor la salta, contradiciendo AC-1.

### D-2 — Formatos de línea de la sección `historias` como contrato de dominio // satisface: AC-3, AC-9, AC-11

Tres formatos, definidos **una vez** en `docs/domains/domain-epic-lifecycle.md` (nueva subsección
"Estructura de `epic.md`", D-9) y referenciados por los skills; el template los repite en su comentario
guía para el autor humano:

| ID | Estado | Forma (línea de nivel superior de la sección) |
|---|---|---|
| F1 | planificada, sin ID | `- <Nombre>: <descripción>` — sin checkbox, sin `STORY-NNN` |
| F2 | creada, con ID | `- [ ] **STORY-NNN** — <Nombre>: <descripción>` |
| F3 | completada | `- [x] **STORY-NNN** — <Nombre>: <descripción>` |

Transiciones permitidas: F1 → F2 (`epic-generate-stories`, `epic-generate-all-stories`),
F2 → F3 (`story-implement` 11d, `story-implement-tasks` 4c). Las líneas indentadas (sub-ítems) no son
historias: se conservan y no se validan. El placeholder `- [Por completar]` es un F1 válido.

**Alternativas rechazadas:**
- *Checkbox también en F1 (`- [ ] Nombre: desc`)* — es lo que hace el borrador, pero AC-3 lo define sin
  checkbox y, con checkbox, F1 y una línea mal formada de F2 son indistinguibles para el gate.
- *Que cada skill describa sus propios formatos* — es la causa de la deriva actual (5 formatos en
  `epic-generate-stories`, 2 en `-all-stories`, 1 en `epic-from-project-plan`).

### D-2b — Contrato del template por claves: qué edita el usuario y qué es fijo // satisface: AC-1, AC-8, AC-9, AC-11

Principio: `docs/constitution.md:159` — los skills no hardcodean la estructura; la leen del template en
runtime. Decisión del PO (CR-011): **estructura libre, formato de línea fijo**.

| El usuario puede cambiar en el template | Es contrato fijo (dominio) |
|---|---|
| Títulos de las secciones, su orden, añadir o quitar secciones, comentarios guía, obligatoriedad, claves de frontmatter | El atributo `clave:` de cada sección que quiera conservar · el formato de línea F1/F2/F3 de la sección `historias` · el patrón `SMOKE-N` + `gherkin` de la sección `smoke-tests` |

- **Vocabulario de claves** (definido una vez en `domain-epic-lifecycle` §9, D-9): `alcance`, `historias`,
  `criterios-salida`, `smoke-tests`, `notas`. Solo `historias` y `smoke-tests` tienen **regla de
  máquina**; el resto solo identifica la sección (lo usan el mapeo de `epic-from-project-plan` y el
  migrador). Una clave desconocida se acepta y no tiene regla.
- **Lectura del contrato** (procedimiento único, descrito en el dominio y referenciado por los skills):
  para cada línea `##` del template, extraer título (sin el comentario), obligatoriedad y `clave:`.
  Resultado: lista ordenada `{ título, clave, obligatoria }`. En JS lo implementa
  `readTemplateContract(text)` de `epic-template.js` (D-7), reutilizado por los tests.
- **Template válido:** claves únicas (duplicada → error accionable en el skill que lo lea). Una clave
  con regla que no aparece en el template desactiva esa regla (p. ej. sin `smoke-tests` el gate no
  exige `SMOKE-N`). La resolución del template es la de siempre: central → seed.
- **Limitación aceptada:** renombrar un título en el template no renombra las épicas existentes; el gate
  lo informa como sección faltante y el autor la renombra. No se crea un modo de sincronización (YAGNI).

**Alternativas rechazadas:**
- *Localizar las secciones por título literal (`## Historias`)* — viola `constitution.md:159`: renombrar
  la sección en el template rompería 6 skills.
- *Localizar por la anotación `escritor:`* — el gate y el migrador no son escritores de esas secciones, y
  `smoke-tests` no tiene editor automático; la clave sirve a todos.
- *Declarar también el formato de línea en el template (parseado del ejemplo)* — descartado por el PO:
  frágil y caro para 6 skills; F1–F3 y `SMOKE-N` son la interfaz entre skills, no estructura.

### D-3 — `epic-format-validation`: contrato v2 + reglas de forma + detección de v1 // satisface: AC-11, AC-5, CNF-4

Paso 3/4 se amplían; el resultado sigue siendo `APROBADO` / `REFINAR` / `RECHAZADO`:

1. **Secciones (3a, sin cambios de mecanismo):** derivadas del template. Con v2 resultan las 5. Además
   se lee el contrato por claves (D-2b); clave duplicada en el template → `❌ Template inválido: clave
   <x> duplicada` y se detiene.
2. **Sin detección de versión por título:** una épica v1 simplemente no tiene las secciones del template
   y recibe `REFINAR` con la lista de títulos faltantes, más una nota al pie: `Si la épica se creó con
   una versión anterior del template → /memory-system migrate --from=epic-template-v1`.
3. **Regla de forma de la sección con clave `historias` (nueva):** se toma su título del template y se
   localiza en la épica; cada línea de nivel superior que empiece por `- ` debe casar con F1, F2 o F3
   (D-2). Cada incumplimiento → ítem `REFINAR` con número de línea, texto y la forma esperada.
4. **Regla de forma de la sección con clave `smoke-tests` (nueva):** ≥ 1 encabezado `###`; si hay ≥ 2, todos deben
   casar `### SMOKE-<N> — <nombre>` (N entero, sin exigir contigüidad); si hay 1, se acepta con o sin
   `SMOKE-<N> — `. Cada `###` debe ir seguido de un bloque ```` ```gherkin ```` que contenga
   `Escenario:`, `Dado`, `Cuando`, `Entonces`. IDs `SMOKE-N` duplicados → `REFINAR`.
   Si el template no declara la clave (`historias` o `smoke-tests`), la regla correspondiente no se
   aplica.
5. **Mensaje accionable:** la salida `REFINAR` agrupa en `Secciones/campos faltantes:` y
   `Formato inválido:` (nuevo bloque), cada ítem con la corrección esperada.

El formato v1 no se acepta: sale en 4.0.0 junto con EPIC-21 (breaking change con migración automática,
CR-007). Las reglas 3–4 se codifican en el skill porque son reglas de **forma de línea** (contrato fijo,
D-2b), pero **dónde** se aplican lo decide el template por clave: el skill no contiene ningún título de
sección.

**Alternativas rechazadas:**
- *Parsear los formatos del comentario guía del template* — frágil (el comentario es prosa para humanos)
  y acopla el gate al wording.
- *Aceptar v1 con aviso de deprecación durante 4.x* — la historia sale en la major 4.0.0 (entrega por
  lotes de EPIC-21), nunca hubo una minor con v2; mantener ramas v1 en 4 skills no aporta y la
  migración ya es automática (CR-007).
- *Detectar v1 por títulos (`## Descripción` sin `## Alcance`)* — exigiría escribir títulos en el skill
  (viola D-2b) y fallaría con templates personalizados; la lista de faltantes + nota de migración da la
  misma información sin conocer títulos.

### D-4 — Productores: `epic-creation` y `epic-from-project-plan` // satisface: AC-8, AC-2, AC-3, AC-4, AC-5, AC-6

**`epic-creation/SKILL.md`:**
- Paso 2: sin cambios de mecanismo (deriva del template) — con v2 la lista de opcionales queda vacía y
  el Paso 5 no pregunta nada (se mantiene por si un consumidor personaliza el template).
- Paso 3: se elimina `alwaysApply` de la lista de campos opcionales; `status` por defecto `DEFINE`,
  `substatus` por defecto `TODO` (regla WIP=1 del skill; el template trae `IN-PROGRESS` como valor de
  ejemplo y el skill lo sobrescribe — comportamiento actual, sin cambio).
- Paso 4: se **elimina** la "Guía de preguntas por sección" escrita por título (v1 y v2). La pregunta
  de cada sección se construye en runtime con su título y su comentario guía del template. Solo dos
  claves tienen manejo especial de entrada/salida (D-2b): `historias` (pide `Nombre: descripción`,
  escribe **F1**, nunca pide IDs) y `smoke-tests` (pide Dado/Cuando/Entonces, escribe
  `### SMOKE-N — <nombre>` + bloque `gherkin` numerando desde 1). Una sección cuyo comentario la declara
  opcional en contenido acepta "ninguna" y deja solo el encabezado.
- Nueva sección `## DoD aplicable` (estructura del bloque de STORY-101): etapa `DEFINE` de Epic;
  guardrail: **ninguno vigente** — el gate de la transición `DEFINE → PLAN` es el "Gate de formato" de
  `domain-epic-lifecycle` §8, ejecutado por `epic-format-validation` en el Paso 7; override: no aplica
  (CR-002).

**`epic-from-project-plan/SKILL.md`:**
- Fase 3d: el ejemplo embebido (con títulos fijos) se reemplaza por un **mapeo plan → clave**; el
  título y el orden salen del template. Descripción/objetivo del plan → `alcance`; líneas
  `- [ ] STORY-NNN - Nombre` → F2, `- [x] …` → F3, sin ID → F1 en `historias`; `**Criterios de éxito:**`
  del plan → `criterios-salida`; un `### SMOKE-N` por criterio derivado (o `### SMOKE-1 — Verificación de
  entrega` si no hay) en `smoke-tests`; requisitos/dependencias/riesgos del plan → subsecciones `###` de
  `notas` (omitidas si vacías). Sección del template sin clave mapeada o sin dato → `[Por completar]`
  (regla actual).
- Nueva Fase 3e: invocar `epic-format-validation` (modo automático) sobre cada `epic.md` generado y
  reportar su resultado en el resumen de la Fase 4; `REFINAR` no detiene el batch (se lista).
- Se elimina la nota "el skill no valida el formato".

**Alternativas rechazadas:**
- *Crear un guardrail `dod-epic-define.md`* — fuera de alcance explícito de la historia.
- *Que `epic-from-project-plan` no valide y lo deje al usuario* — AC-8 exige que los generados pasen la
  validación; sin invocarla no hay evidencia.

### D-5 — Editores de la sección `historias`: asignación de IDs (F1 → F2) // satisface: AC-9

**`epic-generate-stories/SKILL.md`:**
- Paso 1b (nuevo): resolver el template (central → seed) y leer el título de la sección con clave
  `historias` (D-2b). **Dependencia nueva** a declarar en `## Dependencias`: `epic-template.md`.
  - Template sin clave `historias` → `❌ El template no declara una sección con clave historias` y se
    detiene.
  - Épica sin ese título → fail-fast sin escribir: `❌ La épica no tiene la sección "<título>". Si se
    creó con una versión anterior del template → /memory-system migrate --from=epic-template-v1`.
- Paso 2 (parser): acepta solo F1, F2 y F3 (los 5 formatos heredados se eliminan). Solo analiza líneas
  de nivel superior dentro de esa sección; una línea que no case se lista como "no procesada (formato no
  reconocido)" (comportamiento actual del resumen).
- Paso 2b (backfill): toda línea F1 se reescribe a **F2** `- [ ] **STORY-NNN** — <Nombre>: <desc>`. Las
  líneas F2/F3 no se tocan.
- Regla de alcance: se reescriben solo líneas de esa sección; el resto del archivo queda byte a byte
  igual, salvo `updated:` del frontmatter (convención "todo skill que edite el archivo").
- Cálculo de `NNN`: sin cambios (máximo entre filesystem y épicas + 1).

**`epic-generate-all-stories/SKILL.md`:**
- Paso 4a deja de exigir ID: aplica **por referencia** los Pasos 2 y 2b de `epic-generate-stories`
  (composición inline, cadena corta), con un contador `NNN` **global** al batch para que dos épicas no
  reciban el mismo ID. El Paso 2 (detección anticipada de conflictos) calcula nombres solo para líneas
  con ID; las F1 no pueden colisionar con un directorio existente porque su ID es nuevo.

**Alternativas rechazadas:**
- *Duplicar las reglas de parseo en `-all-stories`* — mantiene la deriva actual (CR-009).
- *Seguir parseando los formatos heredados* — solo sirve a épicas sin migrar, que desde 4.0.0 deben
  pasar por la migración (CR-007); duplicaría reglas que ya viven en R7 del migrador.

### D-6 — Marcado de completada (F2 → F3) en `story-implement` y `story-implement-tasks` // satisface: AC-9

En `story-implement` 11d y `story-implement-tasks` 4c, el paso pasa a:
1. Resolver la épica padre por `parent` (lógica de ruta sin cambios).
2. Resolver el título de la sección con clave `historias` desde el template (D-2b; misma resolución
   central → seed). Si el template no la declara o la épica no tiene ese título → `[WARN] epic.md sin la
   sección "<título>" → si se creó con una versión anterior del template: /memory-system migrate
   --from=epic-template-v1; omitiendo actualización` (no es error: no bloquea el cierre de la historia).
3. Dentro de esa sección, buscar la línea de nivel superior que contenga `**<story_id>**`
   (coincidencia exacta del token: `STORY-103` no debe casar `STORY-1030`).
4. Cambiar `- [ ]` → `- [x]` solo en esa línea; actualizar `updated:`.
5. Sin coincidencia → `[INFO] … omitiendo actualización` (no es error, igual que hoy).

**Alternativa rechazada:** *buscar el ID en todo el archivo* (comportamiento actual) — el ID puede
aparecer en la sección `notas` o en un `SMOKE-N`, y marcaría una línea equivocada.

### D-7 — Migración: `memory-system migrate --from=epic-template-v1` // satisface: AC-10

Patrón reutilizado de STORY-101 (D-2/D-3 de ese diseño): **módulo de dominio** nuevo
`skills/memory-system/scripts/epic-template.js`, invocado por el motor.

- **Motor (`memory-system.js`):** `MIGRATE_SOURCES` pasa a `['dod-monolithic', 'epic-template-v1']`;
  `runMigrate` despacha por `args.from` a `dodStory.migrateDod` o `epicTemplate.migrateEpics`;
  `USAGE` lista ambos orígenes. `--force` se ignora para `epic-template-v1` (la transformación es
  determinista; no hay "preservar vs sobrescribir").
- **Descubrimiento:** archivos `<SPECS_BASE>/specs/*/EPIC-*/epic.md` (patrón por nombre, sin
  hardcodear `02-epics`, para que siga funcionando tras STORY-108).
- **Contrato de destino:** `readTemplateContract(templateText) → [{ heading, clave, obligatoria }]` lee
  el template vigente (central → seed, D-2b). El **origen** v1 es conocimiento fijo (es una versión
  vieja y cerrada) y se expresa como *título v1 → clave*; el **destino** (título, orden y secciones a
  insertar) sale del template por clave. Así la migración funciona también hacia un template
  personalizado.
- **Transformación** (`planEpicMigration(text, contract) → { content, changed, findings }`, función pura):

| Regla | Origen v1 | Destino (por clave; título leído del template) |
|---|---|---|
| R1 | `## Descripción` | clave `alcance` |
| R2 | `## Flujos Críticos / Smoke Tests` (+ párrafo `*Si alguno…*`) | clave `smoke-tests` (el párrafo se **conserva** como primera línea: no se pierde texto de autor) |
| R3 | `**Criterios de éxito:**` (párrafo en negrita) o `## Criterios de éxito` + su lista | clave `criterios-salida` + la misma lista |
| R4 | `### Escenario N: <t>` + líneas `**DADO**/**CUANDO**/**ENTONCES**/**Y** <x>` | `### SMOKE-N — <t>` + bloque `gherkin` (`Escenario: <t>`, `  Dado <x>`, `  Cuando`, `  Entonces`, `  Y`); N = número original |
| R5 | `## Notas adicionales`, `## Notas:` | cuerpo inicial de la sección con clave `notas` |
| R6 | Cualquier otro `##` (Requerimiento*, Impacto…, Dependencias…, Riesgos*, Objetivo, Requerimientos no funcionales…) | `### <encabezado original>` dentro de la sección `notas` (sus `###` internos bajan a `####`); si su contenido es vacío o solo placeholders/comentarios → se elimina |
| R7 | Líneas de `Historias` heredadas | `STORY-NNN - **N:** d`, `**STORY-NNN — N:** d`, `STORY-NNN — N: d` → F2/F3 (conserva el checkbox); sin ID y sin `[x]` (`- [ ] **N:** d`) → F1; sin ID con `[x]` → se conserva y se reporta `[REVISAR]` (no se inventan IDs ni se pierde el estado) |
| R8 | Sección obligatoria del template ausente en la épica | Se inserta con su título del template y placeholder según clave: `criterios-salida` → `- [ ] [Por completar]`; `smoke-tests` → `### SMOKE-1 — [Por completar]` + bloque gherkin placeholder; `notas` → vacío (solo encabezado); cualquier otra → `[Por completar]` |
| R8b | Clave destino de R1–R6 que el template no declara | El contenido va a la sección con clave `notas` como `### <título v1>`; si tampoco hay `notas` → se conserva al final y se reporta `[REVISAR]` |
| R9 | Orden | El orden de las secciones del template |
| R10 | Preámbulo (frontmatter, wikilinks, `#` H1 y todo lo anterior al primer `##`) | Se conserva **byte a byte** (EPIC-00 queda con su preámbulo y secciones insertadas) |
| R11 | Marcadores `<!-- sección … -->` en encabezados de una épica | Se eliminan (pertenecen al template) |

- **Hallazgos `[REVISAR]`** (no bloquean la escritura del resto, sí el exit code): cuerpo de smoke test
  sin `DADO/CUANDO/ENTONCES` reconocible (se conserva verbatim bajo `### SMOKE-N — <t>`), línea de
  `Historias` irreconocible o `[x]` sin ID (se conserva verbatim).
- **Template central sin claves:** si `<SPECS_BASE>/templates/epic-template.md` existe y ninguna de sus
  secciones declara `clave:` (template v1 o personalizado sin claves), se emite `[REVISAR]
  templates/epic-template.md — template sin claves de sección: reemplázalo por el seed v2 o añade
  "clave:" a sus marcadores (/sddf-init --force o /memory-system rebuild --force)` y se usa el seed como
  contrato de destino. No se sobrescribe: puede estar personalizado. Sin este aviso, `epic-creation`
  seguiría generando épicas que los editores no saben leer.
- **Frontmatter:** no se toca (ni `updated`), para que la idempotencia sea exacta y no se pierdan claves
  como `deliveryModel` en épicas existentes (el gate admite claves extra).
- **Idempotencia:** para un mismo contrato, `plan(plan(x).content).content === plan(x).content`
  (punto fijo). Un `epic.md` que ya cumple el contrato produce `content === text` → `[SIN CAMBIOS]`. Solo se escribe si el
  contenido difiere.
- **Salida** (mismo estilo que `dod-monolithic`): cabecera
  `── memory-system migrate ── from: epic-template-v1 · root: <root>`, una línea por archivo
  (`[MIGRADO]`/`[MIGRARÍA]`, `[SIN CAMBIOS]`, `[REVISAR] <ruta>:<línea> — <motivo>`), regla `─` y
  `migrados: N · sin cambios: M · a revisar: R` (+ `cambios pendientes: P` con `--dry-run`).
  Exit 0 sin `[REVISAR]`; 1 con alguno; 2 en error de uso (convención del motor).
- **`memory-system/SKILL.md`:** fila nueva en la tabla de parámetros, secuencia `3.8`, línea de informe
  final y `description`. Sin `node` en PATH (Paso 5): este modo no tiene degradación inline — informa
  `❌ migrate --from=epic-template-v1 requiere node` y termina sin escribir.
- **Aplicación en este repo:** las 22 épicas se migran **ejecutando** el modo sobre `docs/` (no a mano),
  revisando los `[REVISAR]` a mano y re-ejecutando con `--dry-run` hasta `cambios pendientes: 0`.

**Alternativas rechazadas:**
- *Migrar las 22 épicas editándolas a mano (lo que sugiere el mapa de la historia)* — no deja nada
  reutilizable para consumidores y no demuestra idempotencia (AC-10).
- *Extender `dod-story.js`* — mezcla dos dominios en un módulo (P11).
- *Migrar dentro de `epic-format-validation`* — el gate es de solo lectura por contrato.

### D-8 — Copias del template y distribución // satisface: AC-1, AC-8

`docs/templates/epic-template.md` y `skills/epic-creation/assets/epic-template.md` se reescriben con el
mismo contenido (byte a byte; verificación `diff`). `sddf-init` y `memory-system scaffold` no cambian:
copian el seed por nombre. Repos consumidores con un central v1 lo conservan (`[PRESERVADO]`); al
actualizar a 4.0.0 deben reemplazarlo (`sddf-init --force` o `memory-system rebuild --force`) y migrar
sus épicas. La migración (D-7) avisa del template central v1 y la guía de actualización del CHANGELOG
lo documenta.

### D-9 — Documentación y registro // satisface: CNF-2, CNF-3, AC-3

- `docs/domains/domain-epic-lifecycle.md`: nueva subsección en §9 "Estructura de `epic.md`" con el
  contrato por claves (D-2b: vocabulario, qué edita el usuario y qué es fijo, procedimiento de lectura),
  la tabla de formatos F1–F3 + transiciones (D-2) y la regla SMOKE-N; el bullet de
  frontmatter deja de citar `deliveryModel`. **No** se toca la máquina de estados (§4–§6) ni las
  invariantes (fuera de alcance).
- `docs/templates/README.md`: solo describe nomenclatura → **N/A** (no menciona secciones).
- `docs/guides/how-to-write-epics.md`: no existe → **N/A**.
- `docs/guides/sddf-commands-pipeline.md`: actualizar solo si menciona secciones v1 del Epic (la
  búsqueda de `epic-template` no da coincidencias; verificar `Descripción`/`Smoke` en implementación).
- `README.md` de los skills tocados y `skills/epic-creation/examples/`: alinear si citan secciones v1.
- `CHANGELOG.md` `[Unreleased]` → `### Changed` marcado **BREAKING** (template v2, skills, el formato v1
  deja de aceptarse) + `### Added` (`migrate --from=epic-template-v1`) y una entrada en la guía de
  actualización a 4.0.0 de EPIC-21: reinstalar skills, reemplazar el template central, ejecutar la
  migración con `--dry-run` y luego real.

### D-10 — Evals y tests // satisface: AC-8, AC-9, AC-10, AC-11

- `test/epic-template.test.js` (`node --test`, nuevo): reglas R1–R11 sobre fixtures en
  `skills/memory-system/examples/epic-template-v1/` (épica v1 completa, mínima tipo EPIC-01, sin `##`
  tipo EPIC-00, con `Requerimiento: x`, con smoke no-gherkin), idempotencia (punto fijo y
  `[SIN CAMBIOS]`), exit codes y `--dry-run` sin escrituras; `parseArgs` acepta `epic-template-v1`.
- Test determinista del template: ≤ 40 líneas, exactamente 5 `##` con marcador, frontmatter sin
  `alwaysApply`/`deliveryModel`/`children`/`implements`, `status: DEFINE`, central == seed.
- `evals.json`: `epic-format-validation` (v2 aprobado, v1 → REFINAR con el comando de migración, `Historias` con línea
  inválida, smoke sin `SMOKE-N` con ≥ 2, falta `Notas`), `epic-creation` (genera F1 y SMOKE-1),
  `epic-generate-stories` (F1 → F2 sin tocar otras secciones), `epic-from-project-plan` (generado pasa
  validación). La descripción de `epic-format-validation/evals.json` cita hoy las secciones v1 y se
  actualiza.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Template central | modificar | `docs/templates/epic-template.md` | AC-1…AC-7, CNF-1 |
| Template seed | modificar | `skills/epic-creation/assets/epic-template.md` | AC-1…AC-7, AC-8 |
| Gate de formato | modificar | `skills/epic-format-validation/SKILL.md` (+ `README.md`, `evals/evals.json`) | AC-11, CNF-4 (detección v1) |
| Creación interactiva | modificar | `skills/epic-creation/SKILL.md` (+ `README.md`, `examples/`, `evals/`) | AC-8 |
| Generación desde plan | modificar | `skills/epic-from-project-plan/SKILL.md` (+ `evals/`) | AC-8 |
| Asignación de IDs | modificar | `skills/epic-generate-stories/SKILL.md` (+ `evals/`) | AC-9 |
| Asignación batch | modificar | `skills/epic-generate-all-stories/SKILL.md` | AC-9 |
| Marcado de completada | modificar | `skills/story-implement/SKILL.md` (11d), `skills/story-implement-tasks/SKILL.md` (4c) | AC-9 |
| Migrador de épicas | crear | `skills/memory-system/scripts/epic-template.js` | AC-10 |
| Motor de memoria | modificar | `skills/memory-system/scripts/memory-system.js` (`MIGRATE_SOURCES`, `runMigrate`, `USAGE`) | AC-10 |
| Skill de memoria | modificar | `skills/memory-system/SKILL.md` (parámetros, secuencia 3.8, informe, Paso 5) | AC-10 |
| Fixtures de migración | crear | `skills/memory-system/examples/epic-template-v1/` | AC-10 |
| Tests | crear | `test/epic-template.test.js` | AC-1, AC-7, AC-10, CNF-1 |
| Épicas del repo | migrar (vía motor) | `docs/specs/02-epics/EPIC-*/epic.md` (22) | AC-10 |
| Dominio Epic | modificar | `docs/domains/domain-epic-lifecycle.md` (§9) | CNF-2, AC-3 |
| CHANGELOG | modificar | `CHANGELOG.md` | CNF-3, CNF-4 |

`package.json › files`: `skills/memory-system/` ya se publica como carpeta; verificar que el patrón
incluye `scripts/epic-template.js` y `examples/` (AGENTS.md: un archivo nuevo de skill debe estar en
`files`).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| CLI motor | `node memory-system.js migrate --root <SPECS_BASE> --from epic-template-v1 [--dry-run] [--date YYYY-MM-DD]` → stdout líneas de D-7; exit 0 / 1 (`[REVISAR]`) / 2 (uso) | AC-10 |
| Skill | `/memory-system migrate --from=epic-template-v1 [--dry-run]` (normaliza `=` como hoy) | AC-10 |
| `epicTemplate.readTemplateContract(text: string)` | → `Array<{ heading: string, clave: string\|null, obligatoria: boolean }>` en el orden del template; lanza `UsageError` si hay claves duplicadas | AC-1, AC-10, D-2b |
| `epicTemplate.planEpicMigration(text: string, contract)` | → `{ content: string, changed: boolean, findings: Array<{ line: number, reason: string }> }`; pura, sin E/S | AC-10 |
| `epicTemplate.migrateEpics(specsBase: string, { dryRun, displayRoot })` | → `{ lines: string[], summary: { migrated, unchanged, review }, exitCode: 0\|1 }`; escribe solo si `!dryRun && changed`; `assertInsideRoot` por archivo | AC-10 |
| `epic-format-validation` (salida) | `APROBADO` · `REFINAR` (v1 → ítem único con el comando de migración; v2 → bloques `Secciones/campos faltantes:` y `Formato inválido:` · `RECHAZADO` | AC-11, CNF-4 |
| Línea de historia | F1 / F2 / F3 (D-2) — contrato entre productores, editores, gate y migrador | AC-3, AC-9, AC-11 |
| Smoke test | `### SMOKE-<N> — <nombre>` + ```` ```gherkin ```` con `Escenario:/Dado/Cuando/Entonces` | AC-5, AC-11 |

## Esquema de datos

Frontmatter v2 de `epic.md` (YAML):

| Clave | Tipo | Exigida por el gate | Valor inicial |
|---|---|---|---|
| `type` | `"epic"` | sí | `epic` |
| `id` | `EPIC-NN` | sí | — |
| `slug` | kebab ASCII | sí | nombre del directorio |
| `title` | string | sí | — |
| `status` | enum del ciclo de vida | sí | `DEFINE` |
| `substatus` | `TODO\|IN-PROGRESS\|DONE\|BLOCKED` | sí | `IN-PROGRESS` (template) / `TODO` (`epic-creation`) |
| `parent` | slug \| `null` | no (allowlist) | `null` |
| `created` / `updated` | `YYYY-MM-DD` | sí | fecha de creación |
| `related` | lista de slugs | no (allowlist) | `[]` |

Hallazgo de migración (interno al módulo): `{ file, line, reason }` con `reason ∈ { 'smoke-sin-gherkin',
'historia-irreconocible', 'completada-sin-id' }`.

## Flujos clave

### F-1 — Crear una épica nueva (AC-8, AC-1…AC-7)
`/epic-creation` → lee el template (central → seed) y su contrato por claves → una pregunta por
sección (título + comentario guía); `historias` escribe F1 y `smoke-tests` escribe `SMOKE-1…N` gherkin →
escribe `epic.md` en el orden del template → invoca `epic-format-validation` → `APROBADO`.

### F-2 — Generar historias (AC-9)
`/epic-generate-stories EPIC-NN` → lee del template el título de la clave `historias` → parsea esa sección → por cada F1 asigna `STORY-NNN` y reescribe a
F2 (resto del archivo intacto salvo `updated`) → crea `STORY-NNN-*/story.md`.

### F-3 — Completar una historia (AC-9)
`story-implement` 11d → `parent` → `epic.md` → sección de clave `historias` → línea con `**STORY-NNN**` → F2 → F3.

### F-4 — Migrar este repo (AC-10)
`/memory-system migrate --from=epic-template-v1 --dry-run` (plan) → ejecución → resolver `[REVISAR]` a
mano (p. ej. EPIC-16 `[x]` sin ID, EPIC-14 smoke no-gherkin) → `--dry-run` reporta `cambios pendientes: 0`
→ `epic-format-validation` sobre las 22 → todas `APROBADO`.

### F-5 — Consumidor que actualiza a 4.0.0 (CNF-4, degradación)
`npx agile-sddf install --force` → `/memory-system migrate --from=epic-template-v1 --dry-run` → el plan
lista las épicas a migrar y `[REVISAR] templates/epic-template.md` si el central es v1 → el usuario
reemplaza el template central y ejecuta la migración real. Si no migra: el gate devuelve `REFINAR` con el
comando, `epic-generate-stories` se detiene con el mismo mensaje y `story-implement` avisa (`[WARN]`) sin
bloquear.

### F-6 — El usuario renombra una sección del template (D-2b)
El autor cambia `## Historias <!-- … · clave: historias -->` por `## Features <!-- … · clave: historias -->`
→ las épicas nuevas usan `## Features` → `epic-generate-stories`, `story-implement` y el gate localizan
la sección por clave y funcionan sin cambios → las épicas antiguas con `## Historias` aparecen en el gate
como "falta Features" hasta que el autor las renombra.

## Decisiones de complejidad justificada

- **Reglas de forma codificadas en el gate (D-3):** la extracción dinámica cubre presencia; la forma de
  línea no es expresable como marcador sin inventar un DSL en comentarios. Tres patrones fijos y
  documentados en el dominio son lo mínimo que cumple AC-11.
- **Sin compatibilidad v1 (D-3, D-5, D-6):** decisión CR-007. Ningún skill fuera del migrador conoce
  títulos v1: una épica sin migrar se detecta como "faltan secciones del template" y el mensaje nombra
  el comando de migración.
- **Claves de sección (D-2b):** es el mínimo para cumplir `constitution.md:159` con secciones que los
  skills editan: un atributo más en un marcador que ya existe y una función de lectura. Sin él, cada
  skill necesitaría títulos literales.
- **Módulo nuevo `epic-template.js` (D-7):** la migración tiene 11 reglas y fixtures propios; meterla en
  el motor (1040 líneas) o en `dod-story.js` rompe cohesión. Es el mismo patrón ya validado en STORY-101.
- **Descubrimiento por patrón `specs/*/EPIC-*/epic.md`:** evita que STORY-108 tenga que tocar este
  módulo; no añade abstracción.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Template con exactamente 5 `##` en orden y sin las 8 eliminadas | test determinista sobre `docs/templates/epic-template.md` | AC-1 |
| 2 | Comentario guía de `Alcance` cita output y `product/vision.md`/`requirements/` | test (búsqueda de texto) | AC-2 |
| 3 | Comentario de `Historias` documenta F1–F3; ejemplo por defecto es F1 | test | AC-3 |
| 4 | `Criterios de salida` con guía "técnicos verificables" | test | AC-4 |
| 5 | `### SMOKE-1 — …` + bloque `gherkin`; guía de no-renumerar y numeración opcional | test | AC-5 |
| 6 | `## Notas` última sección, guía "opcional" | test | AC-6 |
| 7 | Frontmatter mínimo, `status: DEFINE`, sin `implements/deliveryModel/children` | test | AC-7 |
| 8 | ≤ 40 líneas; central y seed idénticos | test | CNF-1, AC-8 |
| 9 | `epic-creation` tiene `## DoD aplicable`; épica generada → `APROBADO` | eval `epic-creation` | AC-8 |
| 10 | Épica de `epic-from-project-plan` → `APROBADO` | eval `epic-from-project-plan` | AC-8 |
| 11 | F1 → F2 sin modificar otras secciones | eval `epic-generate-stories` (diff fuera de la sección `historias` vacío salvo `updated`) | AC-9 |
| 12 | `-all-stories` asigna IDs únicos en batch | eval / revisión del SKILL.md | AC-9 |
| 13 | `story-implement` marca F3 solo en la sección `historias` | revisión del SKILL.md + eval si existe | AC-9 |
| 14 | Migración R1–R11 sin pérdida de texto de autor | `test/epic-template.test.js` (fixtures) | AC-10 |
| 15 | Idempotencia (punto fijo; segunda ejecución `[SIN CAMBIOS]`) | `test/epic-template.test.js` + `--dry-run` en el repo → `cambios pendientes: 0` | AC-10 |
| 16 | 22 épicas del repo → `APROBADO` | `epic-format-validation` sobre cada una | AC-10, AC-11 |
| 17 | Gate: 5 secciones, formatos F1–F3, `SMOKE-N`, mensajes accionables, v1 → REFINAR con comando de migración | eval `epic-format-validation` | AC-11, CNF-4 |
| 18 | Dominio y CHANGELOG actualizados | revisión + `test/check-doc-links.test.js` | CNF-2, CNF-3 |
| 19 | IDs y slugs con `-` U+002D | test (regex sobre template y fixtures migrados) | CNF-5 |
| 20 | Las 5 claves v2 presentes y únicas en el template | test | AC-1, D-2b |
| 21 | Renombrar un título en el template (misma clave) no rompe gate, `epic-generate-stories` ni `story-implement` | evals + test de `readTemplateContract` | AC-9, AC-11, D-2b |
| 22 | Migración hacia un template personalizado respeta sus títulos y orden | `test/epic-template.test.js` | AC-10, D-7 |

## Risks / Trade-offs

- **[Riesgo] Las épicas migradas quedan con placeholders `[Por completar]`** en `Criterios de salida` y
  `Smoke tests` (12 de 22 no tienen smoke tests) → Mitigación: es el mismo criterio de
  `epic-from-project-plan`; no se inventa contenido. Las épicas `COMPLETED` pueden quedarse así.
- **[Riesgo] `[REVISAR]` manuales en este repo** (EPIC-14, EPIC-16, posiblemente EPIC-00) → Mitigación:
  el motor conserva el texto y señala archivo:línea; la tarea de migración incluye resolverlos.
- **[Limitación] Renombrar un título en el template no renombra las épicas existentes** → el gate lo
  informa como sección faltante; el autor renombra a mano (D-2b). Aceptado (YAGNI).
- **[Riesgo] Un usuario borra `clave:` de un marcador** → los skills que necesitan esa clave lo
  informan con un error accionable (D-5, D-6, D-3); el gate desactiva solo la regla afectada.
- **[Riesgo] Conflicto con STORY-108** (renombrado de `02-epics`) → Mitigación: descubrimiento por
  patrón (D-7); las rutas existentes en skills no se tocan aquí.
- **[Riesgo] Un consumidor actualiza a 4.0.0 sin migrar sus épicas** → Mitigación: gate,
  `epic-generate-stories` y `story-implement` detectan v1 y nombran el comando de migración; la guía de
  actualización de EPIC-21 incluye el paso. Es un breaking change asumido (CR-007).
- **[Riesgo] Copias instaladas (`.claude/skills/`) quedan con v1 hasta reinstalar** → Mitigación:
  `npx agile-sddf install --force`; documentado en CHANGELOG.

## Open Questions

Ninguna bloqueante; las ambigüedades se resolvieron en el diseño y quedan registradas como CR para
validación del PO (CR-001 requiere corrección en `story.md`).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: `story.md` declara `parent: EPIC-103-framework-consistency`, que no existe. La historia
  está listada en `EPIC-21-colapsar-specs-dos-niveles` (primera línea de `## Historias`); también existe
  `EPIC-19-framework-consistency`, sin referencia a STORY-103.
- **Documento afectado**: story.md
- **Acción requerida**: corregir `parent: EPIC-21-colapsar-specs-dos-niveles`. **Resuelto:** `story.md` ya
  declara `parent: EPIC-21-colapsar-specs-dos-niveles`.

### CR-002
- **Tipo**: inviabilidad
- **Descripción**: AC-8 pide que `## DoD aplicable` de `epic-creation` referencie "el guardrail de
  transición de Epic correspondiente", pero no existe ningún guardrail DoD de Epic y crearlo está fuera de
  alcance.
- **Documento afectado**: story.md / design.md
- **Acción requerida**: aceptar la resolución de D-4 (la sección declara "sin guardrail vigente" y
  referencia el Gate de formato `DEFINE → PLAN` de `domain-epic-lifecycle` §8, ejecutado por
  `epic-format-validation`), o ajustar el texto de AC-8.

### CR-003
- **Tipo**: dependencia
- **Descripción**: el mapa de implementación cita `.claude/skills/<skill>/SKILL.md`; según `AGENTS.md`, la
  fuente única es `skills/<skill>/` y `.claude/` es salida de instalación. También cita
  `skills/epic-format-validation/SKILL.md` correctamente (inconsistencia interna).
- **Documento afectado**: story.md
- **Acción requerida**: leer el mapa como `skills/<skill>/SKILL.md` (este diseño lo hace).

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: AC-6 define `Notas` como opcional; AC-11 exige "cinco secciones obligatorias".
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; resuelto en D-1 (encabezado obligatorio, contenido opcional).

### CR-005
- **Tipo**: ambigüedad
- **Descripción**: AC-5 hace opcional la numeración con un solo smoke test; AC-11 exige el patrón
  `### SMOKE-N — [nombre]`.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; resuelto en D-3 regla 4 (con 1 escenario se aceptan ambas formas).

### CR-006
- **Tipo**: ambigüedad
- **Descripción**: el borrador `epic-template.md` adjunto en el directorio de la historia contradice AC-7
  (`alwaysApply`, `deliveryModel`, `children`), AC-3 (checkbox en F1) y AC-6 (sin `Notas`) y no lleva
  marcadores de sección.
- **Documento afectado**: story.md (adjunto)
- **Acción requerida**: prevalecen los ACs (D-1). **Resuelto (2026-10-06):** el borrador adjunto se
  reescribió y ahora es idéntico al bloque de D-1 (40 líneas), así que puede copiarse tal cual en T003.

### CR-007
- **Tipo**: dependencia
- **Descripción**: CNF-4 mantiene la compatibilidad v1 "hasta la siguiente major", y EPIC-21 (la épica
  padre) ya es esa major (`3.x → 4.0.0`).
- **Documento afectado**: story.md / epic.md (EPIC-21)
- **Acción requerida**: **Resuelto (2026-10-06, decisión del PO):** STORY-103 se publica con EPIC-21 en
  4.0.0 (entrega por lotes), así que el formato v1 se retira en 4.0.0 sin compatibilidad en tiempo de
  ejecución. Es un breaking change con migración automática (`migrate --from=epic-template-v1`); los
  skills detectan v1 y nombran el comando (D-3, D-5, D-6). CNF-4 de `story.md` se reescribió en ese
  sentido.

### CR-008
- **Tipo**: ambigüedad
- **Descripción**: la lista de AC-7 no incluye `related`; el template lo conserva (`related: []`).
- **Documento afectado**: design.md
- **Acción requerida**: ninguna si el PO acepta "campos mínimos" como mínimo, no como lista cerrada; AC-7
  solo prohíbe `implements`, `deliveryModel` y `children`.

### CR-009
- **Tipo**: dependencia
- **Descripción**: `epic-generate-all-stories` hoy no asigna IDs (solo procesa líneas con ID); AC-9 le
  exige la misma transformación F1 → F2, lo que es comportamiento nuevo, no solo un cambio de formato.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; resuelto en D-5 por composición con `epic-generate-stories`.

### CR-011
- **Tipo**: reutilización
- **Descripción**: la primera versión del diseño escribía títulos literales (`## Historias`, `## Alcance`,
  `## Descripción`) en el gate, `epic-generate-stories`, `story-implement*`, `epic-creation` y el
  migrador, contra `docs/constitution.md:159` ("los skills no hardcodean la estructura").
- **Documento afectado**: design.md
- **Acción requerida**: **Resuelto (2026-10-06, decisión del PO):** estructura libre y formato de línea
  fijo. Se añade `clave:` a los marcadores del template (D-1, D-2b) y todos los skills localizan las
  secciones por clave (D-3…D-7).

### CR-010
- **Tipo**: reutilización
- **Descripción**: el mapa de la historia sugiere migrar las épicas "uno por archivo"; el motor de
  `memory-system` ya tiene el patrón `migrate --from` + módulo de dominio (STORY-101).
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; las 22 épicas se migran ejecutando el modo nuevo (D-7, F-4).

### CR-012
- **Tipo**: inconsistencia (detectada en IMPLEMENT, DoD ❌ "convenciones de `constitution.md`")
- **Descripción**: el contrato original de D-1 solo anotaba `escritor:` en `type`, `id`, `status` y
  `updated`; `slug`, `title`, `substatus`, `parent`, `created`, `related` y las 5 secciones del cuerpo
  no nombraban a su escritor, contra `docs/constitution.md` principio 13.
- **Documento afectado**: design.md (D-1) · `docs/templates/epic-template.md` · seed
  `skills/epic-creation/assets/epic-template.md` · borrador adjunto de la historia
- **Acción requerida**: **Resuelto (2026-10-06, decisión del PO):** se anota el escritor de todos los
  campos, en línea (no suma líneas: el template sigue en 40, CNF-1). Escritores verificados contra los
  `SKILL.md`: frontmatter → `epic-creation` · `epic-from-project-plan` (`substatus`: `epic-creation`
  escribe `TODO` por WIP=1; `parent`: `epic-from-project-plan` escribe `PROJ-NN` o `null`; `updated`:
  todo skill que edite el archivo). Cuerpo → productores + `memory-system` (migración v1); la sección
  `historias` añade `epic-generate-stories` · `epic-generate-all-stories` (F1 → F2) y `story-implement`
  · `story-implement-tasks` (F2 → F3). Ningún skill transiciona hoy el `status` de la épica. La
  anotación va tras `clave:` en el marcador y no cambia el contrato por claves (D-2b): `npm test`
  218/218 y la migración en seco del repo sigue en `cambios pendientes: 0`.

### CR-013
- **Tipo**: inconsistencia (detectada en IMPLEMENT, al migrar el repo, F-4)
- **Descripción**: EPIC-00…EPIC-09 tenían la clave heredada `date:` sin `created`/`updated`, que el
  gate exige (son claves del template fuera de la allowlist). El motor no toca el frontmatter (D-7),
  así que la migración deja esas épicas en `REFINAR`.
- **Documento afectado**: `docs/specs/02-epics/EPIC-00…EPIC-09/epic.md` (frontmatter)
- **Acción requerida**: **Resuelto (2026-10-06):** en esas 10 épicas se reemplazó a mano
  `date: <D>` por `created: <D>` + `updated: <D>` (mismo valor: se conserva la fecha original y no se
  inventa una de modificación). D-7 no cambia: el migrador sigue sin tocar el frontmatter, para que la
  idempotencia siga siendo exacta y no se pierdan claves. Un consumidor con la misma clave heredada
  recibe `REFINAR` del gate, que lista los campos faltantes.

### CR-014
- **Tipo**: ambigüedad (detectada en IMPLEMENT, al migrar el repo, F-4)
- **Descripción**: la primera pasada de la migración reportó 70 `[REVISAR]`: 56 `completada-sin-id`
  (líneas `- [x]` sin ID `STORY-NNN` o con IDs `plan-NN`/`PLAN-NN`, en EPIC-01, 02, 03, 04, 05, 12, 13,
  16, 17, 18 y 20) y 14 `historia-irreconocible` (líneas con ID pero en un formato heredado no
  reconocido, en EPIC-01, 02, 03, 04, 06, 13 y 14). R7 de D-7 las conserva verbatim, pero no casan con
  F1/F2/F3, así que el gate las rechazaría en la sección `historias`.
- **Documento afectado**: las épicas citadas (secciones `historias` y `notas`)
- **Acción requerida**: **Resuelto (2026-10-06):**
  - `completada-sin-id`: se movieron verbatim a una subsección `### Ítems completados sin ID de
    historia` dentro de la sección `notas`. No se inventan IDs ni se pierde el estado `[x]`. En
    EPIC-16/17/18, cuya sección `historias` quedó vacía, se deja una nota en cursiva que remite a esa
    subsección.
  - `historia-irreconocible`: se reescribieron como F3 conservando todo el texto (p. ej.
    `**STORY-007 — x** (luego renombrado…): d` → `- [x] **STORY-007** — x (luego renombrado…): d`; una
    línea con dos IDs conserva el principal y menciona el segundo en el nombre).
  - `--dry-run` final: `cambios pendientes: 0`, exit 0. El migrador no cambia: son casos heredados
    propios de este repo y su resolución manual es la que preveía F-4.

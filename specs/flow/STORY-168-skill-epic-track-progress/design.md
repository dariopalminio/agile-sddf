---
alwaysApply: false
type: design
id: STORY-168
slug: STORY-168-skill-epic-track-progress-design
title: "Design: Skill epic-track-progress"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-168
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-168-skill-epic-track-progress
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
---

<!-- Referencias -->
[[STORY-168-skill-epic-track-progress]] · [[EPIC-23-completar-flujo-de-epic]] · [[STORY-124-validar-preparacion-estructural-epica]]

## Context

`epic-track-progress` es el nodo de la fase `DEVELOP` en `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid` (`epic-track-progress --> dec_dev{all stories done?}`, `dec_dev -->|NO| epic-track-progress`; también recibe la rama `NEEDS-CHANGES` de `epic-validate`). Hoy el nodo no tiene skill: `ls skills/` no lista `epic-track-progress`.

Estado verificado del que parte el diseño:

- **Gate que resuelve:** `domain-epic-lifecycle` §7, invariante 3, y §8, «Gate de completitud de historias» (`DEVELOP → VALIDATE`: todas las historias en `DELIVER`). La épica (`Notas`) amplía «terminada» a `DELIVER/DONE` y `COMPLETED/DONE`, incluidas las archivadas, y deja abierto el trato de `CANCELED/DONE`, que este diseño decide (D-3).
- **Reglas de cruce ya existentes (P3):** `skills/epic-analyze/SKILL.md` fija la resolución de la épica (Paso 1: `specs/flow/<ID>-*/epic.md`, guion obligatorio tras el ID, épicas nunca en `archive/`), el parseo del índice (Paso 3: F2/F3 por el token `**STORY-NNN**`, F1 sin checkbox ni ID) y el inventario de historias (Paso 4: `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md`, pertenencia por prefijo `EPIC-NN` de `parent`, activa antes que archivada). `epic-analyze` no se reutiliza como paso porque escribe `epic-analyze-report.md` (contradice CNF-1); se reutilizan sus **reglas**, citadas en una referencia propia.
- **Archivo de historias:** ADR-0017 y `domain-story-lifecycle` §9: las `COMPLETED` y `CANCELED` con `substatus: DONE` viven en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` conservando su status.
- **Registro de un skill nuevo:** `package.json › files` ya publica `skills/` completo (CS-12 queda cubierto sin editar `package.json`); `scripts/verify-fixed-layout.js` exige el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`; `scripts/verify-eval-inventory.js` exige `evals/evals.json` con casos `TC-NNN`; `docs/guardrails/gr-skill-creation-checklist.md` fija frontmatter (`name`, `description` `>-`, ≤ 500 caracteres), `SKILL.md` < 500 líneas y referencias enlazadas. `epic-track-progress` no emite `verdict` de archivo: no es fila de §4 de `validation-contract-policy` ni entra en `scripts/verify-validation-contract.js`.
- **Tamaño:** el `SKILL.md` más corto del catálogo mide 53 líneas (`story-improve`) y el de `epic-analyze`, 336. La historia exige compacidad (CNF-4, CNF-5).

## Goals / Non-Goals

**Goals:**
- Mostrar una fila por historia hija (ID, status, substatus, ubicación) uniendo el índice de `epic.md` y los `story.md` que declaran la épica como `parent`, en `specs/flow/` y `specs/flow/archive/` // satisface: AC-1, CNF-2
- Responder en una línea de resultado si todas las historias están terminadas y, solo en ese caso, sugerir `/epic-validate EPIC-NN` // satisface: AC-1, AC-2
- Identificar cada historia pendiente o no encontrada con su status y substatus o con `no encontrada` // satisface: AC-2, AC-3
- Ante una épica inexistente, informar la ruta buscada y terminar con error // satisface: AC-4
- No escribir ningún archivo, ni en `.tmp/` // satisface: CNF-1, AC-2
- `SKILL.md` compacto con el detalle de cruce en `references/`, cargado bajo demanda // satisface: CNF-4, CNF-5

**Non-Goals:**
- Cambiar el `status` o `substatus` de la épica o de las historias (fuera de alcance de la historia).
- Validar evidencia operativa, smoke tests o suites (lo hace `/epic-validate`).
- Reportar hallazgos de consistencia del índice (huérfanas, `parent` divergente, F1): eso es `/epic-analyze`; aquí solo cuentan para el semáforo.
- Resolver épicas archivadas: hoy ADR-0017 no las admite en `archive/` (lo cambia STORY-171).

## Decisions

### Componentes

| Componente | Acción | Ubicación | Responsabilidad | AC que satisface |
|---|---|---|---|---|
| Skill `epic-track-progress` | crear | `skills/epic-track-progress/SKILL.md` | Orquestar los pasos y emitir la tabla y el resultado del semáforo en el chat | AC-1, AC-2, AC-3, AC-4, CNF-1, CNF-3 |
| Reglas de cruce | crear | `skills/epic-track-progress/references/story-sources.md` | Detallar resolución de épica, parseo del índice, inventario y pertenencia de historias (reglas tomadas de `epic-analyze` Pasos 1, 3 y 4) | AC-1, AC-3, CNF-2, CNF-4 |
| Evals | crear | `skills/epic-track-progress/evals/evals.json` | Casos `TC-NNN` para AC-1…AC-4 (SMOKE-6 = AC-2) | AC-1…AC-4, CS-12 |
| Mapa de skills | modificar | `docs/domains/domain-skills-map.md` (tabla `## Épica (L2)`) | Fila: momento `DEVELOP`, lee `epic.md` + `story.md`, escribe `—`, cambia estado `—` | CS-16 (trazabilidad documental) |
| Pipeline de comandos | modificar | `docs/guides/sddf-commands-pipeline.md` (tabla de épica) | Fila de `epic-track-progress` | CS-16 |

No se crea `assets/` (no hay reporte ni template), ni `scripts/` (D-1), ni `README.md` (el guardrail lo desaconseja sin contenido humano propio). Los destinos de runtime (`.claude/`, `.codex/`, `.agents/`) son salida de `agile-sddf install`, nunca se editan a mano.

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación | `/epic-track-progress <epica>` con `<epica>` = `EPIC-NN`, nombre de directorio `EPIC-NN-<slug>` o ruta. Sin flags. Sin argumento → pregunta el ID | AC-1…AC-4 |
| Frontmatter de `SKILL.md` | `name: epic-track-progress`; `description: >-` en español, ≤ 350 caracteres, con disparadores «epic-track-progress», «progreso de la épica», «historias terminadas», «semáforo de épica» | CS-12 |
| Resolución de épica | Glob `specs/flow/<EPIC-NN>-*/epic.md`; 0 coincidencias o directorio sin `epic.md` → error (Flujo F4); varias → listar candidatas y error | AC-4 |
| Lectura de `story.md` | Solo frontmatter: `parent`, `status`, `substatus` (escalares). El cuerpo nunca se lee | AC-1, CNF-4 |
| Salida | Solo chat: tabla de historias + línea de resultado (formatos abajo). Ningún archivo | AC-1, AC-2, AC-3, CNF-1 |

### Esquema de datos (modelo interno, no persistido)

**Fila de historia** // satisface: AC-1, AC-2, AC-3

| Campo | Valores | Origen |
|---|---|---|
| `id` | `STORY-NNN` o el nombre de una línea F1 | índice o nombre del directorio |
| `status` / `substatus` | valor literal del frontmatter, o `—` | `story.md` |
| `ubicacion` | `activa` · `archivada` · `no encontrada` · `planificada (sin ID)` | inventario |
| `origen` | `índice` · `parent` · `índice + parent` | cruce |
| `resultado` | `terminada` · `cancelada` · `pendiente` | tabla de clasificación |

**Clasificación del resultado** (D-3) // satisface: AC-1, AC-2, AC-3

| Condición | Resultado | ¿Bloquea `/epic-validate`? |
|---|---|---|
| `DELIVER/DONE` o `COMPLETED/DONE` (activa o archivada) | `terminada` | No |
| `CANCELED/DONE` | `cancelada` | No |
| Cualquier otro par (incluido `DELIVER/IN-PROGRESS`, frontmatter sin `status`/`substatus`) | `pendiente` | Sí |
| ID del índice sin directorio en `specs/flow/` ni `specs/flow/archive/` | `pendiente` con `ubicacion: no encontrada` | Sí |
| Línea F1 (planificada sin ID) | `pendiente` con `ubicacion: planificada (sin ID)` | Sí |

**Resultado global:** `todas terminadas` si hay ≥ 1 fila `terminada` y ninguna `pendiente`; en otro caso, `no todas terminadas`. Una épica sin filas o con todas `cancelada` es `no todas terminadas` (D-4).

**Formato de salida** // satisface: AC-1, AC-2, AC-3

- Encabezado: `Progreso de <EPIC_ID> — <title>` (`title` del frontmatter de `epic.md`; si falta, el nombre del directorio).
- Tabla Markdown `ID │ Status │ Substatus │ Ubicación │ Resultado`, ordenada por `STORY-NNN` y con las F1 al final. Valores leídos de los `story.md` en código en línea (`` `…` ``), como `epic-analyze`, para que un valor con `[[…]]` o `<!-- -->` no altere la salida.
- Línea de resultado, una de:
  - `✅ Todas las historias están terminadas (<n_terminadas> terminadas, <n_canceladas> canceladas). Siguiente paso: /epic-validate <EPIC_ID>`
  - `⏳ No todas las historias están terminadas: <n_pendientes> pendiente(s) — <ID> (<status>/<substatus> | no encontrada | planificada), …`
- Línea final fija: `ℹ️ Solo lectura: no se modificó ningún archivo.`

### Flujos clave

**F1 — Todas terminadas** // satisface: AC-1
1. Resolver `REPO_ROOT` y la épica (`EPIC_DIR`, `EPIC_ID`).
2. Cargar `references/story-sources.md`.
3. Vía A: parsear la sección `## Historias` de `epic.md` (F1/F2/F3).
4. Vía B: inventario de `story.md` activos y archivados; pertenencia por prefijo `EPIC-NN` de `parent`.
5. Unir A ∪ B por ID; leer `status`/`substatus` de cada `story.md` resuelto.
6. Clasificar cada fila y emitir tabla + `✅ … /epic-validate <EPIC_ID>`.

**F2 — Historia pendiente** // satisface: AC-2, SMOKE-6
Pasos 1–5 de F1; al clasificar, la historia `IMPLEMENT/IN-PROGRESS` queda `pendiente` y la línea de resultado es `⏳ …` con su ID y `IMPLEMENT/IN-PROGRESS`. No se sugiere `/epic-validate`. Ningún archivo cambia (la skill no tiene paso de escritura).

**F3 — Historia del índice sin directorio** // satisface: AC-3
En el paso 5, `STORY-200` listada no resuelve en ningún origen → fila `STORY-200 │ — │ — │ no encontrada │ pendiente`; resultado `⏳ …`.

**F4 — Épica inexistente** // satisface: AC-4
En el paso 1, 0 coincidencias → `❌ No se encontró la épica <arg>: no existe specs/flow/<arg>-*/epic.md` y fin sin tabla. Es el mismo mensaje que `epic-analyze` (P5), salvo el `sin escribir`, superfluo en un skill de solo lectura.

### Decisiones técnicas

| # | Decisión | Opción elegida | Alternativas rechazadas | Justificación | AC |
|---|---|---|---|---|---|
| D-1 | Mecanismo de cálculo | Instrucciones Markdown en `SKILL.md` ejecutadas por el agente con Glob/Grep sobre el frontmatter | (a) Motor Node `scripts/epic-track-progress.js` como `story-complete`; (b) invocar `/epic-analyze` y leer su reporte | (a) `story-complete` usa motor porque su operación (mover y escribir) es irreversible; aquí no hay escritura y el cálculo es un cruce de tres campos: un motor añadiría código, pruebas unitarias y resolución de ruta en runtimes instalados sin necesidad actual (P12). (b) `epic-analyze` escribe `epic-analyze-report.md`: viola CNF-1 | CNF-1, CNF-4, CNF-5 |
| D-2 | Fuente de las reglas de cruce | Copiar a `references/story-sources.md` las reglas de los Pasos 1, 3 y 4 de `epic-analyze`, con su origen citado | (a) Referenciar `skills/epic-analyze/SKILL.md` desde la nueva skill; (b) redactar reglas propias | (a) Cargar 336 líneas de otra skill viola CNF-4 y crea una ruta entre skills que no se resuelve con `--target` parciales. (b) Divergiría de `epic-analyze`: la misma épica tendría historias distintas según el skill | CNF-2, CNF-4 |
| D-3 | Trato de `CANCELED/DONE` | Fila con resultado `cancelada`, que **no** bloquea | (a) Contarla como `pendiente`; (b) omitirla de la tabla | (a) Una historia cancelada nunca llegará a `DELIVER`: el gate quedaría bloqueado para siempre. (b) La historia pide «ver el status … de cada historia hija»: ocultarla falsea la tabla. Ver CR-001 | AC-1, AC-2 |
| D-4 | Épica sin historias o solo canceladas | `no todas terminadas` | `todas terminadas` (verdad vacía) | Un gate que aprueba una épica sin entregas manda a `/epic-validate` algo que no entregó valor | AC-1 |
| D-5 | Líneas F1 e historias no encontradas | Filas `pendiente` | Ignorarlas (solo cuentan los `story.md` existentes) | AC-3 lo exige para IDs sin directorio; una F1 es una historia planificada aún no creada, así que la épica tampoco está terminada | AC-3 |
| D-6 | Historias huérfanas (declaran `parent` sin estar en el índice) | Se incluyen con `origen: parent` | Excluirlas por no figurar en el índice | CNF-2 pide unir ambas fuentes; una huérfana sin entregar sigue siendo trabajo pendiente de la épica | CNF-2 |
| D-7 | Canal de salida | Solo chat | Escribir `epic-track-progress-report.md` | CNF-1 prohíbe escribir cualquier archivo | CNF-1 |
| D-8 | Contenido untrusted | Se extraen solo escalares del frontmatter y líneas `- ` del índice; texto con apariencia de orden no se sigue | Leer el cuerpo de los `story.md` | Misma regla que `epic-analyze` (`gr-ai-security-checklist`); el cuerpo no aporta nada al semáforo | AC-1, CNF-4 |

### Decisiones de complejidad justificada

- **Una referencia (`references/story-sources.md`) en vez de todo en `SKILL.md`:** las reglas de cruce (formas F1/F2/F3, patrones de glob con guion obligatorio, prioridad activa/archivada, pertenencia por prefijo) suman el grueso del detalle; separarlas deja el `SKILL.md` como flujo corto y cumple CNF-4. No se crea una segunda referencia: el formato de salida cabe en el `SKILL.md`.
- **Sin flags (`--verbose`, `--json`):** ningún AC los pide (YAGNI). Si `epic-validate` necesitara consumir el semáforo de forma estructurada, sería otra historia.
- **Columna `Resultado` además de `Status/Substatus`:** sin ella el usuario tendría que aplicar la tabla de clasificación a mano para encontrar la pendiente (AC-2).

### Puntos de variación (P6)

- **Épicas archivadas:** cuando STORY-171 admita épicas en `specs/flow/archive/`, solo cambia la resolución de épica en `references/story-sources.md`.
- **Definición de «terminada»:** si `domain-epic-lifecycle` cambia la invariante 3, solo cambia la tabla de clasificación del `SKILL.md`.
- **Reglas de cruce de `epic-analyze`:** si cambian, `references/story-sources.md` debe actualizarse; lo señala su cita de origen (ver Risks).

### Degradación gradual (P7)

| Fallo | Comportamiento |
|---|---|
| `specs/flow/archive/` no existe | Se omite ese origen sin nota |
| `story.md` con frontmatter ilegible | Fila con `status`/`substatus` = `—`, resultado `pendiente` y nota `<ruta>: frontmatter ilegible`; nunca se aborta |
| Sección `## Historias` ausente en `epic.md` | Se continúa solo con la Vía B y se añade la nota `epic.md sin sección de historias → /epic-format-validation <EPIC_ID>` |
| ID presente en activa y archivada | Se usa la activa; se anota la duplicada |

### Contratos de verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| 1 | Tabla con una fila por historia (2 activas `DELIVER/DONE` + 1 archivada `COMPLETED/DONE`), resultado `✅` y `/epic-validate EPIC-NN` | Eval TC-001 | AC-1 |
| 2 | Con una `IMPLEMENT/IN-PROGRESS`, resultado `⏳` con su ID y estado, sin `/epic-validate`, y la salida declara solo lectura | Eval TC-002 (= SMOKE-6) | AC-2 |
| 3 | `STORY-200` listada sin directorio aparece `no encontrada` y el resultado es `⏳` | Eval TC-003 | AC-3 |
| 4 | `EPIC-77` inexistente → `❌ … specs/flow/EPIC-77-*/epic.md`, sin tabla | Eval TC-004 | AC-4 |
| 5 | `CANCELED/DONE` aparece como `cancelada` y no bloquea | Eval TC-005 | AC-1 (D-3) |
| 6 | `SKILL.md` declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y no menciona `SDDF_ROOT` ni `SPECS_BASE` | `node scripts/verify-fixed-layout.js` | CNF-3 |
| 7 | El skill no contiene ninguna instrucción de escritura | Revisión del `SKILL.md` + aserción `not_contains` de escritura en los evals | CNF-1 |
| 8 | `SKILL.md` < 500 líneas (objetivo ≤ 150) y `description` ≤ 350 caracteres | `wc -l` + `gr-skill-creation-checklist` | CNF-5 |
| 9 | `evals/evals.json` válido e inventariado | `npm run verify:repository` | CS-12 |
| 10 | `npm run verify:repository` y `npm test` pasan | Ejecución local | CS-21 |

### Autoevaluación (P9, P10, P11)

- **Cobertura:** AC-1 (F1, D-3, D-4), AC-2 (F2), AC-3 (F3, D-5), AC-4 (F4); CNF-1 (D-1, D-7), CNF-2 (D-2, D-6), CNF-3 (Contrato 6), CNF-4/CNF-5 (D-1, D-2, Contrato 8). Sin omisiones.
- **Ambigüedad:** el trato de `CANCELED/DONE`, abierto en la historia, se decide en D-3 y se retroalimenta con CR-001.
- **Nombres:** «terminada», «pendiente», «cancelada», «no encontrada» se usan de forma única en tabla, resultado y evals.
- **Estructura:** sin ciclos (`SKILL.md → references/story-sources.md`, nunca al revés); cada componente tiene una sola razón de cambio (flujo y salida · reglas de cruce · pruebas).

## Risks / Trade-offs

- [Las reglas copiadas de `epic-analyze` divergen con el tiempo] → `references/story-sources.md` cita su origen (`skills/epic-analyze/SKILL.md`, Pasos 1, 3 y 4) y los evals fijan los casos de borde (prefijo `EPIC-300` vs `EPIC-30`, activa vs archivada).
- [Sin motor determinista, el agente podría clasificar mal en épicas grandes] → la tabla de clasificación es cerrada (cinco filas) y los evals cubren cada resultado; si aparece un error recurrente, D-1 se revisa con un motor como el de `story-complete`.
- [D-3 deja pasar a `VALIDATE` una épica cuyas historias restantes están todas canceladas salvo una] → es el comportamiento buscado; D-4 impide el caso degenerado de cero entregas.

## Open Questions

Ninguna: las decisiones abiertas se resuelven en D-1…D-8; la que afecta a la historia se registra como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: `story.md` (Notas) y `epic.md` (Notas) dejan «el tratamiento de las `CANCELED/DONE`» para el refinamiento de STORY-168, pero los AC no lo fijan. El diseño decide (D-3) mostrarlas como `cancelada` sin bloquear el gate.
- **Documento afectado**: story.md (y la nota «Historia terminada» de `epic.md`)
- **Acción requerida**: reemplazar en `story.md` la frase «se decide al refinar esta historia» por la decisión D-3 y, opcionalmente, agregar un AC o un caso de eval para `CANCELED/DONE`. Actualizar la nota de `epic.md` de la misma forma. `domain-epic-lifecycle` §7 invariante 3 sigue diciendo «todas en `DELIVER`»: aclarar en esa historia o en STORY-171 (que ya ajusta los documentos de dominio) que las canceladas no cuentan.

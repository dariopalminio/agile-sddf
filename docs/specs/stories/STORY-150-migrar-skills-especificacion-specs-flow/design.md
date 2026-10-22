---
alwaysApply: false
type: design
id: STORY-150
slug: STORY-150-migrar-skills-especificacion-specs-flow-design
title: "Design: Migrar los skills de especificación a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-150
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-150-migrar-skills-especificacion-specs-flow]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra los seis skills de la fase de especificación al layout fijo de ADR-0016 (STORY-147): dejan de resolver una raíz configurable y leen/escriben en rutas fijas relativas a `REPO_ROOT` (`specs/flow/STORY-NNN-<slug>/`, `docs/templates/`, `docs/guardrails/`). Adoptan el contrato verificable que define STORY-148 (marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, reglas R1–R4 de `scripts/verify-fixed-layout.js`).

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `skills/story-creation/` | `SKILL.md`: bloque `SDDF-ROOT-RESOLUTION: v1` (l. 95–102); template `$SPECS_BASE/templates/story-template.md` con seed `assets/story-template.md`; búsqueda por término en `$SPECS_BASE/specs/stories/`; cálculo del siguiente `NNN` con Glob `$SPECS_BASE/specs/stories/STORY-*/story.md` y fallback Bash/PowerShell (l. 222–231); ruta de salida `$SPECS_BASE/specs/stories/STORY-{NNN}-{slug}/story.md`. `README.md:15` repite la ruta. `evals/evals.json` (3 casos) sin rutas legadas. |
| `skills/story-evaluation/` | `SKILL.md`: bloque v1 (l. 86–93); template `$SPECS_BASE/templates/story-template.md` obligatorio (error l. 338); resolución por ID solo en el Paso 6 (guardar reporte). **No declara error de «historia no encontrada»** (AC-2). `evals/evals.json` (8 casos): TC-001/TC-002 citan `docs/specs/stories/…` y `$SPECS_BASE/templates/`. |
| `skills/story-refine/` | `SKILL.md`: bloque v1 (l. 100–107); entradas, precondición, error de no encontrada (l. 132), búsqueda de hermanas por `parent:`/`related:` (l. 213) y tabla de salida (l. 342–344) bajo `$SPECS_BASE/specs/stories/`. `evals/evals.json` TC-003 cita `docs/specs/stories/STORY-099-test/`. |
| `skills/story-improve/` | Alias deprecado. `SKILL.md`: Paso 0 con bloque v1 abreviado (`SDDF_ROOT`, `root`, `SPECS_BASE`). Sin rutas de work items propias: delega en `/story-refine`. `evals/evals.json` (2 casos) sin rutas legadas. |
| `skills/story-split/` | `SKILL.md`: bloque v1 (l. 108–115); 20+ referencias a `$SPECS_BASE/templates/` y `$SPECS_BASE/specs/stories/` (búsqueda, numeración l. 364–370, salida l. 391–449). `examples/output/split-result.md`: 6 rutas `docs/specs/stories/…`. `evals/evals.json` (3 casos) sin rutas legadas. |
| `skills/story-specify/` | `SKILL.md`: bloque v1 (l. 122–129) más un mensaje de «raíz explícita inválida» (l. 133–135); backlog, salida y error «directorio no existe» bajo `$SPECS_BASE/specs/stories/`; DoD `$SPECS_BASE/guardrails/dod-story-specify.md` (l. 80–87). `assets/agents/product-owner.md:36` cita `$SPECS_BASE/specs/stories/`. `README.md:24–25` cita `SDDF_ROOT` y `$SPECS_BASE`. `evals/evals.json` (9 casos): TC-001 espera `specs/stories/`; TC-002 y TC-008 citan `docs/specs/stories/…`; **TC-003 prueba la raíz explícita `SDDF_ROOT` inválida**, comportamiento que desaparece. |
| `test/dod-story.test.js` E2E-002 | Exige que la sección `## DoD aplicable` de nueve skills (entre ellos `story-specify`) contenga literalmente `$SPECS_BASE/guardrails/<slug>.md`. Migrar `story-specify` rompería `npm test`. Los nueve skills ya contienen además `docs/guardrails/<slug>.md` («en este repositorio, …»). Ver CR-002. |
| `skills/memory-system/scripts/dod-story.js` | Comprueba solo que la sección DoD exista y cite el slug (l. 361–362): no depende de `$SPECS_BASE`. |
| `scripts/verify-fixed-layout.js` (STORY-148) | **Aún no existe** (STORY-148 en `PLAN`). Su diseño fija el bloque canónico, R1–R4 y la constante `PENDING_MIGRATION` con los 36 skills, de la que cada historia de migración retira los suyos. |
| Copias de runtime | `.claude/` está en `.gitignore`: las copias instaladas no se versionan y siguen con el contrato v1 hasta reinstalar (`agile-sddf install`). |
| `specs/` | No existe en el repo. Los work items siguen en `docs/specs/` hasta STORY-153. |

Stakeholders: el practitioner que especifica historias en un repo recién inicializado (AC-1), el mantenedor que ejecuta las historias hermanas (STORY-155, STORY-156, STORY-158) con el mismo patrón, y STORY-157, que verifica la lista transitoria vacía.

## Goals / Non-Goals

**Goals:**
- Sustituir el Paso 0 de los seis `SKILL.md` por el bloque canónico del contrato de layout fijo // satisface: AC-1, AC-3, CNF-2
- Reescribir toda ruta `$SPECS_BASE/…` y `docs/specs/stories/…` de los seis skills (SKILL.md, README.md, `assets/`, `assets/agents/`, `examples/`, `evals/`) a rutas fijas relativas a `REPO_ROOT` // satisface: AC-1, AC-3, CNF-1
- Resolver una historia por ID o término solo en `specs/flow/STORY-*/`, sin fallback a `docs/specs/`, con un mensaje de «no encontrada» que nombre `specs/flow/` // satisface: AC-2
- Numerar historias nuevas sin colisionar con las archivadas en `specs/flow/archive/` // satisface: AC-1 (CR-001)
- Retirar los seis skills de `PENDING_MIGRATION` para que el gate los valide con R1–R4 // satisface: AC-3, CNF-2
- Actualizar los evals afectados a `specs/flow/` y reemplazar el caso de raíz inválida // satisface: CNF-1, AC-1, AC-2
- Mantener `npm test` verde ajustando la aserción de E2E-002 a la ruta fija // satisface: AC-3 (CR-002)

**Non-Goals:**
- Skills de planning (STORY-155), implementación (STORY-156), revisión/verificación/aceptación (STORY-158), épica (STORY-151) y transversales (STORY-152)
- Buscar historias por ID o término en `specs/flow/archive/` (solo se consulta para numerar; ver D-4)
- Mover work items de `docs/specs/` a `specs/flow/` (STORY-153) ni crear `specs/flow/` en este repo
- Crear `scripts/verify-fixed-layout.js` o cambiar sus reglas (STORY-148)
- Reinstalar las copias de runtime (`.claude/skills/`, etc.)
- Ejecutar `npm run test:eval` (a criterio humano, CNF-1)
- Editar ADRs, `CHANGELOG.md` o guías de `docs/` (STORY-154)

## Decisions

### D-1 — Paso 0 con el bloque canónico del contrato // satisface: AC-1, AC-3, CNF-2

En los seis `skills/<skill>/SKILL.md` el bloque desde `<!-- SDDF-ROOT-RESOLUTION: v1 -->` hasta el siguiente encabezado se sustituye por el texto canónico de STORY-148 (D-1), conservando el encabezado y número de paso de cada skill:

| Skill | Encabezado que se conserva | Además se elimina | Se conserva |
|---|---|---|---|
| `story-creation` | `### Paso 0 — Resolver contexto local` | pasos 1–4 de precedencia, `CLI_ROOT` | línea «El diagnóstico de entorno se solicita explícitamente con `/skill-preflight` …» |
| `story-evaluation` | ídem | ídem | ídem |
| `story-refine` | ídem | ídem | ídem |
| `story-split` | ídem | ídem | ídem |
| `story-specify` | `### Paso 0 — Resolver contexto local` | pasos 1–4 **y** el mensaje «✗ Entorno inválido: raíz explícita …» (l. 133–135) | verificación del rol local `assets/agents/product-owner.md` y su mensaje `❌ Rol local no encontrado …`; la frase introductoria cambia de «Con `SPECS_BASE` resuelto, …» a «Con `REPO_ROOT` resuelto, …» |
| `story-improve` | `## Paso 0 — Resolver contexto local` | párrafo «Antes de delegar, resuelve … `SPECS_BASE`» y pasos 1–4 | línea sobre `/skill-preflight` |

Texto del bloque (idéntico en los seis, del marcador al siguiente encabezado):

```markdown
<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

Con esto cada skill cumple R1 (marcador), R2 (los cuatro tokens dentro del bloque), R3 (sin `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE`, `SDDF_ROOT`) y R4 (ninguna línea combina `root` y `sddf.config.yaml`).

**Alternativas rechazadas:**
- **Mantener el bloque v1 y solo cambiar las rutas de salida:** el skill seguiría honrando `SDDF_ROOT`/`root` (contradice ADR-0016 y CS-2/CS-3) y el gate de STORY-148 fallaría por R3.
- **Bloque propio por skill con redacción distinta:** R2 lo admitiría, pero seis variantes dificultan la revisión y la copia en STORY-155/156/158; el texto canónico es un único punto de cambio (P5).
- **Conservar en `story-specify` un error de «entorno inválido» genérico:** sin raíz configurable no queda ninguna fuente explícita que pueda ser inválida; un mensaje sin causa posible es código muerto (P12).

### D-2 — Mapa de sustitución de rutas // satisface: AC-1, AC-3, CNF-1

Regla única aplicada a todos los archivos de los seis skills (`SKILL.md`, `README.md`, `assets/**`, `examples/**`, `evals/evals.json`). Las rutas se escriben relativas a `REPO_ROOT`, sin prefijo de variable:

| Forma legada | Forma fija | Dónde aparece |
|---|---|---|
| `$SPECS_BASE/specs/stories/STORY-{NNN}-{slug}/…` | `specs/flow/STORY-{NNN}-{slug}/…` | salidas de creation, split, refine, specify |
| `$SPECS_BASE/specs/stories/<STORY-NNN>-*/…` | `specs/flow/<STORY-NNN>-*/…` | entradas de refine, evaluation |
| `$SPECS_BASE/specs/stories/` (directorio, búsquedas, backlog) | `specs/flow/` con patrón `specs/flow/STORY-*/story.md` | creation, split, refine, specify, product-owner |
| `$SPECS_BASE/specs/` (story-evaluation l. 30) | `specs/flow/` | evaluation |
| `$SPECS_BASE/templates/…` | `docs/templates/…` | creation, evaluation, split |
| `$SPECS_BASE/guardrails/…` | `docs/guardrails/…` | specify (DoD) |
| `docs/specs/stories/STORY-…` (ejemplos, contextos de evals) | `specs/flow/STORY-…` | split `examples/output/split-result.md`, evals de evaluation, refine, specify |
| `specs/stories/` (expected de evals, notas sobre Glob) | `specs/flow/` | specify TC-001, creation l. 222, split l. 364 |
| `SDDF_ROOT` en `README.md` de specify (l. 24) | fila eliminada o reformulada sin la variable («Layout fijo: `specs/flow/` accesible») | specify |

Ajustes de redacción derivados:
- **Sección DoD de `story-specify`:** `Archivo` pasa a `docs/guardrails/dod-story-specify.md` (se elimina el paréntesis «en este repositorio, …», ahora redundante); `Override` se conserva (`sddf.config.yaml › guardrails.dod.story.specify` → `docs/guardrails/<slug>.md`): la clave `guardrails` sigue vigente y no incumple R4.
- **Mensajes de template ausente:** «Ejecuta `sddf-init` para centralizarlo en `docs/templates/`» y `❌ No se encontró el template requerido en docs/templates/story-template.md …`.
- **Fallback de numeración en Bash/PowerShell** (creation l. 230–231, split l. 370): `ls specs/flow/ …` y `Get-ChildItem specs/flow -Directory …`, más el equivalente sobre `specs/flow/archive/` (D-4).
- **Ejemplos con `parent:`:** se conservan los IDs de épica; donde se cite la ruta de una épica se usa `specs/flow/EPIC-NN-<slug>/epic.md`.

**Alternativas rechazadas:**
- **Introducir una variable nueva (`FLOW_DIR`) en lugar de literales:** reintroduce la indirección que ADR-0016 retira; el contrato R2 exige los literales.
- **Rutas absolutas `<REPO_ROOT>/specs/flow/…` en todo el texto:** el bloque ya declara que las rutas son relativas a `REPO_ROOT`; repetirlo añade ruido en ~60 líneas sin aportar precisión.
- **Dejar los ejemplos y evals con `docs/specs/`:** no rompen R3 (el gate solo lee `SKILL.md`), pero CNF-1 exige evals con `specs/flow/` y AC-3 hace grep sobre el skill completo; ejemplos obsoletos inducirían al LLM a escribir en la ruta legada.

### D-3 — Resolución de una historia existente // satisface: AC-2

Contrato común para los skills que aceptan un ID o término (`story-creation` Tipo C, `story-evaluation`, `story-refine`, `story-split` Tipo C, `story-specify` backlog):

| Entrada | Búsqueda | Resultado si no hay coincidencia |
|---|---|---|
| ID `STORY-NNN` | Glob `specs/flow/STORY-NNN-*/story.md` (primera coincidencia) | `❌ No se encontró la historia STORY-NNN en specs/flow/` y detener sin escribir |
| Término | nombres de directorio bajo `specs/flow/STORY-*/` que contengan el término (sin distinguir mayúsculas) | mismo patrón de mensaje con el término |
| Backlog (`story-specify`) | `specs/flow/STORY-*/story.md` con `status: SPECIFY` / `substatus: IN-PROGRESS` | sin backlog → Caso A |

- **Nunca** se consulta `docs/specs/` (ni como fallback ni para avisar) ni `specs/flow/archive/` para estas búsquedas (Non-Goal de la historia).
- `story-evaluation` añade la resolución por ID al **Paso 1 de entrada** (hoy solo existe en el Paso 6) y una fila en `### Manejo de errores`: `Historia no encontrada | ❌ No se encontró la historia STORY-NNN en specs/flow/ | Detener sin generar reporte`. El Paso 6 reutiliza el directorio ya resuelto.
- `story-refine` y `story-split` cambian su mensaje actual (`… bajo $SPECS_BASE/specs/stories/`) al mismo texto.
- La búsqueda de historias hermanas de `story-refine` (l. 213, mismo `parent:` o IDs en `related:`) se limita a `specs/flow/STORY-*/story.md`.

**Alternativas rechazadas:**
- **Fallback a `docs/specs/stories/` con aviso de deprecación:** AC-2 lo prohíbe explícitamente («no busca ni crea nada en `docs/specs/`»); el diagnóstico del layout legado es responsabilidad de `skill-preflight` (STORY-152) y `/sddf-init` (STORY-149).
- **Mensaje genérico «historia no encontrada» sin ruta:** AC-2 exige informar que no existe «en `specs/flow/`»; nombrar la ruta orienta al usuario de un repo sin migrar.
- **Incluir `specs/flow/archive/` en la resolución:** las historias archivadas están cerradas (Non-Goal); reabrirlas es una decisión de la épica de Workflow.

### D-4 — Numeración de historias nuevas // satisface: AC-1 (CR-001)

`story-creation` (Paso de cálculo del NNN) y `story-split` (historias adicionales) calculan el siguiente número como `max + 1` sobre la **unión** de:
1. `specs/flow/STORY-*/story.md` → NNN del directorio padre `STORY-NNN-<slug>`
2. `specs/flow/archive/*-STORY-*/story.md` → NNN del directorio `<YYYY-MM-DD>-STORY-NNN-<slug>` (ADR-0016)

Sin coincidencias en ninguna → `STORY-001` (AC-1). El formato de tres dígitos con ceros y la nota sobre Glob con patrón de archivo (no de directorio) se conservan.

**Alternativas rechazadas:**
- **Contar solo `specs/flow/STORY-*`:** tras STORY-153, si las historias de mayor número están archivadas, se reutilizaría un ID ya emitido (colisión de trazabilidad, ADR-0004).
- **Contador persistente (`.counters.json`, `next-id`):** fuera de alcance por la épica (épica de Workflow).

### D-5 — Directorio de salida inexistente // satisface: AC-1

`story-specify` y `story-creation` crean `specs/flow/` (y el directorio `STORY-NNN-<slug>/`) si no existe; nunca crean `docs/specs/`. En `story-specify` la fila de errores `$SPECS_BASE/specs/stories/ no existe | — | Crear el directorio y continuar` pasa a `specs/flow/ no existe | — | Crear el directorio y continuar`. No se crea `specs/flow/archive/` (lo hace `/sddf-init`, STORY-149): su ausencia solo significa «sin archivadas» en D-4.

**Alternativas rechazadas:**
- **Exigir `specs/flow/` (fallar si falta):** un repo inicializado con la versión anterior de `/sddf-init` no podría especificar nada aunque no tenga work items; crear un directorio vacío es inocuo y era el comportamiento previo.
- **Crear también `archive/`, `living/`, `workflow/`:** duplica la responsabilidad de `/sddf-init` (P11).

### D-6 — Retiro de la lista transitoria del gate // satisface: AC-3, CNF-2

En `scripts/verify-fixed-layout.js` (creado por STORY-148) se retiran de `PENDING_MIGRATION` las seis entradas `story-creation`, `story-evaluation`, `story-improve`, `story-refine`, `story-specify` y `story-split`, en el mismo cambio que migra los skills (STORY-148 F-4). La lista conserva el orden alfabético.

Efecto: `verify:repository` pasa a aplicar R1–R4 a los seis skills; si alguno conserva una referencia legada, el gate falla con skill y línea; si alguno se dejara en la lista ya migrado, falla con `ya cumple el contrato — retíralo de la lista`.

**Alternativas rechazadas:**
- **Retirarlos en una historia posterior:** el gate no validaría la migración (AC-3 exige gate verde **con** los skills migrados) y fallaría por la regla de higiene de STORY-148 D-4.

### D-7 — Aserción de E2E-002 sobre la ruta fija del DoD // satisface: AC-3 (CR-002)

En `test/dod-story.test.js` (E2E-002) cambian dos expresiones; el resto de la prueba no cambia:

| Elemento | Antes | Después |
|---|---|---|
| `expectedPath` | `` `$SPECS_BASE/guardrails/${slug}.md` `` | `` `docs/guardrails/${slug}.md` `` |
| Patrón de `referencedSlugs` | `\$SPECS_BASE\/guardrails\/(dod-story-[a-z-]+)\.md` | `guardrails\/(dod-story-[a-z-]+)\.md` |

Los nueve skills ya contienen `docs/guardrails/<slug>.md` en su sección DoD (migrados o no), y el patrón sin prefijo captura ambas formas: la prueba sigue verde durante toda la transición y sigue garantizando «solo el DoD de su etapa». El mensaje de la aserción cambia a `debe referenciar docs/guardrails/<slug>.md`.

**Alternativas rechazadas:**
- **Excluir `story-specify` de la prueba:** pierde la verificación de su DoD.
- **Aceptar las dos formas con un mapa por skill (migrado / pendiente):** duplica la lista transitoria de STORY-148 en una prueba; la forma `docs/guardrails/` ya es común a todos.

### D-8 — Evals // satisface: CNF-1, AC-1, AC-2

| Skill | Caso | Cambio |
|---|---|---|
| `story-specify` | TC-001 | `expected.contains`: `specs/stories/` → `specs/flow/`; añadir `not_contains: "docs/specs"` (AC-1) |
| `story-specify` | TC-002, TC-008 | contextos `docs/specs/stories/…` → `specs/flow/…`; descripción de TC-002 sin `$SPECS_BASE` |
| `story-specify` | TC-003 `raiz-explicita-invalida-detiene-ejecucion` | **reemplazar** por `layout-fijo-repo-limpio-escribe-en-specs-flow` (mismo id): repo limpio inicializado con `/sddf-init`, historia nueva → `contains: ["specs/flow/STORY-001-", "story.md"]`, `not_contains: ["docs/specs"]` (AC-1). La raíz configurable ya no existe; mantener el caso sería probar un comportamiento retirado |
| `story-evaluation` | TC-001, TC-002 | contextos y descripción a `specs/flow/…` y `docs/templates/` |
| `story-evaluation` | TC-009 nuevo `historia-inexistente-en-specs-flow` | input `STORY-999`, sin `specs/flow/STORY-999-*/` → `contains: ["No se encontró la historia STORY-999", "specs/flow/"]`, `not_contains: ["docs/specs", "finvest-evaluation-report.md guardado"]` (AC-2) |
| `story-refine` | TC-003 | contexto `docs/specs/stories/STORY-099-test/` → `specs/flow/STORY-099-test/` |
| `story-creation`, `story-split`, `story-improve` | — | sin cambios (no citan rutas legadas) |

Los evals no se ejecutan en esta historia (CNF-1); su JSON debe seguir siendo válido para `npm run test:eval -- <skill> --dry-run` y `verify:repository`.

**Alternativas rechazadas:**
- **Eliminar TC-003 de `story-specify` sin reemplazo:** deja AC-1 (escritura en `specs/flow/` sin `docs/specs/`) sin un caso que lo afirme por negación.
- **Probar AC-2 en `story-refine` en lugar de `story-evaluation`:** AC-2 nombra `/story-evaluation STORY-999`.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill de creación | modificar (Paso 0, rutas, numeración) | `skills/story-creation/SKILL.md`, `README.md` | AC-1, AC-3, CNF-2 |
| Skill de evaluación FINVEST | modificar (Paso 0, rutas, resolución por ID y error) | `skills/story-evaluation/SKILL.md` | AC-2, AC-3, CNF-2 |
| Evals de evaluación | modificar TC-001/TC-002, añadir TC-009 | `skills/story-evaluation/evals/evals.json` | AC-2, CNF-1 |
| Skill de refinamiento | modificar (Paso 0, rutas, mensaje) | `skills/story-refine/SKILL.md` | AC-3, CNF-2 |
| Evals de refinamiento | modificar TC-003 | `skills/story-refine/evals/evals.json` | CNF-1 |
| Alias deprecado | modificar (Paso 0) | `skills/story-improve/SKILL.md` | AC-3, CNF-2 |
| Skill de split | modificar (Paso 0, rutas, numeración) | `skills/story-split/SKILL.md` | AC-3, CNF-2 |
| Ejemplo de split | modificar (6 rutas) | `skills/story-split/examples/output/split-result.md` | AC-3 |
| Orquestador de especificación | modificar (Paso 0, rutas, DoD, error de directorio) | `skills/story-specify/SKILL.md`, `README.md` | AC-1, AC-3, CNF-2 |
| Rol local Product Owner | modificar (1 ruta) | `skills/story-specify/assets/agents/product-owner.md` | AC-3 |
| Evals de especificación | modificar TC-001/002/008, reemplazar TC-003 | `skills/story-specify/evals/evals.json` | AC-1, CNF-1 |
| Lista transitoria del gate | modificar (retirar 6 entradas) | `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | AC-3, CNF-2 |
| Prueba E2E-002 del DoD | modificar (2 expresiones) | `test/dod-story.test.js` | AC-3 |

No se modifican `assets/story-template.md`, `assets/evaluation-output-template.md`, `assets/refinement-log-template.md`, `examples/` de evaluation/refine ni `examples/input/` de split (verificados sin rutas legadas). No se crea ningún archivo.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Paso 0 de cada skill | bloque de D-1 entre el marcador y el siguiente encabezado | AC-3, CNF-2 |
| Directorio de una historia | `specs/flow/STORY-NNN-<slug>/` relativo a `REPO_ROOT` | AC-1 |
| Resolución por ID | `specs/flow/STORY-NNN-*/story.md`; fallo → `❌ No se encontró la historia STORY-NNN en specs/flow/` | AC-2 |
| Siguiente NNN | `max(NNN en specs/flow/STORY-*/ ∪ specs/flow/archive/*-STORY-*/) + 1`; vacío → `001` | AC-1 |
| Template de historia | `docs/templates/story-template.md`; seed `skills/story-creation/assets/story-template.md` con aviso | AC-1 |
| DoD de especificación | `docs/guardrails/dod-story-specify.md` (override `sddf.config.yaml › guardrails.dod.story.specify`) | AC-1 |
| Gate | `npm run verify:repository` aplica R1–R4 de STORY-148 a los seis skills | AC-3 |

## Esquema de datos

N/A — no cambia ningún frontmatter ni formato de artefacto; solo la ubicación (`specs/flow/STORY-NNN-<slug>/story.md`, `finvest-evaluation-report.md`, `story.md.bak`, `story-refinement-log.md`). El esquema de los casos de `evals.json` se conserva (`id`, `name`, `type`, `description`, `input`, `expected.contains`/`not_contains`, `threshold`).

## Flujos clave

### F-1 — `/story-specify` en un repo limpio // AC-1
1. Paso 0: resuelve `REPO_ROOT`; verifica el rol local `product-owner.md`.
2. Paso 1: busca backlog en `specs/flow/STORY-*/story.md` → vacío → Caso A.
3. `story-creation` lee `docs/templates/story-template.md`, numera con D-4 (sin coincidencias → `001`) y escribe `specs/flow/STORY-001-<slug>/story.md`, creando `specs/flow/` si falta (D-5).
4. `story-evaluation` resuelve el directorio por ID en `specs/flow/` y escribe ahí `finvest-evaluation-report.md`.
5. Ningún paso referencia ni crea `docs/specs/`.

### F-2 — `/story-evaluation STORY-999` sin historia // AC-2
1. Paso 0 → `REPO_ROOT`.
2. Paso 1: Glob `specs/flow/STORY-999-*/story.md` → vacío.
3. Emite `❌ No se encontró la historia STORY-999 en specs/flow/` y se detiene: no consulta `docs/specs/`, no crea directorio ni reporte.

### F-3 — Gate tras la migración // AC-3
1. `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/story-{creation,evaluation,refine,improve,split,specify}` → sin coincidencias.
2. `npm run verify:repository`: el paso `contrato de layout fijo` valida R1–R4 en los seis skills (fuera de `PENDING_MIGRATION`) → `[OK]`; `npm test` incluye E2E-002 con la aserción de D-7 → verde.

### F-4 — Degradación // P7
- `docs/templates/story-template.md` ausente: creation y split usan el seed con aviso (comportamiento actual); evaluation se detiene con el error de template (comportamiento actual, ruta nueva).
- `docs/guardrails/dod-story-specify.md` ausente: aviso y `SPECIFY/DONE` sin validación DoD (comportamiento actual).
- Repo con layout legado sin migrar (`docs/specs/` presente, sin `specs/flow/`): las búsquedas por ID fallan con el mensaje de D-3 y una historia nueva se crea en `specs/flow/`; la detección y el aviso de migración pertenecen a `skill-preflight` y `/sddf-init`. Ver Riesgos.

### F-5 — Puntos de cambio // P6
- **Contrato v2 o nuevas rutas** (p. ej. `specs/living/`): se cambia el texto canónico del bloque en los seis skills y las constantes de STORY-148.
- **Contador de IDs de la épica de Workflow:** sustituye la regla de D-4 en `story-creation` y `story-split` sin afectar la resolución de D-3.

## Decisiones de complejidad justificada

- **Unión con `archive/` en la numeración (D-4):** la solución simple (solo `specs/flow/STORY-*`) reutilizaría IDs tras STORY-153; es un segundo patrón Glob, no un mecanismo nuevo.
- **Resolución por ID en el Paso 1 de `story-evaluation` (D-3):** hoy el skill solo resuelve el directorio al guardar; sin moverlo al inicio, AC-2 no puede detener la ejecución antes de evaluar.
- **Cambio de `test/dod-story.test.js` (D-7):** la prueba fija una ruta legada; el cambio mínimo usa una forma que los nueve skills ya cumplen y evita introducir lógica de transición en la prueba.
- No se añade ningún archivo, script, variable ni fallback: la historia es una sustitución textual guiada por el contrato de STORY-148.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin referencias legadas en los seis skills | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/story-creation skills/story-evaluation skills/story-refine skills/story-improve skills/story-split skills/story-specify` → sin salida (exit 1) | AC-3 |
| 2 | Sin rutas `docs/specs` ni `specs/stories` | `grep -rnE "docs/specs\|specs/stories" <mismos dirs>` → sin salida | AC-1, AC-2, CNF-1 |
| 3 | Contrato declarado en los seis | `grep -c "<!-- SDDF-FIXED-LAYOUT: v1 -->"` = 1 en cada `SKILL.md` | CNF-2 |
| 4 | Gate verde con los skills validados | seis entradas ausentes de `PENDING_MIGRATION`; `npm run verify:repository` → exit 0 | AC-3 |
| 5 | Pruebas verdes | `npm test` → exit 0 (incluye E2E-002 con D-7) | AC-3 |
| 6 | Evals válidos y actualizados | `node -e` parsea los seis `evals.json`; `npm run test:eval -- story-specify --dry-run` (y evaluation, refine) imprime los prompts sin error; TC-003 de specify y TC-009 de evaluation presentes | CNF-1, AC-1, AC-2 |
| 7 | Sin lectura de `root` | `grep -nE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b"` en los seis `SKILL.md` → sin salida | AC-3 (CS-3) |
| 8 | Mensaje de no encontrada | `grep -n "No se encontró la historia .* en specs/flow/"` en `story-evaluation`, `story-refine`, `story-split` | AC-2 |
| 9 | Numeración con archivo | `grep -n "specs/flow/archive/"` en `story-creation` y `story-split` (regla D-4) | AC-1 |
| 10 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» más artefactos de la historia | Non-Goals |
| 11 | Ejecución real de evals (a criterio humano) | `npm run test:eval -- story-specify` y `-- story-evaluation` | AC-1, AC-2 |

## Risks / Trade-offs

- **[Riesgo] Precondición: STORY-148 sin implementar** (`scripts/verify-fixed-layout.js` no existe) y ADR-0016 (STORY-147) aún no creado → implementar STORY-150 solo con ambas en `DONE`; sin el validador, D-6 no tiene lista que editar y AC-3 no puede verificarse por el gate. La primera tarea de `tasks.md` lo comprueba.
- **[Riesgo] Dogfooding en transición:** tras esta historia los skills fuente apuntan a `specs/flow/`, pero los work items de este repo siguen en `docs/specs/` hasta STORY-153 → no reinstalar las copias de runtime (`.claude/`, ignorado por git) antes de STORY-153; las copias instaladas siguen con el contrato v1 y el repo continúa operando. Registrar la advertencia en `implement-report.md`.
- **[Trade-off] Repos instalados sin migrar:** un proyecto que actualice el paquete sin migrar verá «no encontrada en `specs/flow/`» para historias existentes en `docs/specs/` → es el comportamiento exigido por AC-2; la mitigación (aviso y guía) es de STORY-149, STORY-152 y STORY-154, y el cambio va en versión mayor.
- **[Riesgo] Evals no ejecutados** (CNF-1): un error semántico en TC-003/TC-009 no se detecta en CI → el contrato 6 valida estructura; la ejecución queda a criterio humano.
- **[Limitación] R2–R4 no prueban la prosa:** una ruta escrita como «la carpeta de historias» sin literal pasaría el gate → los contratos 1, 2, 8 y 9 cubren las rutas por grep.

## Open Questions

Ninguna: la numeración con historias archivadas queda decidida en D-4 (CR-001) y la prueba E2E-002 en D-7 (CR-002).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-1, D-2, D-4, D-5, D-8; F-1; contratos 2, 9), AC-2 (D-3, D-8; F-2; contrato 8), AC-3 (D-1, D-2, D-6, D-7; F-3; contratos 1, 3, 4, 5, 7), CNF-1 (D-2, D-8; contrato 6), CNF-2 (D-1, D-6; contrato 3). Los seis skills y sus `assets/agents/` (solo `story-specify` tiene) están listados.
- **Ambigüedad:** «no busca en `docs/specs/`» operacionalizado como ausencia de fallback y de literales (D-3, contrato 2); «sin referencias legadas» como grep sobre el directorio completo del skill, no solo `SKILL.md`.
- **Nombres:** «contrato de layout fijo», «lista transitoria» / `PENDING_MIGRATION`, «layout legado» se usan como en STORY-148 y la épica; las rutas siempre como literales relativos a `REPO_ROOT`.
- **Estructura:** sin componentes nuevos; los skills dependen del contrato (bloque y rutas fijas), no entre sí, salvo las delegaciones existentes (`story-specify` → creation/evaluation/split/refine; `story-improve` → refine), sin ciclos. Sin código de implementación (el bloque es contenido Markdown del contrato).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: el Non-Goal «buscar historias en `specs/flow/archive/`» no distingue entre resolver una historia (lookup) y calcular el siguiente `STORY-NNN`. Si la numeración ignora `archive/`, tras STORY-153 `story-creation` y `story-split` pueden reutilizar IDs de historias archivadas.
- **Documento afectado**: story.md (Fuera de alcance), design.md (D-4)
- **Acción requerida**: el diseño decide que el Non-Goal aplica solo a la resolución (D-3) y que la numeración incluye `specs/flow/archive/` (D-4). Opcional: precisar en story.md «Buscar historias para leerlas o editarlas en `specs/flow/archive/`».

### CR-002
- **Tipo**: dependencia
- **Descripción**: `test/dod-story.test.js` (E2E-002) exige el literal `$SPECS_BASE/guardrails/dod-story-specify.md` en `story-specify`; la historia no lo menciona y su migración rompería `npm test`, que es parte de `verify:repository` (AC-3).
- **Documento afectado**: story.md (alcance), design.md (D-7)
- **Acción requerida**: incluir `test/dod-story.test.js` en el alcance de la historia con el cambio de D-7. Las historias hermanas (STORY-155, STORY-156, STORY-158) no necesitan volver a tocar la prueba.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la historia depende de STORY-148, pero también de que `scripts/verify-fixed-layout.js` exista con `PENDING_MIGRATION` (D-6) y de ADR-0016 (STORY-147), citado en el bloque canónico. Ninguno existe a 2026-10-22.
- **Documento afectado**: story.md (precondición)
- **Acción requerida**: implementar STORY-150 solo con STORY-147 y STORY-148 en `DONE`; añadir el retiro de los seis skills de `PENDING_MIGRATION` al alcance declarado.

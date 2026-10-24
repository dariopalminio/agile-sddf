---
alwaysApply: false
type: design
id: STORY-158
slug: STORY-158-migrar-skills-verificacion-specs-flow-design
title: "Design: Migrar los skills de revisión, verificación y aceptación a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-158
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-158-migrar-skills-verificacion-specs-flow
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-155-migrar-skills-planning-specs-flow
  - STORY-156-migrar-skills-implementacion-specs-flow
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-158-migrar-skills-verificacion-specs-flow]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-150-migrar-skills-especificacion-specs-flow]] · [[STORY-155-migrar-skills-planning-specs-flow]] · [[STORY-156-migrar-skills-implementacion-specs-flow]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra los tres skills de cierre del ciclo de una historia (`story-code-review`, `story-verify`, `story-acceptance`) al layout fijo de ADR-0016 (STORY-147): dejan de resolver una raíz configurable y leen/escriben en rutas fijas relativas a `REPO_ROOT` (`specs/flow/STORY-NNN-<slug>/`, `docs/guardrails/`). Adoptan el contrato verificable de STORY-148 (marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, reglas R1–R4 de `scripts/verify-fixed-layout.js`) con el mismo texto canónico que STORY-150, STORY-155 y STORY-156. Es la historia hermana de STORY-156 (split por pasos del flujo) y reutiliza sus decisiones D-1, D-3, D-5 y D-6.

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `skills/story-code-review/SKILL.md` (697 líneas) | Sección DoD (l. 111–118) con `$SPECS_BASE/guardrails/…`. Bloque `SDDF-ROOT-RESOLUTION: v1` en el Paso 0 (l. 156–163). **1b** (l. 179–186): `{story_path}` explícito o Glob `$SPECS_BASE/specs/stories/{story_id}-*/` y mensaje `❌ … bajo $SPECS_BASE/specs/stories/` (repetido en la tabla de errores l. 671). Tabla de salida (l. 686–687): `$SPECS_BASE/specs/stories/STORY-NNN/code-review-report.md` y `…/fix-directives.md`. No usa `CLI_ROOT` fuera del Paso 0: los cuatro agentes se leen como `agents/<nombre>.agent.md`, relativos al skill (l. 327). L. 333 menciona el override de `sddf.config.yaml` sin la palabra `root`. |
| `skills/story-code-review/agents/tech-lead-reviewer.agent.md` | l. 20: ejemplo `$STORY_DIR` = `docs/specs/stories/STORY-064-revision-codigo-multi-agente/`. Los otros tres agentes solo usan `$STORY_DIR` sin ejemplo. La historia los da «sin coincidencias» porque su inventario solo contó `SPECS_BASE\|SDDF_ROOT`. |
| `skills/story-code-review/examples/` | `example-all-artifacts-present/README.md` l. 15 y 25 (`docs/specs/stories/STORY-000-test/`); `example-missing-artifacts/expected-output.md` l. 13 (`❌ Artefactos requeridos no encontrados en: docs/specs/stories/STORY-000-missing-artifacts/`). |
| `skills/story-code-review/README.md`, `evals/evals.json`, `assets/` | Sin rutas legadas. Los 22 casos de eval no fijan la ubicación de la historia. |
| `skills/story-verify/SKILL.md` (596 líneas) | Entrada (l. 40–41): `$SPECS_BASE/specs/stories/<story-id>/story.md` y DoD `$SPECS_BASE/guardrails/…`. Sección DoD (l. 66–73). Bloque v1 (l. 111–118). **1b** (l. 138–146): `{story_path}` o Glob `$SPECS_BASE/specs/stories/{story_id}-*/` y mensaje `❌ … bajo $SPECS_BASE/specs/stories/`. Salida (l. 592). **Usa `CLI_ROOT`** para el modo delegado: `$CLI_ROOT/skills/` (l. 83 y 269). Lee `<REPO_ROOT>/sddf.config.yaml` (l. 42, 225–253) para la sección `verify` de pruebas, no para la raíz. El template se lee solo de `assets/verify-report-template.md` (6b, l. 420–425). |
| `skills/story-verify/README.md` | l. 56: salida `$SPECS_BASE/specs/stories/<ID>/verify-report.md`. l. 72–73: orden de template `$SPECS_BASE/templates/verify-report-template.md` → `assets/…`, **inconsistente** con el `SKILL.md` (solo `assets/`). l. 79: DoD `$SPECS_BASE/guardrails/dod-story-verify.md`. |
| `skills/story-verify/agents/`, `evals/`, `examples/`, `assets/` | Sin rutas legadas. Los 6 casos de eval usan `input_path: examples/<proyecto>` y no fijan la ubicación de la historia. |
| `skills/story-acceptance/SKILL.md` (557 líneas) | Entrada (l. 50–52): `story.md`, DoD y `acceptance-report.md` bajo `$SPECS_BASE/…`. Sección DoD (l. 70–77). Bloque v1 (l. 107–114). **1b** (l. 134–144): `{story_path}` o Glob `$SPECS_BASE/specs/stories/{story_id}-*/` y mensaje `❌ … bajo $SPECS_BASE/specs/stories/`. Salida (l. 508). No usa `CLI_ROOT` fuera del Paso 0. |
| `skills/story-acceptance/evals/evals.json` | TC-004 (l. 113): descripción con `$SPECS_BASE/guardrails/dod-story-acceptance.md`. **TC-010** `preflight-invalido-detiene-ejecucion` (l. 309–325): simula un preflight automático que falla por `SDDF_ROOT no está configurado`; ese comportamiento ya no existe (el preflight es explícito) y el contrato nuevo retira `SDDF_ROOT`. |
| `skills/story-acceptance/README.md`, `examples/`, `assets/` | Sin rutas legadas. No tiene agentes locales. |
| `test/dod-story.test.js` E2E-002 | Exige en la sección DoD de los nueve skills del pipeline, incluidos estos tres, el literal `$SPECS_BASE/guardrails/<slug>.md`. STORY-150 D-7 / STORY-155 D-7 / STORY-156 D-6 cambian la aserción a `docs/guardrails/<slug>.md`. Ver CR-001. |
| `scripts/verify-validation-contract.js` | Referencia los templates de `assets/` y las excepciones de `agents/` y `examples/` de `story-code-review`; no contiene rutas de raíz. No cambia. |
| `scripts/verify-fixed-layout.js` (STORY-148) | **Aún no existe** (STORY-148 en `READY-FOR-IMPLEMENT/DONE`). Su diseño fija R1–R4 y `PENDING_MIGRATION` (36 skills, incluidos estos tres). |
| Copias de runtime | `.claude/` está en `.gitignore`: las copias instaladas siguen con el contrato v1 hasta reinstalar. |
| `specs/` | No existe en el repo. Los work items siguen en `docs/specs/` hasta STORY-153. |

Stakeholders: el practitioner que revisa, verifica y acepta una historia en un repo recién inicializado (AC-1), el mantenedor que verifica el gate (AC-2) y STORY-157, que verifica la lista transitoria vacía.

## Goals / Non-Goals

**Goals:**
- Sustituir el Paso 0 de los tres `SKILL.md` por el bloque canónico del contrato de layout fijo // satisface: AC-2, CNF-2
- Reescribir toda ruta `$SPECS_BASE/…` y `docs/specs/…` de los tres skills (`SKILL.md`, `README.md`, agentes locales, `examples/`, `evals/evals.json`) a rutas fijas relativas a `REPO_ROOT` // satisface: AC-1, AC-2, CNF-1
- Resolver la historia solo en `specs/flow/STORY-NNN-*/` y rechazar una ruta explícita fuera de `specs/flow/`, para que ningún informe se escriba fuera de la carpeta de la historia // satisface: AC-1, AC-2
- Añadir a los evals un caso por skill que fije la escritura del informe en `specs/flow/` y retirar el caso obsoleto de preflight de `story-acceptance` // satisface: CNF-1, AC-1
- Retirar los tres skills de `PENDING_MIGRATION` para que el gate los valide con R1–R4 // satisface: AC-2, CNF-2
- Mantener `npm test` verde (E2E-002) // satisface: AC-2 (CR-001)

**Non-Goals:**
- Skills de implementación (STORY-156), especificación (STORY-150), planning (STORY-155), épica (STORY-151) y transversales (STORY-152)
- Cambiar la lectura de `sddf.config.yaml` para la configuración de pruebas de `story-verify` (`verify.*`) ni los overrides `guardrails.dod.story.<etapa>`: es configuración del pipeline, no del layout (CR-002)
- Buscar historias en `specs/flow/archive/`
- Mover work items a `specs/flow/` (STORY-153), crear `scripts/verify-fixed-layout.js` (STORY-148), reinstalar copias de runtime
- Ejecutar `npm run test:eval` (a criterio humano, CNF-1)
- Cambiar los veredictos, las transiciones de estado, el canal `.tmp/<skill>/{story_id}/`, los agentes revisores ni los templates de informe

## Decisions

### D-1 — Paso 0 con el bloque canónico del contrato // satisface: AC-2, CNF-2

En los tres `SKILL.md`, el bloque desde `<!-- SDDF-ROOT-RESOLUTION: v1 -->` hasta el siguiente encabezado se sustituye por el texto canónico de STORY-148 (D-1), idéntico al de STORY-150/155/156, conservando `### Paso 0 — Resolver contexto local`:

```markdown
<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

| Skill | Se elimina | Se conserva / añade |
|---|---|---|
| `story-code-review` | pasos 1–4 (incluida la línea `CLI_ROOT`, que no usa) | línea de `/skill-preflight` |
| `story-acceptance` | pasos 1–4 (incluida la línea `CLI_ROOT`, que no usa) | línea de `/skill-preflight` |
| `story-verify` | pasos 1–3; el paso 4 se reescribe | línea de `/skill-preflight`; línea `CLI_ROOT`: «Resuelve `CLI_ROOT` (directorio de skills del runtime) solo para buscar el skill de pruebas del modo delegado.» (sin mencionar `SPECS_BASE`) |

**Alternativas rechazadas:**
- **Conservar `CLI_ROOT` en los tres:** `story-code-review` y `story-acceptance` no lo usan (sus agentes y templates son relativos al skill); una variable sin uso es complejidad sin necesidad (P12), mismo criterio que STORY-155 D-1.
- **Eliminar `CLI_ROOT` también en `story-verify`:** el modo delegado busca un skill de pruebas en `$CLI_ROOT/skills/` (l. 83, 269); el contrato de STORY-148 solo prohíbe `SPECS_BASE`/`SDDF_ROOT`. STORY-156 conserva la línea por la misma razón.
- **Bloque propio con redacción distinta:** R2 lo admitiría, pero rompe la uniformidad con las historias hermanas (P5).

### D-2 — Mapa de sustitución de rutas // satisface: AC-1, AC-2, CNF-1

| Forma legada | Forma fija | Dónde |
|---|---|---|
| `$SPECS_BASE/specs/stories/<story-id>/…` / `STORY-NNN/…` | `specs/flow/<STORY-NNN>-<slug>/…` | verify entrada (l. 40) y salida (l. 592); acceptance entrada (l. 50, 52) y salida (l. 508); code-review salida (l. 686–687); verify README l. 56 |
| `$SPECS_BASE/specs/stories/{story_id}-*/` | `specs/flow/{story_id}-*/` (D-3) | 1b de los tres |
| `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/` | `❌ No se encontró la historia {story_id} en specs/flow/` | code-review l. 184, 671; verify l. 145; acceptance l. 141 (y su fila en la tabla de errores si existe) |
| `$SPECS_BASE/guardrails/…` | `docs/guardrails/…` | secciones DoD de los tres; entradas de verify (l. 41) y acceptance (l. 51); verify README l. 79 |
| `$SPECS_BASE/templates/verify-report-template.md` | se elimina (D-4) | verify README l. 72 |
| `docs/specs/stories/STORY-064-revision-codigo-multi-agente/` | `specs/flow/STORY-064-revision-codigo-multi-agente/` | `agents/tech-lead-reviewer.agent.md` l. 20 |
| `docs/specs/stories/STORY-000-test/` · `…/STORY-000-missing-artifacts/` | `specs/flow/STORY-000-test/` · `specs/flow/STORY-000-missing-artifacts/` | code-review `examples/example-all-artifacts-present/README.md` l. 15, 25; `examples/example-missing-artifacts/expected-output.md` l. 13 |
| `$SPECS_BASE/guardrails/dod-story-acceptance.md` | `docs/guardrails/dod-story-acceptance.md` | acceptance `evals/evals.json` TC-004 |

Sección DoD de los tres skills (mismo criterio que STORY-150 D-2 y STORY-156 D-2): `Archivo` → `docs/guardrails/dod-story-<etapa>.md` (se elimina el paréntesis «en este repositorio, …»); resolución 1 → `docs/guardrails/<slug>.md`; resolución 2 → `docs/guardrails/dod-story-<etapa>.md`. La fila `Override` (`sddf.config.yaml › guardrails.dod.story.<etapa>`) se conserva: no contiene `root` (R4).

Las rutas `.tmp/<skill>/{story_id}/` (canal entre subagentes, no versionado), `assets/…` y `agents/…` (relativas al skill) no cambian: no son artefactos de historia.

**Alternativas rechazadas:**
- **Variable nueva (`FLOW_DIR`):** reintroduce la indirección que ADR-0016 retira; R2 exige los literales.
- **Dejar ejemplos y agentes con `docs/specs/`:** el agente recibe el ejemplo como parte de su prompt y los ejemplos son material de referencia del LLM; una ruta legada induce a escribir en la ubicación antigua (AC-1 «no se escribe nada en `docs/specs/`»).

### D-3 — Resolución del directorio de la historia // satisface: AC-1, AC-2

Contrato común al Paso 1b de los tres skills, idéntico a STORY-156 D-3 (la historia hermana tiene el mismo AC-2: «ningún artefacto … queda fuera de `specs/flow/STORY-NNN-<slug>/`»):

| Entrada | Regla | Fallo |
|---|---|---|
| `{story_id}` | Glob `specs/flow/{story_id}-*/story.md`, primera coincidencia → su directorio (`$STORY_DIR`) | `❌ No se encontró la historia {story_id} en specs/flow/` + sugerencia actual (`/epic-generate-stories`); detener sin escribir |
| `{story_path}` explícito | se acepta solo si, normalizado y relativo a `REPO_ROOT`, tiene la forma `specs/flow/STORY-NNN-<slug>/` (no `specs/flow/archive/…`) y contiene `story.md` | `❌ La ruta {story_path} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)`; detener sin escribir |

- Nunca se consulta `docs/specs/` ni `specs/flow/archive/`.
- `code-review-report.md`, `fix-directives.md`, `verify-report.md`, `acceptance-report.md` y la actualización de `story.md` se escriben solo en `$STORY_DIR` (como hoy), que por construcción está en `specs/flow/STORY-NNN-<slug>/`.
- La validación ocurre en 1b, antes de cualquier escritura (`.tmp/`, frontmatter o informe), por lo que una entrada inválida no deja estado parcial.

**Alternativas rechazadas:**
- **Aceptar cualquier `{story_path}` (como STORY-155 D-3):** un `--story-path docs/specs/stories/…` escribiría el informe fuera de `specs/flow/`, contra AC-1 («no se escribe nada en `docs/specs/`») y AC-2. STORY-155 no tiene ese AC; STORY-156 sí y valida la ruta.
- **Eliminar el parámetro `{story_path}`:** cambio incompatible innecesario; validarlo cuesta una regla.
- **Fallback a `docs/specs/stories/` con aviso:** contradice AC-1; el diagnóstico del layout legado es de `skill-preflight` (STORY-152) y `/sddf-init` (STORY-149).

### D-4 — Template de `story-verify` en el README // satisface: AC-2

La sección «Template del reporte» de `skills/story-verify/README.md` se alinea con el Paso 6b del `SKILL.md`: única ubicación `assets/verify-report-template.md` (relativa al skill) y, si falta, la estructura mínima integrada. Se elimina la línea `$SPECS_BASE/templates/verify-report-template.md`.

**Alternativas rechazadas:**
- **Traducirla a `docs/templates/verify-report-template.md`:** documentaría una búsqueda que el skill no hace (Veracidad, AGENTS.md); añadirla al `SKILL.md` amplía el alcance sin que la historia lo pida.

### D-5 — Evals // satisface: CNF-1, AC-1

| Skill | Caso | Cambio |
|---|---|---|
| `story-acceptance` | TC-004 | descripción: `$SPECS_BASE/guardrails/dod-story-acceptance.md` → `docs/guardrails/dod-story-acceptance.md` |
| `story-acceptance` | TC-010 | se reemplaza `preflight-invalido-detiene-ejecucion` por `historia-no-encontrada-en-specs-flow` (mismo id, tipo `fail-fast`): `input: { story_id: "STORY-999", context: "…" }` donde `context` dice que no existe `specs/flow/STORY-999-*/` (aunque exista `docs/specs/stories/STORY-999-x/story.md`); `contains: ["No se encontró la historia STORY-999", "specs/flow/"]`; `not_contains: ["Iniciando acceptance", "acceptance-report.md", "docs/specs"]`; `threshold: 1.0` |
| `story-code-review` | TC-023 nuevo `informe-en-carpeta-specs-flow` | `input` como TC-001 (`STORY-010`, `IMPLEMENT/DONE`, artefactos completos, sin hallazgos) con `input.context`: «la historia está en `specs/flow/STORY-010-revision/`»; `contains: ["specs/flow/STORY-010-revision/code-review-report.md", "(verdict: APPROVED)"]`; `not_contains: ["docs/specs"]` |
| `story-verify` | TC-007 nuevo `informe-en-carpeta-specs-flow` | `input` como TC-001 (`examples/jest-project`, `STORY-050`) con `input.context`: «la historia está en `specs/flow/STORY-050-verificacion/`»; `contains: ["specs/flow/STORY-050-verificacion/verify-report.md", "(verdict: APPROVED)"]`; `not_contains: ["docs/specs"]` |
| `story-acceptance` | TC-015 nuevo `informe-en-carpeta-specs-flow` | `input` como TC-001 (`STORY-055`, `VERIFY/DONE`, respuestas `p`) con `input.context`: «la historia está en `specs/flow/STORY-055-aceptacion/`»; `contains: ["specs/flow/STORY-055-aceptacion/acceptance-report.md", "(verdict: APPROVED)"]`; `not_contains: ["docs/specs"]` |

Cada caso nuevo replica los campos de su caso base (`type: happy-path`, `threshold` del caso base) y solo añade `input.context` (campo de texto libre que ya usan otros skills, p. ej. `epic-creation`) y las aserciones de ruta. El resto de los casos no cambia (no fijan la ubicación de la historia). El JSON debe seguir siendo válido para `npm run test:eval -- <skill> --dry-run`. Los evals no se ejecutan en esta historia (CNF-1).

**Alternativas rechazadas:**
- **Sin casos nuevos en code-review y verify (no tienen rutas legadas):** CNF-1 quedaría satisfecho de forma vacía y AC-1 sin ninguna verificación ejecutable de la ruta del informe.
- **Reescribir los 42 casos existentes con `context` en `specs/flow/`:** coste alto sin cobertura adicional; un caso por skill basta para AC-1.
- **Conservar TC-010 de acceptance:** prueba un preflight automático que el skill ya no ejecuta y nombra `SDDF_ROOT`, que el contrato retira (CS-2 de la épica).

### D-6 — Retiro de la lista transitoria del gate // satisface: AC-2, CNF-2

En `scripts/verify-fixed-layout.js` se retiran de `PENDING_MIGRATION` las entradas `story-acceptance`, `story-code-review` y `story-verify` en el mismo cambio que migra los skills (STORY-148 D-4). La lista conserva el orden alfabético. Efecto: `verify:repository` aplica R1–R4 a los tres y falla con skill y línea ante cualquier `SPECS_BASE`, `SDDF_ROOT`, `SDDF-ROOT-RESOLUTION: v1` o línea con `root` + `sddf.config.yaml`.

**Alternativas rechazadas:**
- **Retirarlos en una historia posterior:** el gate no validaría la migración (AC-2) y fallaría por la regla de higiene «ya cumple el contrato — retíralo de la lista».

### D-7 — E2E-002 // satisface: AC-2 (CR-001)

La historia no cambia `test/dod-story.test.js` si una historia hermana (STORY-150 D-7, STORY-155 D-7 o STORY-156 D-6) ya aplicó la aserción `docs/guardrails/${slug}.md` con el patrón `guardrails\/(dod-story-[a-z-]+)\.md`. Si no, aplica ese mismo cambio, idéntico, en su primera tarea; las otras lo encontrarán hecho. Los tres skills contienen hoy `docs/guardrails/dod-story-<etapa>.md` en su sección DoD, por lo que la prueba sigue verde antes y después de migrar.

**Alternativas rechazadas:**
- **Conservar `$SPECS_BASE/guardrails/…` en la sección DoD para no tocar la prueba:** incumple R3 y AC-2.
- **Excluir los tres skills de E2E-002:** pierde la verificación «solo el DoD de su etapa».

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Revisión multi-agente | modificar (DoD, Paso 0, 1b, errores, salida) | `skills/story-code-review/SKILL.md` | AC-1, AC-2, CNF-2 |
| Revisor Tech Lead | modificar (ejemplo de `$STORY_DIR`) | `skills/story-code-review/agents/tech-lead-reviewer.agent.md` | AC-1 |
| Ejemplos de revisión | modificar (3 rutas) | `skills/story-code-review/examples/example-all-artifacts-present/README.md`, `examples/example-missing-artifacts/expected-output.md` | AC-1 |
| Evals de revisión | modificar (añadir TC-023) | `skills/story-code-review/evals/evals.json` | CNF-1, AC-1 |
| Verificación | modificar (entrada, DoD, Paso 0, 1b, errores, salida) | `skills/story-verify/SKILL.md` | AC-1, AC-2, CNF-2 |
| README de verificación | modificar (salida, template, DoD) | `skills/story-verify/README.md` | AC-1, AC-2 |
| Evals de verificación | modificar (añadir TC-007) | `skills/story-verify/evals/evals.json` | CNF-1, AC-1 |
| Aceptación | modificar (entrada, DoD, Paso 0, 1b, errores, salida) | `skills/story-acceptance/SKILL.md` | AC-1, AC-2, CNF-2 |
| Evals de aceptación | modificar (TC-004, TC-010; añadir TC-015) | `skills/story-acceptance/evals/evals.json` | CNF-1, AC-1 |
| Lista transitoria del gate | modificar (retirar 3 entradas) | `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | AC-2, CNF-2 |
| Prueba E2E-002 | modificar solo si ninguna hermana la cambió (D-7) | `test/dod-story.test.js` | AC-2 |

No se modifican `README.md` de code-review y acceptance, `assets/`, `story-verify/agents/`, los otros tres agentes de code-review ni `scripts/verify-validation-contract.js` (sin rutas legadas). No se crea ningún archivo.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Paso 0 de los tres skills | bloque de D-1 entre el marcador y el siguiente encabezado | AC-2, CNF-2 |
| Directorio de la historia | `$STORY_DIR` = `specs/flow/STORY-NNN-<slug>/` relativo a `REPO_ROOT` | AC-1 |
| Resolución por ID | `specs/flow/{story_id}-*/story.md`; fallo → `❌ No se encontró la historia {story_id} en specs/flow/` | AC-1, AC-2 |
| Ruta explícita | solo `specs/flow/STORY-NNN-<slug>/` con `story.md`; otra → error de D-3 | AC-2 |
| Informes | `$STORY_DIR/code-review-report.md` (+ `fix-directives.md` en `NEEDS-CHANGES`), `$STORY_DIR/verify-report.md`, `$STORY_DIR/acceptance-report.md` | AC-1 |
| DoD | `docs/guardrails/dod-story-{code-review,verify,acceptance}.md` (override `sddf.config.yaml › guardrails.dod.story.<etapa>`) | AC-2 |
| Contexto de subagentes | `$STORY_DIR` se pasa ya resuelto a los agentes de code-review y al QA de verify; ellos no resuelven raíces | AC-1 |
| Gate | `npm run verify:repository` aplica R1–R4 a los tres skills | AC-2 |

## Esquema de datos

N/A — no cambia ningún frontmatter ni el formato de `code-review-report.md`, `fix-directives.md`, `verify-report.md`, `acceptance-report.md`, `qa-input.json`/`qa-output.json` ni de los informes temporales; solo la ubicación de la historia. El esquema de los casos de `evals.json` se conserva (los casos nuevos usan los campos `id`, `name`, `type`, `description`, `input`, `expected`, `threshold`; `input.context` es texto libre, como en `epic-creation`).

## Flujos clave

### F-1 — Cierre de una historia en un repo recién inicializado // AC-1
1. `/story-code-review STORY-001`: Paso 0 → `REPO_ROOT`; 1b: Glob `specs/flow/STORY-001-*/story.md` → `$STORY_DIR`. Los cuatro revisores reciben `$STORY_DIR`; el skill escribe `$STORY_DIR/code-review-report.md` y actualiza `story.md`.
2. `/story-verify STORY-001`: misma resolución; DoD en `docs/guardrails/dod-story-verify.md`; escribe `$STORY_DIR/verify-report.md`.
3. `/story-acceptance STORY-001`: misma resolución; escribe `$STORY_DIR/acceptance-report.md`.
4. Ningún paso referencia ni crea `docs/specs/`; ninguno lee `SDDF_ROOT` ni la clave `root`.

### F-2 — Ruta explícita legada // AC-2
`/story-verify docs/specs/stories/STORY-059-x/` → error de D-3 y detención antes de `.tmp/` y del frontmatter: no se escribe ningún informe fuera de `specs/flow/`.

### F-3 — Gate tras la migración // AC-2
1. `grep -rnE "SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION|docs/specs|specs/stories" skills/story-code-review skills/story-verify skills/story-acceptance` → sin coincidencias.
2. `npm run verify:repository`: el paso de contrato de layout fijo valida R1–R4 en los tres skills (fuera de `PENDING_MIGRATION`) → `[OK]`; `npm test` (E2E-002) → verde.

### F-4 — Degradación // P7
- Historia inexistente o ruta explícita inválida: error de D-3 antes de cualquier escritura (frontmatter, `.tmp/`, informe).
- `docs/guardrails/dod-story-<etapa>.md` ausente: aviso y continuación con el fallback actual de cada skill (genérico en verify, solo Gherkin en acceptance).
- `sddf.config.yaml` ausente: `story-verify` cae a la detección automática de modo (comportamiento actual, CR-002); code-review y acceptance no lo requieren salvo para el override del DoD.
- Skill de pruebas no encontrado en `$CLI_ROOT/skills/`: `story-verify` sigue con la detección por archivos de configuración (comportamiento actual).
- Repo con layout legado sin migrar: la búsqueda por ID falla con el mensaje de D-3; el aviso de migración pertenece a `skill-preflight` y `/sddf-init`.

### F-5 — Puntos de cambio // P6
- **Contrato v2 o nuevas raíces:** cambia el texto canónico en el Paso 0 y las constantes de STORY-148.
- **Archivo de historias (`specs/flow/archive/`):** si una épica posterior permite reabrir historias archivadas, se amplía solo la regla de D-3.

## Decisiones de complejidad justificada

- **Validación de `{story_path}` (D-3):** sin ella, AC-1/AC-2 no se cumplen por construcción; es una comprobación de prefijo y existencia, no un mecanismo nuevo, y es la misma regla que STORY-156.
- **Un caso de eval nuevo por skill (D-5):** es la única verificación ejecutable de AC-1; se limita a uno por skill reutilizando un caso base existente.
- **D-7 condicional:** evita duplicar el cambio de las historias hermanas sin crear dependencia dura entre ellas.
- No se añade archivo, script, variable ni fallback a rutas legadas.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin referencias legadas | `grep -rnE "SPECS_BASE\|SDDF_ROOT\|SDDF-ROOT-RESOLUTION" skills/story-code-review skills/story-verify skills/story-acceptance` → sin salida | AC-2 |
| 2 | Sin rutas `docs/specs` ni `specs/stories` | `grep -rnE "docs/specs\|specs/stories\|specs/epics" <mismos dirs>` → solo las líneas `not_contains`/`input.context` de los evals nuevos y TC-010 que nombran `docs/specs` como ruta prohibida | AC-1, CNF-1 |
| 3 | Contrato declarado | `grep -c "<!-- SDDF-FIXED-LAYOUT: v1 -->"` = 1 en cada `SKILL.md` | CNF-2 |
| 4 | Sin lectura de `root` | `grep -nE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b"` en los tres `SKILL.md` → sin salida | AC-2 |
| 5 | Gate verde | las tres entradas ausentes de `PENDING_MIGRATION`; `npm run verify:repository` → exit 0 | AC-2 |
| 6 | Pruebas verdes | `npm test` → exit 0 (incluye E2E-002 y `verify-validation-contract`) | AC-2 |
| 7 | Resolución y mensaje nuevos | `grep -n "specs/flow/{story_id}-\*/"` y `grep -n "No se encontró la historia {story_id} en specs/flow/"` en los tres `SKILL.md` | AC-1, AC-2 |
| 8 | Ruta explícita restringida | `grep -n "no es una historia de specs/flow/"` en los tres `SKILL.md` | AC-2 |
| 9 | Informes en la carpeta de la historia | tablas de salida de los tres `SKILL.md` citan `specs/flow/<STORY-NNN>-<slug>/…` o `$STORY_DIR/…` | AC-1 |
| 10 | `CLI_ROOT` solo en verify | `grep -c "CLI_ROOT"` = 0 en code-review y acceptance; > 0 en verify | CNF-2 |
| 11 | Evals válidos | `JSON.parse` de los tres `evals.json`; `npm run test:eval -- <skill> --dry-run` sin error para los tres; TC-023, TC-007 y TC-015 presentes; TC-010 de acceptance sin `SDDF_ROOT` | CNF-1 |
| 12 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» más artefactos de la historia | Non-Goals |
| 13 | Ejecución real de evals (a criterio humano) | `npm run test:eval -- story-code-review`, `-- story-verify` y `-- story-acceptance` | AC-1, CNF-1 |

## Risks / Trade-offs

- **[Riesgo] Precondición: STORY-148 sin implementar** (`scripts/verify-fixed-layout.js` no existe) y ADR-0016 (STORY-147) sin crear → implementar solo con ambas en `DONE`; la primera tarea lo comprueba (dependencia dura declarada en la historia). AC-1 puede avanzar contra el contrato documentado, pero D-6 y el contrato 5 requieren el script.
- **[Riesgo] Dogfooding en transición:** los skills fuente apuntarán a `specs/flow/` mientras este repo sigue en `docs/specs/` hasta STORY-153 → no reinstalar las copias de runtime antes de STORY-153; esta historia se revisa, verifica y acepta con las copias instaladas (contrato v1). Registrar la advertencia en `implement-report.md`.
- **[Trade-off] Repos sin migrar:** los tres skills informan «no encontrada en `specs/flow/`» para historias en `docs/specs/` → comportamiento exigido; la guía de migración es de STORY-154.
- **[Riesgo] Evals no ejecutados:** un error semántico en los casos nuevos no se detecta en CI → contrato 11 valida estructura; ejecución a criterio humano.
- **[Limitación] R2–R4 no prueban la prosa ni los agentes/ejemplos:** contratos 1, 2, 7, 8 y 9 cubren rutas por grep en todo el directorio de cada skill.

## Open Questions

Ninguna: la dependencia con E2E-002 queda decidida en D-7 (CR-001), el alcance de `sddf.config.yaml` en CR-002 y las rutas omitidas en el inventario de la historia en CR-003.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2, D-3, D-5; F-1; contratos 2, 7, 9, 13), AC-2 (D-1, D-3, D-6, D-7; F-2, F-3; contratos 1, 4, 5, 6, 8), CNF-1 (D-2, D-5; contratos 2, 11), CNF-2 (D-1, D-6; contratos 3, 10). `SKILL.md`, `README.md`, agentes locales, `assets/`, `examples/` y `evals/` de los tres skills inventariados.
- **Ambigüedad:** «no se escribe nada en `docs/specs/`» operacionalizado como ausencia de fallback, de literales y de rutas explícitas fuera de `specs/flow/` (D-3); «evals actualizados» como reemplazo de rutas legadas más un caso de ruta por skill (D-5).
- **Nombres:** «contrato de layout fijo», «lista transitoria» / `PENDING_MIGRATION`, `$STORY_DIR` se usan como en STORY-148, STORY-156 y los propios skills.
- **Estructura:** sin componentes nuevos ni ciclos; los skills dependen del contrato (bloque y rutas) y, solo `story-verify`, de `CLI_ROOT` para el modo delegado; los agentes reciben `$STORY_DIR` resuelto y no dependen del layout. Sin código de implementación.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `test/dod-story.test.js` (E2E-002) exige el literal `$SPECS_BASE/guardrails/dod-story-<etapa>.md` en los tres skills. La historia no declara dependencia con sus hermanas, pero el cambio de la prueba lo planifican STORY-150 (D-7), STORY-155 (D-7) y STORY-156 (D-6). Si STORY-158 se implementa primero, `npm test` falla al migrar.
- **Documento afectado**: story.md (dependencias), design.md (D-7)
- **Acción requerida**: la primera tarea comprueba si E2E-002 ya usa `docs/guardrails/`; si no, aplica el cambio de STORY-150 D-7 tal cual. Opcional: añadir `test/dod-story.test.js` al alcance de la historia como cambio condicional.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: el «Para» de la historia dice «sin `sddf.config.yaml` ni `SDDF_ROOT`», pero `story-verify` lee `sddf.config.yaml` (sección `verify`) para su modo config-driven y los tres skills admiten el override `guardrails.dod.story.<etapa>`; ambos son independientes del layout y opcionales.
- **Documento afectado**: story.md (narrativa)
- **Acción requerida**: el diseño interpreta el «Para» como «sin declarar una raíz en `sddf.config.yaml` ni `SDDF_ROOT`» y no cambia esas lecturas. Opcional: precisar la redacción en story.md.

### CR-003
- **Tipo**: dependencia
- **Descripción**: el inventario de la historia omite rutas legadas fuera de `SPECS_BASE|SDDF_ROOT`: `docs/specs/stories/…` en `agents/tech-lead-reviewer.agent.md` (l. 20) y en dos ejemplos de `story-code-review`, y `$SPECS_BASE/templates/…` en el README de `story-verify`, inconsistente con su `SKILL.md`. También omite que TC-010 de `story-acceptance` prueba un preflight automático obsoleto.
- **Documento afectado**: design.md (D-2, D-4, D-5)
- **Acción requerida**: incluidos en el alcance mediante D-2, D-4 y D-5 (la historia ya declara «agentes locales, evals, README, plantillas y ejemplos»); sin cambio en story.md.

---
alwaysApply: false
type: design
id: STORY-155
slug: STORY-155-migrar-skills-planning-specs-flow-design
title: "Design: Migrar los skills de planning a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-155
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-155-migrar-skills-planning-specs-flow
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-155-migrar-skills-planning-specs-flow]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-150-migrar-skills-especificacion-specs-flow]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra los seis skills de planning al layout fijo de ADR-0016 (STORY-147): dejan de resolver una raíz configurable y leen/escriben en rutas fijas relativas a `REPO_ROOT` (`specs/flow/STORY-NNN-<slug>/`, `specs/flow/EPIC-NN-<slug>/`, `docs/templates/`, `docs/guardrails/`). Adoptan el contrato de STORY-148 (marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, reglas R1–R4 de `scripts/verify-fixed-layout.js`) con el mismo patrón que STORY-150 (especificación) y STORY-151 (épica).

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `skills/story-design/` | `SKILL.md`: bloque `SDDF-ROOT-RESOLUTION: v1` (l. 125–134); entradas `$SPECS_BASE/constitution.md` y DoD (l. 51–52); precondición (l. 69); sección DoD (l. 86, 92–93); Glob `$SPECS_BASE/specs/stories/{story_id}-*/` (l. 150); constitución y ruta heredada `$SPECS_BASE/policies/constitution.md` (l. 203–210); Paso 3b lee `skills.plan` de `sddf.config.yaml` (l. 237, sin clave `root`); errores «no encontrada» (l. 491) y «Entorno inválido (preflight)» (l. 493). `assets/README.md:6` cita `$SPECS_BASE/templates/design-template.md`. `examples/input/story.md` (l. 25–46) y `examples/output/design.md` (l. 117–198) citan `$SPECS_BASE`/`SPECS_BASE` y `docs/specs/stories/`. `evals/evals.json`: TC-002 (descripción `SPECS_BASE/specs/stories/`), TC-003 (`input_path: docs/specs/stories/STORY-001-historia-sin-story/`). |
| `skills/story-tasking/` | `SKILL.md`: bloque v1 (l. 110–119); Glob y error (l. 135–138); template propio `assets/tasks-template.md` (sin cambio). `assets/README.md:6` cita `$SPECS_BASE/templates/tasks-template.md`. `evals/evals.json` TC-003: descripción con `$SPECS_BASE/specs/stories/` y `contains: "No se encontro"` (sin tilde; no coincide con el mensaje real «No se encontró»). |
| `skills/story-testcases/` | `SKILL.md`: bloque v1 (l. 110–119); Glob y error (l. 135–136); fila «Entorno inválido (preflight)» (l. 300); referencias de la fase `plan` desde `sddf.config.yaml` (l. 32, 53; sin clave `root`). Evals sin rutas legadas. |
| `skills/story-analyze/` | `SKILL.md`: entradas DoD y **épica padre `$SPECS_BASE/specs/epics/{parent}-*/epic.md`** (l. 75–76); precondición (l. 91); sección DoD (l. 113, 119–120); bloque v1 (l. 155–164); Glob (l. 180); Paso 5a busca `$SPECS_BASE/specs/epics/{parent}-*/epic.md` (l. 312) aunque `parent:` ya contiene el slug completo (`EPIC-26-layout-…`), por lo que `{parent}-*` no coincide con el directorio real; errores (l. 567, 573); comentario de DoD ausente en el template embebido (l. 704). `assets/analyze-report-template.md:102` y `assets/README.md:6` citan `$SPECS_BASE`. `examples/output/analyze.md:91` cita `docs/specs/epics/…`. Evals sin rutas legadas y **sin caso de épica padre**. |
| `skills/story-fix-plan/` | `SKILL.md`: tabla de entradas con `$SPECS_BASE/specs/stories/<STORY-NNN>-*/…` (l. 43–47) y template `$CLI_ROOT/skills/story-fix-plan/assets/fix-plan-report-template.md` (l. 48); precondición (l. 59); bloque v1 (l. 97–106); Glob y error (l. 115–117); tabla de salida (l. 278–280). `examples/example-con-hallazgos/analyze.md:59` cita `docs/specs/epics/EPIC-30-reportes/epic.md`. `evals/evals.json`: 12 contextos `SPECS_BASE=docs. … docs/specs/stories/…` (TC-001 a TC-013, salvo TC-008). |
| `skills/story-plan/` | `SKILL.md`: precondición (l. 89); sección DoD (l. 107, 113–114); bloque v1 (l. 147–156); Glob (l. 187); errores «Entorno inválido (preflight)» (l. 423) y «no encontrada» (l. 424). `README.md` (l. 27–28: «Resuelto por `skill-preflight`», «SDDF_ROOT»; l. 88: ejemplo `docs/specs/stories/…`). `assets/README.md:29`. `examples/output/plan-summary.md` (l. 11, 14 `SPECS_BASE = docs`, 66, 90, 104). `evals/evals.json` TC-002: `STORY-000` y descripción con `$SPECS_BASE`. |
| `assets/agents/` | **Ninguno de los seis skills tiene `assets/agents/`** (verificado con `find`). CNF-3 se cumple sobre esos directorios de forma vacía. |
| `test/dod-story.test.js` E2E-002 (l. 548–569) | Exige el literal `$SPECS_BASE/guardrails/<slug>.md` en la sección DoD de `story-plan`, `story-design` y `story-analyze`. STORY-150 D-7 cambia la aserción a `docs/guardrails/<slug>.md`; si STORY-155 se implementa antes que STORY-150, la prueba se rompe (ver D-7, CR-001). |
| `test/sddf-constitution.test.js` | Exige que `skills/story-design/SKILL.md` contenga `sddf-constitution` y no `project-policies-generation`: la migración conserva la mención. |
| `scripts/verify-validation-contract.js` | Valida el template de `story-analyze` (campo `verdict`, S-3 `APPROVED` en el skill): no depende de rutas; no cambia. |
| `scripts/verify-fixed-layout.js`, ADR-0016 | **Aún no existen** (STORY-147 y STORY-148 en `READY-FOR-IMPLEMENT/DONE`, sin implementar). `PENDING_MIGRATION` incluirá los seis skills (STORY-148 D-4). |
| Copias de runtime / `specs/` | `.claude/` está en `.gitignore`; `specs/` no existe en el repo: los work items siguen en `docs/specs/` hasta STORY-153. |

Stakeholders: el practitioner que planifica historias en un repo recién inicializado (AC-1), el mantenedor que ejecuta las migraciones hermanas (STORY-150, STORY-156, STORY-158) y STORY-157, que verifica la lista transitoria vacía.

## Goals / Non-Goals

**Goals:**
- Sustituir el Paso 0 de los seis `SKILL.md` por el bloque canónico del contrato de layout fijo // satisface: AC-1, AC-3, CNF-2
- Reescribir toda ruta `$SPECS_BASE/…`, `$CLI_ROOT/…`, `docs/specs/stories/…` y `docs/specs/epics/…` de los seis skills (SKILL.md, README.md, `assets/`, `examples/`, `evals/`) a rutas fijas relativas a `REPO_ROOT` // satisface: AC-1, AC-3, CNF-1, CNF-3
- Resolver una historia por ID solo en `specs/flow/STORY-*/`, sin fallback a `docs/specs/`, con un mensaje común que nombre `specs/flow/` // satisface: AC-2
- Leer la épica padre de `story-analyze` desde `specs/flow/EPIC-NN-<slug>/epic.md` con una resolución que acepte el slug completo de `parent:` // satisface: AC-1
- Retirar los seis skills de `PENDING_MIGRATION` // satisface: AC-3, CNF-2
- Actualizar los evals afectados a `specs/flow/` y añadir los casos de AC-2 y de la épica padre // satisface: CNF-1, AC-1, AC-2
- Mantener `npm test` verde independientemente del orden de entrega respecto de STORY-150 // satisface: AC-3 (CR-001)

**Non-Goals:**
- Skills de especificación (STORY-150), épica (STORY-151), transversales (STORY-152), implementación (STORY-156) y revisión/verificación/aceptación (STORY-158)
- Buscar historias o épicas en `specs/flow/archive/` (historias cerradas; las épicas no se archivan, ADR-0016)
- Mover work items a `specs/flow/` (STORY-153), crear `specs/flow/` en este repo o reinstalar las copias de runtime
- Crear `scripts/verify-fixed-layout.js` o cambiar sus reglas (STORY-148)
- Cambiar la lógica de planning (pasos, correlaciones, veredictos, transiciones de estado) o los templates propios de `assets/`
- Ejecutar `npm run test:eval` (a criterio humano, CNF-1)
- Editar ADRs, `CHANGELOG.md` o guías de `docs/` (STORY-154)

## Decisions

### D-1 — Paso 0 con el bloque canónico del contrato // satisface: AC-1, AC-3, CNF-2

En los seis `skills/<skill>/SKILL.md` el bloque desde `<!-- SDDF-ROOT-RESOLUTION: v1 -->` hasta la línea sobre `/skill-preflight` se sustituye por el texto canónico de STORY-148 D-1, idéntico al de STORY-150 y STORY-151. Se conserva el encabezado `### Paso 0 — Resolver contexto local` y la línea «El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.»

```markdown
<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

| Skill | Se elimina | Se conserva / añade |
|---|---|---|
| `story-design`, `story-tasking`, `story-testcases`, `story-analyze`, `story-plan` | pasos 1–4 (incluida la línea `CLI_ROOT`, que ninguno usa) | línea de `/skill-preflight` |
| `story-fix-plan` | pasos 1–4 (incluida `CLI_ROOT`) | línea de `/skill-preflight`; su template pasa a ruta relativa al skill (D-2) |

Además se eliminan las filas `Entorno inválido (preflight) | ✗ Entorno inválido | …` de `### Manejo de errores` en `story-design` (l. 493), `story-testcases` (l. 300), `story-analyze` (l. 573) y `story-plan` (l. 423): sin raíz configurable no queda fuente explícita que pueda ser inválida, y el skill ya declara que no invoca el preflight.

Cumplimiento: R1 (marcador), R2 (`REPO_ROOT`, `specs/flow/`, `docs/templates/`, `docs/guardrails/` dentro del bloque), R3 (sin `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE`, `SDDF_ROOT`), R4 (las líneas que citan `sddf.config.yaml` —Paso 3b de `story-design`, referencias de `story-testcases`, override del DoD— no contienen la palabra `root`; `<REPO_ROOT>` no casa con `\broot\b` porque `_` es carácter de palabra).

**Alternativas rechazadas:**
- **Conservar la línea `CLI_ROOT` como en STORY-151:** en STORY-151 cuatro skills leen seeds de *otros* skills; aquí solo `story-fix-plan` usaba `$CLI_ROOT`, y para su **propio** asset, que los otros cinco ya leen con ruta relativa al skill (`assets/<template>.md`). Una variable para un único uso interno es complejidad sin necesidad (P12) y rompe la uniformidad del grupo (P5).
- **Mantener el bloque v1 cambiando solo las rutas:** seguiría honrando `SDDF_ROOT`/`root` (contradice ADR-0016) y el gate fallaría por R3/R4.
- **Conservar la fila «Entorno inválido»:** documenta un error sin causa posible; STORY-150 D-1 aplicó el mismo retiro en `story-specify`.

### D-2 — Mapa de sustitución de rutas // satisface: AC-1, AC-3, CNF-1, CNF-3

Regla única para todos los archivos de los seis skills. Rutas relativas a `REPO_ROOT`, sin prefijo de variable:

| Forma legada | Forma fija | Dónde aparece |
|---|---|---|
| `$SPECS_BASE/specs/stories/{story_id}-*/` | `specs/flow/{story_id}-*/` | Glob de los seis skills |
| `$SPECS_BASE/specs/stories/<STORY-NNN>-*/<archivo>` | `specs/flow/<STORY-NNN>-*/<archivo>` | entradas y salida de `story-fix-plan` |
| `$SPECS_BASE/specs/stories/` (precondiciones, READMEs, descripciones de evals) | `specs/flow/` | design, analyze, fix-plan, plan; `story-plan/assets/README.md`, evals de design, tasking, plan |
| `$SPECS_BASE/specs/epics/{parent}-*/epic.md` | regla de D-4 | `story-analyze` l. 76 y 312 |
| `$SPECS_BASE/guardrails/…` | `docs/guardrails/…` | sección DoD de design, analyze, plan; entrada DoD de design y analyze; comentario del template de analyze |
| `$SPECS_BASE/templates/<template>.md` | `docs/templates/<template>.md` | `assets/README.md` de design, tasking, analyze |
| `$SPECS_BASE/constitution.md` / `$SPECS_BASE/policies/constitution.md` | `docs/constitution.md` / `docs/policies/constitution.md` | `story-design` l. 51, 203–210 |
| `$CLI_ROOT/skills/story-fix-plan/assets/fix-plan-report-template.md` | `assets/fix-plan-report-template.md` (relativo al directorio del skill) | `story-fix-plan` l. 48 |
| `docs/specs/stories/STORY-…` | `specs/flow/STORY-…` | examples de design y plan, `story-plan/README.md:88`, evals de design y fix-plan |
| `docs/specs/epics/EPIC-…` | `specs/flow/EPIC-…` | `story-analyze/examples/output/analyze.md:91`, `story-fix-plan/examples/example-con-hallazgos/analyze.md:59` |
| `SPECS_BASE=docs.` (prefijo de contexto en evals) | se elimina | 12 casos de `story-fix-plan` |
| `SPECS_BASE` / `SDDF_ROOT` en prosa de ejemplos y READMEs | `REPO_ROOT` / «layout fijo» | `story-design/examples/output/design.md` (l. 117–198), `story-plan/examples/output/plan-summary.md:14`, `story-plan/README.md:27–28` |

Ajustes de redacción derivados:
- **Sección DoD** (design, analyze, plan): `Archivo` pasa a `docs/guardrails/dod-story-plan.md` y se elimina el paréntesis «en este repositorio, …», ahora redundante; la regla 1 queda `sddf.config.yaml › guardrails.dod.story.plan` → `docs/guardrails/<slug>.md`; la regla 2, `docs/guardrails/dod-story-plan.md`. El override `guardrails` sigue vigente y no incumple R4.
- **Constitución** (`story-design`): el aviso pasa a `⚠️ No se encontró docs/constitution.md`; el aviso de deprecación de `docs/policies/constitution.md` se conserva.
- **`story-plan/README.md` l. 27–28:** las filas pasan a «Directorio bajo `specs/flow/` | Resuelto por glob del ID» y se elimina la fila de `skill-preflight` (el skill no lo invoca).
- **`plan-summary.md` l. 14:** `[Paso 0] ✓ Entorno verificado — SPECS_BASE = docs` → `[Paso 0] ✓ REPO_ROOT resuelto — layout fijo`.
- **Ejemplos de `story-design`:** son la historia y el diseño del propio skill (STORY-057); sus Gherkin y flujos se reescriben con las rutas fijas (`docs/templates/story-design-template.md`, `docs/policies/`, `docs/constitution.md`, `specs/flow/STORY-057-*/`) sin cambiar su estructura.

**Alternativas rechazadas:**
- **Variable nueva (`FLOW_DIR`):** reintroduce la indirección que ADR-0016 retira; R2 exige los literales.
- **Dejar examples y evals con rutas legadas:** el gate solo lee `SKILL.md`, pero AC-3 y CNF-3 hacen grep sobre el skill completo y CNF-1 exige evals con `specs/flow/`; un ejemplo obsoleto induce al LLM a escribir en la ruta legada.

### D-3 — Resolución de la historia y mensaje común // satisface: AC-2

Contrato idéntico en los seis skills:

| Entrada | Búsqueda | Sin coincidencia |
|---|---|---|
| `{story_path}` explícito | se usa tal cual | `❌ No se encontró story.md en: <ruta>` (comportamiento actual) |
| `{story_id}` | Glob `specs/flow/{story_id}-*/` (primera coincidencia) | `❌ No se encontró la historia {story_id} en specs/flow/` y detener sin escribir |

- **Nunca** se consulta `docs/specs/` (ni como fallback ni para avisar) ni `specs/flow/archive/`.
- El mensaje sustituye a `… bajo $SPECS_BASE/specs/stories/` en las seis tablas de errores y en los bloques de mensaje de `story-tasking` (l. 138), `story-testcases` (l. 136) y `story-fix-plan` (l. 117). Las sugerencias asociadas (`/epic-generate-stories`) no cambian.
- `story-plan` resuelve el directorio antes del Paso 1e: con la historia ausente se detiene sin escribir el frontmatter ni invocar sub-skills (comportamiento actual); a los sub-skills les pasa el directorio ya resuelto.

**Alternativas rechazadas:**
- **Fallback a `docs/specs/stories/` con aviso:** AC-2 lo prohíbe («no busca ni crea nada en `docs/specs/`»); el diagnóstico del layout legado es de `skill-preflight` (STORY-152) y `/sddf-init` (STORY-149).
- **Mensajes distintos por skill:** el mismo texto que STORY-150 D-3 hace verificable AC-2 con un solo grep (contrato 4).

### D-4 — Lectura de la épica padre en `story-analyze` // satisface: AC-1

Paso 5a (y la entrada de l. 76) resuelve la épica a partir de `parent:` de `story.md`, en este orden, y nunca fuera de `specs/flow/`:

1. `specs/flow/{parent}/epic.md` — `parent` con el slug completo (`EPIC-26-layout-y-flow-forward-mejorado`), forma que generan `epic-generate-stories` y `story-creation`
2. `specs/flow/{parent}-*/epic.md` — `parent` con solo el ID (`EPIC-26`); el guion evita que `EPIC-2` coincida con `EPIC-26-…`
3. Sin coincidencia → aviso actual `⚠️ No se encontró epic.md para: <parent>` y continuar sin verificación de épica (comportamiento no bloqueante actual)

Ningún otro skill de planning lee `epic.md`: `story-fix-plan` solo lo nombra como archivo fuera de alcance (solo lectura, no lo abre). La regla «toda lectura de la épica padre» de AC-1 se cumple porque `story-analyze` es el único lector.

**Alternativas rechazadas:**
- **Solo `specs/flow/{parent}-*/epic.md` (traducción literal):** reproduce el defecto actual —con el slug completo en `parent:` el patrón exige un sufijo que no existe y la verificación de épica se omite siempre—.
- **Glob `specs/flow/{parent}*/epic.md` único:** con `parent: EPIC-2` coincidiría `EPIC-26-…` (falso positivo).
- **Buscar también en `specs/flow/archive/`:** las épicas no se archivan (ADR-0016 D-3).

### D-5 — Template de `story-fix-plan` relativo al skill // satisface: AC-1, AC-3

La fila de l. 48 pasa a `| assets/fix-plan-report-template.md | relativo al directorio del skill | ✓ obligatorio |`, la misma convención de `story-tasking` (`assets/tasks-template.md`), `story-testcases` y `story-analyze` (`relativo al directorio del skill`). Si falta, el error actual del skill se conserva con la ruta nueva.

**Alternativas rechazadas:** ver D-1 (conservar `CLI_ROOT`); mover el template a `docs/templates/` cambia la distribución del skill y no lo pide la historia.

### D-6 — Retiro de la lista transitoria del gate // satisface: AC-3, CNF-2

En `scripts/verify-fixed-layout.js` se retiran de `PENDING_MIGRATION` las entradas `story-analyze`, `story-design`, `story-fix-plan`, `story-plan`, `story-tasking` y `story-testcases`, en el mismo cambio que migra los skills (STORY-148 F-4). La lista conserva el orden alfabético. Desde ese momento el gate aplica R1–R4 a los seis; si alguno conserva una referencia legada, falla con skill y línea.

**Alternativas rechazadas:**
- **Retirarlos en una historia posterior:** el gate no validaría la migración y fallaría por la regla de higiene «ya cumple el contrato — retíralo de la lista» (STORY-148 D-4).

### D-7 — Aserción de E2E-002 independiente del orden de entrega // satisface: AC-3 (CR-001)

`test/dod-story.test.js` E2E-002 exige hoy `$SPECS_BASE/guardrails/<slug>.md` en `story-plan`, `story-design` y `story-analyze`. Al implementar:

| Estado de la prueba | Acción |
|---|---|
| Ya tiene la aserción de STORY-150 D-7 (`expectedPath = docs/guardrails/${slug}.md`, patrón `guardrails\/(dod-story-[a-z-]+)\.md`) | ninguna |
| Conserva `$SPECS_BASE` | aplicar el cambio de STORY-150 D-7 tal cual (las dos expresiones y el mensaje `debe referenciar docs/guardrails/<slug>.md`) |

El cambio es el mismo en ambas historias: la primera que se entregue lo aplica y la otra lo encuentra hecho. Los nueve skills de la prueba ya contienen `docs/guardrails/<slug>.md`, por lo que la prueba sigue verde para los no migrados.

**Alternativas rechazadas:**
- **Bloquear STORY-155 hasta entregar STORY-150:** contradice la independencia declarada en la historia.
- **Excluir los tres skills de la prueba:** pierde la verificación de «solo el DoD de su etapa».

### D-8 — Evals // satisface: CNF-1, AC-1, AC-2

| Skill | Caso | Cambio |
|---|---|---|
| `story-plan` | TC-002 | `story_id` `STORY-000` → `STORY-999` (el de AC-2); descripción sin `$SPECS_BASE` («no existe en `specs/flow/`»); `contains`: `["No se encontró la historia STORY-999", "specs/flow/"]`; `not_contains` añade `"docs/specs"` |
| `story-design` | TC-002 | descripción: `SPECS_BASE/specs/stories/` → `specs/flow/` |
| `story-design` | TC-003 | `input_path`: `docs/specs/stories/STORY-001-historia-sin-story/` → `specs/flow/STORY-001-historia-sin-story/` |
| `story-tasking` | TC-003 | descripción sin `$SPECS_BASE`; `contains` `"No se encontro"` → `"No se encontr"` (coincide con el mensaje real con tilde, mismo criterio que `story-design` TC-002) |
| `story-fix-plan` | TC-001…TC-013 (12 casos con contexto) | eliminar el prefijo `SPECS_BASE=docs. ` y `docs/specs/stories/` → `specs/flow/` en `context` |
| `story-analyze` | TC-007 nuevo `epica-padre-en-specs-flow` | `input_path: examples/input` (story, design y tasks existentes); `context`: la historia está en `specs/flow/STORY-099-…/` con `parent: EPIC-10-data-management` y existe la épica fixture `specs/flow/EPIC-10-data-management/epic.md` (objetivos y feature de la historia); `contains: ["type: analyze", "Alineación con la épica EPIC-10-data-management"]`; `not_contains: ["No se encontró epic.md", "docs/specs"]` (AC-1) |
| `story-testcases` | — | sin cambios (sin rutas legadas) |

El JSON debe seguir siendo válido para `npm run test:eval -- <skill> --dry-run` y `verify:repository`. Los evals no se ejecutan en esta historia (CNF-1).

**Alternativas rechazadas:**
- **Probar AC-1 de épica con un eval por skill:** solo `story-analyze` lee la épica (D-4); el resto de AC-1 (escritura del artefacto en `specs/flow/`) queda cubierto por las rutas de los `SKILL.md` y los contratos 1–2.
- **Conservar `STORY-000` en TC-002:** AC-2 nombra `STORY-999`; alinear el eval con el criterio facilita la trazabilidad.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill de diseño | modificar (Paso 0, rutas, constitución, DoD, errores) | `skills/story-design/SKILL.md`, `assets/README.md` | AC-1, AC-2, AC-3, CNF-2 |
| Ejemplos de diseño | modificar (rutas en prosa y Gherkin) | `skills/story-design/examples/input/story.md`, `examples/output/design.md` | AC-3, CNF-3 |
| Evals de diseño | modificar TC-002, TC-003 | `skills/story-design/evals/evals.json` | CNF-1 |
| Skill de tasking | modificar (Paso 0, Glob, mensaje) | `skills/story-tasking/SKILL.md`, `assets/README.md` | AC-1, AC-2, AC-3, CNF-2 |
| Evals de tasking | modificar TC-003 | `skills/story-tasking/evals/evals.json` | CNF-1, AC-2 |
| Skill de testcases | modificar (Paso 0, Glob, mensaje, fila de entorno) | `skills/story-testcases/SKILL.md` | AC-1, AC-2, AC-3, CNF-2 |
| Skill de análisis | modificar (Paso 0, rutas, DoD, épica padre D-4, errores, comentario del template embebido) | `skills/story-analyze/SKILL.md`, `assets/README.md`, `assets/analyze-report-template.md` | AC-1, AC-2, AC-3, CNF-2 |
| Ejemplo de análisis | modificar (1 ruta) | `skills/story-analyze/examples/output/analyze.md` | AC-3 |
| Evals de análisis | añadir TC-007 | `skills/story-analyze/evals/evals.json` | AC-1, CNF-1 |
| Skill de corrección del plan | modificar (Paso 0, entradas, template, Glob, mensaje, salida) | `skills/story-fix-plan/SKILL.md` | AC-1, AC-2, AC-3, CNF-2 |
| Ejemplo de corrección | modificar (1 ruta) | `skills/story-fix-plan/examples/example-con-hallazgos/analyze.md` | AC-3 |
| Evals de corrección | modificar 12 contextos | `skills/story-fix-plan/evals/evals.json` | CNF-1 |
| Orquestador de planning | modificar (Paso 0, precondición, DoD, Glob, errores) | `skills/story-plan/SKILL.md`, `README.md`, `assets/README.md` | AC-1, AC-2, AC-3, CNF-2 |
| Ejemplo de planning | modificar (5 líneas) | `skills/story-plan/examples/output/plan-summary.md` | AC-3 |
| Evals de planning | modificar TC-002 | `skills/story-plan/evals/evals.json` | AC-2, CNF-1 |
| Lista transitoria del gate | modificar (retirar 6 entradas) | `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | AC-3, CNF-2 |
| Prueba E2E-002 del DoD | modificar solo si STORY-150 no la cambió (D-7) | `test/dod-story.test.js` | AC-3 |

No se modifican los templates `assets/design-template.md`, `assets/tasks-template.md`, `assets/testcases-template.md`, `assets/fix-plan-report-template.md`, los `examples/input/` de tasking, testcases y analyze, los demás examples de fix-plan ni `examples/input/story.md` de plan (verificados sin rutas legadas). No se crea ningún archivo.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Paso 0 de cada skill | bloque de D-1 entre el marcador y el siguiente encabezado | AC-3, CNF-2 |
| Directorio de una historia | `specs/flow/STORY-NNN-<slug>/` relativo a `REPO_ROOT`; artefactos `design.md`, `tasks.md`, `testcases.md`, `analyze.md`, `fix-plan-report.md` y `.bak` dentro | AC-1 |
| Resolución por ID | Glob `specs/flow/{story_id}-*/`; fallo → `❌ No se encontró la historia {story_id} en specs/flow/` | AC-2 |
| Épica padre | `specs/flow/{parent}/epic.md` → `specs/flow/{parent}-*/epic.md` → aviso no bloqueante | AC-1 |
| DoD de planning | `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan`) | AC-1 |
| Constitución | `docs/constitution.md` (heredada `docs/policies/constitution.md` con aviso) | AC-1 |
| Gate | `npm run verify:repository` aplica R1–R4 de STORY-148 a los seis skills | AC-3 |

## Esquema de datos

N/A — no cambia ningún frontmatter ni formato de artefacto (design, tasks, testcases, analyze, fix-plan-report), solo su ubicación. El esquema de los casos de `evals.json` se conserva (`id`, `name`, `type`, `description`, `input`, `expected.contains`/`not_contains`, `threshold`).

## Flujos clave

### F-1 — `/story-plan` sobre una historia del layout fijo // AC-1
1. Paso 0: resuelve `REPO_ROOT`.
2. Paso 1d: Glob `specs/flow/STORY-NNN-*/` → directorio; Paso 1e escribe `PLAN/IN-PROGRESS` en su `story.md`.
3. `story-design` lee `docs/constitution.md` y `docs/guardrails/dod-story-plan.md` y escribe `specs/flow/STORY-NNN-<slug>/design.md`; `story-tasking` y `story-testcases` escriben `tasks.md` y `testcases.md` en el mismo directorio.
4. `story-analyze` lee la épica en `specs/flow/EPIC-NN-<slug>/epic.md` (D-4), evalúa el DoD de `docs/guardrails/` y escribe `analyze.md`.
5. Ningún paso referencia ni crea `docs/specs/`.

### F-2 — `/story-plan STORY-999` sin historia // AC-2
1. Paso 0 → `REPO_ROOT`. Paso 1d: Glob `specs/flow/STORY-999-*/` → vacío.
2. Emite `❌ No se encontró la historia STORY-999 en specs/flow/` y se detiene: no consulta `docs/specs/`, no escribe frontmatter ni invoca sub-skills.

### F-3 — Gate tras la migración // AC-3
1. `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/story-{design,tasking,testcases,analyze,fix-plan,plan}` → sin coincidencias.
2. `npm run verify:repository`: el paso `contrato de layout fijo` valida R1–R4 en los seis (fuera de `PENDING_MIGRATION`) → `[OK]`; `npm test` incluye E2E-002 con la aserción de D-7 → verde.

### F-4 — Degradación // P7
- Épica padre ausente: aviso y análisis sin verificación de épica (comportamiento actual, ruta nueva).
- `docs/guardrails/dod-story-plan.md` ausente: aviso y análisis sin validación DoD PLAN (comportamiento actual).
- `docs/constitution.md` ausente: aviso y diseño sin restricciones explícitas (comportamiento actual).
- Repo con layout legado sin migrar: la resolución por ID falla con el mensaje de D-3; la detección y la guía son de `skill-preflight`, `/sddf-init` y STORY-154.

### F-5 — Puntos de cambio // P6
- **Contrato v2 o nuevas rutas** (p. ej. `specs/living/`): cambia el texto canónico del bloque y las constantes de STORY-148.
- **Convención de `parent:`:** si la épica de Workflow fija solo el ID, la regla 2 de D-4 ya lo cubre sin cambios.

## Decisiones de complejidad justificada

- **Dos patrones para la épica padre (D-4):** la traducción literal del patrón actual nunca encuentra la épica cuando `parent:` lleva el slug completo (la forma real de este repo); el patrón exacto más el de prefijo con guion es el mínimo que cubre ambas formas sin falsos positivos.
- **D-7 condicional:** la historia es independiente de STORY-150; aplicar el mismo cambio en la que llegue primero evita un orden forzado sin duplicar lógica en la prueba.
- **Retiro de `CLI_ROOT` (D-1, D-5):** simplifica; la ruta relativa al skill ya es la convención de los otros cinco.
- No se añade ningún archivo, script, variable ni fallback: la historia es una sustitución textual guiada por el contrato de STORY-148.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin referencias legadas en los seis skills | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/story-design skills/story-tasking skills/story-testcases skills/story-analyze skills/story-fix-plan skills/story-plan` → sin salida (exit 1) | AC-3, CNF-3 |
| 2 | Sin rutas legadas de work items | `grep -rnE "docs/specs\|specs/stories\|specs/epics\|CLI_ROOT" <mismos dirs>` → sin salida | AC-1, AC-2, CNF-1 |
| 3 | Contrato declarado en los seis | `grep -c "<!-- SDDF-FIXED-LAYOUT: v1 -->"` = 1 en cada `SKILL.md` | CNF-2 |
| 4 | Mensaje común de no encontrada | `grep -l "No se encontró la historia .* en specs/flow/"` lista los seis `SKILL.md` | AC-2 |
| 5 | Épica padre en `specs/flow/` | `grep -n "specs/flow/{parent}"` en `story-analyze/SKILL.md` muestra las reglas 1 y 2 de D-4 | AC-1 |
| 6 | Gate verde con los skills validados | seis entradas ausentes de `PENDING_MIGRATION`; `npm run verify:repository` → exit 0 | AC-3 |
| 7 | Pruebas verdes | `npm test` → exit 0 (E2E-002 con D-7; `sddf-constitution.test.js` sigue encontrando `sddf-constitution` en `story-design`) | AC-3 |
| 8 | Sin lectura de `root` | `grep -nE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b"` en los seis `SKILL.md` → sin salida | AC-3 |
| 9 | Evals válidos y actualizados | `node -e` parsea los seis `evals.json`; `npm run test:eval -- story-plan --dry-run` (y design, tasking, analyze, fix-plan) sin error; TC-002 de plan con `STORY-999` y TC-007 de analyze presentes | CNF-1, AC-1, AC-2 |
| 10 | Sin `assets/agents/` pendientes | `find skills/story-{design,tasking,testcases,analyze,fix-plan,plan} -path "*assets/agents*"` → vacío (CNF-3 se cumple sobre directorios inexistentes) | CNF-3 |
| 11 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» más artefactos de la historia | Non-Goals |
| 12 | Ejecución real de evals (a criterio humano) | `npm run test:eval -- story-plan` y `-- story-analyze` | AC-1, AC-2 |

## Risks / Trade-offs

- **[Riesgo] Precondición: STORY-148 sin implementar** (`scripts/verify-fixed-layout.js` no existe) y ADR-0016 (STORY-147) aún no creado → implementar STORY-155 solo con ambas entregadas; la primera tarea de `tasks.md` lo comprueba.
- **[Riesgo] Dogfooding en transición:** este repo planifica sus historias con `/story-plan`; tras la migración los skills fuente apuntan a `specs/flow/`, pero los work items siguen en `docs/specs/` hasta STORY-153 → no reinstalar las copias de runtime (`.claude/`, ignorado por git) antes de STORY-153 y registrarlo en `implement-report.md`. Es el riesgo más alto del grupo: una reinstalación temprana deja sin planning al propio repo.
- **[Trade-off] Repos instalados sin migrar:** historias existentes en `docs/specs/` se reportan como «no encontrada en `specs/flow/`» → comportamiento exigido por AC-2; la mitigación es de STORY-149, STORY-152 y STORY-154, con versión mayor.
- **[Riesgo] Evals no ejecutados** (CNF-1): un error semántico en TC-002 de plan o TC-007 de analyze no se detecta en CI → el contrato 9 valida estructura; la ejecución queda a criterio humano.
- **[Limitación] R2–R4 no prueban la prosa:** una ruta escrita sin literal pasaría el gate → los contratos 1, 2, 4 y 5 cubren las rutas por grep.

## Open Questions

Ninguna: la lectura de la épica queda decidida en D-4, el template de `story-fix-plan` en D-5 y la prueba E2E-002 en D-7 (CR-001).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-1, D-2, D-4, D-5, D-8; F-1; contratos 2, 5), AC-2 (D-3, D-8; F-2; contrato 4), AC-3 (D-1, D-2, D-6, D-7; F-3; contratos 1, 3, 6, 7, 8), CNF-1 (D-2, D-8; contrato 9), CNF-2 (D-1, D-6; contrato 3), CNF-3 (D-2; contratos 1, 10). Las seis filas de la tabla de AC-1 tienen su artefacto bajo `specs/flow/STORY-NNN-<slug>/` (interfaz «Directorio de una historia»).
- **Ambigüedad:** «toda lectura de la épica padre» operacionalizado como D-4 en el único lector (`story-analyze`); «sin referencias legadas» como grep sobre el directorio completo de cada skill; «sus `assets/agents/`» verificado inexistente.
- **Nombres:** «contrato de layout fijo», «lista transitoria» / `PENDING_MIGRATION`, «layout legado» como en STORY-148 y STORY-150; rutas siempre como literales relativos a `REPO_ROOT`.
- **Estructura:** sin componentes nuevos; los skills dependen del contrato y entre sí solo por las delegaciones existentes (`story-plan` → design/tasking/testcases/analyze), sin ciclos. Sin código de implementación (el bloque es contenido Markdown del contrato).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `test/dod-story.test.js` (E2E-002) exige el literal `$SPECS_BASE/guardrails/dod-story-plan.md` en `story-plan`, `story-design` y `story-analyze`. STORY-150 D-7 corrige la aserción, pero la historia declara que puede entregarse en cualquier orden respecto de STORY-150; sin el cambio, migrar estos skills rompería `npm test` (parte de `verify:repository`, AC-3).
- **Documento afectado**: story.md (alcance), design.md (D-7)
- **Acción requerida**: incluir `test/dod-story.test.js` en el alcance condicional de la historia: aplicar STORY-150 D-7 si aún no está aplicado.

### CR-002
- **Tipo**: dependencia
- **Descripción**: la historia depende de STORY-148 (`scripts/verify-fixed-layout.js` con `PENDING_MIGRATION`, D-6) y de ADR-0016 (STORY-147), citado en el bloque canónico. Ninguno existe a 2026-10-22.
- **Documento afectado**: story.md (precondición)
- **Acción requerida**: implementar STORY-155 solo con STORY-147 y STORY-148 entregadas; el retiro de los seis skills de `PENDING_MIGRATION` forma parte del alcance (D-6).

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: AC-1 exige que «toda lectura de la épica padre» se haga desde `specs/flow/EPIC-NN-<slug>/epic.md`, pero solo `story-analyze` lee la épica, y su patrón actual (`{parent}-*`) nunca coincide cuando `parent:` contiene el slug completo. La historia no menciona el defecto.
- **Documento afectado**: design.md (D-4)
- **Acción requerida**: ninguna en story.md; el diseño corrige el patrón en D-4 y lo prueba con TC-007 (D-8). Los CNF-3/AC-3 sobre `assets/agents/` se cumplen de forma vacía: ningún skill de planning tiene roles locales.

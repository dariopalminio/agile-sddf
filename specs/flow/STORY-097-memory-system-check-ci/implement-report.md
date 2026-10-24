---
type: implement-report
id: STORY-097
slug: STORY-097-memory-system-check-ci-implement-report
title: "Implement Report: Verificar la consistencia de la memoria con un modo check apto para CI"
story: STORY-097
parent: EPIC-20-memory-system
created: 2026-09-23
updated: 2026-09-23
related:
  - STORY-097-memory-system-check-ci
  - memory-system
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]
[[memory-system]]

# Implement Report: STORY-097

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí |
| Fase GREEN confirmada | sí |
| Fase REFACTOR confirmada | sí |
| Archivos de prueba generados | 2 (`evals/evals.json` con 4 casos nuevos; 14 tests `S097-`) |
| Archivos de producción generados | 2 fixtures nuevos + 1 guía sin versionar; 6 modificados + ~69 de `docs/**` |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Tipo `eval` vía `skill-test-evals` → TC-011…TC-014 en `skills/memory-system/evals/evals.json`. Tipos `unit` y `e2e` con `skill: none` en `sddf.config.yaml` (omisión declarada). Rojo confirmado: `check` → `subcomando no admitido` (exit 2), `--json` → `flag desconocido`, `examples/broken/` inexistente, `SKILL.md` sin modo `check`. |
| GREEN | ✅ | Capa `monolithic` vía `skill-master`, en dos invocaciones secuenciales (A: motor + fixtures + tests; B: SKILL.md + referencias + documentación + memoria del repo). `node --test test/memory-system.test.js` 40/40 · `npm test` 119/119 · evals 4/4 (100%). |
| REFACTOR | ✅ | Sin regresiones. Salida de `check` verificada **byte a byte idéntica** antes/después en los cinco escenarios, y `index --dry-run` sin cambios. `npm test` 119/119 · evals 4/4 tras el refactor. |

## Componentes entregados

| Componente | Acción | Ubicación |
|---|---|---|
| Subcomando `check` + 4 evaluadores puros + `REQUIRED_FIELDS` | modificar | `skills/memory-system/scripts/memory-system.js` |
| Campo `declared` en `deriveNode` (CR-005) | modificar | `skills/memory-system/scripts/memory-system.js` |
| Modo `check [--json] [--harness h]` + degradación sin Node | modificar | `skills/memory-system/SKILL.md` |
| Reglas de wikilink (D-2) y `REQUIRED_FIELDS` (D-3) | modificar | `skills/memory-system/references/memory-rules.md` |
| Fixture con un problema por familia + falsos positivos | crear | `skills/memory-system/examples/broken/` |
| Fixture sano (CR-004) | crear | `skills/memory-system/examples/sane/` |
| Casos TC-011…TC-014 | modificar | `skills/memory-system/evals/evals.json` |
| 14 tests `S097-` (UT-001…UT-012, E2E-001, E2E-002) | modificar | `test/memory-system.test.js` |
| §7 invariante 2 (CR-001) y §10.4 modo `check` | modificar | `docs/architecture/memory-system.md` |
| Gate de CI + nota de complementariedad (CR-003) | modificar | `docs/guides/sddf-commands-pipeline.md` |
| Mención de `check` · entrada `Added` 3.3.0 | modificar | `README.md`, `CHANGELOG.md` |
| Frontmatter y wikilinks corregidos (D-6) | modificar | ~69 archivos de `docs/**` |

## Evidencia de verificación

| Comando | Resultado |
|---|---|
| `node --test test/memory-system.test.js` | 41/41 pass · exit 0 |
| `npm test` | 120/120 pass · exit 0 |
| `npm run test:eval -- memory-system --only TC-011,TC-012,TC-013,TC-014` | 4/4 PASS (100%) · exit 0 |
| `npm run verify:links` | 38 archivos, enlaces y anclas resuelven · exit 0 |
| `npm run verify:syntax` | 34 archivos JS válidos · exit 0 |
| `npm run verify:eval-inventory` | 33 skills, 8 excepciones explícitas · exit 0 |
| `npm run verify:repository` | Verificación determinista aprobada · exit 0 |
| `check` sobre `examples/broken/docs` | `problemas: 4 (missing-layer 1 · orphan 1 · invalid-frontmatter 1 · broken-wikilink 1)` · exit 1 |
| `check` sobre `examples/sane/docs` | `problemas: 0` · exit 0 |
| `check --root no-existe` | stderr `raíz inexistente: …` · exit 2 (y con `--json`, stdout `{ "ok": false, "error": … }`) |
| `check --root docs --json` | 46 problemas · exit 1 · **0,33 s** (NFR-2 exige < 5 s) |
| T015 — solo lectura sobre `docs/` | 403 archivos, 0 modificados / 0 nuevos / 0 borrados tras `check` y `check --json` |
| T015 — wikilink roto a propósito en una guía | `broken-wikilink` 41 → 42, el problema aparece en `--json`, exit 1; guía restaurada byte a byte |
| T014 — `gr-skill-creation-checklist` | Todos los greps sin salida. Único hallazgo, `foambubble.github.io` en `assets/index-template.md`, es **preexistente** (STORY-095) |

## Memoria del repositorio (D-6)

`check --root docs` pasó de **145 a 46** problemas. Sigue devolviendo exit 1, como prevé el diseño.

| Familia | Antes | Después |
|---|---|---|
| missing-layer | 0 | 0 |
| orphan | 43 | 5 |
| invalid-frontmatter | 1 | 0 |
| broken-wikilink | 101 | 41 |

Corregido: `title` en `docs/domains/domain.md`; frontmatter mínimo (`type`, `slug`, `title`) derivado sin inventar en 38 archivos; 60 wikilinks rotos por errata, renombrado o referencia por ID en vez de por slug. También el frontmatter de `docs/architecture/memory-system.md`, que no cerraba (un em dash `—` donde debía ir `---`).

## Deuda registrada (46 problemas, no bloqueante)

Conforme a D-6 y a la sección *Risks / Trade-offs* de `design.md`, se corrigieron solo frontmatter faltante y wikilinks rotos evidentes. Queda:

1. **broken-wikilink · documento canónico borrado, no "aún no escrito" (36)** — `[[state-machine]]` ×18, `[[specs-and-workflows]]` ×17, `[[specs_and_workflows]]` ×1.

   > **Diagnóstico corregido.** Una versión anterior de este informe afirmaba que `EPIC-17/plan-09-state-machine-canonical-document.md` "planifica precisamente ese documento" y que por tanto era trabajo pendiente. Es falso, y el error explica por qué la deuda sobrevivió tres pasadas de review sin que nadie la resolviera. Los hechos verificados contra `git`:
   >
   > - `plan-09` está `status: COMPLETED`: **creó** ambos documentos, no los planifica.
   > - Vivieron en `docs/knowledge/guides/` y pasaron a `docs/domain/` en el commit `63fb587` (2026-08-26).
   > - El commit **`7932954`** (2026-09-11, *"doc: add domain docs to docs\domain"*) los **borró** —`state-machine.md` (174 líneas) y `specs_and_workflows.md` (90 líneas)— al crear la familia `domain-*.md`, sin repuntar ninguna de las 32 citas.
   > - `docs/architecture/sdcl-sddf.md` **no los reemplaza**: cubre el mapeo SDLC, la lista de estados y un diagrama de flujo, pero no el modelo de `substatus`, ni las máquinas de los niveles PROJECT y ÉPICA, ni la tabla de transiciones por skill — que es lo que las citas prometen.
   >
   > No se borran los enlaces ni se inventa el destino: los destinos eran recuperables desde git y **ya se restauraron** en [[STORY-100-restaurar-documentos-canonicos-estados]] (`EPIC-19-framework-consistency`). Tras esa historia, `check --root docs` baja de 46 a **10** problemas y ninguno cita `state-machine` ni `specs-and-workflows`.
2. **broken-wikilink · nodo de `templates/`, excluido del escaneo por diseño (3)** — `[[story-template]]`, `[[project-template]]`, `[[release-spec-template]]` en `EPIC-17/plan-06-*`. `templates/` no se escanea (sus wikilinks son placeholders), así que ningún template tiene slug; `release-spec-template` además ya no existe.
3. **broken-wikilink · destino ambiguo (1)** — `[[security-checklist]]` en `docs/domains/domain-knowledge-artifacts.md`: hay dos candidatos (`gr-code-security-checklist`, `gr-ai-security-checklist`) y elegir uno sería inventar.
4. **broken-wikilink · referencia a un skill, no a un nodo (1)** — `[[skill-preflight]]` en `STORY-053-*/story.md`.
5. **orphan · sin encabezado `#` del que derivar un `title` honesto (5)** — `domains/domain-skills-map.md` (**archivo de 0 bytes**), `STORY-080-skills-master/plan.md`, `STORY-084-skill-verify/plan-03.md`, `STORY-088-security-enhancement/plan-02-security.md`, `STORY-094-*/insights.md`.

### Otras observaciones

- **`docs/index.md` desactualizado** respecto a los nuevos frontmatter y títulos. Se regenera con `/memory-system index`; no se hizo para no inflar el diff de la historia.
- ~~**Borde del gate no cubierto**~~ — **resuelto** en el ciclo de corrección del code review (CR-008): un error inesperado dentro de `check` ahora sale con exit 2 y el caso está cubierto por `S097-UT-012`. Ver *Ciclo de corrección post-review* más abajo.
- **Ajeno a la historia** — `assets/agile-sddf-blueprint.png` aparece modificado en el working tree. Ambas versiones son PNG estructuralmente válidos pero de distinto tamaño (worktree 1660×768 vs HEAD 1668×770): es un re-exportado del diagrama, no una corrupción. No se tocó durante el ciclo.

## Ciclo de corrección post-review

`/story-code-review STORY-097` aprobó la historia (`approved`, severidad máxima `LOW`, 0 bloqueantes) con 16 hallazgos `LOW` que, deduplicados, son 11 acciones. Se aplicaron todas menos el endurecimiento opcional, que se resolvió por documentación.

### Código (`skills/memory-system/scripts/memory-system.js`)

| # | Hallazgo | Corrección |
|---|---|---|
| 1 | El sobre `{ "ok": false, "error": … }` se emitía dentro de `runCheck`, después de `parseArgs`: un error de argumentos con `--json` salía con exit 2 y **stdout vacío**, rompiendo el `jq -r ".error"` del snippet de CI documentado | El sobre pasa al `catch` de `main`, condicionado a que el `argv` crudo contenga `--json` (flag que solo `check` lee). `runCheck` pierde su `try/catch`, que existía solo para emitirlo. Registrado como CR-008 |
| 2 | Un error inesperado dentro de `check` devolvía **1**, indistinguible de "memoria con problemas" | En `check` todo error termina con exit 2; el 1 queda reservado en exclusiva para "memoria con problemas". Misma edición, CR-008 |

### Test

`S097-UT-012` cubre ambos caminos: el sobre JSON en error de parseo (`check --json` sin `--root` → exit 2 con objeto de una sola línea en stdout; sin `--json`, stdout vacío) y el error inesperado → exit 2, forzado con `t.mock.method(fs, 'readdirSync', …)` sobre `main`, que está exportado.

`t.mock` es un patrón nuevo en esta suite: es la única forma portable de provocar el fallo, porque `chmod 000` es no-op en Windows y ni `walk` ni `expandGlob` leen directorios como archivos (ambos filtran por `entry.isFile()`). Requiere Node ≥ 18.13; `engines` declara `>=18.0.0`, pero todos los workflows usan `node-version: 20`.

### Documentación y specs

| Archivo | Cambio |
|---|---|
| `references/memory-rules.md` | §1: `skipLayers` admite también `constitution.md`. §7: `path` de `missing-layer` es `<capa>/` **excepto** `constitution.md`, sin barra final; enumeración de exit 2 ampliada |
| `SKILL.md` | Tabla de exit codes alineada con CR-008; se matiza que la comprobación de Node < 18 la hace hoy solo `check` (`assertRuntime()` se invoca desde `runCheck`); §3.5 paso 5 precisa que el sobre JSON cubre todos los exit 2 |
| `docs/architecture/memory-system.md` §10.4 | Tabla de exit codes y justificación del 2 para todo error de `check` |
| `docs/guides/sddf-commands-pipeline.md` | Viñeta de exit codes; aviso de que este repositorio aún no está en verde (46 problemas, exit 1), para que nadie copie el snippet en `quality.yml` esperando que pase |
| `CHANGELOG.md` | Enmienda de la entrada `Added` de 3.3.0 (`[Unreleased]`), no una entrada `Fixed` |
| `design.md` | CR-007 (contexto de evaluación incluye `root`) y CR-008; *Interfaces* y *Esquema de datos* actualizados |
| `testcases.md` | E2E-001 y EV-003 pasan de `examples/sddf/` a `examples/sane/` (CR-004); fila UT-012; IT-001 anotado como cubierto de facto por los evals e IT-002 como verificación manual; hueco conocido de UT-010 (tercera causa de exit 2 sin aserción) |

### Segunda pasada de review — corrección del hallazgo MEDIUM

`/story-code-review STORY-097` (segunda pasada) aprobó CR-007 y CR-008 por los cuatro revisores, pero devolvió `needs-changes` por un hallazgo `MEDIUM` en `docs/domains/domain-state-management.md:157`: la pasada T013 había convertido el wikilink `[[workflow-canonico-story-y-epic]]` —que sí resolvía— en `[[ADR-0003-workflow-canonico-story-y-epic]]`, que no resuelve, porque el ADR declara `slug: workflow-canonico-story-y-epic` y `deriveSlug` devuelve el slug declarado, no el nombre de archivo. Revertido.

**Decisión de seguimiento — opción (a), revertir.** El mismo archivo tenía tres ediciones más sin registrar que repuntaban a `[[sdcl-sddf]]`: `[[state-machine]]` → `[[sdcl-sddf]]` en las líneas 146 y 155, y el borrado de la viñeta `**Workflow narrativo:** [[specs-and-workflows]]` de §8. Se revirtieron, dejando el archivo **idéntico a HEAD**, por dos razones:

1. `sdcl-sddf.md` no es un reemplazo equivalente de `state-machine.md` (ver el diagnóstico corregido en *Deuda registrada*), así que el repunte prometía contenido inexistente.
2. Dejaban el archivo internamente incoherente: §8 situaba la máquina de estados en `[[sdcl-sddf]]` mientras las líneas 12, 163 y 164 seguían apuntando a `[[state-machine]]` y `[[specs-and-workflows]]`.

Los destinos correctos se restauran en **STORY-100**, y entonces esos enlaces resuelven sin tocarlos.

Tras la reversión, `check --root docs` devuelve **46** problemas — tres más que antes de revertir, y es el resultado correcto: los enlaces vuelven a estar rotos hasta que STORY-100 restaure sus destinos. Las cifras de este informe y el aviso de línea base de `docs/guides/sddf-commands-pipeline.md` están alineados con esa medición.

### Tercera pasada de review — cierre de LOW documentales

La tercera pasada aprobó por los cuatro revisores (`max-severity: LOW`, 0 bloqueantes). Se cerraron además estos hallazgos, todos texto desactualizado sin efecto sobre el comportamiento:

| Archivo | Corrección | Detectado por |
|---|---|---|
| `skills/memory-system/scripts/memory-system.js:18-21` | El docstring de cabecera no reflejaba CR-008: decía "1 error inesperado" sin la excepción de `check` | Tech-Lead, Integration |
| `CHANGELOG.md` | Enumeración de tests `S097-UT-001…011` → `S097-UT-001…012` | Tech-Lead, Integration |
| `test/memory-system.test.js` (l. 6 y 558) | Comentarios de sección con `UT-001…UT-011` → `UT-001…UT-012` | Tech-Lead, Integration |
| Este informe (l. 28, 50, 60, 61, 176) | Conteos desfasados: "13 tests `S097-`" → 14, `40/40` → 41/41, `119/119` → 120/120 | Tech-Lead, Product-Owner |
| `testcases.md` UT-005 | El *Dado* nombraba `[[sdd]]`; el test usa `[[intro]]` (el fixture `openspec` no tiene `sdd`) | Product-Owner |
| `testcases.md` UT-007 | El *Entonces* decía "0 `broken-wikilink`"; el test asserta `summary['broken-wikilink'] === 1` — el `[[no-existe]]` deliberado del fixture — y que ningún problema proceda de `templates/` ni de un derivado | Product-Owner |

Las cifras del *Ciclo TDD* (l. 36-37: `40/40`, `119/119`) **no se tocaron**: son el registro histórico de las fases GREEN y REFACTOR, que se ejecutaron antes de que existiera UT-012, y eran exactas entonces.

### Hallazgos no corregidos, por decisión de alcance

- **`groupByKind` descarta en silencio** un problema cuya familia no esté en `CHECK_KINDS` (`?.push`). Hoy inalcanzable —todas las llamadas a `problem()` usan literales de `CHECK_KINDS`—; es una trampa para quien añada la quinta familia.
- **`assertRuntime()` solo se invoca desde `runCheck`**: `detect`, `index` y `scaffold` en Node < 18 no emiten ese mensaje. Resuelto por documentación en `SKILL.md` en lugar de moverlo a `main`.
- **Deuda de los 46 problemas de `docs/**`**: intacta. Wikilinks a dos documentos canónicos **borrados** en el commit `7932954` y recuperables desde git (`[[state-machine]]`, `[[specs-and-workflows]]` — su restauración es STORY-100), nodos de `templates/` excluidos por diseño, un destino ambiguo y cinco artefactos sin encabezado del que derivar un `title` honesto. Es trabajo pendiente legítimo, no una errata.

## Desviaciones del proceso

- La Fase GREEN se dividió en **dos invocaciones secuenciales** de `skill-master` sobre la misma capa `monolithic` (A: motor, fixtures y tests; B: SKILL.md, referencias, documentación y memoria del repo). El primer intento en una sola invocación se cortó por límite de sesión sin escribir nada.
- **Aserción de la Fase RED ajustada** — TC-012, ver CR-006. No se relajó la semántica de AC-2.
- Los comandos de test se leyeron de la sección `verify:` de `sddf.config.yaml`; el skill `story-implement` especifica `defaults.{type}.command`, pero en este repositorio `defaults:` solo declara `delivery-model`.

## DoD IMPLEMENT

### ✅ Criterios de Aceptación

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin de `story.md` pasan | ✓ | E2E-001 y E2E-002 implementados como tests `S097-`, en verde |
| Criterios no funcionales verificados | ⚠️ | NFR-1 (UT-008), NFR-2 (0,33 s ≪ 5 s), NFR-4 (`path` con `/`), NFR-5 (documentación) ✓. **NFR-3 parcial**: la degradación sin `node` en PATH (IT-002) está escrita en `SKILL.md` pero no se ejecutó en un entorno real sin Node — `testcases.md` ya la marca como verificación manual |
| El comportamiento coincide con `design.md` | ✓ | D-1…D-6 implementadas; divergencias registradas como CR-004, CR-005, CR-006 |
| No hay regresiones | ✓ | 120/120 en `npm test`; `verify:repository` aprobado; salida byte a byte idéntica tras REFACTOR |

### 💻 Criterios de Código

| Criterio | Estado | Observación |
|---|---|---|
| Sigue las convenciones de `constitution.md` | ⚠️ | El código mantiene el estilo del motor existente (JSDoc en español, comentarios que citan D-N/AC-N); no se hizo una auditoría formal contra `constitution.md` |
| No hay código comentado ni `TODO` sin issue | ✓ | `grep TODO\|FIXME` sin resultados en el motor y en los tests |
| No hay variables, imports ni funciones sin usar | ⚠️ | No verificable automáticamente: el repositorio no tiene linter configurado |
| Pasa el linter y el formateador sin errores | ⚠️ | No hay script de lint; `npm run verify:syntax` aprueba los 34 archivos JS |
| No se introducen dependencias nuevas | ✓ | Solo módulos `node:` (`fs`, `path`, `process`) |
| Se usó `skill-master` para crear skills | ✓ | Fases GREEN y REFACTOR delegadas a `skill-master` según `sddf.config.yaml` |
| Skill nuevo incluido en `files` de `package.json` | ✓ | No aplica: `memory-system` ya existía y `skills/` está en `files` |
| Checklist de Seguridad de IA | ⚠️ | No ejecutado en este ciclo |
| Checklist de Seguridad de Código | ⚠️ | No ejecutado en este ciclo; sin secrets detectados y sin dependencias nuevas |
| Checklist de Creación de Skills | ✓ | T014 ejecutado sobre `skills/memory-system`: greps sin salida; único hallazgo preexistente |

### 🧪 Criterios de Tests

| Criterio | Estado | Observación |
|---|---|---|
| Los skills críticos tienen `evals/evals.json` | ✓ | 14 casos en `skills/memory-system/evals/evals.json` |
| Casos de prueba ejecutados y evaluados automáticamente | ✓ | `npm run test:eval` → 4/4 PASS (100%), antes y después del refactor |

### 📝 Criterios de Documentación

| Criterio | Estado | Observación |
|---|---|---|
| `tasks.md` con todas las tareas `[x]` | ✓ | T001–T016 completadas con evidencia |
| README / docs actualizados si cambian contratos | ✓ | `README.md`, `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md` |
| Decisiones no previstas documentadas en `design.md` | ✓ | CR-004 (fixture sano), CR-005 (campo `declared`), CR-006 (aserción TC-012) |
| CHANGELOG actualizado | ✓ | Entrada `Added` en 3.3.0 |

### 🚀 Criterios de Integración y Despliegue

| Criterio | Estado | Observación |
|---|---|---|
| El build de CI pasa sin errores | ✓ | `npm run verify:repository` aprobado (incluye build, tests, smoke del tarball) |
| No hay secrets ni credenciales expuestos | ✓ | Grep del guardrail sin resultados |
| Variables de entorno documentadas | ✓ | No aplica: `check` no introduce variables nuevas |
| El despliegue puede revertirse sin pérdida de datos | ✓ | `check` es solo lectura; no hay migración ni estado persistido |

**Resultado:** sin criterios `❌`. Los `⚠️` corresponden a verificaciones manuales o a herramientas que el repositorio no tiene configuradas, no a incumplimientos detectados.

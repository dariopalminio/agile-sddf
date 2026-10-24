---
type: testcases
id: STORY-101
slug: STORY-101-dod-story-por-etapa-testcases
title: "Test Cases: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill"
story: STORY-101
created: 2026-09-24
updated: 2026-09-24
related:
  - STORY-101-dod-story-por-etapa
---

<!-- Referencias -->
[[STORY-101-dod-story-por-etapa]]

# Casos de Prueba: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 27 |
| CT   | 0 |
| IT   | 9 |
| API  | 0 |
| E2E  | 8 |
| EV   | 7 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | `DOD_STAGES` contiene las siete etapas en orden canónico | el módulo `dod-story.js` | se leen las claves `stage` | el orden es `specify, plan, implement, code-review, verify, acceptance, deliver` | D-1, I-11, AC-1 |
| UT-002 | Unit | Cada DoD protege el cierre de su etapa y CODE-REVIEW precede a VERIFY | `DOD_STAGES` sin `deliver` | se leen `status`, `from` y `to` | orden `SPECIFY…ACCEPTANCE`; para cada etapa `from = <ETAPA>/IN-PROGRESS` y `to = <ETAPA>/DONE`; `code-review.to = CODE-REVIEW/DONE`, `verify.from = VERIFY/IN-PROGRESS` | D-1, I-11, AC-4 |
| UT-003 | Unit | La entrada `deliver` es de contenido | `DOD_STAGES` | se lee la fila `deliver` | `kind: content`, `appliesTo: deliver`, sin `from`/`to`, sin skills consumidores | D-1, I-11, AC-5 |
| UT-004 | Unit | `enforcement` por etapa | `DOD_STAGES` | se leen los `enforcement` | `warn` solo en `specify`; `error` en el resto | D-1 |
| UT-005 | Unit | El planificador produce siete destinos y el reemplazo del índice | el fixture `monolith.md` y ningún destino existente | `planDodMigration(texto, ∅, {})` | siete entradas `create` y una `replace-index`; `unmigrated` vacío | D-4, D-5, AC-1 |
| UT-006 | Unit | Frontmatter de un destino de transición | el plan de UT-005 | se inspecciona `dod-story-verify.md` | `type: guardrail`, `kind: transition`, `enforcement: error`, `from: VERIFY/IN-PROGRESS`, `to: VERIFY/DONE`, `applies-to: story`, `slug: dod-story-verify` | D-4, I-11, AC-1, AC-4 |
| UT-007 | Unit | Frontmatter del destino de deliver | el plan de UT-005 | se inspecciona `dod-story-deliver.md` | `kind: content`, `applies-to: deliver`, sin `from` ni `to` | D-4, I-11, AC-5 |
| UT-008 | Unit | Cada criterio aparece en exactamente un destino | el plan de UT-005 | se comparan las líneas `- [ ]` del origen con la unión de las de los destinos | la unión es igual y disjunta: ningún criterio duplicado ni perdido | D-4, AC-1, AC-8 |
| UT-009 | Unit | Los criterios de despliegue no contaminan otras etapas | el plan de UT-005 | se buscan criterios del bloque de despliegue (`npm pack --dry-run`, SemVer) en los destinos de etapa | solo aparecen en `dod-story-deliver.md` | D-4, I-11, AC-5 |
| UT-010 | Unit | Conversión de enlaces a guardrails | la línea `Se cumple el [Checklist de Seguridad de IA](../guardrails/gr-ai-security-checklist.md)` | se transforma con las reglas de D-4 | queda `Se cumple [[gr-ai-security-checklist]]`; igual para `gr-code-security-checklist` y `gr-skill-creation-checklist` | D-4, AC-6 |
| UT-011 | Unit | Referencia entre etapas convertida en wikilink | el criterio `Definition of Done para el estado IMPLEMENT es satisfactorio` de CODE-REVIEW | se transforma | el criterio cita `[[dod-story-implement]]` | D-4 |
| UT-012 | Unit | Bloques no migrables se descartan sin error | `monolith.md` con introducción, comentarios HTML y `## 📎 Notas adicionales` = `[Por completar]` | se planifica | ningún destino contiene comentarios HTML ni el placeholder; `unmigrated` vacío | D-4 |
| UT-013 | Unit | Monolítico personalizado: sección ausente y bloque desconocido | el fixture `monolith-custom.md` | se planifica | `specify` → `no-source`; `unmigrated = ['Criterios de rendimiento']`; no hay `replace-index` | D-4, D-5, F-5 |
| UT-014 | Unit | Destino existente sin `--force` se preserva | un destino `dod-story-plan` presente | se planifica sin `force` | acción `preserve` para `dod-story-plan` | D-5, AC-8 |
| UT-015 | Unit | Destino existente con `--force` se sobrescribe | un destino presente | se planifica con `force: true` | acción `overwrite` | D-5, AC-8 |
| UT-016 | Unit | Origen que ya es índice deprecado | origen con `status: deprecated`, seis destinos presentes y uno ausente | se planifica | `alreadyIndex: true`; seis `preserve` y un `no-source`; ningún `create` | D-5, AC-8 |
| UT-017 | Unit | Contenido del índice deprecado | el renderizado del índice | se inspecciona | `kind: index`, `status: deprecated`, `slug: dod-story-checklist`, `superseded-by` con los siete slugs, `removal: 4.0.0`, wikilinks `[[dod-story-*]]` y mención a `/memory-system migrate --from=dod-monolithic` | D-5, AC-7 |
| UT-018 | Unit | CNF-01: cuerpo de cada destino ≤ 40 líneas | el plan de UT-005 | se cuentan las líneas tras el frontmatter | ninguna supera 40 (incluida `implement`) | CNF-01, CR-006 |
| UT-019 | Unit | `readDodMapping`: sección completa y ausente | un `sddf.config.yaml` con `guardrails.dod.story` y otro sin la sección | se leen | `Map` de siete entradas en el primero; mapeo vacío en el segundo; comentarios y comillas ignorados | D-7, AC-3 |
| UT-020 | Unit | `readDodMapping` conserva claves desconocidas | config con `story: { deploy: x }` | se lee | la clave `deploy` está en el `Map` para que R4 la reporte | D-7 |
| UT-021 | Unit | Evaluador R1–R3: frontmatter de los DoD | nodos con `from` ausente, `enforcement: strict`, nombre ≠ slug y `deliver` con `applies-to: story` | `dodGuardrails(ctx)` | un problema `dod-guardrail` por caso con `detail` `falta from`, enforcement inválido, nombre ≠ slug y `applies-to: story — se esperaba deliver` | D-6, I-11 |
| UT-022 | Unit | Evaluador R2: el DoD declara una transición ajena a su etapa | `dod-story-verify.md` con `from: CODE-REVIEW/IN-PROGRESS` | `dodGuardrails(ctx)` | problema `from: CODE-REVIEW/IN-PROGRESS — se esperaba VERIFY/IN-PROGRESS` | D-6, I-11, AC-4 |
| UT-023 | Unit | Evaluador R4–R7: mapeo, monolítico y skills | mapeo con slug inexistente y etapa desconocida; monolítico sin `status: deprecated`; `skillsDir` con un consumidor sin `## DoD aplicable` y otro `SKILL.md` que cita `dod-story-checklist` | `dodGuardrails(ctx)` | problemas R4 (`path` `../sddf.config.yaml`), R5 con sugerencia de `migrate`, R6 y R7 con `path` `../skills/<skill>/SKILL.md` | D-6, AC-2, AC-3 |
| UT-024 | Unit | Aplicabilidad y degradación del evaluador | (a) raíz sin DoD ni mapeo; (b) `skillsDir` nulo | `dodGuardrails(ctx)` | (a) 0 problemas; (b) R6/R7 no se evalúan | D-6 |
| IT-001 | Integration | `parseArgs` del motor admite y valida `migrate` | el motor `memory-system.js` | `migrate --root docs` sin `--from`; `--from otro`; `--from dod-monolithic --skills-dir skills` | los dos primeros → `UsageError` (exit 2 en `main`); el tercero se acepta | D-3, T018 |
| IT-002 | Integration | Primera migración de extremo a extremo | raíz temporal con `guardrails/dod-story-checklist.md` = `monolith.md` | `main(['migrate','--root',tmp,'--from','dod-monolithic'])` | `[CREADO]` ×7 y `[REEMPLAZADO]`; `creados: 7 · sobrescritos: 0 · preservados: 0 · reemplazados: 1`; exit 0; archivos UTF-8 sin BOM | D-3, F-1, AC-1 |
| IT-003 | Integration | Re-ejecución idempotente y `--dry-run` | la raíz de IT-002 migrada | se re-ejecuta y después con `--dry-run` | `[PRESERVADO]` ×7; `creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0`; destinos idénticos byte a byte; `--dry-run` → `cambios pendientes: 0` sin escribir | D-5, F-2, AC-8 |
| IT-004 | Integration | Sin `--force` no se pisa un destino editado | la raíz migrada con `dod-story-plan.md` editado a mano | se re-ejecuta sin `--force` | el contenido editado queda intacto | D-5, AC-8 |
| IT-005 | Integration | Origen heredado `policies/dod-story.md` | raíz con solo `policies/dod-story.md` | se migra | siete destinos creados; índice en `guardrails/dod-story-checklist.md`; `policies/dod-story.md` **se conserva** (`[PRESERVADO] … origen heredado conservado`) | D-3, I-1, CR-011 |
| IT-006 | Integration | Monolítico personalizado bloquea el reemplazo | raíz con `monolith-custom.md` | se migra | exit 1; `[SIN ORIGEN] … SPECIFY` y `[NO MIGRADO] Criterios de rendimiento`; el monolítico sigue intacto | D-5, F-5 |
| IT-007 | Integration | `check` integra la familia `dod-guardrail` | raíz de fixture con un DoD roto | `check --root <tmp> --json` | `summary` tiene las cinco claves, con `dod-guardrail` al final; exit 1; con la raíz sana → exit 0 y `dod-guardrail: 0` | D-6, CR-010, T018 |
| IT-008 | Integration | Resolución de `skillsDir` en `check` | raíz de fixture con `<REPO_ROOT>/skills` y sin él | `check` sin `--skills-dir`, con `--skills-dir` y con `--cli-root` | usa `--skills-dir` si se pasa, si no `<REPO_ROOT>/skills`, si no `<cli-root>/skills`; sin ninguno, la cabecera dice `skills: —` y R6/R7 no reportan | D-6 |
| IT-009 | Integration | Override de consumidor por config | `sddf.config.yaml` con `implement: dod-story-implement-acme` y ese archivo en `guardrails/` | `check --root <tmp>` | R4 lo acepta; R1/R2 se evalúan sobre `dod-story-implement-acme.md`; no se exige `dod-story-implement.md` | D-7, F-4, AC-3 |
| E2E-001 | End-to-End | División en un archivo por etapa | el repositorio con `docs/guardrails/dod-story-checklist.md` monolítico | `/memory-system migrate --from=dod-monolithic` | existen los siete `dod-story-<etapa>.md` en `docs/guardrails/` con el frontmatter de D-1, cada uno con los criterios de una sola etapa | AC-1 |
| E2E-002 | End-to-End | Cada skill referencia su DoD | los skills editados en `skills/` | `grep -rln "## DoD aplicable" skills/*/SKILL.md` y `grep -rn "dod-story-checklist" skills/` | nueve `SKILL.md` con la sección y su `dod-story-<stage>`; ninguna referencia al monolítico | AC-2, CR-001, CR-003 |
| E2E-003 | End-to-End | Mapeo centralizado en `sddf.config.yaml` | `sddf.config.yaml` y la plantilla de `sddf-init` | se inspecciona `guardrails.dod.story` y se ejecuta `check --root docs --skills-dir skills` | siete entradas; R4 sin problemas; un override temporal hace que el skill cargue el archivo del override | AC-3 |
| E2E-004 | End-to-End | Orden del pipeline corregido | los archivos migrados | se leen `from`/`to` de `dod-story-code-review.md` y `dod-story-verify.md` y se ejecuta `check` | `CODE-REVIEW/IN-PROGRESS → CODE-REVIEW/DONE` y `VERIFY/IN-PROGRESS → VERIFY/DONE`; etapas en orden `SPECIFY…ACCEPTANCE`; `check` sin problemas R2; al alterar `to` en una copia, `check` reporta R2 | AC-4, I-11 |
| E2E-005 | End-to-End | Checklist de despliegue en su propio archivo | el monolítico migrado | se inspecciona `dod-story-deliver.md` y el resto | `applies-to: deliver`, `kind: content`, sin `from`/`to`; ningún otro `dod-story-<etapa>.md` contiene sus criterios | AC-5, I-11 |
| E2E-006 | End-to-End | Referencias cruzadas convertidas en wikilinks | `dod-story-implement.md` migrado | se busca la referencia a los checklists | `- [ ] Se cumple [[gr-ai-security-checklist]]` y sus dos equivalentes; `verify:links` y `check` sin `broken-wikilink` nuevos | AC-6 |
| E2E-007 | End-to-End | Compatibilidad temporal durante una versión | el repositorio tras la migración | se inspeccionan `dod-story-checklist.md` y `CHANGELOG.md` | el monolítico existe como índice deprecado con wikilinks a los siete archivos; el CHANGELOG `3.3.0` documenta `Changed` y `Deprecated` con eliminación en `4.0.0` | AC-7 |
| E2E-008 | End-to-End | Idempotencia de la migración | la migración ya ejecutada una vez | `/memory-system migrate --from=dod-monolithic` y su `--dry-run` | ningún archivo sobrescrito; `creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0`; `cambios pendientes: 0`; sin contenido duplicado | AC-8, CR-008 |
| EV-001 | Eval | `memory-system migrate --from=dod-monolithic` (happy path) | un proyecto con monolítico sin migrar | se invoca el skill con `--from=dod-monolithic` | el skill normaliza el flag, invoca el motor y reenvía su salida y exit code sin resumirla | D-3, T046 |
| EV-002 | Eval | `memory-system migrate` con `--from` inválido (fail-fast) | cualquier proyecto | `/memory-system migrate --from=otro` | se muestra el error del motor, exit 2, no se escribe nada ni se ejecuta la migración de harness | D-3, T046 |
| EV-003 | Eval | `memory-system migrate` sin `--from` conserva el flujo de harness | un proyecto Speckit | `/memory-system migrate --yes` | se ejecuta la secuencia de STORY-098 sin cambios | D-3 |
| EV-004 | Eval | `memory-system check` informa `dod-guardrail` | un proyecto con monolítico sin migrar | `/memory-system check` | reenvía el problema R5 y sugiere `/memory-system migrate --from=dod-monolithic`; no corrige nada | D-6, T046 |
| EV-005 | Eval | `story-acceptance` con el DoD de su etapa ausente | historia en `VERIFY/DONE` sin `dod-story-acceptance.md` | `/story-acceptance` | aviso accionable de D-8 y la sesión continúa con los criterios Gherkin | D-8, T040 |
| EV-006 | Eval | `story-implement` con whitelist de solo lectura sobre el DoD de etapa | el caso EV-012 existente con la ruta `docs/guardrails/dod-story-implement.md` | modo rework `--auto` | la entrada `solo lectura` sigue excluida de las rutas permitidas | T040 |
| UT-025 | Unit | Placeholders de fecha del origen conservados al generar plantillas | la plantilla monolítica con `created: <YYYY-MM-DD>` | `planDodMigration` con `keepDatePlaceholders` | los destinos conservan `<YYYY-MM-DD>` | I-6, INC-007 |
| UT-026 | Unit | Formato de plantilla de consumidor (etapas H2 con subgrupos H3) | el fixture `examples/dod-template` | se planifica | seis destinos `create`, subgrupos conservados como `##`, sin `[NO MIGRADO]` | I-3 |
| UT-027 | Unit | `deliver` opcional | un monolítico sin bloque de despliegue | se planifica | `deliver` → `skip`; el índice se reemplaza igualmente | I-4, I-11 |
| EV-007 | Eval | `story-specify` con DoD SPECIFY `warn` incumplido | historia aprobada y `dod-story-specify.md` con un criterio incumplido | `/story-specify` | muestra `DoD SPECIFY` y el criterio, pero la historia queda en `SPECIFY/DONE` | I-8, INC-005 |

## Notas de cobertura

- `tasks.md` se usó como fuente de enriquecimiento: IT-001 e IT-007 derivan de T018; EV-001, EV-002 y EV-004 de T046; EV-005 y EV-006 de T040.
- Los ocho escenarios Gherkin de `story.md` tienen un E2E 1-a-1 (AC-1…AC-8).
- **Sin CT, API, ST, PT ni CON**: el proyecto no tiene UI, endpoints REST ni store, y la historia no define carga.
- **AC-2 con nueve skills, no siete**: E2E-002 verifica los nueve consumidores reales de D-1 (CR-001). `dod-story-deliver.md` no tiene skill consumidor.
- **Verificación 5 de la historia**: E2E-003/E2E-004 exigen 0 problemas `dod-guardrail` y ninguna familia por encima de la línea base, no `check` en exit 0 (CR-004).
- **Gap aceptado**: el paso de verificación DoD SPECIFY añadido a `story-specify` (`enforcement: warn`, T038) y la carga efectiva de un solo archivo por skill (F-3, T060) no tienen eval automático. Se verifican a mano en T060, porque dependen de lo que el agente ejecuta en runtime. Si `story-specify` tiene `evals/evals.json`, conviene añadir un caso en implementación.
- Los tests UT e IT usan `node --test` (CNF-07) y los fixtures de T003.

> Implementación: UT-025…UT-027 corresponden en `test/dod-story.test.js` a UT-018b, UT-018c y UT-018d. EV-006 (fixture de ruta en `story-implement`) no se ejecutó: solo cambia la ruta de ejemplo, no el comportamiento.

## Test Cases Progress for STORY-101

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [x] UT-001: `DOD_STAGES` contiene las siete etapas en orden canónico
- [x] UT-002: Cada DoD protege el cierre de su etapa y CODE-REVIEW precede a VERIFY
- [x] UT-003: La entrada `deliver` es de contenido
- [x] UT-004: `enforcement` por etapa
- [x] UT-005: El planificador produce siete destinos y el reemplazo del índice
- [x] UT-006: Frontmatter de un destino de transición
- [x] UT-007: Frontmatter del destino de deliver
- [x] UT-008: Cada criterio aparece en exactamente un destino
- [x] UT-009: Los criterios de despliegue no contaminan otras etapas
- [x] UT-010: Conversión de enlaces a guardrails
- [x] UT-011: Referencia entre etapas convertida en wikilink
- [x] UT-012: Bloques no migrables se descartan sin error
- [x] UT-013: Monolítico personalizado: sección ausente y bloque desconocido
- [x] UT-014: Destino existente sin `--force` se preserva
- [x] UT-015: Destino existente con `--force` se sobrescribe
- [x] UT-016: Origen que ya es índice deprecado
- [x] UT-017: Contenido del índice deprecado
- [x] UT-018: CNF-01: cuerpo de cada destino ≤ 40 líneas
- [x] UT-019: `readDodMapping`: sección completa y ausente
- [x] UT-020: `readDodMapping` conserva claves desconocidas
- [x] UT-021: Evaluador R1–R3: frontmatter de los DoD
- [x] UT-022: Evaluador R2: el DoD declara una transición ajena a su etapa
- [x] UT-023: Evaluador R4–R7: mapeo, monolítico y skills
- [x] UT-024: Aplicabilidad y degradación del evaluador
- [x] IT-001: `parseArgs` del motor admite y valida `migrate`
- [x] IT-002: Primera migración de extremo a extremo
- [x] IT-003: Re-ejecución idempotente y `--dry-run`
- [x] IT-004: Sin `--force` no se pisa un destino editado
- [x] IT-005: Origen heredado `policies/dod-story.md`
- [x] IT-006: Monolítico personalizado bloquea el reemplazo
- [x] IT-007: `check` integra la familia `dod-guardrail`
- [x] IT-008: Resolución de `skillsDir` en `check`
- [x] IT-009: Override de consumidor por config
- [x] E2E-001: División en un archivo por etapa
- [x] E2E-002: Cada skill referencia su DoD
- [x] E2E-003: Mapeo centralizado en `sddf.config.yaml`
- [x] E2E-004: Orden del pipeline corregido
- [x] E2E-005: Checklist de despliegue en su propio archivo
- [x] E2E-006: Referencias cruzadas convertidas en wikilinks
- [x] E2E-007: Compatibilidad temporal durante una versión
- [x] E2E-008: Idempotencia de la migración
- [x] EV-001: `memory-system migrate --from=dod-monolithic` (happy path)
- [x] EV-002: `memory-system migrate` con `--from` inválido (fail-fast)
- [x] EV-003: `memory-system migrate` sin `--from` conserva el flujo de harness
- [x] EV-004: `memory-system check` informa `dod-guardrail`
- [x] EV-005: `story-acceptance` con el DoD de su etapa ausente
- [ ] EV-006: `story-implement` con whitelist de solo lectura sobre el DoD de etapa
- [x] UT-025: Placeholders de fecha del origen conservados al generar plantillas
- [x] UT-026: Formato de plantilla de consumidor (etapas H2 con subgrupos H3)
- [x] UT-027: `deliver` opcional
- [x] EV-007: `story-specify` con DoD SPECIFY `warn` incumplido

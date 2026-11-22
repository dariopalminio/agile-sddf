---
type: testcases
id: STORY-103
slug: STORY-103-replace-the-epic-template-testcases
title: "Test Cases: Reemplazar el template de Epic por la versión minimalista y output-oriented"
story: STORY-103
created: 2026-10-06
updated: 2026-10-07
related:
  - STORY-103-replace-the-epic-template
---

<!-- Referencias -->
[[STORY-103-replace-the-epic-template]]

# Casos de Prueba: Reemplazar el template de Epic por la versión minimalista y output-oriented

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 22 |
| CT   | 0 |
| IT   | 4 |
| API  | 0 |
| E2E  | 11 |
| EV   | 19 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Template reducido a cinco secciones | `docs/templates/epic-template.md` reemplazado | se listan sus encabezados `##` | son exactamente Alcance, Historias, Criterios de salida, Smoke tests, Notas (en ese orden) y no aparece ninguna de las 8 secciones eliminadas | AC-1 |
| E2E-002 | End-to-End | Alcance reemplaza a Descripción | template v2 | un autor lo copia | la primera sección es `## Alcance` y su guía habla del output y remite el valor de negocio a `product/vision.md` o `requirements/` | AC-2 |
| E2E-003 | End-to-End | Historias con tres formatos | template v2 | un autor lista historias | la guía documenta F1 `[Nombre]: [desc]`, F2 `- [ ] **STORY-NNN** — …`, F3 `- [x] **STORY-NNN** — …` y cuándo aplicar cada uno; el ejemplo por defecto es F1 | AC-3 |
| E2E-004 | End-to-End | Criterios de salida reemplaza a Criterios de éxito | template v2 | un autor define el fin de la épica | existe `## Criterios de salida` con guía "criterios técnicos verificables, no de negocio" | AC-4 |
| E2E-005 | End-to-End | Smoke tests SMOKE-N en gherkin | template v2 | un autor define smoke tests | el ejemplo es `### SMOKE-1 — [nombre]` + bloque `gherkin` con Escenario/Dado/Cuando/Entonces, y la guía explica no-renumerar y numeración opcional con uno solo | AC-5 |
| E2E-006 | End-to-End | Notas al final | template v2 | un autor registra cambios emergentes | `## Notas` es la última sección y su guía indica que es opcional y evolutiva | AC-6 |
| E2E-007 | End-to-End | Frontmatter simplificado | template v2 | se inspecciona el frontmatter | contiene type, id, slug, title, `status: DEFINE`, `substatus: IN-PROGRESS`, `parent: null`, created, updated; no contiene `implements`, `deliveryModel`, `children` ni `<ESTADO_INICIAL>` | AC-7 |
| E2E-008 | End-to-End | Skills de creación usan el template nuevo | template v2 instalado | se crea una épica con `epic-creation` y otra con `epic-from-project-plan` | ambas tienen las 5 secciones v2, `epic-creation` tiene `## DoD aplicable` y `epic-format-validation` devuelve APROBADO para las dos | AC-8 |
| E2E-009 | End-to-End | Skills que editan el Epic | épica con líneas F1 | se ejecuta `epic-generate-stories` (y `-all-stories` sobre varias) y después `story-implement` completa una historia | las F1 pasan a F2 sin cambios en otras secciones, los IDs son únicos en el batch y la historia completada queda en F3 | AC-9 |
| E2E-010 | End-to-End | Épicas existentes migradas | las 22 épicas v1 de `docs/specs/02-epics/` | se ejecuta `/memory-system migrate --from=epic-template-v1` y se resuelven los `[REVISAR]` | todas quedan en formato v2 sin pérdida de texto y una segunda ejecución `--dry-run` reporta `cambios pendientes: 0` | AC-10 |
| E2E-011 | End-to-End | Gate de formato actualizado | épicas v2 válidas e inválidas | se ejecuta `epic-format-validation` | verifica 5 secciones, formatos F1–F3 y patrón `SMOKE-N`, y falla con mensaje accionable ante cualquier incumplimiento | AC-11 |
| UT-001 | Unit | Template: ≤ 40 líneas | `docs/templates/epic-template.md` | se cuentan sus líneas | el total es ≤ 40 | CNF-1, D-1 |
| UT-002 | Unit | Template central idéntico al seed | template central y `skills/epic-creation/assets/epic-template.md` | se comparan byte a byte | son idénticos | D-8, T004 |
| UT-003 | Unit | Template: marcadores y claves en las 5 secciones | template v2 | se extraen `##` con `<!-- sección obligatoria` y su `clave:` | resultan exactamente las 5 secciones v2, con claves `alcance`, `historias`, `criterios-salida`, `smoke-tests`, `notas` únicas, y ninguna `<!-- sección opcional` | D-1, D-2b, CR-004 |
| UT-004 | Unit | Template: guion ASCII en IDs y slugs | template v2 y fixtures migrados | se buscan IDs `EPIC-`/`STORY-`/`SMOKE-` | todos usan U+002D; el separador de nombre es `—` U+2014 solo tras `**STORY-NNN**` | CNF-5 |
| UT-005 | Unit | Migración R1/R3/R5 (títulos v1 → clave) | fixture (a) v1 completa y contrato v2 | `planEpicMigration` | `Descripción`→clave `alcance` (título `Alcance`), `**Criterios de éxito:**`→`criterios-salida`, `Notas adicionales`→`notas`; salida igual a `expected.md` | D-7, T005 |
| UT-006 | Unit | Migración R7 (líneas de Historias) | líneas `STORY-NNN - **N:** d`, `**STORY-NNN — N:** d`, `- [ ] **N:** d`, `- [x] STORY-NNN …` | `planEpicMigration` | se convierten a F2/F3/F1 conservando el checkbox; las líneas indentadas quedan intactas | D-7, T006 |
| UT-007 | Unit | Migración R7 error: `[x]` sin ID | fixture (e) con `- [x] **Nombre**: desc` | `planEpicMigration` | la línea se conserva verbatim y se emite hallazgo `completada-sin-id` con su número de línea | D-7, T006 |
| UT-007b | Unit | Migración R7 error: línea fuera de F1/F2/F3 | `- [ ] Solo nombre`, `- Solo nombre sin descripción`, `- Paraguas: cubre STORY-109 a 113`, `- [ ]` | `planEpicMigration` | cada línea se conserva verbatim y emite `historia-irreconocible` con su número; `- [ ] **Válida:** …` sigue migrando a F1 y `- [Por completar]` no se marca | D-7, code review ronda 1 |
| UT-008 | Unit | Migración R2/R4 (smoke tests) | `### Escenario 2: T` + `**DADO**/**CUANDO**/**ENTONCES**/**Y**` | `planEpicMigration` | produce `### SMOKE-2 — T` + bloque `gherkin` con Escenario/Dado/Cuando/Entonces/Y y conserva el párrafo introductorio | D-7, T007 |
| UT-009 | Unit | Migración R4 error: smoke no-gherkin | fixture (e) con lista anidada bajo Flujos Críticos | `planEpicMigration` | el cuerpo se conserva verbatim bajo `### SMOKE-N — …` y se emite hallazgo `smoke-sin-gherkin` | D-7, T007 |
| UT-010 | Unit | Migración R6 (secciones situacionales) | fixture (d) con `## Requerimiento: x`, `## Objetivo`, `## Riesgos` vacío | `planEpicMigration` | `Requerimiento: x` y `Objetivo` pasan a `###` dentro de la sección `notas` (sus `###` bajan a `####`); `Riesgos` vacío se elimina | D-7, T008 |
| UT-011 | Unit | Migración R8/R9 (faltantes y orden del contrato) | fixture (b) solo Descripción + Historias y contrato v2 | `planEpicMigration` | se insertan las obligatorias ausentes con su título del template y placeholder por clave, en el orden del template | D-7, T008 |
| UT-012 | Unit | Migración R10 (preámbulo) | fixture (c) sin `##` tipo EPIC-00 | `planEpicMigration` | frontmatter, wikilinks y contenido previo al primer `##` se conservan byte a byte; se añaden las 5 secciones | D-7, T008 |
| UT-013 | Unit | Migración: frontmatter intacto | cualquier fixture con `deliveryModel` y `updated` | `planEpicMigration` | el bloque frontmatter de salida es idéntico al de entrada | D-7 |
| UT-014 | Unit | Idempotencia (punto fijo) | cada fixture y un mismo contrato | se aplica `planEpicMigration` dos veces | la segunda salida es igual a la primera y `changed=false`; una épica que ya cumple el contrato devuelve `changed=false` | D-7, T008 |
| UT-015 | Unit | `migrateEpics` en `--dry-run` | raíz temporal con fixtures | `migrateEpics(root, { dryRun: true })` | no escribe archivos, emite `[MIGRARÍA]` y `cambios pendientes: N` | D-7, T009 |
| UT-016 | Unit | `migrateEpics` exit codes | raíz con fixture (e) y raíz solo con (a) | se ejecuta la migración | exit 1 con líneas `[REVISAR] <ruta>:<línea> — <motivo>` en la primera; exit 0 en la segunda | D-7, T009 |
| UT-017 | Unit | `parseArgs` acepta el nuevo origen | argv `migrate --root x --from epic-template-v1` | `parseArgs` | devuelve `from: 'epic-template-v1'`; con `--from otro` lanza `UsageError` que lista ambos orígenes | D-7, T010 |
| UT-018 | Unit | `migrateEpics` no sale de la raíz | raíz con epic.md bajo `specs/*/EPIC-*/` | se descubren archivos | solo procesa `specs/*/EPIC-*/epic.md` (funciona con `02-epics` y `epics`) y valida `assertInsideRoot` | D-7, T009 |
| UT-019 | Unit | `migrateEpics` avisa del template central sin claves | raíz con `templates/epic-template.md` sin ninguna `clave:` (fixture g) | `migrateEpics(root)` | emite `[REVISAR] templates/epic-template.md — template sin claves de sección …`, usa el seed como contrato, no modifica el template y devuelve exit 1 | D-2b, D-7, D-8, T009 |
| UT-020 | Unit | `readTemplateContract` happy path | template v2 | `readTemplateContract(text)` | devuelve 5 entradas `{ heading, clave, obligatoria }` en el orden del template | D-2b, T005 |
| UT-021 | Unit | `readTemplateContract` errores y bordes | template con `clave: historias` repetida; template sin ninguna `clave:` | `readTemplateContract(text)` | la clave duplicada lanza `UsageError` que la nombra; el template sin claves devuelve entradas con `clave: null` | D-2b, T005 |
| UT-022 | Unit | Migración hacia un template personalizado | fixture (a) y template (f) con las mismas claves, otros títulos y otro orden | `planEpicMigration(text, contrato f)` | la épica migrada usa los títulos y el orden del template (f); salida igual a su `expected.md` | D-2b, D-7, T002, T008 |
| IT-001 | Integration | Motor despacha a `migrateEpics` | `memory-system.js` con `MIGRATE_SOURCES` ampliado | `node memory-system.js migrate --root <tmp> --from epic-template-v1` | la salida tiene cabecera `from: epic-template-v1` y resumen `migrados · sin cambios · a revisar`; `--from dod-monolithic` sigue funcionando igual | D-7, T010 |
| IT-002 | Integration | Migración real del repo + gate | `docs/` con 22 épicas v1 | migración + resolución de `[REVISAR]` + `epic-format-validation` sobre cada una | todas APROBADO | F-4, T031–T033 |
| IT-003 | Integration | Suite completa sin regresiones | código y docs modificados | `npm test` y `npm run verify:links` | todo en verde (incluye `memory-system.test.js` y `dod-story.test.js`) | T034 |
| IT-004 | Integration | Productor + gate | template v2 central | `epic-from-project-plan` genera épicas y su Fase 3e invoca el gate | el resumen de la Fase 4 lista el resultado del gate por épica; un REFINAR no detiene el batch | D-4, T019 |
| EV-001 | Eval | `epic-format-validation`: v2 válido | épica v2 completa | se valida | APROBADO | AC-11, T029 |
| EV-002 | Eval | `epic-format-validation`: épica de una versión anterior del template | épica v1 (`Descripción`, `Flujos Críticos…`) y template v2 | se valida | REFINAR listando los títulos faltantes del template y la nota `Si la épica se creó con una versión anterior del template → /memory-system migrate --from=epic-template-v1`; el skill no contiene títulos v1 | CNF-4, D-3, CR-007, CR-011 |
| EV-003 | Eval | `epic-format-validation`: falta Notas (fail-fast) | épica v2 sin `## Notas` | se valida | REFINAR listando `Notas` en `Secciones/campos faltantes:` | AC-11, CR-004 |
| EV-004 | Eval | `epic-format-validation`: línea de Historias inválida | línea `- [ ] Nombre: desc` (checkbox sin ID) | se valida | REFINAR con bloque `Formato inválido:` indicando línea, texto y forma F1/F2/F3 esperada | AC-11, D-3 |
| EV-005 | Eval | `epic-format-validation`: ≥ 2 smoke sin SMOKE-N | dos `### Escenario …` en Smoke tests | se valida | REFINAR exigiendo `### SMOKE-N — <nombre>` | AC-5, AC-11 |
| EV-006 | Eval | `epic-format-validation`: un único smoke sin número | un único `### Nombre` con bloque gherkin | se valida | APROBADO | AC-5, CR-005 |
| EV-007 | Eval | `epic-format-validation`: smoke sin bloque gherkin | `### SMOKE-1 — X` con `**DADO**` en negrita | se valida | REFINAR pidiendo bloque `gherkin` con Escenario/Dado/Cuando/Entonces | AC-5, AC-11 |
| EV-008 | Eval | `epic-creation` happy path | template v2; el usuario responde una pregunta por sección | se ejecuta el skill | cada pregunta usa el título y el comentario guía del template; escribe F1 en `historias`, `### SMOKE-1 — …` gherkin en `smoke-tests` y el gate devuelve APROBADO | AC-8, D-4, T030 |
| EV-009 | Eval | `epic-creation` DoD aplicable | `skills/epic-creation/SKILL.md` | se inspecciona | tiene `## DoD aplicable` que cita el Gate de formato `DEFINE → PLAN` y `epic-format-validation` | AC-8, CR-002 |
| EV-010 | Eval | `epic-from-project-plan` genera v2 válido | `project-plan.md` con épicas y criterios | se ejecuta el skill | épicas v2 (Criterios de salida, SMOKE-N, F1/F2) y APROBADO en la Fase 3e | AC-8, T030 |
| EV-011 | Eval | `epic-generate-stories` F1 → F2 | épica con 2 líneas F1 y una F2 | se ejecuta el skill | las F1 pasan a `- [ ] **STORY-NNN** — N: d`, la F2 y las demás secciones quedan iguales (salvo `updated`) | AC-9, T030 |
| EV-012 | Eval | `epic-generate-stories`: épica sin la sección `historias` (fail-fast) | épica sin el título que el template asigna a la clave `historias` (p. ej. una v1 sin migrar) | se ejecuta el skill | se detiene sin escribir nada y muestra `❌ La épica no tiene la sección "<título>"…` con la nota de migración | AC-9, CNF-4, D-5 |
| EV-013 | Eval | `epic-generate-all-stories` IDs únicos | dos épicas con líneas F1 | se ejecuta el skill | aplica la misma transformación y no asigna el mismo `STORY-NNN` a dos líneas | AC-9, CR-009 |
| EV-014 | Eval | `story-implement` marca F3 solo en la sección `historias` | épica con `**STORY-NNN**` en la sección `historias` y el mismo ID citado en `notas` | se completa la historia (11d) | solo la línea de la sección `historias` pasa a `- [x]`; `STORY-1030` no se toca al completar `STORY-103` | AC-9, D-6 |
| EV-015 | Eval | `epic-generate-stories` con título renombrado | template con `## Features <!-- … · clave: historias -->` y épica con `## Features` en F1 | se ejecuta el skill | asigna IDs en `## Features` (F1 → F2) sin que el skill mencione `Historias` | AC-9, D-2b, D-5 |
| EV-016 | Eval | `epic-format-validation` con título renombrado | template con `## Features <!-- … · clave: historias -->` y épica con una línea inválida en `## Features` | se valida | REFINAR en `Formato inválido:` señalando la línea de `Features` (la regla F1–F3 se aplica por clave) | AC-11, D-2b, D-3 |
| EV-017 | Eval | `story-implement` con título renombrado | template y épica con `## Features` (clave `historias`) y la historia en F2 | se completa la historia (11d) | la línea pasa a F3 dentro de `## Features` | AC-9, D-2b, D-6 |
| EV-018 | Eval | `epic-format-validation`: template sin `smoke-tests` | template al que el usuario quitó la sección de clave `smoke-tests`; épica sin smoke tests | se valida | APROBADO: la regla `SMOKE-N` no se aplica | AC-11, D-2b, D-3 |
| EV-019 | Eval | `epic-format-validation`: clave duplicada en el template (fail-fast) | template con dos secciones `clave: historias` | se valida cualquier épica | `❌ Template inválido: clave historias duplicada` y se detiene sin resultado | D-2b, D-3 |

## Notas de cobertura

- `tasks.md` se usó como enriquecimiento: las tareas T005–T010 (motor) generaron UT-005…UT-022 e IT-001; T019 generó IT-004; T031–T034 generaron IT-002/IT-003.
- Los 11 ACs tienen un caso E2E 1-a-1. En este repo los E2E se verifican mediante los UT/IT/EV que los descomponen (no hay runner E2E de UI; el "producto" son skills y templates).
- CNF-2 (documentación) y CNF-3 (CHANGELOG) no generan casos ejecutables propios: se cubren con IT-003 (`verify:links`) y revisión en `story-code-review`.
- EV-013 y EV-014 dependen de que existan casos en `evals.json` de `epic-generate-all-stories` y `story-implement`; si el inventario de evals no los admite, verificarlos por revisión del `SKILL.md`.
- Gap conocido: CR-001 (`parent` incorrecto en `story.md`) impide el E2E-009 sobre esta misma historia hasta corregirse.
- Flexibilidad del template (D-2b, CR-011): UT-020…UT-022 y EV-015…EV-019 comprueban que renombrar, reordenar o quitar secciones del template no rompe los skills.

## Test Cases Progress for STORY-103

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [x] EV-001: `epic-format-validation`: v2 válido
- [x] EV-002: `epic-format-validation`: épica de una versión anterior del template
- [x] EV-003: `epic-format-validation`: falta Notas (fail-fast)
- [x] EV-004: `epic-format-validation`: línea de Historias inválida
- [x] EV-005: `epic-format-validation`: ≥ 2 smoke sin SMOKE-N
- [x] EV-006: `epic-format-validation`: un único smoke sin número
- [x] EV-007: `epic-format-validation`: smoke sin bloque gherkin
- [x] EV-008: `epic-creation` happy path
- [x] EV-009: `epic-creation` DoD aplicable
- [x] EV-010: `epic-from-project-plan` genera v2 válido
- [x] EV-011: `epic-generate-stories` F1 → F2
- [x] EV-012: `epic-generate-stories`: épica sin la sección `historias` (fail-fast)
- [x] EV-013: `epic-generate-all-stories` IDs únicos
- [x] EV-014: `story-implement` marca F3 solo en la sección `historias`
- [x] EV-015: `epic-generate-stories` con título renombrado
- [x] EV-016: `epic-format-validation` con título renombrado
- [x] EV-017: `story-implement` con título renombrado
- [x] EV-018: `epic-format-validation`: template sin `smoke-tests`
- [x] EV-019: `epic-format-validation`: clave duplicada en el template (fail-fast)

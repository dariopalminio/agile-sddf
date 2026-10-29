---
alwaysApply: false
type: tasks
id: STORY-127
slug: STORY-127-integrar-adoptar-gateway-epica-tasks
title: "Tasks: Integrar y documentar el gateway de validación de épicas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-127
design: STORY-127
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-127-integrar-adoptar-gateway-epica
---

<!-- Referencias -->
[[STORY-127-integrar-adoptar-gateway-epica]]

## 1. Precondiciones y alineación de la historia

- [ ] T001 Resolver CR-001 de design.md con el PO antes de editar cualquier archivo. Si la historia se refina con `/story-refine STORY-127` para situar el gateway en `VALIDATE → SHIP` (y, de paso, CR-002: `NEEDS-CHANGES` en la nota «Contrato consumido» y en AC-2), detener esta lista y volver a ejecutar `/story-plan STORY-127 --only-tasks`. Si el PO confirma `DEVELOP → VALIDATE`, registrar la decisión en `implement-report.md` y continuar // AC-1, AC-2, CNF-1
- [ ] T002 Verificar que `skills/epic-validate/SKILL.md` existe (STORY-124 implementada). Si falta, ejecutar los grupos 2 y 3 salvo T007 y dejar T007 y T010 pendientes, registrando la dependencia en `implement-report.md` (design.md, P7) // AC-3

## 2. Documentación del gateway

- [ ] T003 En `docs/guides/sddf-commands-pipeline.md`, al final de §2 y antes del `---` que abre §3, crear la sección `### Gateway de validación de épicas` (C1) con:
  - La línea canónica, que aparece una sola vez en el documento: `**Gateway de validación de épicas:**` seguida de `` `/epic-validate <EPIC-ID>` `` y `` `DEVELOP → VALIDATE` ``, en ese orden y con la flecha U+2192.
  - El procedimiento de cinco pasos de la tabla de Interfaces de design.md: épica en `DEVELOP` · ejecutar sin `--dry-run` (`SIMULACIÓN` no cuenta) · leer solo `verdict` del frontmatter (G-06) · aplicar la tabla · no mover, renombrar ni borrar el reporte.
  (D-1, D-2, D-6, D-7) // AC-1, AC-2, CNF-1
- [ ] T004 En la misma sección C1, agregar:
  - La tabla de decisión de cinco filas de design.md (`APPROVED` · `NEEDS-CHANGES` · `BLOCKED` · reporte ausente · ilegible, sin `verdict` o con un valor desconocido) con la transición, el `status` resultante y la acción del mantenedor.
  - La escritura permitida tras `APPROVED` (`status: VALIDATE`, `substatus: IN-PROGRESS`, `updated: <hoy>` en `epic.md`, sin ningún otro cambio).
  - El mensaje de remisión literal a `## Veredicto`.
  - La equivalencia `RESULTADO: ÉXITO` ⇔ primera fila, aclarando que la fuente es el archivo.
  - La nota de disponibilidad: runtimes con `support: supported` de `config/runtimes.json` tras `npx agile-sddf install --target <runtime>` con la estrategia `full`; `--strategy story` excluye `epic-*`. Sin enumerar runtimes.
  (D-2, D-8, D-9) // AC-1, AC-2, AC-3, CNF-2
- [ ] T005 En `docs/architecture/state-machine.md`, sección «Nivel ÉPICA», justo después de la línea «Gate de calidad: `epic-format-validation` …», agregar la línea canónica (C2): una sola vez, con el mismo punto de entrada y la misma transición que T003. Debe indicar que la transición sigue siendo manual y terminar con `[procedimiento](../guides/sddf-commands-pipeline.md#gateway-de-validación-de-épicas)`. No editar la línea «SHIP y COMPLETED son transiciones manuales» (D-6) // AC-1, AC-2, CNF-1

## 3. Pruebas automatizadas

- [ ] T006 [P] Crear `test/epic-validate-gateway.test.js` (C3) con el estilo de `test/maintenance-contracts.test.js` (`node:test`, `node:assert/strict`, `REPO_ROOT` por `path.resolve(__dirname, '..')`).
  - Constantes `PREFIX = '**Gateway de validación de épicas:**'`, `ENTRY = '/epic-validate <EPIC-ID>'` y `TRANSITION = 'DEVELOP → VALIDATE'`, cada una declarada una sola vez.
  - Un `test` que, para la guía y para `state-machine.md`, extraiga las líneas que empiezan con `PREFIX`, exija exactamente una (el mensaje nombra el documento y la cantidad encontrada) y compruebe que contiene `ENTRY` antes de `TRANSITION`.
  (D-5) // CNF-1
- [ ] T007 [P] Agregar a `test/install.test.js`, después de «installSDDF copia el inventario fuente al destino canónico de cada runtime», la prueba `epic-validate se empaqueta y se instala con su SKILL.md en cada runtime soportado (STORY-127 AC-3, CS-8)` (C4):
  - Exige que exista `skills/epic-validate/SKILL.md` en la fuente, con el mensaje `skills/epic-validate/SKILL.md no existe en la fuente`.
  - Exige que alguna entrada de `package.json › files`, normalizada sin `/` final, sea `skills` o `skills/epic-validate`.
  - Con `createFixture`, `withInitCwd`, `withoutInstallLogs` y `destination`, ejecuta `installSDDF({ target: runtime.id })` para cada elemento de `RUNTIMES` y compara byte a byte `<destino>/<skillsDirectory>/epic-validate/SKILL.md` con la fuente.
  - No modifica `package.json` ni `scripts/install.js` (D-3, D-4).
  // AC-3, CNF-2, CS-8

## 4. Verificación

- [ ] T008 Recorrido manual de AC-1 en un directorio temporal del sistema (fuera de `specs/flow/`, nunca versionado). Crear una épica fixture en `DEVELOP` con un `epic-validate-report.md` de prueba `verdict: APPROVED`, seguir la sección de T003 y T004 y confirmar que se llega a `VALIDATE/IN-PROGRESS` y que el reporte permanece. Registrar el resultado en `implement-report.md` (contrato de verificación 2) // AC-1
- [ ] T009 Recorrido manual de AC-2 con tres fixtures (`verdict: BLOCKED`, `verdict: NEEDS-CHANGES` y sin reporte). Confirmar que la guía impide la transición, remite a `## Veredicto` (o a ejecutar `/epic-validate` si falta el reporte) y que `epic.md` sigue en `DEVELOP`. Registrar el resultado en `implement-report.md` (contrato de verificación 3) // AC-2
- [ ] T010 Ejecutar `npm pack --dry-run --json` y confirmar que la lista de archivos incluye `skills/epic-validate/SKILL.md` (contrato de verificación 6) // AC-3, CNF-2
- [ ] T011 Comprobar que los archivos editados son UTF-8 sin BOM, que `git status` no muestra cambios en `.claude/`, `.opencode/`, `.github/`, `.agents/`, `package.json` ni `config/runtimes.json`, y que la guía no enumera runtimes // CNF-2
- [ ] T012 Ejecutar `npm run verify:links` (valida el ancla de T005), `node --test test/epic-validate-gateway.test.js test/install.test.js`, `npm test` y `npm run verify:repository`, todos sin errores (contratos de verificación 4, 5 y 7) // CNF-1, AC-3, CS-21
- [ ] T013 Ejecutar `graphify update .` para actualizar el grafo tras los cambios (`AGENTS.md`, sección graphify)

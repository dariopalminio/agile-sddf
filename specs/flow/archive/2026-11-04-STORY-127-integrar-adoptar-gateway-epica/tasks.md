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

## 1. Precondiciones

- [x] T001 Verificar que STORY-124 y STORY-126 están implementadas: `skills/epic-validate/SKILL.md` existe y contiene el paso que escribe el reporte, la sección «Política de efectos» y el Paso 6 «Salida» con el bloque `RESULTADO`. Si falta alguno, ejecutar solo T006 y T007 (C1 y C2, que no dependen del skill) y T005 si la fila de `epic-validate` ya existe, dejar el resto pendiente y registrar la dependencia en `implement-report.md` (design.md, P7) // AC-1, AC-2, AC-3
- [x] T002 Confirmar que CS-7 de EPIC-23 sigue admitiendo la excepción del gateway (CR-004) antes de editar la «Política de efectos». Si ya no la admite, registrar la contradicción en `implement-report.md` y continuar solo con T006 y T007 // AC-1, AC-2

## 2. Gateway en el skill

- [x] T003 En `skills/epic-validate/SKILL.md`, entre el paso que escribe el reporte y el Paso 6 «Salida», crear el paso «Gateway de transición» (C5) con:
  - La línea canónica, una sola vez en el archivo: `**Gateway de validación de épicas:**` seguida de `` `/epic-validate <EPIC-ID>` ``, `` `VALIDATE/IN-PROGRESS → VALIDATE/DONE` `` y `` `VALIDATE → DEVELOP/IN-PROGRESS` ``, en ese orden y con la flecha U+2192.
  - La lectura de `verdict` del frontmatter del reporte recién escrito y de `status`/`substatus` de `epic.md`.
  - La tabla de decisión de seis filas de design.md y la escritura de solo `status`, `substatus` y `updated` en `epic.md`, sin `.bak` ni confirmación.
  - La línea `Gateway:` inmediatamente antes del bloque `RESULTADO`, con la remisión a `## Veredicto` cuando el veredicto no es `APPROVED`, y el fallo al escribir `epic.md` como `RESULTADO: FALLO` con `MOTIVO:`.
  (D-1, D-2, D-7, D-8, D-9, D-10, D-11) // AC-1, AC-2, CNF-1
- [x] T004 En la sección «Política de efectos» de `skills/epic-validate/SKILL.md` (C6), reemplazar la exclusión de `epic.md` por la excepción del gateway: fuera de `--dry-run` y solo después de escribir el reporte, el skill escribe `status`, `substatus` y `updated` de `epic.md`. `--dry-run` sigue sin escribir nada (D-1) // AC-1, AC-2
- [x] T005 En `docs/domains/domain-skills-map.md`, tabla `## Épica (L2)`, fila de `epic-validate` (C7): agregar `epic.md` (solo `status`, `substatus`, `updated`) en «Escribe» y reemplazar «Cambia estado: —» por `VALIDATE → VALIDATE/DONE` (`APPROVED`) · `VALIDATE → DEVELOP/IN-PROGRESS` (otro veredicto). Si la fila aún no existe (STORY-124 sin entregar), dejar la tarea pendiente // AC-1, AC-2

## 3. Documentación del gateway

- [x] T006 En `docs/guides/sddf-commands-pipeline.md`, al final de §2 y antes del `---` que abre §3, crear la sección `### Gateway de validación de épicas` (C1) con:
  - La línea canónica, una sola vez en el documento e idéntica en contenido a la de T003.
  - El resumen de los tres resultados (`APPROVED` → `VALIDATE/DONE`; `NEEDS-CHANGES` o `BLOCKED` → `DEVELOP/IN-PROGRESS` y revisar `## Veredicto`; `--dry-run`, épica fuera de `VALIDATE` o reporte no escrito → sin cambio).
  - Que `DEVELOP → VALIDATE` es el gate de completitud de historias (`/epic-track-progress`), que el reporte permanece como evidencia y que `RESULTADO: ÉXITO` equivale a `VALIDATE/DONE`.
  - La nota de disponibilidad: runtimes con `support: supported` de `config/runtimes.json` tras `npx agile-sddf install --target <runtime>` con la estrategia `full`; `--strategy story` excluye `epic-*`. Sin enumerar runtimes.
  (D-6) // AC-1, AC-2, AC-3, CNF-1, CNF-2
- [x] T007 En `docs/architecture/state-machine.md`, sección «Nivel ÉPICA», justo después de la línea «Gate de calidad: `epic-format-validation` …», agregar la línea canónica (C2): una sola vez, con el mismo punto de entrada y las mismas transiciones que T003, terminada en `[detalle](../guides/sddf-commands-pipeline.md#gateway-de-validación-de-épicas)`. No editar el diagrama ni la línea «SHIP y COMPLETED son transiciones manuales» (D-6) // AC-1, AC-2, CNF-1

## 4. Pruebas automatizadas

- [x] T008 [P] Crear `test/epic-validate-gateway.test.js` (C3) con el estilo de `test/maintenance-contracts.test.js` (`node:test`, `node:assert/strict`, `REPO_ROOT` por `path.resolve(__dirname, '..')`).
  - Constantes `PREFIX = '**Gateway de validación de épicas:**'`, `ENTRY = '/epic-validate <EPIC-ID>'`, `APPROVE = 'VALIDATE/IN-PROGRESS → VALIDATE/DONE'` y `REWORK = 'VALIDATE → DEVELOP/IN-PROGRESS'`, cada una declarada una sola vez.
  - Un `test` que, para `skills/epic-validate/SKILL.md`, la guía y `state-machine.md`, extraiga las líneas que empiezan con `PREFIX`, exija exactamente una (el mensaje nombra el documento y la cantidad encontrada) y compruebe `ENTRY`, `APPROVE` y `REWORK` en ese orden.
  (D-5) // CNF-1
- [x] T009 [P] Agregar a `test/install.test.js`, después de «installSDDF copia el inventario fuente al destino canónico de cada runtime», la prueba `epic-validate se empaqueta y se instala con su SKILL.md en cada runtime soportado (STORY-127 AC-3, CS-8)` (C4):
  - Exige que exista `skills/epic-validate/SKILL.md` en la fuente, con el mensaje `skills/epic-validate/SKILL.md no existe en la fuente`.
  - Exige que alguna entrada de `package.json › files`, normalizada sin `/` final, sea `skills` o `skills/epic-validate`.
  - Con `createFixture`, `withInitCwd`, `withoutInstallLogs` y `destination`, ejecuta `installSDDF({ target: runtime.id })` para cada elemento de `RUNTIMES` y compara byte a byte `<destino>/<skillsDirectory>/epic-validate/SKILL.md` con la fuente.
  - No modifica `package.json` ni `scripts/install.js` (D-3, D-4).
  // AC-3, CNF-2, CS-8

## 5. Verificación

- [x] T010 Recorrido manual de AC-1 en un `REPO_ROOT` temporal fuera del repositorio (nunca versionado): épica fixture en `VALIDATE/IN-PROGRESS` con resultado `APPROVED`. Ejecutar `/epic-validate` y confirmar que `epic.md` queda en `VALIDATE/DONE` con `updated` de hoy, que la salida termina con la línea `Gateway:` y el bloque `RESULTADO: ÉXITO`, y que el reporte permanece. Registrar el resultado en `implement-report.md` (contrato de verificación 2) // AC-1 — recorrido acotado al Paso 5b sobre fixtures (ver implement-report.md)
- [x] T011 Recorrido manual de AC-2 con dos fixtures en `VALIDATE/IN-PROGRESS`, con resultado `NEEDS-CHANGES` y `BLOCKED`. Confirmar que `epic.md` pasa a `DEVELOP/IN-PROGRESS` y que la línea `Gateway:` remite a `## Veredicto`. Registrar el resultado en `implement-report.md` (contrato de verificación 3) // AC-2 — recorrido acotado al Paso 5b sobre fixtures (ver implement-report.md)
- [x] T012 Recorrido manual sin efectos: con `--dry-run` sobre una épica en `VALIDATE/IN-PROGRESS` y sin `--dry-run` sobre una épica en `DEVELOP`, confirmar que `epic.md` queda idéntico byte a byte y que la línea `Gateway:` explica el motivo. Registrar el resultado en `implement-report.md` (contrato de verificación 4) // AC-1, AC-2 — recorrido acotado al Paso 5b sobre fixtures (ver implement-report.md)
- [x] T013 Ejecutar `npm pack --dry-run --json` y confirmar que la lista de archivos incluye `skills/epic-validate/SKILL.md` (contrato de verificación 7) // AC-3, CNF-2
- [x] T014 Comprobar que los archivos editados son UTF-8 sin BOM, que `git status` no muestra cambios en `.claude/`, `.opencode/`, `.github/`, `.agents/`, `package.json` ni `config/runtimes.json`, y que la guía no enumera runtimes. Revisar que C5, C6, C1, C2 y C7 quedaron como describe design.md y que el fragmento del enlace de T007 (`#gateway-de-validación-de-épicas`) coincide con el ancla de GitHub del encabezado de T006 (contrato de verificación 1) // AC-1, AC-2, CNF-2
- [x] T015 Ejecutar `npm run verify:links`, `node --test test/epic-validate-gateway.test.js test/install.test.js`, `npm test` y `npm run verify:repository`, todos sin errores (contratos de verificación 5, 6 y 8) // CNF-1, AC-3, CS-21

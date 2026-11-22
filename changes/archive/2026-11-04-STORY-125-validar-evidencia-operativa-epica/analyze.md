---
type: analyze
id: STORY-125
slug: STORY-125-analyze-report
title: "Analyze: Validar la evidencia operativa de una épica"
story: STORY-125
design: STORY-125
tasks: STORY-125
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-125-validar-evidencia-operativa-epica
---

<!-- Referencias -->
[[STORY-125-validar-evidencia-operativa-epica]]

# Reporte de Coherencia: Validar la evidencia operativa de una épica

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (además de CNF-1 y CNF-2) |
| Alineación tareas → diseño | ✓ | 29/29 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 componentes con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | La historia está listada y su objetivo está alineado. Hay dos desalineaciones de alcance y vocabulario, registradas como CR (INC-001, INC-002, INC-003) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

> ⚠️ `testcases.md` no está presente: no se evaluó la cobertura de pruebas (modo `--only-tasks`). Las pruebas se especifican en design.md › Contratos de verificación (V-1…V-9) y en tasks.md, grupos 1, 5 y 7.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Evidencia operativa aprobada según el modo (auto: ejecución; manual: reporte existente o confirmación) | ✓ | C1, C2, C3, C6, C7. Tabla «Fuente de evidencia de un `SMOKE-N`». F1 y F2. D-1, D-2, D-4, D-6. V-1…V-3 |
| AC-2 | Evidencia operativa fallida (smoke test, `verify:release` o criterio del DoD) identificada con su resultado y su fuente | ✓ | C2, C3, C4, C5. Tabla «Comprobaciones operativas» y tabla de motivos. F3. D-5, D-7, D-9. V-4, V-6. El vocabulario se resuelve en D-7 y CR-001 |
| AC-3 | Controles opcionales no configurados: `verify:release` y DoD omitidos con una advertencia, sin degradar el veredicto, y smoke tests evaluados igualmente | ✓ | C3, C4, C5 (resultado `omitida`). F4. D-3, D-5. V-5 |
| CNF-1 | Trazabilidad de cada resultado con su fuente | ✓ | Sección `smoke-epica` (C9), columna «Fuente de evidencia», motivos `M-NNN`, D-10 |
| CNF-2 | Alcance acotado (`verify:release` en ambos modos; smoke tests solo en auto; sin reejecutar las historias) | ✓ | Tabla de evidencia por modo, D-3, Non-Goals |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar si ya existe el motor `check-command` de STORY-169 | C7, C8, D-8, CR-003 | ✓ |
| T002 | Scaffold de `epic-suites.js` y del helper de pruebas | C7, C8, I1 (Motor) | ✓ |
| T003 | Detección previa de script npm | C7, D-8 (STORY-169 D-2) | ✓ |
| T004 | `classifyCommand` (pass/fail/not-executable, duración, `outputTail`) | C7, I1 | ✓ |
| T005 | Subcomando `check-command`, parseo de argumentos, no escritura | C7, I1, CS-7 | ✓ |
| T006 | Comando de smoke tests con el ID ya sustituido | C7, D-2 | ✓ |
| T007 | Reglas de smoke tests e historia dueña en `story-sources.md` | C6 | ✓ |
| T008 | `--mode auto\|manual`, modo por defecto, dependencias y restricciones | C1, D-6, D-10, Interfaz «Invocación» | ✓ |
| T009 | Smoke tests, rama auto | C2, D-1, D-2, P7 | ✓ |
| T010 | Smoke tests, rama manual (reportes y confirmación) | C2, D-4, D-9, Interfaz «Confirmación manual» | ✓ |
| T011 | Agregación de `OPE-01` y sus motivos | C2, tabla «Comprobaciones operativas», tabla de motivos | ✓ |
| T012 | `OPE-02` `verify:release` | C3, D-3 | ✓ |
| T013 | `OPE-03` DoD de validación de épica | C4, D-5 | ✓ |
| T014 | Regla del veredicto con `omitida`, orden de motivos, consola y resumen | C5 | ✓ |
| T015 | Sección `smoke-epica` del template | C9 | ✓ |
| T016 | Sección `dod-epica` del template (I3 de STORY-169) | C9, D-5 | ✓ |
| T017 | Filas `OPE-*` en `## Comprobaciones` y `## Resumen`, y `verify:validation-contract` | C9, V-8 | ✓ |
| T018 | Eval de AC-1 en auto | C10, V-1 | ✓ |
| T019 | Evals de AC-1 en manual (reporte y confirmación) | C10, V-2, V-3 | ✓ |
| T020 | Evals de AC-2 con evidencia fallida (tres casos) | C10, V-4 | ✓ |
| T021 | Eval de `BLOCKED` sin `verify.e2e-smoke` en auto | C10, V-6 | ✓ |
| T022 | Eval de AC-3 | C10, V-5 | ✓ |
| T023 | Fila `epic-validate` de `domain-skills-map.md` | C11 | ✓ |
| T024 | Aplicar CR-001 en `story.md` | CR-001, D-7 | ✓ |
| T025 | Registrar CR-002 en `epic.md` › Notas | CR-002, D-5 | ✓ |
| T026 | `node --test` y `npm test` | V-7 | ✓ |
| T027 | `npm run verify:repository` | V-8, V-9 | ✓ |
| T028 | Ejecutar el motor sobre el repositorio (`verify:release`, `test:e2e:smoke`) | Risks (BLOCKED en auto sobre EPIC-23), V-7 | ✓ |
| T029 | Evals pendientes de ejecución manual | V-1…V-6, `AGENTS.md` | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 Paso «Modo de evidencia» | Componentes | T008 | ✓ |
| C2 Paso «Smoke tests de la épica» (`OPE-01`) | Componentes | T009, T010, T011 | ✓ |
| C3 Paso «Verificación de release» (`OPE-02`) | Componentes | T012 | ✓ |
| C4 Paso «DoD de validación de épica» (`OPE-03`) | Componentes | T013 | ✓ |
| C5 Regla del veredicto | Componentes | T014 | ✓ |
| C6 Reglas de pertenencia de smoke tests | Componentes | T007 | ✓ |
| C7 Motor `check-command` | Componentes | T001–T006 | ✓ |
| C8 Pruebas del motor | Componentes | T002–T006, T026 | ✓ |
| C9 Secciones del reporte | Componentes | T015, T016, T017 | ✓ |
| C10 Casos de eval | Componentes | T018–T022, T029 | ✓ |
| C11 Mapa de skills | Componentes | T023 | ✓ |
| Interfaz «Invocación» | Interfaces | T008 | ✓ |
| Interfaz «Comando de smoke tests» (`{{smoke_id}}`) | Interfaces | T006, T009 | ✓ |
| Interfaz «Comando de release» | Interfaces | T012 | ✓ |
| Interfaz «Motor (I1 de STORY-169)» | Interfaces | T002–T005 | ✓ |
| Interfaz «Lectura de reportes de la historia dueña» | Interfaces | T010 | ✓ |
| Interfaz «Confirmación manual» | Interfaces | T010, T013 | ✓ |
| Interfaz «Lectura del DoD» | Interfaces | T013 | ✓ |
| Interfaz «Salida en consola» | Interfaces | T014 | ✓ |
| Degradación gradual (P7) | Decisions › Degradación gradual | T009, T010, T012 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:54`: `STORY-125 — Validar la evidencia operativa de una épica`. Es dueña de CS-4 y SMOKE-1 (`epic.md:199`) |
| Objetivo de la historia alineado con la épica | ✓ | «evitar liberar una épica cuyo comportamiento operativo o controles de calidad fallan» corresponde a la fase VALIDATE (`epic.md:29`) y a CS-4 (`epic.md:74`) |
| Restricciones de la épica respetadas | ⚠️ | El AC-2 usa `BLOCKED` para la evidencia fallida, contra la decisión del PO (`epic.md:189-193`). El diseño lo corrige con D-7 y CR-001. El reparto del DoD con STORY-169 y la regla del modo por defecto quedan abiertos entre historias (INC-002, INC-003) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** `story.md` › AC-2 dice «Entonces el reporte queda BLOCKED» ante un smoke test, un `verify:release` o un criterio del DoD que falla. La decisión del PO del 2026-10-17 (`epic.md` › Notas, «Vocabulario del veredicto de `epic-validate`») y G-05 exigen `NEEDS-CHANGES` en ese caso, y `epic.md` › «Alineación pendiente» lo lista para STORY-124 a STORY-128. design.md aplica `NEEDS-CHANGES` (D-7), y tasks.md T020 lo verifica, así que el plan es coherente con la épica pero no con el texto literal del AC.
- **Archivo afectado:** story.md — sección «AC-2 — Escenario alternativo — Evidencia operativa fallida» y la primera nota de «📎 Notas / contexto adicional»
- **Acción requerida:** aplicar CR-001 antes de implementar o con T024, para que la aceptación (`/story-acceptance`) no evalúe AC-2 contra `BLOCKED`.

### INC-002 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** el DoD de épica tiene dos dueños diseñados. design.md D-5 deja a STORY-125 como dueña de `OPE-03` en ambos modos. `STORY-169/design.md` (C4, D-6, CR-002) también lo evalúa, solo en `--mode auto`, y propone lo contrario: retirarlo de STORY-125. Hasta que la épica se refine, si se implementan las dos historias tal como están, el DoD se evaluaría dos veces con semánticas distintas en `--mode manual`.
- **Archivo afectado:** design.md — sección «Registro de Cambios (CR)», CR-002; `specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/design.md` — CR-002
- **Acción requerida:** que el PO decida quién es dueño del DoD al refinar EPIC-23 (T025 registra la propuesta). Si la decisión es dejarlo en STORY-169, retirar T013, T016 y la fila de DoD de T020 con `/story-fix-plan STORY-125`.

### INC-003 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** la regla del modo por defecto (sin `--mode`, auto si `verify.e2e-smoke.command` está declarado) de design.md D-6 y tasks.md T008 adelanta parte de la «mecánica de invocación de los modos», que `story.md` › Fuera de alcance asigna a STORY-126. Además, la nota de STORY-126 dice «cuando hay tests configurados», sin precisar qué clave de `verify` cuenta. La nota de la historia autoriza simular el modo como un parámetro, pero no fija un valor por defecto.
- **Archivo afectado:** design.md — D-6; tasks.md — T008
- **Acción requerida:** al diseñar STORY-126, reutilizar o reemplazar explícitamente la regla de D-6 y precisar qué significa «tests configurados». Si se prefiere no adelantarla, reducir T008 a «`--mode` obligatorio en esta versión».

---

## Recomendaciones

1. Aplicar CR-001 en `story.md` (AC-2 y Notas) antes de `/story-implement-tasks STORY-125`, o como primera tarea (mover T024 al inicio), para que el AC literal coincida con el vocabulario que verifican T020 y T021.
2. Llevar CR-002 a la sesión de refinamiento de EPIC-23 con una sola pregunta para el PO: «¿El DoD de épica lo evalúa STORY-125 en ambos modos o STORY-169 solo en `--mode auto`?». Después, ajustar el plan perdedor con `/story-fix-plan`.
3. Documentar en `STORY-126/story.md` › Notas que la regla del modo por defecto ya implementada por STORY-125 (D-6) es el punto de partida de su diseño.
4. Mantener el orden de CR-003: el grupo 1 (motor) puede empezar antes de que se entregue STORY-124. Los grupos 2 a 5 se bloquean si `skills/epic-validate/` no existe.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-125` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-125` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` (`enforcement: error`): 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (esquema con 3 ejemplos), AC-2 y AC-3 en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «AC que satisface» en Componentes e Interfaces, columna «AC» en Decisiones técnicas, y `// satisface:` en Goals, Esquema de datos y Flujos |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1…D-10. «Open Questions: no queda ninguna abierta». CR-001…CR-003 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (29 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea tiene un entregable verificable y trazabilidad `// AC-n`. AC-1 → T009, T010, T018, T019; AC-2 → T011–T013, T020, T021; AC-3 → T012, T013, T022 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (modo `--only-tasks`) |

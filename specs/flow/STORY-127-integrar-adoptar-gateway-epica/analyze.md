---
type: analyze
id: STORY-127
slug: STORY-127-analyze-report
title: "Analyze: Integrar y documentar el gateway de validación de épicas"
story: STORY-127
design: STORY-127
tasks: STORY-127
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-127-integrar-adoptar-gateway-epica
---

<!-- Referencias -->
[[STORY-127-integrar-adoptar-gateway-epica]]

# Reporte de Coherencia: Integrar y documentar el gateway de validación de épicas

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (además CNF-1, CNF-2, CS-8 y CS-21) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 15/15 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 7/7 componentes y 10/10 interfaces con tarea; la ruta de degradación de T001/T002 ya coincide con el diseño (INC-001 anterior resuelto) |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Listada, objetivo alineado y CS-7 admite el gateway; dos textos de epic.md siguen desactualizados (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

Contexto de esta ejecución: regeneración tras `/story-fix-plan STORY-127` (fix-plan-report.md). De los tres WARNING del reporte anterior, dos quedaron resueltos en design.md y tasks.md (ruta de degradación de T001/T002 y premisa sobre `verify:links`); el tercero está en epic.md, fuera del alcance de `/story-fix-plan`, y se mantiene como INC-001.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Con `verdict: APPROVED`, `/epic-validate` (sin `--dry-run`) pasa la épica de `VALIDATE/IN-PROGRESS` a `VALIDATE/DONE` y el reporte permanece como evidencia | ✓ | Goals (líneas 45 y 47 de design.md); C5, C6, C7; interfaces «Lectura del veredicto», «Lectura del estado», «Escritura en `epic.md`», «Línea `Gateway:`», «Fallo al escribir `epic.md`»; tabla de decisión (filas 1 y 2); F1, F3; D-1, D-2, D-7, D-9, D-10, D-11 |
| AC-2 | Con `NEEDS-CHANGES` o `BLOCKED`, la épica vuelve a `DEVELOP/IN-PROGRESS`, se remite a `## Veredicto` y no queda en `VALIDATE/DONE` | ✓ | Goals (líneas 46 y 47); C5, C6, C7; interfaz «Línea `Gateway:`» (remisión a `## Veredicto`); tabla de decisión (fila 3); F2; D-7, D-8, D-9 |
| AC-3 | `skills/epic-validate/` figura en `files` de `package.json` y el destino de cada runtime `supported` contiene su `SKILL.md` | ✓ | Goal (línea 49); C4; interfaz «Prueba C4»; resumen de C1 (disponibilidad); F4; D-3, D-4; CR-003; contratos de verificación 6 y 7 |
| CNF-1 | `SKILL.md`, la guía del pipeline y `state-machine.md` nombran el mismo punto de entrada y las mismas transiciones | ✓ | C1, C2, C3, C5; interfaces «Línea canónica del gateway», «Encabezado de C1», «Remisión desde C2», «Prueba C3»; F5; D-5, D-6; contratos 1 y 5 |
| CNF-2 | La disponibilidad no depende de carpetas de runtime del repositorio fuente | ✓ | Non-Goals (no se editan `.claude/`, `.opencode/`, `.github/`, `.agents/`); C4 itera `config/runtimes.json`; F4 |

Hechos del diseño verificados en el filesystem (2026-10-29): `skills/epic-validate/` no existe; `package.json › files` contiene `"skills/"` (línea 23); no hay `.npmignore`; `test/install.test.js` define `RUNTIMES` (línea 26), `createFixture` (28), `withInitCwd` (42), `withoutInstallLogs` (54), `destination` (93) y la prueba «installSDDF copia el inventario fuente al destino canónico de cada runtime» (131); `test/maintenance-contracts.test.js` existe; `state-machine.md` tiene la línea «Gate de calidad: `epic-format-validation` …» (línea 180) y «SHIP y COMPLETED son transiciones manuales» (178); `sddf-commands-pipeline.md` §2 empieza en la línea 176, el `---` que abre §3 está en la 201 y §3 en la 203. La premisa corregida de «Remisión desde C2» es exacta: `scripts/check-doc-links.js` › `ACTIVE_ROOTS` (líneas 17-26) no incluye `docs/architecture/`, `githubAnchor` normaliza con NFKD el encabezado (línea 84) y el fragmento solo pasa a minúsculas (línea 223).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar que STORY-124 y STORY-126 están implementadas; si no, ejecutar solo T006, T007 y T005 condicional | Risks/Trade-offs (segundo riesgo: «C1 y C2 no dependen del skill»); Degradación gradual (P7) | ✓ |
| T002 | Confirmar que CS-7 de EPIC-23 admite la excepción del gateway; si no, continuar solo con T006 y T007 | CR-004; C6; Risks (primer riesgo) | ✓ |
| T003 | Paso «Gateway de transición» en `SKILL.md` | C5; interfaces «Línea canónica», «Lectura del veredicto», «Lectura del estado», «Escritura en `epic.md`», «Línea `Gateway:`», «Fallo al escribir `epic.md`»; tabla de decisión; D-1, D-2, D-7 a D-11 | ✓ |
| T004 | Excepción del gateway en «Política de efectos» | C6; interfaz «Escritura en `epic.md`»; D-1 | ✓ |
| T005 | Fila de `epic-validate` en `domain-skills-map.md` | C7 | ✓ |
| T006 | Sección `### Gateway de validación de épicas` en la guía | C1; interfaz «Encabezado de C1»; «Resumen de C1»; D-6 | ✓ |
| T007 | Línea canónica en `state-machine.md` con enlace a C1 | C2; interfaz «Remisión desde C2»; D-6 | ✓ |
| T008 | `test/epic-validate-gateway.test.js` | C3; interfaz «Prueba C3»; D-5 | ✓ |
| T009 | Prueba de distribución en `test/install.test.js` | C4; interfaz «Prueba C4»; D-3, D-4 | ✓ |
| T010 | Recorrido manual de AC-1 | Contrato de verificación 2; F1 | ✓ |
| T011 | Recorrido manual de AC-2 | Contrato de verificación 3; F2 | ✓ |
| T012 | Recorrido manual sin efectos (`--dry-run`, épica en `DEVELOP`) | Contrato de verificación 4; F3 | ✓ |
| T013 | `npm pack --dry-run --json` incluye `skills/epic-validate/SKILL.md` | Contrato de verificación 7; F4 | ✓ |
| T014 | Encoding, `git status` sin cambios fuera de alcance, revisión de C5, C6, C1, C2 y C7 y coincidencia del ancla de T007 con el encabezado de T006 | Contrato de verificación 1; interfaz «Remisión desde C2»; Non-Goals | ✓ |
| T015 | `verify:links`, pruebas C3/C4, `npm test` y `verify:repository` | Contratos de verificación 5, 6 y 8 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 — Sección «Gateway de validación de épicas» | Decisions › Componentes | T006 | ✓ |
| C2 — Línea de gateway del nivel ÉPICA | Decisions › Componentes | T007 | ✓ |
| C3 — Prueba de consistencia del gateway | Decisions › Componentes | T008 | ✓ |
| C4 — Prueba de distribución de `epic-validate` | Decisions › Componentes | T009 | ✓ |
| C5 — Paso «Gateway de transición» | Decisions › Componentes | T003 | ✓ |
| C6 — Excepción en «Política de efectos» | Decisions › Componentes | T004 | ✓ |
| C7 — Fila en el mapa de skills | Decisions › Componentes | T005 | ✓ |
| Línea canónica del gateway | Interfaces | T003, T006, T007 | ✓ |
| Lectura del veredicto | Interfaces | T003 | ✓ |
| Lectura del estado de la épica | Interfaces | T003 | ✓ |
| Escritura en `epic.md` | Interfaces | T003, T004 | ✓ |
| Línea `Gateway:` | Interfaces | T003 | ✓ |
| Fallo al escribir `epic.md` | Interfaces | T003 | ✓ |
| Encabezado de C1 | Interfaces | T006 | ✓ |
| Remisión desde C2 | Interfaces | T007 (enlace) y T014 (revisión del ancla, contrato 1) | ✓ |
| Prueba C3 | Interfaces | T008 | ✓ |
| Prueba C4 | Interfaces | T009 | ✓ |
| Mitigación «C1 y C2 no dependen del skill» | Risks / Trade-offs (segundo riesgo) | T001 y T002 (ruta de degradación: T006 y T007) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | epic.md › «Historias» › Fase VALIDATE (línea 56): «**STORY-127** — Integrar y documentar el gateway de validación de épicas». Dueña de CS-8 según «Notas» (línea 199) |
| Objetivo de la historia alineado con la épica | ✓ | «Para que ninguna épica quede lista para `SHIP` sin un veredicto APPROVED vigente» coincide con la nota «Posición de `epic-validate`» (línea 184), que ya recoge el gateway `VALIDATE/IN-PROGRESS → VALIDATE/DONE` y la vuelta a `DEVELOP/IN-PROGRESS` |
| Restricciones de la épica respetadas | ✓ | CS-7 (línea 78) admite la escritura de `status`, `substatus` y `updated` de `epic.md` fuera de `--dry-run` y con la épica en `VALIDATE` (C6, tabla de decisión); D-9 deja `SHIP` a `epic-ship` con confirmación; Non-Goals excluye CS-20 (STORY-175); CS-21 cubierto por T015 |
| Textos de la épica sobre STORY-127 | ⚠️ | Dos textos de epic.md siguen desactualizados respecto de la historia refinada (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D — desalineación con la épica
- **Descripción:** dos textos de epic.md no reflejan la historia refinada: (1) «Historias» › Fase VALIDATE (línea 56) resume STORY-127 como «aplicar el gateway antes de la transición», cuando el gateway escribe la transición `VALIDATE/IN-PROGRESS → VALIDATE/DONE` o la vuelta a `DEVELOP/IN-PROGRESS`; (2) «Notas» › «Alineación pendiente de historias existentes» (línea 196) afirma que «STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED`», pero STORY-127 ya usa los tres valores (AC-2 y nota «Contrato consumido», CR-002 resuelto). Persiste del reporte anterior: `/story-fix-plan` lo clasificó fuera de alcance. La historia no incumple ninguna restricción de la épica y design.md y tasks.md no requieren cambios.
- **Archivo afectado:** specs/flow/EPIC-23-completar-flujo-de-epic/epic.md — secciones «Historias» (Fase VALIDATE, línea 56) y «Notas» (Alineación pendiente, línea 196)
- **Acción requerida:** actualizar ambos textos en epic.md.

---

## Recomendaciones

1. **INC-001** — En epic.md, reescribir la línea 56 (por ejemplo: «aplicar el veredicto como gateway de `VALIDATE/DONE` o de vuelta a `DEVELOP/IN-PROGRESS` y hacerlo disponible en los runtimes soportados») y en la línea 196 excluir a STORY-127 («STORY-124 a STORY-126 y STORY-128 todavía usan…»). Corresponde a una edición del PO o a un skill de épica; no bloquea la implementación.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-127` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-127` |

Dependencia de implementación (design.md, Risks): STORY-124 y STORY-126 están en `READY-FOR-IMPLEMENT/DONE` y `skills/epic-validate/` todavía no existe. T001 hace explícita la precondición y la ruta de degradación (T006, T007 y T005 condicional).

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` · `enforcement: error`

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (esquema del escenario con `NEEDS-CHANGES` y `BLOCKED`) y AC-3 (adopción) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (tabla de cobertura) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals, tabla de decisión, resumen de C1 y flujos F1-F5 con `// satisface:`; componentes, interfaces, decisiones y contratos con columna «AC» |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: ninguna»; alineaciones con otros artefactos como CR-005 a CR-007. La verificación del enlace de C2 ya no depende de `verify:links`: queda en la revisión documental (contrato 1, T014), con la premisa corregida y verificada en `check-doc-links.js` |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001-T015) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1: T003, T004, T010; AC-2: T003, T004, T011; AC-3: T009, T013. Cada tarea toca un componente o un contrato de verificación (T003 agrupa en un solo paso los elementos de C5) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |

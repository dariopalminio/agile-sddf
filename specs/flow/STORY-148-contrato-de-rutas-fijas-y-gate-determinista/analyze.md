---
type: analyze
id: STORY-148
slug: STORY-148-analyze-report
title: "Analyze: Contrato de rutas fijas y gate determinista"
story: STORY-148
design: STORY-148
tasks: STORY-148
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
---

<!-- Referencias -->
[[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]]

# Reporte de Coherencia: Contrato de rutas fijas y gate determinista

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y 3/3 CNF) |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 16/16 elementos con tarea (9 componentes, 7 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | Listada en el índice de historias; contribuye a CS-2, CS-3 y CS-12 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Skill con el contrato de layout fijo pasa el gate (bloque solo con `REPO_ROOT` y rutas fijas) | ✓ | D-1 (R1 marcador, R2 tokens `REPO_ROOT`/`specs/flow/`/`docs/templates/`/`docs/guardrails/`), D-2 (`checkSkillLayout`, `verifyFixedLayout`, CLI `[OK]`), D-4 (lista transitoria para mantener el gate verde), D-6 (paso `contrato de layout fijo` en `verify-repository.js`), F-1, contratos #1, #2 |
| AC-2 | Skill con resolución legada hace fallar el gate; el mensaje nombra skill y línea; `skill-preflight` exento en su diagnóstico | ✓ | D-1 (R3/R4 con línea 1-based y formato `skills/<skill>/SKILL.md:<línea>: referencia legada …`), D-3 (región `SDDF-LEGACY-DIAGNOSTIC` solo en `skill-preflight`), D-6 (eliminación del auditor legado), F-2, F-3, contratos #3, #4, #5 |
| CNF-1 | Determinismo: sin entorno ni `sddf.config.yaml` | ✓ | D-2 «Determinismo», D-7 caso «Determinismo», contrato #6 |
| CNF-2 | Solo Node.js, sin dependencias nuevas | ✓ | D-2 (solo `node:fs`/`node:path`), contrato #7 |
| CNF-3 | `npm test` cubre conforme, legado y excepción de `skill-preflight` | ✓ | D-7 (tabla de 12 casos), contrato #8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar ADR-0016 `ACCEPTED` y si incluye el marcador | Risks (1.ª fila), CR-001 | ✓ |
| T002 | Línea base `npm test`/`verify:repository`, `ls skills/`, `git grep` de referencias | Context, D-4 (valor inicial), D-6 | ✓ |
| T003 | Crear `test/verify-fixed-layout.test.js` y helpers de fixture | D-7, componente «Pruebas del validador» | ✓ |
| T004 | Casos R1–R4 de `checkSkillLayout` | D-1, D-7 | ✓ |
| T005 | Casos de la región de diagnóstico | D-3, D-7 | ✓ |
| T006 | Casos de `verifyFixedLayout` (lista, higiene, determinismo) | D-4, D-7 | ✓ |
| T007 | RED | D-7 | ✓ |
| T008 | Crear `scripts/verify-fixed-layout.js` y constantes | D-1, D-2, D-4, interfaz «Marcador del contrato» | ✓ |
| T009 | `checkSkillLayout` puro (R1–R4, región) | D-1, D-3, interfaces «Bloque», «Región», `checkSkillLayout` | ✓ |
| T010 | Trasladar chequeos heredados conservados | D-5 | ✓ |
| T011 | `verifyFixedLayout` | D-2, D-4, interfaz `verifyFixedLayout`, Esquema de datos | ✓ |
| T012 | CLI y exports | D-2, interfaz CLI | ✓ |
| T013 | GREEN y ejecución sobre el repo real | Contratos #1, #3–#6 | ✓ |
| T014 | Paso del gate en `verify-repository.js` | D-6, interfaz «Paso del gate» | ✓ |
| T015 | Label en `test/verify-repository.test.js` | D-6, CR-002 | ✓ |
| T016 | `verify.integration.command` en `sddf.config.yaml` | D-6 | ✓ |
| T017 | Comando en `config/profiles.json` | D-6, CR-002 | ✓ |
| T018 | Fixture de `test/profile-contract.test.js` | D-6 | ✓ |
| T019 | Alias `verify:layout` en `package.json` | D-2, D-6 | ✓ |
| T020 | Eliminar `scripts/audit-root-resolution.js` | D-6, contrato #9 | ✓ |
| T021 | Verificar AC-1 | F-1, contratos #1, #2, #8 | ✓ |
| T022 | Verificar AC-2 en copia temporal | F-2, F-3, contratos #3–#5 | ✓ |
| T023 | Verificar CNF-1/CNF-2 | Contratos #6, #7 | ✓ |
| T024 | Verificar perfiles y alcance | Contratos #10, #11 | ✓ |
| T025 | Encoding y `graphify update .` | Regla transversal de `AGENTS.md` y del skill (encoding); no es elemento de diseño pero no introduce decisiones | ✓ |
| T026 | Registrar CR-001/CR-002 en `implement-report.md` | CR-001, CR-002 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Validador `scripts/verify-fixed-layout.js` | Componentes afectados; D-2 | T008–T012 | ✓ |
| Pruebas `test/verify-fixed-layout.test.js` | Componentes afectados; D-7 | T003–T007 | ✓ |
| Gate `scripts/verify-repository.js` | Componentes afectados; D-6 | T014 | ✓ |
| `test/verify-repository.test.js` | Componentes afectados; D-6 | T015 | ✓ |
| `sddf.config.yaml` | Componentes afectados; D-6 | T016 | ✓ |
| `config/profiles.json` | Componentes afectados; D-6 | T017 | ✓ |
| `test/profile-contract.test.js` | Componentes afectados; D-6 | T018 | ✓ |
| `package.json` | Componentes afectados; D-6 | T019 | ✓ |
| Auditor legado (eliminar) | Componentes afectados; D-6 | T020 | ✓ |
| Marcador del contrato | Interfaces; D-1 | T008, T009 | ✓ |
| Bloque del contrato (R2) | Interfaces; D-1 | T009 | ✓ |
| Región de diagnóstico | Interfaces; D-3 | T009, T005 | ✓ |
| `checkSkillLayout` | Interfaces; D-2 | T009 | ✓ |
| `verifyFixedLayout` | Interfaces; D-2 | T011 | ✓ |
| CLI `--quiet`/`--json` | Interfaces; D-2 | T012 | ✓ |
| Paso del gate | Interfaces; D-6 | T014 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:23` — STORY-148 «Contrato de rutas fijas y gate determinista: … adaptar `scripts/audit-root-resolution.js` (o su reemplazo) y `verify:repository`» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» de story.md apunta a CS-2 (`epic.md:38`), CS-3 (`epic.md:39`) y CS-12 (`epic.md:48`); design D-1 R3 cubre CS-2, R4 cubre CS-3 y D-4 mantiene CS-12 en verde durante la migración |
| Restricciones de la épica respetadas | ✓ | Sin migración de skills (Non-Goals de story y design); stack Node sin dependencias (CNF-2); la lista transitoria queda vacía en STORY-157 AC-3 (design D-4) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E: criterio DoD PLAN con evidencia insuficiente (⚠️, regla de duda)
- **Descripción:** AC-1 dice «el chequeo de contrato de layout **reporta el skill como conforme**». El diseño cubre la conformidad (`checkSkillLayout` → `[]`), pero la salida solo es agregada: el CLI imprime `[OK] Contrato de layout fijo verificado en <N> skill(s); <M> pendiente(s)` (design D-2, fila «CLI») y el resultado de `verifyFixedLayout` expone `skills` y `pending` (design «Esquema de datos», línea ~239) sin distinguir explícitamente los skills conformes. El reporte por skill es derivable (`skills − pending` sin errores), no explícito.
- **Archivo afectado:** design.md — secciones «D-2 — Validador nuevo» y «Esquema de datos»; tasks.md — T011, T012
- **Acción requerida:** decidir si la salida debe nombrar los skills conformes (p. ej. campo `conforming: [string]` en el resultado y en `--json`, o línea `[OK] <skill>` por skill fuera de la lista) y reflejarlo en D-2, Esquema de datos, T011/T012 y en el caso «Conforme» de T004/T006. Si basta la salida agregada, dejarlo explícito en D-2 como interpretación de AC-1.

---

## Recomendaciones

1. **INC-001:** con `/story-fix-plan STORY-148`, añadir a design.md › D-2 y › Esquema de datos el campo `conforming` (skills fuera de `PENDING_MIGRATION` sin errores) incluido en `--json`, y a T011/T012 su cálculo e impresión; extender el caso «Conforme» de T006 para afirmar que el skill aparece en `conforming`. No bloquea la implementación.
2. **Aviso de precondición (no es inconsistencia):** ADR-0016 aún no existe en `docs/adr/` y STORY-147 está `READY-FOR-IMPLEMENT/DONE`. Implementar STORY-147 antes que STORY-148 e incluir en ADR-0016 el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, el texto canónico del bloque y la región `SDDF-LEGACY-DIAGNOSTIC` (design CR-001). T001 detiene la implementación si el ADR no está `ACCEPTED`.
3. **Retroalimentación a story.md (CR-002 del diseño):** añadir `config/profiles.json` y `test/verify-repository.test.js` a «Alcance mínimo del contrato» de story.md; el plan ya los incluye (D-6, T015, T017).
4. **T022 (eficiencia):** la «copia temporal del repo» basta con `scripts/verify-fixed-layout.js`, `skills/`, `.env.template` y los `ACTIVE_DOCS`; no es necesario copiar el repositorio completo.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-148` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-148` |

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (modo `--only-tasks`). Los casos de prueba del validador están especificados en design D-7 y en T003–T006.

---

## Cumplimiento DoD — Fase PLAN

`enforcement: error` (`docs/guardrails/dod-story-plan.md`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal) y AC-2 (alternativo/error) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ⚠️ | WARNING | AC-1 y AC-2 cubiertos; la cláusula «reporta el skill como conforme» de AC-1 solo es derivable de la salida agregada (INC-001) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-7, Esquema y Flujos con `// satisface:`; tablas de componentes e interfaces con columna «AC que satisface» |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; marcador y bloque decididos en D-1 y registrados como CR-001; referencias extra como CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (26 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Tareas de un archivo o una función cada una; AC-1 verificado en T021, AC-2 en T022 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica (testcases.md ausente) |

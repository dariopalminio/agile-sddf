---
type: epic-validate
id: EPIC-28
slug: EPIC-28-calibrar-story-code-review-con-review-md-validate-report
title: "Epic validate: Calibrar story-code-review con REVIEW.md"
epic: EPIC-28
verdict: NEEDS-CHANGES
created: 2026-11-12
updated: 2026-11-12
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
---
<!-- Referencias -->
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# Validación de épica: Calibrar story-code-review con REVIEW.md

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 10 motivo(s) de rechazo
Gateway: si la épica está en `VALIDATE`, `APPROVED` la deja en `VALIDATE/DONE` y otro veredicto la devuelve a `DEVELOP/IN-PROGRESS` (Paso 5b).

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-28 (`specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md`) |
| Historias terminadas | 0 |
| Historias canceladas | 0 |
| Historias no terminales | 9 |
| Análisis de la épica | `APPROVED` |
| Smoke tests | 4/4 (modo `manual`) |
| Fecha | 2026-11-12 |
| Template de reporte | `skills/epic-validate/assets/epic-validate-report-template.md` (seed) |

## Comprobaciones

| ID | Comprobación | Resultado | Evidencia |
|---|---|---|---|
| EST-01 | Cierre de las historias | no cumple | 0 terminadas · 0 canceladas · 9 no terminales |
| EST-02 | Análisis de la épica | cumple | `specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic-analyze-report.md` · `APPROVED` · updated `2026-11-12` |
| OPE-01 | Smoke tests de la épica | cumple | 4 aprobado · 0 fallido · 0 no ejecutable · 0 sin evidencia |
| OPE-02 | verify:release | cumple | `npm run verify:release` · pasa (4.3 s) |
| OPE-03 | DoD de validación de épica | no cumple | 2 cumplido · 1 incumplido · 0 sin evidencia |
| OPE-04 | Suites de nivel épica | no ejecutada | 0 pasa · 0 fallida · 0 no ejecutable · 0 omitida — solo en --mode auto |

## Historias de la épica

| ID | Status | Substatus | Ubicación | Clasificación |
|---|---|---|---|---|
| STORY-177 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-178 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-179 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-180 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-181 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-182 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-183 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-184 | `ACCEPTANCE` | `DONE` | activa | no terminal |
| STORY-185 | `ACCEPTANCE` | `DONE` | activa | no terminal |

## Smoke tests de la épica

Modo: `manual` (por defecto)

| SMOKE | Nombre | Resultado | Fuente de evidencia | Historia dueña |
|---|---|---|---|---|
| SMOKE-1 | `Revisión calibrada por REVIEW.md` | aprobado | reporte: `specs/flow/STORY-180-story-code-review-lee-review-md/verify-report.md` (verdict: APPROVED) | `STORY-180` |
| SMOKE-2 | `Un defecto preexistente no bloquea` | aprobado | reporte: `specs/flow/STORY-181-hallazgos-preexistentes/verify-report.md` (verdict: APPROVED) | `STORY-181` |
| SMOKE-3 | `Proyecto consumidor sin REVIEW.md` | aprobado | reporte: `specs/flow/STORY-180-story-code-review-lee-review-md/verify-report.md` (verdict: APPROVED) | `STORY-180` |
| SMOKE-4 | `REVIEW.md semilla` | aprobado | reporte: `specs/flow/STORY-184-review-md-semilla-para-proyectos-consumidores/verify-report.md` (verdict: APPROVED) | `STORY-184` |

## DoD de validación de épica

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| 1 | `El gate determinista del repositorio pasa: npm run verify:repository` | cumplido | ejecución: `npm run verify:repository` · código 0 (110.7 s) |
| 2 | `Cada smoke test que ningún eval cubre de punta a punta se recorrió a mano y su resultado quedó registrado` | incumplido | confirmación manual del mantenedor (negativa) |
| 3 | `Los criterios de salida (CS-N) de la épica se cumplen en su totalidad (donde N es el número de criterio de salida)` | cumplido | confirmación manual del mantenedor |

Enforcement: `error`

## Suites de nivel épica

| Suite | Required | Comando | Resultado | Duración (s) | Motivo |
|---|---|---|---|---|---|
| integration | `true` | `node scripts/verify-fixed-layout.js` | no ejecutada | — | solo en --mode auto |
| e2e | `false` | `manual` | no ejecutada | — | solo en --mode auto |
| e2e-regression | `false` | `npm run test:e2e:regression` | no ejecutada | — | solo en --mode auto |

## Motivos

### M-010 [NEEDS-CHANGES] — OPE-03: criterio 2

- **Evidencia:** `Cada smoke test que ningún eval cubre de punta a punta se recorrió a mano y su resultado quedó registrado` · confirmación manual del mantenedor (negativa)
- **Acción sugerida:** cumplir el criterio 2 de dod-epic-validate.md

Para SMOKE-4 faltan dos evals de sddf-constitution, que nunca se ejecutaron:

Eval	Qué parte de SMOKE-4 cubre
TC-001 crea-review-md-si-falta	La 1.ª ejecución crea REVIEW.md con las cuatro secciones.
TC-003 segunda-ejecucion-no-modifica-review-md	La 2.ª ejecución no modifica REVIEW.md.

npm run test:eval -- sddf-constitution --only TC-001,TC-003
Sin --only corren los cuatro casos (TC-002 y TC-004 tampoco tienen ejecución registrada, aunque no son de SMOKE-4).

Aunque pasen los dos evals, el criterio 2 sigue sin cumplirse. SMOKE-4 son dos ejecuciones seguidas sobre el mismo proyecto, y cada eval simula solo una:

TC-003 no ejecuta la primera corrida: parte de un REVIEW.md ya creado.
TC-003 solo revisa la consola: busca el mensaje ℹ️ Conservado: REVIEW.md (ya existe), pero no comprueba que el archivo quede igual byte a byte.
Entonces SMOKE-4 sigue siendo el smoke test que ningún eval cubre de punta a punta, y el criterio 2 pide un recorrido manual registrado. Puedes cumplirlo de dos formas:

Recorrido manual en sesión limpia (lo que pide el criterio tal como está escrito):
En un proyecto temporal sin REVIEW.md, instala agile-sddf y ejecuta /sddf-constitution dos veces.
Anota el SHA-256 de REVIEW.md después de cada ejecución.
Registra el resultado, por ejemplo en tests-evidence.md de la épica.
Aceptar T013 de STORY-184 como ese recorrido: ya hizo eso mismo con hashes; su única diferencia es que corrió en la sesión del agente. En ese caso, en la próxima /epic-validate responde s al criterio 2.

## Notas de la validación

- `specs/flow/STORY-177-corregir-rutas-story-code-review/` … `specs/flow/STORY-185-tope-de-low-y-arrastres/`: ninguna historia dueña tiene `acceptance-report.md`; la evidencia de los cuatro `SMOKE-N` proviene de `verify-report.md`.

---
type: epic-validate
id: EPIC-23
slug: EPIC-23-completar-flujo-de-epic-validate-report
title: "Epic validate: Completar flujo de epic"
epic: EPIC-23
verdict: NEEDS-CHANGES
created: 2026-11-04
updated: 2026-11-04
related:
  - EPIC-23-completar-flujo-de-epic
---
[[EPIC-23-completar-flujo-de-epic]]

# Validación de épica: Completar flujo de epic

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 26 motivo(s) de rechazo
Gateway: si la épica está en `VALIDATE`, `APPROVED` la deja en `VALIDATE/DONE` y otro veredicto la devuelve a `DEVELOP/IN-PROGRESS` (Paso 5b).

## Resumen

| Métrica | Valor |
|---|---|
| Épica | `EPIC-23` (`specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`) |
| Historias terminadas | 0 |
| Historias canceladas | 0 |
| Historias no terminales | 17 |
| Análisis de la épica | `APPROVED` |
| Smoke tests | 0/8 (modo `auto`) |
| Fecha | 2026-11-04 |
| Template de reporte | `.opencode/skills/epic-validate/assets/epic-validate-report-template.md` |

## Comprobaciones

| ID | Comprobación | Resultado | Evidencia |
|---|---|---|---|
| EST-01 | Cierre de las historias | no cumple | `0 terminadas · 0 canceladas · 17 no terminales` |
| EST-02 | Análisis de la épica | cumple | `specs/flow/EPIC-23-completar-flujo-de-epic/epic-analyze-report.md` · `APPROVED` · updated `2026-10-29` |
| OPE-01 | Smoke tests de la épica | bloqueada | `0 aprobados · 0 fallidos · 8 no ejecutables` |
| OPE-02 | verify:release | cumple | `npm run verify:release` · pasa (0.1 s) |
| OPE-03 | DoD de validación de épica | omitida | ⚠️ `docs/guardrails/dod-epic-validate.md` no existe |
| OPE-04 | Suites de nivel épica | cumple | `1 pasa · 0 fallida · 0 no ejecutable · 2 omitida` |

## Historias de la épica

| ID | Status | Substatus | Ubicación | Clasificación |
|---|---|---|---|---|
| STORY-124 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-125 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-126 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-127 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-128 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-137 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-165 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-166 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-167 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-168 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-169 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-170 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-171 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-172 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-173 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-174 | `VERIFY` | `DONE` | activa | no terminal |
| STORY-175 | `VERIFY` | `DONE` | activa | no terminal |

## Smoke tests de la épica

Modo: `auto` (por defecto)

| SMOKE | Nombre | Resultado | Fuente de evidencia | Historia dueña |
|---|---|---|---|---|
| SMOKE-1 | `Épica consistente obtiene APPROVED` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-125 |
| SMOKE-2 | `Épica inexistente no escribe reporte` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-124 |
| SMOKE-3 | `Historia no terminal rechaza la épica` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-124 |
| SMOKE-4 | `Bucle de DEFINE: épica con formato inválido se corrige` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-166, STORY-167 |
| SMOKE-5 | `Bucle de PLAN: historia huérfana entra al índice` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-165 |
| SMOKE-6 | `Gate de DEVELOP: historia pendiente impide avanzar` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-168 |
| SMOKE-7 | `SHIP prepara la versión sin operaciones de git` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-170 |
| SMOKE-8 | `Cierre y archivado de una épica liberada` | no ejecutable | `ejecución conjunta: npm run test:e2e:smoke — script npm test:e2e:smoke no declarado en package.json` | STORY-171 |

## DoD de validación de épica

Omitido — ⚠️ `docs/guardrails/dod-epic-validate.md` no existe

## Suites de nivel épica

| Suite | Required | Comando | Resultado | Duración (s) | Motivo |
|---|---|---|---|---|---|
| integration | `true` | `node scripts/verify-fixed-layout.js` | pasa | 0.1 | — |
| e2e | `false` | `npm run test:e2e:smoke` | omitida | — | `script npm test:e2e:smoke no declarado en package.json` |
| e2e-regression | `false` | `npm run test:e2e:regression` | omitida | — | `script npm test:e2e:regression no declarado en package.json` |

## Motivos

### M-001 [NEEDS-CHANGES] — EST-01: STORY-124

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-124-validar-preparacion-estructural-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-002 [NEEDS-CHANGES] — EST-01: STORY-125

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-125-validar-evidencia-operativa-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-003 [NEEDS-CHANGES] — EST-01: STORY-126

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-126-operar-validacion-epica-segura/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-004 [NEEDS-CHANGES] — EST-01: STORY-127

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-127-integrar-adoptar-gateway-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-005 [NEEDS-CHANGES] — EST-01: STORY-128

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-128-evaluar-validacion-epica-repetible/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-006 [NEEDS-CHANGES] — EST-01: STORY-137

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-007 [NEEDS-CHANGES] — EST-01: STORY-165

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-165-corregir-indice-y-enlaces-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-008 [NEEDS-CHANGES] — EST-01: STORY-166

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-166-veredicto-de-epic-format-validation/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-009 [NEEDS-CHANGES] — EST-01: STORY-167

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-167-skill-epic-improve/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-010 [NEEDS-CHANGES] — EST-01: STORY-168

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-168-skill-epic-track-progress/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-011 [NEEDS-CHANGES] — EST-01: STORY-169

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-012 [NEEDS-CHANGES] — EST-01: STORY-170

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-170-skill-epic-ship/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-013 [NEEDS-CHANGES] — EST-01: STORY-171

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-171-completar-archivar-epica-liberada/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-014 [NEEDS-CHANGES] — EST-01: STORY-172

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-172-skill-epic-complete-archivar-epicas-canceladas/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-015 [NEEDS-CHANGES] — EST-01: STORY-173

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-173-cubrir-criterios-salida-epica/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-016 [NEEDS-CHANGES] — EST-01: STORY-174

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-174-corregir-referencias-obsoletas-tras-split/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-017 [NEEDS-CHANGES] — EST-01: STORY-175

- **Evidencia:** `VERIFY/DONE` · `specs/flow/STORY-175-admitir-epicas-archivadas-en-layout/story.md`
- **Acción sugerida:** `completar la historia en su pipeline (o cancelarla)`

### M-018 [NEEDS-CHANGES] — EST-01: EPIC-23

- **Evidencia:** `0 historias terminadas`
- **Acción sugerida:** `completar al menos una historia de la épica`

### M-019 [BLOCKED] — OPE-01: SMOKE-1

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-020 [BLOCKED] — OPE-01: SMOKE-2

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-021 [BLOCKED] — OPE-01: SMOKE-3

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-022 [BLOCKED] — OPE-01: SMOKE-4

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-023 [BLOCKED] — OPE-01: SMOKE-5

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-024 [BLOCKED] — OPE-01: SMOKE-6

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-025 [BLOCKED] — OPE-01: SMOKE-7

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

### M-026 [BLOCKED] — OPE-01: SMOKE-8

- **Evidencia:** `no ejecutable` — ejecución conjunta: `npm run test:e2e:smoke` — `script npm test:e2e:smoke no declarado en package.json`
- **Acción sugerida:** `declarar un verify.e2e-smoke.command ejecutable o validar con --mode manual`

## Notas de la validación

- ⚠️ OPE-03 omitida — `docs/guardrails/dod-epic-validate.md` no existe
- ⚠️ Usando template seed del skill. Copia assets/epic-validate-report-template.md a docs/templates/ para personalizarlo.

---
type: fix-plan-report
id: STORY-138
slug: STORY-138-fix-plan-report
title: "Fix plan: Contrato de validación"
story: STORY-138
analyze-updated: 2026-10-17
analyze-verdict: NEEDS-CHANGES
mode: estándar
analyze-status: "❌ Inconsistencias bloqueantes"
plan-files: [design.md, tasks.md]
files-modified: [design.md, tasks.md]
findings-total: 4
findings-applied: 3
findings-resolved: 0
findings-out-of-scope: 1
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-138-contrato-de-validacion
---

# Fix plan: Contrato de validación

## Resumen

| Métrica | Valor |
|---|---|
| Estado previo (analyze.md) | verdict `NEEDS-CHANGES` (declarado con el alias `veredict`) · ❌ Inconsistencias bloqueantes |
| Modo | estándar |
| Archivos del plan | design.md, tasks.md (testcases.md no existe) |
| Hallazgos extraídos | 4 (INC 4 · HAL 0 · REC 4 adjuntas a INC-001…INC-004 · DOD 1 adjunto a INC-003) |
| Aplicados | 3 |
| Ya resueltos | 0 |
| Fuera de alcance | 1 |
| Archivos modificados | design.md, tasks.md |

## Hallazgos

| Origen | Severidad | Descripción breve | Clasificación | Cambios |
|---|---|---|---|---|
| INC-001 (+ REC-1) | ERROR | T026 (`graphify update .`) no se traza a ningún elemento de design.md | Aplicable — tasks.md | C-01 |
| INC-002 (+ REC-2) | WARNING | V-2 y T012 fallarían por los `## ` de los bloques de ejemplo de §7 | Aplicable — design.md, tasks.md | C-02, C-03 |
| INC-003 (+ REC-3, DOD-1) | WARNING | «Esquema de datos» y «Decisiones de complejidad justificada» sin trazabilidad explícita a AC | Aplicable — design.md | C-04, C-05 |
| INC-004 (+ REC-4) | WARNING | El estado de EPIC-25 en `epic.md` no refleja READY-FOR-DEV | Fuera de alcance | — |

## Plan de cambios aplicado

### C-01 — tasks.md › 6. Verificación final › T026

- **Origen:** INC-001 [ERROR]
- **Operación:** eliminar
- **Antes:** `- [ ] T026 Ejecutar `graphify update .` para mantener el grafo de conocimiento al día con los documentos nuevos (requiere T023–T025) — entorno local`
- **Después:** —
- **Referencias actualizadas:** ninguna. Ninguna otra tarea ni sección de design.md menciona T026. El ID T026 no se reutiliza.

### C-02 — design.md › Contratos de verificación › V-2

- **Origen:** INC-002 [WARNING]
- **Operación:** modificar
- **Antes:** criterio «Los encabezados `##` son exactamente los de D-2 y están en ese orden»; método `grep -n '^## ' docs/policies/validation-contract-policy.md`
- **Después:** criterio «Los encabezados `##` fuera de bloques cercados son exactamente los de D-2 y están en ese orden»; método `grep -n -E '^## ([0-9]+\. \|Historial)' docs/policies/validation-contract-policy.md` y la nota «Los `##` de §7 van dentro de bloques cercados». El `|` de la regex va escapado (`\|`) para no romper la fila de la tabla.
- **Referencias actualizadas:** T012 (C-03).

### C-03 — tasks.md › 3. Verificación de la política › T012

- **Origen:** INC-002 [WARNING] (espejo de C-02)
- **Operación:** modificar
- **Antes:** `grep -n '^## ' docs/policies/validation-contract-policy.md` devuelve exactamente los encabezados de D-2 en ese orden
- **Después:** `grep -n -E '^## ([0-9]+\. |Historial)' docs/policies/validation-contract-policy.md` devuelve exactamente los encabezados de D-2 en ese orden. Los `##` de §7 van dentro de bloques cercados y no cuentan.
- **Referencias actualizadas:** ninguna. Las trazas `AC-1, CNF-1` y la dependencia `requiere T011` se mantienen.

### C-04 — design.md › Esquema de datos

- **Origen:** INC-003 [WARNING] · DOD-1 (trazabilidad explícita al AC)
- **Operación:** modificar
- **Antes:** `## Esquema de datos`
- **Después:** `## Esquema de datos // satisface: AC-1, CNF-1`
- **Referencias actualizadas:** ninguna (no hay enlaces al ancla de la sección).

### C-05 — design.md › Decisiones de complejidad justificada

- **Origen:** INC-003 [WARNING] · DOD-1
- **Operación:** modificar (añadir columna)
- **Antes:** tabla `Elemento | Por qué no basta algo más simple`
- **Después:** tabla `Elemento | Por qué no basta algo más simple | Satisface`, con estos valores: «Valores sin rama» → AC-3; «Tabla §5» → AC-2; «Sección §6» → CNF-1; «ADR» → CNF-1, CR-001; «G-06» → AC-1
- **Referencias actualizadas:** ninguna.

## Alternativas descartadas

| Origen | Alternativa descartada | Motivo |
|---|---|---|
| INC-001 | Conservar T026 y declarar en design.md › «Componentes afectados» la fila «Grafo de conocimiento local \| regenerar \| `graphify-out/` (no versionado) \| AGENTS.md» | REC-1 prefiere eliminarla. La regla de `AGENTS.md` se refiere a código, y `graphify-out/` no se versiona, así que la tarea no produce entregable. |

## Fuera de alcance

| Origen | Archivo afectado | Acción pendiente | Responsable sugerido |
|---|---|---|---|
| INC-004 | `docs/specs/epics/EPIC-25-unificar-contrato-de-validaciones-en-skills/epic.md` (frontmatter) | Confirmar el estado de EPIC-25 y, si está lista, actualizar `status`/`substatus` | PO o skills de épica |

## Siguiente paso

Ejecutar `/story-analyze STORY-138` para verificar la coherencia del plan corregido.

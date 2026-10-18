---
type: analyze
id: STORY-206
slug: STORY-206-analyze-report
title: "Analyze: Importar usuarios desde CSV"
story: STORY-206
verdict: NEEDS-CHANGES
created: 2026-10-12
updated: 2026-10-12
related:
  - STORY-206-importar-usuarios-csv
---

# Reporte de Coherencia: Importar usuarios desde CSV

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos |
| Alineación tareas → diseño | ⚠️ | tasks.md no presente — correlación omitida |
| Cobertura diseño → tareas | ⚠️ | tasks.md no presente — correlación omitida |
| Cobertura de ACs en testcases.md | ⚠️ | 1/2 criterios con caso de prueba |
| Cumplimiento DoD — Fase PLAN | ❌ | 5/6 criterios ✓ |

**Estado general:** ❌ Inconsistencias bloqueantes

---

## Cobertura de ACs en Testcases

| AC | Descripción | Caso de prueba | Estado |
|---|---|---|---|
| AC-1 | Un CSV válido crea un usuario por fila | API-001, UT-001 | ✓ |
| AC-2 | Un CSV vacío se rechaza con «El archivo está vacío» | — | ⚠️ |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-206` — disponible |
| tasks.md | ❌ | `/story-implement-tasks STORY-206` — no disponible |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** F (AC sin caso de prueba en testcases.md)
- **Descripción:** AC-2 («un CSV vacío se rechaza con el mensaje "El archivo está vacío"») no tiene ningún caso en testcases.md, aunque D-2 define ese comportamiento.
- **Archivo afectado:** testcases.md — sección «Tabla de casos»
- **Acción requerida:** añadir un caso API que envíe un CSV vacío y espere `422` con el mensaje de D-2, con `Ref: AC-2`.

### INC-002 [WARNING]

- **Tipo:** coherencia interna entre design.md y testcases.md
- **Descripción:** D-3 fija el límite de tamaño en 1 MB, pero API-002 espera el rechazo a partir de 2 MB.
- **Archivo afectado:** testcases.md — fila API-002
- **Acción requerida:** alinear API-002 con D-3 (límite de 1 MB).

---

## Recomendaciones

1. **INC-001:** añadir en testcases.md el caso `API-003` «CSV vacío → 422 "El archivo está vacío"» con `Ref: AC-2`.
2. **INC-002:** cambiar en API-002 el umbral a 1 MB, como fija D-3.
3. Generar `tasks.md` con `/story-tasking STORY-206` si se quiere habilitar `/story-implement-tasks`.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios Gherkin | ✓ | — | AC-1, AC-2 |
| design.md cubre todos los ACs | ✓ | — | 2/2 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ❌ | ERROR | D-3 no tiene anotación `// satisface:` |
| No hay decisiones aplazadas | ✓ | — | Open Questions: Ninguna |
| Debe existir tasks.md o testcases.md | ✓ | — | testcases.md presente |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | AC-2 reportado en INC-001 |

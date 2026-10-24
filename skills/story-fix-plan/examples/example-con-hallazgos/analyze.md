---
type: analyze
id: STORY-201
slug: STORY-201-analyze-report
title: "Analyze: Exportar reporte CSV"
story: STORY-201
verdict: NEEDS-CHANGES
created: 2026-10-10
updated: 2026-10-10
related:
  - STORY-201-exportar-reporte-csv
---

# Reporte de Coherencia: Exportar reporte CSV

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — ERROR de tipo A, B; WARNING de tipo D, E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ❌ | 1/2 criterios cubiertos |
| Alineación tareas → diseño | ❌ | 4/5 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 3/3 elementos con tarea |
| Alineación con la épica EPIC-30-reportes | ⚠️ | Estado de la épica incoherente |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 5/6 criterios ✓ |

---

## Inconsistencias Detectadas

### INC-001 [ERROR]

- **Tipo:** A (AC sin cobertura en design.md)
- **Descripción:** AC-2 («si el reporte está vacío, el CSV contiene solo la fila de encabezados») no tiene ningún elemento de diseño que lo satisfaga. D-1 y D-2 solo cubren AC-1.
- **Archivo afectado:** design.md — sección «Decisions»
- **Acción requerida:** añadir una decisión que defina el comportamiento con reporte vacío, anotada con `// satisface: AC-2`, y la tarea que la implementa.

### INC-002 [ERROR]

- **Tipo:** B (tarea sin diseño asociado)
- **Descripción:** T005 («Añadir caché en memoria de los reportes exportados») no se traza a ningún componente ni decisión de design.md y no responde a ningún AC.
- **Archivo afectado:** tasks.md — sección «2. Implementación», T005
- **Acción requerida:** eliminar T005, o bien declarar la caché en design.md › «Decisions».

### INC-003 [WARNING]

- **Tipo:** coherencia interna entre design.md y tasks.md
- **Descripción:** D-2 fija el separador `;`, pero T003 implementa el serializador con separador `,`. La tarea contradice el diseño.
- **Archivo afectado:** tasks.md — T003
- **Acción requerida:** alinear T003 con D-2 (separador `;`).

### INC-004 [WARNING]

- **Tipo:** D (desalineación con la épica: estado)
- **Descripción:** `epic.md` declara `status: DEFINE`, aunque la épica ya tiene historias en PLAN.
- **Archivo afectado:** `specs/flow/EPIC-30-reportes/epic.md` — frontmatter
- **Acción requerida:** actualizar el estado de la épica (fuera del alcance de esta historia).

---

## Recomendaciones

1. **INC-001:** añadir en design.md › «Decisions» la decisión D-3 «Reporte vacío: se emite solo la fila de encabezados» con `// satisface: AC-2`, y en tasks.md una tarea que la implemente tras T003.
2. **INC-002:** eliminar T005 de tasks.md; la caché no forma parte del alcance de la historia.
3. **INC-003:** cambiar en T003 el separador a `;`, como fija D-2.
4. **INC-004:** revisar el estado de EPIC-30 con el PO.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios Gherkin | ✓ | — | AC-1, AC-2 |
| design.md cubre todos los ACs | ❌ | ERROR | AC-2 sin cobertura (INC-001) |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | La sección «Componentes afectados» no tiene anotación `// satisface:` |
| No hay decisiones aplazadas | ✓ | — | Open Questions: Ninguna |
| Debe existir tasks.md o testcases.md | ✓ | — | tasks.md presente |
| tasks.md contiene solo tareas atómicas | ✓ | — | — |

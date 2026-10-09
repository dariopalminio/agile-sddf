---
type: improvement-log
story-id: STORY-123
improved: 2026-10-09
dimensions-improved: [I, V, E, T]
previous-score: 3.85
---

# Log de mejoras: STORY-123

## Resumen

- **Fecha:** 2026-10-09
- **Dimensiones mejoradas:** I, V, E, T (S=3 sin recomendación propia; cubierta por el `Pero` añadido en AC-3)
- **Score previo (FINVEST):** 3.85
- **Decisión previa:** REFINAR

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** Mantener el orden 104→107 → 123 → 108 y dejar constancia de que la historia solo puede iniciarse cuando STORY-104 a STORY-107 estén implementadas; AC-1 puede pedir "solo contiene `project.md`" como precondición verificable sin nombrar historias.

**Cambio realizado:** AC-1 ya no dice "STORY-104 a STORY-107 están aplicadas". En su lugar exige dos condiciones verificables: el directorio solo contiene `project.md`, y este ya no tiene §1.8 ni §2.1–2.2 como texto propio. La nota de dependencias indica que STORY-104 a STORY-107 están planificadas y no implementadas, y fija el orden.

---

### V – Valiosa (score previo: 3)

**Recomendación aplicada:** Vincular el "Para" al criterio de salida de EPIC-21 (`docs/specs/01-projects/` no existe).

**Cambio realizado:** El "Para" ahora nombra el criterio de salida de EPIC-21 como beneficio verificable, sin perder la segunda fuente de verdad ni el desbloqueo de STORY-108.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Enumerar en las Notas quién enlaza el slug hoy y decidir el tratamiento de los `epic.md` históricos.

**Cambio realizado:** Se añadió una nota con el inventario exacto de nodos escaneados que enlazan `[[PROJ-01-agile-sddf]]`. Corrige el conteo del reporte: son **14** `epic.md` (EPIC-00 a EPIC-12 y EPIC-20), no 15. Se suman `story-map.md`, que STORY-107 delega en esta historia, y el runbook, y se aclara que las menciones entre backticks y los derivados de historia no cuentan. Quedan registradas dos decisiones abiertas para el PO: ADR-0006 y el runbook.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Corregir el slug en AC-2, resolver el conflicto con los ADR inmutables y nombrar el informe.

**Cambio realizado:** AC-2 usa el slug real `[[PROJ-01-agile-sddf]]` y enumera los archivos donde debe desaparecer. Se quitó la exclusión de `03-stories/`, innecesaria porque ninguna `story.md` lo enlaza como wikilink, y se precisó `broken-wikilink`. El informe se llama `reubicacion-report.md`, en el directorio de la historia (AC-1, AC-3 y CNF-1); con el sufijo `-report.md` queda excluido del escaneo de `memory-system`. AC-3 ganó un `Pero` que conserva la reubicación parcial. **Pendiente:** el conflicto con ADR-0006 no se resuelve aquí; queda como decisión abierta del PO, porque `check` lo reportaría como `broken-wikilink`.

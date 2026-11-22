---
type: refinement-log
story-id: STORY-165
improved: 2026-10-29
dimensions-improved: [N, E, S, T, F]
previous-score: 3.88
---

# Log de mejoras: STORY-165

## Resumen

- **Fecha:** 2026-10-29
- **Dimensiones mejoradas:** N, E, S, T (y F como mejora opcional)
- **Score previo (FINVEST):** 3.88
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Reescribir AC-2 en términos de resultado y mover la heurística de selección de la historia de cierre y la mecánica de la cita E1 a `📎 Notas` como propuesta para `story-design`. Llevar «Lanzar subagentes» de Non-Goals a `📎 Notas` como decisión de diseño preliminar.

**Cambio realizado:** AC-2 ya no prescribe «añadir un AC nuevo» ni «añadir la cita E1»: afirma el resultado (solo `STORY-302` cita `CS-1`, `STORY-301` no recibe cita y el reporte registra la decisión). La regla de desempate, la mecánica del AC de cierre global con cita E1 y la ejecución secuencial sin subagentes se movieron a la nota «Propuesta para `story-design` (no vinculante)». Se retiró «Lanzar subagentes» de Non-Goals.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Añadir en `📎 Notas` el catálogo cerrado de hallazgos que el skill corrige de forma automática y los que deriva siempre al PO, tomado del contrato de `epic-analyze`. Acotar la detección de AC-4 definiendo qué se considera referencia obsoleta.

**Cambio realizado:** Se añadió en `📎 Notas` una tabla «Catálogo cerrado de hallazgos» basada en los catálogos INT, SAL y MAD de `skills/epic-analyze/SKILL.md`. Se corrigen automáticamente INT-02, INT-03, MAD-02, SAL-01/SAL-02 con evidencia `parcial` y COH-<n>; INT-01, INT-04, INT-05, INT-06, SAL-01/SAL-02 sin evidencia, SAL-03, SAL-04, MAD-01 y MAD-03 van siempre al PO. Una nota nueva define «Referencia obsoleta (COH)»: un slug en `related` o en una línea F2/F3 del índice que no existe en `specs/flow/` ni en `specs/flow/archive/` y que el reporte no cubre.

---

### S – Small (score previo: 2)

**Recomendación aplicada:** Dividir por reglas de negocio con `/story-split` en (a) Core, (b) Cobertura de criterios de salida y (c) Coherencia derivada; ajustar CS-15 a la historia Core.

**Cambio realizado:** AC-1 bajó de 9 a 7 pasos: se fusionaron «muestra el plan» y «al confirmar» en el `Cuando` y se retiró la precondición de archivos no modificados, ya cubierta por la nota de idempotencia. En `📎 Notas` se registró la propuesta de división (a)/(b)/(c) con el mapeo a los nuevos AC y la indicación de que CS-15 y SMOKE-5 quedarían en la historia Core. La división no se ejecutó porque eso le corresponde a `/story-split`. Con S = 2 la historia sigue siendo candidata a dividirse.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Separar AC-3 en dos subapartados `###`. En AC-2, sustituir la regla disyuntiva por un criterio determinista. En AC-4, reemplazar «para reflejar la nueva realidad» por una aserción concreta. Dar umbral a CNF-5 y CNF-6.

**Cambio realizado:** AC-3 se dividió en AC-3 (veredicto `APPROVED`, ningún archivo de `specs/flow/` creado ni modificado) y AC-4 (solo hallazgos INT-01, INT-05 o SAL-03, listados con el responsable «PO»); el antiguo AC-4 pasó a ser AC-5. AC-2 usa como criterio determinista «la única sin dependientes en el índice». AC-1 y AC-5 usan IDs concretos (`STORY-301`, `STORY-304`, `STORY-999`, `COH-1`, `COH-2`) y asertan sobre el estado final de los archivos. AC-5 termina con «todo slug citado en `related` y en el índice existe en `specs/flow/` o `specs/flow/archive/`». CNF-5 ahora exige catálogos en `references/` o `assets/` cargados solo cuando hay hallazgos de esa familia. CNF-6 fija el cuerpo de `SKILL.md` en menos de 500 líneas, según `docs/guides/custom-skill-creation-guide.md`.

---

### F – Formato (score previo: 4) — mejora opcional

**Recomendación aplicada:** Dejar en el `Para` solo el valor y apoyarse en CNF-1 y CNF-2 para las restricciones de seguridad y no falsificación.

**Cambio realizado:** El `Para` queda en «evitar la corrección manual repetitiva de la épica tras un `/story-split` y cerrar el ciclo `epic-analyze` → corrección». Las restricciones de backup y no falsificación siguen en CNF-1, CNF-2 y AC-1.

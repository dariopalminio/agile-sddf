---
type: refinement-log
story-id: STORY-148
improved: 2026-10-22
dimensions-improved: [I, N, V, E, S]
previous-score: 3.80
---

# Log de mejoras: STORY-148

## Resumen

- **Fecha:** 2026-10-22
- **Dimensiones mejoradas:** I, N, V, E, S
- **Score previo (FINVEST):** 3.80
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 3)

**Recomendación aplicada:** Declara en la sección de contexto que el ADR de STORY-147 debe estar aceptado antes de iniciar, y fija en un criterio o nota cómo se representa la lista transitoria de skills pendientes, de modo que la historia pueda probarse con un fixture mientras STORY-150/151/152 no estén entregadas.

**Cambio realizado:** En "Notas / contexto adicional" se añadió el bloque «Independencia» con la precondición de que el ADR de STORY-147 esté `ACCEPTED`, el desacople respecto de STORY-150/151/152 mediante fixtures de skills y la descripción de la lista transitoria de pendientes, que cada historia de migración vacía y que debe quedar vacía al cerrar la épica. Se retiró la frase «Depende de STORY-147 (ADR)», que quedó cubierta por la precondición. Se consultó el contexto de la épica y de las historias hermanas para no introducir dependencias ya resueltas.

---

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Reformula el `Quiero` como capacidad y mueve a notas los detalles de implementación (nombre del script, rutas literales, redacción exacta del mensaje) para dejar el cómo abierto a conversación.

**Cambio realizado:** El `Quiero` pasó de «sustituir el bloque `SDDF-ROOT-RESOLUTION: v1` por un contrato...» a «que `verify:repository` detecte de forma determinista cualquier skill que no cumpla el contrato de layout fijo... o que conserve la resolución legada». En "Notas / contexto adicional" se añadió que la redacción exacta del mensaje de error y la estructura interna del validador quedan abiertas a negociación.

---

### V – Valiosa (score previo: 2)

**Recomendación aplicada:** Haz explícito el beneficio observable y, si es posible, medible (el gate detecta el 100 % de las referencias legadas a `SDDF_ROOT`/`SPECS_BASE`/`SDDF-ROOT-RESOLUTION`), y vincula la historia con CS-2, CS-3 y CS-12 de la épica en el `Para`.

**Cambio realizado:** El `Para` ahora indica que el 100 % de las referencias legadas a `SDDF_ROOT`, `root` y `SPECS_BASE` en los skills queda detectado por el gate sin revisión manual, y que con ello se cumplen CS-2, CS-3 y CS-12 de la épica.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Enumera el contenido mínimo del bloque del contrato (qué marcador lo identifica y qué rutas fijas exige) o enlaza al ADR, y aclara si `scripts/audit-root-resolution.js` se elimina o se renombra.

**Cambio realizado:** En "Notas / contexto adicional" se añadió el bloque «Alcance mínimo del contrato»: condiciones de un `SKILL.md` conforme (bloque del contrato con marcador fijado por el ADR de STORY-147, resolución solo de `REPO_ROOT`, ausencia de referencias legadas salvo `skill-preflight`), las tres rutas fijas admitidas y la decisión de que el validador reemplaza a `scripts/audit-root-resolution.js`, con sus referencias en `scripts/verify-repository.js`, `sddf.config.yaml` y `test/profile-contract.test.js` por actualizar, y el script legado eliminado.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** Mantén el alcance en tres escenarios o menos y considera pasar AC-3 a pruebas unitarias en lugar de un escenario Gherkin propio, para reducir el número de pasos.

**Cambio realizado:** Se eliminó el escenario AC-3 (prueba unitaria del validador) y su cobertura se conservó como `CNF-3 — Pruebas unitarias del validador` en "Criterios no funcionales específicos". La historia queda con dos escenarios Gherkin (AC-1 y AC-2).

---

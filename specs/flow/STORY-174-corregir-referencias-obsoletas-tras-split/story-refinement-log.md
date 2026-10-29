---
type: refinement-log
story-id: STORY-174
improved: 2026-10-29
dimensions-improved: [I, E, S, T]
previous-score: 3.93
---

# Log de mejoras: STORY-174

## Resumen

- **Fecha:** 2026-10-29
- **Dimensiones mejoradas:** I, E, S, T
- **Score previo (FINVEST):** 3.93
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** La dependencia de STORY-165 es intrínseca al split (core → hermana), así que no se puede eliminar, pero sí se puede desacoplar: en Notas, nombrar los puntos de extensión exactos que se reutilizan (estructura del plan de cambios, tabla de hallazgos de `epic-refine-report.md`, convención `<archivo>.bak`). Así STORY-174 se puede diseñar y probar contra ese contrato con fixtures aunque STORY-165 no esté entregada.

**Cambio realizado:** Se añadió en "Notas / contexto adicional" la nota "Contrato que se reutiliza de STORY-165 (puntos de extensión)", que detalla el plan de cambios consolidado (código, archivo, cambio propuesto, tratamiento), la tabla de hallazgos de `epic-refine-report.md` (código, estado, responsable), el backup `<archivo>.bak` y los modos manual y `--auto`. También indica que la historia se puede diseñar y probar con fixtures de `specs/flow/` y un stub de ese contrato.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Precisar la regla de reemplazo («si existe un único directorio `STORY-NNN-*` con el mismo ID en `specs/flow/` o `specs/flow/archive/`, ese es el reemplazo; si no existe ninguno, o existe más de uno, el hallazgo va al PO») y definir si la detección COH se ejecuta cuando `epic-analyze-report.md` está `APPROVED`.

**Cambio realizado:** Se reemplazó la nota "Reemplazo", que dependía del `related` de otras historias, por la "Regla de reemplazo (determinista)" basada en el ID. Se añadió la nota "Disparo con `verdict: APPROVED`": COH solo se ejecuta con `verdict: NEEDS-REFINEMENT`, y con `APPROVED` se mantiene sin cambios el AC-2 de STORY-165 (no se crea ni se modifica ningún archivo). Así no se altera el contrato de la historia core. A pedido del usuario se añadió en Non-Goals que `epic-refine` no divide historias: si detecta una que conviene dividir, la deriva a `/story-split` con confirmación humana (modo manual) o la deja al PO como "fuera de alcance" (`--auto`).

---

### S – Small (score previo: 3)

**Recomendación aplicada:** El tamaño es adecuado. Al refinar, no añadir escenarios: si hace falta cubrir el caso `APPROVED`, conviene expresarlo como regla en Notas o ajustar un `Dado` existente.

**Cambio realizado:** Se mantuvieron dos escenarios. El caso `APPROVED`, la regla de reemplazo y la exclusión de splits se expresaron como reglas en "Notas" y "Fuera de alcance", sin añadir escenarios. Las precondiciones nuevas se incorporaron ajustando los `Dado` existentes de AC-1.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** AC-1: cambiar el `Entonces` por una aserción sobre el resultado exacto (reemplazo "STORY-301-<nuevo-slug>" en el índice y el `related`, existencia de los `.bak`) y aclarar en el `Dado` que la core `STORY-301` existe con otro slug. AC-2: corregir la contradicción del `Dado` y añadir `Pero` para el no-cambio.

**Cambio realizado:** En AC-1, el `Dado` indica que la core quedó como "STORY-301-exportar-informe-csv" y que `epic-analyze-report.md` tiene `verdict: NEEDS-REFINEMENT`. El `Entonces` ahora verifica que el plan incluye "COH-1" (índice) y "COH-2" (`related` de "STORY-302") con ese reemplazo exacto, que ambos archivos lo citan, que existen "epic.md.bak" y "STORY-302-*/story.md.bak" y que `epic-refine-report.md` lista los hallazgos como aplicados. En AC-2, el segundo `Dado` pasó a "no existe ningún directorio `STORY-310-*` en `specs/flow/` ni en `specs/flow/archive/`" (regla por ID), lo que elimina la contradicción, y el no-cambio se expresa con `Pero`.

---

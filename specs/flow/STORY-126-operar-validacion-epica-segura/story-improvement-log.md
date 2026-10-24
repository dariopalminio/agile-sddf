---
type: improvement-log
story-id: STORY-126
improved: 2026-10-17
dimensions-improved: [F, I, E, S, T]
previous-score: 3.52
---

# Log de mejoras: STORY-126

## Resumen

- **Fecha:** 2026-10-17
- **Dimensiones mejoradas:** F, I, E, S, T
- **Score previo (FINVEST):** 3.52
- **Decisión previa:** REFINAR

## Cambios por dimensión

### F – Formato: Escenarios Gherkin (score previo: 3) y Criterios de aceptación (score previo: 4)

**Recomendación aplicada:** Separar los resultados compuestos en pasos `Y`, añadir un escenario alternativo / error con `Pero` y fortalecer el `Para` con el beneficio observable.

**Cambio realizado:** En los criterios de aceptación, los resultados compuestos de cada `Entonces` se separaron en pasos `Y`. AC-2 (previsualización) y AC-3 (modo no reconocido) usan `Pero`. AC-3 es un escenario de error nuevo. No reutiliza el caso de épica inexistente que propuso el reporte, porque ese caso ya lo cubre STORY-124 (CS-6 y SMOKE-2); en su lugar, el error es propio de esta historia: un valor de `--mode` no reconocido. El `Para` pasa a decir «revisar una épica sin riesgo de escrituras y usar el mismo veredicto como gate automatizado y reproducible».

---

### I – Independencia (score previo: 3)

**Recomendación aplicada:** Declarar la dependencia de STORY-124 y cómo simularla con un validador stub. Alinear con STORY-125, adoptando `--mode auto` / `--mode manual` o citándola como fuente de la semántica de evidencia por modo, y aclarar cómo se combina la previsualización con los modos.

**Cambio realizado:** En «Notas» se añadieron tres viñetas. «Nombres de los modos» adopta `--mode auto`, `--mode manual` y `--dry-run` de EPIC-23 y STORY-125, y define `--dry-run` como un flag ortogonal al modo. «Semántica de los modos» separa responsabilidades: STORY-125 define qué evidencia toma cada modo y STORY-126 define cómo se selecciona el modo y qué efectos tiene. «Dependencias» explica cómo desarrollar la historia con un validador stub que devuelva APPROVED o BLOCKED fijo. En «Fuera de alcance» se añadió «Definir la fuente de evidencia de los smoke tests en cada modo (STORY-125)».

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Definir el contrato del resultado automático (APPROVED → éxito, BLOCKED → fallo, distinguible sin leer el reporte) y definir «mismo contenido lógico» (idéntico salvo la fecha de evaluación, con hallazgos en orden determinista).

**Cambio realizado:** En «Notas» se añadieron dos reglas. «Regla — Resultado observable»: éxito cuando el veredicto es APPROVED; fallo cuando es BLOCKED o hay un error de invocación; el mecanismo concreto queda para el diseño. «Regla — Contenido equivalente»: dos reportes de la misma épica sin cambios solo pueden diferir en la fecha. Se documentó también el modo por defecto sin `--mode`, tomado de la tabla de flags de EPIC-23. CNF-1 ahora exige que los hallazgos salgan en orden determinista.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** El reporte no trae una recomendación explícita para S (score 3, tamaño ideal). Se cuidó que las mejoras de F y T no inflaran la historia de forma desproporcionada.

**Cambio realizado:** El modo manual se cubre con una fila del `Esquema del escenario` de AC-1, en lugar de un escenario aparte, y la semántica de su evidencia queda fuera de alcance (STORY-125). Aun así, la historia pasa de 3 a 5 escenarios contando las filas del Outline. Es probable que S baje a 2 en la reevaluación, igual que en STORY-125.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Cubrir el modo manual con un escenario y convertir AC-2 en un `Scenario Outline` con tabla `Ejemplos` (veredicto `APPROVED` → éxito, `BLOCKED` → fallo).

**Cambio realizado:** La antigua AC-2 (ejecución automática) pasó a ser AC-1, el escenario principal: un `Esquema del escenario` con la tabla `modo | veredicto | resultado` y las filas `auto / APPROVED / éxito` y `manual / BLOCKED / fallo`. Así cubre los dos modos y los dos veredictos. La previsualización pasó a AC-2: usa `--dry-run`, verifica que no se crean archivos y añade «no se ejecuta ningún smoke test ni comando de verificación». La regresión pasó a AC-4 y su `Entonces` cambió «mismo contenido lógico» por «idéntico al anterior salvo la fecha de evaluación». Ningún otro documento cita los AC de STORY-126 por número, así que renumerarlos no rompe referencias.

---

### Observaciones

- Se añadió en «Notas» que la historia contribuye a **CS-10** de EPIC-23 en los flags `--mode manual`, `--mode auto` y `--dry-run`. La épica no asigna dueño a CS-10, y `--verbose` sigue sin historia que lo cubra.
- No se modificaron `status` ni `substatus`. La historia sigue en `SPECIFY / DONE` aunque la última evaluación dio REFINAR.

---
type: refinement-log
story-id: STORY-183
improved: 2026-11-08
dimensions-improved: [N, S]
previous-score: 3.98
---

# Log de mejoras: STORY-183

## Resumen

- **Fecha:** 2026-11-08
- **Dimensiones mejoradas:** N, S (y observaciones adicionales de F, V y T)
- **Score previo (FINVEST):** 3.98
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Mover a «Notas» las referencias de implementación del cuerpo de los AC (nombres literales de criterios, «Archivo:Línea del DoD, como hoy»). En los AC dejar el comportamiento observable. AC-2 podría expresar el resultado sin fijar el mecanismo («el criterio toma el resultado del Product-Owner-Reviewer»). Dejar abierto si el árbitro lo hace por mapeo de criterios o por deduplicación. Es una decisión de `story-design`.

**Cambio realizado:** AC-1 ya no cita las rutas ni el texto literal de los criterios: describe tres tipos de criterio que la revisión no puede exigir (generar el reporte, su veredicto, la ausencia de hallazgos HIGH o MEDIUM). Las rutas pasaron a la nota «Archivos del DoD». AC-2 ya no nombra al Product-Owner-Reviewer ni el texto del criterio: habla de «un revisor» y de «el criterio del DoD que cubre ese defecto». Se añadió la nota «Mecanismo abierto», que deja a `story-design` elegir entre mapeo criterio → revisor y deduplicación. El «como hoy» de AC-3 pasó a las notas como descripción del comportamiento actual del Paso 4c.1.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** Está en el rango ideal. Si `story-design` ve que el cambio de `story-code-review` (AC-2) crece, considerar separar el cambio de los criterios del DoD (AC-1, CNF-1) del cambio de la regla de revisores (AC-2, AC-3).

**Cambio realizado:** Se mantuvieron los tres AC, porque la historia está en el rango ideal. Se añadió la nota «Posible división», que registra la frontera de corte (AC-1 + CNF-1 frente a AC-2 + AC-3) para que `story-design` divida la historia si el cambio en `story-code-review` crece.

---

### Observaciones adicionales (F, V, T — score 4)

**Recomendación aplicada:** Separar el `Quiero` en dos cláusulas coherentes o simplificarlo. Añadir un `Pero` en un escenario o convertir AC-3 en un `Scenario Outline`. Añadir un indicador observable en el `Para`. En AC-2 y AC-3 indicar el artefacto que se comprueba. Aclarar «como hoy» en AC-3.

**Cambio realizado:**
- **F1:** el `Quiero` se simplificó a una sola idea («solo exija lo que la revisión puede comprobar y no repita lo que ya reporta un revisor»), sin nombres de archivos internos.
- **F3:** AC-2 termina con un paso `Pero` («el DoD no añade un hallazgo propio para ese criterio»). AC-3 pasó a `Esquema del escenario` con una tabla `Ejemplos` de dos criterios sin revisor (`tasks.md` con una tarea sin marcar y `story.md` sin `substatus`). Los criterios cubiertos por revisores ya los ejercita AC-2.
- **V:** el `Para` incluye los indicadores «cero criterios autorreferentes» y «una sola entrada en `fix-directives.md`».
- **T:** AC-2 y AC-3 verifican entradas de `fix-directives.md` y `code-review-report.md`. AC-3 ya no dice «como hoy»: el resultado esperado (el hallazgo cita el archivo del DoD y la línea del criterio) se escribe completo dentro del escenario.

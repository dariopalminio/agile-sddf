---
type: refinement-log
story-id: STORY-155
improved: 2026-10-22
dimensions-improved: [I, N, E, S]
previous-score: 3.97
---

# Log de mejoras: STORY-155

## Resumen

- **Fecha:** 2026-10-22
- **Dimensiones mejoradas:** I, N, E, S (además de F y T, cuyas recomendaciones coinciden con los cambios aplicados)
- **Score previo (FINVEST):** 3.97
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 3)

**Recomendación aplicada:** Declarar la dependencia de STORY-148 en `## 📎 Notas` como precondición, no solo en `related`. Precisar que STORY-150, STORY-151 y STORY-156 pueden entregarse en cualquier orden respecto de esta historia, apoyándose en el fixture de épica de `specs/flow/EPIC-NN-<slug>/epic.md`.

**Cambio realizado:** En "Notas / contexto adicional" se reemplazó la frase "Depende de STORY-148" por un párrafo "Precondición (bloqueo)" que explica por qué STORY-148 debe entregarse antes (contrato de rutas fijas y gate, CNF-2), y se añadió un párrafo "Independencia respecto de las hermanas" que indica que STORY-150, STORY-151 y STORY-156 pueden entregarse en cualquier orden gracias a la épica fixture.

---

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Quitar del `Quiero` las rutas literales o presentarlas como ejemplo. Dejar abierta la forma de resolver la ruta (convención de skill, fragmento compartido), que es decisión de `design.md`.

**Cambio realizado:** El `Quiero` se reformuló hacia el resultado ("ejecutar `/story-plan` sobre una historia del layout fijo y obtener su plan completo"), sin rutas literales. En "Notas / contexto adicional" se añadió el párrafo "Decisiones abiertas para `design.md`", que declara las rutas de los criterios como ilustrativas y deja abierta la forma de resolverlas.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Listar en la historia los skills afectados y sus `assets/agents/`. Añadir un criterio de medida, por ejemplo «0 coincidencias de `SPECS_BASE|SDDF_ROOT` en los 6 skills y sus agentes».

**Cambio realizado:** Se añadió CNF-3 (medida de completitud) con la lista de los seis skills y la meta de 0 coincidencias de `SPECS_BASE|SDDF_ROOT` en ellos y en sus `assets/agents/`; en las Notas se explicitó que el alcance son los seis skills nombrados.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** Vigilar que AC-1 solo cubre `/story-plan`; `story-fix-plan` y la lectura individual de cada skill no tienen escenario propio. Si el diseño revela más de un patrón de migración, considerar `/story-split`.

**Cambio realizado:** AC-1 se convirtió en un Scenario Outline con los seis skills como filas de `Ejemplos`, de modo que cada skill (incluido `story-fix-plan`) queda cubierto sin aumentar el número de escenarios (se mantienen tres). Se añadió en las Notas la indicación de evaluar `/story-split` si el diseño revela más de un patrón de migración.

---

### Cambios complementarios (F y T, score ≥ 4)

**Recomendación aplicada:** F: reformular el `Quiero` hacia el resultado. T: separar en AC-3 el grep de `npm run verify:repository` y añadir un `Scenario Outline` con los seis skills.

**Cambio realizado:** El `Quiero` y el Scenario Outline de AC-1 ya se describen arriba. En AC-3 la verificación del grep y la de `npm run verify:repository` pasaron a dos pares `Cuando/Entonces` independientes.

---
type: improvement-log
story-id: FEAT-075
improved: 2026-05-17
dimensions-improved: [I, N, E]
previous-score: 3.94
---

# Log de mejoras: FEAT-075

## Resumen

- **Fecha:** 2026-05-17
- **Dimensiones mejoradas:** I, N, E
- **Score previo (FINVEST):** 3.94
- **Decisión previa:** REFINAR

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** Definir en "Notas / contexto adicional" el contrato de la "ejecución base" que FEAT-074 expondrá: qué pasos tiene el flujo de integración y en qué puntos el modo manual puede interceptar para pedir confirmación. Con ese contrato, FEAT-075 puede desarrollarse con un stub sin esperar la implementación de FEAT-074.

**Cambio realizado:** Se reemplazó la "Precondición de implementación" (lenguaje de bloqueo duro) por una sección "Contrato mínimo de integración" en las notas. Se definieron los pasos del flujo base (`resolver-versión → resolver-rama → ejecutar-git → crear-pr → modificar-story`), los puntos de interceptación del modo manual (`ejecutar-git`, `crear-pr`), la firma TypeScript mínima del contrato esperado de FEAT-074, y la declaración explícita de que FEAT-075 puede implementarse y probarse independientemente usando un stub de ese contrato.

---

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Si la secuencia de confirmaciones en modo manual es un requerimiento UX crítico, mantenerla y documentarlo explícitamente para que el equipo pueda negociar con contexto.

**Cambio realizado:** Se añadió al criterio no funcional de UX una declaración explícita de que la secuencia de confirmaciones del escenario principal (opciones → versión → rama → PR → cancelación) es un requerimiento UX deliberado cuyo propósito es garantizar información progresiva antes de cada decisión irreversible. Se indica que el equipo puede negociar la granularidad pero no omitir los pasos. Esto convierte la prescripción del Gherkin en una restricción visible y razonada en lugar de implícita.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Una vez que FEAT-074 defina su contrato de ejecución, agregar esa referencia en las notas de FEAT-075 para que el equipo pueda estimar con mayor precisión.

**Cambio realizado:** Cubierto por el mismo cambio de la dimensión I. La sección "Contrato mínimo de integración" añadida incluye la firma del contrato esperado y una nota explícita de que esta referencia debe actualizarse cuando FEAT-074 publique su contrato definitivo. Esto reduce la incertidumbre de estimación al acotar el alcance de la lógica de interceptación a dos pasos del flujo base.

---

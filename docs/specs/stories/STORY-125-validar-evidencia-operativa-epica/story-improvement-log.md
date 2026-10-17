---
type: improvement-log
story-id: STORY-125
improved: 2026-10-17
dimensions-improved: [I, E, S, T]
previous-score: 3.93
---

# Log de mejoras: STORY-125

## Resumen

- **Fecha:** 2026-10-17
- **Dimensiones mejoradas:** I, E, S, T
- **Score previo (FINVEST):** 3.93
- **Decisión previa:** REFINAR

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** Declarar la dependencia con STORY-124 y desacoplar el contrato (sección de comprobaciones en `epic-validate-report.md` + regla de agregación del veredicto), de modo que pueda probarse con un reporte de prueba. Sustituir en el `Dado` de AC-1 la lógica de STORY-124 por «una épica cuya validación estructural es APPROVED».

**Cambio realizado:** Los `Dado` de AC-1, AC-2 y AC-3 parten ahora de «una épica cuya validación estructural es APPROVED» en lugar de repetir la lógica de cierre de historias y análisis. En Notas, la línea sobre STORY-124 explica el contrato (consume el veredicto estructural, agrega una sección de comprobaciones operativas, regla de agregación BLOCKED) y que se puede desarrollar con un reporte de prueba. Como el usuario pidió introducir los modos `--mode auto|manual`, aparece una dependencia nueva con STORY-126, que es la dueña de los modos. Se resolvió así: esta historia solo fija la fuente de evidencia de cada modo, la mecánica de invocación se añadió a «Fuera de alcance» como trabajo de STORY-126, y en Notas se indica que el modo se puede simular como un parámetro mientras STORY-126 no se entregue.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Definir la fuente de evidencia de cada smoke test. Resolver el «DoD de épica» inexistente limitándolo a «si existe». Alinear CNF-2 con la realidad (`verify:release` se ejecuta).

**Cambio realizado:** Siguiendo la indicación del usuario, se añadió en Notas la regla de fuente de evidencia de los smoke tests: en `--mode auto` se ejecutan sin confirmación interactiva; en `--mode manual` se toma un reporte existente que los registre como aprobados y, si no hay ninguno, se pide confirmación al mantenedor (una confirmación negativa cuenta como fallo). Se añadió la regla del DoD de épica, que se evalúa solo si existe, con la constatación de que hoy no hay ninguno en `docs/guardrails/`. CNF-2 dice ahora que se ejecuta `verify:release` y que los smoke tests solo se ejecutan en `--mode auto`.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** Pasar a Scenario Outline los casos que hoy quedan ocultos en los «o» de AC-2 y AC-3; si la tabla supera 4 filas, separar el DoD de épica en una historia hermana.

**Cambio realizado:** AC-1 pasa a ser un `Esquema del escenario` con tabla `Ejemplos` de 3 filas, una por fuente de evidencia según el modo, que era el cambio pedido por el usuario. AC-3 deja de usar «o»: el caso concreto es un proyecto sin `verify:release` ni DoD de épica, que además es la situación real de hoy en el DoD. AC-2 conserva un único escenario para cualquier comprobación configurada que falle, sustentado en la regla de Notas, y no se convirtió en tabla para no superar el umbral de filas. Ojo con el tamaño: incluir el modo manual sube los casos a unos 5 (3 filas en AC-1, AC-2 y AC-3), así que en la reevaluación S puede quedar en 2. Si eso hace caer la decisión, la división natural es separar la fuente de evidencia manual en una historia hermana.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Completar el `Entonces` de AC-3 con el veredicto resultante y la advertencia. Hacer observable el «aprobado» de AC-1 (cada `SMOKE-N` con su resultado y la fuente de su evidencia).

**Cambio realizado:** El `Entonces` de AC-3 registra ahora las comprobaciones como omitidas con advertencia, añade «Y el veredicto no se degrada por su ausencia» y un `Pero` que mantiene la evaluación de los smoke tests. AC-1 registra cada `SMOKE-N` como aprobado junto con su fuente (ejecución, reporte existente o confirmación manual), y AC-2 identifica la evidencia de la que proviene el fallo. CNF-1 exige también registrar la fuente de la evidencia.

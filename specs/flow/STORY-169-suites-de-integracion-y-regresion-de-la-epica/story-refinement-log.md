---
type: refinement-log
story-id: STORY-169
improved: 2026-10-29
dimensions-improved: [I, E, S, T]
previous-score: 3.85
---

# Log de mejoras: STORY-169

## Resumen

- **Fecha:** 2026-10-29
- **Dimensiones mejoradas:** I, E, S, T (además del componente Gherkin de F)
- **Score previo (FINVEST):** 3.85
- **Veredicto previo:** NEEDS-REFINEMENT

## Indicaciones del usuario aplicadas

- **El skill no controla el entorno:** se quitó «sobre el entorno de staging» del `Quiero`, se agregó CNF-3 «Sin control del entorno» y se amplió el Non-Goal para excluir declarar, seleccionar o comprobar un entorno. La decisión pendiente del PO sobre staging deja de existir.
- **Comprobar `docs/guardrails/dod-epic-validate.md` si existe como Definition of Done:** se agregó al `Quiero`, a CNF-1 (los criterios se leen del archivo en tiempo de ejecución) y a un nuevo AC-4 (Esquema del escenario: no existe / se cumple / un criterio incumplido / un criterio sin evidencia → veredicto). Crear el contenido del archivo queda fuera de alcance.

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** Declarar en `📎 Notas` que STORY-124 (el skill y el reporte) y STORY-125 (la evidencia operativa) son prerrequisitos de implementación, y añadir STORY-124 y STORY-126 a `related`. Formular AC-1 para que no dependa del cálculo completo de STORY-125, por ejemplo «Dado que ninguna otra verificación de `epic-validate` reporta hallazgos», para que el escenario se pueda probar con un stub del resto de la evidencia.

**Cambio realizado:** Se agregaron STORY-124 y STORY-126 a `related`. AC-1 usa ahora «ninguna otra verificación de epic-validate reporta hallazgos» en lugar de «el resto de la evidencia de la épica cumple». En Notas se añadió «Prerrequisitos de implementación»: STORY-124 (skill y reporte) y STORY-126 (`--mode`), con desarrollo posible mediante un stub de la evidencia y el modo simulado, sin esperar a STORY-125. Se documentó también el solapamiento con STORY-125 sobre el DoD de épica.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Definir qué suites son «de nivel épica». Resolver la decisión del PO sobre el entorno de staging antes de mover la historia a `PLAN`, o sacarla a una historia aparte. Definir de forma observable «entorno no disponible».

**Cambio realizado:** En Notas se registró la decisión «Suites de nivel épica»: lista fija `integration`, `e2e` y `e2e-regression`, y una clave ausente se omite con advertencia. La decisión sobre staging desaparece porque el skill no controla el entorno («Decisión — Entorno»). «No disponible» se reemplazó por una definición observable de «no ejecutable»: script npm no declarado en `package.json` o ejecutable no encontrado (código 127). Cualquier otro código distinto de 0 es una suite fallida.

---

### S – Small (score previo: 2)

**Recomendación aplicada:** Dividir con `/story-split` (entorno de staging / ejecución de suites / `--dry-run` en STORY-126/137), u otra opción sin split: convertir AC-2, AC-3 y AC-4 en un Scenario Outline (resultado de cada suite → veredicto) para reducir pasos.

**Cambio realizado:** No se hizo split. La parte de staging se eliminó del alcance (el skill no controla el entorno) y `--dry-run` (antes CNF-3) se delegó en STORY-126 y STORY-137 como Non-Goal. Los casos de fallo y bloqueo se agruparon en el Esquema del escenario AC-2. La nota de tamaño propone ahora un posible split entre ejecución de suites y comprobación del DoD, que se agregó por indicación del usuario.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Resolver la contradicción entre AC-3 y CNF-2 indicando que la suite no ejecutable es obligatoria. Añadir un escenario para CNF-2 (suite `required: false` no disponible → omitida, sin `BLOCKED`). Añadir un escenario para CNF-3 (`--dry-run`) o delegarlo en STORY-126/137. Precisar en AC-1 la unidad de «duración».

**Cambio realizado:** AC-2 indica `required` en cada fila: `integration` (`required: true`) no ejecutable → `BLOCKED`, y `e2e-regression` (`required: false`) no ejecutable → omitida y `APPROVED`, lo que cubre CNF-2. AC-3 (precedencia) declara `required: true` en ambas suites y una causa observable. `--dry-run` se delegó en STORY-126/137. AC-1 registra la duración «en segundos con un decimal». Se eliminó la condición no observable «el entorno de staging no está disponible».

---

### F – Formato, componente Gherkin (score previo: 4, mejora complementaria)

**Recomendación aplicada:** Expresar la matriz de resultados (pasa / falla / no ejecutable / omitida → veredicto) como Scenario Outline con tabla `Ejemplos`.

**Cambio realizado:** AC-2 y AC-4 son ahora `Esquema del escenario` con tabla `Ejemplos`, con el formato que ya usa STORY-125.

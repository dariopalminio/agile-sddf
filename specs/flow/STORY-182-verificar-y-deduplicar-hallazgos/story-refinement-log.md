---
type: refinement-log
story-id: STORY-182
improved: 2026-11-08
dimensions-improved: [I, E, S]
previous-score: 3.95
---

# Log de mejoras: STORY-182

## Resumen

- **Fecha:** 2026-11-08
- **Dimensiones mejoradas:** I, E, S (y las mejoras no críticas de Formato y Testeabilidad)
- **Score previo (FINVEST):** 3.95
- **Veredicto previo:** NEEDS-REFINEMENT

## Cambios por dimensión

### I – Independencia (score previo: 3)

**Recomendación aplicada:** Convertir la dependencia de STORY-180 en una precondición explícita y verificable: indicar qué necesita 182 de 180 (¿solo que `REVIEW.md` llegue al árbitro, o algo que consuma el Paso 4?). Si la verificación y la deduplicación funcionan sin `REVIEW.md`, declararlo en Notas y pasar la mención a «orden recomendado» para que la historia pueda implementarse en cualquier secuencia.

**Cambio realizado:** En «Notas / contexto adicional», la viñeta «Dependencias» pasa a «orden recomendado, no precondición». Ahora explica que la verificación y la deduplicación solo leen los informes de los cuatro revisores (Paso 4a) y no usan `REVIEW.md`. El único motivo para ir después de STORY-180 es no editar el Paso 4 al mismo tiempo, porque STORY-180 hace que el árbitro aplique `REVIEW.md` (verificado en la hermana STORY-180, AC-1). La independencia de STORY-185 no cambia.

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Cerrar la definición operativa de «mismo defecto» en la historia, sin decidir la implementación: cómo se compara el `Archivo:Línea` (¿línea exacta o rango?) y qué es la «categoría de hallazgo» (¿la lista de los 4 revisores o un campo del informe?). Un par de ejemplos concretos en Notas bastan para que cualquier miembro estime. Definir qué es «escenario de fallo concreto» (p. ej., «contiene entrada/estado y resultado erróneo observable») para que AC-1 sea decidible.

**Cambio realizado:** En «Notas / contexto adicional»:
- La regla de igualdad cambia a «mismo archivo, misma línea o rangos que se solapan, y la misma corrección los resuelve», con tres ejemplos: uno que se fusiona y dos que no.
- Se quitó «misma categoría». La única categoría que tiene el informe es la columna `Dimensión`, y cada revisor escribe la suya (`SKILL.md`, Paso 4f). Con esa condición, dos revisores nunca podrían fusionar un hallazgo, lo que contradice AC-2. Se deja escrito que esa columna no se compara y que el hallazgo fusionado lista las dimensiones de quienes lo reportaron.
- Se añadieron dos definiciones. «Escenario de fallo concreto»: una entrada o un estado de partida más el resultado erróneo observable, con un ejemplo y dos contraejemplos. «`Archivo:Línea` válido»: una ruta con línea o con rango. También se aclara que solo se verifica HIGH y MEDIUM.
- El mecanismo de comparación sigue en manos de `/story-design`.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** No requiere split, pero conviene acotar: reducir los pasos por escenario (AC-1 y AC-2 tienen 6 cada uno) agrupando los `Entonces` en una sola aserción verificable, o dejar explícito que la verificación y la deduplicación comparten el mismo punto de inserción y no se pueden entregar por separado.

**Cambio realizado:** Se aplicaron las dos opciones:
- **Escenarios más cortos.** AC-1 pasa de 6 pasos a 4 en un Scenario Outline: sus tres `Entonces` se juntan en «`<efecto>` para `max-severity`, para el veredicto y para `fix-directives.md`». AC-2 pasa de 6 pasos a 3, con un único `Entonces` que dice a la vez dónde aparece, con qué severidad y a quién cita.
- **Entrega indivisible.** La viñeta «Punto de inserción» pasa a llamarse «Punto de inserción y entrega indivisible». Explica que las dos partes se insertan en el mismo punto y se entregan juntas, porque las dos deciden qué hallazgos cuentan antes de calcular `max-severity`.

---

### F / T – Formato y Testeabilidad (mejoras no críticas, scores previos: F2 4, F3 4, T 4)

**Recomendación aplicada:** Añadir un AC-3 — Escenario alternativo / error que fije los límites (HIGH/MEDIUM con evidencia sigue contando; distinto `Archivo:Línea` o misma línea con distinto defecto no se fusionan); considerar un Scenario Outline con `Ejemplos` para las combinaciones de evidencia; renombrar AC-2 a «Escenario con datos»/«Deduplicación».

**Cambio realizado:**
- AC-1 es ahora un Scenario Outline con tres filas en `Ejemplos`: falta `Archivo:Línea`, falta el escenario de fallo, y están los dos. La tercera fila es el caso de contraste, en el que el hallazgo sí cuenta como bloqueante.
- AC-2 pasa a llamarse «Deduplicación» y usa valores concretos: `src/auth.js:42`, una severidad MEDIUM frente a una HIGH, y gana HIGH.
- Nuevo AC-3 «Escenario alternativo – Hallazgos distintos no se fusionan». Cubre una línea distinta en el mismo archivo y la misma línea con otra corrección, y usa `Pero`.
- CNF-2 suma el eval del caso «no se fusionan».
- La nota sobre el split dice ahora «escenarios de verificación y deduplicación» en lugar de «AC-1 y AC-2».

---

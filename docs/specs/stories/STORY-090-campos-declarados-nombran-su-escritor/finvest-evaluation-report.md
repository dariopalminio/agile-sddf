---
type: finvest-evaluation
story-id: STORY-090
finvest-score: 4.14
decision: APROBADA
evaluated: 2026-09-10
---

> **Nota:** este reporte refleja la historia **después** de aplicar las recomendaciones de `N` (soltar el
> número del principio y la forma de la anotación) y de reescribir el `Entonces` del escenario de error
> para que afirme un estado constatable del producto. La evaluación previa arrojaba `N = 3` y
> `FINVEST = 4.05` — aprobada por 0.05 sobre el umbral.

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor del framework SDDF que audita la coherencia entre templates y skills
> **Quiero** que ningún template declare un campo sin anotar qué skill lo escribe, empezando por retirar el campo FINVEST de `story.md` que hoy nadie lee
> **Para** detectar los campos huérfanos leyendo el template, en vez de descubrirlos auditando las 78 historias del repositorio

Archivo: `docs/specs/03-stories/STORY-090-campos-declarados-nombran-su-escritor/story.md`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | `Como` específico y `Para` excelente: contrasta el estado actual (auditar 78 archivos) con el deseado (leer el template), y es verificable. Baja a 4 porque el `Quiero` es **compuesto**: enuncia una regla general y además una instancia concreta unidas por "empezando por". Dos cláusulas en una |
| Criterios de aceptación | 5 | Sección presente con tres subapartados `###` nombrados: principal, alternativo y de error |
| Escenarios Gherkin | 5 | Tres bloques ```` ```gherkin ```` bien formados con `Dado/Y/Cuando/Entonces`; el escenario alternativo usa `Pero` |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ **Gateway superado** (F_score ≥ 2.5).

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | No depende de ninguna historia no entregada; puede ir antes o después de STORY-089. No llega a 5 porque la migración toca los 37 `story.md` que contienen la línea: es un recurso compartido con **cualquier** historia en vuelo, incluida STORY-089 |
| **N** – Negociable | 4 | Lo que prescribe es ahora el qué, no el cómo: retirar el campo es la conclusión de una auditoría con evidencia, y el enunciado del principio es el entregable mismo. La numeración se resuelve al escribirlo y la forma de la anotación queda delegada a `/story-design`, sujeta a un criterio negociable ("legible sin ejecutar nada") |
| **V** – Valiosa | 3 | El beneficio es real y explicable —dejar de arrastrar un campo con tres escritores y cero lectores— pero es higiene interna: no desbloquea ningún flujo que hoy esté roto para quien usa el framework. Es prevención, no capacidad entregada |
| **E** – Estimable | 4 | Alcance mecánico y contable: 2 templates, 3 skills, 37 archivos, 1 principio, 5 templates a anotar. La única incógnita (qué hacer con el score de STORY-067) está aislada y declarada como decisión, no como trabajo indefinido |
| **S** – Small | 3 | Tres escenarios y ~15 pasos, dentro de la banda ideal. Se queda en 3 y no sube porque la historia entrega **dos cosas**: la retirada con su migración masiva, y la regla con la anotación de los cinco templates |
| **T** – Testeable | 4 | Los tres escenarios son ahora objetivamente verificables: los consumidores siguen leyendo el reporte, la migración se detiene ante la historia sin reporte, y ningún template conserva un campo sin anotación —esto último comprobable leyendo cinco archivos—. No sube a 5 porque el escenario 1 exige ejecutar dos skills para comprobarse, no es una condición booleana simple, y no hay `Scenario Outline` con tabla |

**INVEST_Score = (4 + 4 + 3 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.14 / 5.0
**FINVEST Decisión:** APROBADA

El umbral es 4.00. La holgura sigue siendo estrecha: si `V` o `S` bajaran a 2, el resultado caería a `REFINAR` (4.05). Las dos dimensiones que quedan en 3 son deliberadas y están argumentadas abajo — no son deuda pendiente sino el precio honesto de un `chore` de prevención con dos entregables acoplados.

---

## Comentarios y Recomendaciones

### N – Negociable (4) — ✅ recomendaciones aplicadas

Dos detalles se habían colado sin que nadie los decidiera, y ambos quedaron corregidos:

- El **número** `17` se derivaba de que hoy hay 16 principios, y se habría roto si otra historia añadía uno antes. Ahora el requerimiento dice "nuevo principio" y delega la numeración al momento de escribirlo.
- El **formato de la anotación** (comentario en el template) era una opción razonable, no la única: podría ser una tabla de propiedad en `header-aggregation` o una sección en la propia constitución. Ahora el requerimiento fija el criterio negociable —"legible sin ejecutar nada y junto al campo que describe"— y remite la forma a `/story-design`.

Lo que la historia sigue prescribiendo es legítimo: retirar el campo es la conclusión de una auditoría con evidencia, y el enunciado del principio es el entregable mismo. `N` sube de 3 a 4.

### V – Valiosa (3) — recomendación accionable

Es la dimensión honestamente débil y conviene no maquillarla. A diferencia de STORY-089 —que desbloquea un ciclo hoy roto—, esta historia no habilita ninguna capacidad: evita un problema futuro y limpia uno cosmético. La rúbrica reserva el 4 para valor "cualitativamente medible" en fricción observable, y aquí la fricción que se elimina (leer diez grafías distintas de vacío) es menor.

**Recomendación:** anclar el `Para` a la magnitud ya medida en las notas, que es el argumento más fuerte y hoy no aparece en la cláusula de valor: *"...en vez de descubrirlos auditando 78 historias, como ocurrió con este campo, escrito por tres skills y leído por ninguno"*. No cambia el score por sí solo, pero convierte el valor en algo que se puede defender ante quien priorice el backlog.

Alternativa honesta: aceptar que un `chore` de prevención vive en `V=3` y que eso es correcto. La rúbrica está haciendo su trabajo.

### S – Small (3) — recomendación accionable

La historia entrega dos cosas: la **instancia** (retirar el campo, migrar 37 archivos) y la **regla** (el principio más la anotación de cinco templates). Separarlas es tentador, pero sería un error: una regla que se declara y no se aplica es exactamente el defecto que esta historia combate, y ya hay precedente en el repositorio con la lista blanca de archivos permitidos.

**Recomendación:** mantenerlas juntas y controlar el tamaño por el otro extremo — fijar en `/story-design` que la migración es un cambio mecánico script-generado en un commit aislado, separado del commit de la regla. Si al planificar resulta que reconstruir el reporte de STORY-067 crece más de lo previsto, **esa** es la pieza a extraer, no la regla.

### ✅ Resuelto — el escenario 3 ya tiene algo que constatar

El escenario de error decía *"Cuando se revisa ese template contra el principio de la constitución"* y afirmaba en el `Entonces` el resultado de esa revisión. No existía quién la ejecutara: la validación automatizada está declarada fuera de alcance, así que el criterio describía una lectura humana, no un estado comprobable del producto.

Era el mismo defecto que la historia denuncia, reproducido dentro de ella: una afirmación sin responsable asignado.

**Resuelto:** el `Entonces` ahora afirma que *ningún template de `$SPECS_BASE/specs/templates/` conserva un campo declarado sin anotación de escritor*, más la salida admitida para el campo huérfano (retirarlo o anotarlo). Se verifica leyendo cinco archivos, sin el script que quedó fuera de alcance, y de paso el requerimiento de anotación pasó de promesa a criterio de aceptación.

### Nota de método

Esta evaluación se aplicó sobre una historia redactada en esta misma sesión, y se reevaluó tras aplicar sus propias recomendaciones. Los dos 3 que quedan (`V` y `S`) son deliberados: subirlos sin fundamento habría dado un 4.4 cómodo pero falso. `V` no sube porque el valor sigue siendo prevención y no capacidad entregada, y `S` no sube porque la historia sigue entregando dos cosas — lo que se argumenta arriba que debe seguir así.

Solo se movió `N`, que era el único 3 con una causa corregible sin cambiar el alcance. `T` se mantiene en 4 pese a la mejora del escenario 3: la rúbrica reserva el 5 para condiciones directamente automatizables, y el escenario 1 exige ejecutar dos skills para comprobarse.

---
type: finvest-evaluation
story-id: STORY-162
finvest-score: 4.08
verdict: APPROVED
evaluated: 2026-10-25
---
# Evaluación FINVEST

## Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.08 ≥ 4.0, sin dimensiones críticas

## Historia evaluada

> **Como** Solo Builder que despliega cada incremento con `delivery-model: continuous`
> **Quiero** que `/story-delivery STORY-NNN` me pida afirmar que el incremento ya está desplegado antes de escribir `DELIVER/DONE`
> **Para** que el estado de la historia refleje lo que ya está en producción y no solo lo que está listo para salir

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Encabezado `# 📖 Historia` igual al template. Rol real y acotado (Solo Builder en `continuous`), acción concreta (afirmar el despliegue antes de `DELIVER/DONE`) y beneficio observable (el estado refleja lo que ya está en producción). |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con escenario principal (AC-1), escenario alternativo (AC-2) y escenario de error (AC-3), todos como subapartados `###`. |
| Escenarios Gherkin | 5 | Tres bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces`. AC-3 es un Scenario Outline con tabla `Ejemplos`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

_(Solo se completa si F_score ≥ 2.5)_

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Extiende el skill `story-delivery` que crea STORY-159. Esa historia está en `SPECIFY/DONE` y todavía no se implementó; las Notas piden implementar esta después. No es una dependencia crítica: el orden es lineal y explícito, el diseño puede avanzar en paralelo contra el de STORY-159, y lo que esta historia aporta (validar `delivery-model` y pedir la afirmación de despliegue) es una rama acotada del flujo. Aun así, no se puede codificar sin el skill base. |
| **N** – Negociable | 4 | Fija resultados, no soluciones: no dice cómo se formula la pregunta ni cómo se valida el valor. La única decisión cerrada (fallar cerrado ante `delivery-model` ausente o inválido) está justificada en las Notas con la convención del repo. |
| **V** – Valiosa | 4 | Valor claro y observable: en `continuous`, `DELIVER` significa «ya desplegado» (`docs/domains/domain-story-lifecycle.md`, `DeliveryModel`) y la historia evita que el estado lo afirme sin confirmación. Es un valor cualitativo, sin métrica cuantitativa. |
| **E** – Estimable | 3 | Se puede estimar en grueso (talla S) y todo lo que cita existe en el repo (`defaults.delivery-model: batch # batch \| continuous` en `sddf.config.yaml`, `DeliveryModel` en el dominio). La incertidumbre viene de cómo encaja con STORY-159, que la historia no aclara: (1) qué pasa en `continuous` con el criterio «el paquete publicado puede instalarse limpiamente» de `dod-story-deliver.md`, que STORY-159 marca como «no aplica en batch»; (2) si la afirmación de despliegue reemplaza la confirmación de entrega de STORY-159 o se suma a ella, y en qué orden se piden; (3) si AC-3 cambia el comportamiento de STORY-159 cuando no hay `delivery-model`. |
| **S** – Small | 2 | 3 escenarios más una fila adicional de `Ejemplos`: 4 casos en total, en la banda 4–5, con unos 15 pasos. El cambio real es chico (una rama en un skill que ya existe más la validación de un valor de configuración), pero la señal primaria lo ubica en «Grande». No llega al umbral de split (≥ 6 casos). Mismo criterio que se aplicó a STORY-159. |
| **T** – Testeable | 4 | Happy path, alternativo y error bien formados. El resultado se puede comprobar con exactitud: el frontmatter de `story.md`, «`story.md` no cambia» y CNF-1 (byte a byte, sin archivos nuevos). AC-3 es un Outline con datos concretos. Una limitación: los mensajes de AC-2 y AC-3 describen el contenido («informa que…»), no son textos exactos. |

**INVEST_Score = (2 + 4 + 4 + 3 + 2 + 4) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 2 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.08 / 5.0

---

## Comentarios y Recomendaciones

### I – Independencia (2)

- **Asegurar el orden y desacoplar el diseño:** dejar STORY-159 en `DELIVER/DONE` (o al menos con `story-implement` cerrado) antes de activar esta historia; WIP = 1 lo obliga de todos modos. Para bajar el acoplamiento, pedir en el `design.md` de STORY-159 un punto de extensión explícito («resolver `delivery-model` → aplicar la política del modelo») que esta historia complete sin reescribir el flujo base.

### E – Estimable (3)

- **Resolver el criterio de instalación en `continuous`:** agregar un `Y` a AC-1 o una nota que indique cómo se presenta en `continuous` el criterio «el paquete publicado puede instalarse limpiamente con `npm install agile-sddf`». Lo coherente con «ya desplegado» es que se evalúe (por comando o con confirmación humana) en lugar de mostrarse como «no aplica».
- **Fijar cómo se combina con la confirmación de STORY-159:** decir en las Notas si la afirmación de despliegue reemplaza la confirmación de entrega o se pide después de ella, y que el skill solo pregunta si el DoD está cumplido (los casos de STORY-159 AC-2 siguen valiendo en `continuous`).
- **Delimitar el impacto de AC-3 sobre `batch`:** aclarar que la validación de `delivery-model` se aplica antes de cualquier rama, de modo que una configuración ausente o inválida también bloquee a quien use `batch`. Es un cambio de comportamiento visible del skill que crea STORY-159.

### S – Small (2)

- **No hace falta otro split:** S = 2 no es crítico y la historia ya es una hermana del split de STORY-159. Separar AC-3 (validación de `delivery-model`) en otra historia dejaría el skill sin forma de distinguir los modelos.
- **Controlar el tamaño en `story-tasking`:** dos bloques (validación de configuración para AC-3; rama `continuous` para AC-1 y AC-2) más las pruebas de CNF-1.

### Otras observaciones (score > 3)

- **T / AC-2 y AC-3:** en el diseño, fijar el texto o el patrón de los mensajes (p. ej. «en continuous, DELIVER exige que el incremento ya esté desplegado»; «defaults.delivery-model ausente o inválido: use batch o continuous») para que los escenarios se puedan automatizar con comparación exacta.
- **T / AC-3:** el Outline cubre ausente y un valor desconocido; conviene añadir una fila con un valor vacío (`delivery-model: ""`) o con mayúsculas (`Continuous`) si el diseño decide no normalizar.

---
type: finvest-evaluation
story-id: STORY-124
finvest-score: 3.68
decision: DIVIDIR
evaluated: 2026-10-12
---

# Evaluación FINVEST

## Historia evaluada

> Como SDDF Maintainer que necesita un gateway de calidad antes de liberar una épica, quiero un skill `epic-validate` que verifique cinco condiciones objetivas y escriba un reporte binario, para bloquear el paso `DEVELOP → VALIDATE` cuando la épica no está lista para SHIP.

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | La sección `# 📖 Historia` y las tres cláusulas están presentes; el rol, la capacidad y el beneficio son concretos. |
| Criterios de aceptación | 5 | La sección requerida contiene escenarios principales, alternativos y de error, todos nombrados como subapartados. |
| Escenarios Gherkin | 4 | Los 20 escenarios están en bloques `gherkin` y usan `Dado/Cuando/Entonces`, con pasos `Y`. No hay `Scenario Outline` con `Ejemplos` ni escenario que emplee `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ **Gateway superado:** el formato permite evaluar INVEST.

> Observación estructural: el frontmatter no se ajusta por completo al template: falta `alwaysApply` y `parent`, `kind` contiene `featnullEPIC-124-framework-consistency`, y `related: null` no sigue la lista esperada. Esto no reduce los tres componentes definidos para F, pero debe corregirse al refinar o dividir la historia.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Puede implementarse en paralelo en buena parte, pero la integración del pre-flight de transición y los cambios en documentación/pipeline crean dependencias de orden con el ciclo de vida de épicas. |
| **N** – Negociable | 2 | Predetermina rutas, nombres de archivos, dependencias, cinco comprobaciones, formato de reporte, pruebas, documentación y orden de implementación; queda poco espacio para negociar el cómo. |
| **V** – Valiosa | 4 | El beneficio es claro: evita avanzar épicas no listas y da un veredicto reproducible a mantenedores. Falta una métrica de resultado para elevarlo a 5. |
| **E** – Estimable | 2 | Es posible una estimación gruesa, pero hay incertidumbres relevantes: ejecución de smoke tests en staging, contrato de transición, interpretación de reportes existentes y compatibilidad entre runtimes. Requiere acotar o hacer un spike. |
| **S** – Small | ⚠️ 1 | Contiene 20 escenarios y abarca un nuevo skill, lógica de validación, CLI/modos, reportes, evals, integración de máquina de estados, empaquetado y cuatro documentos. Es una épica, no una historia implementable de forma segura. |
| **T** – Testeable | 4 | Los escenarios definen resultados observables, códigos de salida y efectos de escritura. Conviene precisar el mecanismo de ejecución de smoke tests y resolver contradicciones antes de automatizarlos. |

**INVEST_Score = (3 + 2 + 4 + 2 + 1 + 4) / 6 = 2.67 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0  
**I – Independencia:** 3 / 5  
**N – Negociable:** 2 / 5  
**V – Valiosa:** 4 / 5  
**E – Estimable:** 2 / 5  
**S – Small:** ⚠️ 1 / 5  
**T – Testeable:** 4 / 5

**FINVEST Score:** 3.68 / 5.0  
**FINVEST Decisión:** **DIVIDIR**

La decisión es automática porque **S = 1**, independientemente del score global.

---

## Comentarios y Recomendaciones

### I — Independencia (3/5)

- Separar la integración del pre-flight `DEVELOP → VALIDATE` en una historia posterior, dependiente solo del contrato CLI ya entregado por `epic-validate`.
- Mantener la historia base centrada en un contrato de entrada/salida que pueda ejercitarse con fixtures locales.

### N — Negociable (2/5)

- Convertir la tabla de archivos y el orden de implementación en notas técnicas no vinculantes; conservar en los criterios únicamente el comportamiento observable.
- Mover las decisiones de librería (`fs-extra`) y las rutas internas de implementación al futuro `design.md`.

### E — Estimable (2/5)

- Definir primero cómo se representa y ejecuta un smoke test de épica en staging; si el contrato no existe, crear un spike acotado.
- Aclarar si un veredicto `NEEDS-REFINEMENT` en `epic-analyze-report.md` bloquea: AC-3 lo trata como ERROR, pero la lista de pruebas sugeridas indica que sería WARNING y no bloquearía.

### S — Small (1/5)

- Dividir, como mínimo, en: (1) motor/CLI de `epic-validate` y reporte para historias terminales + análisis; (2) validación de smoke tests, `verify.release` y DoD; (3) integración del pre-flight y actualizaciones de documentación/empaquetado; (4) evals y casos de idempotencia/dry-run si su esfuerzo no cabe en las anteriores.
- Mantener cada historia con 2–3 escenarios Gherkin que demuestren un comportamiento coherente y un caso de error.

### Correcciones adicionales

- Corregir el frontmatter antes de planificar: asignar un `kind` válido, declarar `parent` y usar `related` según el template.
- Tras dividir, incorporar un escenario Gherkin alternativo con `Pero` o un `Scenario Outline` con tabla `Ejemplos` cuando aporte cobertura real.


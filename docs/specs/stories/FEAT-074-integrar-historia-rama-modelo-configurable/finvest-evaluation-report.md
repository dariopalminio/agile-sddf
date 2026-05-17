---
type: finvest-evaluation
story-id: FEAT-074
finvest-score: 3.88
decision: DIVIDIR
evaluated: 2026-05-17
---

# Reporte FINVEST — FEAT-074

**Historia:** story-integrate — Integración multi-estrategia configurable de historias

## Scores

| Dimensión | Score | Estado |
|-----------|:-----:|--------|
| F – Formato | 4.60 | ✅ |
| I – Independiente | 4 | ✅ |
| N – Negociable | 3 | ⚠️ |
| V – Valiosa | 3 | ⚠️ |
| E – Estimable | 3 | ⚠️ |
| S – Small | **1** | ⚠️ DIVIDIR |
| T – Testeable | 5 | ✅ |

```
F_score      = 4.60
INVEST_Score = 3.17
FINVEST_Score= 3.88
Decisión     = ⚡ DIVIDIR
```

## Detalle F (Formato)

| Componente | Peso | Score | Resultado |
|---|:---:|:---:|---|
| `# 📖 Historia` + `Como/Quiero/Para` | 40% | 4 | Completo; `Quiero` ligeramente solution-oriented ("un skill que...") |
| `## ✅ Criterios de aceptación` con `###` | 30% | 5 | 5 sub-escenarios nombrados + Requerimiento |
| Bloques ` ```gherkin ` | 30% | 5 | 5 bloques + Scenario Outline con tabla `Ejemplos` |

`F_score = (4×0.4) + (5×0.3) + (5×0.3) = 1.60 + 1.50 + 1.50 = 4.60`

## Comentarios por dimensión

### N – Negociable (3) ⚠️
Los flags `--mode manual`, `--dry-run` y el mecanismo `gh pr list` están prescriptos en los Gherkins. Esto limita la conversación sobre el cómo.

**Recomendación:** Expresar los escenarios en términos de comportamiento observable ("el skill no ejecuta acciones reales") en vez de flags concretos — los flags son decisiones de diseño que el equipo debería poder negociar.

### V – Valiosa (3) ⚠️
El `Para` es correcto pero intangible ("estandarizar y facilitar").

**Recomendación:** Añadir una métrica observable, por ejemplo: "sin requerir cambios en el skill al adoptar un nuevo modelo de branching" o "reduciendo a cero los merges manuales fuera del flujo de branching definido".

### E – Estimable (3) ⚠️
El mecanismo de delegación en scripts externos introduce incertidumbre de alcance.

**Recomendación:** Acotar a un esquema de branching concreto (sddf default) en la primera historia y tratar los demás en historias separadas.

### S – Small (1) ⚠️ — TRIGGER: DIVIDIR
La historia tiene **6 escenarios efectivos** (4 individuales + 2 filas del Scenario Outline), superando el umbral de épica (≥6). El story.md mismo reconoce el riesgo.

**Plan de división sugerido:**

| Historia | Escenarios | Foco |
|----------|-----------|------|
| FEAT-074a | Esc. 1 (batch happy path) + Esc. 2 (idempotencia PR) | Integración batch + configuración externa |
| FEAT-074b | Esc. 3 (modo manual) + Esc. 4 (dry-run) | Modos de ejecución |
| FEAT-074c | Esc. 5 (Scenario Outline multi-modelo) | Soporte continuo + modelos futuros |

**Próximo paso:** ejecutar `/story-split FEAT-074`

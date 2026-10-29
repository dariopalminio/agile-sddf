---
alwaysApply: false
type: story
id: STORY-128
kind: feat
slug: STORY-128-evaluar-validacion-epica-repetible
title: "Evaluar la validación de épicas de forma repetible"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-12
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124
  - STORY-125
  - STORY-126
  - STORY-127
  - STORY-138
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Evaluar la validación de épicas de forma repetible

**Como** Solo Builder y mantenedor de Agile-SDDF que evoluciona el gateway de calidad  
**Quiero** contar con casos de evaluación que demuestren sus veredictos `APPROVED`, `NEEDS-CHANGES` y `BLOCKED`  
**Para** detectar regresiones antes de distribuir cambios del gateway

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Épica consistente
```gherkin
Dado una épica de evaluación con toda la evidencia requerida aprobada
Cuando se ejecuta la evaluación del gateway
Entonces el veredicto esperado y el observado son APPROVED
```

### AC-2 — Escenario alternativo — Épica no aprobada
```gherkin
Esquema del escenario: Épica no aprobada
  Dado una épica de evaluación <condición>
  Cuando se ejecuta la evaluación del gateway
  Entonces el veredicto esperado y el observado son <veredicto>
    Y el reporte identifica <motivo>
Ejemplos:
  | condición                                                         | veredicto     | motivo                                              |
  | con una historia hija en estado no terminal                       | NEEDS-CHANGES | la historia y su estado                             |
  | cuyos smoke tests no se pueden ejecutar                           | BLOCKED       | la comprobación que no se pudo ejecutar             |
  | con una historia no terminal y smoke tests que no se pueden ejecutar | NEEDS-CHANGES | la historia no terminal y la comprobación bloqueada |
```

### AC-3 — Escenario de regresión — Resultados repetibles
```gherkin
Dado los mismos artefactos de evaluación
Cuando se ejecutan nuevamente los casos
Entonces skills/epic-validate/evals/evals.json conserva al menos un caso APPROVED, uno NEEDS-CHANGES y uno BLOCKED
  Y cada caso obtiene su veredicto esperado sin requerir intervención manual
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Cobertura mínima:** los casos cubren al menos un resultado `APPROVED`, uno `NEEDS-CHANGES` y uno `BLOCKED`.
- **CNF-2 — Determinismo:** los resultados no dependen de servicios externos no controlados por el caso de evaluación. El caso `BLOCKED` provoca el bloqueo con un comando de prueba controlado por el propio caso, por ejemplo uno inexistente.
- **CNF-3 — Lectura cerrada del veredicto:** el veredicto observado se lee del campo `verdict` del frontmatter de `epic-validate-report.md`. El caso también exige que la primera línea de `## Veredicto` declare el mismo valor. Un `verdict` ausente, distinto del de `## Veredicto` o fuera de `APPROVED`, `NEEDS-CHANGES` y `BLOCKED` hace fallar el caso.

## 🚫 Fuera de alcance

- Diseñar nuevas condiciones para el gateway.
- Integrar el gateway con la transición de estados.
- Cambiar la documentación o el empaquetado.

## 📎 Notas / contexto adicional

- Esta historia verifica el comportamiento entregado por sus hermanas sin reabrir su alcance funcional.
- **Contrato de validación:** el veredicto sigue [`validation-contract-policy.md`](../../../policies/validation-contract-policy.md) (STORY-138). Para `epic-validate` los valores permitidos son `APPROVED`, `NEEDS-CHANGES` y `BLOCKED`, declarados en `verdict` y en `## Veredicto` (G-01, G-02, G-03). CNF-3 aplica la lectura cerrada ante fallo (G-06) y la tercera fila de AC-2 cubre la precedencia de `NEEDS-CHANGES` sobre `BLOCKED` (G-05).
- **Vocabulario según EPIC-23:** `NEEDS-CHANGES` significa que la evidencia existe pero no cumple; `BLOCKED`, que un bloqueo impide obtenerla. Antes, `BLOCKED` significaba «la validación falló»; ese caso es ahora `NEEDS-CHANGES`.
- Cubre el criterio de salida de EPIC-23: **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED, una inconsistente que resulte NEEDS-CHANGES y una cuya evidencia no se puede obtener que resulte BLOCKED.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.

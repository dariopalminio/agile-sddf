---
alwaysApply: false
type: story
id: FEAT-080
slug: test-skill-verify
title: "test-skill-verify"
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
created: 2026-05-28
updated: 2026-05-28
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-079-impl-skill-builder
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]
[[FEAT-079-impl-skill-builder]]

# 📖 Historia: test-skill-verify

**Como** desarrollador o QA que quiere publicar un skill SDDF con confianza  
**Quiero** ejecutar el skill test-skill-verify sobre un skill ya implementado  
**Para** obtener un informe objetivo de tasa de acierto, consumo de tokens y comparativa `with_skill` vs `without_skill` que sirva de quality gate antes de publicar

## ✅ Criterios de aceptación

### Escenario principal – Benchmark exitoso con tasa ≥ 95%
```gherkin
Dado un skill implementado con SKILL.md y evals/evals.json con al menos 5 casos de prueba
  Y el entorno SDDF supera el preflight sin errores
Cuando el usuario invoca el skill test-skill-verify apuntando al directorio del skill
Entonces el skill ejecuta todos los casos de evals.json con el skill activo (with_skill)
  Y ejecuta los mismos casos sin el skill activo (without_skill) como línea base
  Y calcula la tasa de acierto: (casos correctos with_skill / total) * 100
  Y genera un informe en evals/benchmark-report.json con: tasa de acierto, tiempo promedio por caso, tokens consumidos y comparativa with vs without
  Y muestra en consola un resumen con resultado PASS si la tasa ≥ 95%
```

### Escenario alternativo – Tasa de acierto por debajo del umbral (< 95%)
```gherkin
Dado un skill implementado cuya tasa de acierto es inferior al 95%
Cuando el skill ejecuta el benchmark completo
Entonces el informe registra resultado FAIL con la tasa obtenida (ej. 82%)
  Y el skill muestra los casos fallidos con el output esperado vs el output obtenido
  Y sugiere al usuario ejecutar impl-skill-builder en fase REFACTOR para mejorar el skill
  Pero no modifica el SKILL.md ni los evals automáticamente
```

### Escenario alternativo – evals.json ausente o vacío
```gherkin
Dado un directorio de skill sin evals/evals.json o con evals.json vacío
Cuando el usuario invoca el skill test-skill-verify
Entonces el skill muestra el mensaje "No se encontraron casos de prueba en evals/evals.json — define al menos un eval antes de ejecutar el benchmark"
  Y detiene la ejecución sin generar informe
```

### Escenario alternativo – Costo de tokens excesivo
```gherkin
Dado un skill cuyo benchmark acumula más de un umbral de tokens configurado (ej. 100k tokens por ejecución)
Cuando el skill detecta que el costo proyectado supera el umbral al evaluar los primeros 3 casos
Entonces el skill muestra una advertencia con el costo estimado y solicita confirmación para continuar
  Y permite al usuario cancelar o reducir el conjunto de evals a ejecutar
```

### Escenario con datos – Umbrales de calidad
```gherkin
Escenario: test-skill-verify aplica distintos umbrales según criticidad del skill
  Dado un skill con nivel de criticidad "<criticidad>"
  Cuando se ejecuta el benchmark
  Entonces el resultado es "<resultado>" si la tasa de acierto es "<tasa>"
Ejemplos:
  | criticidad | tasa  | resultado |
  | crítico    | 98%   | PASS      |
  | crítico    | 94%   | FAIL      |
  | estándar   | 95%   | PASS      |
  | estándar   | 89%   | FAIL      |
```

## ⚙️ Criterios no funcionales

* Quality gate automático: el skill debe retornar un código de salida diferente a cero si el benchmark falla (para integrarse en CI/CD)
* Reproducibilidad: el benchmark debe ejecutarse con temperatura = 0 (o equivalente de baja varianza) para resultados comparables
* Formato del informe: benchmark-report.json debe ser parseable por herramientas externas (schema estable, versión explícita)
* Comparativa obligatoria: el informe siempre incluye el delta `with_skill` vs `without_skill` — no se acepta solo medir `with_skill`

## 📎 Notas / contexto adicional

- **Entrada obligatoria:** un skill implementado con `SKILL.md` + `evals/evals.json` (output de `impl-skill-builder`, FEAT-079).
- **Salidas:** `evals/benchmark-report.json` + `evals/benchmark-report.html` (resumen legible).
- El skill puede integrarse opcionalmente con `skill-creator` para reutilizar su infraestructura de evaluación.
- Umbral por defecto: 95%. Configurable por skill mediante un campo `quality_threshold` en el frontmatter de `SKILL.md`.
- Generado desde: EPIC-14-fabrica-de-skills | Feature: FEAT-080 — test-skill-verify

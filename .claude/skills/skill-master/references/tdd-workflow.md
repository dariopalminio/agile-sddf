# Ciclo TDD para Skills: RED → GREEN → REFACTOR

## Principio

Todo skill crítico se construye con Test-Driven Development. El test (eval) define el contrato del skill antes de que exista el skill. Si no hay eval, no hay garantía de calidad.

```
[RED] Definir evals.json → verificar que falla sin el skill
  ↓
[GREEN] Escribir SKILL.md mínimo que pasa el eval
  ↓
[REFACTOR] Mejorar sin romper el eval
```

---

## Fase RED — Definir los evals ANTES del SKILL.md

### Qué hacer
1. Crear `evals/evals.json` con al menos un **pressure scenario** (ver `skill-evals-format.md`)
2. Definir el criterio de éxito medible (qué debe aparecer en el output)
3. Ejecutar el pressure scenario **sin el skill** y verificar que el output falla el criterio

### Pressure scenario
Un pressure scenario es invocar al agente o sistema que usará el skill **sin** cargarlo, y verificar que el output es más pobre o incorrecto sin él.

**Ejemplo genérico — skill `pdf-summarizer`:**
- Invocar el agente sobre un PDF sin cargar `pdf-summarizer`
- Verificar que el output NO incluye el resumen estructurado con secciones (key findings, recommendations, etc.)
- Ese output desestructurado es la "línea base RED"

### Criterio de salida de RED
- El eval está escrito y documentado
- Ejecutar el skill en este punto produce un fallo medible (output incompleto o incorrecto)
- El criterio de éxito está definido cuantitativamente cuando sea posible

---

## Fase GREEN — SKILL.md mínimo que pasa el eval

### Qué hacer
1. Escribir el `SKILL.md` con el mínimo contenido necesario para que el pressure scenario pase
2. NO optimizar, NO agregar casos edge, NO pulir redacción
3. Ejecutar el eval y verificar que pasa

### Reglas de GREEN
- DEBE pasar el pressure scenario definido en RED
- NO DEBE agregar lógica que no sea necesaria para pasar el eval
- Si el eval pasa con 10 líneas, el SKILL.md tiene 10 líneas — no más

### Criterio de salida de GREEN
- El eval pasa (output contiene los elementos definidos en el criterio de éxito)
- El SKILL.md existe y está funcional

---

## Fase REFACTOR — Mejorar manteniendo el eval en verde

### Qué hacer
1. Mejorar la redacción del SKILL.md (claridad, completitud, ejemplos)
2. Agregar casos edge al eval y hacerlos pasar
3. Mejorar los archivos de `references/`, `assets/` o `examples/`
4. Refactorizar sin cambiar el comportamiento observable

### Reglas de REFACTOR
- El pressure scenario del RED DEBE seguir pasando después de cada cambio
- Cada mejora DEBE estar motivada por un eval que falla antes y pasa después
- NO agregar funcionalidad no probada (si quieres agregar algo nuevo, vuelve a RED)

### Criterio de salida de REFACTOR
- Todos los evals pasan (incluidos los nuevos agregados en esta fase)
- El skill es más claro, completo o eficiente que al final de GREEN

---

## Ejemplo completo: skill `commit-formatter`

```
RED:
  eval: { "input": "Added user login", "expected_contains": "feat(auth):" }
  sin skill: el agente genera un mensaje libre sin formato convencional

GREEN:
  SKILL.md: "Formatea el mensaje de commit en Conventional Commits (tipo(scope): descripción)"
  eval pasa: output contiene "feat(auth):" ✓

REFACTOR:
  Agregar eval: { "input": "Fixed null pointer in parser", "expected_contains": "fix(parser):" }
  Mejorar SKILL.md: distinguir feat/fix/chore/docs según el verbo del input
  Ambos evals pasan ✓
```

---

## Cuándo NO aplicar TDD completo

| Caso | Recomendación |
|------|--------------|
| Skill `type: reference` | Los evals son opcionales; la calidad se mide indirectamente por el orquestador |
| Skill trivial (< 5 líneas de instrucción) | Documentar el caso esperado en `examples/` es suficiente |
| Prototipo exploratorio | Anotar `status: DRAFT` en frontmatter; TDD antes de pasar a `status: STABLE` |

---

## Tabla de criterios por fase

| Fase | Artefacto | Criterio de salida |
|------|-----------|-------------------|
| RED | `evals/evals.json` | Eval escrito; pressure scenario falla sin el skill |
| GREEN | `SKILL.md` (mínimo) | Pressure scenario pasa |
| REFACTOR | `SKILL.md` (mejorado) + evals adicionales | Todos los evals pasan; skill más claro |

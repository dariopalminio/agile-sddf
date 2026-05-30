---
alwaysApply: false
type: story
id: FEAT-083
slug: FEAT-083-skill-test-evals
title: "skill-test-evals — generación de evals/evals.json para skills desde cualquier fuente"
status: COMPLETED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-078-implement-tdd-fase-red
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]

# 📖 Historia: skill-test-evals — generación de evals/evals.json para skills desde cualquier fuente

**Como** practitioner de SDDF que está iniciando el ciclo TDD para construir o modificar un skill,  
**Quiero** que `skill-test-evals` genere el archivo `evals/evals.json` a partir de la fuente de especificación disponible (`testcases.md`, `story.md`/`design.md` o un `SKILL.md` existente),  
**Para** establecer la fase RED del ciclo TDD antes de escribir o modificar el `SKILL.md`, garantizando que los casos de prueba definan el comportamiento esperado antes del código.

## ✅ Criterios de aceptación

### Escenario principal – Generación desde testcases.md: evals.json con un caso por escenario
```gherkin
Dado que existe un archivo testcases.md con casos de prueba para el skill a construir
  Y skill-test-evals es invocado con el story_id de la historia asociada
Cuando el skill procesa los casos de testcases.md
Entonces genera .claude/skills/{slug}/evals/evals.json
  Y el archivo contiene al menos un caso por escenario de testcases.md
  Y cada caso incluye los campos id, name, description, input, expected y threshold
```

### Escenario alternativo – Fallback a story.md y design.md cuando testcases.md no existe
```gherkin
Dado que testcases.md no existe en el directorio de la historia
  Y existen story.md y design.md con criterios de aceptación definidos
Cuando skill-test-evals es invocado
Entonces emite ⚠️ "testcases.md no encontrado — generando evals desde story.md y design.md"
  Y genera evals/evals.json derivando un caso por cada criterio de aceptación de story.md
  Pero no detiene la ejecución por la ausencia de testcases.md
```

### Escenario alternativo – Generación desde SKILL.md existente para modificación de skill
```gherkin
Dado que existe un SKILL.md en .claude/skills/{slug}/ de un skill que se quiere modificar
  Y skill-test-evals es invocado con el skill_id del skill existente
Cuando el skill procesa el SKILL.md
Entonces genera evals/evals.json con casos de prueba que cubren el flujo principal del SKILL.md
  Y los casos incluyen al menos un happy path y un escenario de error por sección "Manejo de errores"
```

### Requerimiento: declarado en sddf-config.yaml para invocación agnóstica

`skill-test-evals` debe estar declarado en `docs/policies/sddf-config.yaml` bajo la sección `implementing.test_generators` con `type: eval`. Esto permite que `story-implement-tdd` lo descubra e invoque sin acoplamiento directo: cambiar el skill de generación de evals solo requiere actualizar la configuración, no modificar el orquestador.

## ⚙️ Criterios no funcionales

* **Agnósticidad:** el skill genera evals para cualquier tipo de skill SDDF independientemente de su dominio (skills de planning, implementación, verificación, etc.)
* **Calidad mínima:** los casos generados deben tener threshold ≥ 0.9 para happy paths y 1.0 para casos de fail-fast, siguiendo el esquema estándar de evals.json del proyecto
* **Idempotencia:** si `evals/evals.json` ya existe, el skill pregunta al usuario antes de sobreescribir; nunca sobreescribe silenciosamente

## 📎 Notas / contexto adicional

- **Posición en el pipeline:** `story-implement-tdd` invoca `skill-test-evals` durante la Fase RED para que los evals queden establecidos antes de generar o modificar `SKILL.md`
- **Invocación:** el skill recibe del orquestador el bundle `{story_id, testcases_path, story_path, design_path}` vía el patrón un solo nivel de delegación
- **Fuentes de entrada en orden de prioridad:** (1) `testcases.md` → (2) `story.md` + `design.md` → (3) `SKILL.md` existente
- **Historias relacionadas:** FEAT-078 (Fase RED donde se invoca este skill), FEAT-079 (story-testcases que genera el testcases.md que este skill consume)
- **Configuración esperada en sddf-config.yaml:**
  ```yaml
  implementing:
    test_generators:
      - type: eval
        skill: skill-test-evals
        required: true
  ```

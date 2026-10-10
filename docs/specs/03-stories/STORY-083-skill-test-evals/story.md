---
alwaysApply: false
type: story
id: STORY-083
kind: feat
slug: STORY-083-skill-test-evals
title: "skill-test-evals â€” generaciÃ³n de evals/evals.json para skills desde cualquier fuente"
status: CANCELED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - STORY-078-implement-tdd-fase-red
---
[[fabrica-de-skills]]

# ðŸ“– Historia: skill-test-evals â€” generaciÃ³n de evals/evals.json para skills desde cualquier fuente

**Como** practitioner de SDDF que estÃ¡ iniciando el ciclo TDD para construir o modificar un skill,  
**Quiero** que `skill-test-evals` genere el archivo `evals/evals.json` a partir de la fuente de especificaciÃ³n disponible (`testcases.md`, `story.md`/`design.md` o un `SKILL.md` existente),  
**Para** establecer la fase RED del ciclo TDD antes de escribir o modificar el `SKILL.md`, garantizando que los casos de prueba definan el comportamiento esperado antes del cÃ³digo.

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ GeneraciÃ³n desde testcases.md: evals.json con un caso por escenario
```gherkin
Dado que existe un archivo testcases.md con casos de prueba para el skill a construir
  Y skill-test-evals es invocado con el story_id de la historia asociada
Cuando el skill procesa los casos de testcases.md
Entonces genera .claude/skills/{slug}/evals/evals.json
  Y el archivo contiene al menos un caso por escenario de testcases.md
  Y cada caso incluye los campos id, name, description, input, expected y threshold
```

### Escenario alternativo â€“ Fallback a story.md y design.md cuando testcases.md no existe
```gherkin
Dado que testcases.md no existe en el directorio de la historia
  Y existen story.md y design.md con criterios de aceptaciÃ³n definidos
Cuando skill-test-evals es invocado
Entonces emite âš ï¸ "testcases.md no encontrado â€” generando evals desde story.md y design.md"
  Y genera evals/evals.json derivando un caso por cada criterio de aceptaciÃ³n de story.md
  Pero no detiene la ejecuciÃ³n por la ausencia de testcases.md
```

### Escenario alternativo â€“ GeneraciÃ³n desde SKILL.md existente para modificaciÃ³n de skill
```gherkin
Dado que existe un SKILL.md en .claude/skills/{slug}/ de un skill que se quiere modificar
  Y skill-test-evals es invocado con el skill_id del skill existente
Cuando el skill procesa el SKILL.md
Entonces genera evals/evals.json con casos de prueba que cubren el flujo principal del SKILL.md
  Y los casos incluyen al menos un happy path y un escenario de error por secciÃ³n "Manejo de errores"
```

### Requerimiento: declarado en sddf-config.yaml para invocaciÃ³n agnÃ³stica

`skill-test-evals` debe estar declarado en `docs/policies/sddf-config.yaml` bajo la secciÃ³n `IMPLEMENT.test_generators` con `type: eval`. Esto permite que `story-implement` lo descubra e invoque sin acoplamiento directo: cambiar el skill de generaciÃ³n de evals solo requiere actualizar la configuraciÃ³n, no modificar el orquestador.

## âš™ï¸ Criterios no funcionales

* **AgnÃ³sticidad:** el skill genera evals para cualquier tipo de skill SDDF independientemente de su dominio (skills de planning, implementaciÃ³n, verificaciÃ³n, etc.)
* **Calidad mÃ­nima:** los casos generados deben tener threshold â‰¥ 0.9 para happy paths y 1.0 para casos de fail-fast, siguiendo el esquema estÃ¡ndar de evals.json del proyecto
* **Idempotencia:** si `evals/evals.json` ya existe, el skill pregunta al usuario antes de sobreescribir; nunca sobreescribe silenciosamente

## ðŸ“Ž Notas / contexto adicional

- **PosiciÃ³n en el pipeline:** `story-implement` invoca `skill-test-evals` durante la Fase RED para que los evals queden establecidos antes de generar o modificar `SKILL.md`
- **InvocaciÃ³n:** el skill recibe del orquestador el bundle `{story_id, testcases_path, story_path, design_path}` vÃ­a el patrÃ³n un solo nivel de delegaciÃ³n
- **Fuentes de entrada en orden de prioridad:** (1) `testcases.md` â†’ (2) `story.md` + `design.md` â†’ (3) `SKILL.md` existente
- **Historias relacionadas:** STORY-078 (Fase RED donde se invoca este skill), STORY-079 (story-testcases que genera el testcases.md que este skill consume)
- **ConfiguraciÃ³n esperada en sddf-config.yaml:**
  ```yaml
  IMPLEMENT:
    test_generators:
      - type: eval
        skill: skill-test-evals
        required: true
  ```

Nota de cancelaciÃ³n: esta historia se cancelÃ³ en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension
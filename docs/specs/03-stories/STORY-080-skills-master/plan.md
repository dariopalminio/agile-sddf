Renombrar skill-creato a skill-master (.claude/skills/skill-master/)

Archivos internos del skill a actualizar (6):

SKILL.md — frontmatter name + referencias en contenido
scripts/utils.py
scripts/aggregate_benchmark.py
references/schemas.md
references/skill-evals-format.md
references/skill-anatomy.md

Archivos externos a actualizar (7):
skills-lock.json — clave del registry
package.json — ruta en files
docs/policies/sddf-config.yaml — references_path
docs/policies/constitution.md
docs/policies/definition-of-done-story.md
docs/specs/stories/STORY-079-story-testcases/story.md

Reorganizar skill-master
Agregar flujo TDD a skill-master



Al parecer el skill-master actual está diseñado como un monolito que asume que el usuario va paso a paso desde la idea hasta la mejora iterativa, sin separar claramente la creación de los tests (evals.json) de la implementación del skill (SKILL.md). Para poder delegar desde fuera del skill estas dos fases de forma independiente (por ejemplo, un agente crea los evals, otro los usa para construir el skill), se debería añadir un mecanismo de modos y reestructurar el flujo.

Con estos cambios, se podrá invocar algo así:

/skill-master plan --story story.md & testcases.md o testo de entrada → genera evals/evals.json

/skill-master build → toma evals.json y produce SKILL.md siguiendo TDD

También sería bueno que pueda trabajar manual o automático. Manual en interacción con el usuario para construir el evaals y luego el skills y mejorarlo o automatico sin interacción humana.

Y recuerda que (aunque es usado por el framework SDDF) debe tratar de no tener dependencia con el framework SDDF, para que pueda ser usado en otros contextos o frameworks.
Haz un análisis y propuesta en un plan.

Los cambios implementados:

.claude/skills/skill-master/SKILL.md — reestructurado con:

Modes of Operation (nueva sección al inicio): define la interfaz pública con /skill-master plan, /skill-master build, y el flujo completo sin flags.
Mode: plan (nueva sección): 6 pasos — leer fuente, extraer intent, generar casos, checkpoint --manual/--auto, escribir evals/evals.json, reportar.
Mode: build (nueva sección): RED → GREEN → REFACTOR con lógica --auto (itera hasta pass_rate ≥ 0.95) vs --manual (pausa para feedback en cada ciclo).
Full Flow (contenido existente preservado intacto): con tabla de detección de estado para saltar al paso correcto.
.claude/skills/skill-master/assets/skill-template.md — skill-preflight y el paso Preflight marcados como opcionales/SDDF-only. El template es ahora usable fuera de SDDF sin modificación.

Para que skill-master entienda frases como "crear pruebas de...", "create skill", "crear test para un skill" y ejecute automáticamente el modo plan (generar evals.json), debes ampliar la sección de detección de intención al inicio del skill. A continuación se muestran los cambios necesarios en el SKILL.md.

Los cambios a aplicar en .claude/skills/skill-master/SKILL.md:

Nueva sección ## Intent detection (language-first) — tabla de mapeo de frases → modos, reglas de mapping (incluyendo auto con "automáticamente"/"sin pausas"), y ejemplo concreto con email-formatter.

Language triggers en ## Modes of Operation — cada modo tiene una línea > Language triggers: con ejemplos en español e inglés.

#### Capture Intent (fallback only) — el encabezado ahora indica que es fallback, con nota que redirige al modo correcto si el intent es claro.
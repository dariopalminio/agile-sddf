---
type: guide
slug: harness-engineering
title: "Harness Engineering"
date: 2026-03-26
status: null
substatus: null
parent: null
related:
  - best-practices-for-agents
  - best-practices-for-commands
  - best-practices-for-skills
---
<!-- Referencias -->
[[best-practices-for-agents]]
[[best-practices-for-commands]]
[[best-practices-for-skills]]

# Harness Engineering

Harness Engineering es un enfoque de diseño y desarrollo de sistemas de IA que se centra en crear un entorno controlado y estructurado para que la IA opere de manera eficiente y efectiva.

# Principios clave del Harness Engineering

Este enfoque se basa en varios principios clave:

* **El propio repositorio como sistema:** el repositorio de código no es solo el contenedor del software, sino el propio entorno de trabajo para la IA.
* **Orquestación multiagente:** dividir el trabajo utilizando un patrón donde un agente líder (orquestador) administra las tareas y decide cuándo delegar el trabajo a subagentes especializados.
* **Verificación y automejora:** se debe tener un sistema de verificación integrado (con mecanismos como "agentes revisadores" y "Quality Gates"), obligando a la IA a demostrar que algo funciona (por ejemplo, ejecutando tests automatizados) en lugar de solo decir que terminó.
* **Mantenlo simple con las herramientas (KISS):** otorgarle a la IA herramientas muy sencillas del ecosistema y dejar que la IA deduzca cómo resolver los problemas.
* **Gestión estricta de la memoria y el contexto:** la IA no debe acumular todo en su contexto; debe tener un sistema de memoria externa (ficheros locales o bases de datos) donde lea y escriba solo lo que necesita en cada momento.
* **Evita el "teléfono descompuesto":** cuando el agente padre crea subagentes, no debe pasarles todo su contexto heredado, en su lugar, los subagentes deben escribir sus resultados de forma independiente en un directorio `.tmp/<skill-name>/` para que otros agentes lean exclusivamente lo que necesiten. Ver patrón detallado en `[[best-practices-for-skills]]`.
* **Uso estricto de Protocolos de Inicialización:** La IA no puede empezar a trabajar hasta que un protocolo de verificación valide que el entorno es completamente sano. En este proyecto, ese protocolo está implementado como el skill `skill-preflight` (`[[skill-preflight]]`), que verifica la estructura de directorios, la existencia de templates y las dependencias requeridas antes de ejecutar cualquier skill. No se utiliza un script externo (`init.sh`) sino que la verificación está integrada como un skill reutilizable invocable desde cualquier otro skill.
* **Mantener buenas prácticas y estándares homogéneos:** El código base debe estar bien estructurado y definimos buenas prácticas y reglas claras para que los patrones de resultado esperado sean predecibles.


# Cómo funciona realmente el harness en Claude Code

## Mecanismos de ejecución

En Claude Code hay exactamente dos mecanismos de ejecución:

### Skill tool

- **Skill tool**: ejecuta un skill dentro de la sesión principal. No crea un proceso aparte ni un contexto aislado — es esencialmente "inyectar el SKILL.md como instrucciones y seguirlas". Si un skill "invoca" a otro skill, es la misma sesión leyendo otro archivo de instrucciones. Comparten todo el contexto.

### Agent/Task tool

- **Agent/Task tool**: lanza un subagente con contexto aislado. Pero solo puede lanzar tipos registrados — los agentes que viven en .claude/agents/ — o tipos genéricos (general-purpose).


## Mecanismos de organización de skills y agentes

### Composición inline entre skills (skill→skill)

- **Composición inline entre skills**: un skill puede incluir otro skill dentro de su propio markdown, utilizando la sintaxis `{{skill-name}}`. Esto es útil para reutilizar fragmentos de lógica o instrucciones comunes sin necesidad de crear un subagente separado. Sin embargo, al igual que con la Skill tool, todo se ejecuta en el mismo contexto compartido.

Cuando la sesión de Claude Code está ejecutando un skill-A y llega a la línea "Invocar el skill skill-B", lo que ocurre es:

1. La misma sesión (el mismo modelo, la misma conversación, la misma ventana de contexto) lee el archivo skill-B/SKILL.md.
2. Ese texto se añade al contexto de la conversación en curso, como si alguien hubiera pegado las instrucciones en el chat.
3. La sesión sigue esas instrucciones hasta terminarlas, y luego continúa donde iba con las instrucciones de skill-A.
No se crea ningún "segundo agente". No hay una frontera entre A y B. Es una sola mente leyendo dos documentos de instrucciones, uno dentro del otro.

```
Composición inline (skill→skill)
────────────────────────────────
Sesión principal
 │
 ├─ [instrucciones de skill-A]
 ├─ [instrucciones de skill-B]  ← pegadas aquí
 ├─ ...ejecuta skill-B...
 ├─ [continúa skill-A]
 ▼
 todo en UNA ventana de contexto
```
#### Las consecuencias prácticas

Que sea "misma sesión" implica cosas concretas, algunas buenas y otras peligrosas:

- Lo bueno: skill-B ve todo lo que skill-A ya sabía: la ruta de la historia, el resultado del preflight, lo que dijo el usuario. Por eso "pasarle parámetros" funciona sin ningún mecanismo formal — los "parámetros" ya están en la conversación.
No hay costo de arranque ni riesgo de "teléfono descompuesto": no hay handoff donde se pierda información.

- Lo peligroso: El contexto solo crece. Si skill-A compone 4 sub-skills de 400-600 líneas cada uno, la sesión termina cargando ~2.500 líneas de instrucciones simultáneamente activas. Las instrucciones de los primeros sub-skills siguen "vivas" en el contexto y pueden interferir con los últimos (el modelo puede mezclar reglas de story-tasking mientras ejecuta story-testcases). No hay aislamiento de fallos. Si skill-A deja la conversación en un estado confuso, skill-B lo hereda. Con un subagente, el desorden muere con el subagente y solo vuelve el resultado. No hay paralelismo. Inline es secuencial por definición. Por eso un skill-C sí necesita usar subagentes para 3 tareas: necesita lanzarlos en paralelo y con contextos limpios.


### Delegación a subagentes

Cuando se necesita aislamiento, paralelismo o un proceso separado, se puede usar la Agent/Task tool para lanzar un subagente. Este subagente no hereda el contexto de la sesión principal; en su lugar, comienza con un contexto limpio y recibe solo los parámetros que se le pasan explícitamente. El subagente realiza su tarea de forma independiente y luego devuelve un resultado a la sesión principal.

```
Delegación (subagente)              
─────────────────────               
Sesión principal    
  │ 
  ├─ spawn ──► Subagente 
  │            (contexto NUEVO, 
  │             aislado, no ve 
  │             la conversación)
  │◄─ resultado ─┘   
  ▼ 
  ```

### Orquestación

Podemos definir dos tipos de skills:

- **Skills-worker** (instrucciones puras: story-creation, release-format-validation): un subagente podría seguirlos sin problema. Es solo texto-guía.

- **Skills-orquestador** (story-plan, story-code-review, project-flow): estos skills delegan en subagentes y/o interactúan con el usuario. Ejecutados dentro de un subagente fallan por dos lados: el subagente normalmente no puede lanzar otros subagentes (el harness no le da la Task tool anidada), y no puede sostener una entrevista con el usuario. El skill intentaría hacer cosas que su entorno de ejecución no permite, y el modelo improvisaría — exactamente el no-determinismo que el framework quiere eliminar.

**Solo la sesión que ejecuta skills puede delegar en subagentes; un subagente nunca delega en otro subagente.** El subagente escribe su resultado en algún artefacto de comunicación como `.tmp/<skill-name>/` y devuelve el control.

El skill es el punto de entrada y coordinador: orquesta la ejecución, delega trabajo aislado o paralelo a agentes especialistas y consolida sus resultados en la salida final.
```
skill orquestador (entry point, sesión principal)
    ├── Skills-worker B (composición inline — misma sesión, cadena corta)
    ├── agent A (subagente — contexto aislado)
    └── agent C (subagente — contexto aislado)
                  └── ✗ prohibido: agente que delega en otro agente
```

```
skill orquestador (entry point, sesión principal)
    ├── agent A (subagente — contexto aislado)
    └── agent C (subagente — contexto aislado)
                  └── ✗ prohibido: agente que invoque un Skills-orquestador (que delega en otro agente)
```

### Invocación de skills desde subagentes

Un skill worker es justamente un caso seguro donde un subagente puede usar un skill, y hay dos maneras de hacerlo, con una distinción importante entre ellas.

#### Vía formal: la Skill tool (solo si el subagente la tiene)

Si el subagente tiene Skill en su lista de tools (o tools: *, como general-purpose), puede invocar el skill formalmente. El SKILL.md se expande inline dentro del contexto del subagente, este sigue las instrucciones, produce el artefacto y termina. No se crea ningún agente adicional, así que no hay segundo salto de delegación: sigue siendo un solo spawn (skill orquestador → subagente) con composición inline dentro del subagente.

En agile-sddf hoy esto solo aplicaría a los agentes locales lanzados como general-purpose; los 10 agentes registrados no tienen la Skill tool.

#### Vía informal: leer el SKILL.md con Read (funciona con cualquier subagente)

Aquí está el detalle interesante: un skill worker no necesita la Skill tool para ser "usado". Un SKILL.md es solo un archivo de instrucciones, y casi todos tus agentes tienen Read. El skill orquestador puede decirle al subagente en su prompt:

"Lee .claude/skills/story-creation/SKILL.md y sigue sus instrucciones para generar la historia en $STORY_DIR, usando estos valores: SPECS_BASE=docs, …"

Funcionalmente es lo mismo que invocarlo — el subagente carga las instrucciones en su contexto y las sigue — pero sin depender de que el harness le haya dado la herramienta. De hecho, esta es la forma que yo recomendaría documentar en SDDF, porque mantiene las listas de tools de los agentes mínimas (la garantía verificable de la que hablamos) y hace explícito qué skill usa cada subagente.

#### Las tres condiciones para que sea seguro

Que el skill sea "worker" significa que cumple esto, y conviene escribirlo como checklist:

1. No interactúa con el usuario — el subagente no puede sostener una entrevista ni pedir confirmaciones. Si el skill tiene pasos con AskUserQuestion, debe poder correr en el equivalente a tu "modo Agent" (defaults, sin preguntas).
2. No lanza subagentes — si los lanzara, tendrías subagente → subagente, el caso prohibido.
3. No depende de contexto conversacional que el subagente no tiene. Este es el que más se pasa por alto: los skills SDDF asumen que el preflight ya corrió y que SPECS_BASE está resuelto. El subagente arranca con contexto vacío — no sabe nada de eso. El orquestador debe pasarle los valores resueltos en el prompt (el "bundle"), o aceptar que el subagente re-ejecute skill-preflight por su cuenta (que es legal — preflight es worker puro, solo lecturas — pero duplica trabajo).

## Resumen de relaciones entre mecanismos de ejecución y organización:

| Invocación | Nombre | Mecanismo real | ¿Permitido? |
|------------|--------|----------------|-------------|
| skill → skill | composición | inline, sesión principal | ✅ cadenas cortas |
| skill → subagente | delegación | spawn (contexto nuevo y aislado) | ✅ un solo salto |
| subagente → skill worker | adopción | inline, dentro del subagente | ✅ con bundle de contexto |
| subagente → skill orquestador | delegación encubierta | inline que exige spawns que el subagente no puede hacer | ❌ |
| subagente → subagente | delegación anidada | spawn desde un spawn | ❌ |


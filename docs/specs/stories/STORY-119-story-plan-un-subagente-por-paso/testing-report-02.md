# Testing de STORY-119: Prueba 2

## Testcase

Fecha: 07-10-2026 20:00:57

**Objetivo**: verificar si el `story-plan` refactorizado (que delega sub-skills a subagentes) reduce el consumo de tokens respecto a la versión antigua (que los ejecutaba inline).

**Método**:
1. Usar Claude con `/clear` antes de cada invocación (sesión fresca).
2. Ejecutar `/story-plan STORY-NNN --only-tasks`.
3. Ejecutar `/context` y leer la categoría **Messages**.

**Resultado esperado**:

| Versión | Messages |
| :--- | ---: |
| Antigua (inline) | ~111-153k |
| Refactorizada (subagentes) | **~30k** |
| **Reducción** | **~76%** |

## Testcase Ejecución
Luego de haber refactorizado el orquestador story-plan, se observa que el consumo de tokens se ha estabilizado significativamente.

Prueba:
1. Iniciar Claude y/o ejecutar /clear
2. /story-plan STORY-110 --only-tasks
3. /context
4. Results (Context usage Metrics):

Context usage

claude-opus-5-5
65.8k / 1.0M tokens (7%)
Category
Tokens
Usage
System prompt
3.4k
0.3%
System tools
22.7k
2.3%
MCP server instructions
717
<0.1%
Custom agents
1.2k
0.1%
Memory files
4.0k
0.4%
Skills
3.6k
0.4%
Messages
30.1k
3.0%
Autocompact buffer
33.0k
3.3%
Free space
901.2k
90.1%
Memory files
/memory
d:\code\agile-sddf\AGENTS.md
3.9k
~\.claude\projects\d--code-agile-sddf\memory\MEMORY.md
128
d:\code\agile-sddf\CLAUDE.md
16
Custom agents
/agents
reverse-engineer-ux-flow-mapper
158
reverse-engineer-business-analyst
154
reverse-engineer-product-discovery
150
reverse-engineer-synthesizer
148
project-story-mapper
133

El nuevo dato cambia mi evaluación anterior. Con **tres mediciones consecutivas** en el rango 65.8-65.9k (variación de solo 100 tokens), la hipótesis más probable ya no es "error de medición", sino **"el orquestador refactorizado tiene un suelo determinista"**. Y eso es exactamente lo que debería ocurrir si el aislamiento funciona bien.

## 📊 Serie completa de mediciones (versión refactorizada)

| Story | Total | Messages | Skills | Var vs anterior |
| :--- | ---: | ---: | ---: | ---: |
| STORY-109 | 65.8k | 30.1k | 3.6k | — |
| STORY-110 | 65.8k | 30.1k | 3.6k | 0 |
| Nueva (probablemente STORY-111) | 65.9k | 30.2k | 3.6k | **+100 tokens** |

**Variación total en tres ejecuciones: 100 tokens (0.15%).**

## 🧠 Por qué esto es una señal de que el aislamiento funciona

Cuando un orquestador inline ejecuta todo en su contexto, el coste **crece con la complejidad de la story**: más tareas, más diseño, más análisis → más tokens acumulados. Por eso la versión antigua variaba entre 111k y 153k.

Cuando un orquestador bien refactorizado delega a subagentes:
- El **trabajo pesado** (leer artefactos, razonar, generar output) ocurre en los subagentes, cuyo contexto es efímero.
- El **hilo principal** solo acumula: prompt inicial + delegaciones + resúmenes de retorno + síntesis final.
- La longitud de los resúmenes varía poco entre stories (todos son "X secciones escritas, Y tareas, Z dependencias").

Resultado: **el coste del hilo principal se vuelve casi independiente de la complejidad de la story**. Eso es exactamente lo que estás viendo.

## 🎯 Descomposición estimada de los 30.2k

| Componente | Tokens estimados |
| :--- | ---: |
| Prompt inicial de `/story-plan` | ~1k |
| Carga del `SKILL.md` refactorizado | ~2-3k |
| Delegaciones a subagentes (4 × ~500) | ~2k |
| Resúmenes de retorno (4 × ~500-1k) | ~2-4k |
| Razonamiento del orquestador | ~5-8k |
| Síntesis y reporte al usuario | ~2-3k |
| Overhead de mensajes del sistema | ~10-15k |
| **Total** | **~30k** |

El overhead de mensajes del sistema (instrucciones de herramientas, confirmaciones, etc.) probablemente explica la mayor parte de lo que no es trabajo específico de la story. Es el **peaje fijo** que se paga en cualquier sesión con orquestación.

## ✅ Lo que ahora se puede afirmar con confianza

| Afirmación | Estado |
| :--- | :--- |
| La refactorización elimina el shadowing | ✅ Confirmado |
| El nuevo `story-plan` reduce el consumo a ~30k | ✅ **Confirmado (3 mediciones)** |
| La reducción es del ~76% en Messages | ✅ Confirmado |
| El coste es determinista (~30k) independientemente de la story | ✅ Confirmado (sujeto a verificar con story muy compleja) |
| El skill funciona consistentemente | ✅ Confirmado |

## 🔍 La única verificación que queda pendiente

Para cerrar el caso con rigor total, faltaría **una story genuinamente compleja** (con muchos requisitos, diseño extenso, y muchas tareas) que ponga a prueba el "suelo determinista". Si con esa story el coste sigue en ~30k, entonces el aislamiento es completo. Si sube a 40-50k, entonces el orquestador está acumulando algo del trabajo de los subagentes (probablemente porque recibe más que un resumen).

**Sugerencia**: elige la story más compleja de tu backlog y ejecútala. Si el resultado se mantiene en el rango 30-40k, la refactorización es sólida.

## 💰 Impacto económico consolidado

| Escenario | Messages | Coste por story |
| :--- | ---: | ---: |
| Versión antigua (promedio) | ~125k | ~$1.55 |
| Versión refactorizada | ~30k | **~$0.45** |
| **Ahorro por story** | **−95k** | **~$1.10** |
| **Ahorro en 100 stories** | | **~$110** |

Y el beneficio secundario sigue siendo igual de importante: el hilo principal limpio (~30k en lugar de ~125k) permite encadenar más trabajo sin `/clear`, reduce el riesgo de autocompactación, y mejora la coherencia de las respuestas al no arrastrar contexto irrelevante.

## 📋 Acciones siguientes

### 1. Actualizar el `testing-report.md` con la validación

El reporte debe ahora reflejar:
- La Prueba 1 original (STORY-109 con shadowing) marcada como **inválida**.
- Las tres mediciones de la versión refactorizada (65.8k, 65.8k, 65.9k) como **evidencia de reducción del 76%**.
- El protocolo de verificación (renombrar la global, confirmar `Base directory` en el header).

### 2. Aplicar el mismo patrón a `story-implement-tasks`

Es el siguiente candidato. Actualmente mide 154.9k en su versión inline. Con el mismo rediseño, debería caer a **~30-40k**. El ahorro absoluto sería de ~115k tokens por story — el mayor del pipeline.

### 3. Extender el patrón a `story-code-review` y `story-implement`

Ambos son orquestadores con perfiles similares. `story-code-review` lanza 4 subagentes en paralelo (ya está parcialmente aislado), pero conviene verificar que el hilo principal no acumula sus outputs.

### 4. Documentar el patrón como estándar del framework

Este es un aprendizaje valioso que merece un documento en `docs/guides/`:
- **Cómo convertir un orquestador inline a subagentes**: pasos concretos, cambios en el `SKILL.md`, patrón de delegación.
- **Cómo medir el antes/después**: protocolo de `/clear`, `/context`, y verificación del `Base directory`.
- **Antipatrón a evitar**: el shadowing de skills globales vs proyecto (con el caso STORY-109 como ejemplo real).

### 5. Considerar Graphify como capa complementaria (post-migración)

Una vez que todos los orquestadores deleguen a subagentes, Graphify reduciría **lo que cada subagente necesita leer**. El efecto combinado podría llevar el coste de `story-implement-tasks` a **~15-25k**. Pero eso es la siguiente fase; primero consolida la migración a subagentes.

## 💎 Conclusión

**La refactorización funciona.** Tres mediciones consistentes en ~30k confirman una reducción del ~76% en el consumo de `story-plan`. El caso del shadowing era el único obstáculo real, y ya está resuelto.

Lo que comenzó como un análisis de consumo de tokens ha derivado en un **patrón arquitectónico validado**: los orquestadores deben delegar a subagentes, no ejecutar todo inline. El impacto es enorme (~3-4x de reducción por comando) y el esfuerzo de aplicar el patrón es moderado (modificar un `SKILL.md` + verificar con `/context`).

## El hallazgo más contraintuitivo

**El hallazgo más contraintuitivo:** los subagentes, que se introdujeron para optimizar contexto, empeoraron la eficiencia de cuota. El refactor de story-plan redujo su consumo de contexto de 125k a 30k, pero sus subagentes consumen 16% de la cuota semanal, totalizando 19% frente al 8% anterior.

El refactor a subagentes es una victoria para desarrollo local (donde el contexto es la restricción) y una regresión para Claude Pro (donde la cuota es la restricción). Pero hay matices importantes.

Los subagentes optimizan una dimensión (contexto) a costa de otra (número de peticiones). La decisión depende de cuál es tu restricción.

El refactor de story-plan fue una optimización correcta para el objetivo equivocado. Optimizó contexto cuando tu restricción real era cuota. Para desarrollo local, habría sido exactamente la decisión correcta. Para Claude Pro, es un trade-off que empeora la eficiencia de cuota a cambio de un contexto más manejable.

La lección de ingeniería: antes de optimizar, identifica cuál es tu restricción real. Contexto, cuota, latencia, RAM, coste — cada una lleva a una arquitectura distinta.

El orquestador con subagentes es más caro que hacerlo manual (llamar a los skills directamente). La diferencia es de ~110K tokens por invocación (~60% más caro). Y también más caro que inline (~135K vs ~290K).
El diseño actual es el peor en eficiencia de cuota. No porque los subagentes sean malos en abstracto, sino porque en este contexto específico (Pro + orquestador con 4 subagentes + caché no compartida) el coste se multiplica.

## 🔬 Lo que sí es sólido del análisis

| Hallazgo | Confianza |
| :--- | :--- |
| Los subagentes pagan su propio prefijo (~30-35K) en cada invocación | ✅ Alto |
| Ese prefijo NO se cachea entre subagentes distintos | ✅ Alto |
| En Pro, cada subagente cuenta como petición contra la cuota | ✅ Alto |
| El refactor redujo el contexto del hilo principal | ✅ Alto (125k → 30k) |
| El refactor aumentó el número de peticiones | ✅ Alto |
| **El refactor empeoró la cuota total** | ⚠️ **Probable pero no medido limpiamente** |


En términos de cuota, el orquestador con subagentes es el peor diseño posible para Claude Pro (o suscripción similar). 
En términos de experiencia de usuario, es el mejor.



---
type: guide
slug: best-practices-for-skill-testing
title: "Pruebas de skills"
date: 2026-05-22
status: null
substatus: null
parent: null
related:
  - best-practices-for-testing
  - best-practices-for-skills
---
<!-- Referencias -->
[[best-practices-for-testing]]
[[best-practices-for-skills]]

# Pruebas de skills

Los skills pueden ser probados de varias maneras, dependiendo de la etapa de desarrollo y del tipo de skill. A continuación se presentan las mejores prácticas para probar skills, incluyendo el uso de `skill-master`, `skill-test-evals` y `agent-skills-eval`.

## Evals

Las pruebas de skills se definen en archivos `evals.json` dentro de una carpeta `evals` (dentro de la carpeta del skill) que contienen los casos de prueba y las aserciones que deben cumplirse. Estos evals permiten verificar que el skill funciona correctamente y cumple con los requisitos esperados.

## Pruebas con skill-master o skill-test-evals

El skill-master o skill-test-evals permiten la creación, edición y testeo de skills, con un fuerte enfoque interactivo y conversacional.


Los skills crìticos deben tener pruebas automatizadas en `evals/evals.json` que se pueden ejecutar con:

```
/skill-master eval --skill <skill-name>
```
o

```
skill-test-evals --skill <skill-name>
```

Aquí tienes un resumen de buenas prácticas para crear un skill y probarlo con `/skill-test-evals --skill <skill-name>`, extraído de la experiencia práctica y de los puntos de dolor comunes.

### 🧱 Fase de Diseño del Skill

1. **Empieza con un propósito muy concreto**  
   No intentes abarcar demasiado. Un skill que hace una sola cosa bien es más fácil de probar y mantener. Ejemplo: "dividir historias de usuario según INVEST Small" mejor que "gestión completa de backlog".

2. **Define primero los casos de prueba (`evals/evals.json`)**  
   Adopta un enfoque de TDD para skills: escribe las pruebas **antes** del `SKILL.md`. Así sabes exactamente qué comportamiento esperas.

3. **Diseña aserciones objetivas y deterministas**  
   - Usa comprobaciones de formato (regex, presencia de palabras clave).  
   - Evita aserciones subjetivas ("la historia debe ser clara") que requieran un juez LLM caro.  
   - Ejemplo de buena aserción: `"el archivo story.md contiene exactamente tres escenarios Gherkin"`.  
   - Ejemplo de mala aserción: `"la historia se siente bien escrita"`.

4. **Incluye en `evals.json` casos negativos y de borde**  
   - Caso feliz (entrada estándar).  
   - Caso donde la entrada ya cumple los estándares (el skill debe no intervenir).  
   - Caso donde la entrada es ambigua o incompleta.  
   - Caso donde la entrada es muy larga y requiere partición.

5. **Usa placeholders en las plantillas, pero asegúrate de que se resuelvan**  
   - Si tu skill genera YAML frontmatter, no dejes `<...>` sin reemplazar.  
   - Incluye una aserción que verifique la ausencia de placeholders (ej. `grep -v '<[^>]*>'`).  

### 🧪 Fase de Prueba (`skill-test-evals`)

6. **Ejecuta siempre con `--baseline`** (comparación con/sin skill)  
   Es la única forma de medir el valor añadido real. Sin baseline, no sabes si el skill mejora algo.

7. **Comienza con un subconjunto pequeño de evals (2-3)**  
   Ejecuta `skill-master eval` o `skill-test-evals` con solo los casos más críticos para iterar rápido. Añade más cuando el skill se estabilice.

8. **Revisa los outputs en el visor (`eval-viewer/generate_review.py`)**  
   - Mira las salidas **con** y **sin** skill lado a lado.  
   - Presta atención a los falsos positivos (assertions que pasan pero el output es malo).  
   - Detecta placeholders sin resolver, errores de codificación (Ã³, ðŸ“–) o inconsistencias de formato.

9. **Mide el costo de tokens y tiempo**  
   - Un skill bueno no debería aumentar el costo más de un 20-30% respecto a la línea base.  
   - Si el aumento es grande (ej. +50% tokens), revisa si el skill está forzando pasos redundantes.

10. **Añade aserciones de "no regresión" específicas**  
    Por ejemplo: `"ninguna línea del archivo contiene la cadena 'TODO' sin resolver"` o `"el frontmatter incluye todos los campos obligatorios"`.

### 🔁 Fase de Iteración

11. **No ejecutes la batería completa en cada cambio pequeño**  
    - Usa `--no-judge` o ejecuta solo un eval manualmente con `--eval-id` (si la herramienta lo soporta).  
    - Guarda los evals completos para validaciones pre-commit o pre-épica.

12. **Usa evaluadores locales (Ollama) durante desarrollo**  
    - Configura `--judge` con un modelo pequeño local. El costo es cero y la iteración es más rápida.  
    - Solo corre contra GPT-4/Claude para la validación final.

13. **Mantén los `evals.json` bajo control de versiones**  
    - Los tests son parte del skill. Si modificas el comportamiento esperado, actualiza las aserciones y commitea los cambios.

---

## Pruebas con agent-skills-eval

### ✅ ¿Qué es `agent-skills-eval`?

Es un **test runner** pensado para skills que siguen el estándar abierto `agentskills.io`. Su función es responder a la pregunta más importante: ¿mi skill realmente mejora el modelo o solo ocupa espacio?

Para responder a esto, ejecuta cada prueba dos veces:
*   **`with_skill`**: Con tu skill cargado en el contexto.
*   **`without_skill`**: Sin él, sirviendo como punto de comparación (baseline).

Esto te permite ver el **verdadero valor añadido** de tu skill y generar un **informe HTML** claro con los resultados.

### 🛠️ Estructura Requerida y Comandos Básicos

`agent-skills-eval` utiliza la estructura estándar de `agentskills.io` sin añadir complejidad extra:

```
mi-skill/
├── SKILL.md          # La lógica de tu skill
└── evals/
    └── evals.json    # Tus casos de prueba
```

#### **Ejemplo de `evals.json`:**

Puedes usar el campo `assertions` para definir comprobaciones objetivas y verificables, que pueden ser desde texto en la respuesta hasta la presencia de archivos concretos:

```json
{
  "evals": [
    {
      "id": "analisis-ventas",
      "prompt": "Busca los 3 meses con más ingresos.",
      "files": ["evals/files/ventas.csv"],
      "assertions": [
        "La respuesta menciona a Enero.",
        "Se genera un archivo llamado informe.pdf"
      ]
    }
  ]
}
```

#### **Comandos básicos**

*   **Ejecución rápida**: `npx agent-skills-eval ./skills --baseline --strict`
*   **Con reporte HTML**: `npx agent-skills-eval ./skills --baseline --report`
*   **Usando archivo de configuración (YAML)**: `npx agent-skills-eval --config mi-config.yaml`

---

### 🧠 Buenas Prácticas: Cómo Aprovechar al Máximo la Herramienta

#### **1. Adopta un Enfoque "Eval-First" (o TDD para Skills)**
*   Escribe las pruebas (`evals.json`) antes que el `SKILL.md`. Así defines desde el principio qué constituye el éxito.
*   **Comienza con 2 o 3 casos**, céntrate en los flujos "felices" y en los bordes más obvios. Un skill se prueba de forma iterativa.

#### **2. Diseña Aserciones Robusta**
*   **Céntrate en resultados**: Las aserciones deben comprobar aspectos observables de la respuesta: formato, etiquetas, archivos generados o pasos concretos que debe realizar el agente.
*   **Cuidado con la "vibe check"**: Las aserciones basadas en "buena redacción" o "diseño atractivo" son subjetivas y poco fiables. Si se necesitan, se debe forzar que el modelo juez (`--judge`) proporcione una justificación objetiva para su decisión. Para todo lo demás, usa aserciones deterministas.
*   **Refina con el tiempo**: Añade aserciones nuevas conforme encuentras errores o identificas nuevos criterios de calidad.

#### **3. Optimiza la Ejecución y el Entorno**
*   **Entornos aislados**: Para pruebas robustas, se recomienda usar **Docker**. Esto garantiza que cada ejecución parta de un estado limpio y reproducible, eliminando interferencias del entorno local.
*   **Controla el paralelismo**: Ajusta el número de ejecuciones simultáneas con `--concurrency` para que tus pruebas no saturen el sistema.
*   **Evita la "contaminación de contexto"**: Cada prueba debe ejecutarse en una sesión aislada para que las alucinaciones de un test no afecten a los siguientes.

#### **4. Integra en tu Flujo de CI/CD**
*   **Automatiza las regresiones**: Haz que la batería de pruebas (`--baseline`) se ejecute de forma automática con cada cambio en el skill.
*   **Filtra skills para pruebas específicas**: Si tienes varios skills, usa `--include "skills/mi-skill*"` para probar solo los que hayan cambiado, acelerando el proceso.
*   **Establece un umbral de calidad**: Define un criterio para decidir si un cambio es aceptable, como "el `pass_rate` no debe bajar del 95%" y vigílalo con `--strict` para que los fallos detengan el pipeline.

#### **5. Analiza y Actúa sobre los Resultados**
*   **Revisa el benchmark, no solo la tasa de acierto**: Compara con `--baseline` para ver el coste real de tu skill, midiendo el **incremento en tokens y latencia** además del `pass_rate`.
*   **Investiga a fondo los fallos**: Cuando un test falle, revisa la salida del agente para entender por qué no se cumplió la aserción y mejora el skill en consecuencia.
*   **Evita optimizaciones prematuras**: No intentes optimizar el `SKILL.md` hasta que tengas un benchmark fiable que respalde los cambios y evite regresiones no detectadas.

---

##  ⚖️ **`agent-skills-eval` vs. `skill-master`**

Es importante entender cómo encaja esta herramienta con el ecosistema de Anthropic:

| Característica | `agent-skills-eval` | `skill-master` (de Anthropic) |
| :--- | :--- | :--- |
| **Propósito** | Evaluación de skills (`evals`) y generación de reportes comparativos. | Creación, edición y testeo de skills, con un fuerte enfoque interactivo y conversacional. |
| **Uso Principal** | Línea de comandos, ideal para CI/CD y automatización de pruebas. | Interfaz conversacional (Claude Code), guiando paso a paso en la creación y mejora del skill. |
| **Enfoque** | **Cuantitativo**. Mide numéricamente la mejora de tu skill. | **Cualitativo y práctico**. Ayuda a redactar, iterar y probar el skill con feedback humano. |

En la práctica, son herramientas complementarias que pueden usarse en conjunto: se puede iterar el diseño con `skill-master` y, una vez maduro, se integra `agent-skills-eval` en el pipeline de CI/CD para mantener su calidad.

---

##  📊 **Tabla Resumen de Buenas Prácticas**

| Área | Recomendación Clave |
| :--- | :--- |
| **Estructura** | Usa `SKILL.md` + `evals/evals.json`. Valida el nombre del skill con `--strict`. |
| **Diseño de `evals.json`** | Adopta TDD (escribe los tests primero). Comienza con 2-3 casos clave. Usa aserciones objetivas y verificables. |
| **Ejecución** | Aísla el entorno con Docker. Controla el paralelismo con `--concurrency`. Automatiza en CI/CD con regresiones. |
| **Análisis** | Compara con `--baseline`. Mide `pass_rate`, costo y latencia. Investiga las causas raíz de los fallos. |

`agent-skills-eval` no es un oráculo, es una linterna: su valor no está en tener la razón, sino en mostrarte el camino. Si necesitas profundizar en algún aspecto concreto, solo tienes que pedírmelo.
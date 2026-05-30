---
alwaysApply: false
type: story
id: FEAT-090
slug: code-skill-builder-tdd
title: "Crear code-skill-builder for implementation with TDD Method"
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
created: 2026-05-28
updated: 2026-05-29
impl-method: TDD
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-078-design-skill-architecture
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]
[[FEAT-078-design-skill-architecture]]
[[FEAT-080-impl-skill-builder-bdd]]

# 📖 Historia: Crear code-skill-builder for implementation with TDD Method

**Como** desarrollador de skills SDDF que ya tiene un diseño aprobado (design.md + tasks.md) y quiere implementar el skill con el método de verificación adecuado a su contexto (TDD o ninguno),  
**Quiero** invocar story-implement para que coordine `test-unit-skill-builder` (escribe los evals del skill) e `code-skill-builder` (escribe el SKILL.md) en el ciclo TDD retroalimentado  
**Para** obtener un SKILL.md verificado por evals/evals.json, construido mediante el ciclo donde las pruebas se escriben antes que el contenido del skill, con story-implement como único coordinador del ciclo y cada skill haciendo una sola cosa

## ✅ Criterios de aceptación

### Escenario principal – Método TDD: story-implement coordina test-unit-skill-builder e code-skill-builder
```gherkin
Dado que existen design.md y tasks.md válidos en el directorio de la historia
  Y el entorno SDDF supera el preflight sin errores
  Y test-unit-skill-builder e code-skill-builder están declarados en sddf-config.yaml bajo implementing.skills
  Y el método de implementación está configurado como "TDD" (en sddf-config.yaml, en frontmatter de story.md o por CLI)
Cuando el usuario invoca story-implement con el ID de la historia
Entonces story-implement invoca test-unit-skill-builder (fase RED): escribe evals/evals.json a partir de design.md y story.md
  Y story-implement verifica que los evals fallan sin SKILL.md (confirma que RED es rojo)
  Y story-implement invoca code-skill-builder (fase GREEN): escribe el SKILL.md mínimo que hace pasar los evals
  Y story-implement ejecuta los evals con el SKILL.md generado
  Y si los evals fallan, story-implement retroalimenta a code-skill-builder (fase REFACTOR): mejora SKILL.md
  Y repite GREEN-REFACTOR hasta que todos los evals pasan o se alcanza el límite de iteraciones
  Y al finalizar, el directorio del skill contiene SKILL.md y evals/evals.json
  Y el informe de implementación registra el resultado de cada fase y el número de iteraciones
```

### Escenario – Método none: implementación directa sin ciclo formal
```gherkin
Dado que existen design.md y tasks.md válidos en el directorio de la historia
  Y el método de implementación está configurado como "none" o no hay ninguna configuración de método
Cuando el usuario invoca story-implement con el ID de la historia
Entonces story-implement no ejecuta ciclos RED/GREEN/REFACTOR ni extrae pressure scenarios
  Y genera el SKILL.md implementando las tareas de tasks.md directamente según design.md
  Y el informe de implementación indica que se usó el método "none" (implementación directa)
  Y advierte al usuario que sin método formal la calidad del SKILL.md no está verificada por ciclos de prueba
```

### Escenario – Precedencia de configuración de método
```gherkin
Dado que sddf-config.yaml declara implementing.method: TDD como default del proyecto
  Y la story.md del skill tiene en su frontmatter impl-method: BDD
Cuando el usuario invoca story-implement con el ID de la historia sin parámetro --method
Entonces story-implement usa el método BDD (frontmatter de story.md tiene precedencia sobre sddf-config.yaml)
  Y si el usuario pasa --method none en CLI, se usa none (CLI tiene la mayor precedencia)
  Y story-implement informa el método activo y su origen (CLI | story.md | config | default) antes de ejecutar
```

### Escenario alternativo – Config ausente o delegate no declarado (degradación gradual)
```gherkin
Dado que code-skill-builder no está declarado en sddf-config.yaml
  O sddf-config.yaml no existe en el proyecto
Cuando el usuario invoca story-implement sobre una historia de skill SDDF
Entonces story-implement emite ⚠️ indicando que no hay delegate disponible para la fase implementing
  Y continúa con el flujo estándar de implementación sin TDD especializado
  Pero no interrumpe el flujo — la historia puede implementarse manualmente o con el skill genérico
```

### Escenario alternativo – Fase RED no falla (evals pasan sin SKILL.md)
```gherkin
Dado design.md y tasks.md válidos
  Y un SKILL.md ya existe en el directorio de destino
Cuando story-implement invoca test-unit-skill-builder y los evals generados pasan sin SKILL.md
Entonces story-implement detecta que RED no es rojo — los evals pueden estar mal redactados
  Y muestra advertencia: "Los evals pasan sin SKILL.md — test-unit-skill-builder puede haber generado evals triviales; revisar manualmente"
  Y solicita confirmación al usuario antes de proceder con GREEN y REFACTOR
```

### Escenario alternativo – design.md faltante o incompleto
```gherkin
Dado un directorio de historia sin design.md o con design.md vacío
Cuando el usuario invoca story-implement
Entonces story-implement detecta la precondición no satisfecha antes de invocar ningún skill
  Y muestra el mensaje "design.md no encontrado o incompleto — ejecuta story-design primero (que genera design.md mediante design-skill-architecture)"
  Y detiene la ejecución sin invocar test-unit-skill-builder ni code-skill-builder
```

### Escenario – Atomicidad: artefactos solo se mueven al destino si el ciclo completo tiene éxito
```gherkin
Dado que story-implement coordina el ciclo TDD
Cuando se inicia el ciclo (RED o GREEN)
Entonces story-implement trabaja en un directorio temporal .tmp/code-skill-builder/<feat-id>/ durante todo el ciclo
  Y solo cuando TODOS los evals pasan mueve SKILL.md y evals/evals.json desde el temporal al directorio destino de la historia
  Y si el ciclo falla o se interrumpe en cualquier fase, limpia el directorio temporal sin escribir archivos parciales en el destino
  Y el directorio destino nunca contiene artefactos de ciclos incompletos o fallidos
```

### Escenario alternativo – code-skill-builder no converge en REFACTOR tras el límite de iteraciones
```gherkin
Dado design.md, tasks.md y evals/evals.json válidos generados por test-unit-skill-builder
Cuando story-implement retroalimenta a code-skill-builder en fase REFACTOR y los evals siguen fallando tras el límite de iteraciones
Entonces story-implement genera un informe detallado de fallo con: lista de evals que no pasaron, tipo de error por eval, número de iteraciones ejecutadas
  Y NO mueve ningún artefacto al directorio destino (atomicidad: ningún SKILL.md parcial en el destino)
  Y pregunta al usuario: "¿Deseas continuar manualmente desde el estado actual (.tmp/) o abortar?"
  Y si el usuario elige abortar: limpia .tmp/ sin dejar rastro
  Y si el usuario elige continuar: expone la ruta del directorio temporal con el último SKILL.md para edición manual
```

### Escenario – TDD con skills especializados declarados en config
```gherkin
Dado que el método está configurado como TDD
  Y sddf-config.yaml declara test-unit-skill-builder bajo implementing.skills (output: evals/evals.json)
  Y sddf-config.yaml declara code-skill-builder bajo implementing.skills (output: SKILL.md)
  Y existen design.md y tasks.md válidos en el directorio de la historia
Cuando el usuario invoca story-implement
Entonces story-implement invoca test-unit-skill-builder: genera evals/evals.json (RED)
  Y story-implement invoca code-skill-builder: genera SKILL.md (GREEN)
  Y story-implement ejecuta los evals con el SKILL.md generado
  Y retroalimenta a code-skill-builder si los evals fallan (REFACTOR)
  Y repite hasta que todos los evals pasan o se alcanza el límite de iteraciones
  Y el informe registra los skills invocados, iteraciones y estado final de los evals

### Escenario – TDD sin skills especializados declarados (fallback genérico)
```gherkin
Dado que el método está configurado como TDD
  Pero test-unit-skill-builder o code-skill-builder no están declarados en sddf-config.yaml
Cuando el usuario invoca story-implement
Entonces story-implement emite [INFO] "skills especializados no configurados — ejecutando ciclo TDD interno con comportamiento genérico"
  Y ejecuta el ciclo RED-GREEN-REFACTOR internamente sin delegar a skills especializados
  Pero no interrumpe el flujo ni genera error por skills faltantes
```

## Requerimiento: mecanismo de configuración de método de implementación

story-implement determina el método de implementación siguiendo este orden de precedencia (de mayor a menor):

1. **Parámetro CLI:** `story-implement FEAT-NNN --method TDD | none`
2. **Frontmatter de story.md:** campo `impl-method: TDD | none`
3. **sddf-config.yaml:** campo `implementing.method: TDD | none`
4. **Default:** `none` (implementación directa si no hay ninguna configuración)

**Métodos disponibles:**

| Método | Comportamiento | Requiere Gherkin |
|--------|---------------|-----------------|
| `BDD` | (implementación posterior)| Sí — degrada a TDD si no hay Gherkin |
| `TDD` | Ejecuta ciclo RED→GREEN→REFACTOR con pressure scenario genérico (basado en design.md y tasks.md) | No |
| `none` | Implementa directamente las tareas de tasks.md sin ciclo formal de verificación | No |

**Extensión de sddf-config.yaml (ver sección de dos skills complementarios para el YAML completo con los skills):**

```yaml
implementing:
  method: TDD           # default de proyecto: BDD | TDD | none
  skills:               # ver "Requerimiento: dos skills complementarios del ciclo TDD"
    - name: test-unit-skill-builder   # fase RED
      ...
    - name: code-skill-builder        # fase GREEN/REFACTOR
      ...
```

**Campo de frontmatter en story.md (override por historia):**

```yaml
impl-method: TDD        # BDD | TDD | none — sobreescribe el default del proyecto
```

## Requerimiento: dos skills complementarios del ciclo TDD

story-implement coordina el ciclo TDD invocando dos skills con responsabilidades estrictamente separadas:

| Skill | Responsabilidad | Input | Output |
|-------|----------------|-------|--------|
| `test-unit-skill-builder` | Escribe los evals del skill — conoce patrones de testing SDDF, estructura evals.json, criterios de éxito medibles | design.md + story.md | evals/evals.json |
| `code-skill-builder` | Escribe el contenido del SKILL.md — conoce el template, vocabulario del dominio, restricciones del skill | design.md + tasks.md + evals.json | SKILL.md |

**story-implement NO escribe contenido** — solo coordina la secuencia y ejecuta los evals:
- **RED:** invocar `test-unit-skill-builder` → verificar que evals fallan sin SKILL.md
- **GREEN:** invocar `code-skill-builder` → ejecutar evals → si pasan, done
- **REFACTOR:** si evals fallan → retroalimentar a `code-skill-builder` → re-ejecutar evals → repetir hasta convergencia o límite

**Extensión de sddf-config.yaml:**

```yaml
implementing:
  method: TDD
  skills:
    - name: test-unit-skill-builder
      type: delegate
      input: "story.md"
      output: "evals/evals.json"
      description: "Escribe los evals del skill — fase RED del ciclo TDD"
      required: false
    - name: code-skill-builder
      type: delegate
      input: "story.md"
      output: "SKILL.md"
      description: "Escribe el SKILL.md — fase GREEN/REFACTOR del ciclo TDD"
      required: false
```

**Fallback:** si alguno de los dos skills no está configurado, story-implement ejecuta esa fase internamente con comportamiento genérico (sin delegar).

**Ciclo retroalimentado (no cascada rígida):**
No es un pipeline secuencial fijo — story-implement ejecuta los evals al final de cada iteración y retroalimenta a `code-skill-builder` según los resultados, sin volver a invocar `test-unit-skill-builder` (los evals se escriben una vez en RED y son la fuente de verdad para todo el ciclo).

## Requerimiento: generación del pressure scenario TDD (sin Gherkin)

Cuando test-unit-skill-builder genera los evals sin Gherkin disponible (método TDD puro), infiere los pressure scenarios desde tasks.md:

1. Lee tasks.md e identifica tareas con `type: test` o con `acceptance_criteria` explícitos
2. Para cada tarea crítica, crea un eval que verifique ese criterio concreto
3. Si tasks.md no tiene suficiente información → pide al usuario un ejemplo de invocación y output esperado (siguiendo el espíritu de Superpowers: el pressure scenario debe representar el comportamiento real, no una aserción vacía)
4. Mínimo 1 pressure scenario por AC en story.md; máximo configurable en sddf-config.yaml (default: 3 por historia)

**Formato de un pressure scenario válido:** invocación real del skill bajo prueba con una entrada concreta y verificación de que el output contiene los elementos esperados (strings, estructura) — no aserción vacía ni tautología.

## Requerimiento: esquema de tasks.md (contrato con FEAT-078)

Cada tarea en tasks.md DEBE tener los siguientes campos para que story-implement pueda orquestar el ciclo correctamente:

```yaml
# Estructura esperada de cada tarea en tasks.md
- id: TASK-NNN
  description: "descripción de la tarea"
  type: test | code | setup | verify    # "test" → tarea produce prueba; "code" → produce SKILL.md
  acceptance_criteria:                   # condición verificable de que la tarea está completa
    - "el eval TC-001 pasa"
    - "SKILL.md incluye sección X"
```

story-implement usa el campo `type` para decidir qué skill invocar:
- `type: test` → delegar a test-unit-skill-builder (fase RED)
- `type: code` → delegar a code-skill-builder (fase GREEN/REFACTOR)
- `type: setup` → ejecutar sin delegación (configuración previa al ciclo)
- `type: verify` → ejecutar evals y verificar estado

Si tasks.md no tiene el campo `type`, story-implement infiere el tipo desde la descripción de cada tarea (heurística, no garantizado).

---

## Requerimiento: reglas de construcción de la fábrica de skills

La fábrica de skills debe cumplir las siguientes reglas de construcción para la fase implementing:

- **Idea de flujo:** story como input → story-implement (coordinador del ciclo TDD) → invoca `test-unit-skill-builder` (RED: escribe evals) → verifica que evals fallan → invoca `code-skill-builder` (GREEN: escribe SKILL.md) → ejecuta evals → si fallan, retroalimenta a `code-skill-builder` (REFACTOR) → repite hasta convergencia
- **Separación de roles:** story-implement coordina pero NO escribe contenido. `test-unit-skill-builder` escribe evals y solo evals. `code-skill-builder` escribe SKILL.md y solo SKILL.md.
- **Input del config:** `"story.md"` — cada skill infiere sus artefactos (design.md, tasks.md, evals.json) del mismo directorio
- **Archivo de configuración:** `docs/policies/sddf-config.yaml` declara ambos skills bajo `implementing.skills`. story-implement los lee para saber cómo coordinar el ciclo.
- **SRP de code-skill-builder:** escribe el contenido del SKILL.md — no coordina el ciclo TDD, no escribe evals, no diseña (eso es design-skill-architecture + story-design), no verifica umbrales (eso es test-skill-verify)
- **SRP de test-unit-skill-builder:** escribe evals/evals.json — concentra el conocimiento de patrones de testing de skills SDDF, estructura de evals.json y criterios de éxito medibles
- Los bucles de retroalimentación entre fases son coordinados por story-implement, no por los skills especializados
- **Skills nuevos:** `test-unit-skill-builder` (escribe evals) + `code-skill-builder` (escribe SKILL.md, narrower que en el diseño previo)
- **Skill a editar:** `.claude/skills/story-implement` (Paso 3b: coordinar ciclo TDD invocando test-unit-skill-builder e code-skill-builder en secuencia con retroalimentación)

## Requerimiento: template como fuente de la verdad (cadena de fallback)

code-skill-builder sigue esta cadena de resolución para encontrar el template de SKILL.md:

1. `assets/skill-template.md` en el directorio del skill que se está construyendo (ruta relativa al skill)
2. Búsqueda recursiva en `assets/` del directorio del proyecto (primer `skill-template.md` encontrado)
3. `.claude/skills/skill-master/assets/skill-template.md` (template canónico del framework SDDF)
4. Si ninguno se encuentra → emitir ⚠️ y usar estructura mínima por defecto:
   ```yaml
   ---
   name: {nombre-del-skill}
   description: >-
     {descripción}
   version: "1.0.0"
   ---
   # Skill: /{nombre-del-skill}
   ## Objetivo
   ## Flujo de ejecución
   ```

En cada paso, emitir `[INFO] Template resuelto: <ruta>` para facilitar diagnóstico. code-skill-builder nunca hardcodea la estructura del output — siempre lee el template en tiempo de ejecución.

## Requerimientos no funcionales

- **INSPIRACIÓN NO NEGOCIABLE:** Analizar skills de referencias siguientes y tomar lo mejor para diseñar e implementar code-skill-builder: [Superpowers writing-skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) (pressure scenarios en TDD) y [skill-master](https://github.com/bobmatnyc/claude-mpm-skills/blob/main/universal/main/skill-master/SKILL.md) para ser usado en mis skills customizados para mi workflow.

## ⚙️ Criterios no funcionales

* **Método aplicable obligatorio:** cuando el método es TDD, story-implement debe invocar test-unit-skill-builder (RED) antes de invocar code-skill-builder (GREEN); el ciclo no puede saltarse ni reordenarse; en método `none` no aplica esta restricción
* **Transparencia de método:** story-implement informa al usuario el método activo y su origen (CLI | story.md | config | default) antes de iniciar la implementación
* **Trazabilidad:** cada elemento del SKILL.md generado debe tener correspondencia con una tarea en tasks.md
* **Idempotencia:** si story-implement fue ejecutado parcialmente, detecta el estado (qué fases completaron: si evals/evals.json ya existe no reinvoca test-unit-skill-builder; si SKILL.md ya existe va directo a REFACTOR) y ofrece continuar desde donde se dejó
* **Gestión de contexto:** code-skill-builder minimiza el contexto pasado a subagentes — usa el patrón `.tmp/code-skill-builder/` para archivos intermedios entre fases
* **Rendimiento:** code-skill-builder completa el ciclo configurado (TDD: < 5 min; none: < 2 min) para un skill estándar de menos de 200 líneas; el rendimiento para BDD se define en FEAT-080
* **Retroalimentación no cascada:** story-implement ejecuta los evals al finalizar cada iteración de GREEN/REFACTOR y retroalimenta a code-skill-builder — no es un pipeline en cascada; continúa hasta que todos los evals pasan o se alcanza el límite
* **Límite de iteraciones:** story-implement declara explícitamente el límite de iteraciones del ciclo GREEN/REFACTOR (configurable en sddf-config.yaml bajo `implementing.max-iterations`, default 5) y reporta cuando se alcanza sin convergencia
* **Resultados de prueba estructurados:** story-implement recibe de cada eval un objeto estructurado `{eval_id, status: pass|fail, error_type, suite: unit|e2e, message}`; usa estos datos para decidir qué skill retroalimentar sin interpretar texto libre — la decisión de retroalimentación es determinista y auditable
* **Mensajes de salida estandarizados (CI/CD):** story-implement emite mensajes en formato parseable por CI/CD:
  ```
  [PASS] RED completado — evals fallan sin SKILL.md como se esperaba
  [PASS] GREEN completado — todos los evals pasan con el SKILL.md generado
  [FAIL] GREEN: no convergió tras {N} iteraciones — revisión manual requerida
  [INFO] Degradando de BDD a TDD — no se encontraron escenarios Gherkin
  [WARN] RED no es rojo — los evals pasan sin SKILL.md; posibles evals triviales
  ```
  Formato: `[NIVEL] Componente: mensaje — detalle`

## 📎 Notas / contexto adicional

- **Entrada obligatoria:** design.md + tasks.md en el directorio de la historia (generados por story-design mediante design-skill-architecture — FEAT-078).
- **Salida:** SKILL.md, evals/evals.json y scripts declarados en design.md.
- **Rol en la fábrica:** code-skill-builder es el delegate de la fase implementing. Es invocado por story-implement cuando lee sddf-config.yaml y encuentra code-skill-builder declarado bajo implementing.skills.
- El pressure scenario es un subagente que intenta resolver una tarea concreta con y sin el SKILL.md — inspirado en el ciclo de `Superpowers writing-skills`.
- Integración opcional con `skill-master` para evaluaciones intermedias entre fases.
- **Precondición de integración (historia pendiente):** `story-implement` debe ser modificado para: (a) leer `sddf-config.yaml` y resolver el método de implementación con la cadena de precedencia; (b) invocar `test-unit-skill-builder` y `code-skill-builder` como delegates según el método activo. Sin esta modificación, el flujo de la fábrica no se integra en el pipeline. Registrar como nueva historia (ej. FEAT-081) en el backlog de EPIC-14.
- Generado desde: EPIC-14-fabrica-de-skills | Feature: FEAT-090 — code-skill-builder

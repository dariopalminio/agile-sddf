---
alwaysApply: false
type: story
id: FEAT-091
slug: code-skill-builder-bdd
title: "Crear code-skill-builder for implementation with BDD Method"
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
created: 2026-05-28
updated: 2026-05-29
impl-method: BDD
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-078-design-skill-architecture
  - FEAT-079-impl-skill-builder-tdd
---
**FINVEST Score:** [Por evaluar]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
[[EPIC-14-fabrica-de-skills]]
[[FEAT-078-design-skill-architecture]]
[[FEAT-079-impl-skill-builder-tdd]]   <!-- dependencia: FEAT-079 debe estar implementado antes -->

# 📖 Historia: Crear code-skill-builder for implementation with BDD Method

**Como** desarrollador de skills SDDF que ya tiene code-skill-builder con TDD funcionando (FEAT-079) y quiere validar el skill contra los comportamientos descritos en la story.md,  
**Quiero** extender el ciclo TDD de story-implement para que en modo BDD todos los escenarios Gherkin actúen como pressure scenarios simultáneos en un único ciclo RED/GREEN/REFACTOR — no un subciclo por escenario  
**Para** forzar que code-skill-builder satisfaga todos los comportamientos desde el principio, evitando implementación incremental que solo cumple el primer escenario y deja los demás sin verificar

## ✅ Criterios de aceptación

### Escenario – Método BDD: story-implement coordina test-e2e-skill-builder, test-unit-skill-builder e code-skill-builder
```gherkin
Dado que existen design.md y tasks.md válidos en el directorio de la historia
  Y story.md contiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces)
  Y el entorno SDDF supera el preflight sin errores
  Y el método de implementación está configurado como "BDD"
  Y test-e2e-skill-builder, test-unit-skill-builder e code-skill-builder están declarados en sddf-config.yaml
Cuando el usuario invoca story-implement con el ID de la historia
Entonces story-implement invoca test-e2e-skill-builder (fase RED-E2E): escribe pruebas E2E/BDD usando TODOS los escenarios Gherkin como pressure scenarios simultáneos — no un subciclo por escenario
  Y story-implement invoca test-unit-skill-builder (fase RED-unit): escribe evals/evals.json (pruebas unitarias del skill)
  Y story-implement verifica que todas las pruebas (E2E y unitarias) fallan sin SKILL.md (RED completo con todos los escenarios)
  Y story-implement invoca code-skill-builder (fase GREEN): escribe el SKILL.md que debe hacer pasar TODOS los escenarios simultáneamente
  Y story-implement ejecuta TODAS las pruebas (E2E y unitarias) con el SKILL.md generado
  Y si fallan, retroalimenta a code-skill-builder (REFACTOR) con los resultados estructurados de cada suite
  Y repite GREEN-REFACTOR hasta que TODOS los escenarios pasan o se alcanza el límite de iteraciones
  Y el informe registra los tres skills, las iteraciones y el estado final de cada escenario Gherkin individualmente
```

### Escenario – BDD con sub-skills completos: delegación test-e2e-* + test-unit-* + code-*
```gherkin
Dado que el método está configurado como BDD
  Y sddf-config.yaml declara un skill bajo implementing.sub-skills.bdd.test-e2e (patrón test-e2e-*)
  Y sddf-config.yaml declara un skill bajo implementing.sub-skills.tdd.test-unit (patrón test-unit-*)
  Y sddf-config.yaml declara un skill bajo implementing.sub-skills.tdd.code (patrón code-*)
  Y story.md contiene escenarios Gherkin válidos
Cuando el usuario invoca story-implement
Entonces story-implement invoca test-e2e-skill-builder: escribe pruebas E2E/BDD desde los Gherkin de story.md
  Y story-implement invoca test-unit-skill-builder: escribe evals/evals.json
  Y story-implement verifica que todas las pruebas fallan sin SKILL.md (RED completo)
  Y story-implement invoca code-skill-builder: escribe SKILL.md (GREEN)
  Y story-implement ejecuta TODAS las pruebas (E2E y unitarias)
  Y retroalimenta a code-skill-builder según el tipo de prueba que falle (REFACTOR)
  Y repite hasta que todas las pruebas pasan o se alcanza el límite de iteraciones
  Y el informe registra los tres skills, las iteraciones y el estado final de cada suite
```

### Escenario – BDD sin test-e2e-skill-builder configurado: degrada a solo ciclo TDD
```gherkin
Dado que el método está configurado como BDD
  Pero test-e2e-skill-builder no está declarado en sddf-config.yaml
  Y test-unit-skill-builder e code-skill-builder sí están configurados
Cuando el usuario invoca story-implement
Entonces story-implement emite ⚠️ "test-e2e-skill-builder no configurado — BDD sin pruebas E2E"
  Y ejecuta el ciclo TDD retroalimentado (test-unit-skill-builder + code-skill-builder)
  Pero no interrumpe el flujo — la implementación continúa sin pruebas E2E
```

### Escenario – Filtrado de escenarios BDD por etiqueta o parámetro
```gherkin
Dado que story.md contiene múltiples escenarios Gherkin
  Y uno o más tienen la etiqueta @focus
Cuando el usuario invoca story-implement con --method BDD o con --scenario-filter @focus
Entonces story-implement procesa solo los escenarios con @focus como pressure scenarios del ciclo
  Y emite [INFO] "Filtro activo: @focus — {N} de {Total} escenarios seleccionados"
  Y ejecuta el único ciclo RED/GREEN/REFACTOR con solo esos escenarios
  Y al finalizar, avisa que los escenarios no filtrados no fueron verificados en esta ejecución
```

### Escenario – Retroalimentación basada en tipo de prueba que falla
```gherkin
Dado que story-implement recibe resultados estructurados {eval_id, status: pass|fail, error_type, suite: unit|e2e}
  Y algunas pruebas E2E fallaron y las unitarias pasaron
Cuando story-implement decide a qué skill retroalimentar en fase REFACTOR
Entonces story-implement prioriza retroalimentar a test-e2e-skill-builder si fallan pruebas E2E
  Y prioriza retroalimentar a code-skill-builder si solo fallan pruebas unitarias con E2E pasando
  Y emite [INFO] "Retroalimentando a {skill} — regla: {E2E-falla | unit-falla-con-E2E-ok}"
```

### Escenario – Método BDD seleccionado pero story.md sin Gherkin (degradación a TDD)
```gherkin
Dado que el método está configurado como "BDD"
  Pero story.md no contiene ningún bloque Gherkin válido (Dado/Cuando/Entonces)
Cuando el usuario invoca story-implement con el ID de la historia
Entonces story-implement emite ⚠️ "Método BDD configurado pero story.md no contiene Gherkin — degradando a TDD"
  Y continúa la ejecución usando el ciclo TDD estándar (pressure scenario genérico)
  Pero no interrumpe el flujo ni genera error fatal
```

## Requerimiento: formato Gherkin en story.md y validación de sintaxis

test-e2e-skill-builder extrae y valida los escenarios Gherkin **antes** de iniciar el ciclo:

**Formatos soportados:**
- Bloques de código con lenguaje `gherkin` en story.md
- Escenarios simples: `Dado / Cuando / Entonces` (o `Given / When / Then`)
- `Scenario Outline` con tabla `Ejemplos:` (genera un pressure scenario por cada fila)
- Etiquetas de filtro por escenario: `@focus`, `@skip`

**Validación de sintaxis (fail-fast antes de invocar cualquier skill):**
1. Cada bloque `gherkin` tiene al menos un `Dado`, un `Cuando` y un `Entonces`
2. Todo `Scenario Outline` tiene tabla `Ejemplos:` con al menos una fila de datos
3. Si se detecta sintaxis inválida → emitir `[FAIL] Gherkin inválido: línea {N} — {descripción del error}` y detener sin iniciar el ciclo
4. Si no hay bloques Gherkin → degradar a TDD genérico (ver AC de degradación)

**Modelo de ciclo único (no subciclos):** todos los escenarios Gherkin válidos (después del filtrado) actúan como pressure scenarios simultáneos en un único ciclo RED/GREEN/REFACTOR — code-skill-builder debe satisfacer TODOS desde la primera iteración de GREEN.

## Requerimiento: mecanismo de configuración de método de implementación

El mecanismo de configuración (precedencia CLI > frontmatter > sddf-config.yaml > default) está definido en FEAT-079. Esta historia no lo modifica — solo añade el comportamiento BDD al skill existente.

**Lo que esta historia añade al mecanismo:**
- Cuando el método resuelto es `BDD`, story-implement añade `test-e2e-skill-builder` al ciclo, antes de `test-unit-skill-builder` e `code-skill-builder`
- El flujo de coordinación BDD se añade a story-implement (Paso 3b), no a code-skill-builder
- **Degradación:** si BDD está configurado pero story.md no tiene Gherkin → story-implement degrada a TDD automáticamente (ver AC de degradación)

## Requerimiento: reglas de construcción para la extensión BDD

Esta historia **extiende** code-skill-builder (creado en FEAT-079); no crea un skill nuevo ni modifica story-implement:

- **Skill a extender:** `.claude/skills/story-implement` — añadir el flujo BDD al Paso 3b (invocar test-e2e-skill-builder además de test-unit-skill-builder e code-skill-builder)
- **Skills que NO cambian:** `test-unit-skill-builder` e `code-skill-builder` (heredados de FEAT-079 sin modificaciones)
- **Skill nuevo:** `test-e2e-skill-builder` (`type: delegate` — escribe pruebas E2E/BDD a partir de escenarios Gherkin de story.md, output: archivos de test E2E)
- **Responsabilidad única de test-e2e-skill-builder:** extrae escenarios Gherkin de story.md y escribe las pruebas E2E correspondientes — no coordina el ciclo, no escribe SKILL.md, no escribe evals unitarios
- **story-implement como coordinador BDD:** invoca los tres skills (test-e2e-skill-builder + test-unit-skill-builder + code-skill-builder), ejecuta todas las pruebas y coordina la retroalimentación
- **Ciclo retroalimentado BDD:** las tres suites de pruebas (E2E, unitarias, SKILL.md) no son un pipeline en cascada — story-implement ejecuta todas las pruebas al final de cada iteración y retroalimenta según los fallos; el ciclo termina cuando todas las pruebas pasan o se alcanza el límite
- **BDD en sddf-config.yaml:** añadir `test-e2e-skill-builder` bajo `implementing.skills`:
  ```yaml
  - name: test-e2e-skill-builder
    type: delegate
    input: "story.md"
    output: "tests/e2e/"
    description: "Escribe pruebas E2E/BDD desde Gherkin — fase RED-E2E del ciclo BDD"
    required: false
  ```

## Requerimientos no funcionales

- **INSPIRACIÓN NO NEGOCIABLE:** Analizar skills de referencias siguientes y tomar lo mejor para diseñar e implementar code-skill-builder: [Superpowers writing-skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) (pressure scenarios en TDD) y [skill-master](https://github.com/bobmatnyc/claude-mpm-skills/blob/main/universal/main/skill-master/SKILL.md) para ser usado en mis skills customizados para mi workflow.

## ⚙️ Criterios no funcionales

_Los criterios generales de método (ciclo obligatorio, transparencia, idempotencia, gestión de contexto) están definidos en FEAT-079 y aplican también al modo BDD. Esta sección añade solo los criterios específicos de BDD:_

* **Degradación de BDD a TDD:** si el método es BDD pero story.md no tiene Gherkin, code-skill-builder degrada automáticamente a TDD y emite ⚠️; nunca falla silenciosamente por falta de Gherkin
* **Trazabilidad BDD:** en modo BDD, cada elemento del SKILL.md generado debe mapear explícitamente a un escenario Gherkin de story.md (además de a la tarea en tasks.md)
* **Cobertura de escenarios:** el evals/evals.json generado debe contener al menos un caso por cada escenario Gherkin extraído de story.md; si hay N escenarios, hay N casos en evals.json
* **Rendimiento BDD:** code-skill-builder completa el ciclo BDD con hasta 3 escenarios en menos de 10 minutos para un skill estándar de menos de 200 líneas
* **Retroalimentación BDD estructurada:** story-implement recibe resultados `{eval_id, status, error_type, suite: unit|e2e}` y aplica reglas deterministas de retroalimentación — sin interpretación ad-hoc; las reglas son: (1) fallan E2E → retroalimentar test-e2e-skill-builder; (2) solo fallan unitarias con E2E OK → retroalimentar code-skill-builder
* **Ciclo único BDD:** todos los escenarios Gherkin actúan como pressure scenarios simultáneos — no hay subciclos por escenario; code-skill-builder debe satisfacerlos todos desde la primera iteración de GREEN
* **Filtrado selectivo:** el parámetro `--scenario-filter @etiqueta` permite ejecutar un subconjunto de escenarios para acelerar el ciclo durante desarrollo; al finalizar, se emite aviso de escenarios no verificados

## 📎 Notas / contexto adicional

- **Entrada obligatoria:** design.md + tasks.md en el directorio de la historia (generados por story-design mediante design-skill-architecture — FEAT-078).
- **Salida:** SKILL.md, evals/evals.json y scripts declarados en design.md.
- **Rol en la fábrica:** code-skill-builder es el delegate de la fase implementing. Es invocado por story-implement cuando lee sddf-config.yaml y encuentra code-skill-builder declarado bajo implementing.skills.
- El pressure scenario es un subagente que intenta resolver una tarea concreta con y sin el SKILL.md — inspirado en el ciclo de `Superpowers writing-skills`.
- Integración opcional con `skill-master` para evaluaciones intermedias entre fases.
- **Dependencia:** FEAT-079 (code-skill-builder-tdd) debe estar implementado y en estado DONE antes de iniciar esta historia — esta historia extiende ese skill, no crea uno nuevo.
- Generado desde: EPIC-14-fabrica-de-skills | Feature: FEAT-091 — code-skill-builder-bdd

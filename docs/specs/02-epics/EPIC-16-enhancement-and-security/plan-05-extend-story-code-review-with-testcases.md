---
alwaysApply: false
type: release
id: plan-05-extend-story-code-review-with-testcases
slug: plan-05-extend-story-code-review-with-testcases
title: "Plan 05: Extender story-code-review con análisis de testcases.md e implement-report.md opcional"
status: COMPLETED
substatus: DONE
parent: EPIC-16-enhancement-and-security
created: 2026-06-05
updated: 2026-06-05
related: [
  - EPIC-16-enhancement-and-security
]
---
[[EPIC-16-enhancement-and-security]]

## Plan: Extender story-code-review con análisis de testcases.md e implement-report.md opcional

### Contexto
El skill story-code-review fue diseñado originalmente para ejecutarse después de /story-implement-tasks. Ahora el framework también tiene /story-implement (TDD completo), que usa testcases.md como entrada canónica de casos de prueba. El quality gate debe:

Funcionar independientemente de si el developer usó /story-implement, /story-implement-tasks, o implementó manualmente (sin implement-report.md).
Analizar testcases.md cuando exista, incorporando su cobertura al veredicto del code-review-report.md.

### Cambios por archivo

1. SKILL.md — Orquestador principal
Sección ## Entrada — cambiar implement-report.md de Requerido a Opcional, agregar testcases.md como Opcional:

Artefacto	Categoría	Justificación
story.md	Requerido	Fuente de criterios de aceptación
design.md	Requerido	Fuente de arquitectura esperada
implement-report.md	Opcional	Evidencia de implementación (producida por /story-implement o /story-implement-tasks); si no existe, se omite el análisis de implementación sin bloquear la revisión
testcases.md	Opcional	Especificación canónica de casos de prueba (producida por /story-testcases); si existe, se incorpora al análisis de cobertura
tasks.md	Opcional	(sin cambios)
constitution.md	Opcional	(sin cambios)
definition-of-done-story.md	Opcional	(sin cambios)
Sección ## Precondiciones — solo requerir story.md y design.md.

Paso 1c — validar solo story.md y design.md como requeridos. Para implement-report.md y testcases.md: detectar presencia y registrar:

$IMPL_REPORT_AVAILABLE = true | false
$TESTCASES_AVAILABLE = true | false
Paso 1e — actualizar mensaje de confirmación para mostrar estado de artefactos opcionales:

🔍 Iniciando revisión de código para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos: story.md ✓ | design.md ✓ | implement-report.md ✓/⏭ | testcases.md ✓/⏭
   Estado: IMPLEMENT/DONE ✓
Paso 1d — actualizar mensaje de error para mencionar ambos skills:

story-code-review requiere que /story-implement o /story-implement-tasks haya completado exitosamente.

Paso 2c — hacer condicional: solo leer implement-report.md si $IMPL_REPORT_AVAILABLE = true. Si es false, registrar internamente $IMPL_FILES = [] y $IMPL_TASKS = [].

Nuevo Paso 2e — Leer testcases.md si $TESTCASES_AVAILABLE = true:

Extraer: tabla de casos (ID/Tipo/Escenario/Dado/Cuando/Entonces/Ref)
Extraer: resumen de cobertura (conteo por tipo UT/CT/IT/API/E2E/EV)
Extraer: sección "Test Cases Progress" (checklist [ ]/[x]/[!])
Registrar internamente como $TESTCASES_DATA
Paso 3b — pasar a cada agente además de lo actual:

$IMPL_REPORT_AVAILABLE
$TESTCASES_AVAILABLE (y cuando true, el path a testcases.md)
Paso 5b — agregar inyección de {{TESTCASES_COVERAGE_SECTION}} en el template:

Si $TESTCASES_AVAILABLE = false: ⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases.
Si $TESTCASES_AVAILABLE = true: resumir hallazgos de cobertura de testcases del product-owner-report
Paso 7 — agregar fila de testcases en la tabla del resumen final:

 Cobertura testcases.md     │ <sev/—>   │ <N> casos analizados / ⏭️ omitido
Sección ## Objetivo y description del frontmatter — actualizar para mencionar que opera después de /story-implement o /story-implement-tasks.

2. agents/product-owner-reviewer.agent.md — Guardián de Requisitos
Contexto recibido — agregar:

$TESTCASES_AVAILABLE: flag booleano
Cuando true, $STORY_DIR/testcases.md está disponible para lectura
Misión — agregar paso 5 al final de la lista:

Si $TESTCASES_AVAILABLE = true: leer $STORY_DIR/testcases.md y verificar cobertura de ACs.

Nueva sección de criterios: "Cobertura en testcases.md" (solo aplicar si $TESTCASES_AVAILABLE = true):

Cada AC-N de story.md tiene al menos un test case en testcases.md con Ref: AC-N
Los escenarios Gherkin tienen al menos un E2E/IT case en testcases.md
El "Test Cases Progress" no tiene entradas [!] (test fallido)
Si $IMPL_REPORT_AVAILABLE = false: anotar como informativo que no hay implement-report para cruzar referencias, sin penalizar severidad
Severidad para hallazgos de testcases:

HIGH: AC principal sin ningún test case referenciado en testcases.md
MEDIUM: AC cubierto solo con UT pero sin E2E/IT cuando el escenario Gherkin lo requiere
LOW: entradas [ ] pendientes en Test Cases Progress (no fallidas, solo sin completar)
Cuando $TESTCASES_AVAILABLE = false: agregar al reporte una línea informativa sin severidad:

ℹ️ testcases.md no encontrado — análisis de cobertura de test cases omitido.

3. agents/integration-reviewer.agent.md — Inspector de Integración
Contexto recibido — agregar $TESTCASES_AVAILABLE.

Misión — agregar paso condicional: si $TESTCASES_AVAILABLE = true, leer testcases.md y verificar trazabilidad de referencias de diseño.

Nueva sección de criterios: "Trazabilidad de diseño en testcases.md" (solo si $TESTCASES_AVAILABLE = true):

Cada test case con Ref: D-N en la columna Ref apunta a una decisión D-N que existe en design.md
No hay referencias D-N huérfanas (apuntan a decisiones inexistentes)
Severidad:

MEDIUM: test case referencia un D-N que no existe en design.md
LOW: columna Ref vacía en test cases de tipo IT/API (donde se espera referencia a diseño)
Manejo de implement-report.md ausente: agregar nota explícita en la misión:

Si $IMPL_REPORT_AVAILABLE = false, leer igualmente design.md y los archivos de código fuente para verificar conformidad estructural (sin cruzar con tareas del implement-report).

4. assets/code-review-report-template.md — Template de salida
Agregar nueva sección entre "Integración y Arquitectura" y "Decisión final":
```
### Cobertura de Casos de Prueba (testcases.md)

{{TESTCASES_COVERAGE_SECTION}}

---
```

Agregar fila en la tabla de Resumen:
```
| testcases.md | {{TESTCASES_STATUS}} |
```
Donde {{TESTCASES_STATUS}} será ✓ analizado (<N> casos) o ⏭️ no encontrado.

###  Archivos a modificar (en orden)

.claude/skills/story-code-review/assets/code-review-report-template.md — agregar sección y fila de resumen
.claude/skills/story-code-review/agents/product-owner-reviewer.agent.md — agregar análisis de testcases
.claude/skills/story-code-review/agents/integration-reviewer.agent.md — agregar trazabilidad de diseño en testcases + manejo de implement-report opcional
.claude/skills/story-code-review/SKILL.md — cambios principales: inputs, precondiciones, pasos 1c/1d/1e/2c/2e/3b/5b/7

###  Verificación

Ejecutar /story-code-review STORY-NNN sobre una historia que tiene testcases.md e implement-report.md → el reporte debe incluir la sección "Cobertura de Casos de Prueba" con hallazgos reales.
Ejecutar /story-code-review STORY-NNN sobre una historia que no tiene implement-report.md → el skill no debe fallar; el reporte debe mostrar ⏭️ implement-report.md no encontrado.
Ejecutar /story-code-review STORY-NNN sobre una historia que no tiene testcases.md → el skill no debe fallar; la sección testcases del reporte muestra el mensaje informativo.
Verificar que el mensaje de error de precondición de estado ya no menciona solo /story-implement-tasks.
Revisar que el ejemplo example-approved sigue siendo válido como referencia (no necesita modificarse ya que testcases.md es opcional).


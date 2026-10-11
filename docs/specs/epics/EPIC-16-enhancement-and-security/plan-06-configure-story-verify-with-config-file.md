---
alwaysApply: false
type: plan
id: plan-06-configure-story-verify-with-config-file
slug: plan-06-configure-story-verify-with-config-file
title: "Plan 06: Configurar story-verify con sddf.config.yaml"
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

## Plan: Configurar story-verify según sddf.config.yaml

### Context

El skill story-verify actualmente detecta qué pruebas ejecutar inspeccionando archivos del proyecto (pytest.ini, jest.config., playwright.config., etc.). No lee sddf.config.yaml.

El objetivo es que el skill primero lea sddf.config.yaml para obtener:

El defaults.delivery-model (batch | continuous)
Los comandos de prueba configurados en la sección verify
Si la config existe y tiene tests required: true, usarla como fuente de verdad (modo config-driven). Solo si no existe o no hay tests requeridos, caer al comportamiento actual de detección por archivos.

### Archivo a modificar

.claude/skills/story-verify/SKILL.md (469 líneas)

### Cambios planificados

1. Sección ## Entrada (línea ~39-45)
Agregar entrada opcional:
```
- `$SDDF_ROOT/sddf.config.yaml` — configuración de pruebas del proyecto (opcional; si existe y contiene tests `required: true`, tiene prioridad sobre la detección automática)
```
2. Sección ## Modos de ejecución (tabla, línea ~64-69)
Agregar nueva fila con prioridad 0 (máxima):
```
Modo	Condición de activación	Prioridad
config-driven	sddf.config.yaml existe con al menos un test required: true	0 (máxima)
delegado	...	1
automatico-e2e	...	2
automatico-unit	...	3
manual	...	4
```

3. Insertar nuevo ### Paso 4 — Leer configuración de pruebas (sddf.config.yaml) (antes del actual Paso 4)
Lógica:
```
Buscar $SDDF_ROOT/sddf.config.yaml

SI no existe:
  $CONFIG_VERIFY_FOUND = false
  → continuar al Paso 5 (detección por archivos)

SI existe:
  1. Leer defaults.delivery-model → $DELIVERY_MODEL (default: batch)
  2. Leer sección verify → construir $TEST_EXECUTION_LIST con todos los tipos donde required: true
  3. Aplicar regla de delivery-model:
     - batch:      si verify.e2e-regression existe y required: true → asegurar que está en $TEST_EXECUTION_LIST
     - continuous: si verify.e2e-sanity    existe y required: true → asegurar que está en $TEST_EXECUTION_LIST
  4. Si $TEST_EXECUTION_LIST está vacío:
       ⚠️ Advertencia → $CONFIG_VERIFY_FOUND = false → continuar al Paso 5
  5. Si tiene items:
       $CONFIG_VERIFY_FOUND = true, $MODO = config-driven
       Mostrar: "📄 sddf.config.yaml encontrado — Delivery model: {…} | Pruebas a ejecutar: {lista}"
```

4. Renombrar y condicionar el actual Paso 4 → Paso 5
Agregar al inicio:
```
Solo ejecutar si $CONFIG_VERIFY_FOUND = false — sddf.config.yaml no encontrado o sin pruebas requeridas.
```
El contenido de detección (delegado → e2e → unit → manual) permanece sin cambios.

5. Renombrar el actual Paso 5 → Paso 6 y agregar modo config-driven
Insertar al inicio del paso (antes de "#### Modo: automatico-unit"):
```
#### Modo: config-driven

Ejecutar cada test en $TEST_EXECUTION_LIST en el orden en que aparece en la sección verify:
- Si tiene command: ejecutar directamente
- Si tiene command_template con {{test_file_path}}: deducir la ruta del archivo de test relacionado con la historia

Recopilar resultados acumulados:
- $TOTAL_TESTS, $PASSED, $FAILED, $SKIPPED — suma de todas las ejecuciones
- $COVERAGE — si algún runner lo reporta
- $TEST_OUTPUT — salida completa concatenada

Si un comando retorna código de error != 0, registrar ese tipo como fallido pero continuar con los restantes.
```

6. Renombrar Paso 6 → Paso 7, Paso 7 → Paso 8
Los pasos de generación de reporte y transición de estado no cambian, solo se renumeran.

### Lógica de delivery-model en detalle

delivery-model: batch
  → Asegurar que e2e-regression se ejecuta (si verify.e2e-regression.required == true)
  → Esto garantiza pruebas de regresión completas antes de un release batch

delivery-model: continuous
  → Asegurar que e2e-sanity se ejecuta (si verify.e2e-sanity.required == true)
  → Esto garantiza un sanity check rápido en cada entrega continua
La condición required: true en el config actúa como guard: el delivery-model no fuerza la ejecución si la config del proyecto no la marca como requerida.

### Verificación

Caso config-driven (sddf.config.yaml con required: true):

Ejecutar /story-verify <ID> en un proyecto con sddf.config.yaml
Verificar que el skill muestra "📄 sddf.config.yaml encontrado" y lista los tipos de prueba
Verificar que ejecuta los comandos de la sección verify (no deducidos por heurística)
Verificar que e2e-regression aparece si delivery-model=batch y required=true
Caso fallback (sin sddf.config.yaml):

Verificar que el comportamiento es idéntico al actual (detección por archivos)
Caso config vacía (ningún required: true):

Verificar advertencia y caída al modo de detección automática


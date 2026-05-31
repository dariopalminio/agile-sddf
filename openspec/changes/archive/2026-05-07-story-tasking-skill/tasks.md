## 1. Scaffolding con skill-master

- [x] 1.1 Invocar `/skill-master` para crear la estructura base del skill `story-tasking` en `.claude/skills/story-tasking/`
- [x] 1.2 Verificar que se generaron: `SKILL.md`, `assets/`, `examples/input/`, `examples/output/`

## 2. SKILL.md — Frontmatter y configuración

- [x] 2.1 Escribir frontmatter YAML con `name: story-tasking`, `description` con triggers de activación y `alwaysApply: false`
- [x] 2.2 Documentar el posicionamiento del skill en el trío `story.md → design.md → tasks.md`
- [x] 2.3 Documentar los modos de ejecución: manual (interactivo) y agent (silencioso)

## 3. SKILL.md — Paso 0: Preflight

- [x] 3.1 Escribir Paso 0 que invoca `skill-preflight` y detiene la ejecución si el entorno es inválido
- [x] 3.2 Documentar que `SPECS_BASE` se obtiene del resultado del preflight

## 4. SKILL.md — Paso 1: Resolución de parámetros

- [x] 4.1 Escribir resolución de `{story_id}` mediante glob `$SPECS_BASE/specs/stories/{story_id}-*/`
- [x] 4.2 Escribir verificación de `story.md` (fail-fast si no existe)
- [x] 4.3 Escribir verificación de `design.md` con mensaje de error y sugerencia de `/story-design` (AC-2)
- [x] 4.4 Escribir verificación de `tasks-template.md` con error explícito y sin fallback (AC-3)
- [x] 4.5 Escribir manejo de `tasks.md` existente: preguntar sobrescribir / saltar (idempotencia)

## 5. SKILL.md — Pasos 2–4: Lectura de fuentes

- [x] 5.1 Escribir Paso 2: lectura de `story.md` y extracción de ACs numerados (AC-1…AC-N)
- [x] 5.2 Escribir Paso 3: lectura de `design.md` y extracción de componentes, interfaces y decisiones
- [x] 5.3 Escribir Paso 4: lectura dinámica de `tasks-template.md` (secciones y estructura)

## 6. SKILL.md — Paso 5: Derivación de tareas

- [x] 6.1 Escribir lógica de derivación de tareas desde ACs (story) + componentes (design)
- [x] 6.2 Escribir asignación de IDs secuenciales `T001`, `T002`... por orden de ejecución
- [x] 6.3 Escribir criterio de ordenamiento por dependencias: setup → base → dependientes → tests → docs
- [x] 6.4 Escribir criterio para marcador `[P]`: tareas sin dependencias entre sí en el mismo grupo

## 7. SKILL.md — Pasos 6–8: Completar y guardar

- [x] 7.1 Escribir Paso 6: completar template con tareas derivadas, agrupadas bajo `##` numerados
- [x] 7.2 Escribir Paso 7: guardar `tasks.md` en el directorio de la historia
- [x] 7.3 Escribir Paso 8 (modo manual): mostrar resumen con conteo de tareas y pedir confirmación

## 8. Artefactos de soporte

- [x] 8.1 Crear `assets/README.md` con referencia a `docs/specs/templates/tasks-template.md`
- [x] 8.2 Crear `examples/input/story.md` con historia de ejemplo que incluya 3+ ACs
- [x] 8.3 Crear `examples/input/design.md` con diseño de ejemplo con componentes e interfaces
- [x] 8.4 Crear `examples/output/tasks.md` mostrando: tareas `T001`…`T006`, marcadores `[P]`, agrupamiento `##`

## 9. Verificación

- [x] 9.1 Ejecutar `/story-tasking FEAT-058` y verificar que genera `tasks.md` en `docs/specs/stories/FEAT-058-skill-para-tasking/`
- [x] 9.2 Verificar que el `tasks.md` generado tiene IDs `T001`..., checkboxes `- [ ]` y marcadores `[P]` donde aplica
- [x] 9.3 Verificar comportamiento fail-fast: eliminar `design.md` y ejecutar; confirmar que el error sugiere `/story-design`
- [x] 9.4 Verificar comportamiento fail-fast: eliminar `tasks-template.md` y ejecutar; confirmar que el error menciona la ruta faltante y no genera ningún archivo

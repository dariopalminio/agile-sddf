## 1. Preparación con skill-master

- [x] 1.1 Ejecutar el skill `skill-master` para scaffoldear el directorio `.claude/skills/project-policies-generation/` con la estructura estándar (SKILL.md, assets/, examples/)
- [x] 1.2 Verificar que la estructura generada cumple los Skill Structural Patterns de `docs/knowledge/guides/skill-structural-pattern.md`

## 2. Templates de políticas

- [x] 2.1 Crear el template `docs/specs/templates/project-constitution-template.md` con frontmatter y secciones: stack tecnológico, convenciones de código, estándares de documentación, metodologías, principios técnicos inamovibles
- [x] 2.2 Crear el template `docs/specs/templates/definition-of-done-story-template.md` con frontmatter y secciones: criterios de aceptación generales, criterios de código, criterios de tests, criterios de documentación, criterios de despliegue

## 3. Implementación del skill (SKILL.md)

- [x] 3.1 Redactar el Paso 0 del skill: invocación de `skill-preflight` y resolución de `SPECS_BASE`
- [x] 3.2 Redactar la Fase 1: verificar existencia de `$SPECS_BASE/policies/` y crearlo si no existe
- [x] 3.3 Redactar la Fase 2: leer template `project-constitution-template.md` y generar `$SPECS_BASE/policies/constitution.md` (modo crear vs. modo editar con confirmación)
- [x] 3.4 Redactar la Fase 3: leer template `definition-of-done-story-template.md` y generar `$SPECS_BASE/policies/definition-of-done-story.md` (modo crear vs. modo editar con confirmación)
- [x] 3.5 Redactar la Fase 4: detectar `CLAUDE.md` / `AGENTS.md` y agregar referencias `@` si no están presentes, con manejo del caso de formato no estándar
- [x] 3.6 Redactar la Fase 5: mostrar resumen de archivos generados/modificados y siguiente paso sugerido

## 4. Ejemplos

- [x] 4.1 Crear `examples/example-output-constitution.md` con un ejemplo realista de `constitution.md` generado
- [x] 4.2 Crear `examples/example-output-dod.md` con un ejemplo realista de `definition-of-done-story.md` generado

## 5. Validación

- [x] 5.1 Ejecutar el skill en un directorio de prueba limpio (sin archivos de políticas existentes) y verificar que genera ambos archivos correctamente
- [x] 5.2 Ejecutar el skill en un directorio donde los archivos de políticas ya existen y verificar que pregunta antes de sobreescribir
- [x] 5.3 Verificar que CLAUDE.md recibe las referencias `@` correctas sin sobreescribir el contenido existente
- [x] 5.4 Verificar que el skill detecta y reporta correctamente el error cuando el template no existe

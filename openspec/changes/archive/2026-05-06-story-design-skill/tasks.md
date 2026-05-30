## 1. Template de diseño

- [x] 1.1 Crear el archivo `docs/specs/templates/story-design-template.md` con las secciones: frontmatter, Contexto, Alternativas técnicas, Decisión, Plan de implementación, Criterios de verificación y Notas
- [x] 1.2 Verificar que el template incluye un frontmatter YAML con campos `type`, `id`, `slug`, `created`, `updated`
- [x] 1.3 Agregar instrucciones de uso como comentarios HTML dentro del template

## 2. Estructura del skill

- [x] 2.1 Crear el directorio `.claude/skills/story-design/` con subdirectorios `assets/`, `examples/`
- [x] 2.2 Crear `SKILL.md` con frontmatter YAML estandarizado (name, description, triggers, outputs)
- [x] 2.3 Copiar o referenciar el template `story-design-template.md` en `assets/`

## 3. Implementación del skill (SKILL.md)

- [x] 3.1 Escribir el **Paso 0**: invocación de `skill-preflight` y detención si el entorno es inválido
- [x] 3.2 Escribir el **Paso 1**: validación de inputs — verificar que el directorio de la historia existe y contiene `story.md`; verificar que `story-design-template.md` existe; emitir errores descriptivos si alguno falta
- [x] 3.3 Escribir el **Paso 2**: lectura de contexto — leer `story.md` (criterios de aceptación, requerimientos no funcionales) y `$SPECS_BASE/policies/constitution.md` (restricciones técnicas); emitir advertencia si `constitution.md` no existe
- [x] 3.4 Escribir el **Paso 3**: generación de `design.md` — usar el template como fuente de verdad estructural, completar las secciones con el contenido inferido del contexto leído, incluir al menos dos alternativas técnicas documentadas
- [x] 3.5 Verificar que el frontmatter de `design.md` generado referencia el ID de la historia origen

## 4. Ejemplos

- [x] 4.1 Crear `examples/input/` con un `story.md` de ejemplo (puede reutilizar FEAT-057 o similar)
- [x] 4.2 Crear `examples/output/design.md` con el output esperado para el ejemplo de input
- [x] 4.3 Asegurarse de que el ejemplo cubre el escenario principal de generación exitosa

## 5. Validación con skill-master

- [x] 5.1 Invocar `/skill-master` sobre el skill `story-design` para revisar estructura, frontmatter y ejemplos
- [x] 5.2 Corregir cualquier observación del `skill-master` (documentación, casos edge, triggering)
- [x] 5.3 Confirmar que el skill aparece correctamente en el listado de skills disponibles

## 6. Registro en openspec

- [ ] 6.1 Ejecutar `/opsx:archive` para archivar este change una vez que los pasos anteriores estén completos

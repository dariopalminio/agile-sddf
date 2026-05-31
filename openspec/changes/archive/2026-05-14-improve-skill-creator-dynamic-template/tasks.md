## 1. Actualizar skill-template.md

- [x] 1.1 Añadir bloque frontmatter YAML al inicio de `assets/skill-template.md` con los campos `name`, `description` y `triggers` como placeholders
- [x] 1.2 Revisar y completar las secciones del cuerpo de `assets/skill-template.md` para alinearlas con las convenciones SDDF: Objetivo, Entrada, Parámetros, Dependencias, Modos de ejecución, Restricciones/Reglas, Flujo de ejecución (pasos numerados 0–N), Salida
- [x] 1.3 Verificar que el template actualizado tiene menos de 60 líneas para no incrementar el contexto de forma significativa

## 2. Modificar SKILL.md del skill-master — sección "Write the SKILL.md"

- [x] 2.1 Localizar la sección "Write the SKILL.md" en `.claude/skills/skill-master/SKILL.md`
- [x] 2.2 Insertar al inicio de la sección la instrucción de lectura dinámica: el modelo DEBE leer `assets/skill-template.md` usando ruta relativa antes de escribir el SKILL.md de un skill nuevo
- [x] 2.3 Documentar el fallback chain para la ruta del template (relativa al directorio del skill → búsqueda contextual → estructura mínima desde prose)
- [x] 2.4 Eliminar o subordinar la lista hardcodeada de componentes (`name`, `description`, `compatibility`) — deben derivarse del template, no estar fijados en el prose
- [x] 2.5 Actualizar la sección "Templates & Multi-Client Design" si necesita referenciar explícitamente `assets/skill-template.md` como ejemplo del patrón aplicado al propio skill-master

## 3. Verificación

- [x] 3.1 Confirmar que ninguna ruta absoluta ni prefijo de cliente aparece en la instrucción de lectura del template en SKILL.md
- [x] 3.2 Verificar que el template actualizado puede leerse e interpretarse como contrato estructural completo (frontmatter + cuerpo)
- [x] 3.3 Realizar una prueba manual: invocar skill-master para crear un skill de prueba y comprobar que el SKILL.md generado refleja la estructura de `assets/skill-template.md`

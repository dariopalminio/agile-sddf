# Plantilla de Tasks con Fases TDD para Skills

## Uso

Esta plantilla DEBE usarse al crear el plan de tareas para cualquier historia que implemente un skill.
Las fases TDD están anotadas explícitamente para que el desarrollador y la IA sepan en qué fase del ciclo están.

---

## Plantilla

```markdown
# Tasks: <Nombre del skill>

## 1. Setup [Pre-RED]
- [ ] 1.1 Crear estructura de carpetas del skill (`skill-name/`, `evals/`, `references/` o `assets/`, `examples/`)
- [ ] 1.2 Crear `examples/input/` con el archivo de prueba del pressure scenario
- [ ] 1.3 Verificar que el entorno del proyecto está operativo

## 2. Evals [RED Phase — definir ANTES del SKILL.md]
- [ ] 2.1 Escribir `evals/evals.json` con pressure scenario happy-path
- [ ] 2.2 Agregar caso fail-fast (entrada inválida conocida)
- [ ] 2.3 Agregar caso error-handling (archivo ausente / ruta inválida)
- [ ] 2.4 Ejecutar pressure scenario SIN el skill — verificar que el output falla el criterio de éxito

## 3. SKILL.md Mínimo [GREEN Phase]
- [ ] 3.1 Escribir frontmatter YAML mínimo (name, description, version, type)
- [ ] 3.2 Escribir el flujo mínimo de ejecución que pasa el pressure scenario
- [ ] 3.3 Ejecutar el pressure scenario CON el skill — verificar que pasa
- [ ] 3.4 Confirmar que todos los evals de la sección 2 pasan

## 4. References o Assets [GREEN Phase]
- [ ] 4.1 Crear archivos en `references/` (si type: reference) o templates en `assets/` (si type: delegate)
- [ ] 4.2 Verificar que el orquestador carga y usa las referencias correctamente
- [ ] 4.3 Agregar ejemplos de output en `examples/output/`

## 5. REFACTOR
- [ ] 5.1 Mejorar redacción de SKILL.md (claridad, completitud, vocabulario prescriptivo)
- [ ] 5.2 Agregar casos edge al eval y hacerlos pasar
- [ ] 5.3 Mejorar referencias/assets con más ejemplos concretos del proyecto
- [ ] 5.4 Verificar que todos los evals de secciones 2 y 5.2 siguen pasando

## 6. Integración [Post-REFACTOR]
- [ ] 6.1 Registrar el skill en el archivo de configuración del proyecto (si aplica)
- [ ] 6.2 Verificar que el sistema orquestador detecta y usa el skill correctamente
- [ ] 6.3 Ejecutar el escenario de verificación completo (con skill vs. sin skill)
- [ ] 6.4 Actualizar documentación del proyecto
```

---

## Notas de uso

- **El orden 2 → 3 es obligatorio:** los evals DEBEN existir antes que el SKILL.md
- **La sección 4 es paralela a la 3:** puedes crear referencias/assets mientras el SKILL.md básico ya pasa los evals
- **La sección 5 es iterativa:** agrega evals → falla → mejora SKILL.md → pasa → repite
- **La sección 6 ocurre una sola vez:** la integración al sistema es el paso final, no intermedio
- Las tareas marcadas `[x]` DEBEN reflejar el estado real — no marcar como completadas sin ejecutar

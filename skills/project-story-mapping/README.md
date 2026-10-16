# project-story-mapping

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-story-mapping/SKILL.md`  
> **Status:** stable

## Qué hace

Conduce una sesión de User Story Mapping con su rol local `story-mapper`, que conduce la propia sesión del skill. Toma contexto de `product/` y `requirements/`, valida un staging y materializa el resultado solo tras esa validación.

**Produces:**

- `$SPECS_BASE/product/story-map.md`.
- Personas, backbone, walking skeleton y release slices.

No reemplaza la planificación formal ni crea tareas de implementación.

## Uso

Ejecuta `/project-story-mapping` para organizar requisitos en incrementos entregables o definir el MVP. Si ya existe el story map, el skill pide elegir `Sobrescribir` o `Cancelar` antes de la sesión.

## Instalación

```bash
npx agile-sddf install --target claude-code
```

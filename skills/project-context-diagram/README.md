# project-context-diagram

> **Type:** skill · **Category:** worker  
> **Location:** `skills/project-context-diagram/SKILL.md`  
> **Status:** stable

## Qué hace

Genera un diagrama de contexto C4 de Nivel 1 en PlantUML para el producto. Puede entrevistar al usuario o inferir actores, sistemas y relaciones desde las capas de producto y requisitos.

**Produces:**

- `docs/architecture/c4/context-diagram.puml`.
- Un preview en modo manual y confirmación de sobrescritura en todos los modos.

No genera diagramas de componentes ni modifica `context-diagram.png`.

## Uso

Usa `/project-context-diagram` para una entrevista o `/project-context-diagram --from-files` para inferirlo desde archivos.

## Instalación

```bash
npx agile-sddf install --target claude-code
```

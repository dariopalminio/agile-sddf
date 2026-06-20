# Assets — story-tasking

El template canónico para este skill se ubica en la ruta estándar de templates del proyecto:

```
$SPECS_BASE/specs/templates/tasks-template.md
```

El skill lo lee dinámicamente en runtime. No se duplica aquí para evitar sincronización manual.

> **Nota:** A diferencia de `story-design`, este skill no tiene template de fallback embebido.
> Si `tasks-template.md` no existe, el skill falla explícitamente con un mensaje de error accionable.

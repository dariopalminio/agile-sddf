# project-begin

> **Tipo:** skill · **Categoría:** orquestador
> **Ubicación:** `skills/project-begin/SKILL.md`
> **Estado:** estable

## Qué hace

Orquesta la captura o actualización de la visión del producto con el agente `project-pm`. Usa el template de visión vigente y deja el punto de partida listo para discovery.

Produce `$SPECS_BASE/product/vision.md`, que queda con `substatus: DONE` únicamente después de la confirmación del desarrollador.

No realiza discovery de requisitos ni genera el backlog del proyecto.

## Cuándo usarlo

Úsalo para iniciar un proyecto SDDF, capturar su visión de producto o retomar una visión incompleta. Si la visión ya está completa, permite actualizarla o cancelar sin modificarla.

No lo uses para discovery de requisitos: usa `[[project-discovery]]`. Para el ciclo completo de especificación, usa `[[project-flow]]`.

## Instalación e invocación

```bash
npx agile-sddf install --target claude-code
```

Usa `/project-begin` desde la raíz del proyecto destino.

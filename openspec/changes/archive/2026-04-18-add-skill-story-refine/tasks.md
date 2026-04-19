## 1. Crear estructura base del skill y agente

- [x] 1.1 Crear directorio `.claude/skills/story-refine/`
- [x] 1.2 Crear archivo `.claude/agents/story-product-owner.agent.md` con rol de Product Owner (PM + BA) enfocado en indagacion y refinamiento de historias
- [x] 1.3 Definir formato de registro de historias activas/derivadas para uso del orquestador durante la sesion

## 2. Implementar orquestador story-refine

- [x] 2.1 Crear `.claude/skills/story-refine/SKILL.md` con frontmatter valido (`name: story-refine`, `description`, `alwaysApply: false`)
- [x] 2.2 Implementar flujo secuencial interactivo `story-creation` -> `story-evaluation` -> `story-split` sin modificar los skills existentes
- [x] 2.3 Implementar cola de historias pendientes para procesar historia inicial y todas las historias derivadas por split
- [x] 2.4 Implementar resumen recurrente de backlog de historias (total, identificadores, estado Doing/Ready)

## 3. Implementar reglas de estado y refinamiento iterativo

- [x] 3.1 Asegurar que cada historia se cree/actualice con `**Estado**: Doing` mientras no haya cierre
- [x] 3.2 Implementar cierre automatico a `**Estado**: Ready` cuando FINVEST decision sea `APROBADA`
- [x] 3.3 Implementar gate para decisiones `REFINAR`/`RECHAZAR`: preguntar si continuar iterando o pausar
- [x] 3.4 Si el usuario pausa, permitir finalizar dejando la historia en `Doing` para retoma posterior
- [x] 3.5 Integrar al agente `story-product-owner` para hacer preguntas adicionales, analizar historia y proponer mejoras antes de cada reevaluacion

## 4. Replicar en mirrors y alinear convenciones

- [x] 4.1 Crear `.github/skills/story-refine/SKILL.md` con el mismo contenido del skill principal
- [x] 4.2 Crear `.agents/skills/story-refine/SKILL.md` con el mismo contenido del skill principal
- [x] 4.3 Verificar que la secuencia y reglas de estado en los mirrors coincide con `.claude/skills/story-refine/SKILL.md`

## 5. Verificacion de flujo completo

- [x] 5.1 Probar caso base sin split: una historia llega a `APROBADA` y queda en `Ready`
- [x] 5.2 Probar caso con split: registrar historias derivadas y completar ciclo para todas
- [x] 5.3 Probar caso no aprobado (`REFINAR`/`RECHAZAR`) con decision de pausar y confirmar que queda en `Doing`
- [x] 5.4 Verificar que `story-creation`, `story-evaluation` y `story-split` no tuvieron cambios

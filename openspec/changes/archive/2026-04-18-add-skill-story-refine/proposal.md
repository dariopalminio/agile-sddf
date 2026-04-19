## Why

Hoy el flujo de refinamiento de historias requiere ejecutar tres skills por separado (`story-creation`, `story-evaluation`, `story-split`) y coordinar manualmente iteraciones, estados y stories derivadas. Esto genera friccion operativa, riesgo de perder contexto entre pasos y falta de trazabilidad clara cuando una historia se divide en varias.

## What Changes

- Agregar un nuevo skill orquestador `story-refine` en `.claude/skills/story-refine/SKILL.md`.
- Ejecutar el flujo interactivo en secuencia: `story-creation` -> `story-evaluation` -> `story-split`.
- Mantener intactos los skills existentes; `story-refine` solo orquesta su uso.
- Gestionar estado por historia en cada archivo markdown con encabezado `**Estado**: Doing | Ready`.
- Marcar una historia como `Ready` cuando la evaluacion FINVEST resulte `APROBADA`.
- Cuando FINVEST resulte `REFINAR` o `RECHAZAR`, continuar ciclo de refinamiento con opcion explicita de seguir iterando o pausar en `Doing`.
- Mantener registro de cantidad e identificacion de historias derivadas tras `story-split`, y continuar refinamiento para todas.
- Incorporar un nuevo agente `story-product-owner` en `.claude/agents/story-product-owner.agent.md` para indagacion, analisis, redaccion y propuestas de mejora durante todo el ciclo.

## Capabilities

### New Capabilities
- `story-refine-skill`: Orquestacion integral e interactiva del flujo de creacion, evaluacion, division y refinamiento de historias con control de estado y seguimiento de historias derivadas.

### Modified Capabilities
- None.

## Impact

- Nuevos archivos esperados:
  - `.claude/skills/story-refine/SKILL.md`
  - `.github/skills/story-refine/SKILL.md` (mirror)
  - `.agents/skills/story-refine/SKILL.md` (mirror)
  - `.claude/agents/story-product-owner.agent.md`
- Nuevo spec principal: `openspec/specs/story-refine-skill/spec.md`.
- No hay breaking changes ni cambios requeridos en `story-creation`, `story-evaluation`, `story-split`.

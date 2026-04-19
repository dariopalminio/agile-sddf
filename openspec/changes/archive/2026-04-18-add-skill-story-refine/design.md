## Context

El repositorio ya dispone de tres skills especializados para trabajar historias de usuario de forma separada: `story-creation`, `story-evaluation` y `story-split`. El nuevo `story-refine` debe actuar como orquestador interactivo sin modificar esos skills, manteniendo la experiencia conversacional y agregando control explicito del estado de cada historia (`Doing`/`Ready`) durante ciclos iterativos.

El principal reto tecnico es gestionar un backlog dinamico de historias en refinamiento: una historia inicial puede dividirse en varias historias hijas y todas deben continuar el ciclo de evaluacion/refinamiento hasta quedar en estado final.

## Goals / Non-Goals

**Goals:**
- Definir un orquestador `story-refine` que ejecute secuencialmente `story-creation` -> `story-evaluation` -> `story-split`.
- Introducir una maquina de estados simple por historia: `Doing` mientras se refina, `Ready` cuando se aprueba o cuando el usuario decide cerrar manualmente.
- Mantener trazabilidad de historias derivadas (conteo, identificadores, relacion padre/hija) para no perder ninguna en el proceso.
- Incorporar un agente `story-product-owner` como soporte para indagacion, analisis del problema, propuestas de mejora y enriquecimiento de redaccion.
- Prevenir ciclos infinitos con un gate de decision del usuario en cada iteracion no aprobada.
- Asegurar que el directoria de salida de archivos es `docs\specs\stories` y no se introduce ninguna nueva dependencia externa.
**Non-Goals:**
- Cambiar logica interna o contratos de salida de `story-creation`, `story-evaluation` o `story-split`.
- Implementar persistencia en base de datos u otro storage fuera de los archivos markdown del flujo actual.
- Introducir un nuevo framework de scoring distinto a FINVEST.

## Decisions

1. Orquestacion por cola de trabajo de historias
- Decision: `story-refine` mantendra una cola/lista de historias pendientes de refinamiento, procesando una por vez hasta vaciar la cola.
- Rationale: simplifica control de WIP y evita perder historias derivadas por `story-split`.
- Alternative considered: procesar historias en paralelo. Se descarta por mayor complejidad conversacional y menor trazabilidad.

2. Estado explicitamente embebido en cada historia
- Decision: cada archivo de historia debe contener `**Estado**: Doing` durante refinamiento y pasar a `**Estado**: Ready` al cierre.
- Rationale: permite retoma manual y visibilidad inmediata sin dependencias externas.
- Alternative considered: registrar estado en un index central solamente. Se descarta porque desincroniza facil con el contenido real de cada historia.

3. Criterio de cierre basado en FINVEST + decision humana
- Decision: cierre automatico a `Ready` cuando decision FINVEST sea `APROBADA`; para `REFINAR`/`RECHAZAR` se solicita continuar iterando o detener.
- Rationale: combina criterio de calidad objetivo con control humano sobre costo/tiempo.
- Alternative considered: forzar iteracion hasta aprobacion. Se descarta por riesgo de bucles infinitos y fatiga del usuario.

4. Uso del agente Product Owner para descubrimiento y mejora
- Decision: crear `.claude/agents/story-product-owner.agent.md` y usarlo para preguntas de negocio, claridad de valor, propuestas de redaccion y refinamiento.
- Rationale: separa la capacidad de coaching/analisis de la orquestacion del flujo.
- Alternative considered: resolver todo desde el skill sin agente especialista. Se descarta por menor calidad en exploracion y redaccion.

5. Mirrors de skill para consistencia del repositorio
- Decision: replicar `story-refine` en `.claude/skills/`, `.github/skills/` y `.agents/skills/`.
- Rationale: mantiene el patron operativo ya usado por otros skills del proyecto.

## Risks / Trade-offs

- [Riesgo] El numero de historias puede crecer rapidamente tras varios splits -> Mitigation: imponer registro obligatorio de historias activas y mostrar resumen de backlog en cada ciclo.
- [Riesgo] Cierre manual de historias en `Doing` puede dejar calidad heterogenea -> Mitigation: gate explicito con confirmacion y recomendacion de retomar luego.
- [Riesgo] Dependencia de salidas consistentes del evaluador FINVEST -> Mitigation: definir parseo robusto de decision (`APROBADA`/`REFINAR`/`RECHAZAR`) y fallback con pregunta al usuario si hay ambiguedad.
- [Trade-off] Mayor interactividad mejora calidad pero aumenta tiempo de sesion.

## Migration Plan

1. Crear spec de capability `story-refine-skill`.
2. Implementar `SKILL.md` del orquestador en los tres mirrors.
3. Crear agente `story-product-owner`.
4. Validar flujo completo con caso base (sin split) y caso con split multiple.
5. Documentar en README/AGENTS si corresponde.

Rollback:
- Eliminar los nuevos archivos del skill y del agente; los tres skills actuales siguen funcionando sin cambios.

## Open Questions

- Definir convencion exacta de nombrado para historias derivadas (ej. sufijos `-A`, `-B` o IDs incrementales). --> Propuesta: usar `docs/specs/stories/story-{slug}.md` donde `{slug}` es un identificador unico generado a partir del titulo de la historia.
- Confirmar si el cierre manual en `Doing` debe requerir motivo textual obligatorio para facilitar retoma.
- Confirmar si `story-refine` debe escribir un indice resumido de historias activas en `docs/specs/stories/`.

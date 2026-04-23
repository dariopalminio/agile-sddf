## Context

En SDDF, el workflow de OpenSpec asume que las especificaciones se crean antes de implementar. Sin embargo, muchos proyectos reales ya tienen código escrito sin especificaciones formales. El skill `openspec-generate-baseline` resuelve este caso: permite a equipos que adoptan SDDF tardíamente obtener una línea base especificada de lo que ya construyeron, usando ingeniería inversa.

El flujo normal es: `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Para la generación de baseline, el flujo es diferente: `/opsx:propose` (con instrucción de reverse engineering) → `/opsx:archive` directamente, porque no hay nada que implementar — el código ya existe.

## Goals / Non-Goals

**Goals:**
- Crear un skill `.claude/skills/openspec-generate-baseline/SKILL.md` invocable via `/openspec-generate-baseline`
- El skill instruye al modelo a analizar `src/`, `README.md`, y `AGENTS.md` (si existe) para inferir comportamiento actual, reglas de negocio y flujos principales
- El skill invoca `/opsx:propose baseline` con esa instrucción de ingeniería inversa como descripción del cambio
- El skill invoca `/opsx:archive` inmediatamente después de que los artefactos estén listos, sin pasar por apply
- El resultado es un change archivado que sirve como punto de referencia histórico ("así funcionaba el sistema el día que adoptamos OpenSpec")

**Non-Goals:**
- No modifica ni genera código fuente
- No crea documentos de proyecto (project-intent.md, requirement-spec.md) — eso es responsabilidad del pipeline L3
- No garantiza que las specs generadas sean 100% precisas: dependen de la calidad del código y la documentación existente
- No soporta múltiples directorios fuente configurables en esta versión (solo `src/`)

## Decisions

**D1: Flujo propose → archive sin apply**
El skip de apply es intencional y estructural, no un workaround. El código ya existe; el change de baseline documenta el estado actual sin generar implementación nueva. La instrucción al modelo es explícita: "no ejecutes apply, ve directo a archive".

Alternativa considerada: marcar todas las tareas del tasks.md como ya completadas y luego archivar. Descartado porque tasks.md en un baseline no tiene sentido — no hay implementación pendiente.

**D2: Nombre fijo del change como "baseline"**
El change se crea siempre con el nombre `baseline` para que sea identificable como el punto de partida del proyecto. Si ya existe un change con ese nombre, el skill pregunta al usuario si desea sobreescribirlo o crear uno con sufijo de fecha (ej. `baseline-2026-04-23`).

Alternativa considerada: nombre configurable por el usuario. Descartado para mantener la convención clara y buscable.

**D3: Instrucción de reverse engineering embebida en el skill**
La instrucción de ingeniería inversa está escrita directamente en el SKILL.md, no en un archivo template separado. Esto mantiene el skill autocontenido y fácil de editar.

## Risks / Trade-offs

- [Riesgo] El modelo puede generar specs incompletas si `src/` es complejo o usa patrones implícitos → Mitigación: el skill indica que las specs son una aproximación inicial y deben revisarse manualmente
- [Riesgo] Si `src/` no existe, el skill no tiene qué analizar → Mitigación: el skill verifica la existencia de `src/` antes de proceder; si no existe, lista los directorios raíz y pide al usuario que indique dónde está el código
- [Trade-off] El artefacto `tasks.md` en el change archivado quedará vacío o con tareas ficticias — esto es aceptable porque el objetivo del baseline es documentar, no planificar implementación

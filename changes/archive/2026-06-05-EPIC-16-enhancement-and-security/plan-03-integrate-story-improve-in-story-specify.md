---
alwaysApply: false
type: plan
id: plan-03-integrate-story-improve-in-story-specify
slug: plan-03-integrate-story-improve-in-story-specify
title: "Plan 03: Integrate story-improve in story-specify"
status: COMPLETED
substatus: DONE
parent: EPIC-16-enhancement-and-security
created: 2026-06-05
updated: 2026-06-05
related: [
  - EPIC-16-enhancement-and-security
]
---
[[EPIC-16-enhancement-and-security]]

## Plan (ya ejecutado): Integrar story-improve en story-specify

### Context
story-specify orquesta el ciclo de especificación story-creation → story-evaluation → story-split → story-product-owner. Cuando story-evaluation devuelve REFINAR o RECHAZAR, el flujo delega directamente en el agente conversacional story-product-owner para mejorar la historia. Sin embargo, el skill story-improve ya existe y aplica automáticamente las recomendaciones del reporte FINVEST por dimensión (score ≤ 3), generando un backup y un log trazable. Actualmente story-improve no está integrado en story-specify.

La integración busca reducir los ciclos manuales de refinamiento: primero se aplican las correcciones automáticas basadas en métricas (story-improve), y luego el Product Owner atiende los gaps de discovery y contexto que la automatización no puede resolver (story-product-owner).

### Approach
Posición en el flujo
Paso 3: story-evaluation → genera finvest-evaluation-report.md
  ↓ (si REFINAR / RECHAZAR / DIVIDIR)
Paso 4: story-split (si DIVIDIR/RECHAZAR con recomendación de división)
  ↓
[NUEVO] Paso 5A: story-improve (modo Agent)
  → Lee finvest-evaluation-report.md + story.md
  → Aplica mejoras por dimensión con score ≤ 3
  → Genera story.md.bak + story-improvement-log.md
  → Si falla o no hay reporte: non-blocking, continúa a 5B
  ↓
Paso 5B: story-product-owner (agente conversacional)  [antes llamado Paso 5]
  → Atiende discovery, contexto de negocio y gaps restantes
  ↓
Paso 6: gate anti-bucle (sin cambios)
Paso 7: resumen final (sin cambios)
Comportamiento de Paso 5A
Se invoca en modo Agent (automático, sin confirmación interactiva) con --story-id <STORY-NNN>
Precondición implícita: finvest-evaluation-report.md ya existe porque Paso 3 lo generó
Si story-improve no encuentra el reporte o falla técnicamente → non-blocking: se registra ⚠️ en el backlog, se continúa a Paso 5B
Si story-improve informa que la decisión ya es APROBADA (gate interno del skill) → se muestra esa información y se pasa a Paso 6 directamente (omitir 5B)
Tras completar 5A, mostrar un resumen breve de las dimensiones mejoradas antes de invocar 5B
Archivo a modificar
Un solo archivo: .claude/skills/story-specify/SKILL.md

### Secciones que cambian
Sección	Cambio
Frontmatter description	Agregar mención de story-improve en la descripción del flujo
## Qué hace este skill	Agregar bullet: "Aplica mejoras automáticas por dimensión FINVEST con story-improve antes del refinamiento conversacional"
## Dependencias	Agregar story-improve a la lista de skills
## Flujo de ejecución → Paso 5	Renombrar a Paso 5B (contenido idéntico al actual)
## Flujo de ejecución	Insertar Paso 5A entre Paso 4 y Paso 5B con el flujo de story-improve descrito arriba
## Manejo de errores	Agregar fila: fallo en story-improve → non-blocking, continúa a Paso 5B
Detalle de Paso 5A a insertar
### Paso 5A — Aplicar mejoras automáticas FINVEST (`story-improve`, modo Agent)

Si la decisión no es `APROBADA` y la historia sigue activa tras el split (o el split no aplica):

Invocar el skill `story-improve` en modo Agent:
- `--story-id <STORY-NNN>` con el ID de la historia activa
- Modo Agent: automático, sin confirmación interactiva

**Si `story-improve` informa que la decisión ya es `APROBADA` (gate interno):**
- Mostrar: `ℹ️ <STORY-NNN> ya tiene decisión APROBADA — avanzando al gate`
- Actualizar registro con `Decision FINVEST = APROBADA`
- Ir directamente al Paso 6 (omitir Paso 5B)

**Si `story-improve` completa con mejoras aplicadas:**
- Registrar en el backlog: `story-improvement-log.md generado`
- Mostrar resumen breve de dimensiones mejoradas
- Continuar al Paso 5B para atender gaps de discovery o contexto

**Si `story-improve` falla con error técnico o no encuentra `finvest-evaluation-report.md`:**
- Registrar estado en backlog: `⚠️ story-improve — no ejecutado`
- Continuar a Paso 5B sin bloquear el flujo
Verificación
Tras story-evaluation con decisión REFINAR, story-specify debe invocar story-improve antes de invocar al agente story-product-owner
Si story-improve falla, el flujo continúa a story-product-owner sin interrumpirse
Si el gate interno de story-improve detecta APROBADA, se omite story-product-owner y se va al gate del Paso 6
El backlog de sesión refleja si story-improve fue ejecutado (y con qué resultado) para cada historia
Plan anterior (ya ejecutado): Renombrar skill story-refine a story-specify
Context
El skill story-refine orquesta story-creation → story-evaluation → story-split para producir historias aprobadas en estado SPECIFY/DONE. Su nombre original enfatizaba el acto de "refinar", pero el propósito real del skill es producir una especificación completa y aprobada de la historia antes de pasar a planning. El renombrado a story-specify (y la actualización de la descripción) alinea el nombre con su responsabilidad real en el pipeline SDD.

### Archivos a modificar
1. Renombrar directorio del skill
.claude/skills/story-refine/   →   .claude/skills/story-specify/
El contenido del directorio no cambia; solo el nombre del directorio.

2. .claude/skills/story-specify/SKILL.md (antes story-refine/SKILL.md)
Cambios en el SKILL.md:

Elemento	Antes	Después
name:	story-refine	story-specify
description (frontmatter)	"flujo de refinamiento de historias"	"flujo de especificación de historias"
Triggers	"story-refine", "refinar historia", "ciclo de refinamiento", "mejorar historia", "orquestar refinamiento", "flujo de refinamiento"	"story-specify", "especificar historia", "ciclo de especificación", "especificación de historia", "orquestar especificación", "flujo de especificación"
# Skill: /story-refine	→ # Skill: /story-specify	
Sección Objetivo	"refinamiento de historias"	"especificación de historias"
Modos de ejecución	/story-refine	/story-specify
Todas las menciones internas de "story-refine" o "/story-refine"	→ story-specify / /story-specify	
La lógica, el flujo de ejecución y la estructura del skill no cambian.

3. package.json
Actualizar la entrada en el array "files" que apunta a .claude/skills/story-refine/ → .claude/skills/story-specify/.

4. openspec/config.yaml
Actualizar la referencia al skill en la definición del pipeline (línea 22).

5. .claude/skills/story-plan/SKILL.md
Actualizar la mención de story-refine en el diagrama de posicionamiento (línea 41).

6. .claude/skills/story-plan/README.md
Actualizar las referencias a story-refine en el diagrama de flujo SDD (líneas 8-9).

7. .claude/skills/story-implement-tasks/assets/README.md
Actualizar la referencia a /story-refine en el diagrama de flujo (línea 8).

8. .claude/skills/story-evaluation/SKILL.md
Actualizar la mención del orquestador invocador (story-refine → story-specify) en el contexto de modo Agent.

9. .claude/skills/release-generate-stories/SKILL.md
Actualizar la sugerencia de "próximo paso" (línea ~275).

10. .claude/skills/release-generate-all-stories/SKILL.md
Actualizar la sugerencia de "próximo paso" (línea ~300).

11. .claude/agents/story-product-owner.agent.md
Actualizar las referencias a story-refine en las líneas 4, 29 y 76.

12. README.md (raíz del proyecto)
Actualizar menciones del comando /story-refine en el pipeline (líneas 184 y 326).

13. docs/index.md
Actualizar la referencia al skill (línea 50).

14. docs/knowledge/guides/sddf-commands-pipeline.md
Actualizar la referencia al skill (línea 80).

15. openspec/specs/story-refine-skill/spec.md (y renombrar directorio)
openspec/specs/story-refine-skill/   →   openspec/specs/story-specify-skill/
Actualizar contenido del spec.md para reflejar el nuevo nombre.

16. openspec/specs/story-lifecycle-states/spec.md
Actualizar referencias a story-refine (líneas 16-17, 30-31).

### Archivos que NO se modifican (históricos/archivados)
CHANGELOG.md — registro histórico de releases
openspec/changes/archive/ — todos los archivos de cambios archivados
docs/specs/projects/PROJ-01-agile-sddf/ — documentación histórica del proyecto
docs/specs/stories/STORY-013-story-refine/ — historia de implementación del skill original
docs/specs/03-stories/STORY-062*/ y STORY-087*/ — historias históricas
docs/specs/releases/EPIC-16-enhancement/release.md — especificación de la tarea en curso (no modificar el enunciado)
Verificación
El skill invocable como /story-specify ejecuta el mismo flujo que antes
story-plan/SKILL.md y README.md muestran /story-refine → /story-specify en los diagramas
story-product-owner.agent.md referencia story-specify como su orquestador
package.json apunta al directorio correcto .claude/skills/story-specify/
No quedan referencias activas a story-refine fuera de archivos históricos




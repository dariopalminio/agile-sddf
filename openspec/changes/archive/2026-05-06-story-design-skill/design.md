## Context

El workflow SDD de SDDF define tres niveles: Project (L3), Release (L2) e Historia (L1). En el nivel L1, el ciclo actual es: `story-creation → story-evaluation → story-split → story-refine`. Falta el paso que convierte la historia en diseño técnico antes de la implementación.

El nuevo skill `story-design` ocupa el hueco entre `story-refine` y la fase de implementación (`story-tasking`). Lee el `story.md` ya refinado y genera `design.md` en el mismo directorio, siguiendo el template `design-template.md`.

**Restricciones clave:**
- El framework no ejecuta código en runtime; toda la lógica vive en instrucciones Markdown.
- El template es la única fuente de verdad estructural del output (patrón #5 del skill structural pattern).
- El skill debe ser multiclie y reutilizable en Claude Code, OpenCode y similares.

## Goals / Non-Goals

**Goals:**
- Generar `design.md` en `$SPECS_BASE/specs/stories/<FEAT-NNN>-<slug>/` a partir de un `story.md` válido
- Incluir una fase de investigación de alternativas técnicas documentada en el design
- Respetar `constitution.md` como fuente de restricciones técnicas del proyecto
- Seguir los patrones estructurales de skills: preflight, template dinámico, un nivel de delegación
- El skill debe crearse usando `skill-master` para garantizar calidad y consistencia

**Non-Goals:**
- No generar tareas de implementación (eso es `story-tasking`)
- No evaluar ni modificar el `story.md` de origen
- No prescribir ninguna arquitectura o patrón técnico concreto (eso lo define el template y la constitución)
- No integrar con herramientas externas (Jira, GitHub Issues, etc.)

## Decisions

### Decisión 1: Template como fuente de verdad (no hardcodear secciones)

**Elegido:** El skill lee `design-template.md` en runtime y usa su estructura para generar el output, sin hardcodear nombres de secciones.

**Alternativa descartada:** Codificar directamente en `SKILL.md` las secciones de `design.md` (Contexto, Alternativas, Decisión, etc.).

**Razón:** Si el template evoluciona, el skill se adapta automáticamente. Es el patrón establecido (#5) y permite que cada proyecto personalice el template sin modificar el skill.

---

### Decisión 2: El skill lee constitution.md + story.md como inputs contextuales

**Elegido:** El skill lee explícitamente `$SPECS_BASE/policies/constitution.md` (restricciones técnicas del proyecto) y el `story.md` de la historia destino antes de generar el design.

**Alternativa descartada:** Dejar que el LLM infiera las restricciones del proyecto sin leerlas explícitamente.

**Razón:** Garantiza que el diseño técnico generado sea coherente con el stack, las convenciones y los principios técnicos inamovibles del proyecto. Es un requerimiento explícito de la historia (criterio no funcional: "coherencia con constitution.md").

---

### Decisión 3: Creación del skill con `skill-master`

**Elegido:** El skill `story-design` se construye usando el skill `skill-master`, que guía la estructura, genera ejemplos y define evals.

**Alternativa descartada:** Crear el skill manualmente sin usar `skill-master`.

**Razón:** Requerimiento explícito de la historia (`FEAT-057`). Garantiza conformidad con los estándares de documentación, estructura de directorios y evals del framework.

---

### Decisión 4: Sin subagentes para la generación del design

**Elegido:** El skill orquesta directamente la generación del `design.md` sin delegar a subagentes especializados, dado que la tarea es un único artefacto con inputs bien definidos.

**Alternativa descartada:** Crear un subagente `story-design-agent` separado.

**Razón:** La historia no requiere análisis paralelo ni múltiples perspectivas especializadas. Un skill orquestador directo mantiene la arquitectura simple (patrón #4) y reduce la complejidad.

## Risks / Trade-offs

- **[Riesgo] El template no existe en el proyecto del usuario** → El skill detecta la ausencia en Paso 0 (preflight extendido) y muestra un error accionable con la ruta esperada.
- **[Riesgo] constitution.md no existe o está incompleto** → El skill emite una advertencia pero continúa, generando el design con las restricciones conocidas.
- **[Trade-off] El design generado es tan bueno como el story.md de origen** → El usuario debe asegurarse de ejecutar `story-refine` antes de `story-design`. Se documenta en el SKILL.md como precondición explícita.
- **[Riesgo] El template de diseño es genérico y no captura necesidades de dominio específico** → Se mitiga con la instrucción al LLM de inferir el contexto del proyecto desde `constitution.md`.

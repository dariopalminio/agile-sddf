## Context

El pipeline SDDF L2 dispone de `release-format-validation` para validar releases existentes y `releases-from-project-plan` para generar releases desde un plan estructurado. No existe un skill que conduzca al usuario paso a paso para *crear* un release desde cero cuando no hay `project-plan.md` previo. El nuevo skill `release-creation` cubre ese hueco: un asistente interactivo que usa el template como fuente única de verdad estructural (igual que lo hace `release-format-validation`) y formula preguntas en tiempo de ejecución para completar cada sección.

El skill se construye siguiendo la metodología del skill `skill-master`: diseño del flujo, redacción del `SKILL.md`, y validación contra el output esperado.

## Goals / Non-Goals

**Goals:**
- Skill `release-creation` que extrae dinámicamente las secciones del template `assets/release-spec-template.md` en tiempo de ejecución
- Flujo interactivo de preguntas por sección (obligatorias primero, opcionales con opción de saltar)
- Genera `$SPECS_BASE/specs/releases/<slug>/release.md` con frontmatter completo
- El archivo producido debe pasar `release-format-validation` sin refinamiento adicional
- Usa `skill-master` como metodología de construcción del skill

**Non-Goals:**
- No modifica `release-format-validation` ni `releases-from-project-plan`
- No genera stories automáticamente (eso corresponde a `release-generate-stories`)
- No valida la calidad del contenido (solo la estructura — la validación la delega al skill existente)
- No requiere integración con sistemas externos

## Decisions

### D1 — Template como fuente única de verdad estructural
El skill no hardcodea ningún nombre de sección. Lee `assets/release-spec-template.md` al inicio de la ejecución y extrae dinámicamente las secciones obligatorias (marcadas con `<!-- sección obligatoria`) y las opcionales. Si el template cambia, el flujo de preguntas se actualiza automáticamente sin modificar el skill.

**Alternativa descartada:** Hardcodear las secciones en el SKILL.md → rompe el principio de autonomía estructural del framework y requiere mantenimiento manual sincronizado.

### D2 — Copia local del template vs referencia a `release-format-validation`
El skill tendrá su propia copia de `assets/release-spec-template.md`. Esto elimina acoplamiento entre skills (un skill no lee assets de otro) y permite que `release-creation` evolucione su template independientemente si fuera necesario.

**Alternativa descartada:** Leer el template desde `release-format-validation/assets/` → acoplamiento frágil entre skills, rompe la convención de assets locales.

### D3 — Secciones opcionales con pregunta de confirmación
Para secciones opcionales del template, el skill pregunta "¿Quieres completar la sección X? (sí / no / saltar todo)". Si el usuario responde no/skip, la sección se omite del archivo final. Esto produce releases mínimos válidos cuando el usuario quiere rapidez.

### D4 — Slug del directorio derivado del nombre del release
El skill pide el nombre del release como primera pregunta. Derivan automáticamente el slug kebab-case para crear `$SPECS_BASE/specs/releases/<EPIC-NN-slug>/release.md`. Si el directorio ya existe, el skill pregunta si sobreescribir o usar un nombre diferente.

### D5 — Construcción con `skill-master`
El SKILL.md se redacta usando la metodología `skill-master`: captura de intent, redacción del draft, definición de casos de prueba y criterios de evaluación. No se ejecutan benchmarks automatizados (skill de tipo workflow interactivo), pero sí se documentan los casos de prueba para validación manual.

## Risks / Trade-offs

- **Divergencia de templates:** Si `release-format-validation` actualiza su template y `release-creation` no, los releases creados podrían no pasar validación → Mitigación: documentar en ambos skills la fuente compartida; considerar en el futuro un directorio `assets/shared/` a nivel de `.claude/skills/`.
- **Calidad del contenido:** El skill no valida semántica, solo estructura → Mitigación: al final del flujo, el skill invoca `release-format-validation` automáticamente para confirmar que el archivo generado está APROBADO.
- **Experiencia de usuario en sesiones largas:** Un template con muchas secciones genera muchas preguntas → Mitigación: agrupar secciones relacionadas y ofrecer modo "rápido" que solo completa secciones obligatorias.

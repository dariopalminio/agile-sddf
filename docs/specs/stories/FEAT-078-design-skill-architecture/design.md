---
alwaysApply: false
type: design
id: FEAT-078
slug: FEAT-078-design-skill-architecture-design
title: "Design: design-skill-architecture — skill reference para arquitectura de skills SDDF"
story: FEAT-078
created: 2026-05-29
updated: 2026-05-29
status: PLANNING
substatus: IN-PROGRESS
related:
  - FEAT-078-design-skill-architecture
  - EPIC-14-fabrica-de-skills
---

<!-- Referencias -->
[[FEAT-078-design-skill-architecture]]
[[EPIC-14-fabrica-de-skills]]

## Context

`design-skill-architecture` es un skill de tipo `reference` dentro del ecosistema SDDF. Su función es aportar guías de buenas prácticas que `story-design` carga en su contexto antes de generar `design.md` y `tasks.md`, cuando la historia describe la construcción de un nuevo skill SDDF.

El mecanismo es: `story-design` lee `sddf-config.yaml` (Paso 3b), encuentra `design-skill-architecture` declarado con `type: reference`, lee todos los archivos `.md` en `references_path` y los añade a su contexto técnico interno. Con ese contexto enriquecido, `story-design` genera un `design.md` que incluye secciones específicas de skill (estructura de carpetas canónica, frontmatter YAML propuesto, scripts sugeridos, evals a escribir) y un `tasks.md` con las fases TDD (RED/GREEN/REFACTOR) explícitamente anotadas.

**El orquestador genera; el skill reference enriquece.** La lógica de generación reside en `story-design`. El conocimiento especializado de cómo construir un skill SDDF reside en `design-skill-architecture/references/`.

**Estado actual — todo implementado:**
- `.claude/skills/design-skill-architecture/SKILL.md` — `type: reference`, frontmatter correcto, sección de referencias disponibles
- `.claude/skills/design-skill-architecture/references/` — 5 archivos de guías presentes y funcionales
- `docs/policies/sddf-config.yaml` — `design-skill-architecture` declarado bajo `plan.skills` con `type: reference` y `references_path`
- `.claude/skills/story-design/SKILL.md` — Paso 3b implementado: lee config, carga references, puede invocar delegates

Este diseño documenta la arquitectura ya implementada y confirma que satisface los ACs corregidos de `story.md`.

---

## Goals / Non-Goals

**Goals:**
- Documentar la arquitectura del modelo `reference` para `design-skill-architecture` // satisface: AC-1
- Confirmar que el mecanismo de carga de referencias en story-design (Paso 3b) satisface AC-1
- Documentar la degradación gradual ante config ausente o referencias faltantes // satisface: AC-2, AC-3
- Documentar cómo las guías de referencias aportan el mapeo tipo de skill → scripts // satisface: AC-4
- Registrar las decisiones de diseño que justifican `type: reference` sobre `type: delegate`

**Non-Goals:**
- No se diseña ni modifica lógica de generación en `story-design` (ya existe el Paso 3b)
- No se crean `evals/` propios para `design-skill-architecture` — la calidad se mide comparativamente
- No se crean `examples/` — el comportamiento se verifica con el mecanismo de pressure scenario de `test-skill-verify`
- No se genera el `SKILL.md` final del skill nuevo (eso lo hace `impl-skill-builder`)
- No se reescriben los 5 archivos de `references/` existentes — están correctos y funcionales

---

## Decisions

### D-1: `type: reference` y no `type: delegate` // satisface: AC-1

**Opción elegida:** `design-skill-architecture` aporta guías que `story-design` carga en contexto; el orquestador mantiene la responsabilidad de generar los artefactos.

**Justificación:** `story-design` ya tiene la lógica completa de generación de `design.md` y `tasks.md`: lee el template, aplica los principios P1–P12, ejecuta la checklist y gestiona el ciclo de vida del documento. Lo que le falta cuando la historia es sobre un skill SDDF es el **conocimiento de dominio** sobre cómo estructurar un skill, qué evals escribir y qué scripts sugerir. El skill reference aporta ese conocimiento sin duplicar la lógica de generación.

Un `type: delegate` que genere los artefactos replicaría toda esa lógica de story-design en un skill separado — violando DRY y SRP. El modelo reference aplica la separación natural: lógica de generación en el orquestador, conocimiento de dominio en el skill complementario.

**Alternativas rechazadas:**
- **A) `type: delegate` que genera design.md + tasks.md directamente:** Duplica la lógica de generación de story-design. Viola DRY. Requiere mantener dos sistemas de generación sincronizados.
- **B) Hardcodear las guías de skill dentro de story-design:** Acopla el orquestador a un dominio específico (skills SDDF). Imposible agregar guías para otros stacks (React, Python) sin modificar story-design. Viola el principio de agnosticismo tecnológico.

---

### D-2: Sin evals propios en `design-skill-architecture` // satisface: AC-1

**Opción elegida:** No hay `evals/evals.json` en este skill. La calidad del skill se mide comparativamente: `story-design` genera `design.md` sobre una historia de skill **con** referencias cargadas vs **sin** referencias. El output enriquecido demuestra el valor del skill.

**Justificación:** Un skill `type: reference` no ejecuta pasos propios — no produce output directamente medible. Lo que se mide es la **mejora de calidad del output del orquestador** al tener el contexto enriquecido. Este tipo de evaluación comparativa es exactamente lo que implementa `test-skill-verify` (FEAT-080): ejecuta el pressure scenario con y sin el skill y compara los outputs.

**Alternativa rechazada:** Crear `evals/` que validen que `story-design` genera ciertas secciones cuando las referencias están cargadas — este eval pertenece al skill `test-skill-verify`, no a `design-skill-architecture`. Colocarlo aquí confundiría la responsabilidad del eval.

---

### D-3: Mecanismo de carga — `sddf-config.yaml` como punto de configuración // satisface: AC-1, AC-2

**Opción elegida:** `story-design` lee `docs/policies/sddf-config.yaml` en el Paso 3b y carga automáticamente las referencias de todos los skills con `type: reference` declarados bajo `plan.skills`.

**Contrato de configuración:**
```yaml
plan:
  skills:
    - name: design-skill-architecture
      type: reference
      references_path: ".claude/skills/design-skill-architecture/references"
      description: "Guías de buenas prácticas para diseñar skills SDDF"
      required: false
```

**Degradación gradual (AC-2):** Si `sddf-config.yaml` no existe o `design-skill-architecture` no está declarado, el Paso 3b de story-design emite `⚠️` y continúa con flujo genérico. No hay error fatal.

**Alternativa rechazada:** Hardcodear la ruta de referencias directamente en story-design — viola el principio de agnosticismo; story-design no sabría qué hacer cuando se añadan skills para otros dominios (React, Python, microservicios).

---

### D-4: Cinco archivos de referencia como base de conocimiento // satisface: AC-1, AC-4

**Opción elegida:** El conocimiento de skill construction se distribuye en 5 archivos especializados en `references/`, cada uno con un propósito único.

| Archivo | Propósito | AC que enriquece |
|---------|-----------|-----------------|
| `skill-structure.md` | Estructura canónica de carpetas + cuándo incluir cada directorio | AC-1 (estructura de carpetas en design.md) |
| `skill-frontmatter.md` | Convenciones de frontmatter YAML (campos, tipos, alwaysApply) | AC-1 (frontmatter YAML propuesto en design.md) |
| `tdd-workflow.md` | Ciclo RED/GREEN/REFACTOR con pressure scenarios | AC-1 (fases TDD en tasks.md) |
| `evals-format.md` | Esquema de evals.json con 3 casos de ejemplo | AC-1 (evals a escribir en design.md) |
| `tasks-tdd-template.md` | Plantilla de tasks.md con fases TDD anotadas | AC-1 (tasks.md con RED/GREEN/REFACTOR) |

El mapeo tipo de skill → scripts sugeridos (AC-4) está incluido en `skill-structure.md`: la tabla de tipos con sus scripts orientativos es parte del conocimiento de dominio que story-design usa al generar el design.md.

**Alternativa rechazada:** Un único archivo de referencia grande — dificulta el mantenimiento (cambiar el formato de evals requiere editar todo el archivo) y viola la cohesión (cada archivo debe tener un solo tema).

---

## Flujo de activación (desde story-design)

```
story-design Paso 3b:
  1. Leer docs/policies/sddf-config.yaml
  2. Obtener plan.skills
  3. Para cada skill con type: reference:
     a. Leer todos los .md de references_path
     b. Añadir al contexto interno: "Guías de referencia: design-skill-architecture"
     c. Emitir: [OK] Contexto enriquecido con referencias de design-skill-architecture
  4. Continuar con Paso 4 (leer template) con contexto enriquecido

story-design Paso 5 (completar template):
  → Usa las guías de skill-structure.md para proponer estructura de carpetas
  → Usa skill-frontmatter.md para proponer el frontmatter YAML del nuevo skill
  → Usa tdd-workflow.md para anotar fases TDD en tasks.md
  → Usa evals-format.md para especificar evals a escribir
  → Usa tasks-tdd-template.md para generar tasks.md con secciones RED/GREEN/REFACTOR
```

---

## Risks / Trade-offs

### R-1: story-design puede no utilizar las guías cargadas al generar secciones de skill

**Riesgo:** Las referencias se cargan en el contexto de story-design, pero story-design podría ignorarlas si sus instrucciones de generación no hacen referencia explícita a ellas. El output sería genérico aunque las guías estuvieran disponibles.

**Mitigación:** La calidad de uso de las referencias es responsabilidad del Paso 5 de story-design ("completar el template"). Las guías están disponibles en contexto — story-design las usará naturalmente al describir arquitecturas de skill. El pressure scenario de `test-skill-verify` detecta si el output con referencias es mejor que sin ellas.

---

### R-2: Las referencias pueden quedar desactualizadas si las convenciones de skill evolucionan

**Riesgo:** Si la estructura canónica de skills cambia (p.ej. se añade un directorio `agents/` obligatorio), los archivos de `references/` no se actualizan automáticamente.

**Mitigación:** Los archivos de `references/` son Markdown editable sin impacto en el sistema. Actualizar las guías es el mecanismo de actualización del comportamiento — no requiere cambios en código. El `version` en SKILL.md permite detectar si las guías han evolucionado.

---

## Open Questions

1. **¿Debe `skill-structure.md` incluir el mapeo explícito tipo de skill → scripts (tabla tipo/scripts)?** Actualmente el contenido existe implícitamente como convención, pero el AC-4 requiere que story-design proponga scripts concretos. Si `skill-structure.md` incluye la tabla explícita, story-design puede usarla directamente. Verificar durante la integración.

2. **¿Cómo valida story-design que las referencias cargadas son de alta calidad?** Actualmente no hay validación — las referencias se cargan tal cual. Un skill de validación (p.ej. `validate-references`) podría verificar el formato de los archivos antes de cargarlos. No es necesario para los ACs actuales.

---

## Verificación

**Escenario con referencias (AC-1):**
Invocar `/story-design FEAT-078` con `design-skill-architecture` activo en `sddf-config.yaml`.
Verificar que el `design.md` generado contiene:
- Sección de estructura de carpetas para el nuevo skill
- Frontmatter YAML propuesto
- Tabla de scripts según tipo detectado
- Lista de evals a escribir

**Escenario sin referencias (AC-2):**
Comentar `design-skill-architecture` en `sddf-config.yaml`. Invocar `/story-design FEAT-078`.
Verificar que el `design.md` generado es genérico (sin las secciones anteriores) y que story-design emite `⚠️`.

**Escenario de referencia faltante (AC-3):**
Eliminar temporalmente `references/tdd-workflow.md`. Invocar `/story-design FEAT-078`.
Verificar que story-design emite `⚠️` por ese archivo y genera design.md con las 4 referencias disponibles.

---

## Registro de Cambios (CR)

Sin CRs detectados. La arquitectura implementada satisface los ACs corregidos de story.md.

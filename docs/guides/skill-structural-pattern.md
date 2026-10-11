---
type: guide
slug: skill-structural-pattern
title: "Patrones estructurales de Skills (Skill Structural patterns)"
date: 2026-05-05
status: null
substatus: null
parent: null
related:
  - best-practices-for-skills
---
<!-- Referencias -->
[[best-practices-for-skills]]

# Patrones estructurales de Skills (Skill Structural patterns)

## Patrones estructurales

### 1. Estructura de directorios de skill

Todo skill sigue esta convención:

```
skill-name/
├── SKILL.md          # obligatorio — frontmatter YAML + instrucciones
├── assets/           # templates canónicos (fuente de verdad)
├── examples/         # casos de prueba input/output
├── scripts/          # código ejecutable (Python, Bash)
├── agents/           # subagentes locales que el skill invoca
└── evals/            # benchmarks de evaluación
```

### 2. Frontmatter YAML en SKILL.md

Todos los skills arrancan con frontmatter YAML estandarizado (campos: name, description, triggers, outputs, etc.).

### 3. Resolución local de contexto

Todos los skills resuelven una vez `REPO_ROOT`, `SPECS_BASE` y la fuente efectiva antes de
ejecutar lógica de negocio. La precedencia es `SDDF_ROOT` válida →
`sddf.config.yaml.root` válida → `docs`; una fuente explícita inválida detiene las
escrituras. `skill-preflight` es un diagnóstico explícito, no un paso automático.

## Patrones de arquitectura

### 4. Un solo nivel de delegación

```
skill (orquestador)
  └── agent A
  └── agent B
  ```

El skill es siempre el punto de entrada. Los agentes especializados son subagentes. No hay delegación entre agentes.

### 5. Template como fuente de verdad dinámica

Los skills no hardcodean la estructura del output. En runtime leen el template correspondiente y extraen secciones, campos y preguntas dinámicamente. Si el template evoluciona, el skill se adapta solo.

Los templates globales y reusables están en `$SPECS_BASE/templates/`. Los skills leen desde ahí para mantener una fuente de verdad única.

Los templates locales y particulares de un skill están en `skill-name/assets/` y el skill los lee desde ahí. Esto permite que cada skill tenga su propia versión del template sin afectar a otros skills.

### 6. Skills como orquestadores sin lógica de negocio

La lógica de dominio vive en los templates (estructura) y en los agentes (criterios). El skill orquesta: lee contexto → delega → escribe output.

## Patrones de nomenclatura

### 7. IDs jerárquicos

| Nivel | Patrón | Ejemplo |
|---|---|---|
| Épica | `EPIC-NN-kebab` | `EPIC-12-story-sdd-workflow` |
| Historia | `STORY-NNN-kebab` | `STORY-042-login` |

Los requisitos usan `FR-NNN`/`NFR-NNN` y no son work items.

El prefijo del ID nombra el **nivel**, nunca el tipo de trabajo. El tipo de una historia
(`feat` / `fix` / `chore` / `hotfix`) vive en el campo `kind` del frontmatter y en el prefijo
de su rama. No se admiten prefijos de ID por tipo (`BUG-`, `CHORE-`): rompen el globbing por nivel.

### 8. Frontmatter YAML en documentos generados

```yaml
---
type: epic | story | product | requirement | srs | wiki
id: EPIC-NN | STORY-NNN | FR-NNN | NFR-NNN
kind: feat | fix | chore | hotfix             # solo si type = story
kind: functional | non-functional             # solo si type = requirement
slug: nombre-kebab
status: BACKLOG | DISCOVERY | PLANNING | ...
substatus: TODO | IN-PROGRESS | DONE
parent: null | EPIC-NN
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Los campos obligatorios por `type` los fija `header-aggregation`.


## Reglas de comportamiento

### 9. Control WIP = 1 por nivel de work item

Solo una épica y una historia pueden tener `substatus: IN-PROGRESS` a la vez en su nivel. La documentación fundacional no tiene WIP: su avance lo decide el estado de las capas. El skill debe verificarlo antes de activar un nuevo ítem.

### 10. Gates secuenciales con precondiciones
Cada skill verifica que el artefacto del paso anterior existe y está válido antes de ejecutar. Ejemplo: epic-generate-stories requiere que epic-format-validation haya pasado.

### 11. Idempotencia declarada
Skills de inicialización (sddf-init, openspec-init-config) declaran explícitamente que no sobrescriben archivos existentes.
El skill debe ser idempotente: puede ejecutarse múltiples veces sin efectos adversos. Si el artefacto ya existe, ofrece opciones: sobrescribir, mantener, comparar versiones, etc.

### 12. Flags opcionales para modos alternativos
Los skills exponen flags para variantes de comportamiento: --quick, --update, --dry-run, --interactive, --from-files, --verbose.

### 13. Progreso en comandos largos
Si los comandos de prueba tardan mucho, el skill debe mostrar progreso periódicamente.

## Patrones de output

### 14. Rutas de output predecibles

$SPECS_BASE/product/vision.md                            → documentación fundacional
$SPECS_BASE/product/stakeholders.md                      → documentación fundacional
$SPECS_BASE/product/roadmap.md                           → documentación fundacional
$SPECS_BASE/requirements/functional/FR-NNN-<slug>.md     → requisitos funcionales
$SPECS_BASE/requirements/non-functional/NFR-NNN-<slug>.md → requisitos no funcionales
$SPECS_BASE/specs/epics/<EPIC-NN>-<slug>/epic.md         → épicas
$SPECS_BASE/specs/stories/<STORY-NNN>-<slug>/story.md    → historias

### 15. Versionado mediante substatus

El ciclo de vida de un artefacto se traza con status + substatus, no con versiones numéricas.

### 16. Skills de validación antes de transformación

Existe un skill de validación explícito (epic-format-validation) que actúa como gate antes de que los skills de generación consuman el documento.


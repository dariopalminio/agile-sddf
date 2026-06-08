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

### 3. Preflight como Paso 0

Todos los skills invocan skill-preflight como primer paso antes de ejecutar cualquier lógica. Verifica SDDF_ROOT, estructura de directorios y templates disponibles.

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

Los templates globales y reusables están en `$SPECS_BASE/specs/templates/`. Los skills leen desde ahí para mantener una fuente de verdad única.

Los templates locales y particulares de un skill están en `skill-name/assets/` y el skill los lee desde ahí. Esto permite que cada skill tenga su propia versión del template sin afectar a otros skills.

### 6. Skills como orquestadores sin lógica de negocio

La lógica de dominio vive en los templates (estructura) y en los agentes (criterios). El skill orquesta: lee contexto → delega → escribe output.

## Patrones de nomenclatura

### 7. IDs jerárquicos
Nivel	Patrón	Ejemplo
Proyecto	PROJ-NN-kebab	PROJ-01-mi-app
Release/Épica	EPIC-NN-kebab	EPIC-12-story-sdd-workflow
Feature/Historia	FEAT-NNN-kebab	FEAT-042-login

### 8. Frontmatter YAML en documentos generados

---
type: project | release | story
id: EPIC-NN
slug: nombre-kebab
status: BACKLOG | DISCOVERY | PLANNING | SPECIFY | READY-FOR-IMPLEMENT | IMPLEMENT | CODE-REVIEW | VERIFY | ACCEPTANCE | INTEGRATION | COMPLETED | DEFINITION | PLANNED | DEV-IN-PROGRESS | VERIFY-INTEGRATION | PUBLISH | RELEASED | CANCELED | BEGINNING | DISCOVERY | PLANNING | ACTIVE-DEVELOPMENT | MEASURING-VALUE | FINISHED
substatus: TODO | IN-PROGRESS | DONE
parent: PROJ-NN
created: YYYY-MM-DD
updated: YYYY-MM-DD
related:
  - FEAT-071-skill-story-verify
  - FEAT-070-dod-code-review-en-story-code-review
  - FEAT-068-dod-plan-en-story-analyze
---
<!-- Referencias -->
[[slug-de-documento-relacionado]]


## Reglas de comportamiento

### 9. Control WIP = 1
Solo un documento puede tener substatus: IN-PROGRESS a la vez por nivel del pipeline. El skill debe verificar esto antes de activar un nuevo ítem.

### 10. Gates secuenciales con precondiciones
Cada skill verifica que el artefacto del paso anterior existe y está válido antes de ejecutar. Ejemplo: release-generate-stories requiere que release-format-validation haya pasado.

### 11. Idempotencia declarada
Skills de inicialización (sddf-init, openspec-init-config) declaran explícitamente que no sobrescriben archivos existentes.
El skill debe ser idempotente: puede ejecutarse múltiples veces sin efectos adversos. Si el artefacto ya existe, ofrece opciones: sobrescribir, mantener, comparar versiones, etc.

### 12. Flags opcionales para modos alternativos
Los skills exponen flags para variantes de comportamiento: --quick, --update, --dry-run, --interactive, --from-files, --verbose.

### 13. Progreso en comandos largos
Si los comandos de prueba tardan mucho, el skill debe mostrar progreso periódicamente.

## Patrones de output

### 14. Rutas de output predecibles

$SPECS_BASE/specs/projects/<PROJ-ID>/  → artefactos de proyecto
$SPECS_BASE/specs/releases/<EPIC-NN>/  → releases
$SPECS_BASE/specs/stories/<FEAT-NNN>/ → historias

### 15. Versionado mediante substatus

El ciclo de vida de un artefacto se traza con status + substatus, no con versiones numéricas.

### 16. Skills de validación antes de transformación

Existe un skill de validación explícito (release-format-validation) que actúa como gate antes de que los skills de generación consuman el documento.




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

### 3. Layout fijo

Todos los skills resuelven una vez `REPO_ROOT` antes de ejecutar lógica de negocio y usan
rutas fijas relativas a él; no hay raíz de artefactos configurable. `skill-preflight` es un
diagnóstico explícito, no un paso automático.

### 3.1 Contrato de layout fijo

[ADR-0016](../adr/ADR-0016-layout-fijo-de-tres-raices.md) retiró la resolución de raíz anterior (`SDDF_ROOT`, la clave
`root` de `sddf.config.yaml` y `SPECS_BASE`): cada skill tiene un paso 0 que solo resuelve `REPO_ROOT` y usa rutas
fijas. El bloque canónico es:

```markdown
### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

`npm run verify:layout` (paso «contrato de layout fijo» de `verify:repository`) exige en cada `skills/*/SKILL.md`:

| Regla | Condición |
|---|---|
| R1 | la línea exacta `<!-- SDDF-FIXED-LAYOUT: v1 -->` |
| R2 | el bloque, desde el marcador hasta el siguiente encabezado, nombra `REPO_ROOT`, `specs/flow/`, `docs/templates/` y `docs/guardrails/` |
| R3 | ninguna línea contiene `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE` ni `SDDF_ROOT` |
| R4 | ninguna línea nombra a la vez la clave `root` y `sddf.config.yaml` |

Solo `skill-preflight` puede mencionar el layout legado para diagnosticarlo, y solo entre
`<!-- SDDF-LEGACY-DIAGNOSTIC:start -->` y `<!-- SDDF-LEGACY-DIAGNOSTIC:end -->`; esas líneas quedan fuera de R3 y R4.

Los skills aún no migrados figuran en `PENDING_MIGRATION` (`scripts/verify-fixed-layout.js`). Cada historia de
migración añade el bloque y retira el skill de la lista en el mismo cambio: el gate falla si un skill de la lista ya
cumple el contrato o no existe. La lista debe quedar vacía al cerrar EPIC-26.

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

Los templates globales y reusables están en `docs/templates/`. Los skills leen desde ahí para mantener una fuente de verdad única.

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

docs/product/vision.md                                   → documentación fundacional
docs/product/stakeholders.md                             → documentación fundacional
docs/product/roadmap.md                                  → documentación fundacional
docs/requirements/functional/FR-NNN-<slug>.md            → requisitos funcionales
docs/requirements/non-functional/NFR-NNN-<slug>.md       → requisitos no funcionales
specs/flow/<EPIC-NN>-<slug>/epic.md                      → épicas
specs/flow/<STORY-NNN>-<slug>/story.md                   → historias
specs/flow/archive/<YYYY-MM-DD>-<STORY-NNN>-<slug>/      → historias COMPLETED archivadas

### 15. Versionado mediante substatus

El ciclo de vida de un artefacto se traza con status + substatus, no con versiones numéricas.

### 16. Skills de validación antes de transformación

Existe un skill de validación explícito (epic-format-validation) que actúa como gate antes de que los skills de generación consuman el documento.


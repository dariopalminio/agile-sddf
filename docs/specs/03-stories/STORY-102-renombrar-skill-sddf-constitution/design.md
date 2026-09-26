---
alwaysApply: false
type: design
id: STORY-102
slug: STORY-102-renombrar-skill-sddf-constitution-design
title: "Design: Renombrar el skill project-policies-generation como sddf-constitution"
date: 2026-09-26
status: PLAN
substatus: DONE
parent: EPIC-12-story-sdd-workflow
story: STORY-102
related:
  - STORY-102-renombrar-skill-sddf-constitution
  - EPIC-12-story-sdd-workflow
  - STORY-056-project-policies
---

<!-- Referencias -->
[[STORY-102-renombrar-skill-sddf-constitution]]
[[EPIC-12-story-sdd-workflow]]
[[STORY-056-project-policies]]

# Diseño técnico: Renombrar el skill project-policies-generation como sddf-constitution

## Context

El árbol fuente `skills/project-policies-generation/` contiene el skill que prepara o actualiza
`constitution.md`, las políticas derivadas y los transition guardrails DoD. El nombre actual no
expresa que la constitución es la raíz de gobernanza; [[STORY-102-renombrar-skill-sddf-constitution]]
requiere adoptar `sddf-constitution` sin cambiar esas capacidades.

La fuente única versionada de skills es `skills/`. Las copias bajo `.agents/`, `.claude/` u otros
runtimes son salida de una instalación explícita y no se modifican en esta historia. El instalador
recorre dinámicamente los directorios de `skills/`, por lo que el nuevo directorio se distribuirá
sin añadir una lista especial al instalador ni al contrato de runtimes.

El alcance operativo actual incluye el propio skill, `sddf-init`, `story-design`, sus mensajes y
evals asociados, la documentación de uso y `config/eval-exemptions.json`. Las menciones que narran
el contrato anterior en `CHANGELOG.md`, `docs/specs/**` o en documentación de migración del DoD son
trazabilidad histórica, no aliases públicos.

## Goals / Non-Goals

**Goals:**

- Hacer de `skills/sddf-constitution/` la única fuente canónica del bootstrap de gobernanza.
- Exponer exclusivamente `sddf-constitution` y `/sddf-constitution` en las superficies operativas.
- Conservar intactos los assets, ejemplos, templates, confirmaciones anti-sobrescritura y la lógica
  actual de constitution, policies y DoD por etapa.
- Mantener consistente la integración de `sddf-init`, las referencias de ayuda y el inventario de evals.

**Non-Goals:**

- Mantener una carpeta, alias o invocación compatible llamada `project-policies-generation`.
- Cambiar el contrato funcional vigente de constitution en la raíz de `docs/` o de los guardrails DoD.
- Crear fixtures de eval nuevos para el skill: se conserva su exención temporal, con el identificador
  actualizado.
- Podar copias antiguas ya instaladas fuera de `skills/`, ni reescribir CHANGELOG o specs cerradas.

## Decisions

### D-01 — Transferir el árbol fuente completo y definir una sola identidad pública

// satisface: AC-1, CNF-02

El directorio completo se trasladará de `skills/project-policies-generation/` a
`skills/sddf-constitution/`, preservando `SKILL.md`, el README actualmente no trackeado, los siete
assets y los dos ejemplos. No se regenerarán ni se alterarán los templates y ejemplos que no contienen
el identificador retirado.

`SKILL.md` adoptará `sddf-constitution` en su nombre, título, descripción e invocación manual. Al
editar su frontmatter se retirará la clave `triggers`, que el guardrail de creación de skills declara
metadato no admitido; las frases de descubrimiento útiles, incluido `sddf-constitution`, permanecerán
en `description`. Así no queda un trigger ni un alias público para el nombre anterior.

Alternativas descartadas:

- Conservar un directorio puente con el nombre anterior: contradice la ubicación canónica única y el
  non-goal de no mantener alias.
- Copiar los assets a un skill nuevo: arriesga divergencia y perdería el README no trackeado.

### D-02 — Migrar solo las superficies operativas que recomiendan o resuelven el skill

// satisface: AC-2, CNF-01

Se actualizarán en una sola unidad de cambio los consumidores que presentan, invocan o validan el
identificador del skill:

| Superficie | Contrato posterior al cambio |
|---|---|
| `skills/sddf-init/SKILL.md` y su README | Pregunta, composición inline, siguiente paso e informes `[OMITIDO]` nombran `sddf-constitution`. |
| `skills/sddf-init/evals/evals.json` | TC-006 espera el literal nuevo del informe minimal. |
| `skills/story-design/SKILL.md` | Los avisos de ausencia de constitution o DoD recomiendan `/sddf-constitution`. |
| `README.md`, guía de comandos y README de guardrails | La documentación de uso publica solo el nuevo comando. |
| `config/eval-exemptions.json` | La exención temporal se asocia a `sddf-constitution`, evitando una exención huérfana y un skill nuevo sin declaración. |

No se introducen nuevos comportamientos de inicialización ni nuevas policies; las referencias solo
resuelven el nuevo nombre del mismo workflow.

### D-03 — Usar una allowlist explícita para preservar trazabilidad histórica

// satisface: AC-2, CNF-01

La verificación de referencias retiradas será acotada a las superficies operativas de D-02 y al árbol
renombrado. No se exigirá una búsqueda global sin coincidencias, porque produciría falsos fallos en el
historial que debe conservarse.

La allowlist histórica incluye `CHANGELOG.md`, `docs/specs/**`, y las alusiones al formato heredado
para migración de DoD en `docs/architecture/memory-system.md`,
`skills/memory-system/scripts/dod-story.js` y `test/dod-story.test.js`. Esas menciones no exponen una
invocación ni un alias; describen cómo migrar artefactos creados por versiones anteriores.

### D-04 — Conservar el contrato de distribución y validar desde una instalación limpia

// satisface: AC-1, AC-2, CNF-02

No se modifican `scripts/install.js`, `config/runtimes.json` ni `package.json`: el paquete publica
todo `skills/` y el instalador copia cada entrada fuente de forma genérica. Una instalación limpia
debe contener `sddf-constitution` y no el directorio retirado porque el inventario se deriva de la
fuente actual.

Una reinstalación sobre un runtime existente puede conservar el directorio antiguo, pues el instalador
no poda destinos. Esto se documenta como límite conocido y queda fuera de alcance; no invalida la
fuente canónica ni añade compatibilidad intencional.

La validación combina una inspección de identidad y allowlist con `npm run verify:eval-inventory`,
`npm run test:eval -- sddf-init --dry-run`, `npm run test:installer` y el gate de repositorio. Las
pruebas de instalación ya comparan el inventario fuente con cada runtime, por lo que cubren la
distribución del directorio renombrado sin una aserción nominal redundante.

## Risks / Trade-offs

- **Un directorio antiguo persiste en un runtime ya instalado** → no se poda automáticamente; una
  instalación nueva obtiene la fuente correcta y la limpieza se tratará como operación explícita.
- **Una búsqueda global encuentra el nombre retirado y se interpreta como alias activo** → la
  validación separa las superficies operativas de la allowlist histórica documentada en D-03.
- **La exención de evals queda con el nombre anterior** → se migra en la misma tarea que el árbol;
  `verify:eval-inventory` detecta tanto la exención huérfana como el skill sin cobertura declarada.
- **El README no trackeado se pierde durante el cambio de directorio** → la operación mueve el árbol
  completo, no una selección de archivos versionados.
- **Se altera el comportamiento de constitution o DoD mientras se cambia el nombre** → los assets y
  el cuerpo funcional se preservan; los casos de prueba inspeccionan que siguen presentes los
  templates, ejemplos y protecciones declaradas.

## Open Questions

No hay decisiones bloqueantes para implementar el renombre.

### CR-001 — Inconsistencia preexistente del estado de PLAN

`dod-story-plan.md` declara la transición `PLAN/IN-PROGRESS` a `PLAN/DONE`, mientras que el pipeline
`story-plan`/`story-analyze` declara como salida `READY-FOR-IMPLEMENT/DONE`. Esta historia no cambia
la máquina de estados; se registra como inconsistencia transversal preexistente para una historia de
workflow posterior. El análisis de este plan evaluará los criterios del DoD sin afirmar que resuelve
esa discrepancia.

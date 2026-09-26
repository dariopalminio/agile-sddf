# sddf-constitution

Genera y mantiene los documentos de gobernanza y los guardrails de transición de historias de un proyecto SDDF.

## What it does

- Crea o actualiza `$SPECS_BASE/constitution.md` a partir de su template.
- Crea, solo si faltan, los guardrails DoD de story por etapa: `specify`, `plan`, `implement`, `code-review`, `verify` y `acceptance`.
- Puede auto-completar la constitución y añadir criterios de testing detectados al DoD de `implement`.
- Crea `policies/README.md` cuando no existe y registra la constitución en `CLAUDE.md` o `AGENTS.md`.
- Ofrece migrar una constitución heredada desde `policies/constitution.md`.

Nunca sobrescribe un guardrail DoD existente. Si detecta un DoD heredado monolítico, conserva su contenido y recomienda migrarlo con `memory-system`.

## When to use

Úsalo al inicializar las políticas de un proyecto SDDF, al actualizar la constitución, al crear o completar el Definition of Done por etapa, o cuando necesites alinear las reglas y criterios de calidad que usan los agentes.

También se ejecuta desde `/sddf-init` cuando, durante una inicialización `standard` o `full`, se acepta crear los documentos de políticas.

## Invocation modes

| Modo | Invocación | Comportamiento |
|---|---|---|
| Manual | `/sddf-constitution` | Interactivo: pide las decisiones necesarias antes de modificar una constitución existente y permite auto-completarla o crearla desde el template. |
| Automático | Invocado por `/sddf-init` | Genera el resultado como parte del bootstrap, sin una interacción adicional con este skill. |
| Migración heredada | Detectada durante la ejecución | Si existe un DoD monolítico, no crea plantillas encima; indica ejecutar `/memory-system migrate --from=dod-monolithic`. |

El skill no recibe flags propios. Las decisiones de creación y actualización se resuelven de forma interactiva.

## Input

| Entrada | Uso |
|---|---|
| `$SPECS_BASE` | Raíz de artefactos resuelta mediante `SDDF_ROOT`, `sddf.config.yaml.root` o `docs/`. |
| `assets/project-constitution-template.md` | Template de la constitución. |
| `assets/dod-story/` | Seis plantillas fuente para los guardrails DoD por etapa. |
| Archivos del proyecto | En modo auto-completar, se analizan archivos como `package.json`, configuración de testing, CI y documentación de agentes para completar criterios pertinentes. |
| `CLAUDE.md` o `AGENTS.md` | Punto de entrada donde se registra la referencia a la constitución. |
| `sddf.config.yaml` | Puede definir un slug alternativo para el guardrail de una etapa. |

## Usage

```
# Crear o actualizar las políticas de forma interactiva
/sddf-constitution

# Ejecutar el bootstrap estándar y aceptar la pregunta de políticas
/sddf-init

# Conservar y dividir un DoD heredado monolítico
/memory-system migrate --from=dod-monolithic
```

Al crear una constitución o un DoD por primera vez, elige entre auto-completarlo con el contexto detectado del proyecto o generar las plantillas en blanco. Revisa y completa manualmente los valores marcados como `[TBD]`.

## Output

- `$SPECS_BASE/constitution.md` y `$SPECS_BASE/policies/README.md`.
- Los guardrails `$SPECS_BASE/guardrails/dod-story-{specify,plan,implement,code-review,verify,acceptance}.md`, o los slugs configurados para esas etapas.
- Una referencia `@` a la constitución en `CLAUDE.md` o `AGENTS.md`, cuando se puede insertar de forma segura; los DoD no se importan globalmente para que cada skill cargue solo su propia etapa.
- Un resumen que informa archivos creados, preservados, actualizados, omitidos o pendientes de migración.

Los archivos Markdown generados se guardan en UTF-8 sin BOM.

---
name: reverse-engineering
description: >-
  Extrae stakeholders y requisitos fragmentados desde un repositorio existente.
  Lanza cuatro análisis, sintetiza una propuesta y materializa archivos trazables.
---

## Objetivo

Coordina cuatro análisis del código fuente y una síntesis posterior para producir perfiles y requisitos verificables. El análisis no requiere una visión previa.

## Entrada

- Repositorio objetivo o `--focus <ruta>`.
- `--update` para enriquecer solo requisitos pendientes de revisión manual.
- Templates de stakeholders y requisito, centralizados o disponibles como seed del skill de discovery.

## Reglas

- Los cuatro agentes de análisis escriben únicamente en `.tmp/reverse-engineering/`.
- El sintetizador escribe una propuesta y `gaps.md`; no materializa capas finales.
- Cada archivo existente que se modifique exige confirmación individual.
- Todo documento escrito debe ser UTF-8 sin BOM.

## Fase 0 — Resolver contexto, templates e inventario

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve `$SPECS_BASE` con la precedencia `SDDF_ROOT` válida → `sddf.config.yaml.root` válida → `docs`. Una fuente explícita inválida detiene el flujo sin escribir.

Comprueba, con rutas relativas al directorio de este skill, que existen los cinco subagentes locales: `assets/agents/architect.md`, `assets/agents/product-discovery.md`, `assets/agents/business-analyst.md`, `assets/agents/ux-flow-mapper.md` y `assets/agents/synthesizer.md`. No se buscan subagentes fuera del directorio de este skill. Si falta alguno, emite una línea por cada archivo ausente y termina sin resolver templates, preguntar, escribir ni crear `.tmp/`:

```
❌ Subagente local no encontrado: assets/agents/<rol>.md (skill reverse-engineering).
Reinstala el skill; no se lanzó ningún análisis.
```

Resuelve `$STAKEHOLDERS_TEMPLATE_PATH` y `$REQUIREMENT_TEMPLATE_PATH`: primero `$SPECS_BASE/templates/`, después `$CLI_ROOT/skills/project-discovery/assets/`.

- Al usar seed, muestra `⚠️ Usando template seed del skill. Ejecuta sddf-init para centralizarlo en $SPECS_BASE/templates/.`.
- Si falta cualquiera: `❌ Template <nombre> no encontrado. Ejecuta sddf-init.` y termina sin escribir.

Localiza `$CLI_ROOT/skills/project-discovery/references/layer-materialization.md`, calcula el inventario y `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US` según esa referencia, y define `$STAKEHOLDERS_PATH = $SPECS_BASE/product/stakeholders.md`. Con inventario vacío, el primer destino previsto es `product/stakeholders.md` y el primer requisito funcional es `requirements/functional/FR-001-<slug>.md`.

En modo normal con inventario vacío, continúa sin preguntas. Con inventario no vacío, muestra `⚠️ Ya existen <n> requisitos; los nuevos se numerarán desde <FR-…>/<NFR-…>. Usa --update para un análisis incremental.` y pregunta `Continuar` o `Cancelar` antes de escribir.

Con inventario vacío, muestra el plan inicial antes de los análisis:

```
Destino de stakeholders: product/stakeholders.md
Primer requisito funcional: requirements/functional/FR-001-<slug>.md
Primer requisito no funcional: requirements/non-functional/NFR-001-<slug>.md
```

En `--update`, propone `create` solo si ningún requisito cubre el mismo comportamiento observable ni la misma `Fuente`; solo propone `modify` para requisitos que contienen `<!-- PENDING MANUAL REVIEW -->`.

## Fase 1 — Análisis paralelo

Define `$TARGET_PATH` como la raíz del repositorio objetivo o el valor de `--focus`. Borra solo los cuatro intermedios `.tmp/reverse-engineering/rfc-*.md` de una ejecución anterior; `proposal/` y `gaps.md` los regenera el sintetizador.

Para cada analizador local (`assets/agents/architect.md`, `assets/agents/product-discovery.md`, `assets/agents/business-analyst.md` y `assets/agents/ux-flow-mapper.md`), la sesión orquestadora lee el archivo y lanza un subagente genérico (`general-purpose` en Claude Code) cuyo prompt es el contenido íntegro del archivo más este bloque de contexto, sin el contexto de la sesión:

```
$TARGET_PATH: <raíz del repositorio objetivo o valor de --focus>
$REQUIREMENT_TEMPLATE_PATH: <ruta resuelta en Fase 0>
```

Antes de lanzarlos, muestra una línea por analizador con la forma `▶ Subagente local assets/agents/<rol>.md → <intermedio>`; por ejemplo:

```
▶ Subagente local assets/agents/architect.md → .tmp/reverse-engineering/rfc-architecture.md
```

Lanza los cuatro en el mismo turno para que corran en paralelo. Cada uno escribe la ruta declarada en su `output:` y devuelve el control:

| Subagente local | Intermedio |
|---|---|
| `architect` | `.tmp/reverse-engineering/rfc-architecture.md` |
| `product-discovery` | `.tmp/reverse-engineering/rfc-features.md` |
| `business-analyst` | `.tmp/reverse-engineering/rfc-business-rules.md` |
| `ux-flow-mapper` | `.tmp/reverse-engineering/rfc-navigation.md` |

Si el runtime no ofrece una herramienta para lanzar subagentes, la sesión ejecuta cada archivo en sí misma, uno tras otro, con el mismo bloque de contexto y las mismas rutas de salida.

Al terminar, comprueba que existe el `output:` de cada analizador. Si falta alguno, muestra `⚠️ <rol> no produjo <ruta>; la síntesis continúa con los intermedios disponibles.` y continúa.

## Fase 2 — Síntesis

Define `$STAGING_DIR = .tmp/reverse-engineering/proposal/`, muestra `▶ Subagente local assets/agents/synthesizer.md → .tmp/reverse-engineering/proposal/`, lee `assets/agents/synthesizer.md` y lánzalo del mismo modo que los analizadores (subagente genérico o, sin esa herramienta, ejecución en la sesión), con un bloque de contexto que contiene los cuatro intermedios, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$STAKEHOLDERS_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US`, `$UPDATE_MODE` y `$STAGING_DIR`.

El sintetizador deja la propuesta, `manifest.md` y `.tmp/reverse-engineering/gaps.md`.

## Fase 3 — Materialización e informe

Aplica `layer-materialization.md` sin gate global: valida, reclasifica, solicita `Sobrescribir <ID>` o `Conservar` para cada `modify`, escribe los destinos aprobados e informa creados, sobrescritos, conservados y descartados.

Si stakeholders es nuevo o está en `TODO`, déjalo con `substatus: IN-PROGRESS` porque el contenido inferido requiere revisión humana. Informa los requisitos con `PENDING MANUAL REVIEW` y un resumen de `gaps.md`, y repite los avisos `⚠️ <rol> no produjo <ruta>` emitidos en Fase 1.

## Salida

- `$SPECS_BASE/product/stakeholders.md`.
- `$SPECS_BASE/requirements/functional/FR-NNN-<slug>.md`.
- `$SPECS_BASE/requirements/non-functional/NFR-NNN-<slug>.md`.
- `.tmp/reverse-engineering/gaps.md` y propuesta preservada para auditoría.

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

Lanza, desde la sesión orquestadora, `reverse-engineer-architect`, `reverse-engineer-product-discovery`, `reverse-engineer-business-analyst` y `reverse-engineer-ux-flow-mapper`. Cada uno recibe la ruta objetivo y escribe su resultado en `.tmp/reverse-engineering/rfc-*.md`. Pásales `$REQUIREMENT_TEMPLATE_PATH` cuando necesiten el contrato de requisito.

## Fase 2 — Síntesis

Define `$STAGING_DIR = .tmp/reverse-engineering/proposal/` e invoca al sintetizador con los cuatro intermedios, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$STAKEHOLDERS_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US`, `$UPDATE_MODE` y `$STAGING_DIR`.

El sintetizador deja la propuesta, `manifest.md` y `.tmp/reverse-engineering/gaps.md`.

## Fase 3 — Materialización e informe

Aplica `layer-materialization.md` sin gate global: valida, reclasifica, solicita `Sobrescribir <ID>` o `Conservar` para cada `modify`, escribe los destinos aprobados e informa creados, sobrescritos, conservados y descartados.

Si stakeholders es nuevo o está en `TODO`, déjalo con `substatus: IN-PROGRESS` porque el contenido inferido requiere revisión humana. Informa los requisitos con `PENDING MANUAL REVIEW` y un resumen de `gaps.md`.

## Salida

- `$SPECS_BASE/product/stakeholders.md`.
- `$SPECS_BASE/requirements/functional/FR-NNN-<slug>.md`.
- `$SPECS_BASE/requirements/non-functional/NFR-NNN-<slug>.md`.
- `.tmp/reverse-engineering/gaps.md` y propuesta preservada para auditoría.

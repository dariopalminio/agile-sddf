---
name: project-discovery
description: >-
  Descubre usuarios y requisitos desde una visión terminada, proponiendo
  product/stakeholders.md y un archivo por requisito funcional y no funcional.
  Úsalo para iniciar la especificación de requisitos tras project-begin.
---

## Objetivo

Convierte una visión confirmada en perfiles de usuario y requisitos trazables. El resultado se propone en staging y solo se materializa tras la confirmación explícita del usuario.

## Entrada

- `$SPECS_BASE/product/vision.md`, con `substatus: DONE`.
- Templates `stakeholders-template.md` y `requirement-template.md`, preferentemente en `$SPECS_BASE/templates/`.
- `$SPECS_BASE/product/stakeholders.md` y `$SPECS_BASE/requirements/`, opcionales.

## Precondiciones

- La visión debe existir y estar en `DONE`.
- Antes de activar esta historia, verificar WIP=1 del nivel correspondiente.
- No se escribe en `$SPECS_BASE` antes del gate global.

## Dependencias

- Agentes `project-pm`, `project-ux` y `project-architect`, invocados secuencialmente por esta sesión.
- `references/layer-materialization.md`, que define inventario, validación y escrituras.

## Restricciones

- Los templates se leen, nunca se escriben.
- La propuesta vive exclusivamente en `.tmp/project-discovery/proposal/`.
- Los documentos materializados se guardan en UTF-8 sin BOM.
- Los agentes reciben rutas ya resueltas; ninguno resuelve la raíz ni delega en otro agente.

## Flujo

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

1. Si `SDDF_ROOT` está definida, debe ser un directorio accesible; úsala como `$SPECS_BASE`.
2. Si no está definida, lee `sddf.config.yaml`; si `root` existe, debe resolver a un directorio accesible relativo al repositorio.
3. Sin una fuente explícita, usa `docs` relativo al repositorio.
4. Si una fuente explícita es inválida, informa el valor y termina sin escribir.

### Paso 1 — Validar visión

Define `$VISION_PATH = $SPECS_BASE/product/vision.md`.

- Si no existe: `❌ La visión del producto no está terminada ($VISION_PATH no existe). Ejecuta primero /project-begin.` y termina sin escribir en `product/`, `requirements/` ni `.tmp/`.
- Si `substatus` no es `DONE` o está ausente: `❌ La visión del producto no está terminada ($VISION_PATH: substatus <valor>). Ejecuta primero /project-begin.` y termina con las mismas garantías.
- Solo con `substatus: DONE` continúa.

### Paso 2 — Resolver templates

Para cada template, intenta primero `$SPECS_BASE/templates/<nombre>` y luego `assets/<nombre>` del skill.

- Al usar un seed: `⚠️ Usando template seed <nombre> del skill. Ejecuta sddf-init para centralizarlo en $SPECS_BASE/templates/.`.
- Si no existe central ni seed: `❌ Template <nombre> no encontrado. Ejecuta sddf-init.` y termina sin escribir.

Registra `$STAKEHOLDERS_TEMPLATE_PATH` y `$REQUIREMENT_TEMPLATE_PATH`.

### Paso 3 — Inventario y staging

Aplica `references/layer-materialization.md` para obtener `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR` y `$NEXT_US`. Define `$STAKEHOLDERS_PATH = $SPECS_BASE/product/stakeholders.md` y limpia `$STAGING_DIR = .tmp/project-discovery/proposal/` antes de delegar.

### Paso 4 — Discovery de producto

Invoca a `project-pm` en estado Discovery con `$VISION_PATH`, `$STAKEHOLDERS_PATH` y `$OUTPUT_PATH = .tmp/project-discovery/discovery-summary.md`. El agente escribe solo el resumen y no invoca otros agentes.

### Paso 5 — Hallazgos UX

Invoca a `project-ux` con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH` y `$OUTPUT_PATH = .tmp/project-discovery/ux-findings.md`.

### Paso 6 — Propuesta de requisitos

Invoca a `project-architect` en estado Discovery con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH`, `$UX_FINDINGS_PATH`, `$STAKEHOLDERS_PATH`, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US` y `$STAGING_DIR`.

El agente deja `manifest.md` y los archivos propuestos en staging. Si cualquier agente falla o falta el manifiesto, informa el fallo, recomienda reejecutar y termina sin tocar `$SPECS_BASE`.

### Paso 7 — Gate global

Valida la propuesta con la referencia y muestra los perfiles bajo `Usuarios y roles` y cada requisito `ID — título`, clasificado como `nuevo` o `modifica`. Pregunta `Confirmar` o `Cancelar`.

- `Confirmar` habilita la materialización.
- `Cancelar` o falta de respuesta termina sin escribir en `$SPECS_BASE`.

### Paso 8 — Materializar y cerrar

Aplica los pasos 1–6 de `references/layer-materialization.md` con el gate ya aprobado. Para cada destino `modify`, ofrece `Sobrescribir <ID>` o `Conservar`; sin respuesta conserva el existente. Al completar, deja `stakeholders.md` en `substatus: DONE` y actualiza `updated`.

Para una retoma, recalcula siempre el inventario; si stakeholders está en `IN-PROGRESS`, completa solo las secciones que aún contienen `[Por completar`.

Informa: `✅ Discovery completo: <n> perfiles en $SPECS_BASE/product/stakeholders.md · <x> FR y <y> NFR en $SPECS_BASE/requirements/ · Siguiente comando: /project-planning`.

## Salida

- `$SPECS_BASE/product/stakeholders.md`.
- `$SPECS_BASE/requirements/functional/FR-NNN-<slug>.md`.
- `$SPECS_BASE/requirements/non-functional/NFR-NNN-<slug>.md`.
- Propuesta auditable en `.tmp/project-discovery/proposal/`.

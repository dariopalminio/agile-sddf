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

- `docs/product/vision.md`, con `substatus: DONE`.
- Templates `stakeholders-template.md` y `requirement-template.md`, preferentemente en `docs/templates/`.
- `docs/product/stakeholders.md` y `docs/requirements/`, opcionales.

## Precondiciones

- La visión debe existir y estar en `DONE`.
- Antes de activar esta historia, verificar WIP=1 del nivel correspondiente.
- No se escribe en `docs/` antes del gate global.

## Dependencias

- Roles locales `assets/agents/discovery-pm.md`, `assets/agents/discovery-architect.md` y `assets/agents/discovery-ux.md` (los lee esta sesión).
- `references/layer-materialization.md`, que define inventario, validación y escrituras.

## Restricciones

- Los templates se leen, nunca se escriben.
- La propuesta vive exclusivamente en `.tmp/project-discovery/proposal/`.
- Los documentos materializados se guardan en UTF-8 sin BOM.
- Los roles reciben rutas ya resueltas; ninguno resuelve la raíz ni lanza subagentes.

## Flujo

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

Con `REPO_ROOT` resuelto, comprueba que existen los roles locales de este skill (rutas relativas al directorio del skill):

- `assets/agents/discovery-pm.md`
- `assets/agents/discovery-architect.md`
- `assets/agents/discovery-ux.md`

Si falta alguno, muestra el siguiente mensaje con la ruta del rol ausente (una línea por cada rol que falte) y termina sin validar la visión, limpiar `.tmp/project-discovery/proposal/`, preguntar ni escribir; no se buscan roles fuera del directorio de este skill:

> ❌ Rol local no encontrado: assets/agents/discovery-pm.md (skill project-discovery). Reinstala el skill; no se modificó ningún archivo.
>
> ❌ Rol local no encontrado: assets/agents/discovery-architect.md (skill project-discovery). Reinstala el skill; no se modificó ningún archivo.
>
> ❌ Rol local no encontrado: assets/agents/discovery-ux.md (skill project-discovery). Reinstala el skill; no se modificó ningún archivo.

### Paso 1 — Validar visión

Define `$VISION_PATH = docs/product/vision.md`.

- Si no existe: `❌ La visión del producto no está terminada ($VISION_PATH no existe). Ejecuta primero /project-begin.` y termina sin escribir en `product/`, `requirements/` ni `.tmp/`.
- Si `substatus` no es `DONE` o está ausente: `❌ La visión del producto no está terminada ($VISION_PATH: substatus <valor>). Ejecuta primero /project-begin.` y termina con las mismas garantías.
- Solo con `substatus: DONE` continúa.

### Paso 2 — Resolver templates

Para cada template, intenta primero `docs/templates/<nombre>` y luego `assets/<nombre>` del skill.

- Al usar un seed: `⚠️ Usando template seed <nombre> del skill. Ejecuta sddf-init para centralizarlo en docs/templates/.`.
- Si no existe central ni seed: `❌ Template <nombre> no encontrado. Ejecuta sddf-init.` y termina sin escribir.

Registra `$STAKEHOLDERS_TEMPLATE_PATH` y `$REQUIREMENT_TEMPLATE_PATH`.

### Paso 3 — Inventario y staging

Aplica `references/layer-materialization.md` para obtener `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR` y `$NEXT_US`. Define `$STAKEHOLDERS_PATH = docs/product/stakeholders.md` y limpia `$STAGING_DIR = .tmp/project-discovery/proposal/` antes de delegar.

### Paso 4 — Discovery de producto

Define `$DISCOVERY_SUMMARY_PATH = .tmp/project-discovery/discovery-summary.md`. Muestra:

> 📋 Rol local: assets/agents/discovery-pm.md — conduce esta sesión, sin subagente.

Luego lee `assets/agents/discovery-pm.md` y sigue su `## Estado Discovery` con `$VISION_PATH`, `$STAKEHOLDERS_PATH` y `$OUTPUT_PATH = $DISCOVERY_SUMMARY_PATH`. Esta sesión conduce la entrevista; no lances un subagente para este paso. El rol escribe solo el resumen y no lanza subagentes.

### Paso 5 — Hallazgos UX con el rol `discovery-ux`

Muestra:

> 📋 Rol local: assets/agents/discovery-ux.md — conduce esta sesión, sin subagente.

Luego lee `assets/agents/discovery-ux.md` y sigue sus instrucciones con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH` y `$OUTPUT_PATH = $UX_FINDINGS_PATH = .tmp/project-discovery/ux-findings.md`, refinando con el usuario perfiles, journeys y navegación. Esta sesión conduce el refinamiento UX con el usuario; no lances un subagente para este paso.

### Paso 6 — Propuesta de requisitos con el rol `discovery-architect`

Muestra:

> 📋 Rol local: assets/agents/discovery-architect.md — conduce esta sesión, sin subagente.

Luego lee `assets/agents/discovery-architect.md` y sigue su `## Estado Discovery` con `$VISION_PATH`, `$DISCOVERY_SUMMARY_PATH`, `$UX_FINDINGS_PATH`, `$STAKEHOLDERS_PATH`, `$STAKEHOLDERS_TEMPLATE_PATH`, `$REQUIREMENT_TEMPLATE_PATH`, `$REQUIREMENTS_INVENTORY`, `$NEXT_FR`, `$NEXT_NFR`, `$NEXT_US` y `$STAGING_DIR`. Esta sesión redacta la propuesta; no lances un subagente para este paso.

El rol deja `manifest.md` y los archivos propuestos en staging. Si algún rol falla o falta el manifiesto, informa el fallo, recomienda reejecutar y termina sin tocar `docs/`.

### Paso 7 — Gate global

Valida la propuesta con la referencia y muestra los perfiles bajo `Usuarios y roles` y cada requisito `ID — título`, clasificado como `nuevo` o `modifica`. Pregunta `Confirmar` o `Cancelar`.

- `Confirmar` habilita la materialización.
- `Cancelar` o falta de respuesta termina sin escribir en `docs/`.

### Paso 8 — Materializar y cerrar

Aplica los pasos 1–6 de `references/layer-materialization.md` con el gate ya aprobado. Para cada destino `modify`, ofrece `Sobrescribir <ID>` o `Conservar`; sin respuesta conserva el existente. Al completar, deja `stakeholders.md` en `substatus: DONE` y actualiza `updated`.

Para una retoma, recalcula siempre el inventario; si stakeholders está en `IN-PROGRESS`, completa solo las secciones que aún contienen `[Por completar`.

Informa: `✅ Discovery completo: <n> perfiles en docs/product/stakeholders.md · <x> FR y <y> NFR en docs/requirements/ · Siguiente comando: /project-planning`.

## Salida

- `docs/product/stakeholders.md`.
- `docs/requirements/functional/FR-NNN-<slug>.md`.
- `docs/requirements/non-functional/NFR-NNN-<slug>.md`.
- Propuesta auditable en `.tmp/project-discovery/proposal/`.

---
alwaysApply: false
type: design
id: STORY-149
slug: STORY-149-sddf-init-crea-el-nuevo-layout-design
title: "Design: sddf-init crea el nuevo layout"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-149
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-149-sddf-init-crea-el-nuevo-layout
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-149-sddf-init-crea-el-nuevo-layout]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra el skill `sddf-init` del contrato de raíz configurable (`SDDF-ROOT-RESOLUTION: v1`, ADR-0010) al **contrato de layout fijo** (ADR-0016 de STORY-147, gate de STORY-148): crea `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` en `REPO_ROOT`, deja de escribir la clave `root` y, ante el layout legado `docs/specs/`, avisa sin crear estructura paralela.

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `skills/sddf-init/SKILL.md` | Paso 1 con bloque `<!-- SDDF-ROOT-RESOLUTION: v1 -->` (precedencia `SDDF_ROOT` → `root` → `docs`, excepción de bootstrap para `root` relativo inexistente). Paso 2 crea `SPECS_BASE/specs/epics/`, `specs/stories/`, `templates/`. Paso 2b copia 6 templates a `SPECS_BASE/templates/`. Paso 3 copia `sddf.config.yaml.template`. Paso 4 genera `.env.template` con comentarios sobre `SDDF_ROOT`. Paso 5 pregunta por `sddf-constitution` (`$SPECS_BASE/constitution.md`). Paso 5b compone `memory-system scaffold --yes` «que resuelve la misma `SPECS_BASE`». Paso 6 informa con rutas `{SPECS_BASE}/…` y cierra con `✓ Entorno SDDF inicializado correctamente en {SPECS_BASE}/`. |
| `skills/sddf-init/assets/sddf.config.yaml.template` y `.example` | Ambos: comentario `# Raíz versionada … SDDF_ROOT solo la sobrescribe si es válido.`, clave `root: docs` y comentario `… guardrail en $SPECS_BASE/guardrails/<slug>.md.` en la sección `guardrails`. |
| `skills/sddf-init/README.md` | Tabla de entrada con filas `SDDF_ROOT` y `sddf.config.yaml.root`; salida `$SPECS_BASE/specs/epics/`. |
| `skills/sddf-init/evals/evals.json` | v2.2.0, 10 casos. TC-001 exige `root: docs`; TC-002 prueba `root: docs-personalizada`; TC-003 y TC-004 prueban `SDDF_ROOT`; TC-005–TC-010 nombran `SDDF_ROOT` en el contexto. |
| Inventario de AC-4 | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/sddf-init/` coincide en los 5 archivos (coincide con la nota de la historia). |
| `scripts/audit-root-resolution.js` (gate actual) | Exige `root:` no vacío en ambos assets de `sddf-init`. STORY-148 (D-5) retira ese chequeo y elimina el script. Ver CR-001. |
| `scripts/verify-fixed-layout.js` (STORY-148, aún no implementado) | Diseñado con `PENDING_MIGRATION` (los 36 skills, incluido `sddf-init`), marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, tokens `REPO_ROOT`, `specs/flow/`, `docs/templates/`, `docs/guardrails/` (R2), prohibición de `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE`, `SDDF_ROOT` (R3) y de líneas con `root` + `sddf.config.yaml` (R4). |
| `skills/memory-system/SKILL.md:502-503` | `scaffold` crea `specs/epics/` y `specs/stories/` bajo su raíz (`docs/` por defecto) con `.gitkeep`. Su migración es de STORY-152. Ver CR-002. |
| Consumidores de los assets | `config/profiles.json:56` (perfil `core` usa el template como base), `scripts/verify-config-contract.js:87` (valida `required:`/comandos del template) y `test/profile-contract.test.js:40` (copia el template). Ninguno lee `root`. |
| Pruebas que leen `sddf-init` | `test/sddf-constitution.test.js` E2E-002 (SKILL.md, README.md y evals.json deben nombrar `sddf-constitution`) y EV-002 (TC-006 debe exigir `[OMITIDO] sddf-constitution (nivel minimal)`). |
| `docs/guides/artifact-directory-migration.md` | Existe (migración 4.0.0). La sección del layout fijo la añade STORY-154. |
| Convenciones | Informe `[CREADO]`/`[YA EXISTÍA]`/`[OMITIDO]`/`[INFO]`/`[WARNING]`; `.gitkeep` solo al crear el directorio (patrón de `memory-system scaffold`); pruebas `node:test` + `node:assert/strict` leyendo archivos del repo (`test/sddf-constitution.test.js`). |

Stakeholders: el practitioner que inicializa SDDF en un proyecto nuevo o legado; las historias de migración siguientes (STORY-152 para `memory-system`, STORY-154 para la guía) y STORY-157, que verifica `PENDING_MIGRATION` vacía.

## Goals / Non-Goals

**Goals:**
- `/sddf-init` resuelve solo `REPO_ROOT` y crea el layout fijo `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/`, cada uno con `.gitkeep` // satisface: AC-1
- Los templates se copian a `docs/templates/` (ruta literal) // satisface: AC-1
- Los assets de configuración dejan de declarar `root` y de nombrar `SPECS_BASE`/`SDDF_ROOT` // satisface: AC-1, AC-4
- Detección del layout legado (`docs/specs/`) con aviso de deprecación y sin escrituras // satisface: AC-2, CNF-1
- Re-ejecución idempotente sobre el layout fijo con informe explícito de «layout ya existe» // satisface: AC-3
- `skills/sddf-init/` sin coincidencias de `SPECS_BASE|SDDF_ROOT`, con el bloque del contrato de layout fijo y fuera de `PENDING_MIGRATION` // satisface: AC-4, CNF-3
- Evals reescritos: cubren AC-1 y AC-2; retiran los casos de `SDDF_ROOT` y `root` // satisface: CNF-2

**Non-Goals:**
- Migrar `docs/specs/` a `specs/flow/` en proyectos instalados (Non-Goal de la historia; STORY-153 migra solo este repo)
- Contenido de `workflow/` y `specs/living/` más allá de crear los directorios (épicas de Workflow y Living Spec)
- Redactar la sección de migración en `docs/guides/artifact-directory-migration.md` (STORY-154)
- Migrar `memory-system` para que su scaffold use `specs/flow/` (STORY-152, CR-002)
- Diagnosticar una clave `root` heredada en el `sddf.config.yaml` de un proyecto: `sddf-init` no lee esa clave (CS-3); el diagnóstico es de `skill-preflight` (STORY-152)
- Retirar `root: docs` del `sddf.config.yaml` de este repositorio (aplicación incremental de ADR-0016 hasta STORY-153)
- Validar copias instaladas en destinos de runtime (salida de `agile-sddf install`)

## Decisions

### D-1 — Paso 1: contrato de layout fijo en lugar de la resolución de raíz // satisface: AC-4, CNF-3

El Paso 1 de `skills/sddf-init/SKILL.md` reemplaza el bloque `SDDF-ROOT-RESOLUTION: v1` por el bloque canónico de STORY-148 (D-1), adaptado al número de paso:

| Elemento | Contrato |
|---|---|
| Marcador | línea exacta `<!-- SDDF-FIXED-LAYOUT: v1 -->` bajo `### Paso 1 — Resolver contexto local` |
| Bloque (hasta el siguiente encabezado) | nombra `REPO_ROOT`, `specs/flow/`, `docs/templates/` y `docs/guardrails/`, y declara que el layout no es configurable (ADR-0016) |
| `CLI_ROOT` | se conserva: se resuelve independientemente y solo para copiar templates y componer `memory-system`; nunca se deriva del layout |
| Retiros | toda mención a `SDDF_ROOT`, `SPECS_BASE`, precedencia de raíces, excepción de bootstrap de `root` relativo y la regla «Una fuente de raíz explícita inválida detiene el bootstrap» de `## Restricciones / Reglas` |

El resto del `SKILL.md` usa rutas literales relativas a `REPO_ROOT` (`specs/flow/`, `docs/templates/`, `docs/constitution.md`, `docs/guardrails/dod-story-<etapa>.md`). Ninguna línea combina `root` y `sddf.config.yaml` (R4 de STORY-148).

**Alternativas rechazadas:**
- **Mantener la resolución y solo cambiar el valor por defecto:** contradice ADR-0016 y AC-4 (el grep debe quedar vacío).
- **Variable nueva para la raíz del layout (p. ej. `LAYOUT_ROOT`):** reintroduce la configurabilidad que la épica retira; las rutas son literales.

### D-2 — Detección del layout antes de escribir // satisface: AC-1, AC-2, AC-3, CNF-1

Nuevo **Paso 1b — Detectar el layout** (tras la validación de `--level` y antes de cualquier escritura). Comprueba la existencia de `docs/specs/` y `specs/flow/` en `REPO_ROOT`:

| `docs/specs/` | `specs/flow/` | Estado | Acción |
|---|---|---|---|
| no | no | **limpio** | continúa: el Paso 2 crea el layout fijo // AC-1 |
| no | sí | **layout fijo** | continúa: el Paso 2 solo crea lo que falte // AC-3 |
| sí | no | **legado** | emite el aviso de D-5 y **termina sin escribir nada** // AC-2, CNF-1 |
| sí | sí | **mixto** | emite el aviso de D-5 y continúa como **layout fijo**; `docs/specs/` no se toca // AC-2, AC-3 |

La comprobación es de existencia de directorio; no lee `sddf.config.yaml` ni su contenido.

**Alternativas rechazadas:**
- **Legado: avisar y continuar con templates, configuración y políticas (omitiendo solo los Pasos 2 y 5b):** dos omisiones condicionales repartidas por el protocolo, y escrituras (`docs/templates/`, `sddf.config.yaml`) en un proyecto que debe migrar primero; la épica pide «detectar sin escribir». Tras migrar, una re-ejecución completa todo de forma idempotente.
- **Legado: error `[ERROR]` con salida no cero:** el layout legado es un estado válido de un proyecto instalado (deprecado, no roto); un aviso es la severidad que pide AC-2.
- **Sin estado mixto (tratarlo como legado):** dejaría sin salida a un repo que ya creó `specs/flow/` mientras conserva `docs/specs/` (migración en curso o scaffold de `memory-system` previo a STORY-152, CR-002); su re-ejecución nunca podría completar el layout.

### D-3 — Paso 2: crear el layout fijo // satisface: AC-1, AC-3

Directorios, en este orden, relativos a `REPO_ROOT`:

| Directorio | `.gitkeep` |
|---|---|
| `specs/flow/` | sí, solo si el directorio se crea en esta ejecución |
| `specs/flow/archive/` | sí, ídem |
| `specs/living/` | sí, ídem |
| `workflow/` | sí, ídem |
| `docs/templates/` | no (se llena en el Paso 2b; en `minimal` queda como antes) |

- **No existe:** crear el directorio (y rutas intermedias), crear `.gitkeep` vacío si la tabla lo indica, registrar `[CREADO]  <ruta>`.
- **Existe:** no modificar nada dentro (ni añadir `.gitkeep`), registrar `[YA EXISTÍA]  <ruta>`.
- Si los cuatro directorios del layout (`specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`) ya existían: registrar `[INFO] El layout fijo ya existe — sin cambios en specs/ ni workflow/` // AC-3.
- `docs/specs/` nunca se crea (AC-1); `specs/epics/` y `specs/stories/` dejan de crearse.

Los directorios se crean en todos los niveles (`minimal`, `standard`, `full`).

**Alternativas rechazadas:**
- **`.gitkeep` siempre que falte, también en directorios existentes:** escribe en un layout ya inicializado y contradice «no se sobrescriben archivos en `specs/` ni `workflow/`» y el informe «layout ya existe» de AC-3. Sigue la convención de `memory-system scaffold`.
- **Crear también `specs/flow/EPIC-*`/`STORY-*` de ejemplo:** fuera de alcance; los work items los crean los skills de especificación.

### D-4 — Assets de configuración sin `root` // satisface: AC-1, AC-4

En `assets/sddf.config.yaml.template` y `assets/sddf.config.yaml.example`:

| Línea actual | Cambio |
|---|---|
| `# Raíz versionada de los artefactos SDDF. SDDF_ROOT solo la sobrescribe si es válido.` | eliminar |
| `root: docs` | eliminar |
| `# DoD de historia por etapa (STORY-101): etapa → slug del guardrail en $SPECS_BASE/guardrails/<slug>.md.` | `… slug del guardrail en docs/guardrails/<slug>.md.` |

El resto de ambos archivos queda igual (perfil, `verify`, `implement`, `guardrails`). El Paso 3 sigue copiando el template sin interpretarlo y elimina la frase «ni reemplazar una clave `root` existente»: un `sddf.config.yaml` existente se preserva entero (`[YA EXISTÍA]` + `[INFO] sddf.config.yaml ya existe — se mantiene sin cambios`).

**Alternativas rechazadas:**
- **Conservar `root: docs` comentada como referencia histórica:** vuelve a nombrar la clave retirada y produce coincidencias en greps de auditoría; la historia la documenta la guía de migración.
- **Quitar `root` de un `sddf.config.yaml` existente del proyecto:** `sddf-init` no modifica archivos existentes; la limpieza es de la guía de migración.

### D-5 — Aviso de deprecación del layout legado // satisface: AC-2, CNF-1

Texto (estados **legado** y **mixto**):

```
⚠️ Layout legado detectado: docs/specs/ está deprecado (ADR-0016).
   Guía de migración: docs/guides/artifact-directory-migration.md (paquete agile-sddf)
```

Línea adicional según el estado:
- **legado:** `   No se crea specs/flow/ ni se modifica docs/specs/. Migra y vuelve a ejecutar /sddf-init.` — el skill termina aquí: no hay líneas `[CREADO]`, no se ejecutan los Pasos 2–5b ni el cierre de éxito. El informe consiste en el encabezado `── sddf-init ──`, el aviso y la línea de cierre.
- **mixto:** `   Se continúa con el layout fijo existente; docs/specs/ no se modifica.` — el flujo sigue en el Paso 2.

El aviso no es un `[ERROR]`. En el estado legado el Paso 5b no se alcanza, de modo que `memory-system scaffold` (que hoy escribe bajo `docs/specs/`) tampoco escribe (CNF-1).

**Alternativas rechazadas:**
- **Enlace a la URL pública del repositorio:** depende de una URL/versión externa que no se verifica desde el filesystem; la ruta relativa del paquete es la que pide AC-2.
- **Ofrecer la migración automática:** Non-Goal de la historia.

### D-6 — `.env.template` neutral // satisface: AC-4

El Paso 4 se conserva (idempotencia y evals existentes nombran `.env.template`), con contenido exacto nuevo:

```
# Variables de entorno del proyecto (plantilla).
# SDDF no requiere variables de entorno: el layout de artefactos es fijo (ADR-0016).
```

Un `.env.template` existente no se toca (`[YA EXISTÍA]` + `[INFO] … se mantiene sin cambios`).

**Alternativas rechazadas:**
- **Retirar el Paso 4:** cambia la superficie del informe y de los evals sin aporte para AC-4, y deja a los proyectos sin la plantilla convencional de variables de entorno que hoy reciben.
- **Conservar un comentario que explique que `SDDF_ROOT` fue retirada:** el grep de AC-4 sobre `skills/sddf-init/` coincidiría.

### D-7 — Pasos 5, 5b y 6 con rutas literales // satisface: AC-1, AC-3, AC-4

| Paso | Cambio |
|---|---|
| 5 | La pregunta nombra `docs/constitution.md` y `docs/guardrails/dod-story-<etapa>.md` |
| 5b | «`memory-system` resuelve la misma `SPECS_BASE`» → «`memory-system` usa `docs/` (sin clave `root` en `sddf.config.yaml`)» reformulado sin `root` y `sddf.config.yaml` en la misma línea; «anteponer `{SPECS_BASE}/`» → «anteponer `docs/`». No se alcanza en estado legado (D-5) |
| 6 | Los ejemplos del informe usan rutas literales (`specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`, `docs/templates/…`); se retiran `specs/epics/`/`specs/stories/` |

Cierres del Paso 6:

| Situación | Línea de cierre |
|---|---|
| Se creó al menos un artefacto | `✓ Entorno SDDF inicializado correctamente con el layout fijo` (+ ` (nivel <n>)` con `--level` explícito) |
| Nada se creó | `✓ Entorno ya inicializado — sin cambios necesarios` (sin cambio) |
| Estado legado | `⚠️ Entorno no inicializado: migra el layout legado antes de continuar` |

El prefijo `Entorno SDDF inicializado correctamente` se conserva porque TC-005 y otros casos lo usan como ancla.

**Alternativas rechazadas:**
- **Cierre con la ruta (`… en ./`):** la ruta deja de ser variable; mostrarla no aporta información.

### D-8 — Evals reescritos (v3.0.0) // satisface: CNF-2, AC-1, AC-2, AC-3

`skills/sddf-init/evals/evals.json`: `version: "3.0.0"`, `story: "STORY-149"`, descripción sin `raíz versionada` ni overrides. Ningún campo contiene `SPECS_BASE` ni `SDDF_ROOT` (AC-4).

| ID | Nombre | Acción | Contexto | `contains` | `not_contains` | AC |
|---|---|---|---|---|---|---|
| TC-001 | `bootstrap-limpio-crea-layout-fijo` | reescribir | repo sin `docs/`, `specs/`, `workflow/`, `sddf.config.yaml` ni `.env.template` | `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`, `docs/templates`, `sddf.config.yaml`, `.env.template`, `Entorno SDDF inicializado correctamente` | `root: docs`, `docs/specs`, `[ERROR]` | AC-1 |
| TC-002 | `reejecucion-layout-fijo-idempotente` | reemplaza `root-relativo-…` | layout fijo, templates, config y `.env.template` ya existen; sin `docs/specs/` | `[YA EXISTÍA]`, `El layout fijo ya existe`, `Entorno ya inicializado — sin cambios necesarios` | `[CREADO]`, `[ERROR]` | AC-3 |
| TC-003 | `layout-legado-avisa-sin-escribir` | reemplaza `override-valido-…` | existe `docs/specs/` con épicas e historias; no existe `specs/flow/` | `Layout legado detectado`, `docs/guides/artifact-directory-migration.md`, `No se crea specs/flow/` | `[CREADO]`, `Entorno SDDF inicializado correctamente` | AC-2 |
| TC-004 | `layout-mixto-avisa-y-completa` | reemplaza `fuente-explicita-invalida-…` | existen `docs/specs/` y `specs/flow/`; faltan `specs/living/` y `workflow/` | `Layout legado detectado`, `Se continúa con el layout fijo existente`, `[CREADO]`, `specs/living/` | `[ERROR]` | AC-2, AC-3 |
| TC-005 … TC-010 | sin cambio de intención | actualizar contexto | se retira «SDDF_ROOT no está definida»; «no existen docs» → «repo sin estructura SDDF»; TC-010 declara el layout fijo ya creado y sin `docs/specs/` | TC-006 añade `specs/flow/` | sin cambio | AC-1, AC-3 |

TC-006 conserva el literal `[OMITIDO] sddf-constitution (nivel minimal)` (EV-002 de `test/sddf-constitution.test.js`). Los IDs se reutilizan por posición para no dejar huecos; la versión mayor indica el cambio de semántica.

**Alternativas rechazadas:**
- **IDs nuevos TC-011+ y retirar TC-001–TC-004:** deja huecos y no aporta trazabilidad mayor que la versión `3.0.0` + `story`.
- **Probar la ausencia de `SDDF_ROOT` con `not_contains` en los evals:** el propio literal en `evals.json` rompe AC-4; se verifica con la prueba determinista de D-9.

### D-9 — Prueba determinista `test/sddf-init-layout.test.js` // satisface: AC-4, CNF-2, CNF-3

Prueba `node:test` que lee archivos del repo (patrón de `test/sddf-constitution.test.js`), sin LLM:

| Caso | Verificación | AC |
|---|---|---|
| Sin resolución legada | ningún archivo bajo `skills/sddf-init/` (recursivo) contiene `SPECS_BASE` ni `SDDF_ROOT` | AC-4 |
| Assets sin `root` | ni `sddf.config.yaml.template` ni `.example` tienen una línea `root:` de primer nivel | AC-4 |
| `.env.template` neutral | el bloque del Paso 4 de `SKILL.md` existe y no nombra variables SDDF | AC-4 |
| Contrato de layout | `checkSkillLayout('sddf-init', SKILL.md)` de `scripts/verify-fixed-layout.js` devuelve `[]` y `PENDING_MIGRATION` no incluye `sddf-init` | CNF-3 |
| Layout declarado | `SKILL.md` nombra `specs/flow/archive/`, `specs/living/`, `workflow/`, `.gitkeep` y `docs/guides/artifact-directory-migration.md` | AC-1, AC-2 |
| Evals cubren AC-1 y AC-2 | `evals.json` tiene un caso cuyo `contains` incluye `specs/flow/archive/` y otro que incluye `docs/guides/artifact-directory-migration.md`; versión `3.0.0` | CNF-2 |

**Alternativas rechazadas:**
- **Solo evals LLM:** no deterministas y se ejecutan a criterio humano (`AGENTS.md`); AC-4 es verificable con lectura de archivos.
- **Añadir los chequeos a `verify-fixed-layout.js`:** mezcla un contrato transversal con uno específico de `sddf-init` (P11); además R3 solo cubre `SKILL.md`, no assets/evals/README.

### D-10 — Salida de la lista transitoria del gate // satisface: CNF-3

En `scripts/verify-fixed-layout.js` (creado por STORY-148) se retira `'sddf-init'` de `PENDING_MIGRATION` en el mismo cambio que añade el bloque (F-4 de STORY-148). Si se olvida, el gate falla con `PENDING_MIGRATION: sddf-init ya cumple el contrato — retíralo de la lista`.

### D-11 — README alineado // satisface: AC-4

`skills/sddf-init/README.md`: se retiran las filas `SDDF_ROOT` y `sddf.config.yaml.root` de `## Input`; «bootstrapear una raíz de artefactos declarada» → «crear el layout fijo»; `## Output` lista `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` (con `.gitkeep`) y `docs/templates/`; nueva línea: ante `docs/specs/` avisa, remite a la guía y no escribe. Se conserva la mención a `sddf-constitution` (E2E-002).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Protocolo de `sddf-init` | modificar (Pasos 1, 1b nuevo, 2, 2b, 3, 4, 5, 5b, 6; reglas; descripción) | `skills/sddf-init/SKILL.md` | AC-1, AC-2, AC-3, AC-4, CNF-1, CNF-3 |
| Template de configuración | modificar (3 líneas) | `skills/sddf-init/assets/sddf.config.yaml.template` | AC-1, AC-4 |
| Ejemplo de configuración | modificar (3 líneas) | `skills/sddf-init/assets/sddf.config.yaml.example` | AC-4 |
| README del skill | modificar | `skills/sddf-init/README.md` | AC-4 |
| Evals del skill | modificar (v3.0.0) | `skills/sddf-init/evals/evals.json` | CNF-2 |
| Prueba determinista | crear | `test/sddf-init-layout.test.js` | AC-4, CNF-2, CNF-3 |
| Lista transitoria del gate | modificar (retirar una entrada) | `scripts/verify-fixed-layout.js` | CNF-3 |

No se modifican `config/profiles.json`, `scripts/verify-config-contract.js` ni `test/profile-contract.test.js`: consumen el template, pero no la clave `root`.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Bloque del contrato | `<!-- SDDF-FIXED-LAYOUT: v1 -->` en el Paso 1; nombra `REPO_ROOT`, `specs/flow/`, `docs/templates/`, `docs/guardrails/` | AC-4, CNF-3 |
| Detección de layout | existencia de `docs/specs/` × `specs/flow/` → `limpio \| layout fijo \| legado \| mixto` (D-2) | AC-1, AC-2, AC-3 |
| Líneas de informe nuevas | `[CREADO]`/`[YA EXISTÍA]  <ruta>` por directorio del layout; `[INFO] El layout fijo ya existe — sin cambios en specs/ ni workflow/` | AC-1, AC-3 |
| Aviso de deprecación | bloque de D-5 (`⚠️ Layout legado detectado: …`, ruta de la guía, línea por estado) | AC-2 |
| Cierres | tabla de D-7 | AC-1, AC-2, AC-3 |
| `sddf.config.yaml` generado | copia literal del template, sin clave `root` | AC-1 |
| `.env.template` generado | contenido exacto de D-6 | AC-4 |
| `checkSkillLayout` / `PENDING_MIGRATION` | contrato de STORY-148 (D-2, D-4), consumido por la prueba de D-9 | CNF-3 |

## Esquema de datos // satisface: AC-1

Árbol creado por `/sddf-init` en un repo limpio (nivel `standard`):

```
<REPO_ROOT>/
├── docs/
│   └── templates/            6 templates (Paso 2b)
├── specs/
│   ├── flow/
│   │   ├── .gitkeep
│   │   └── archive/
│   │       └── .gitkeep
│   └── living/
│       └── .gitkeep
├── workflow/
│   └── .gitkeep
├── sddf.config.yaml          sin clave root
└── .env.template             contenido de D-6
```

## Flujos clave

### F-1 — Repo limpio // AC-1
1. `--level` válido; Paso 1 resuelve `REPO_ROOT`; Paso 1b: ni `docs/specs/` ni `specs/flow/` → **limpio**.
2. Paso 2 crea los cuatro directorios con `.gitkeep` y `docs/templates/` → `[CREADO]` ×5.
3. Pasos 2b–5 como hoy, con rutas literales; `sddf.config.yaml` sin `root`.
4. Cierre `✓ Entorno SDDF inicializado correctamente con el layout fijo`. `docs/specs/` no existe.

### F-2 — Layout legado // AC-2, CNF-1
1. Paso 1b: `docs/specs/` existe, `specs/flow/` no → **legado**.
2. Aviso de D-5 con la ruta de la guía y «No se crea specs/flow/ …».
3. Fin: ninguna escritura; cierre `⚠️ Entorno no inicializado: …`.

### F-3 — Re-ejecución sobre el layout fijo // AC-3
1. Paso 1b → **layout fijo**.
2. Paso 2: los cuatro directorios existen → `[YA EXISTÍA]` ×4 + `[INFO] El layout fijo ya existe …`; nada se escribe en `specs/` ni `workflow/`.
3. Pasos 2b–4: `[YA EXISTÍA]` por artefacto; cierre `✓ Entorno ya inicializado — sin cambios necesarios`.

### F-4 — Estado mixto // AC-2, AC-3
1. Paso 1b → **mixto**; aviso de D-5 con «Se continúa con el layout fijo existente …».
2. Paso 2 crea solo lo que falte del layout fijo; `docs/specs/` intacto.

### F-5 — Degradación // P7
- `--level` inválido: error y fin sin escrituras (sin cambio; antes del Paso 1b).
- Skill dueño de un template no instalado: `[WARNING] template no copiado …` y continúa (sin cambio).
- `memory-system` no instalado en `full`: degrada a `standard` (sin cambio).
- Fallo al crear un directorio (permisos): se informa la ruta y el motivo y se detiene antes de los pasos siguientes; los directorios ya creados quedan y una re-ejecución los informa `[YA EXISTÍA]` (idempotencia).

### F-6 — Puntos de cambio // P6
- **Épica de Workflow / Living Spec:** el contenido de `workflow/` y `specs/living/` se añadirá en sus propios pasos; D-3 solo crea los directorios.
- **Retiro del estado mixto:** cuando `memory-system` deje de crear `docs/specs/` (STORY-152) y la guía documente la migración, el estado mixto queda solo para migraciones en curso; no requiere cambio.
- **Rutas fijas:** viven en el bloque del contrato y en la tabla de D-3; un cambio de ADR-0016 se refleja allí.

## Decisiones de complejidad justificada

- **Paso 1b con cuatro estados:** dos estados (limpio/legado) no bastan: el estado mixto aparece en la práctica (scaffold de `memory-system` previo a STORY-152, migración en curso) y tratarlo como legado bloquearía para siempre la re-ejecución (D-2). Es una tabla de dos comprobaciones de existencia, no un parser.
- **Legado termina sin escrituras:** la alternativa de omitir pasos sueltos reparte condiciones por el protocolo; una salida temprana es más simple y garantiza CNF-1 por construcción.
- **Prueba determinista además de evals:** AC-4 y CNF-3 son verificables por lectura de archivos; los evals LLM no se ejecutan en el gate.
- No se añade lectura de `sddf.config.yaml`, migración automática ni diagnóstico de `root` (YAGNI; Non-Goals).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Repo limpio crea el layout con `.gitkeep`, templates en `docs/templates/`, sin `root` ni `docs/specs/` | eval TC-001 (`npm run test:eval -- sddf-init --only TC-001`, a criterio humano) | AC-1 |
| 2 | Layout legado: aviso con la ruta de la guía, sin `specs/flow/`, `docs/specs/` intacto | eval TC-003 | AC-2, CNF-1 |
| 3 | Re-ejecución no sobrescribe e informa layout existente | eval TC-002 | AC-3 |
| 4 | Estado mixto completa el layout fijo y avisa | eval TC-004 | AC-2, AC-3 |
| 5 | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/sddf-init/` vacío | comando literal de AC-4 y caso «Sin resolución legada» de `test/sddf-init-layout.test.js` | AC-4 |
| 6 | Assets sin `root`; `.env.template` sin `SDDF_ROOT` | `grep -nE "^root:" skills/sddf-init/assets/*` vacío; casos de D-9 | AC-4 |
| 7 | `sddf-init` cumple el contrato y salió de la lista | `npm run verify:repository` → exit 0 sin error de higiene de `PENDING_MIGRATION`; caso «Contrato de layout» | CNF-3 |
| 8 | Evals cubren AC-1 y AC-2; sin casos de `SDDF_ROOT`/`root` | caso «Evals cubren AC-1 y AC-2» | CNF-2 |
| 9 | Regresión de suites existentes | `npm test` → exit 0 (incluye E2E-002 y EV-002 de `test/sddf-constitution.test.js` y `test/profile-contract.test.js`) | AC-1–AC-4 |
| 10 | Alcance acotado | `git diff --stat` solo muestra los 7 archivos de «Componentes afectados» (más artefactos de la historia) | Non-Goals |

## Risks / Trade-offs

- **[Riesgo] Orden de implementación con STORY-148** → el gate actual (`audit-root-resolution.js`) exige `root:` en los assets: quitarlo antes de STORY-148 deja `verify:repository` en rojo, y `PENDING_MIGRATION` aún no existiría. Implementar STORY-149 con STORY-148 ya integrada (CR-001).
- **[Riesgo] `--level full` en repo limpio crea `docs/specs/`** porque `memory-system scaffold` (no migrado) crea `docs/specs/epics/` y `docs/specs/stories/` → el estado mixto de D-2 mantiene la re-ejecución funcional; CR-002 pide a STORY-152 que el scaffold use `specs/flow/`. AC-1 (nivel por defecto) no se ve afectado.
- **[Trade-off] Legado sin escrituras:** un proyecto legado sin `.env.template` o templates no los recibe hasta migrar. Aceptado: la épica prioriza «detectar sin escribir»; tras migrar, la re-ejecución completa todo.
- **[Limitación] La guía aún no documenta el layout fijo** (STORY-154): el aviso remite a una ruta existente cuya sección nueva llega después. La ruta es estable.
- **[Limitación] La ruta de la guía es del paquete**, no del proyecto instalado; el aviso lo indica con «(paquete agile-sddf)».
- **[Limitación] Un proyecto con `root` distinto de `docs` y sin `docs/specs/`** se trata como limpio: `sddf-init` no lee `root` (CS-3); `skill-preflight` lo diagnostica (STORY-152).

## Open Questions

Ninguna: el comportamiento en estado legado (D-2, D-5), el estado mixto (D-2), el `.gitkeep` en directorios existentes (D-3), el contenido de `.env.template` (D-6) y la reasignación de evals (D-8) quedan decididos; las dependencias con STORY-148 y STORY-152 se registran como CR.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2, D-3, D-4, D-7; contrato 1), AC-2 (D-2, D-5; contratos 2, 4), AC-3 (D-2, D-3, D-7; contratos 3, 4), AC-4 (D-1, D-4, D-6, D-9, D-11; contratos 5, 6), CNF-1 (D-2, D-5), CNF-2 (D-8, D-9; contrato 8), CNF-3 (D-1, D-10; contrato 7).
- **Ambigüedad:** «aviso de deprecación» fijado en D-5; «no se sobrescriben archivos» operacionalizado como «no se escribe nada dentro de un directorio existente» (D-3); repo con ambos layouts resuelto como mixto.
- **Nombres:** «layout fijo», «layout legado», «contrato de layout fijo», `PENDING_MIGRATION` se usan igual que en la historia, la épica y STORY-148.
- **Estructura:** Paso 1 (contexto) → 1b (detección) → 2 (layout) → 2b–5b (sin cambio de responsabilidad) → 6 (informe); sin ciclos. La prueba de D-9 depende del contrato exportado por STORY-148, no de su implementación interna. Sin código de implementación en este documento (los bloques son textos de contrato y un árbol).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: la historia indica que AC-1 a AC-3 pueden desarrollarse contra el contrato documentado en STORY-148, pero quitar `root: docs` de los assets (AC-1, AC-4) rompe el gate actual: `scripts/audit-root-resolution.js` exige `root:` no vacío en `sddf.config.yaml.template` y `.example`. Además CNF-3 requiere que `PENDING_MIGRATION` (STORY-148) exista.
- **Documento afectado**: story.md (Notas › Dependencia)
- **Acción requerida**: implementar STORY-149 solo con STORY-148 integrada (auditor legado eliminado, `scripts/verify-fixed-layout.js` en el gate). La primera tarea de `tasks.md` verifica esa precondición.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `memory-system scaffold` (Paso 5b, nivel `full`) crea `docs/specs/epics/` y `docs/specs/stories/` con `.gitkeep` (`skills/memory-system/SKILL.md:502-503`). Hasta su migración, `/sddf-init --level full` en un repo limpio deja también `docs/specs/`, contrario a CS-8.
- **Documento afectado**: story.md de STORY-152 (migración de `memory-system`)
- **Acción requerida**: STORY-152 debe hacer que el scaffold cree `specs/flow/` (o no cree directorios de work items) en lugar de `docs/specs/`. Mientras tanto, el estado mixto de D-2 mantiene `sddf-init` idempotente.

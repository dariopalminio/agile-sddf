---
alwaysApply: false
type: story
id: STORY-099
kind: feat
slug: STORY-099-sddf-init-level-full
title: "Inicializar la memoria completa desde sddf-init con el parámetro --level"
status: VERIFY
substatus: DONE
parent: EPIC-20-memory-system
created: 2026-09-20
updated: 2026-09-24
related:
  - EPIC-20-memory-system
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-097-memory-system-check-ci
  - STORY-098-memory-system-migrate-harness
  - STORY-054-inicializar-entorno-sddf
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[STORY-095-memory-system-index-alias]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-097-memory-system-check-ci]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-054-inicializar-entorno-sddf]]
[[memory-system]]

# 📖 Historia: Inicializar la memoria completa desde sddf-init con el parámetro --level

**Como** desarrollador que arranca un proyecto nuevo con SDDF
**Quiero** elegir el nivel de inicialización de `sddf-init` (`minimal`, `standard` o `full`) y que el nivel `full` deje creada la memoria completa invocando `memory-system scaffold` al final
**Para** obtener en un solo comando un proyecto listo para trabajar, sin ejecutar a mano el scaffolding de memoria ni cambiar el comportamiento que ya conocen los proyectos existentes

## ✅ Criterios de aceptación

### Escenario principal – `sddf-init --level full` invoca `memory-system scaffold`

```gherkin
Dado un proyecto nuevo sin `sddf.config.yaml`
Cuando ejecuto `/sddf-init --level full`
Entonces `sddf-init` crea la configuración base y `.env.template`
  Y al finalizar invoca `/memory-system scaffold` y concatena su informe al informe final
  Y la estructura resultante es idéntica a la de ejecutar `/sddf-init` seguido de `/memory-system scaffold`
```

### Escenario alternativo – los niveles `minimal` y `standard` no invocan el scaffolding

```gherkin
Dado un proyecto nuevo sin `sddf.config.yaml`
Cuando ejecuto `/sddf-init` sin `--level` o con `--level standard`
Entonces el comportamiento es el mismo que antes de introducir el parámetro (directorios base, templates compartidos, configuración, `.env.template` y la pregunta opcional de políticas)
  Y no se invoca `memory-system`
  Pero con `--level minimal` se crean solo los directorios base, `sddf.config.yaml` y `.env.template`, sin copiar templates ni ofrecer las políticas
```

### Requerimiento: Niveles de `sddf-init`

`--level` acepta `minimal`, `standard` (valor por defecto) y `full`. `minimal` ejecuta únicamente la resolución de raíz, los directorios base, `sddf.config.yaml` y `.env.template`. `standard` es el comportamiento actual completo. `full` es `standard` más la invocación final a `memory-system scaffold`, que se ejecuta después de la pregunta de políticas (CR-002). Un valor no admitido detiene la ejecución con mensaje y sin escrituras.

### Requerimiento: Cambio mínimo en `sddf-init`

Introducir `--level` y el paso final de invocación es el único cambio permitido en `sddf-init`; sus pasos existentes, su idempotencia y su tabla de templates compartidos no se modifican.

## ⚙️ Criterios no funcionales

* **Compatibilidad:** los proyectos que invocan `/sddf-init` sin argumentos no observan ningún cambio.
* **Idempotencia:** `sddf-init --level full` ejecutado dos veces reporta todo como ya existente y no falla.
* **Trazabilidad:** el informe final distingue lo creado por `sddf-init` de lo creado por `memory-system scaffold`.
* **Documentación:** `docs/guides/sddf-commands-pipeline.md` y `README.md` describen los tres niveles; `CHANGELOG.md` registra el parámetro nuevo.

## Fuera de alcance (Non-Goals)

- El scaffolding en sí (capas, plantillas, preservación) → [[STORY-096-memory-system-scaffold-ensure-rebuild]].
- Invocar `memory-system index` o `check` desde `sddf-init`.
- Cambios en `skill-preflight` o en la resolución de raíz de `sddf-init`.

## 📎 Notas / contexto adicional

**Origen del split:** historia hermana de la división de la STORY-095 original; aísla la integración con `sddf-init` para que el onboarding pueda evolucionar sin tocar `memory-system`. Depende de [[STORY-096-memory-system-scaffold-ensure-rebuild]] (modo `scaffold`); si se implementa antes, el nivel `full` debe emitir un aviso de que `memory-system` no está disponible y terminar como `standard`.

**Decisión heredada del diseño previo** (`STORY-095-memory-system-index-alias/pre-split/design.md`, D-8): la semántica de `minimal` y `standard` no estaba definida en la historia original; se fija aquí como requerimiento.

**Verificación sugerida:**

1. `/sddf-init --level full` en un directorio temporal produce el mismo listado de archivos que `/sddf-init` + `/memory-system scaffold`.
2. `/sddf-init` sin argumentos produce el mismo informe que la versión anterior.
3. `/sddf-init --level minimal` no copia templates ni pregunta por políticas.

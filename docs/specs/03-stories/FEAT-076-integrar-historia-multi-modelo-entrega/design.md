---
type: design
id: FEAT-076
slug: FEAT-076-integrar-historia-multi-modelo-entrega-design
title: "Design: story-integrate — Soporte multi-modelo de entrega"
story: FEAT-076
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-076-integrar-historia-multi-modelo-entrega
  - FEAT-074-integrar-historia-batch-configurable
---

[[FEAT-076-integrar-historia-multi-modelo-entrega]]

## Context

FEAT-076 extiende el skill `story-integrate` (FEAT-074) para que resuelva automáticamente la rama objetivo según el `delivery-model` configurado en `integration-config.yaml`. FEAT-074 hardcodea la selección de comandos bajo el modelo `batch`; FEAT-076 hace esa selección dinámica: el skill lee el campo `delivery-model` de la config, busca la sección del modelo correspondiente, y ejecuta sus comandos.

**Restricciones:**
- La asociación `modelo → rama` se define exclusivamente en `integration-config.yaml`, nunca en el skill
- El mecanismo debe admitir nuevos modelos futuros (ej. `canary`, `feature-flag`) solo actualizando la config, sin tocar el skill
- Si el modelo configurado no tiene sección en la config, el skill informa el error y muestra los modelos disponibles sin ejecutar ninguna acción de integración

**Criterios de aceptación (para trazabilidad):**
- AC-1: Scenario Outline — el skill determina la rama correcta según el modelo configurado; soporta al menos `batch` (`release/{version}`) y `continuous` (`main`); el reporte registra el modelo utilizado
- AC-2: Modelo no reconocido — el skill informa el modelo desconocido, lista los modelos disponibles y no ejecuta ninguna acción

---

## Goals / Non-Goals

**Goals:**
- Modificar `.claude/skills/story-integrate/SKILL.md` para resolver el modelo de entrega dinámicamente desde la config
- Actualizar `assets/integration-config-template.yaml` para incluir el modelo `continuous` junto al ya existente `batch`
- Definir la interfaz `DeliveryModelResolver` que encapsula la lógica de selección de modelo
- Crear ejemplos con Scenario Outline que documenten ambos modelos

**Non-Goals:**
- Implementar modelos `canary`, `feature-flag` u otros no especificados en los ACs — el diseño los admite vía config pero no los implementa
- Modificar el flujo de confirmación manual (FEAT-075) — los modos se combinan ortogonalmente
- Cambiar la lógica de resolución de versión o idempotencia de FEAT-074

---

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `story-integrate/SKILL.md` | modificar | `.claude/skills/story-integrate/SKILL.md` | AC-1, AC-2 |
| `integration-config-template.yaml` | modificar | `.claude/skills/story-integrate/assets/integration-config-template.yaml` | AC-1 |
| `example-multi-model.md` | crear | `.claude/skills/story-integrate/examples/example-multi-model.md` | AC-1, AC-2 |

---

## Interfaces

### DeliveryModelResolver — Lógica de selección de modelo // satisface: AC-1, AC-2

Función interna del skill (pseudocódigo para el implementador del SKILL.md):

```
resolverModelo(config: IntegrationConfig): ModeloSeleccionado | Error

1. leer config.delivery-model  → modeloActivo (string)
2. buscar sección config[modeloActivo] → modeloConfig
3. si modeloConfig no existe:
     → error AC-2: "El modelo '<modeloActivo>' no está configurado"
     → listar claves de primer nivel de config que tengan subclave 'commands'
     → detener sin ejecutar
4. retornar { nombre: modeloActivo, comandos: modeloConfig.commands, branchPattern: modeloConfig.target-branch-pattern }
```

### IntegrationConfig — Schema extendido para multi-modelo // satisface: AC-1

Extensión del schema definido en FEAT-074 para soportar múltiples modelos en paralelo:

```yaml
integration:
  delivery-model: batch          # activo: batch | continuous | <futuro>
  version-source: .release-version

  batch:
    source-branch-pattern: "feat/{story-id}"
    target-branch-pattern: "release/{version}"
    commands:
      create-pr: "gh pr create --base {target-branch} --head {source-branch} --title 'feat: integrate {story-id}'"
      check-pr:  "gh pr list --head {source-branch} --base {target-branch} --json number,url --state open"
      merge-pr:  "gh pr merge {pr-number} --merge --delete-branch"

  continuous:
    source-branch-pattern: "feat/{story-id}"
    target-branch-pattern: "main"
    commands:
      create-pr: "gh pr create --base main --head {source-branch} --title 'feat: integrate {story-id}'"
      check-pr:  "gh pr list --head {source-branch} --base main --json number,url --state open"
      merge-pr:  "gh pr merge {pr-number} --squash --delete-branch"
```

La sección activa es la indicada por `delivery-model`. El skill no necesita conocer los nombres de los modelos de antemano — busca dinámicamente la sección cuyo nombre coincide con `delivery-model`.

### IntegrationReport — Campo modelo en reporte // satisface: AC-1

Se añade el campo `delivery-model` al bloque `integration:` escrito en `story.md` tras integración exitosa:

```yaml
integration:
  delivery-model: continuous     # modelo utilizado en esta integración
  target-branch: main
  source-branch: feat/FEAT-042
  pr-number: 42
  pr-url: https://github.com/owner/repo/pull/42
  commit-hash: abc123def456
  integrated-at: 2026-05-17
status: INTEGRATED
substatus: DONE
```

---

## Flujos Clave

### Flujo principal — Resolución dinámica de modelo (AC-1)

```
1. [FEAT-074] preflight + resolver historia + verificar status
2. Leer integration-config.yaml
3. → NEW: llamar a resolverModelo(config)
   a. leer config.delivery-model  (ej. "continuous")
   b. buscar sección config["continuous"]
   c. si no existe → flujo AC-2 (error)
   d. extraer comandos y branch-patterns del modelo seleccionado
4. [FEAT-074] resolver versión desde .release-version
5. Expandir source-branch-pattern y target-branch-pattern del modelo seleccionado
6. [FEAT-074] ejecutar check-pr, create-pr, merge-pr (usando comandos del modelo)
7. Actualizar story.md con IntegrationReport (incluyendo delivery-model)
```

### Flujo alternativo — Modelo no reconocido (AC-2)

En el paso 3c del flujo principal:
```
3c. modelo no encontrado en config:
    → mostrar: "❌ El modelo de entrega '<modelo>' no está configurado en integration-config.yaml"
    → listar modelos disponibles (secciones con subclave 'commands')
    → mostrar: "Modelos disponibles: batch, continuous [según lo que tenga la config]"
    → detener sin ejecutar ningún comando
    → story.md no se modifica
```

---

## Decisions

### D1 — Resolución dinámica por nombre de sección vs tabla de modelos hardcodeada // satisface: AC-1 + NFR Extensibilidad

**Opción elegida:** El skill busca la sección cuyo nombre de clave coincide con el valor de `delivery-model`. No existe ninguna lista de modelos válidos hardcodeada en el skill. Cualquier clave de primer nivel que tenga subclave `commands` es un modelo válido.

**Alternativas rechazadas:**
- Lista explícita `[batch, continuous]` en el skill — rompe el NFR de extensibilidad: añadir `canary` requeriría modificar el skill
- Switch/if-else por modelo en el skill — idéntico problema; acoplamiento innecesario entre el skill y los nombres de modelos

**Justificación:** La resolución dinámica por nombre de sección satisface el NFR de extensibilidad de forma estructural: el skill no necesita saber qué modelos existen, solo cómo navegarlos. Nuevos modelos = nuevas secciones en la config.

---

### D2 — Detección de modelos disponibles para el mensaje de error (AC-2) // satisface: AC-2

**Opción elegida:** Al encontrar un modelo no reconocido, listar dinámicamente las claves de primer nivel de `integration:` que tengan una subclave `commands` (excluyendo `delivery-model` y `version-source` que son campos de metadatos).

**Alternativas rechazadas:**
- Listar todas las claves de la sección `integration:` — incluiría campos de metadatos (`delivery-model`, `version-source`) que no son modelos
- No mostrar modelos disponibles — el AC dice explícitamente "muestra los modelos disponibles en la configuración"

**Justificación:** La detección dinámica de modelos disponibles es coherente con D1: el skill no asume qué modelos existen. Filtrar por presencia de subclave `commands` es el discriminador correcto.

---

### D3 — Compatibilidad hacia atrás con FEAT-074 // satisface: AC-1

**Opción elegida:** La config de FEAT-074 (con solo la sección `batch`) sigue siendo válida sin modificación. Si `delivery-model: batch` está definido y existe la sección `batch`, el flujo de FEAT-074 se ejecuta sin cambio observable.

**Alternativas rechazadas:**
- Migración forzada del schema de config — breaking change innecesario; FEAT-074 ya define una config funcional para `batch`

**Justificación:** La extensión aditiva del schema (añadir sección `continuous` junto a `batch`) mantiene compatibilidad total con la config generada por FEAT-074.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| La config no tiene el campo `delivery-model` (config de FEAT-074 antes de este campo) | Añadir fallback: si `delivery-model` no existe, asumir `batch` con advertencia; documentar en la guía de migración |
| El modelo activo tiene una sección en config pero le faltan algunos comandos | Al resolver el modelo, validar que existen `commands.create-pr`, `commands.check-pr`, `commands.merge-pr`; emitir error si falta alguno |
| Dos proyectos con configs distintas confunden al desarrollador | El campo `delivery-model` en el reporte de integración (`story.md`) deja trazabilidad del modelo usado |

---

## Open Questions

Ninguna — todas las ambigüedades están resueltas en este diseño o delegadas explícitamente a releases futuros.

---

## Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Con `delivery-model: batch`, skill usa rama `release/v1.2.0` | Ejecutar con config batch + .release-version=v1.2.0; verificar target-branch en story.md | AC-1 |
| 2 | Con `delivery-model: continuous`, skill usa rama `main` | Ejecutar con config continuous; verificar target-branch=main en story.md | AC-1 |
| 3 | El campo `delivery-model` queda registrado en `story.md` tras integración | Leer frontmatter de story.md; verificar campo `integration.delivery-model` presente | AC-1 |
| 4 | Con modelo desconocido, skill informa error y lista modelos disponibles | Usar `delivery-model: canary` sin sección canary en config; verificar mensaje de error y lista | AC-2 |
| 5 | Con modelo desconocido, story.md no se modifica | Comparar story.md antes/después de ejecución con modelo desconocido; deben ser idénticos | AC-2 |
| 6 | Config con solo sección `batch` (FEAT-074) sigue funcionando sin cambios | Ejecutar con config mínima FEAT-074 y `delivery-model: batch`; verificar flujo completo | AC-1 (compatibilidad) |

---

## Registro de Cambios (CR)

Sin CRs detectados.

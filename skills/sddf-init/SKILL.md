---
name: sddf-init
description: >-
  Inicializa el entorno SDDF: crea el layout fijo specs/flow/, specs/living/ y workflow/, sddf.config.yaml y
  .env.template. Idempotente; avisa ante el layout legado docs/specs/. --level minimal|standard|full (full añade el
  scaffold de memory-system).
  Usar como primer paso antes de cualquier skill SDDF cuando el entorno no está configurado.
  Invocar para "inicializar SDDF", "sddf-init", "configurar entorno SDDF" o "primer paso del framework".
---

# Skill: sddf-init

Inicializa el entorno base del framework SDDF en un proyecto. Es el primer paso del flujo de onboarding SDDF:

```
sddf-init → [cualquier skill SDDF con resolución local]
```

**Usar cuando:**
- Al configurar SDDF en un proyecto nuevo por primera vez
- Cuando se necesita crear el layout fijo de SDDF en un proyecto (ADR-0016)

---

## Restricciones / Reglas

- NO modifique ningún archivo existente en el código fuente (estamos en etapa de inicialización de especificaciones, no de implementación)
- NO genere código; estas iniciando el entorno SDDF, no implementando los artefactos técnicos
- No inicializa repositorio git
- No instala dependencias
- Ante el layout legado `docs/specs/` avisa y termina sin escribir (Paso 1b); nunca crea `docs/specs/`.

---

## Parámetros

`--level minimal|standard|full` (default `standard`) decide qué pasos del protocolo se ejecutan;
el contenido de cada paso es el mismo en todos los niveles.

| Nivel | Pasos ejecutados | Uso típico |
|---|---|---|
| `minimal` | 1, 1b, 2, 3, 4, 6 — sin 2b (templates) ni 5 (pregunta de políticas) | CI o bootstrap no interactivo |
| `standard` | 1, 1b, 2, 2b, 3, 4, 5, 6 — idéntico a invocar sin `--level`; no invoca `memory-system` | Uso habitual |
| `full` | `standard` + 5b (`memory-system scaffold --yes`, tras el Paso 5) | Proyecto nuevo completo en un solo comando |

**Validación (antes del Paso 1):** un valor distinto de los tres admitidos emite exactamente lo
siguiente y termina sin crear archivos ni directorios:

```
❌ --level no admitido: <valor>. Valores válidos: minimal, standard, full.
```

---

## Protocolo de inicialización

### Paso 1 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

`CLI_ROOT` se resuelve independientemente y solo para copiar templates y componer `memory-system`
desde los skills instalados; nunca se deriva del layout.

### Paso 1b — Detectar el layout

Antes de cualquier escritura, comprobar la existencia de los directorios `docs/specs/` y
`specs/flow/` en `REPO_ROOT` (solo existencia de directorios):

| `docs/specs/` | `specs/flow/` | Estado | Acción |
|---|---|---|---|
| no | no | **limpio** | continuar: el Paso 2 crea el layout fijo |
| no | sí | **layout fijo** | continuar: el Paso 2 solo crea lo que falte |
| sí | no | **legado** | emitir el aviso y **terminar sin escribir nada** |
| sí | sí | **mixto** | emitir el aviso y continuar como layout fijo; `docs/specs/` no se modifica |

Aviso de deprecación (estados legado y mixto):

```
⚠️ Layout legado detectado: docs/specs/ está deprecado (ADR-0016).
   Guía de migración: docs/guides/artifact-directory-migration.md (paquete agile-sddf)
```

Con una línea adicional según el estado:
- **legado:** `   No se crea specs/flow/ ni se modifica docs/specs/. Migra y vuelve a ejecutar /sddf-init.`
  El skill termina aquí: sin líneas `[CREADO]`, sin los Pasos 2 a 5b y sin cierre de éxito.
  El informe son el encabezado `── sddf-init ──`, el aviso y la línea de cierre del Paso 6.
- **mixto:** `   Se continúa con el layout fijo existente; docs/specs/ no se modifica.`

El aviso no es un `[ERROR]`: el layout legado es un estado válido de un proyecto ya instalado.

### Paso 2 — Crear el layout fijo

Para cada uno de los siguientes directorios, en este orden, relativos a `REPO_ROOT`:

| Directorio | `.gitkeep` |
|---|---|
| `specs/flow/` | sí, solo si el directorio se crea en esta ejecución |
| `specs/flow/archive/` | sí, ídem |
| `specs/living/` | sí, ídem |
| `workflow/` | sí, ídem |
| `docs/templates/` | no (se llena en el Paso 2b) |

Verificar si el directorio existe:
- **No existe:** crearlo (con rutas intermedias), crear el `.gitkeep` vacío si la tabla lo indica y registrar `[CREADO]  <ruta>`
- **Ya existe:** no modificar nada dentro (tampoco añadir `.gitkeep`) y registrar `[YA EXISTÍA]  <ruta>`

Si los cuatro directorios del layout (`specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`)
ya existían, registrar `[INFO] El layout fijo ya existe — sin cambios en specs/ ni workflow/`.

Los directorios se crean en los tres niveles. `docs/specs/` nunca se crea. Si un directorio no puede
crearse (permisos), informar la ruta y el motivo y detener antes de los pasos siguientes; los directorios
ya creados quedan y una re-ejecución los informa `[YA EXISTÍA]`.

> `docs/templates/` es una capa hermana de `specs/`, no un subdirectorio suyo: los templates son meta-artefactos que definen la estructura de otros artefactos. Ver [ADR-0007](../../docs/adr/ADR-0007-templates-como-capa-propia.md).

### Paso 2b — Copiar templates compartidos al directorio central

Copiar los templates compartidos desde el `assets/` de su skill dueño. Esta tabla es la fuente de verdad de qué se centraliza:

| Template | Skill dueño (origen) |
|----------|---------------------|
| `story-template.md` | `$CLI_ROOT/skills/story-creation/assets/` |
| `epic-template.md` | `$CLI_ROOT/skills/epic-creation/assets/` |
| `stakeholders-template.md` | `$CLI_ROOT/skills/project-discovery/assets/` |
| `requirement-template.md` | `$CLI_ROOT/skills/project-discovery/assets/` |
| `vision-template.md` | `$CLI_ROOT/skills/project-begin/assets/` |
| `roadmap-template.md` | `$CLI_ROOT/skills/project-planning/assets/` |

Para cada template:
- **No existe en `docs/templates/`:** copiarlo desde el origen y registrar `[CREADO]  <ruta destino>`
- **Ya existe en el destino:** no sobrescribirlo (puede contener personalizaciones del proyecto) y registrar `[YA EXISTÍA]  <ruta destino>`
- **El origen no existe (skill dueño no instalado):** emitir `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` y continuar sin bloquear.

### Paso 3 — Generar sddf.config.yaml

Verificar si `<REPO_ROOT>/sddf.config.yaml` existe en la raíz del proyecto:
- **No existe (o existe vacío):**
  - Crear `sddf.config.yaml` usando exactamente el contenido del template en `$CLI_ROOT/skills/sddf-init/assets/sddf.config.yaml.template`. El template declara explícitamente `profile: core` y `stack: node-markdown`; no activa workers de extensión ni comandos requeridos.
  - Registrar `[CREADO]  sddf.config.yaml`
- **Ya existe con contenido:**
  - No sobrescribirlo ni modificarlo.
  - Registrar `[YA EXISTÍA]  sddf.config.yaml` y emitir `[INFO] sddf.config.yaml ya existe — se mantiene sin cambios`.

### Paso 4 — Generar .env.template

Verificar si `.env.template` existe en la raíz del proyecto:
- **No existe:**
  - Crear `.env.template` con el siguiente contenido exacto:
    ```
    # Variables de entorno del proyecto (plantilla).
    # SDDF no requiere variables de entorno: el layout de artefactos es fijo (ADR-0016).
    ```
  - Registrar `[CREADO]  .env.template`
- **Ya existe:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  .env.template` y emitir `[INFO] .env.template ya existe — se mantiene sin cambios`

### Paso 5 — Inicializar políticas del proyecto (opcional)

**Nivel `minimal`:** omitir este paso sin preguntar y registrar
`[OMITIDO] sddf-constitution (nivel minimal)` en el informe final. En `standard` y
`full` el paso se ejecuta tal como sigue.

Preguntar al usuario:

```
¿Deseas inicializar los documentos de políticas del proyecto?
(docs/constitution.md y el DoD de historia por etapa docs/guardrails/dod-story-<etapa>.md)

  (s) Sí — ejecutar sddf-constitution ahora
  (n) No — omitir este paso
```

- **Si el usuario responde `s` / `sí`:** invocar el skill `sddf-constitution` y esperar a que complete su ejecución antes de continuar al Paso 6.
- **Si el usuario responde `n` / `no`:** omitir este paso y continuar directamente al Paso 6. Registrar `[OMITIDO] sddf-constitution` en el informe final.

> Las políticas pueden inicializarse en cualquier momento ejecutando `/sddf-constitution` de forma independiente.

### Paso 5b — Scaffolding de memoria (solo nivel `full`)

Corre después del Paso 5, para que una constitución generada por `sddf-constitution`
prevalezca sobre la semilla del scaffold.

1. Si no existe `$CLI_ROOT/skills/memory-system/SKILL.md`, emitir
   `⚠️ memory-system no está instalado — nivel full termina como standard` y pasar al Paso 6 sin
   bloque de scaffold (no es un error).
2. Si existe, leer ese `SKILL.md` y ejecutar su modo `scaffold --yes` (composición inline, sin
   preguntas ni más argumentos): `memory-system` usa `docs/` como base de sus capas.
   Este paso no se alcanza en el estado legado (Paso 1b).
3. Capturar su salida completa sin reinterpretarla (`harness:`, `capas faltantes:`, líneas
   `[CREADO]`/`[PRESERVADO]`/`[MAPEADO]`/`[OMITIDO]`/`[WARNING]`, su línea `✅` y el resumen
   `creados: N · sobrescritos: S · preservados: M · mapeados: X · omitidos por harness: K`). El
   motor emite rutas relativas a `docs/`; al concatenarlas, anteponer `docs/` para
   que ambos bloques usen rutas desde `REPO_ROOT`.

Los cinco templates compartidos figuran `[CREADO]` (o `[YA EXISTÍA]`) en el bloque de `sddf-init`
y `[PRESERVADO]` en el de scaffold: el Paso 2b ya los copió; no es una duplicación.

### Paso 6 — Informe final

Emitir el informe consolidado con todos los artefactos verificados:

```
── sddf-init ────────────────────────────────────
[CREADO]     specs/flow/
[CREADO]     specs/flow/archive/
[CREADO]     specs/living/
[CREADO]     workflow/
[CREADO]     docs/templates/
[CREADO]     docs/templates/story-template.md
[CREADO]     docs/templates/epic-template.md
[CREADO]     docs/templates/stakeholders-template.md
[CREADO]     docs/templates/requirement-template.md
[CREADO]     docs/templates/vision-template.md
[CREADO]     docs/templates/roadmap-template.md
[CREADO]     sddf.config.yaml
[CREADO]     .env.template
[CREADO]     docs/constitution.md
[CREADO]     docs/guardrails/dod-story-specify.md … dod-story-acceptance.md (6)
─────────────────────────────────────────────────
```

| Situación | Línea de cierre |
|---|---|
| Se creó al menos un artefacto | `✓ Entorno SDDF inicializado correctamente con el layout fijo` |
| Nada se creó | `✓ Entorno ya inicializado — sin cambios necesarios` |
| Estado legado | `⚠️ Entorno no inicializado: migra el layout legado antes de continuar` |

Sin `--level` el informe es exactamente el anterior. Con `--level` explícito, la línea de éxito
añade el nivel efectivo: `✓ Entorno SDDF inicializado correctamente con el layout fijo (nivel <n>)`.

**Estado legado** (sin `[CREADO]`; ver Paso 1b):

```
── sddf-init ────────────────────────────────────
⚠️ Layout legado detectado: docs/specs/ está deprecado (ADR-0016).
   Guía de migración: docs/guides/artifact-directory-migration.md (paquete agile-sddf)
   No se crea specs/flow/ ni se modifica docs/specs/. Migra y vuelve a ejecutar /sddf-init.
─────────────────────────────────────────────────
⚠️ Entorno no inicializado: migra el layout legado antes de continuar
```

**`minimal`:** el bloque omite los templates y registra
`[OMITIDO] sddf-constitution (nivel minimal)`:

```
── sddf-init ────────────────────────────────────
[CREADO]     specs/flow/
[CREADO]     specs/flow/archive/
[CREADO]     specs/living/
[CREADO]     workflow/
[CREADO]     docs/templates/
[CREADO]     sddf.config.yaml
[CREADO]     .env.template
[OMITIDO] sddf-constitution (nivel minimal)
─────────────────────────────────────────────────
✓ Entorno SDDF inicializado correctamente con el layout fijo (nivel minimal)
```

**`full`:** la salida capturada en el Paso 5b va en su propio bloque, tras el de `sddf-init`
(ejemplo: proyecto nuevo, respuesta `n` en el Paso 5):

```
── sddf-init ────────────────────────────────────
…
[CREADO]     docs/templates/story-template.md
…
[CREADO]     .env.template
[OMITIDO] sddf-constitution
── memory-system scaffold (nivel full) ──────────
harness: sddf
capas faltantes: product, requirements, domains, architecture, adr, policies, guardrails, guides, runbooks
[CREADO] docs/adr/README.md
[CREADO] docs/constitution.md
…
[PRESERVADO] docs/templates/story-template.md
[PRESERVADO] docs/templates/epic-template.md
[PRESERVADO] docs/templates/stakeholders-template.md
[PRESERVADO] docs/templates/requirement-template.md
[PRESERVADO] docs/templates/vision-template.md
[PRESERVADO] docs/templates/roadmap-template.md
✅ memory-system scaffold — harness: sddf — docs
creados: 19 · sobrescritos: 0 · preservados: 5 · mapeados: 0 · omitidos por harness: 0
─────────────────────────────────────────────────
✓ Entorno SDDF inicializado correctamente con el layout fijo (nivel full)
```

Sin `memory-system` instalado, `full` muestra el bloque de `standard`, el aviso del Paso 5b, ningún
bloque de scaffold y cierra con `(nivel standard)`. En una segunda ejecución de `full` nada se crea
ni se sobrescribe: `sddf-init` informa `[YA EXISTÍA]`, el scaffold todo `[PRESERVADO]` con
`creados: 0 · sobrescritos: 0 · preservados: 24 · mapeados: 0 · omitidos por harness: 0`, y el
cierre es `✓ Entorno ya inicializado — sin cambios necesarios`.

Terminar la ejecución. El diagnóstico explícito está disponible en `/skill-preflight`;
el usuario también puede continuar directamente con cualquier skill SDDF.

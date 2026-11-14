---
name: skill-preflight
description: >-
  Diagnostica explícitamente el layout fijo SDDF, las señales del layout legado y el estado del
  entorno sin modificarlo. Úsalo cuando necesites investigar estructura, templates o runtime antes
  de un workflow, o cuando el usuario mencione preflight, diagnóstico de entorno o layout legado.
triggers:
  - "skill-preflight"
  - "diagnosticar entorno SDDF"
  - "verificar configuración SDDF"
  - "diagnosticar layout legado"
---

# Skill: skill-preflight

`skill-preflight` es un diagnóstico explícito, de solo lectura y bajo demanda. No forma
parte del hot path de otros skills: cada workflow resuelve su propio contexto local antes
de operar.

**Usar cuando:**

- El mantenedor invoca `/skill-preflight` para investigar el layout o una ruta.
- Se necesita comprobar el layout fijo de un repositorio SDDF sin crear ni modificar archivos.
- Se quiere saber si un proyecto conserva señales del layout legado y dónde está la guía para migrarlo.
- Tras actualizar a 6.0.0, se quiere saber qué historias o épicas activas conservan un status legado y a qué estado editarlas a mano.

**No hace:**

- No crea directorios, templates, archivos de configuración ni artefactos.
- No migra el layout legado: no mueve work items ni edita la configuración.
- No edita el `status` de los work items: la migración de status legados es manual.
- No exporta `REPO_ROOT` ni `CLI_ROOT` como estado persistente a otro skill.
- No inspecciona integraciones retiradas que no se hayan solicitado expresamente.

---

## Contrato de layout

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

`REPO_ROOT` es la raíz del repositorio de trabajo: el top-level de git o, si el directorio no
es un repositorio git, el directorio de la invocación. El diagnóstico no exige ningún archivo
de configuración para determinarlo.

`CLI_ROOT` es independiente de `REPO_ROOT`. `SDDF_CLI_ROOT`, si está definido y es accesible,
conserva su prioridad como override explícito. Si no se usa, leer `config/runtimes.json` y
recorrer, en el orden declarado, los destinos `local.rootSegments` de los runtimes soportados.
El primer directorio existente es `CLI_ROOT`; si ninguno existe, informar el destino local del
`defaultRuntime` del mismo contrato como advertencia operativa.

No se mantiene una lista paralela de `.claude`, `.opencode` o `.github` en este skill.
Las rutas de compatibilidad declaradas como no instalables pueden explicar un descubrimiento
de *skills*. Cuando el contrato declare el target `codex`, su destino `.agents` sí puede
elegirse como `CLI_ROOT` de solo skills, pero nunca como raíz de los agentes Markdown del
paquete.

---

## Protocolo de diagnóstico

Todas las verificaciones son de solo lectura: cada una describe el estado observado y el
diagnóstico continúa aunque alguna emita avisos.

### Verificación 1 — Raíz

Informar siempre:

```text
[OK]      REPO_ROOT = <ruta>
```

### Verificación 2 — Layout fijo

Verificar, relativas a `REPO_ROOT` y en este orden:

- `specs/flow/`
- `specs/flow/archive/`
- `specs/living/`
- `workflow/`
- `docs/templates/`

Para cada ruta, emitir `[OK] <ruta> existe` o `[WARNING] <ruta> no encontrado`. Antes de
emitirlas, evaluar las señales de la Verificación 3 (sin informarlas todavía): el sufijo
`— ejecuta /sddf-init` se añade a cada `[WARNING]` de esta verificación solo si no hay ninguna
señal legada. Con alguna señal, `/sddf-init` no prepara el layout de un proyecto legado y la
remisión la da la línea `ℹ️ Guía de migración` de la Verificación 3.

### Verificación 3 — Señales de layout legado

<!-- SDDF-LEGACY-DIAGNOSTIC:start -->

Evaluar todas las señales, en este orden, y emitir la línea de cada una **solo si está presente**:

| Señal | Detección | Línea emitida |
|---|---|---|
| L1 | existe el directorio `docs/specs/` | `[WARNING] Layout legado: existe docs/specs/ — los work items van en specs/flow/` |
| L2 | `sddf.config.yaml` existe y declara la clave superior `root` | `[WARNING] Layout legado: sddf.config.yaml declara la clave root (<valor>), que ya no se lee` |
| L3 | la variable de entorno `SDDF_ROOT` está definida (aunque esté vacía) | `[WARNING] Layout legado: SDDF_ROOT está definida (<valor>) y ya no se usa` |
| Cierre | al menos una señal presente | `ℹ️ Guía de migración: docs/guides/artifact-directory-migration.md (repositorio de agile-sddf)` |

- Las señales ausentes no producen ninguna línea. Sin señales, esta verificación no emite nada.
- Las señales son `[WARNING]`, nunca `[ERROR]`: el diagnóstico describe y no bloquea.
- Si `sddf.config.yaml` existe pero no se puede leer como YAML, emitir
  `[WARNING] sddf.config.yaml no se pudo leer — señal L2 no evaluada` y continuar.
- Un repositorio en estado mixto (layout fijo y señales legadas) recibe las Verificaciones 2 y 3
  completas.
- La guía vive en el repositorio de agile-sddf, no en el paquete instalado: se cita como
  referencia y no se busca en el proyecto diagnosticado.

<!-- SDDF-LEGACY-DIAGNOSTIC:end -->

### Verificación 3b — Status legado de work items

Informa los work items activos que conservan un `status` retirado en 6.0.0 y a qué estado
editarlos a mano. La regla viene de ADR-0022: la ventana de transición se abre en 6.0.0 y
**termina en 7.0.0**.

**Alcance:** `specs/flow/*/story.md` y `specs/flow/*/epic.md`, solo de los hijos directos de
`specs/flow/` y excluido el directorio `specs/flow/archive/`, que es un registro histórico. Si
`specs/flow/` no existe, esta verificación no emite nada (la Verificación 2 ya lo avisa).

**Lectura del frontmatter:** de cada archivo se lee solo el bloque YAML entre la primera línea
`---` y la siguiente, y de él la clave superior `status`. Sin bloque, sin línea de cierre, con un
YAML que no se puede leer o con un archivo que no se puede abrir, emitir
`[WARNING] <ruta relativa a REPO_ROOT>: frontmatter ilegible — status legado no evaluado` y seguir
con el archivo siguiente. Un frontmatter legible sin `status`, o con un valor no legado, no emite
nada. El cuerpo del documento no se inspecciona.

**Señal y destino.** Los valores legados son `READY-FOR-IMPLEMENT` y `READY-FOR-DEV`, sea cual sea
el `substatus`:

| Señal | Archivo | `implement-report.md` en el mismo directorio | Destino |
|---|---|---|---|
| S1 | `story.md` con `status` legado | existe | `IMPLEMENT/TODO` |
| S1 | `story.md` con `status` legado | no existe | `PLAN/DONE` |
| S1 | `epic.md` con `status` legado | no se consulta | `PLAN/DONE` |

Por cada archivo con `status` legado, emitir:

```text
[WARNING] Status legado: <ruta relativa a REPO_ROOT> tiene status <valor> — edítalo a mano a <destino> (ADR-0022, la ventana termina en 7.0.0)
```

- Las líneas se emiten en orden de ruta, para que la salida sea determinista.
- Las señales son `[WARNING]`, nunca `[ERROR]`, y no detienen el diagnóstico.
- La verificación no escribe ningún archivo: no hay migración automática; el usuario edita el
  `status` a mano al destino indicado.
- No afecta al sufijo `— ejecuta /sddf-init` de la Verificación 2 ni a la línea
  `ℹ️ Guía de migración` de la Verificación 3, que solo dependen de las señales L1-L3. No tiene
  línea de cierre: cada `[WARNING]` ya dice qué editar, a qué valor y hasta cuándo.

### Verificación 4 — Templates centrales

Verificar el conjunto fijo de templates centrales en `docs/templates/`:

- `story-template.md`
- `epic-template.md`
- `stakeholders-template.md`
- `requirement-template.md`
- `vision-template.md`
- `roadmap-template.md`

Para cada `<template>`, emitir `[OK] Template presente: docs/templates/<template>` o
`[WARNING] Template no encontrado: docs/templates/<template>`. Son advertencias no bloqueantes:
la invocación independiente no necesita conocer un skill consumidor ni usa un fallback para
convertir una ausencia en éxito.

### Verificación 5 — Runtime opcional

Resolver `CLI_ROOT` de forma independiente según el contrato anterior y emitir el
runtime detectado cuando provenga de `config/runtimes.json`:

```text
[OK]      CLI_ROOT = <ruta> (<runtime-id>)
```

Si se usa el default por no detectar runtime conocido, anteponer también una advertencia
que explique que la resolución de artefactos no depende de ese directorio. Si se usa
`SDDF_CLI_ROOT`, informar que es un override explícito y no inferir un runtime.

---

## Informe final

Acumular los resultados sin mutar el repositorio:

```text
── Preflight SDDF ───────────────────────────
[OK]      REPO_ROOT = <ruta>
[OK]      <comprobaciones de layout, templates y runtime>
[WARNING] <advertencias operativas y señales legadas, si existen>
ℹ️ <guía de migración, solo si hay señales legadas>
[WARNING] <status legados de work items, si existen>
─────────────────────────────────────────────
✓ Diagnóstico completado — sin cambios
```

La salida describe el estado observado; no habilita, bloquea ni modifica una invocación
posterior de otro skill.

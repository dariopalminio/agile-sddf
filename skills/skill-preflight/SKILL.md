---
name: skill-preflight
description: >-
  Diagnostica explícitamente la resolución de raíces y el estado del entorno SDDF sin modificarlo.
  Úsalo cuando necesites investigar configuración, estructura o templates antes de un workflow,
  o cuando el usuario mencione preflight, diagnóstico de entorno o SDDF_ROOT.
triggers:
  - "skill-preflight"
  - "diagnosticar entorno SDDF"
  - "verificar configuración SDDF"
  - "revisar SDDF_ROOT"
---

# Skill: skill-preflight

`skill-preflight` es un diagnóstico explícito, de solo lectura y bajo demanda. No forma
parte del hot path de otros skills: cada workflow resuelve su propio contexto local antes
de operar.

**Usar cuando:**

- El mantenedor invoca `/skill-preflight` para investigar una configuración o una ruta.
- Se necesita comprobar la estructura de una raíz SDDF sin crear ni modificar archivos.
- Se requiere evidencia legible de la fuente que determinó `SPECS_BASE`.

**No hace:**

- No crea directorios, templates, archivos de configuración ni artefactos.
- No exporta `SPECS_BASE`, `ROOT_SOURCE` ni `CLI_ROOT` como estado persistente a otro skill.
- No inspecciona integraciones retiradas que no se hayan solicitado expresamente.

---

## Contrato de resolución

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Determinar `REPO_ROOT` como la raíz de la invocación que contiene `sddf.config.yaml`.
Resolver una única vez `SPECS_BASE` y `ROOT_SOURCE` con esta precedencia:

| Prioridad | Fuente | Resultado |
|---|---|---|
| 1 | `SDDF_ROOT` definida, no vacía y accesible | Usar la ruta; `ROOT_SOURCE = SDDF_ROOT`. No leer la configuración. |
| 1-error | `SDDF_ROOT` definida pero vacía, inválida, inaccesible o inexistente | Error accionable; no continuar con comprobaciones que asuman una raíz. |
| 2 | Sin override y `sddf.config.yaml.root` es un escalar no vacío y accesible | Usar la ruta; `ROOT_SOURCE = sddf.config.yaml`. Las rutas relativas se anclan en `REPO_ROOT`. |
| 2-error | Sin override y el YAML es ilegible, `root` no es escalar válido o no es utilizable | Error accionable; no usar `docs` como fallback. |
| 3 | Sin fuente explícita | Usar `docs` relativo a `REPO_ROOT`; `ROOT_SOURCE = default`. |

Las rutas absolutas conservan su significado y los espacios internos no se alteran. La
resolución no crea la raíz: una fuente explícita tiene que existir para ser válida.

`CLI_ROOT` es independiente de `SPECS_BASE`. Solo se diagnostica después de resolver una
raíz válida. `SDDF_CLI_ROOT`, si está definido y es accesible, conserva su prioridad
como override explícito. Si no se usa, leer `config/runtimes.json` y recorrer, en el
orden declarado, los destinos `local.rootSegments` de los runtimes soportados. El primer
directorio existente es `CLI_ROOT`; si ninguno existe, informar el destino local del
`defaultRuntime` del mismo contrato como advertencia operativa, no como error de raíz.

No se mantiene una lista paralela de `.claude`, `.opencode` o `.github` en este skill.
Las rutas de compatibilidad declaradas como no instalables (por ejemplo `.agents`) pueden
explicar un descubrimiento de *skills*, pero nunca se eligen como `CLI_ROOT` de agentes.

---

## Protocolo de diagnóstico

### Verificación 1 — Raíces y fuente efectiva

Informar siempre `REPO_ROOT`. Aplicar el contrato anterior y emitir uno de estos
resultados:

```text
[OK]      SPECS_BASE = <ruta>
[OK]      ROOT_SOURCE = SDDF_ROOT | sddf.config.yaml | default
```

o, ante una fuente explícita inválida:

```text
[ERROR]   <SDDF_ROOT | sddf.config.yaml.root> no es utilizable: <valor>
          Corrige la fuente explícita o elimínala para usar la siguiente fuente permitida.
```

Una raíz explícita inválida es un error bloqueante para el informe de estructura. El
diagnóstico puede seguir mostrando `REPO_ROOT`, pero no inventa una raíz alternativa.

### Verificación 2 — Estructura estándar

Solo con `SPECS_BASE` válida, verificar:

- `specs/01-projects/`
- `specs/02-epics/`
- `specs/03-stories/`

Para cada ruta, emitir `[OK] <ruta> existe` o `[WARNING] <ruta> no encontrado`. Son
advertencias operativas; este skill no crea directorios para corregirlas.

### Verificación 3 — Templates centrales

Solo con `SPECS_BASE` válida, verificar el conjunto fijo de templates centrales:

- `story-template.md`
- `epic-template.md`
- `project-template.md`
- `project-intent-template.md`
- `project-plan-template.md`

Para cada `<template>` bajo `SPECS_BASE/templates/`, emitir `[OK] Template presente:` o
`[WARNING] Template no encontrado:`. La invocación independiente no necesita conocer un
skill consumidor ni usa un fallback para convertir una ausencia en éxito.

### Verificación 4 — Runtime opcional

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
[OK]      SPECS_BASE = <ruta>
[OK]      ROOT_SOURCE = <fuente>
[OK]      <comprobaciones de estructura, templates y runtime>
[WARNING] <advertencias operativas, si existen>
─────────────────────────────────────────────
✓ Diagnóstico completado — sin cambios
```

Si hay errores de raíz, cerrar con:

```text
✗ Diagnóstico incompleto — corrige las fuentes [ERROR] antes de ejecutar un workflow que escriba artefactos
```

La salida describe el estado observado; no habilita, bloquea ni modifica una invocación
posterior de otro skill.

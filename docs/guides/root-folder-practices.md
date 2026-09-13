---
type: guide
slug: root-folder-practices
title: "Prácticas para resolver la raíz de artefactos SDDF"
status: active
---

# Prácticas para resolver la raíz de artefactos SDDF

SDDF separa tres raíces que no son intercambiables:

| Raíz | Responsabilidad |
|---|---|
| `REPO_ROOT` | Repositorio, `sddf.config.yaml`, código, scripts y políticas. |
| `SPECS_BASE` | Una única raíz de artefactos SDDF: `specs/`, `templates/`, políticas y documentación relacionada. |
| `CLI_ROOT` | Runtime instalado que contiene skills y agentes; se resuelve solo cuando hace falta. |

## Precedencia canónica

Cada skill resuelve el contexto una vez al inicio y conserva el resultado durante toda
la invocación. La precedencia es deliberadamente segura:

| Prioridad | Fuente | Resultado |
|---|---|---|
| 1 | `SDDF_ROOT` definida, no vacía y accesible | Se usa como `SPECS_BASE`. La configuración no se lee. |
| 1-error | `SDDF_ROOT` definida pero no utilizable | Se informa el error y no se escribe nada. |
| 2 | Sin override y `sddf.config.yaml` declara `root` válido | Se usa `root`; las rutas relativas se anclan en `REPO_ROOT`. |
| 2-error | Sin override y la configuración o `root` son inválidos | Se informa el error y no se cae a `docs`. |
| 3 | No existe una fuente explícita | Se usa `docs` relativo a `REPO_ROOT`. |

Una fuente explícita inválida nunca permite un fallback silencioso. Las rutas absolutas
conservan su significado y los espacios internos son válidos.

## Configuración versionada

Declara la raíz normal del proyecto en `sddf.config.yaml`:

```yaml
root: docs

defaults:
  delivery-model: batch
```

Para un repositorio que conserva los artefactos en otra carpeta versionada:

```yaml
root: docs-personalizada
```

La carpeta debe existir antes de usarla en un workflow ordinario. `sddf-init` es la
única excepción: puede crear una raíz relativa dentro de `REPO_ROOT` durante el
bootstrap idempotente.

## Override temporal

`SDDF_ROOT` está reservado para CI, pruebas o sesiones locales que necesiten una raíz
distinta sin modificar la configuración versionada.

```bash
# POSIX
export SDDF_ROOT="artefactos-ci"
```

```powershell
# PowerShell, solo para la sesión actual
$env:SDDF_ROOT = 'artefactos-ci'
```

La ruta indicada tiene que existir y ser accesible. Déjala sin definir para que el
workflow use `sddf.config.yaml.root` o, si la clave no existe, `docs`.

No declares un valor activo en `.env.template`: ese archivo documenta el override como
opcional para evitar que anule el valor versionado sin intención.

## Contrato que usan los skills

Antes de acceder a artefactos, un skill debe:

1. Determinar `REPO_ROOT`.
2. Resolver `SPECS_BASE` y `ROOT_SOURCE` con la tabla anterior.
3. Detenerse antes de escribir si una fuente explícita no es utilizable.
4. Resolver `CLI_ROOT` de forma independiente solo si necesita un skill, agente o
   comando del runtime.

No uses sustituciones textuales entre estas raíces. En particular, `SPECS_BASE` no es
la raíz de código ni la ubicación de `sddf.config.yaml`, y `CLI_ROOT` no se deriva de
la carpeta de artefactos.

## Bootstrap y diagnóstico

`/sddf-init` crea el esqueleto estándar, el archivo de configuración y los templates de
forma idempotente. Si no hay configuración ni override, crea `docs/` y guarda
`root: docs`. Si `root` ya existe, lo conserva. Si existe `SDDF_ROOT` pero no hay
configuración versionada, el bootstrap se detiene para no persistir un valor temporal.

`/skill-preflight` es un diagnóstico explícito y no mutante. Informa `REPO_ROOT`,
`SPECS_BASE`, `ROOT_SOURCE`, la estructura estándar, los cinco templates centrales y
el runtime disponible. Un skill ordinario no lo invoca automáticamente.

## Checklist de revisión

- `sddf.config.yaml` declara una clave superior `root` no vacía para la configuración
  versionada.
- Las rutas relativas se interpretan desde `REPO_ROOT`.
- Un override válido evita leer una configuración defectuosa.
- Un override o `root` explícito inválido detiene antes de escribir.
- Los skills documentan y reutilizan su resolución local durante la invocación.
- El diagnóstico se ejecuta solo cuando se solicita expresamente.

# sddf-init

Inicializa de forma idempotente el entorno base de SDDF en un proyecto.

## What it does

- Crea el layout fijo (`specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`) y `docs/templates/`.
- Crea o preserva `sddf.config.yaml` y `.env.template` en la raíz del repositorio.
- Copia los templates compartidos que falten en el nivel adecuado.
- Puede inicializar la constitución y los guardrails de políticas mediante `sddf-constitution`.
- En el nivel `full`, ejecuta el scaffold de `memory-system` si ese skill está instalado.

No modifica código ni archivos existentes, no genera código, no inicializa Git ni instala dependencias.

## When to use

Úsalo al configurar SDDF por primera vez en un proyecto, al crear el layout fijo o antes de usar skills SDDF cuando el entorno aún no está preparado.

Para diagnosticar la resolución de raíces sin escribir nada, usa `/skill-preflight`.

## Invocation modes

| Nivel | Invocación | Comportamiento |
|---|---|---|
| `standard` | `/sddf-init` o `--level standard` | Crea el entorno base, copia templates compartidos y pregunta si se inicializan las políticas. Es el valor predeterminado. |
| `minimal` | `--level minimal` | Crea el layout fijo, `sddf.config.yaml` y `.env.template`; omite templates compartidos y no pregunta por políticas. |
| `full` | `--level full` | Ejecuta `standard` y, después, compone `memory-system scaffold --yes` si está disponible. |

Un valor de `--level` distinto de `minimal`, `standard` o `full` detiene el proceso antes de crear archivos.

## Input

| Entrada | Uso |
|---|---|
| Repositorio destino | Define `REPO_ROOT`, desde donde se resuelven configuración y artefactos. |
| `--level` | Selecciona `minimal`, `standard` o `full`. |
| Respuesta del usuario | En `standard` y `full`, decide si se invoca `sddf-constitution`. |
| Skills instalados | Aportan los templates compartidos y, en `full`, el scaffold opcional de `memory-system`. |

Ante el layout legado `docs/specs/` el skill avisa, remite a `docs/guides/artifact-directory-migration.md` y termina sin escribir.

## Usage

```
# Inicialización habitual
/sddf-init

# Bootstrap mínimo, apto para automatización no interactiva
/sddf-init --level minimal

# Inicialización estándar explícita
/sddf-init --level standard

# Inicialización estándar más las capas de memoria
/sddf-init --level full
```

En los niveles `standard` y `full`, el skill pregunta si debe inicializar los documentos de políticas. Responde `s` o `sí` para ejecutar `/sddf-constitution`, o `n` o `no` para omitirlo.

## Output

El skill informa cada resultado como `[CREADO]`, `[YA EXISTÍA]` u `[OMITIDO]` y cierra con un informe consolidado.

Puede crear los directorios `specs/flow/`, `specs/flow/archive/`, `specs/living/` y `workflow/` (cada uno con `.gitkeep`) y `docs/templates/`; hasta cinco templates compartidos; `sddf.config.yaml`; y `.env.template`. Si se aceptan las políticas, también genera sus artefactos, incluida la constitución y los guardrails DoD. El nivel `full` puede añadir el scaffold de memoria.

Los archivos y directorios existentes se preservan: una ejecución posterior informa que el entorno ya estaba inicializado y no requiere cambios.

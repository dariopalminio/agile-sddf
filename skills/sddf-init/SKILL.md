---
name: sddf-init
description: >-
  Inicializa el entorno SDDF: crea directorios base, sddf.config.yaml y .env.template. Idempotente.
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
- Cuando se necesita bootstrapear una raíz de artefactos declarada

---

## Restricciones / Reglas

- NO modifique ningún archivo existente en el código fuente (estamos en etapa de inicialización de especificaciones, no de implementación)
- NO genere código; estas iniciando el entorno SDDF, no implementando los artefactos técnicos
- No inicializa repositorio git
- No instala dependencias
- Una fuente de raíz explícita inválida detiene el bootstrap antes de cualquier escritura.

---

## Protocolo de inicialización

### Paso 1 — Resolver contexto local y raíz de bootstrap

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Determinar `REPO_ROOT` antes de leer configuración. Resolver la raíz una única vez, sin
exportarla a otros procesos:

1. Si `SDDF_ROOT` está definida, debe ser no vacía y resolver a un directorio accesible.
   - Si no es utilizable, emitir `[ERROR] SDDF_ROOT no es utilizable: <valor>` y detener
     sin crear archivos ni directorios.
   - Si es válida, usarla como `SPECS_BASE` y registrar `ROOT_SOURCE = SDDF_ROOT`.
   - Si además no existe `<REPO_ROOT>/sddf.config.yaml`, detener antes de escribir:
     ```
     [ERROR] SDDF_ROOT está definida pero no existe sddf.config.yaml
     Quita el override para inicializar el valor por defecto o declara primero una raíz versionada.
     ```
     El bootstrap no persiste un override temporal de CI o de una sesión local.
2. Solo si `SDDF_ROOT` no está definida, leer `<REPO_ROOT>/sddf.config.yaml`.
   - Si declara `root` como escalar no vacío, las rutas relativas se normalizan contra
     `REPO_ROOT` y se registra `ROOT_SOURCE = sddf.config.yaml`.
   - Una clave `root` vacía, no escalar, YAML ilegible o una ruta absoluta/externa
     inexistente es un error accionable sin escrituras.
   - Como excepción de bootstrap, un `root` relativo dentro de `REPO_ROOT` puede no
     existir aún: `sddf-init` crea esa raíz junto con el esqueleto estándar.
3. Si no existe configuración o no declara `root`, usar `docs` relativo a `REPO_ROOT`
   y registrar `ROOT_SOURCE = default`.

`CLI_ROOT` se resuelve independientemente y solo para copiar templates desde los skills
instalados; nunca se deriva de `SPECS_BASE`.

### Paso 2 — Crear directorios base

Para cada uno de los siguientes directorios bajo `SPECS_BASE`:
- `specs/01-projects/`
- `specs/02-epics/`
- `specs/03-stories/`
- `templates/`

Verificar si el directorio existe:
- **No existe:** crearlo y registrar `[CREADO]  <ruta>`
- **Ya existe:** no modificarlo y registrar `[YA EXISTÍA]  <ruta>`

Si algún directorio requiere rutas intermedias (ej. `SPECS_BASE/specs/`), crearlas también.

> `templates/` es una capa hermana de `specs/`, no un subdirectorio suyo: los templates son meta-artefactos que definen la estructura de otros artefactos. Ver [ADR-0007](../../docs/adr/ADR-0007-templates-como-capa-propia.md).

### Paso 2b — Copiar templates compartidos al directorio central

Copiar los templates compartidos desde el `assets/` de su skill dueño. Esta tabla es la fuente de verdad de qué se centraliza:

| Template | Skill dueño (origen) |
|----------|---------------------|
| `story-template.md` | `$CLI_ROOT/skills/story-creation/assets/` |
| `epic-template.md` | `$CLI_ROOT/skills/epic-creation/assets/` |
| `project-template.md` | `$CLI_ROOT/skills/project-discovery/assets/` |
| `project-intent-template.md` | `$CLI_ROOT/skills/project-begin/assets/` |
| `project-plan-template.md` | `$CLI_ROOT/skills/project-planning/assets/` |

Para cada template:
- **No existe en `SPECS_BASE/templates/`:** copiarlo desde el origen y registrar `[CREADO]  <ruta destino>`
- **Ya existe en el destino:** no sobrescribirlo (puede contener personalizaciones del proyecto) y registrar `[YA EXISTÍA]  <ruta destino>`
- **El origen no existe (skill dueño no instalado):** emitir `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` y continuar sin bloquear.

### Paso 3 — Generar sddf.config.yaml

Verificar si `<REPO_ROOT>/sddf.config.yaml` existe en la raíz del proyecto:
- **No existe (o existe vacío):**
  - Crear `sddf.config.yaml` usando exactamente el contenido del template en `$CLI_ROOT/skills/sddf-init/assets/sddf.config.yaml.template`. El template declara explícitamente `profile: core` y `stack: node-markdown`; no activa workers de extensión ni comandos requeridos.
  - Registrar `[CREADO]  sddf.config.yaml`
- **Ya existe con contenido:**
  - No sobrescribirlo ni reemplazar una clave `root` existente.
  - Registrar `[YA EXISTÍA]  sddf.config.yaml` y emitir `[INFO] sddf.config.yaml ya existe — se mantiene sin cambios`.

### Paso 4 — Generar .env.template

Verificar si `.env.template` existe en la raíz del proyecto:
- **No existe:**
  - Crear `.env.template` con el siguiente contenido exacto:
    ```
    # SDDF_ROOT es un override opcional de la raíz versionada en sddf.config.yaml.
    # Déjalo sin definir para usar `root` (o docs cuando la clave no existe).
    # Úsalo, por ejemplo, en CI: export SDDF_ROOT=artefactos-ci
    #
    # Una ruta explícita debe existir y ser accesible; no hay fallback silencioso.
    ```
  - Registrar `[CREADO]  .env.template`
- **Ya existe:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  .env.template` y emitir `[INFO] .env.template ya existe — se mantiene sin cambios`

### Paso 5 — Inicializar políticas del proyecto (opcional)

Preguntar al usuario:

```
¿Deseas inicializar los documentos de políticas del proyecto?
(constitution.md y dod-story.md en $SPECS_BASE/policies/)

  (s) Sí — ejecutar project-policies-generation ahora
  (n) No — omitir este paso
```

- **Si el usuario responde `s` / `sí`:** invocar el skill `project-policies-generation` y esperar a que complete su ejecución antes de continuar al Paso 6.
- **Si el usuario responde `n` / `no`:** omitir este paso y continuar directamente al Paso 6. Registrar `[OMITIDO] project-policies-generation` en el informe final.

> Las políticas pueden inicializarse en cualquier momento ejecutando `/project-policies-generation` de forma independiente.

### Paso 6 — Informe final

Emitir el informe consolidado con todos los artefactos verificados:

```
── sddf-init ────────────────────────────────────
[CREADO]     {SPECS_BASE}/specs/01-projects/
[CREADO]     {SPECS_BASE}/specs/02-epics/
[YA EXISTÍA] {SPECS_BASE}/specs/03-stories/
[CREADO]     {SPECS_BASE}/templates/
[CREADO]     {SPECS_BASE}/templates/story-template.md
[CREADO]     {SPECS_BASE}/templates/epic-template.md
[CREADO]     {SPECS_BASE}/templates/project-template.md
[CREADO]     {SPECS_BASE}/templates/project-intent-template.md
[CREADO]     {SPECS_BASE}/templates/project-plan-template.md
[CREADO]     sddf.config.yaml
[CREADO]     .env.template
[CREADO]     docs/policies/constitution.md
[CREADO]     docs/policies/dod-story.md
─────────────────────────────────────────────────
```

**Si se creó al menos un artefacto:**
```
✓ Entorno SDDF inicializado correctamente en {SPECS_BASE}/
```

**Si todos los artefactos ya existían:**
```
✓ Entorno ya inicializado — sin cambios necesarios
```

Terminar la ejecución. El diagnóstico explícito está disponible en `/skill-preflight`;
el usuario también puede continuar directamente con cualquier skill SDDF.

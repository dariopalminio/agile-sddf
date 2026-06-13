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
sddf-init → skill-preflight → [cualquier skill SDDF]
```

**Usar cuando:**
- Al configurar SDDF en un proyecto nuevo por primera vez
- Cuando `skill-preflight` reporta que faltan directorios base

---

## Restricciones / Reglas

- NO modifique ningún archivo existente en el código fuente (estamos en etapa de inicialización de especificaciones, no de implementación)
- NO genere código; estas iniciando el entorno SDDF, no implementando los artefactos técnicos
- No inicializa repositorio git
- No instala dependencias

---

## Protocolo de inicialización

### Paso 1 — Resolver SDDF_ROOT y determinar SPECS_BASE

1. Leer la variable de entorno `SDDF_ROOT`.
2. **Si `SDDF_ROOT` no está definida:**
   - Establecer `SPECS_BASE = docs`
3. **Si `SDDF_ROOT` está definida y la ruta existe:**
   - Establecer `SPECS_BASE = <valor de SDDF_ROOT>`
4. **Si `SDDF_ROOT` está definida pero la ruta NO existe:**
   - Emitir:
     ```
     [ERROR] SDDF_ROOT apunta a ruta inexistente: <ruta>
     Corrige SDDF_ROOT o elimina la variable para usar docs/ como valor por defecto
     ```
   - **Detener la ejecución. No crear ningún directorio ni archivo.**

### Paso 2 — Crear directorios de specs

Para cada uno de los siguientes directorios bajo `SPECS_BASE`:
- `specs/projects/`
- `specs/releases/`
- `specs/stories/`

Verificar si el directorio existe:
- **No existe:** crearlo y registrar `[CREADO]  <ruta>`
- **Ya existe:** no modificarlo y registrar `[YA EXISTÍA]  <ruta>`

Si algún directorio requiere rutas intermedias (ej. `SPECS_BASE/specs/`), crearlas también.

### Paso 2b — Copiar templates compartidos al directorio central

Crear `SPECS_BASE/specs/templates/` si no existe (registrar `[CREADO]` / `[YA EXISTÍA]`).

Copiar los templates compartidos desde el `assets/` de su skill dueño. Esta tabla es la fuente de verdad de qué se centraliza:

| Template | Skill dueño (origen) |
|----------|---------------------|
| `story-template.md` | `.claude/skills/story-creation/assets/` |
| `release-spec-template.md` | `.claude/skills/release-creation/assets/` |
| `project-template.md` | `.claude/skills/project-discovery/assets/` |
| `project-intent-template.md` | `.claude/skills/project-begin/assets/` |
| `project-plan-template.md` | `.claude/skills/project-planning/assets/` |

Para cada template:
- **No existe en `SPECS_BASE/specs/templates/`:** copiarlo desde el origen y registrar `[CREADO]  <ruta destino>`
- **Ya existe en el destino:** no sobrescribirlo (puede contener personalizaciones del proyecto) y registrar `[YA EXISTÍA]  <ruta destino>`
- **El origen no existe (skill dueño no instalado):** emitir `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)` y continuar sin bloquear.

### Paso 3 — Generar sddf.config.yaml

Verificar si `sddf.config.yaml` existe en la raíz del proyecto:
- **No existe (o existe vacío):**
  - Crear `sddf.config.yaml` usando exactamente el contenido del template en `.claude/skills/sddf-init/assets/sddf.config.yaml.template`
  - Registrar `[CREADO]  sddf.config.yaml`
- **Ya existe con contenido:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  sddf.config.yaml` y emitir `[INFO] sddf.config.yaml ya existe — se mantiene sin cambios`

### Paso 4 — Generar .env.template

Verificar si `.env.template` existe en la raíz del proyecto:
- **No existe:**
  - Crear `.env.template` con el siguiente contenido exacto:
    ```
    # SDDF_ROOT — directorio raíz de los artefactos SDDF
    # Valor por defecto si no se define: docs
    # Ejemplos válidos: docs | .sdd | custom/specs
    #
    # Para aplicar, copia esta línea en tu archivo .env local o exporta la variable:
    #   export SDDF_ROOT=docs
    #
    SDDF_ROOT=docs
    ```
  - Registrar `[CREADO]  .env.template`
- **Ya existe:**
  - No sobrescribirlo
  - Registrar `[YA EXISTÍA]  .env.template` y emitir `[INFO] .env.template ya existe — se mantiene sin cambios`

### Paso 5 — Inicializar políticas del proyecto (opcional)

Preguntar al usuario:

```
¿Deseas inicializar los documentos de políticas del proyecto?
(constitution.md y definition-of-done-story.md en $SPECS_BASE/policies/)

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
[CREADO]     docs/specs/projects/
[CREADO]     docs/specs/releases/
[YA EXISTÍA] docs/specs/stories/
[CREADO]     docs/specs/templates/
[CREADO]     docs/specs/templates/story-template.md
[CREADO]     docs/specs/templates/release-spec-template.md
[CREADO]     docs/specs/templates/project-template.md
[CREADO]     docs/specs/templates/project-intent-template.md
[CREADO]     docs/specs/templates/project-plan-template.md
[CREADO]     sddf.config.yaml
[CREADO]     .env.template
[CREADO]     docs/policies/constitution.md
[CREADO]     docs/policies/definition-of-done-story.md
─────────────────────────────────────────────────
```

**Si se creó al menos un artefacto:**
```
✓ Entorno SDDF inicializado correctamente en docs/
```

**Si todos los artefactos ya existían:**
```
✓ Entorno ya inicializado — sin cambios necesarios
```

Terminar la ejecución. El usuario puede continuar con `skill-preflight` o cualquier skill SDDF.

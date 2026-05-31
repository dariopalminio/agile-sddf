---
name: sddf-init
description: "Inicializa el entorno SDDF en un proyecto nuevo: crea la estructura de directorios base (`<SPECS_BASE>/specs/projects/`, `<SPECS_BASE>/specs/releases/`, `<SPECS_BASE>/specs/stories/`), genera `sddf.config.yaml` con la configuración operacional del framework y `.env.template` documentando `SDDF_ROOT`, y opcionalmente inicializa las políticas del proyecto (`constitution.md`, `definition-of-done-story.md`) invocando `project-policies-generation`. Idempotente — no sobrescribe archivos ni directorios existentes."
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

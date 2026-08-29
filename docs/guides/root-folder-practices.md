---
type: guide
slug: root-folder-practices
title: "Prácticas de gestión del directorio raíz de SDDF"
date: 2026-05-01
status: null
substatus: null
parent: null
related:
  - organization-of-artifacts
---
<!-- Referencias -->
[[organization-of-artifacts]]

## 📁 Prácticas de gestión del directorio raíz de SDDF

Este documento define cómo se configura el directorio raíz de especificaciones en el framework SDDF (Spec-Driven Development Framework). El objetivo es permitir que diferentes proyectos o usuarios usen ubicaciones distintas sin modificar los skills o scripts internos.

### Flujo de onboarding recomendado

Al configurar SDDF en un proyecto nuevo, ejecutar los siguientes skills en orden:

```
/sddf-init           → Crea directorios base y archivos de configuración
/openspec-init-config → Carga el contexto del proyecto en openspec/config.yaml
/skill-preflight     → Verifica que el entorno está correcto (se ejecuta automáticamente antes de cada skill)
```

El skill `sddf-init` es idempotente: puede ejecutarse múltiples veces sin efectos destructivos.

---

---

### 1. Variable de entorno `SDDF_ROOT`

La variable de entorno que define la raíz base de los artefactos SDDF es:

```bash
SDDF_ROOT
```

**Valor por defecto:** `docs` (si la variable no está definida).

Los artefactos de especificación se guardan dentro de la subcarpeta `specs/` de esta raíz.

- Si `SDDF_ROOT=docs`, la ruta completa es `$SPECS_BASE/specs/`.
- Si `SDDF_ROOT=.sdd`, la ruta completa es `.sdd/specs/`.
- Si `SDDF_ROOT=./custom`, la ruta completa es `./custom/specs/`.

La estructura dentro de `specs/` sigue la estrategia definida en el documento de organización de artefactos:

```
${SDDF_ROOT}/specs/
├── projects/
├── releases/
└── stories/
```

---

### 2. Cómo establecer la variable

#### En Linux / macOS (bash, zsh)

```bash
# Temporal (solo para la sesión actual)
export SDDF_ROOT="docs"

# Permanente (añadir a ~/.bashrc, ~/.zshrc, etc.)
echo 'export SDDF_ROOT="docs"' >> ~/.bashrc
```

#### En Windows (PowerShell)

Definirla a nivel de usuario (persistente, recomendada):
```powershell
[System.Environment]::SetEnvironmentVariable("SDDF_ROOT", "docs", "User")
[System.Environment]::GetEnvironmentVariable("SDDF_ROOT", "User")
```

#### En un archivo `.env` para desarrollo local

Puedes crear un archivo `.env` en la raíz del proyecto y cargarlo antes de ejecutar scripts. Ejemplo:

```
SDDF_ROOT=docs
```
#### En Claude Code

Configurarla en .claude/settings.local.json

Agrega la variable directamente al entorno de Claude Code:

{
  "env": {
    "SDDF_ROOT": ".sdd"
  }
}

---

### 3. Uso dentro de skills o scripts

#### Uso dentro de skills

```bash
# Tomar variable o usar valor por defecto
SPECS_BASE="${SDDF_ROOT:-docs}"

# Ruta completa a los proyectos
PROJECTS_DIR="$SPECS_BASE/specs/projects"
```

#### En scripts de shell (recomendado para Claude Code skills)

```bash
# Obtener la raíz base, con valor por defecto "docs"
SPECS_BASE="${SDDF_ROOT:-docs}"

# Ruta completa a los projects
PROJECTS_DIR="$SPECS_BASE/specs/projects"

# Ejemplo: crear un nuevo proyecto
mkdir -p "$PROJECTS_DIR/PROJ-001"
```

#### En scripts Node.js

```javascript
const SPECS_BASE = process.env.SDDF_ROOT || 'docs';
const PROJECTS_DIR = `${SPECS_BASE}/specs/projects`;
```

#### En scripts Python

```python
import os

SPECS_BASE = os.environ.get('SDDF_ROOT', 'docs')
PROJECTS_DIR = os.path.join(SPECS_BASE, 'specs', 'projects')
```

---

### 4. Precedencia de la configuración

Para maximizar la flexibilidad, se recomienda el siguiente orden de prioridad (de mayor a menor):

1. **Variable de entorno** `SDDF_ROOT`.
2. **Archivo de configuración** del proyecto, por ejemplo `.sddconf.json` (opcional).
3. **Valor por defecto** (`docs`).

Ejemplo de `.sddconf.json`:

```json
{
  "specs_root": "docs"
}
```

Si se implementa este archivo, la lógica de carga sería:

```bash
# Si existe archivo de configuración, leerlo (con jq o similar)
if [ -f ".sddconf.json" ]; then
   SPECS_BASE=$(jq -r '.specs_root' .sddconf.json)
fi
# La variable de entorno tiene prioridad
SPECS_BASE="${SDDF_ROOT:-$SPECS_BASE}"
SPECS_BASE="${SPECS_BASE:-docs}"
```

---

### 5. Buenas prácticas

- **Documentar la variable** en el `README.md` del proyecto.
- **No hardcodear rutas** en los skills; usar siempre `$SDDF_ROOT`.
- **Para entornos de CI/CD**, establecer la variable como secreto o en la configuración del pipeline.
- **En Dev Containers / Codespaces**, definir la variable en `devcontainer.json` o en el archivo `.env`.

---

### 6. Coexistencia con otras herramientas (Speckit, OpenSpec)

Speckit usa la ruta fija `.specify/`. OpenSpec usa `openspec/`. SDDF permite definir su propia raíz, lo que evita conflictos.

Ejemplo de un proyecto que mezcla herramientas:

```
mi-proyecto/
├── .specify/          # Speckit
├── openspec/          # OpenSpec
├── docs/
│   └── specs/         # SDDF (porque SDDF_ROOT=docs)
│       ├── projects/
│       ├── releases/
│       └── stories/
└── ...
```

Para cambiar SDDF a una raíz diferente (ej. `.sdd`), basta con `export SDDF_ROOT=.sdd`.

---

### 7. Resumen rápido

| Concepto | Valor / Acción |
|----------|----------------|
| **Variable** | `SDDF_ROOT` |
| **Valor por defecto** | `docs` |
| **Ruta completa de artefactos** | `${SDDF_ROOT}/specs/` |
| **Cómo definir** | `export SDDF_ROOT=.sdd` |
| **Uso en scripts** | `SPECS_BASE="${SDDF_ROOT:-docs}"` |
| **Precedencia** | Variable de entorno > archivo de configuración > defecto |

---

## ✅ Conclusión

La configuración mediante `SDDF_ROOT` es flexible, portable y se alinea con las prácticas de herramientas como Speckit y OpenSpec. Permite a cada proyecto o usuario decidir dónde guardar sus artefactos sin modificar los skills ni scripts del framework.
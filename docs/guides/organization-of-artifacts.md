---
type: guide
slug: organization-of-artifacts
title: "Reglas de la estrategia de organización de artefactos (SDDF)"
date: 2026-05-01
status: null
substatus: null
parent: null
related:
  - root-folder-practices
---
<!-- Referencias -->
[[root-folder-practices]]

## 📁 Reglas de la estrategia de organización de artefactos (SDDF)

Este documento define las reglas para organizar los artefactos de especificación (proyectos, releases, historias) en un repositorio que sigue el framework SDDF. La estrategia está inspirada en OpenSpec y SpecKit, pero adaptada para manejar tres niveles jerárquicos con máxima flexibilidad.

---

### 1. Directorio raíz de especificaciones

Todos los artefactos se guardan bajo un directorio raíz configurable. Por defecto se usa:

```
docs/specs/
```

Puedes cambiarlo, pero esta documentación asume `$SPECS_BASE/specs/`. A partir de aquí, se representa como `{SPECS_ROOT}`.

---

### 2. Tipos de workitem y sus carpetas

Existen tres tipos de workitem: **Project**, **Release** y **Story**. Cada tipo tiene su propia carpeta contenedora dentro de `{SPECS_ROOT}`:

```
{SPECS_ROOT}/
├── projects/      # Contiene todos los proyectos
├── releases/      # Contiene todos los releases (epics)
└── stories/       # Contiene todas las historias (user stories)
```

Dentro de cada carpeta de tipo, cada workitem individual se guarda en su **propio directorio**, cuyo nombre es el identificador único (ID) del workitem.

```
{SPECS_ROOT}/
├── projects/
│   └── PROJ-001-nombre-project/          # directorio del proyecto PROJ-001
├── releases/
│   └── EPIC-001-nombre-release/          # directorio del release EPIC-001
└── stories/
    └── STORY-001-nombre-story/         # directorio de la historia STORY-001
```

Por ejemplo:
docs\specs\projects\PROJ-01-nombre-project\release.md 
docs\specs\projects\PROJ-01-nombre-project\project-intent.md
docs\specs\projects\PROJ-01-nombre-project\project-plan.md
docs\specs\projects\PROJ-01-nombre-project\story-map.md
docs\specs\releases\EPIC-01-nombre-release\release.md 
docs\specs\stories\FEAT-001-nombre-story\story.md 


---

### 3. Identificadores (IDs)

- **Formato:** solo caracteres alfanuméricos, guiones (`-`) y guiones bajos (`_`). Sin espacios.
- **Unicidad:** Los IDs deben ser únicos **globalmente** en todo el `{SPECS_ROOT}`, independientemente del tipo. Por ejemplo, no puede haber un proyecto `PROJ-001` y una release `PROJ-001` al mismo tiempo.
- **Recomendación:** Usar prefijos claros: `PROJ-`, `EPIC-`, `STORY-`. Los números pueden ser secuenciales o basados en un sistema externo (Jira, GitHub).

Ejemplos válidos:
- `PROJ-001`
- `EPIC-001`
- `STORY-001`

---

### 4. Contenido de cada directorio de workitem

Dentro de cada directorio de workitem se guardan todos los artefactos relacionados con ese workitem: especificación, plan, tareas, pruebas, etc. No hay restricción sobre los nombres de archivo, pero se recomienda seguir estas convenciones:

| Tipo de workitem | Archivo principal | Archivos comunes |
|------------------|-------------------|------------------|
| **Project** | `project.md` | `plan.md`, `constitution.md` |
| **Release** | `release.md` | `plan.md`, `notes.md` |
| **Story** | `story.md` | `tasks.md`, `tests.md`, `design.md` |

Cada archivo que contenga información relevante para el trabajo debe **comenzar con un bloque frontmatter YAML** (ver sección 5).

---

### 5. Frontmatter obligatorio

Todos los archivos `.md` dentro de los directorios de workitem deben incluir frontmatter YAML. Campos mínimos requeridos:

```yaml
---
type: project | release | story
id: string            # mismo que el nombre del directorio
title: string         # título legible
status: BACKLOG | IN_PROGRESS | COMPLETED | ARCHIVED
parent: string | null   # ID del workitem padre (ver sección 6)
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Campos opcionales pero recomendados:**
- `tags: [tag1, tag2]`
- `priority: alta | media | baja`

---

### 6. Relaciones jerárquicas (padre-hijo)

La jerarquía entre workitems se define **únicamente mediante el campo `parent` en el frontmatter**. No se utiliza el anidamiento de directorios.

**Reglas:**
- Un **Project** no tiene padre (`parent: null`).
- Un **Release** debe tener como padre un **Project** válido (`parent: PROJ-001`).
- Una **Story** puede tener como padre un **Release** válido (`parent: EPIC-001`). Opcionalmente, puede tener como padre un **Project** (`parent: PROJ-001`) si aún no está asignada a un release concreto.

**Ejemplo de frontmatter para una story no asignada aún a un release:**
```yaml
---
type: story
id: STORY-001
title: "Mejorar rendimiento del login"
status: BACKLOG
parent: PROJ-001   # padre es el proyecto, no un release
created: 2025-05-01
updated: 2025-05-01
---
```

Cuando la story se asigne a un release, bastará con cambiar el `parent` al ID del release y, opcionalmente, mover el directorio (no obligatorio). La estructura de directorios puede permanecer plana.

---

### 7. Resolución de rutas y búsqueda de workitems

Dado que todos los workitems están en carpetas separadas por tipo, para encontrar un workitem por su ID se debe buscar en las tres carpetas (`projects/`, `releases/`, `stories/`). **Orden de búsqueda recomendado para IAs:**

1. Buscar en `stories/` (por ser el nivel más bajo y numeroso).
2. Si no se encuentra, buscar en `releases/`.
3. Si no se encuentra, buscar en `projects/`.

Para facilitar la búsqueda, se puede mantener un archivo de índice `{SPECS_ROOT}/index.md` que liste todos los workitems con sus rutas y metadatos. Este índice puede generarse automáticamente mediante un script o skill.

---

### 8. Enlaces entre workitems (wikilinks)

- Usa la sintaxis `[[ID]]` para enlazar a otro workitem.
- El enlace debe resolverse al archivo principal del workitem (por ejemplo, `project.md` para un proyecto, `release.md` para un release, `story.md` para una historia). Si dentro del directorio hay varios archivos, el archivo principal se determina por el tipo (ver sección 4).

**Ejemplo:** Desde una historia, para enlazar a su release, escribir `[[EPIC-001]]`. El enlace apuntará a `{SPECS_ROOT}/releases/EPIC-001/release.md`.

**Resolución para IAs:**  
Dado un ID, buscar en los directorios de tipo según el orden de la sección 7. Si hay ambigüedad (mismo ID en dos tipos), se resuelve según la prioridad: primero stories, luego releases, luego projects. Para evitar ambigüedades, se recomienda usar IDs únicos globalmente.

---

### 9. Índice central (opcional pero recomendado)

Para acelerar la navegación tanto humana como de IAs, se puede generar un archivo `{SPECS_ROOT}/index.md` que contenga:

- Una tabla o lista con todos los workitems, su tipo, estado, padre y ruta.
- Un mapa de la jerarquía (por ejemplo, usando listas anidadas generadas a partir de los campos `parent`).

Este índice debe **actualizarse automáticamente** cada vez que se crea, modifica o elimina un workitem.

---

### 10. Reglas de validación (checklist)

| Regla | Verificación |
|-------|--------------|
| ¿Todo workitem está dentro de `projects/`, `releases/` o `stories/`? | ⬜ |
| ¿El nombre del directorio coincide con el campo `id` del frontmatter? | ⬜ |
| ¿Cada archivo `.md` principal comienza con frontmatter YAML? | ⬜ |
| ¿Los campos obligatorios (`type`, `id`, `title`, `status`, `parent`, `created`, `updated`) están presentes? | ⬜ |
| ¿El formato de fechas es `YYYY-MM-DD`? | ⬜ |
| ¿El `parent` existe (si no es null) y es del tipo adecuado (proyecto para release, release o proyecto para story)? | ⬜ |
| ¿Los IDs son únicos globalmente? | ⬜ |
| ¿Los wikilinks `[[ID]]` apuntan a workitems existentes? | ⬜ |

---

### 11. Resumen visual de la estrategia

```
docs/specs/
├── projects/
│   └── PROJ-001/
│       ├── project.md          (frontmatter: type=project, parent=null)
│       └── plan.md (opcional)
├── releases/
│   └── EPIC-001/
│       ├── release.md          (frontmatter: type=release, parent=PROJ-001)
│       └── notes.md
└── stories/
    ├── STORY-001/
    │   ├── story.md            (frontmatter: type=story, parent=EPIC-001)
    │   ├── tasks.md
    │   └── tests.md
    └── STORY-002/
        └── story.md            (frontmatter: type=story, parent=PROJ-001)
```

---

## ✅ Conclusión

Esta estrategia combina la **flexibilidad de OpenSpec y SpecKit** (directorio por workitem, metadatos para relaciones) con la **claridad de separar tipos** en carpetas distintas. Es ideal para equipos que trabajan con múltiples niveles jerárquicos (proyecto → release → story) y necesitan poder refinar historias sin asignarlas a un release concreto. La estructura es fácil de entender para humanos y de procesar para IAs, especialmente si se complementa con un índice central generado automáticamente.
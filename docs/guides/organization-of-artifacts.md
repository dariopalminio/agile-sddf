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
  - asegurar-dos-niveles-de-flujo-epics-stories
---
<!-- Referencias -->
[[root-folder-practices]]

## 📁 Reglas de la estrategia de organización de artefactos (SDDF)

Este documento define las reglas para organizar los artefactos de especificación de un repositorio SDDF. Los únicos work items son las épicas y las historias; el nivel estratégico se documenta en `product/` y `requirements/`, no como un work item.

---

### 1. Directorio raíz de work items

Los work items se guardan en un directorio fijo de la raíz del repositorio ([ADR-0016](../adr/ADR-0016-layout-fijo-de-tres-raices.md)); no es configurable:

```
specs/flow/
```

A partir de aquí se representa como `{SPECS_ROOT}`. La visión, stakeholders, objetivos, roadmap y story map viven en `docs/product/`; los requisitos viven en `docs/requirements/`. Las raíces del repositorio se describen en [[root-folder-practices]].

---

### 2. Tipos de work item y sus carpetas

Existen dos tipos de work item: **Épica** y **Story**. Ambos son hermanos dentro de `{SPECS_ROOT}`, sin carpetas por tipo: cada work item se guarda en su **propio directorio**, cuyo nombre comienza con su identificador único. Las historias `COMPLETED` y `CANCELED` (con `substatus: DONE`) se archivan en `{SPECS_ROOT}/archive/` conservando su status, con la fecha de `updated:`, `created:` o `date:` como prefijo (ADR-0017):

```
{SPECS_ROOT}/
├── EPIC-001-nombre-epica/                     # directorio de la épica EPIC-001
├── STORY-001-nombre-story/                    # directorio de la historia STORY-001
└── archive/
    └── 2026-05-01-STORY-002-otra-story/       # historia COMPLETED o CANCELED archivada
```

Por ejemplo:

```
specs/flow/EPIC-001-nombre-epica/epic.md
specs/flow/STORY-001-nombre-story/story.md
```

Las épicas no se archivan.

El modelo histórico de tres niveles está retirado; para migrarlo se usa `/memory-system migrate --from=specs-3-levels`. Véase [[asegurar-dos-niveles-de-flujo-epics-stories]].


---

### 3. Identificadores (IDs)

- **Formato:** solo caracteres alfanuméricos, guiones (`-`) y guiones bajos (`_`). Sin espacios.
- **Unicidad:** los IDs de work items deben ser únicos **globalmente** en todo `{SPECS_ROOT}`.
- **Work items:** usar los prefijos `EPIC-` y `STORY-`. Los números pueden ser secuenciales o basados en un sistema externo (Jira, GitHub).
- **Requisitos:** `FR-` y `NFR-` identifican requisitos funcionales y no funcionales en `requirements/`; no son work items ni se almacenan bajo `{SPECS_ROOT}`.

Ejemplos válidos:
- `EPIC-001`
- `STORY-001`
- `FR-001`
- `NFR-001`

---

### 4. Contenido de cada directorio de work item

Dentro de cada directorio de work item se guardan todos los artefactos relacionados con ese trabajo: especificación, diseño, tareas, pruebas e informes. Los archivos canónicos son:

| Tipo de work item | Archivo principal | Archivos comunes |
|------------------|-------------------|------------------|
| **Épica** | `epic.md` | `notes.md`, informes de análisis |
| **Story** | `story.md` | `design.md`, `tasks.md`, `testcases.md`, informes |

Cada archivo que contenga información relevante para el trabajo debe **comenzar con un bloque frontmatter YAML** (ver sección 5).

---

### 5. Frontmatter obligatorio

Todos los archivos principales de work item deben incluir frontmatter YAML. Campos mínimos requeridos:

```yaml
---
type: epic | story
id: string              # mismo ID que identifica el directorio
title: string           # título legible
status: string          # etapa del ciclo SDDF
parent: string | null   # ID de la épica padre (ver sección 6)
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Campos opcionales pero recomendados:**

- `kind: feat | fix | chore | hotfix` para historias.
- `tags: [tag1, tag2]`.
- `priority: alta | media | baja`.

---

### 6. Relaciones jerárquicas (padre-hijo)

La jerarquía entre work items se define **únicamente mediante el campo `parent` en el frontmatter**. No se utiliza el anidamiento de directorios.

**Reglas:**

- Una **Épica** no tiene padre (`parent: null`).
- Una **Story** tiene como padre una **Épica** válida (`parent: EPIC-001`).

**Ejemplo de frontmatter para una story:**
```yaml
---
type: story
id: STORY-001
title: "Mejorar rendimiento del login"
status: SPECIFY
parent: EPIC-001
created: 2025-05-01
updated: 2025-05-01
---
```

La estructura de directorios permanece plana: el vínculo padre-hijo se expresa en el frontmatter y se refleja bidireccionalmente en la documentación de la épica y de la story.

---

### 7. Resolución de rutas y búsqueda de work items

Para encontrar un work item por su ID se busca el directorio cuyo nombre empieza por el ID seguido de guion. **Orden de búsqueda recomendado para IAs:**

1. Buscar `{SPECS_ROOT}/<ID>-*/`.
2. Si no se encuentra y es una historia, buscar `{SPECS_ROOT}/archive/*-<ID>-*/`.
Para facilitar la navegación, `docs/index.md` contiene el índice generado de artefactos y metadatos; se regenera con `/memory-system index`.

---

### 8. Enlaces entre work items (wikilinks)

- Usa la sintaxis `[[ID]]` para enlazar a otro work item.
- El enlace debe resolverse al archivo canónico: `epic.md` para una épica y `story.md` para una historia.

**Ejemplo:** desde una historia, para enlazar a su épica, escribir `[[EPIC-001]]`. El enlace apunta a `{SPECS_ROOT}/EPIC-001-nombre-epica/epic.md`.

**Resolución para IAs:**  
Dado un ID, buscar según el orden de la sección 7. Si se detecta el mismo ID en dos directorios, es un error de integridad que debe corregirse, no una ambigüedad que se resuelva por prioridad.

---

### 9. Índice central

Para acelerar la navegación humana y de IAs, `docs/index.md` lista los work items con su tipo, estado, padre y ruta, además de las capas fundacionales. Lo genera `memory-system`; no se mantiene a mano como fuente de verdad.

---

### 10. Reglas de validación (checklist)

| Regla | Verificación |
|-------|--------------|
| ¿Todo work item está directamente en `specs/flow/` o, si es una historia `COMPLETED`, en `specs/flow/archive/`? | ⬜ |
| ¿El nombre del directorio comienza con el campo `id` del frontmatter? | ⬜ |
| ¿Cada archivo principal (`epic.md` o `story.md`) comienza con frontmatter YAML? | ⬜ |
| ¿Los campos obligatorios (`type`, `id`, `title`, `status`, `parent`, `created`, `updated`) están presentes? | ⬜ |
| ¿El formato de fechas es `YYYY-MM-DD`? | ⬜ |
| ¿Una épica tiene `parent: null` y toda story referencia una épica existente? | ⬜ |
| ¿Los IDs de épicas e historias son únicos globalmente? | ⬜ |
| ¿Los wikilinks `[[ID]]` apuntan a work items existentes? | ⬜ |

---

### 11. Resumen visual de la estrategia

```text
docs/
├── product/                         # visión, stakeholders, objetivos y roadmap
└── requirements/                    # FR-* y NFR-*; no son work items
specs/
└── flow/
    ├── EPIC-001-nombre-epica/
    │   ├── epic.md                  (frontmatter: type=epic, parent=null)
    │   └── notes.md
    ├── STORY-001-nombre-story/
    │   ├── story.md                 (frontmatter: type=story, parent=EPIC-001)
    │   ├── design.md
    │   ├── tasks.md
    │   └── testcases.md
    └── archive/
        └── 2026-05-01-STORY-002-otra-story/
```

---

## ✅ Conclusión

Esta estrategia separa el contexto estratégico del trabajo entregable: `product/` y `requirements/` orientan las épicas, y cada épica agrupa las historias que la materializan. La estructura de dos niveles es simple para equipos e IAs y conserva trazabilidad mediante frontmatter, wikilinks e índice generado.

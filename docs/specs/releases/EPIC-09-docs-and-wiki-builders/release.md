---
type: release
id: EPIC-09
slug: EPIC-09-docs-and-wiki-builders
title: "Release 09 — Docs and Wiki builders"
date: 2026-04-25
status: RELEASED
substatus: READY
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release 09 — Docs and Wiki builders
## Descripción
Skills para generar documentación del proyecto (README.md) y organizar la wiki de documentación del proyecto dentro del directorio `docs/`, con un enfoque en la generación automática de documentación a partir de los artefactos de desarrollo (intención, requisitos, plan) y la organización de la información en una estructura tipo wiki para facilitar el acceso y la navegación. Esto permitirá a los desarrolladores mantener una documentación actualizada y bien organizada, mejorando la comunicación y la colaboración dentro del equipo de una manera AI-Frendly.

## Features
- [x] **FEAT-047: Skills con templates Multicliente y rutas relativas** — Modificar los skills existentes para que usen rutas relativas al directorio del skill para referenciar sus templates, en lugar de rutas absolutas hardcodeadas. Implementar una lógica de fallback para buscar el template en múltiples ubicaciones (SKILL_ROOT, directorios relativos al proyecto, directorio global del usuario) para asegurar la portabilidad y resistencia de los skills en diferentes clientes LLM. _(deps: FEAT-001, FEAT-003, FEAT-004)_
- [x] **FEAT-048: Skill builder** — Crear un skill `skill-master` que pueda crear skills nuevos a partir de un template base, con prompts para personalizar el nombre del skill, descripción, inputs/outputs y generar automáticamente la estructura de archivos (SKILL.md, templates/, etc.) con contenido inicial basado en el template. Inspirarse en skill-master (https://skills.sh/anthropics/skills/skill-master) pero agregando sección de gestión de templates. Esto facilitará la creación de nuevos skills siguiendo las mejores prácticas establecidas y basados en templates. _(deps: FEAT-001, FEAT-003, FEAT-004)_
- [x] **FEAT-042: README.md builder** — Skill `readme-builder` que genera o sobreescribe un README.md completo para el proyecto a partir de los documentos de intención, requisitos, plan o analizando todo el proyecto actual, usando un template específico para README. _(deps: FEAT-001, FEAT-003, FEAT-004)_
- [x] **FEAT-048: Refactoring - Migración de templates a assets en Skills (cumplimiento del estándar Agent Skills)** — Renombrar todas las carpetas `templates/` dentro de los skills a `assets/`, y actualizar las referencias a esas rutas relativas en los archivos `SKILL.md` correspondientes, para cumplir con el estándar oficial de Agent Skills de assets empaquetados por skill que contienen templates. _(deps: FEAT-001, FEAT-003, FEAT-004)_
- [x] **FEAT-043: Encabezado de archivos spec con metadata de estado** — Añadir un encabezado YAML a cada archivo de especificación (`project-intent.md`, `requirement-spec.md`, `project-plan.md`, `release*`, `story*`) con campos específicos estandarizados para trazabilidad y linkeo entre nodos. _(deps: FEAT-008)_
- [x] **FEAT-044: Directorio docs tipo wiki** — Reorganizar el directorio `docs/` para que funcione como una wiki de documentación del proyecto (memoria a largo plazo del proyecto), con subdirectorio specs (memoria de especificaciones) para los artefactos principales de desarrollo, un directorio wiki/ para información de conocimiento profundo (guías, artículos, etc.) y un índice principal que enlace a cada documento. La fuente de verdad son archivos dentro del mismo repositorio. Cada nodo documento es un archivo markdown con frontmatter YAML. Los links internos usan la sintaxis [[slug]] (wikilinks). El índice (index.md) es el cursor principal: Los clientes LLMs IA como Copilot, Claude u Opencode lo leen primero en cada operación para decidir qué nodos abrir, sin leer toda la wiki de una vez. La clave está en que Claude lee el índice primero en cada operación, haciendo que la recuperación sea O(índice) y no O(todos-los-archivos). Se sigue el patrón LLM Wiki - Karpathy. _(deps: FEAT-001, FEAT-003, FEAT-004)_


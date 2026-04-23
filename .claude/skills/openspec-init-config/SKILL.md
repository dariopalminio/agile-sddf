---
name: openspec-init-config
description: Carga el contexto del proyecto en openspec/config.yaml leyendo exhaustivamente la documentación del proyecto (README.md, CLAUDE.md, AGENTS.md). Usar cuando se quiera inicializar o actualizar el contexto de OpenSpec para un proyecto.
license: MIT
compatibility: Requires openspec CLI and openspec/config.yaml present in the project.
metadata:
  author: sddf
  version: "1.0"
---

Carga el contexto del proyecto en `openspec/config.yaml` leyendo la documentación existente.

**Pasos**

1. **Leer exhaustivamente la documentación del proyecto**

   Lee los siguientes archivos en orden, si existen:
   - `README.md` — fuente principal: propósito del proyecto, stack tecnológico, arquitectura, convenciones
   - `CLAUDE.md` — instrucciones del proyecto, estructura de directorios, patrones de agentes y skills
   - `AGENTS.md` — definición de agentes, roles y capacidades
   - Otros archivos relevantes que encuentres en la raíz del proyecto (por ejemplo `package.json`, `pyproject.toml`, etc.) para inferir stack y dependencias

   **IMPORTANTE**: No omitas ninguno de estos archivos si existen. El contexto que escribas será tan bueno como la documentación que leas.

2. **Leer el archivo `openspec/config.yaml`**

   Lee el archivo completo para entender su estructura actual y el template de comentarios que indica cómo rellenar el campo `context:`.

3. **Escribir el campo `context:` en `openspec/config.yaml`**

   Usa la herramienta **Edit** para actualizar **únicamente** el campo `context:` en `openspec/config.yaml`.

   - Si el campo `context:` ya existe, reemplázalo con el nuevo contenido
   - Si el campo `context:` no existe, agrégalo después de la línea `schema: spec-driven`
   - **Preserva intactos** el campo `schema:` y el campo `rules:` (y sus comentarios) — solo modifica `context:`

   El contenido del campo `context:` debe incluir (en formato YAML multiline con `|`):
   - **Stack tecnológico**: lenguajes, frameworks, herramientas principales
   - **Arquitectura**: estructura del proyecto, patrones usados, módulos clave
   - **Convenciones**: naming, commits, organización de archivos, estilo de código
   - **Dominio**: qué hace el proyecto, para quién, cuál es su propósito

   Ejemplo de formato:
   ```yaml
   context: |
     Stack: Python, Markdown, YAML
     Arquitectura: sistema multiagente con skills y agentes especializados
     Convenciones: kebab-case para nombres de archivos, commits convencionales
     Dominio: framework de especificación ágil para proyectos software
   ```

4. **Confirmar resultado**

   Muestra el contenido final del campo `context:` escrito en `openspec/config.yaml` y confirma que el archivo fue actualizado correctamente.

## 1. Template

- [x] 1.1 Crear directorio `.claude/skills/ps-SPECIFY/templates/`
- [x] 1.2 Crear `.claude/skills/ps-SPECIFY/templates/project-template.md` con estructura de secciones (Descripción General, Contexto, Usuarios, Requisitos Funcionales, Requisitos No Funcionales, Referencias, Definiciones) y comentarios `<!-- -->` guía en cada sección

## 2. Agente SPECIFY-agent

- [x] 2.1 Crear `.claude/agents/SPECIFY-agent.md` con frontmatter YAML (`name`, `description`, `tools: [Read, Write, Edit, AskUserQuestion]`, `model: sonnet`)
- [x] 2.2 Implementar Paso 1: leer `$SPECS_BASE/specs/projects/discovery.md` y `.claude/skills/ps-SPECIFY/templates/project-template.md`
- [x] 2.3 Implementar Paso 2: validar campo `**Estado**` en `discovery.md` — Si es `IN‑PROGRESS`, preguntar confirmación con `AskUserQuestion`; si confirma, editar a `DONE`; si rechaza, detener
- [x] 2.4 Implementar Paso 3: extraer headers `##` y comentarios `<!-- -->` del template en runtime para derivar preguntas dinámicamente (sin hardcodear)
- [x] 2.5 Implementar Paso 4: conducir la entrevista sección por sección — pre-rellenar desde `discovery.md`, agrupar máx 3-4 preguntas por ronda
- [x] 2.6 Implementar Paso 5: completar con pericia de PM marcando inferencias con `[inferido]`
- [x] 2.7 Implementar Paso 6: escribir `$SPECS_BASE/specs/projects/project.md` con el template como estructura, metadatos (Versión, Estado, Fecha, Generado por), sin comentarios HTML, y proponer revisión al usuario mencionando `/ps-approve`

## 3. Skill ps-SPECIFY

- [x] 3.1 Crear `.claude/skills/ps-SPECIFY/SKILL.md` con frontmatter de skill
- [x] 3.2 Implementar Paso 1: verificar que `$SPECS_BASE/specs/projects/discovery.md` existe; si no, informar y detener
- [x] 3.3 Implementar Paso 2: verificar que `.claude/skills/ps-SPECIFY/templates/project-template.md` existe; si no, informar y detener
- [x] 3.4 Implementar Paso 3: delegar al `SPECIFY-agent` con instrucciones para leer `discovery.md` y el template, conducir entrevista y escribir `$SPECS_BASE/specs/projects/project.md`
- [x] 3.5 Implementar Paso 4: verificar que `$SPECS_BASE/specs/projects/project.md` existe y confirmar al usuario con mensaje de éxito y próximo paso (`/ps-approve`); si no existe, informar error y sugerir re-ejecutar

## 4. Validación manual

- [x] 4.1 Ejecutar `/ps-SPECIFY` con un `discovery.md` de prueba en Estado `DONE` y verificar que produce `requirement-spec.md` correctamente
- [x] 4.2 Verificar que el template en `.claude/skills/ps-SPECIFY/templates/` no es modificado por el agente
- [x] 4.3 Verificar idempotencia: re-ejecutar `/ps-SPECIFY` con el mismo input produce el mismo output sin duplicar contenido

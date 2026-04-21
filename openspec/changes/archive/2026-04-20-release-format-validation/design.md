## Context

El framework SDDF utiliza archivos de release (`docs/specs/releases/release-*.md`) como input para el skill `generate-stories`. Actualmente no existe ningún gate de calidad que verifique la estructura de estos archivos antes de usarlos. El template canónico `docs/specs/templates/release-spec-template.md` ya existe y usa comentarios HTML (`<!-- sección obligatoria -->`) para marcar qué secciones son obligatorias.

El sistema de skills del proyecto sigue un patrón establecido: un archivo `SKILL.md` define el comportamiento del skill mediante instrucciones en Markdown, sin código subyacente. El skill es ejecutado por el agente primario (sesión Claude) siguiendo las instrucciones del archivo.

## Goals / Non-Goals

**Goals:**
- Validar presencia de secciones obligatorias en un archivo de release
- Producir resultado APROBADO / REFINAR con lista clara de secciones faltantes
- Extraer la lista de secciones obligatorias directamente del template en tiempo de ejecución
- Ser invocable con nombre corto o ruta relativa del archivo

**Non-Goals:**
- Validar el contenido semántico de las secciones (solo verificar presencia)
- Generar ni corregir el contenido del archivo de release
- Validar otros tipos de archivos que no sean releases
- Resolver ambigüedad de múltiples archivos con el mismo nombre (se delega a interacción del usuario)

## Decisions

### Decisión 1: Extraer secciones obligatorias del template en tiempo de ejecución

**Elegido:** El skill lee `docs/specs/templates/release-spec-template.md` y extrae las secciones marcadas con `<!-- sección obligatoria -->` cada vez que se ejecuta.

**Alternativa descartada:** Lista hardcodeada de secciones en `SKILL.md`.

**Rationale:** El template es la fuente de verdad del proyecto. Si el template evoluciona (nuevas secciones obligatorias), el skill las detecta automáticamente sin modificación. Esto es consistente con la filosofía SDDF de templates como contratos dinámicos.

### Decisión 2: Implementar como Skill (SKILL.md), no como script

**Elegido:** Archivo `SKILL.md` con instrucciones en Markdown siguiendo el patrón del proyecto.

**Alternativa descartada:** Script Python/bash.

**Rationale:** El sistema SDDF está diseñado para operar sin código subyacente cuando es posible. Los skills son la abstracción establecida. No hay lógica computacional compleja que justifique un script.

### Decisión 3: Estructura de detección por encabezados Markdown (`##`)

**Elegido:** Verificar presencia de secciones buscando encabezados `##` con el nombre exacto del encabezado.

**Alternativa descartada:** Búsqueda por contenido o regex flexible.

**Rationale:** Los encabezados `##` son el mecanismo estructural de los archivos de release. La verificación por encabezado es determinista, fácil de auditar y resistente a variaciones de contenido.

## Risks / Trade-offs

- **Cambio en formato de comentarios del template** → Mitigation: documentar en SKILL.md que las secciones obligatorias se detectan mediante `<!-- sección obligatoria -->` para que el equipo mantenga coherencia al editar el template.
- **Falso positivo por encabezado mal escrito** → Mitigation: el skill reporta el nombre exacto esperado en el reporte REFINAR, facilitando la corrección manual.
- **Archivo con frontmatter YAML ausente** → Mitigation: verificar los 4 campos del frontmatter (Título, Versión, Estado, Fecha) como condición separada con mensaje explícito.

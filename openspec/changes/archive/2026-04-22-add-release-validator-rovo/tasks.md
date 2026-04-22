## 1. Preparación y referencia

- [x] 1.1 Revisar el archivo `rovo/story-evaluator-agent.md` para confirmar la estructura de secciones vigente (Nombre, Descripción, Comportamiento, Instrucciones)
- [x] 1.2 Revisar el skill `.claude/skills/release-format-validation/SKILL.md` para mapear las fases al equivalente Rovo
- [x] 1.3 Revisar `docs/specs/templates/release-spec-template.md` para extraer el template canónico completo que se incrustará

## 2. Creación del agente Rovo

- [x] 2.1 Crear el archivo `rovo/release-validator-agent.md` con la sección **# Nombre**: `Validador de Release`
- [x] 2.2 Agregar la sección **# Descripción** explicando que el agente valida el formato de la descripción de un Epic tipo release en Jira produciendo APROBADO / REFINAR / RECHAZADO
- [x] 2.3 Agregar la sección **# Comportamiento** definiendo el scope del agente: solo valida Epics tipo release, siempre responde en español, nunca genera ni corrige contenido
- [x] 2.4 Agregar la sección **# Instrucciones** con las fases de validación adaptadas de `release-format-validation`:
  - Fase 0: Resolver el input (nombre/Key de Epic o texto libre)
  - Fase 1: Aplicar el template canónico incrustado para identificar secciones obligatorias
  - Fase 2: Validar presencia de frontmatter (Título, Versión, Estado, Fecha) y secciones `##` obligatorias (Descripción, Features, Flujos Críticos / Smoke Tests)
  - Fase 3: Producir el estado de salida (APROBADO / REFINAR / RECHAZADO) con el formato definido
- [x] 2.5 Incrustar el template canónico completo dentro de la sección Instrucciones bajo el encabezado `## Template canónico (fuente de verdad)` — sin referencias a archivos externos

## 3. Verificación del agente

- [x] 3.1 Verificar que el archivo `rovo/release-validator-agent.md` sigue exactamente la misma convención de secciones que los agentes Rovo existentes
- [x] 3.2 Verificar que los tres estados de salida (APROBADO / REFINAR / RECHAZADO) usan el mismo vocabulario y formato que el skill `/release-format-validation`
- [x] 3.3 Verificar que el template canónico incrustado incluye todas las secciones obligatorias: Título, Versión, Estado, Fecha, Descripción, Features, Flujos Críticos / Smoke Tests
- [x] 3.4 Verificar que no hay referencias a archivos externos (`docs/`, `openspec/`, etc.) en las instrucciones del agente

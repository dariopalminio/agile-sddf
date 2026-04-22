## 1. Preparación y referencia

- [x] 1.1 Revisar `rovo/story-creator-agent.md` para confirmar la estructura de secciones y el patrón de flujo conversacional iterativo
- [x] 1.2 Revisar `rovo/release-validator-agent.md` (FEAT-032) para reutilizar el template canónico incrustado y mantener consistencia entre ambos agentes
- [x] 1.3 Confirmar que el template canónico en `docs/specs/templates/release-spec-template.md` es el mismo que el incrustado en el validador

## 2. Creación del agente Rovo

- [x] 2.1 Crear el archivo `rovo/release-creator-agent.md` con la sección **# Nombre**: `Creador de Epic Release`
- [x] 2.2 Agregar la sección **# Descripción** explicando que el agente genera la descripción de un Epic tipo release siguiendo el template canónico y produce un bloque de texto Markdown listo para pegar en Jira
- [x] 2.3 Agregar la sección **# Comportamiento** definiendo: flujo conversacional iterativo, scope exclusivo a creación de releases, responde en español, nunca inventa contenido faltante, output siempre en Markdown
- [x] 2.4 Agregar la sección **# Instrucciones** con las siguientes fases:
  - Fase 0: Recopilar datos mínimos (nombre del release, descripción, al menos un feature) — hacer preguntas si faltan
  - Fase 1: Recopilar datos de frontmatter (versión, estado, fecha) con valores por defecto sugeridos
  - Fase 2: Recopilar secciones opcionales que el usuario quiera completar (Flujos Críticos, Requerimiento, etc.)
  - Fase 3: Generar la descripción completa del Epic con el template canónico y los datos recopilados
- [x] 2.5 Incrustar el template canónico completo dentro de la sección Instrucciones bajo el encabezado `## Template canónico (fuente de verdad)` — sin referencias a archivos externos

## 3. Verificación del agente

- [x] 3.1 Verificar que el archivo `rovo/release-creator-agent.md` sigue exactamente la misma convención de secciones que los agentes Rovo existentes (# Nombre, # Descripción, # Comportamiento, # Instrucciones)
- [x] 3.2 Verificar que el template canónico incrustado es consistente con el de `release-validator-agent.md` (mismas secciones obligatorias y opcionales)
- [x] 3.3 Verificar que las instrucciones incluyen las 4 fases: recopilación de datos mínimos, frontmatter, opcionales, y generación del output
- [x] 3.4 Verificar que no hay referencias a archivos externos (`docs/`, `openspec/`, etc.) en las instrucciones del agente

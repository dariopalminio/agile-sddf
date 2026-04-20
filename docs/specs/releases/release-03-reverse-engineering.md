# Release 03 — Reverse Engineering (Ingeniería inversa)

## Descripción

Añade la capacidad de ingeniería inversa: dado un repositorio existente, el sistema genera automáticamente un `requirement-spec.md` sin partir de cero. El análisis se realiza en paralelo por cuatro agentes especializados y un quinto que sintetiza los hallazgos en el documento final. Esto permite que cualquier codebase pueda documentarse siguiendo el mismo estándar del framework SDDF.

## Features

- **reverse-engineering** (skill): Orquestador del pipeline de ingeniería inversa. Coordina los 4 agentes en paralelo (Fase 1) y luego el sintetizador (Fase 2). Soporta flags `--focus <path>`, `--update` (modo incremental) y `--verbose`.
- **Agente reverse-engineer-architect**: Analiza el stack tecnológico, dependencias, patrones arquitectónicos y puntos de integración del repositorio. Produce `.tmp/rfc-architecture.md`.
- **Agente reverse-engineer-product-discovery**: Extrae features y funcionalidades desde la perspectiva del usuario analizando rutas, componentes UI y endpoints. Produce `.tmp/rfc-features.md`.
- **Agente reverse-engineer-business-analyst**: Identifica reglas de negocio, validaciones, permisos y workflows del código fuente en formato DADO/CUANDO/ENTONCES. Produce `.tmp/rfc-business-rules.md`.
- **Agente reverse-engineer-ux-flow-mapper**: Reconstruye el mapa de navegación y flujos de usuario a partir de la configuración de ruteo y guardas. Produce `.tmp/rfc-navigation.md`.
- **Agente reverse-engineer-synthesizer**: Fusiona los cuatro outputs intermedios y genera el `requirement-spec.md` final siguiendo el template canónico. Marca secciones no inferibles con `<!-- PENDING MANUAL REVIEW -->`.
- **Niveles de confianza**: Los hallazgos se clasifican como `[DIRECT]`, `[INFERRED]` o `[SUGGESTED]` según la certeza del análisis.
- **Modo incremental (`--update`)**: Permite re-analizar únicamente las secciones marcadas como pendientes en una ejecución previa.
- **Template actualizado**: `requirement-spec-template.md` mejorado con el campo "Es un" para categorización de software.

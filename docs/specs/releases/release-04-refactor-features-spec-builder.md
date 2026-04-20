# Release 04 — Refactor Features Spec Builder (Consolidación y calidad)

## Descripción

Release de consolidación y calidad. Se renombran skills para mayor consistencia semántica, se refuerza el skill de evaluación con restricciones de input más precisas, se mejoran los ejemplos de referencia (few-shot) y se añade soporte para el runtime Atlassian Rovo. Los cambios no agregan funcionalidad nueva sino que afilan las herramientas existentes para producir evaluaciones más precisas y reducir errores de uso.

## Features

- **Renombrado `story-finvest-evaluation` → `story-evaluation`**: Nombre más corto y descriptivo, alineado con la rúbrica FINVEST que ya documenta la dimensión F (Formato).
- **Restricciones de input en story-evaluation**: Se añade gate explícito para imágenes adjuntas — el skill las ignora y solicita el texto de la historia en su lugar.
- **Mejora de ejemplos few-shot**: `example-refinar.md` actualizado para representar con mayor fidelidad el caso de historia con formato parcial pero INVEST aceptable.
- **Soporte Atlassian Rovo expandido**: Agente `story-creator-agent.md` actualizado para operar con el conjunto completo de skills (creation, evaluation, split) en el runtime Rovo.
- **Sincronización multi-runtime**: Skills de `story-creation` y `story-split` sincronizados entre `.claude/skills/`, `.agents/skills/` y `.github/skills/` para garantizar paridad entre runtimes.
- **Documentación actualizada**: README y CLAUDE.md revisados para reflejar la arquitectura definitiva del módulo de gestión de historias.

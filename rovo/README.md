# Agentes Atlassian Rovo para SDDF

> **Utilidad accesoria** — complemento del framework para el ecosistema Atlassian (Jira con Rovo). No es un runtime del framework: no recibe los 47 skills ni se sincroniza desde `.claude/`. Los agentes de este directorio se mantienen manualmente. Las plataformas soportadas del framework son Claude Code, OpenCode y GitHub Copilot (ver README.md raíz).

Agentes Rovo para crear, validar y dividir releases e historias de usuario directamente en Jira, replicando los flujos de los skills SDDF equivalentes.

## Inventario

| Agente | Propósito | Skill SDDF equivalente |
|--------|-----------|------------------------|
| `release-creator-agent.md` | Crear especificaciones de release (épicas) en Jira | `release-creation` |
| `release-validator-agent.md` | Validar estructura de un release contra el template | `release-format-validation` |
| `release-reverse-generator.md` | Generar release por ingeniería inversa desde issues existentes | `releases-from-project-plan` |
| `story-creator-agent.md` | Redactar historias de usuario formato INVEST | `story-creation` |
| `story-evaluator-agent.md` | Evaluar historias con rúbrica FINVEST | `story-evaluation` |
| `story-splitter-agent.md` | Dividir historias grandes (patrones de Richard Lawrence) | `story-split` |

## Nota de contexto

Los agentes contienen contexto de ejemplo de una empresa específica (industria de logística y distribución) en sus secciones de comportamiento. **Adapta ese contexto a tu organización** antes de crear los agentes en Rovo.

## Uso

Cada archivo `.md` contiene el nombre, descripción y comportamiento listos para copiar en la creación de un agente Rovo en Atlassian. Consulta la documentación de Atlassian Rovo para los pasos de creación de agentes.

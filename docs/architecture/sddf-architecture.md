---
type: architecture
slug: sddf-architecture
title: Arquitectura del Framework SDDF
---

# Arquitectura del Framework SDDF

> **Tipo:** architecture · **ID:** ARCH-SDDF · **Estado:** active  
> **Detalle de memoria:** → [[memory-system]]  
> **Modelo de artefactos:** → [[domain-knowledge-artifacts]]

---

## 1. Visión

SDDF es un **sistema operativo para el desarrollo asistido por IA**: organiza la memoria del proyecto, orquesta el trabajo mediante skills y subagentes, y gobierna al agente con gates de calidad, todo versionado y auditable.

---

## 2. Componentes principales

SDDF está compuesto por estos componentes:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SDDF FRAMEWORK                               │
├────────────────────────────────┬─────────────────────────────────────┤
│   MEMORY SYSTEM                │   HARNESS RUNTIME                   │
│   (docs/)                      │   (.claude/, .agents/, .github/)    │
│                                │                                     │
│   12 capas de conocimiento     │   · Skills (Markdown)               │
│   versionadas en Git           │   · Subagents (aislados)            │
│                                │   · Scripts (deterministas)         │
│   Ver: [[memory-system]]       │   · Config: sddf.config.yaml        │
│                                │   · Entry: AGENTS.md                │
└────────────────────────────────┴─────────────────────────────────────┘
              ▲                                    ▲
              │ lee + escribe                      │ guía + ejecuta
              └────────────────┬───────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CODING AGENT      │  ← externo
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  CÓDIGO + TESTS     │
                    └─────────────────────┘
```

| Componente | Rol | Detalle |
|-----------|-----|---------|
| **Memory System** | Fuente de verdad única, versionada | [[memory-system]] |
| **Harness Runtime** | Orquestación, ejecución, gates | Este documento §3 |

---

## 3. Harness Runtime

El runtime contiene los mecanismos que orquestan el trabajo del agente.

| Elemento | Ubicación | Rol |
|----------|-----------|-----|
| **Skills** | `.claude/skills/` | Orquestadores con lógica de flujo |
| **Subagents** | `.claude/agents/` (`.md`) o `.codex/agents/` (`.toml`) | Workers con contexto aislado |
| **Scripts** | `scripts/` | Operaciones deterministas |
| **Config** | `sddf.config.yaml`, `.env.template` | Parámetros del framework |
| **Entry points** | `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` | Puntos de entrada IA |

**Propiedades:** agnóstico al LLM, multi-cliente (`.claude/`, `.agents/`, `.github/`), portable vía npm, versionado en Git.

---

## 4. Actores externos

SDDF no es autosuficiente. Depende de tres actores que **no forman parte del framework**:

| Actor | Rol |
|-------|-----|
| **Coding Agent** | Razona, escribe código, actualiza la memoria |
| **Git** | Versionado, ramas, tags, trazabilidad |
| **CI/CD** | Ejecuta gates automáticos (tests, seguridad, validación de memoria) |

El agente no es el sistema; el sistema es SDDF y el agente es el proceso que se ejecuta sobre él.

---

## 5. Flujo canónico

```
1. Arranque       AGENTS.md → constitution.md → index.md
2. Asignación     /story-implement STORY-042
3. Lectura        specs/, requirements/, domains/
4. Producción     src/, tests/, implement-report.md
5. Validación     code-review → verify → acceptance → integrate
6. Registro       frontmatter actualizado, ADR si aplica, requirements si cambia el contrato
```

---

## 6. Principios arquitectónicos

1. **El repositorio es el sistema** (Harness Engineering).
2. **Una raíz única** para la memoria (`SDDF_ROOT`).
3. **Sin duplicación**: se enlaza, no se copia.
4. **Trazabilidad bidireccional**.
5. **Agnóstico al LLM y al harness SDD**.
6. **Idempotencia** en los skills.
7. **Gates explícitos** antes de avanzar.
8. **Constitución como raíz de gobernanza**.
9. **ADRs inmutables**: se superseden, no se editan.

---

## 7. Estructura del repositorio

```
agile-sddf/
├── AGENTS.md                  # entry point IA
├── sddf.config.yaml           # configuración
├── CHANGELOG.md
├── README.md
│
├── docs/                      # Memory System (ver [[memory-system]])
│   ├── index.md
│   ├── constitution.md
│   └── {product,requirements,specs,domains,architecture,
│        adr,policies,guardrails,guides,runbooks,templates}/
│
├── .claude/                   # Harness Runtime (Claude Code)
├── .agents/                   # Harness Runtime (estándar abierto)
├── .github/                   # Harness Runtime (Copilot) + workflows
├── scripts/                   # utilidades deterministas
└── src/                       # código del framework
```

---

## 8. Referencias

| Documento | Propósito |
|-----------|-----------|
| [[memory-system]] | Capas, árbol e invariantes de la memoria |
| [[domain-knowledge-artifacts]] | Modelo de artefactos y TraceLinks |
| [[domain-work-item-hierarchy]] | Project → Epic → Story |
| [[domain-state-management]] | Estados, subestados, transiciones |
| [[constitution]] | Principios supremos |
| [[perfiles-runtimes-e-instalacion-explicita]] | `specs/` dentro de `docs/` |
| [[nivel-l2-epic-y-directorios-numerados]] | Documentación en capas |

---

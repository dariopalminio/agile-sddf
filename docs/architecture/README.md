---
type: wiki
slug: architecture-index
title: "Índice de arquitectura del framework SDDF"
date: 2026-09-21
parent: null
---

# 🏗️ Arquitectura (`docs/architecture/`)

> Estructura técnica del framework: vistas de sistema, stack y diseño de la memoria.
> Responde a **cómo está construido SDDF**, no a por qué se decidió cada cosa (eso vive en
> [[adr-index]]) ni a qué debe cumplir (eso vive en `requirements/` y en la
> [[constitution]]).

---

## 🗂️ Índice de documentos

| Documento | ID | Alcance | Léelo cuando… |
|-----------|----|---------|---------------|
| [[sddf-architecture]] — [sddf-architecture.md](sddf-architecture.md) | ARCH-SDDF | Visión, componentes (Memory System + Harness Runtime), actores externos, flujo canónico, principios y estructura del repositorio | Necesites el mapa completo del sistema antes de tocar skills, agentes o scripts |
| [[tech-stack]] — [tech-stack.md](tech-stack.md) | ARCH-TECH-STACK | Runtime, dependencias, test runner, CLI, CI/CD, distribución y lo que el framework **no** usa | Vayas a añadir una dependencia, un script o una herramienta de build |
| [[memory-system]] — [memory-system.md](memory-system.md) | ARCH-MEMORY | Las once capas de `docs/`, reglas del árbol, trazabilidad, gobernanza, invariantes y anti-patrones | Vayas a crear, mover o indexar cualquier artefacto bajo `docs/` |
| [context-diagram.puml](c4/context-diagram.puml) · [context-diagram.png](c4/context-diagram.png) | C4 L1 | Diagrama de contexto: SDDF, sus usuarios y los sistemas externos (harness, npm, Git) | Quieras comunicar el alcance del sistema a alguien que no conoce el repositorio |

---

## 🧭 Cómo se relacionan

```
sddf-architecture.md        ← mapa del sistema (empieza aquí)
    ├── tech-stack.md        ← con qué está construido
    ├── memory-system.md     ← cómo se organiza la memoria (docs/)
    └── c4/                  ← vistas gráficas (hoy: contexto L1)
```

Los tres documentos se enlazan entre sí por wikilink; `sddf-architecture.md` es el punto
de entrada recomendado.

---

## 📐 Convenciones de esta capa

- **Qué va aquí:** vistas de arquitectura (C4), stack tecnológico, diseño de subsistemas
  transversales (memoria, runtime, instalador). Documentos de vida larga que describen el
  estado vigente del sistema.
- **Qué no va aquí:**
  - Decisiones y sus alternativas → [[adr-index]] (`docs/adr/ADR-NNNN-*.md`).
  - Diseño de una historia concreta → `design.md` de la historia
    (`docs/specs/03-stories/STORY-NNN-*/design.md`).
  - Modelo de dominio (entidades, invariantes de negocio) → [domains/README.md](../domains/README.md)
    y [[domain]].
  - Reglas de gobernanza y restricciones verificables → `policies/` y `guardrails/`.
- **Nombres:** kebab-case, sin prefijo numérico; el slug del wikilink es el nombre del
  archivo sin extensión (`[[tech-stack]]`).
- **Diagramas:** fuente PlantUML en `c4/` junto a su render (`.png`); el `.puml` es la
  fuente de verdad. Nivel de nombre: `context-diagram` (L1), `container-diagram` (L2),
  `component-<subsistema>` (L3).
- **Frontmatter:** cada documento declara al menos `type: architecture`, `id: ARCH-<NOMBRE>`,
  `slug`, `title`, `status` (`active` | `superseded`). Un documento reemplazado se conserva
  con `status: superseded` y enlaza a su sucesor; no se borra.
- **Documentos vivos:** al cambiar el sistema se edita el documento vigente (a diferencia de
  los ADRs, que son inmutables). Si el cambio proviene de una decisión, enlazar el ADR desde
  la sección afectada.

---

## 🔗 Referencias

- [[constitution]] — principios supremos, stack y estándares de construcción de skills.
- [[adr-index]] — decisiones transversales que dieron forma a esta arquitectura.
- [[domain-knowledge-artifacts]] — modelo de artefactos, tipos y enlaces tipados.
- [[index]] — índice general de la memoria del proyecto.

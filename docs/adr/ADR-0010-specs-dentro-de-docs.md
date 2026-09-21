---
type: adr
id: ADR-0010
slug: specs-dentro-de-docs
title: "Mantener specs/ dentro de docs/ en lugar de la raíz"
status: PROPOSED
date: 2026-09-20
supersedes: ADR-0009
superseded-by: null
---

# ADR-0010: Mantener specs/ dentro de docs/ en lugar de la raíz

## Contexto y problema

Spec Kit (GitHub) y otros frameworks SDD han adoptado recientemente la convención de ubicar `specs/` en la **raíz del repositorio**, separándolo de `.specify/` (que contiene la configuración y el runtime de la herramienta). La razón declarada es separar la herramienta del producto: `.specify/` es infraestructura, `specs/` es historial de producto.

En SDDF, la situación es diferente. `docs/` no es la herramienta: es **la memoria completa del proyecto** (product, requirements, specs, domains, architecture, adr, policies, guardrails, guides, runbooks, templates). `specs/` es una capa más dentro de esa memoria, como `domains/` o `requirements/`.

La pregunta que motiva este ADR es: **¿debería SDDF adoptar la convención de Spec Kit y mover `specs/` a la raíz, o mantenerlo dentro de `docs/`?**

Origen: discusión de diseño del sistema de memoria durante el desarrollo del release "Skill Guardian" y del skill `memory-system`.

## Decisión

Se mantiene **`specs/` dentro de `docs/`**. La raíz única de la memoria (`SDDF_ROOT`, por defecto `docs`) sigue resolviendo todas las capas, incluyendo `specs/`. No se introduce una segunda raíz.

La estructura canónica queda:

```
docs/
├── specs/{01-projects,02-epics,03-stories}/
├── product/
├── requirements/
├── domains/
├── architecture/
├── adr/
├── policies/
├── guardrails/
├── guides/
├── runbooks/
└── templates/
```

## Rationale

La decisión se sostiene en cinco argumentos:

1. **Coherencia con el modelo de memoria de tres capas.** `specs/` es la capa de construcción, hermana de `product/` (contexto) y `requirements/` (contrato). Sacarla de `docs/` rompe la simetría y la unidad conceptual del sistema de memoria descrito en [[memory-system]].

2. **Un solo punto de entrada.** `AGENTS.md` → `docs/index.md` → `docs/specs/`. Con `specs/` en la raíz, los agentes necesitarían conocer dos raíces y resolver rutas según el tipo de artefacto, aumentando la complejidad de los skills y el riesgo de errores de resolución.

3. **Compatibilidad multi-harness.** Si un proyecto usa SDDF y Speckit simultáneamente, SDDF vive en `docs/specs/` y Speckit en `specs/` (raíz). No hay colisión. Si SDDF también usara `specs/` en la raíz, ambos chocarían y obligarían a reconfigurar uno de los dos.

4. **Resolución de rutas simple.** Un solo `SDDF_ROOT` resuelve `docs/specs/`, `docs/domains/`, `docs/adr/`, etc. Adoptar la convención de Spec Kit obligaría a introducir una segunda variable (`SDDF_SPECS_ROOT`) o lógica condicional en cada skill, con el coste de tokens y mantenimiento que eso implica.

5. **El argumento de Spec Kit no aplica.** Spec Kit separa `.specify/` (herramienta) de `specs/` (producto) para poder actualizar la herramienta sin tocar el producto. En SDDF no existe esa dicotomía: `docs/` **es** el producto (la memoria) y `sddf.config.yaml` es la configuración de la herramienta. No hay nada que separar.

## Alternativas consideradas

- **Mover `specs/` a la raíz (convención Spec Kit):** descartada porque rompe la unidad de `docs/` como memoria completa, obliga a introducir una segunda raíz y colisiona con proyectos que ya usan `specs/` para Speckit.
- **Mover toda la memoria a la raíz y dejar `docs/` solo para contexto:** descartada porque llenaría la raíz del repositorio de carpetas (`product/`, `requirements/`, `domains/`, `adr/`, `policies/`, etc.), dificultando la navegación y mezclando la memoria con el código fuente.
- **Dejar la ubicación de `specs/` configurable (dentro o fuera de `docs/`):** descartada porque introduce dos caminos posibles que los skills deben soportar. El beneficio (flexibilidad para usuarios de Spec Kit) no compensa el coste (complejidad en la resolución de rutas y en la documentación).
- **Mantener `docs/specs/` (decisión adoptada):** elegida por coherencia con el modelo, simplicidad de resolución y compatibilidad multi-harness.

## Consecuencias

**Positivas:**
- El sistema de memoria se mantiene coherente: todas las capas viven bajo `SDDF_ROOT`.
- Un solo parámetro (`SDDF_ROOT` / `sddf.config.yaml::root`) resuelve todas las rutas.
- Convivencia limpia con proyectos que usan Speckit u OpenSpec: no hay colisión de rutas.
- Los skills existentes (`story-*`, `project-*`, `epic-*`) no requieren cambios en su resolución de rutas.
- Alineación con el modelo de tres capas descrito en [[memory-system]].

**Negativas / trade-offs:**
- Los usuarios familiarizados con Spec Kit esperarán encontrar `specs/` en la raíz; puede requerir una nota de onboarding.
- Algunas herramientas externas que asumen `specs/` en la raíz podrían necesitar configuración adicional para encontrar los artefactos bajo `docs/specs/`.

## Referencias

- [[memory-system]] — Sistema de memoria del framework SDDF
- [[domain-knowledge-artifacts]] — Modelo de artefactos de conocimiento y capas
- [[ADR-0004]] — Documentación en capas (decisión hermana sobre la estructura de `docs/`)
- [[sddf-config]] — Configuración del framework (raíz configurable)



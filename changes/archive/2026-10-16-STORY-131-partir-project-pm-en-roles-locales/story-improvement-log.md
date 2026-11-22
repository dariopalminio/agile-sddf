---
type: improvement-log
story-id: STORY-131
improved: 2026-10-14
dimensions-improved: [N, V, S]
previous-score: 3.97
---

# Log de mejoras: STORY-131

## Resumen

- **Fecha:** 2026-10-14
- **Dimensiones mejoradas:** N, V, S
- **Score previo (FINVEST):** 3.97
- **Decisión previa:** REFINAR

## Cambios por dimensión

### N – Negociable (score previo: 3)

**Recomendación aplicada:** Nombrar explícitamente el rol de discovery en el `Dado` de AC-1 (`skills/project-discovery/assets/agents/discovery.md` o el nombre que se acuerde), para que coincida con el `Quiero`. Antes de fijar el nombre, acordar con STORY-132 y STORY-133 cómo se nombran los roles de `project-discovery`, que van a ser tres (PM, architect, UX). Por ejemplo `discovery-pm.md`, `discovery-architect.md` y `discovery-ux.md`. Así se evita que dos historias escriban el mismo archivo.

**Cambio realizado:** El `Quiero` dejó de fijar nombres de archivo y ahora habla de "un rol de visión propio de `project-begin` y un rol de discovery propio de `project-discovery`". La tabla de Ejemplos de AC-1 nombra los dos archivos (`begin-intent.md` y `discovery-pm.md`). En Notas se agregó por qué hace falta `discovery-pm.md`: ADR-0014 llama `discovery` tanto al rol de PM como al de arquitecto, y los dos van a `skills/project-discovery/assets/agents/`. Se propone la convención `discovery-pm.md` / `discovery-architect.md` / `discovery-ux.md` para coordinar con STORY-132 y STORY-133, y se aclara que el nombre es negociable mientras no haya colisión. No se modificaron las historias hermanas.

---

### V – Valiosa (score previo: 2)

**Recomendación aplicada:** Reescribir el `Para` con el beneficio para quien usa el framework, no con la organización del paquete. Opcional: agregar un indicador observable en CNF, por ejemplo que cada skill cargue solo la sección de PM de su fase (menos líneas de instrucciones por sesión que el `project-pm.agent.md` completo).

**Cambio realizado:** El `Para` ahora dice que la entrevista de visión y la de discovery funcionan en cualquier runtime, aunque un subagente no pueda preguntar al usuario, y que los skills instalados no dependen de `agents/`. Se agregó **CNF-2 — Contexto acotado por fase**: cada rol contiene solo la sección de estado de su fase y carga menos líneas de PM que las 57 de `agents/project-pm.agent.md`.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** Convertir el AC-1 en un Scenario Outline con una fila por skill, para que cada ejecución sea un caso separado.

**Cambio realizado:** AC-1 pasó de un escenario con dos skills en un solo `Cuando` a un escenario parametrizado (`<skill>`, `<rol>`) con una tabla `Ejemplos:` de dos filas (`project-begin` → `begin-intent.md`, `project-discovery` → `discovery-pm.md`). Así cada ejecución es un caso independiente con datos concretos.

---

### Otras observaciones aplicadas (dimensiones ≥ 4)

**Recomendación aplicada:** E / Notas: cerrar la duda "Begin Intention" ↔ "Estado Visión". T / CNF-1: escribir que las secciones transversales van en ambos roles y cómo se comprueba. Alcance: incluir `skills/project-begin/README.md` y `skills/project-begin/assets/vision-template.md`.

**Cambio realizado:** En Notas, la duda abierta se reemplazó por la correspondencia confirmada contra `agents/project-pm.agent.md`. CNF-1 ahora tiene una tabla de cuatro filas, una por sección de `project-pm.agent.md`, que dice en qué rol queda cada una (Principios y Protocolo de Resiliencia van en ambos). Se agregó una nota de alcance que incluye el README y los comentarios `# escritor:` del template de visión.

---

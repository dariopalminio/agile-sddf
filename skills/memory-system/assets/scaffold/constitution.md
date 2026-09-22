---
type: constitution
slug: constitution
title: "Constitución del Proyecto"
status: IN-PROGRESS
substatus: TODO
parent: null
created: {date}
updated: {date}
---

# Constitución del Proyecto

> Este documento establece los principios técnicos inamovibles del proyecto. Es la fuente de verdad
> para todos los agentes IA y miembros del equipo. Todo lo que aquí se define debe respetarse en el
> diseño e implementación de cualquier historia. Completa cada sección marcada `[Por completar]`.

## Flujo de autoridad

Este documento es la raíz de la gobernanza: vive en la raíz de la memoria, un nivel por encima de
`policies/` y `guardrails/`, porque no es una policy más sino el origen de todas.

- Las policies (`policies/`) desarrollan estos principios en reglas de gobernanza; cada una declara
  de qué principio deriva (`derives-from`).
- Los guardrails (`guardrails/`) los hacen verificables como checklists con severidad; su
  incumplimiento bloquea.
- Ante conflicto entre una policy o guardrail y este documento, prevalece la constitución.

Mapa de la memoria: [[index]].

---

## 🧱 Stack Tecnológico

### Lenguaje principal

- **Lenguaje:** [Por completar]
- **Runtime / Entorno:** [Por completar]

### Frameworks y librerías core

- [Por completar]

### Infraestructura y despliegue

- **Base de datos:** [Por completar]
- **Control de versiones:** [Por completar]
- **Contenedores:** [Por completar]
- **Versionado:** [Por completar]

---

## Guardrails y reglas a seguir

- [Por completar: enlaza aquí los checklists de `guardrails/` que aplican a todo el proyecto]

## 📐 Convenciones de Código

### Estilo y formato

- **Convención de nombres:** [Por completar]

---

## 🏗️ Metodologías de Diseño y Desarrollo

### Proceso de desarrollo

- **Metodología:** [Por completar]

---

## Jerarquía de desarrollo

Un proyecto (project) contiene varias épicas (epic), y cada épica contiene varias historias (story).

```
project (specs/01-projects/<PROJ-NN>-<slug>/project.md)
    └── epic (specs/02-epics/<EPIC-NN>-<slug>/epic.md)
        └── story (specs/03-stories/<STORY-NNN>-<slug>/story.md)
```

---

## Reglas de framework

- [Por completar]

## Estándares de construcción de Skills

- [Por completar]

## ✅ Principios Técnicos Inamovibles

Lista los principios que NO pueden violarse bajo ninguna circunstancia.

1. [Por completar]

---

## 📎 Notas adicionales

[Por completar]

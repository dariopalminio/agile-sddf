---
alwaysApply: false
type: story
id: STORY-136
kind: chore
slug: STORY-136-retirar-la-carpeta-agents-vacia
title: "Retirar la carpeta agents/ vacía"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-14
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Retirar la carpeta agents/ vacía

**Como** mantenedor de Agile-SDDF que publica el paquete npm  
**Quiero** eliminar la carpeta `agents/` y su entrada en `package.json` → `files` cuando ningún skill dependa de ella  
**Para** publicar un paquete sin artefactos huérfanos y con skills autocontenidos

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Instalación sin agents/
```gherkin
Dado que ningún SKILL.md de skills/ referencia agents/ ni un agente global
  Y la carpeta agents/ está vacía
Cuando elimino agents/ y su entrada en package.json → files
  Y ejecuto npx agile-sddf install en un proyecto de prueba
Entonces la instalación termina sin errores para cada runtime de config/runtimes.json
  Y npm run verify:repository pasa
```

### AC-2 — Escenario alternativo / error – Quedan dependencias
```gherkin
Dado que algún SKILL.md todavía referencia agents/ o un agente global
Cuando intento retirar la carpeta agents/
Entonces la verificación lista los skills con dependencias pendientes
  Pero la carpeta agents/ y su entrada en package.json se conservan
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Compatibilidad de runtimes:** los runtimes con `agentsDirectory` distinto de `null` en `config/runtimes.json` no fallan al no encontrar agentes que instalar.

## Fuera de alcance (Non-Goals)

`scripts/verify-skill-independence.js` con fixtures, y la actualización de docs, CHANGELOG y guía de migración del release major (consecuencias de ADR-0014, fuera de alcance de la épica).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-136 — Retirar la carpeta agents/ vacía

- Depende de STORY-129 a STORY-135: es la última de la épica.
- `kind: chore` porque no aporta comportamiento nuevo al usuario final.
- La limpieza de `skills/story-code-review/SKILL.md` (sección "Segundo Análisis, Análisis Corregido") no tiene historia propia; la épica la resuelve como chore aparte.

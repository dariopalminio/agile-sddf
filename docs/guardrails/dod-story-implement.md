---
alwaysApply: false
type: guardrail
kind: transition
enforcement: error
from: IMPLEMENT/IN-PROGRESS
to: IMPLEMENT/DONE
applies-to: story
slug: dod-story-implement
title: "DoD IMPLEMENT — Story (transition guardrail)"
created: 2026-09-24
updated: 2026-09-24
---

# DoD IMPLEMENT — Story

## ✅ Criterios de Aceptación

- [ ] Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente
- [ ] Los criterios no funcionales de `story.md` (performance, seguridad, UX) están verificados
- [ ] El comportamiento coincide con lo especificado en `design.md`
- [ ] No hay regresiones en las funcionalidades previamente trabajadas

## 💻 Criterios de Código

- [ ] El código sigue las convenciones definidas en `constitution.md` (estilo, nombres, organización)
- [ ] No hay código comentado ni `TODO` sin issue asociado
- [ ] No hay variables, imports ni funciones sin usar
- [ ] El código pasa el linter y el formateador sin errores ni warnings
- [ ] No se introducen dependencias nuevas sin aprobación del equipo
- [ ] Se uso el skill `skill-master` para crear skills nuevos
- [ ] Si se agrega un nuevo skill, la ruta del skill debe haber sido incluida en el arreglo de "files" en `package.json` para ser publicada en npm
- [ ] Se cumple [[gr-ai-security-checklist]]
- [ ] Se cumple [[gr-code-security-checklist]]
- [ ] Se cumple [[gr-skill-creation-checklist]]

## 🧪 Criterios de Tests

- [ ] Los skills críticos deben tener pruebas `evals/evals.json`
- [ ] Se ejecutaron y evalúan los casos de prueba automáticamente según la sección "Test Cases" del skill `skill-master`

## 📝 Criterios de Documentación

- [ ] El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]`
- [ ] Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados
- [ ] Si se toman decisiones de diseño relevantes no previstas, se documentan en `design.md`
- [ ] El CHANGELOG o historial de releases se actualiza si aplica

## 🚀 Criterios de Integración y Despliegue

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] No hay secrets ni credenciales expuestos en el código
- [ ] Las variables de entorno necesarias están documentadas
- [ ] El despliegue puede revertirse sin pérdida de datos si algo falla

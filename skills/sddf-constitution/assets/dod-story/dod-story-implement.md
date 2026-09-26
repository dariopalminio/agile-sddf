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
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
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

## 🧪 Criterios de Tests

- [ ] Existe al menos un test por escenario principal de `story.md`
- [ ] Todos los tests existentes pasan (sin tests saltados sin justificación)
- [ ] La cobertura de tests no disminuye respecto al baseline del proyecto
- [ ] Los tests son deterministas (no flaky)
- [ ] Los tests de integración cubren los flujos críticos de la historia

## 📝 Criterios de Documentación

- [ ] El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]`
- [ ] Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados
- [ ] Si se toman decisiones de diseño relevantes no previstas, se documentan en `design.md`
- [ ] El CHANGELOG o historial de releases se actualiza si aplica

## 🚀 Criterios de Integración Continua

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] No hay secrets ni credenciales expuestos en el código
- [ ] Las variables de entorno necesarias están documentadas
- [ ] El despliegue puede revertirse sin pérdida de datos si algo falla

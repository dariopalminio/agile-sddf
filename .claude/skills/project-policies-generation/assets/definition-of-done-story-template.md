---
alwaysApply: false
type: definition-of-done
slug: definition-of-done-story-template
title: "Definition of Done"
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Definition of Done (DoD) para Story

> Una historia de usuario se considera **DONE** cuando cumple todos los criterios marcados en este documento. Ninguna historia puede cerrar su desarrollo ni desplegarse a producción sin satisfacer estos criterios.

---

## 📝 SPECIFYING (Definición de Hecho para la fase de Especificación)

### ✅ Criterios de Especificación
<!-- Criterios relacionados con la definición clara y completa de la historia. -->
- [ ] La historia tiene un título descriptivo y claro
- [ ] La descripción de la historia es completa y comprensible
- [ ] Cumple los criterios de formato de historia de usuario (Como {rol} quiero {acción} para {beneficio}):
- [ ] Tiene criterios de aceptación en formato Gherkin (Given-When-Then) que cubren los escenarios principales
- [ ] Cumple los criterios INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- [ ] La historia tiene el frontmatter completo con metadata correcta (status, substatus, tags, etc.)
- [ ] La historia tiene el frontmatter con referencia a la épica padre si está incluida en un epic release (`release.md`)
- [ ] La historia tiene referencias a historias relacionadas cercanas (historias hermanas de división por split)

## 🗺️ PLAN (Definición de Hecho para la fase de Planificación)


### ✅Criterios de Planificación
<!-- Criterios relacionados con la preparación de la historia para su desarrollo. -->
- [ ] La historia tiene un diseño asociado en `design.md` si es necesario (UI/UX, arquitectura, etc.)
- [ ] La historia tiene un `tasks.md` con las tareas necesarias para su implementación

## 🛠️ IMPLEMENTING (Definición de Hecho para la fase de Implementación)

### ✅ Criterios de Aceptación

<!-- Criterios funcionales que toda historia debe cumplir. -->

- [ ] Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente
- [ ] Los criterios no funcionales de `story.md` (performance, seguridad, UX) están verificados
- [ ] El comportamiento coincide con lo especificado en `design.md`
- [ ] No hay regresiones en las funcionalidades previamente trabajadas

### 💻 Criterios de Código

<!-- Estándares de calidad del código producido. -->

- [ ] El código sigue las convenciones definidas en `constitution.md` (estilo, nombres, organización)
- [ ] No hay código comentado ni `TODO` sin issue asociado
- [ ] No hay variables, imports ni funciones sin usar
- [ ] El código pasa el linter y el formateador sin errores ni warnings
- [ ] No se introducen dependencias nuevas sin aprobación del equipo

### 🧪 Criterios de Tests

<!-- Cobertura y calidad de las pruebas. -->

- [ ] Existe al menos un test por escenario principal de `story.md`
- [ ] Todos los tests existentes pasan (sin tests saltados sin justificación)
- [ ] La cobertura de tests no disminuye respecto al baseline del proyecto
- [ ] Los tests son deterministas (no flaky)
- [ ] Los tests de integración cubren los flujos críticos de la historia

### 📝 Criterios de Documentación

<!-- Actualización de documentación relevante. -->

- [ ] El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]`
- [ ] Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados
- [ ] Si se toman decisiones de diseño relevantes no previstas, se documentan en `design.md`
- [ ] El CHANGELOG o historial de releases se actualiza si aplica

### 🚀 Criterios de Integración Continua

<!-- Condiciones necesarias para desplegar a producción. -->

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] No hay secrets ni credenciales expuestos en el código
- [ ] Las variables de entorno necesarias están documentadas
- [ ] El despliegue puede revertirse sin pérdida de datos si algo falla

---

## 🔍 CODE-REVIEW (Definición de Hecho para la fase de Revisión de Código)

- [ ] Definition of Done para el estado IMPLEMENTING es satisfactorio
- [ ] Se cumplen los estándares del proyecto (`constitution.md`)
- [ ] Cada escenario Gherkin tiene correspondencia en el código
- [ ] Los componentes respetan la arquitectura de `design.md`
- [ ] Sin hallazgo bloqueante de severidad HIGH o MEDIUM
- [ ] Sin tareas pendientes en `tasks.md`
- [ ] Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados
- [ ] El reporte de revisión de código (`code-review-report.md`) está creado o actualizado
- [ ] Revisión de código aprobada (Review status approved en `code-review-report.md`)

---

## ✅ VERIFY (Definición de Hecho para la fase de Verificación)
- [ ] Las pruebas pasan exitosamente
- [ ] No hay errores críticos ni bloqueantes
- [ ] El comportamiento coincide con lo especificado en `design.md` y `story.md`
- [ ] No fix que resolver

---

## 🚦 ACCEPTANCE  (Definición de Hecho para la fase de Aceptación)
- [ ] El PO, PM o un TL humano ha validado la funcionalidad en el entorno de staging
- [ ] Todos los criterios de aceptación se cumplen
- [ ] No hay observaciones bloqueantes

---

## 🖇️ INTEGRATION (Definición de Hecho para la fase de Integración)

---

## ✔️ COMPLETED (DONE/COMPLETED)

---

## 📎 Notas adicionales

<!-- Criterios específicos del proyecto que no encajan en las categorías anteriores. -->

[Por completar]

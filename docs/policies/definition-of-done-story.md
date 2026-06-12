---
alwaysApply: false
type: definition-of-done
slug: definition-of-done
title: "Definition of Done"
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Definition of Done (DoD)

## Story Definition of Done

> Una historia de usuario se considera **DONE** cuando cumple todos los criterios marcados en este documento. Ninguna historia puede cerrar su desarrollo ni desplegarse a producción sin satisfacer estos criterios.

---

### Definition of Done para el estado SPECIFY

#### ✅ Criterios de Especificación
<!-- Criterios relacionados con la definición clara y completa de la historia. -->
- [ ] La historia tiene un título descriptivo y claro
- [ ] La descripción de la historia es completa y comprensible
- [ ] Cumple los criterios de formato de historia de usuario (Como {rol} quiero {acción} para {beneficio}):
- [ ] Tiene criterios de aceptación en formato Gherkin (Given-When-Then) que cubren los escenarios principales
- [ ] Cumple los criterios INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- [ ] La historia tiene el frontmatter completo con metadata correcta (status, substatus, tags, etc.)
- [ ] La historia tiene el frontmatter con referencia a la épica padre si está incluida en un epic release (`release.md`)
- [ ] La historia tiene referencias a historias relacionadas cercanas (historias hermanas de división por split)

### Definition of Done para el estado PLAN

#### ✅ Criterios de Artefactos de Planning
<!-- Criterios que verifican la calidad y completitud de los artefactos story.md, design.md y tasks.md antes de iniciar la implementación. -->
- [ ] story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales
- [ ] design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio
- [ ] tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación)
- [ ] Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`)
- [ ] No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR

---

### Definition of Done para el estado IMPLEMENT

#### ✅ Criterios de Aceptación

<!-- Criterios funcionales que toda historia debe cumplir. -->

- [ ] Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente
- [ ] Los criterios no funcionales de `story.md` (performance, seguridad, UX) están verificados
- [ ] El comportamiento coincide con lo especificado en `design.md`
- [ ] No hay regresiones en las funcionalidades previamente trabajadas

#### 💻 Criterios de Código

<!-- Estándares de calidad del código producido. -->

- [ ] El código sigue las convenciones definidas en `constitution.md` (estilo, nombres, organización)
- [ ] No hay código comentado ni `TODO` sin issue asociado
- [ ] No hay variables, imports ni funciones sin usar
- [ ] El código pasa el linter y el formateador sin errores ni warnings
- [ ] No se introducen dependencias nuevas sin aprobación del equipo
- [ ] Se uso el skill `skill-master` para crear skills nuevos
- [ ] Si se agrega un nuevo skill, la ruta del skill debe haber sido incluida en el arreglo de "files" en `package.json` para ser publicada en npm

#### 🧪 Criterios de Tests

<!-- Cobertura y calidad de las pruebas. -->

- [ ] Los skills crìticos deben tener pruebas `evals/evals.json`
- [ ] Se ejecutaron y evalúan los casos de prueba automáticamente según la sección "Test Cases" del skill `skill-master`

#### 📝 Criterios de Documentación

<!-- Actualización de documentación relevante. -->

- [ ] El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]`
- [ ] Si la historia modifica APIs públicas o contratos, el README o docs relevantes están actualizados
- [ ] Si se toman decisiones de diseño relevantes no previstas, se documentan en `design.md`
- [ ] El CHANGELOG o historial de releases se actualiza si aplica

#### 🚀 Criterios de Integración y Despliegue

<!-- Condiciones necesarias para desplegar a producción. -->

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] No hay secrets ni credenciales expuestos en el código
- [ ] Las variables de entorno necesarias están documentadas
- [ ] El despliegue puede revertirse sin pérdida de datos si algo falla

---
### Definition of Done para el estado VERIFY

<!-- Condiciones necesarias para verificar la historia antes de avanzar a ACCEPTANCE. -->
<!-- Por el momento sin criterios -->

### Definition of Done para el estado ACCEPTANCE

#### ✅ Criterios de Aceptación Funcional

<!-- Criterios que el validador humano debe confirmar manualmente antes de avanzar a INTEGRATION. -->

- [ ] Todos los escenarios Gherkin de `story.md` han sido ejecutados manualmente y verificados
- [ ] Los criterios no funcionales de `story.md` (performance, UX, accesibilidad) han sido validados
- [ ] El comportamiento observado coincide con el valor de negocio descrito en la historia
- [ ] No se detectaron defectos bloqueantes durante la validación manual

#### ✅ Criterios de Documentación y Trazabilidad

<!-- Evidencia que debe quedar registrada antes de cerrar el acceptance. -->

- [ ] `acceptance-report.md` generado con resultado final `ACCEPTANCE-APPROVED`
- [ ] Todos los criterios del reporte tienen resultado registrado (APPROVED/REJECTED/BLOCKED) con observaciones
- [ ] `story.md` actualizado con `status: ACCEPTANCE / substatus: DONE`
- [ ] El validador humano ha confirmado explícitamente la aprobación de la historia

---

### Definition of Done para el estado CODE-REVIEW

- [ ] Definition of Done para el estado IMPLEMENT es satisfactorio
- [ ] Se cumplen los estándares del proyecto (`constitution.md`)
- [ ] Cada escenario Gherkin tiene correspondencia en el código
- [ ] Los componentes respetan la arquitectura de `design.md`
- [ ] Sin hallazgo bloqueante de severidad HIGH o MEDIUM
- [ ] Sin tareas pendientes en `tasks.md`
- [ ] Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados
- [ ] El reporte de revisión de código (`code-review-report.md`) está creado o actualizado
- [ ] Revisión de código aprobada (Review status approved en `code-review-report.md`)

---

## 🚀 Criterios de Despliegue en Producción

<!-- Condiciones necesarias para publicar una nueva versión en npm. -->

- [ ] El build de CI pasa sin errores (build + tests + lint)
- [ ] No hay secrets ni credenciales expuestos en el código ni en los archivos publicados
- [ ] La versión en `package.json` se incrementó siguiendo SemVer (patch / minor / major según el impacto)
- [ ] El `CHANGELOG.md` incluye la entrada correspondiente a la versión publicada
- [ ] El archivo `.npmignore` (o el campo `files` en `package.json`) excluye correctamente archivos de desarrollo (tests, scripts internos, `.env`)
- [ ] `npm pack --dry-run` no incluye archivos inesperados en el paquete
- [ ] El paquete publicado puede instalarse limpiamente con `npm install agile-sddf` y ejecutarse sin errores


## 📎 Notas adicionales

<!-- Criterios específicos del proyecto que no encajan en las categorías anteriores. -->

[Por completar]








































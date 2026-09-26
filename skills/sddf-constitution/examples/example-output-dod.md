---
alwaysApply: false
type: definition-of-done
slug: definition-of-done
title: "Definition of Done"
created: 2026-05-06
updated: 2026-05-06
---

# Definition of Done (DoD)

> Una historia de usuario se considera **DONE** cuando cumple todos los criterios marcados en este documento. Ninguna historia puede cerrar sprint ni desplegarse a producción sin satisfacer estos criterios.

---

## ✅ Criterios de Aceptación

- [ ] Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente
- [ ] Los criterios no funcionales de `story.md` (performance, seguridad, UX) están verificados
- [ ] El comportamiento coincide con lo especificado en `design.md`
- [ ] No hay regresiones en las funcionalidades previamente trabajadas
- [ ] Si la historia tiene criterios de rendimiento (< N ms), se verifican con una prueba de carga o medición manual

---

## 💻 Criterios de Código

- [ ] El código sigue las convenciones definidas en `constitution.md` (TypeScript strict, ESLint, Prettier)
- [ ] No hay código comentado ni `TODO` sin issue de GitHub asociado
- [ ] No hay variables, imports ni funciones sin usar
- [ ] `npm run lint` pasa sin errores ni warnings
- [ ] `npm run build` pasa sin errores de tipos (`tsc --noEmit`)
- [ ] No se introducen dependencias nuevas sin mención en el PR y aprobación del equipo

---

## 🧪 Criterios de Tests

- [ ] Existe al menos un test unitario o de integración por escenario principal de `story.md`
- [ ] Todos los tests pasan (`npm test`) sin tests saltados sin justificación
- [ ] La cobertura en `lib/` y `server/` no baja del 80%
- [ ] Los tests son deterministas (no flaky): se ejecutaron 3 veces y siempre pasan
- [ ] Los Server Actions críticos tienen al menos un test de integración con base de datos real (no mock)

---

## 📝 Criterios de Documentación

- [ ] El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]`
- [ ] Si la historia modifica rutas de API o contratos de tipos, el README o Swagger está actualizado
- [ ] Si se tomaron decisiones de diseño no previstas en `design.md`, se documentaron en ese mismo archivo
- [ ] Variables de entorno nuevas están documentadas en `.env.example`

---

## 🚀 Criterios de Despliegue

- [ ] El pipeline de CI pasa: build + tests + lint + type-check
- [ ] La historia fue revisada según la regla de `constitution.md` (self-review o peer review)
- [ ] No hay secrets ni credenciales expuestas (`git secret scan` o inspección manual)
- [ ] Las migraciones de Prisma son backwards-compatible o tienen un plan de rollback documentado
- [ ] El despliegue a staging fue verificado manualmente por el desarrollador responsable

---

## 📎 Notas adicionales

- Para historias que introducen cambios de base de datos: la migración debe ejecutarse y revertirse sin pérdida de datos.
- Para historias con cambios de UI: verificar en Chrome y Safari (mínimo) antes de marcar como DONE.

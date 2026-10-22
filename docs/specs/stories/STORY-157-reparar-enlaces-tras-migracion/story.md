---
alwaysApply: false
type: story
id: STORY-157
kind: chore
slug: STORY-157-reparar-enlaces-tras-migracion
title: "Reparar enlaces y validar el gate tras la migración"
status: SPECIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-22
updated: 2026-10-22
related:
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-153
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Reparar enlaces y validar el gate tras la migración

**Como** mantenedor de Agile-SDDF que dogfoodea el framework
**Quiero** que los enlaces y wikilinks hacia las rutas movidas de `docs/specs/` queden reescritos y verificados tras la migración, y comprobar al cierre el contrato de salida global de la épica
**Para** que el repo migrado tenga 0 enlaces rotos, historial rastreable por work item, 0 referencias a la raíz legada en los skills y el gate determinista en verde

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – enlaces reescritos y gate verde
```gherkin
Dado el repositorio con los work items ya movidos a "specs/flow/"
Cuando se reescriben los enlaces relativos y wikilinks que apuntaban a "docs/specs/"
Entonces cada referencia apunta a la ruta nueva de su work item
  Y "npm run verify:repository" termina sin enlaces rotos
```

### AC-2 — Escenario alternativo – historial y requisitos intactos
```gherkin
Dado el repositorio migrado y con los enlaces reparados
Cuando se ejecuta "git log --follow" sobre un "story.md" archivado
Entonces muestra su historial previo a la migración
  Pero "docs/requirements/" no cambia de ubicación ni de contenido
```

### AC-3 — Escenario principal – cierre del contrato de salida global
```gherkin
Dado todas las demás historias de EPIC-26 entregadas y los enlaces reparados
Cuando se ejecuta grep -rnE "SPECS_BASE|SDDF_ROOT" sobre "skills/"
Entonces solo coinciden las menciones de diagnóstico del layout legado en "skill-preflight"
  Y la lista transitoria de skills pendientes del gate de STORY-148 está vacía
  Y ningún skill lee la clave "root" de "sddf.config.yaml" y "sddf-init" ya no la escribe
  Y "npm test" y "npm run verify:repository" (incluido el chequeo de enlaces) terminan en verde
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Un solo uso:** no se crea ningún skill ni script reutilizable de reparación; el alcance es solo este repo (CS-11).
- **CNF-2 — Stack:** Node.js en JavaScript, sin dependencias nuevas.

## Fuera de alcance (Non-Goals)

- Mover o archivar work items (STORY-153).
- Actualizar la documentación del layout (STORY-154).
- Migrar proyectos instalados.

## 📎 Notas / contexto adicional

Generado con `/story-split` a partir de STORY-153 — Migración única de work items del repo.
Cubre CS-6, CS-10 y SMOKE-5; complementa CS-4 y CS-5 de STORY-153.

**Criterios de salida globales de la épica que verifica AC-3** (cita literal para la trazabilidad de `/epic-analyze`; cada historia de migración aporta su parte y esta historia comprueba el conjunto al cierre):

- **CS-2** — `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/` no devuelve coincidencias, salvo las menciones de diagnóstico del layout legado en `skill-preflight`.
- **CS-3** — Ningún skill lee la clave `root` de `sddf.config.yaml`, y `sddf-init` ya no la escribe.
- **CS-12** — `npm test` y `npm run verify:repository` (incluido el chequeo de enlaces) terminan en verde.

**Precondición:** es la última historia de EPIC-26. Requiere STORY-153 entregada (los work items ya están en `specs/flow/`), el gate (STORY-148) aceptando `specs/flow/` y las historias de migración de skills (STORY-149 a STORY-152, STORY-155, STORY-156 y STORY-158) y de documentación (STORY-154) entregadas. Si AC-3 encuentra un skill pendiente, el defecto se devuelve a la historia que lo tenía en su alcance; esta historia no migra skills.

**Inventario aproximado al 2026-10-22:** alrededor de 219 archivos (docs, skills, scripts, tests y configuración) contienen referencias a `specs/epics` o `specs/stories`. Su reescritura se limita a las rutas movidas.

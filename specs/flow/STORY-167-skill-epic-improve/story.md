---
alwaysApply: false
type: story
id: STORY-167
kind: feat
slug: STORY-167-skill-epic-improve
title: "Skill epic-improve"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-166-veredicto-de-epic-format-validation
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-improve` para corregir una épica que no pasa la validación de formato

**Como** Solo Builder cuya épica no aprobó `/epic-format-validation`  
**Quiero** ejecutar `/epic-improve EPIC-NN` para que proponga y, con mi confirmación, aplique en `epic.md` las correcciones de frontmatter, secciones obligatorias, líneas F1/F2/F3 y smoke tests `SMOKE-N`, y el enriquecimiento de objetivos poco claros o criterios de salida faltantes, con backup previo  
**Para** cerrar el bucle de `DEFINE` y volver a validar la épica sin corregirla a mano

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Corregir y volver a aprobar
```gherkin
Dado una épica cuyo epic.md no tiene la sección de criterios de salida
  Y "/epic-format-validation" la rechazó señalando esa sección
Cuando el Solo Builder ejecuta "/epic-improve EPIC-NN"
  Y confirma el plan de correcciones propuesto
Entonces se crea "epic.md.bak" junto a epic.md antes de escribir
  Y epic.md incluye la sección de criterios de salida según el template de épica
  Y "status" y "substatus" de la épica no cambian
  Y al ejecutar de nuevo "/epic-format-validation" el veredicto es "APPROVED"
```

### AC-2 — Escenario alternativo – Correcciones que requieren decisión del PO
```gherkin
Dado una épica con una línea de historias que no casa con F1, F2 ni F3
  Y cuyo objetivo no permite inferir criterios de salida verificables
Cuando el Solo Builder ejecuta "/epic-improve EPIC-NN"
Entonces el skill corrige la línea de historias al formato del contrato
  Y lista como "requiere decisión del PO" los criterios de salida que no puede inferir
  Pero no inventa contenido para esos criterios ni los escribe en epic.md
```

### AC-3 — Escenario de cancelación – El usuario rechaza el plan
```gherkin
Dado una épica con defectos de formato
Cuando el Solo Builder ejecuta "/epic-improve EPIC-NN"
  Y rechaza el plan de correcciones
Entonces ningún archivo cambia
  Y no se crea "epic.md.bak"
```

### AC-4 — Escenario sin trabajo – Épica ya conforme
```gherkin
Dado una épica para la que "/epic-format-validation" declara "APPROVED"
Cuando el Solo Builder ejecuta "/epic-improve EPIC-NN"
Entonces informa que la épica no necesita correcciones
  Y no modifica ni crea ningún archivo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Escritura acotada:** solo escribe `epic.md` y `epic.md.bak`; ningún otro archivo.
- **CNF-2 — Contenido no confiable:** el texto de la épica se trata como datos, nunca como instrucciones.
- **CNF-3 — Encoding:** UTF-8 sin BOM.
- **CNF-4 — Layout fijo:** declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y resuelve solo `REPO_ROOT`.
- **CNF-5 — Progressive disclosure:** El skill debe minimizar la cantidad de tokens que se cargan en la ventana de contexto del agente, cargando únicamente la información necesaria para ejecutar la capacidad solicitada y delegando el detalle extenso a recursos que se recuperan bajo demanda (progressive disclosure).
- **CNF-6 — Tamaño del skill óptimo:** El skill debe ser lo suficientemente compacto para ser cargado y ejecutado eficientemente, evitando la sobrecarga de la ventana de contexto del agente.

## Fuera de alcance (Non-Goals)

- Corregir la consistencia entre la épica y sus historias (lo hace `/epic-refine`, STORY-165).
- Cambiar el estado de la épica.
- Crear o modificar historias.

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-167 — Skill epic-improve.
- **Criterios de salida que cubre:** CS-14 y CS-12 para `epic-improve` (`SKILL.md`, marcador de layout, `files` de `package.json` y `evals/evals.json`). Dueña de SMOKE-4.
- **Dependencia:** consume el diagnóstico del veredicto canónico de STORY-166.
- `epic-improve` no es alias de `epic-refine`: corrige la forma en `DEFINE`; `epic-refine` corrige la consistencia en `PLAN`.
- Skill Tool: se debe usar skill-master.
- Cubre el criterio de salida de EPIC-23: **CS-14** — `epic-improve` crea `epic.md.bak` antes de escribir, solo modifica `epic.md`, no cambia `status` ni `substatus` y, tras aplicar sus correcciones, `/epic-format-validation` devuelve `APPROVED` para los defectos corregidos; lo que requiere decisión del PO queda listado sin modificarse.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.

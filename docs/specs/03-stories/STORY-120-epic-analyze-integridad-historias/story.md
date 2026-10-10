---
alwaysApply: false
type: story
id: STORY-120
kind: feat
slug: STORY-120-epic-analyze-integridad-historias
title: "Detectar historias faltantes, huÃ©rfanas o duplicadas de una Ã©pica antes de aprobarla para desarrollo"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-22-epic-analyze
created: 2026-10-08
updated: 2026-10-08
related:
  - EPIC-22-epic-analyze
  - STORY-121-epic-analyze-cobertura-criterios-salida
  - STORY-122-epic-analyze-madurez-historias-hijas
---
[[EPIC-22-epic-analyze]]

# ðŸ“– Historia: Detectar historias faltantes, huÃ©rfanas o duplicadas de una Ã©pica antes de aprobarla para desarrollo

**Como** Product Owner que debe decidir si una Ã©pica en `PLAN` estÃ¡ lista para pasar a `READY-FOR-DEV`  
**Quiero** ejecutar `/epic-analyze <EPIC-ID>` y obtener un reporte con los desajustes entre la secciÃ³n "Historias" de `epic.md` y los `story.md` que la declaran como `parent`, junto con un veredicto  
**Para** no aprobar una Ã©pica cuyo Ã­ndice de historias no coincide con lo que realmente existe, sin cruzar a mano cada `story.md` con la Ã©pica

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Ãndice consistente obtiene veredicto APPROVED
```gherkin
Dado la Ã©pica "EPIC-30-ejemplo" cuya secciÃ³n "Historias" lista "STORY-201" y "STORY-202"
  Y existen ambos "story.md" con "parent: EPIC-30-ejemplo"
  Y ningÃºn otro "story.md" declara "parent: EPIC-30-ejemplo"
Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
Entonces se escribe "epic-analyze-report.md" en el directorio de "EPIC-30-ejemplo"
  Y el reporte declara el veredicto "APPROVED" con 0 hallazgos ERROR
  Y "epic.md" y los "story.md" analizados quedan sin cambios
```

### AC-2 â€” Escenario alternativo â€“ Desajustes del Ã­ndice y veredicto resultante
```gherkin
Escenario: hallazgos de integridad del Ã­ndice de historias
  Dado "EPIC-30-ejemplo" con la situaciÃ³n "<situaciÃ³n>"
  Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
  Entonces el reporte contiene hallazgos "<severidad>" que citan "<elemento>"
    Y el veredicto es "<veredicto>"
Ejemplos:
  | situaciÃ³n                                                           | severidad | elemento                       | veredicto        |
  | "STORY-203" listada sin directorio "STORY-203-*"                    | ERROR     | STORY-203                      | BLOCKED          |
  | "STORY-204" con "parent: EPIC-30-ejemplo" no listada en la Ã©pica    | ERROR     | STORY-204                      | BLOCKED          |
  | "STORY-201" listada dos veces                                       | ERROR     | STORY-201 y ambas lÃ­neas       | BLOCKED          |
  | 1 historia planificada sin ID ("- Exportar CSV: ...")               | WARNING   | Exportar CSV                   | APPROVED         |
  | 4 historias planificadas sin ID                                     | WARNING   | cada historia planificada      | NEEDS-REFINEMENT |
```

### AC-3 â€” Escenario de error â€“ Ã‰pica no resuelta
```gherkin
Dado no existe ningÃºn directorio "EPIC-77-*" con "epic.md" bajo "$SPECS_BASE/specs/02-epics/"
Cuando el Product Owner ejecuta "/epic-analyze EPIC-77"
Entonces el skill informa que "EPIC-77" no se encontrÃ³ e indica la ruta buscada
  Pero no escribe ningÃºn "epic-analyze-report.md"
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Regla de veredicto:** `BLOCKED` con â‰¥ 1 ERROR; `APPROVED` con 0 ERROR y â‰¤ 3 WARNING; `NEEDS-REFINEMENT` con 0 ERROR y > 3 WARNING. El veredicto es informativo: el skill no cambia el estado de la Ã©pica.
- **CNF-2 â€” Solo lectura:** el skill nunca modifica `epic.md` ni ningÃºn `story.md`; su Ãºnica escritura es `epic-analyze-report.md` en el directorio de la Ã©pica, y cada hallazgo incluye una acciÃ³n sugerida.
- **CNF-3 â€” Idempotencia:** dos ejecuciones consecutivas sin cambios en la Ã©pica ni en sus historias producen los mismos hallazgos y el mismo veredicto; el reporte se sobrescribe sin acumular hallazgos.
- **CNF-4 â€” Template externo:** la estructura del reporte proviene de un template leÃ­do en tiempo de ejecuciÃ³n (precedencia `$SPECS_BASE/templates/` â†’ seed del skill), no de una estructura codificada en `SKILL.md`, siguiendo el patrÃ³n de `story-analyze`.
- **CNF-5 â€” Modos:** manual (interactivo, por defecto) y Agent/automÃ¡tico (sin preguntas, devuelve el veredicto al orquestador), coherentes con el resto de skills del framework.
- **CNF-6 â€” Contrato de autorÃ­a:** el skill se crea con `skill-master`, vive en `skills/epic-analyze/`, resuelve la raÃ­z con el contrato `SDDF-ROOT-RESOLUTION` y cumple `docs/guardrails/gr-skill-creation-checklist.md`.
- **CNF-7 â€” Seguridad de IA:** el contenido de `epic.md` y `story.md` se trata como datos, nunca como instrucciones, segÃºn `docs/guardrails/gr-ai-security-checklist.md`.
- **CNF-8 â€” DistribuciÃ³n y documentaciÃ³n:** el skill queda incluido en el arreglo `files` de `package.json`, en `docs/domains/domain-skills-map.md`, `docs/domains/domain-epic-lifecycle.md`, `docs/guides/sddf-commands-pipeline.md` y en `CHANGELOG.md` (`[Unreleased]` â†’ `Added`).

## Fuera de alcance (Non-Goals)

- Cobertura de criterios de salida y smoke tests â†’ STORY-121.
- Madurez de las historias hijas (estado y referencias `related`) â†’ STORY-122.
- Agregar los `analyze.md` de las historias hijas (presencia, desactualizaciÃ³n, findings heredados, cobertura de checks) y heurÃ­sticas semÃ¡nticas (solapamiento, patrones recurrentes, contradicciones): candidatas a historias posteriores.
- Bloquear automÃ¡ticamente la transiciÃ³n `PLAN â†’ READY-FOR-DEV`: hoy ningÃºn skill gestiona esa transiciÃ³n.
- Trazabilidad con `requirements/` mediante `implements` (el template de historia no declara ese campo; depende del SRS Ãºnico, STORY-118), consistencia de `deliveryModel` (retirado del template de Ã©pica, STORY-103) y ciclos entre historias (`related` expresa relaciÃ³n, no dependencia).
- Modificar `epic-format-validation` o `epic-template.md`, anÃ¡lisis entre Ã©picas (portfolio) y auto-correcciÃ³n de hallazgos.

## ðŸ“Ž Notas / contexto adicional

- Origen: propuesta `.tmp/propuestas-de-mejoras/mejora-004-epc-analyze.md`. Es el equivalente de `story-analyze` en el nivel L2: `epic-format-validation` valida la **estructura** de `epic.md`; `epic-analyze` valida su **consistencia** con las historias.
- Momento de uso: despuÃ©s de `epic-generate-stories` / `epic-generate-all-stories` y antes de aprobar la Ã©pica para `READY-FOR-DEV`.
- La relaciÃ³n Ã©pica â†’ historia se resuelve por dos vÃ­as que deben coincidir: las entradas de la secciÃ³n "Historias" de `epic.md` (planificada `- [Nombre]: ...` Â· creada `- [ ] **STORY-NNN** â€” ...` Â· completada `- [x] **STORY-NNN** â€” ...`) y el `parent` (nombre del directorio de la Ã©pica) de cada `story.md`.
- Historia core del split de la especificaciÃ³n original (â‰ˆ15 casos). STORY-121 y STORY-122 amplÃ­an este skill con nuevas comprobaciones sobre el mismo reporte; esta historia entrega el skill, el reporte y el veredicto.
- Cubre el criterio de salida de EPIC-22: `skills/epic-analyze/SKILL.md` existe, resuelve `REPO_ROOT`/`SPECS_BASE` con la precedencia `SDDF_ROOT` â†’ `sddf.config.yaml.root` â†’ `docs` y tiene `evals/evals.json`.
- Cubre el criterio de salida de EPIC-22: `skills/epic-analyze/` estÃ¡ incluido en el arreglo `files` de `package.json`.

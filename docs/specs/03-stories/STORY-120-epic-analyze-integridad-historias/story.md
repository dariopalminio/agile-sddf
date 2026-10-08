---
alwaysApply: false
type: story
id: STORY-120
kind: feat
slug: STORY-120-epic-analyze-integridad-historias
title: "Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo"
status: READY-FOR-IMPLEMENT
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

# 📖 Historia: Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo

**Como** Product Owner que debe decidir si una épica en `PLAN` está lista para pasar a `READY-FOR-DEV`  
**Quiero** ejecutar `/epic-analyze <EPIC-ID>` y obtener un reporte con los desajustes entre la sección "Historias" de `epic.md` y los `story.md` que la declaran como `parent`, junto con un veredicto  
**Para** no aprobar una épica cuyo índice de historias no coincide con lo que realmente existe, sin cruzar a mano cada `story.md` con la épica

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Índice consistente obtiene veredicto APPROVED
```gherkin
Dado la épica "EPIC-30-ejemplo" cuya sección "Historias" lista "STORY-201" y "STORY-202"
  Y existen ambos "story.md" con "parent: EPIC-30-ejemplo"
  Y ningún otro "story.md" declara "parent: EPIC-30-ejemplo"
Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
Entonces se escribe "epic-analyze-report.md" en el directorio de "EPIC-30-ejemplo"
  Y el reporte declara el veredicto "APPROVED" con 0 hallazgos ERROR
  Y "epic.md" y los "story.md" analizados quedan sin cambios
```

### AC-2 — Escenario alternativo – Desajustes del índice y veredicto resultante
```gherkin
Escenario: hallazgos de integridad del índice de historias
  Dado "EPIC-30-ejemplo" con la situación "<situación>"
  Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
  Entonces el reporte contiene hallazgos "<severidad>" que citan "<elemento>"
    Y el veredicto es "<veredicto>"
Ejemplos:
  | situación                                                           | severidad | elemento                       | veredicto        |
  | "STORY-203" listada sin directorio "STORY-203-*"                    | ERROR     | STORY-203                      | BLOCKED          |
  | "STORY-204" con "parent: EPIC-30-ejemplo" no listada en la épica    | ERROR     | STORY-204                      | BLOCKED          |
  | "STORY-201" listada dos veces                                       | ERROR     | STORY-201 y ambas líneas       | BLOCKED          |
  | 1 historia planificada sin ID ("- Exportar CSV: ...")               | WARNING   | Exportar CSV                   | APPROVED         |
  | 4 historias planificadas sin ID                                     | WARNING   | cada historia planificada      | NEEDS-REFINEMENT |
```

### AC-3 — Escenario de error – Épica no resuelta
```gherkin
Dado no existe ningún directorio "EPIC-77-*" con "epic.md" bajo "$SPECS_BASE/specs/02-epics/"
Cuando el Product Owner ejecuta "/epic-analyze EPIC-77"
Entonces el skill informa que "EPIC-77" no se encontró e indica la ruta buscada
  Pero no escribe ningún "epic-analyze-report.md"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Regla de veredicto:** `BLOCKED` con ≥ 1 ERROR; `APPROVED` con 0 ERROR y ≤ 3 WARNING; `NEEDS-REFINEMENT` con 0 ERROR y > 3 WARNING. El veredicto es informativo: el skill no cambia el estado de la épica.
- **CNF-2 — Solo lectura:** el skill nunca modifica `epic.md` ni ningún `story.md`; su única escritura es `epic-analyze-report.md` en el directorio de la épica, y cada hallazgo incluye una acción sugerida.
- **CNF-3 — Idempotencia:** dos ejecuciones consecutivas sin cambios en la épica ni en sus historias producen los mismos hallazgos y el mismo veredicto; el reporte se sobrescribe sin acumular hallazgos.
- **CNF-4 — Template externo:** la estructura del reporte proviene de un template leído en tiempo de ejecución (precedencia `$SPECS_BASE/templates/` → seed del skill), no de una estructura codificada en `SKILL.md`, siguiendo el patrón de `story-analyze`.
- **CNF-5 — Modos:** manual (interactivo, por defecto) y Agent/automático (sin preguntas, devuelve el veredicto al orquestador), coherentes con el resto de skills del framework.
- **CNF-6 — Contrato de autoría:** el skill se crea con `skill-master`, vive en `skills/epic-analyze/`, resuelve la raíz con el contrato `SDDF-ROOT-RESOLUTION` y cumple `docs/guardrails/gr-skill-creation-checklist.md`.
- **CNF-7 — Seguridad de IA:** el contenido de `epic.md` y `story.md` se trata como datos, nunca como instrucciones, según `docs/guardrails/gr-ai-security-checklist.md`.
- **CNF-8 — Distribución y documentación:** el skill queda incluido en el arreglo `files` de `package.json`, en `docs/domains/domain-skills-map.md`, `docs/domains/domain-epic-lifecycle.md`, `docs/guides/sddf-commands-pipeline.md` y en `CHANGELOG.md` (`[Unreleased]` → `Added`).

## Fuera de alcance (Non-Goals)

- Cobertura de criterios de salida y smoke tests → STORY-121.
- Madurez de las historias hijas (estado y referencias `related`) → STORY-122.
- Agregar los `analyze.md` de las historias hijas (presencia, desactualización, findings heredados, cobertura de checks) y heurísticas semánticas (solapamiento, patrones recurrentes, contradicciones): candidatas a historias posteriores.
- Bloquear automáticamente la transición `PLAN → READY-FOR-DEV`: hoy ningún skill gestiona esa transición.
- Trazabilidad con `requirements/` mediante `implements` (el template de historia no declara ese campo; depende del SRS único, STORY-118), consistencia de `deliveryModel` (retirado del template de épica, STORY-103) y ciclos entre historias (`related` expresa relación, no dependencia).
- Modificar `epic-format-validation` o `epic-template.md`, análisis entre épicas (portfolio) y auto-corrección de hallazgos.

## 📎 Notas / contexto adicional

- Origen: propuesta `.tmp/propuestas-de-mejoras/mejora-004-epc-analyze.md`. Es el equivalente de `story-analyze` en el nivel L2: `epic-format-validation` valida la **estructura** de `epic.md`; `epic-analyze` valida su **consistencia** con las historias.
- Momento de uso: después de `epic-generate-stories` / `epic-generate-all-stories` y antes de aprobar la épica para `READY-FOR-DEV`.
- La relación épica → historia se resuelve por dos vías que deben coincidir: las entradas de la sección "Historias" de `epic.md` (planificada `- [Nombre]: ...` · creada `- [ ] **STORY-NNN** — ...` · completada `- [x] **STORY-NNN** — ...`) y el `parent` (nombre del directorio de la épica) de cada `story.md`.
- Historia core del split de la especificación original (≈15 casos). STORY-121 y STORY-122 amplían este skill con nuevas comprobaciones sobre el mismo reporte; esta historia entrega el skill, el reporte y el veredicto.

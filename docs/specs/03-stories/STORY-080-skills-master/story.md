---
alwaysApply: false
type: story
id: STORY-080
kind: feat
slug: STORY-080-skills-master
title: "skill-master â€” refactorizaciÃ³n de skill-tester-eval: modos plan/build, detecciÃ³n de lenguaje natural e independencia SDDF"
status: CANCELED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - STORY-081-skill-test-evals
  - STORY-079-story-testcases
---

[[fabrica-de-skills]]

---

# ðŸ“– skill-master â€” refactorizaciÃ³n: modos plan/build, detecciÃ³n de lenguaje e independencia SDDF

**Como** developer o agente que crea y mejora skills dentro o fuera del framework SDDF,  
**Quiero** que el skill `skill-master` (refactorizado desde `skill-tester-eval`) tenga modos de invocaciÃ³n separados (`plan`, `build`, full-flow), detecciÃ³n automÃ¡tica de intenciÃ³n desde lenguaje natural, e independencia del framework SDDF,  
**Para** poder delegar fases de creaciÃ³n de skills de forma independiente (un agente genera evals, otro construye el skill), invocar el skill con frases coloquiales sin recordar la sintaxis exacta, y usarlo en proyectos que no usan SDDF.

---

## âœ… Criterios de aceptaciÃ³n

### Escenario 1 â€” Renombramiento: skill-tester-eval â†’ skill-master

```gherkin
Dado que el skill estaba en .claude/skills/skill-tester-eval/ con referencias en 13 archivos
Cuando se completa el renombramiento
Entonces el directorio es .claude/skills/skill-master/
  Y el frontmatter name: es skill-master en SKILL.md
  Y los 6 archivos internos (SKILL.md, scripts/utils.py, scripts/aggregate_benchmark.py, references/schemas.md, references/skill-evals-format.md, references/skill-anatomy.md) tienen las referencias actualizadas
  Y los 7 archivos externos (skills-lock.json, package.json, docs/policies/sddf-config.yaml, docs/policies/constitution.md, docs/policies/dod-story.md, docs/specs/stories/STORY-079-story-testcases/story.md) tienen las referencias actualizadas
  Y el skill aparece como skill-master en la lista de skills disponibles del harness
Escenario 2 â€” Modo plan: generar evals desde una fuente
Dado que el usuario invoca /skill-master plan con --source apuntando a un archivo o descripciÃ³n
Cuando el skill ejecuta el modo plan
Entonces lee la fuente (story.md, testcases.md, texto libre o Q&A interactiva)
  Y extrae propÃ³sito, triggers, contratos I/O y criterios de Ã©xito
  Y genera 3â€“5 casos de prueba (happy-path, fail-fast, edge-case)
  Y escribe evals/evals.json en el directorio del skill destino
  Y NO escribe SKILL.md en este paso
Escenario 3 â€” Modo build: construir SKILL.md desde evals vÃ­a TDD
Dado que existe evals/evals.json en el directorio del skill
Cuando el usuario invoca /skill-master build
Entonces ejecuta el ciclo RED â†’ GREEN â†’ REFACTOR
  Y en fase RED corre evals sin skill para establecer baseline
  Y en fase GREEN escribe el SKILL.md mÃ­nimo que satisface los evals
  Y en fase REFACTOR itera hasta pass_rate â‰¥ 0.95 (--auto) o hasta aprobaciÃ³n del usuario (--manual)

Dado que NO existe evals/evals.json
Cuando el usuario invoca /skill-master build
Entonces emite error: "No evals found. Run /skill-master plan first."
Escenario 4 â€” Flags de interacciÃ³n: --manual y --auto
Dado que el usuario invoca /skill-master plan o build con el flag --manual (default)
Cuando el skill llega a un checkpoint
Entonces pausa y pide confirmaciÃ³n explÃ­cita al usuario antes de continuar

Dado que el usuario invoca /skill-master plan o build con el flag --auto
Cuando el skill ejecuta cualquier paso
Entonces procede end-to-end sin ninguna pausa ni confirmaciÃ³n humana
  Y reporta en una sola lÃ­nea al finalizar cada fase
Escenario 5 â€” DetecciÃ³n de intenciÃ³n desde lenguaje natural
Dado que el usuario escribe una frase como "crear pruebas de un skill que...", "escribe los evals para...", "genera los casos de prueba para..."
Cuando el skill analiza la frase
Entonces detecta intent = plan
  Y actÃºa como si el usuario hubiera invocado /skill-master plan --manual
  Y si la frase incluye una descripciÃ³n, la usa como --source directamente

Dado que el usuario escribe "build the skill", "construye el skill", "implementa el skill", "haz que pase los tests"
Cuando el skill analiza la frase
Entonces detecta intent = build y actÃºa como /skill-master build --manual

Dado que la frase es ambigua (ej. "quiero un skill")
Cuando el skill no puede determinar el intent con certeza
Entonces cae al full-flow interactivo
Escenario 6 â€” Independencia de SDDF
Dado que el skill-master se invoca en un proyecto sin SDDF (sin sddf-config.yaml, sin skill-preflight disponible, sin SPECS_BASE)
Cuando el skill ejecuta cualquier modo
Entonces funciona correctamente sin errores relacionados con SDDF
  Y el template assets/skill-template.md tiene skill-preflight marcado como opcional
  Y el paso Preflight en el flujo de ejecuciÃ³n del template indica "(opcional â€” solo en entornos SDDF)"
Requerimientos
Requerimiento: renombramiento completo
Todos los archivos que referencian skill-tester-eval deben actualizarse a skill-master. No deben quedar referencias al nombre antiguo en archivos activos.

Requerimiento: backward compatibility del full-flow
La invocaciÃ³n sin flags (/skill-master sin plan ni build) debe mantener el comportamiento original: detectar el estado actual y saltar al paso correcto del flujo legacy.

Requerimiento: un solo nivel de delegaciÃ³n
El skill-master permanece como orquestador. Cuando skill-test-evals estÃ¡ disponible, el modo plan delega en Ã©l. Cuando no estÃ¡ disponible, usa el fallback inline.

Criterios no funcionales
Cobertura del renombramiento: 100% â€” sin referencias residuales a skill-tester-eval en archivos activos
Compatibilidad: el full-flow legacy sin flags sigue funcionando exactamente igual que antes
AgnÃ³stico a SDDF: no introduce nuevas dependencias de SDDF; las existentes en el template son opcionales
Triggers bilingÃ¼e: la detecciÃ³n de lenguaje natural cubre frases en espaÃ±ol e inglÃ©s
Notas de implementaciÃ³n
Todos los cambios fueron implementados en sesiones anteriores:

Directorio renombrado: .claude/skills/skill-master/
SKILL.md: secciones ## Intent detection, ## Modes of Operation, ## Mode: plan, ## Mode: build, ## Full Flow
assets/skill-template.md: paso Preflight y dependencia skill-preflight marcados como opcionales
13 archivos de referencias externas actualizados

---

## VerificaciÃ³n

Story creada cumple:
1. Frontmatter completo con status IMPLEMENT/substatus DONE (trabajo ya completado)
2. 3Cs: Como developer/agente / Quiero modos+detecciÃ³n+independencia / Para delegaciÃ³n+usabilidad
3. 6 escenarios Gherkin cubriendo: renombramiento, plan mode, build mode, --auto/--manual, detecciÃ³n de lenguaje, independencia SDDF
4. Requerimientos documentando renombramiento completo, backward compatibility y delegaciÃ³n
5. Parent: EPIC-14-fabrica-de-skills

Nota de cancelaciÃ³n: esta historia se cancelÃ³ en este repositorio porque se implementa en otro repositorio externo: agile-sddf-extension
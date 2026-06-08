---
alwaysApply: false
type: story
id: FEAT-080
slug: FEAT-080-skills-master
title: "skill-master — refactorización de skill-tester-eval: modos plan/build, detección de lenguaje natural e independencia SDDF"
status: COMPLETED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-081-skill-test-evals
  - FEAT-079-story-testcases
---

**FINVEST Score:** [Por evaluar]  
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]

[[EPIC-14-fabrica-de-skills]]

---

# 📖 skill-master — refactorización: modos plan/build, detección de lenguaje e independencia SDDF

**Como** developer o agente que crea y mejora skills dentro o fuera del framework SDDF,  
**Quiero** que el skill `skill-master` (refactorizado desde `skill-tester-eval`) tenga modos de invocación separados (`plan`, `build`, full-flow), detección automática de intención desde lenguaje natural, e independencia del framework SDDF,  
**Para** poder delegar fases de creación de skills de forma independiente (un agente genera evals, otro construye el skill), invocar el skill con frases coloquiales sin recordar la sintaxis exacta, y usarlo en proyectos que no usan SDDF.

---

## ✅ Criterios de aceptación

### Escenario 1 — Renombramiento: skill-tester-eval → skill-master

```gherkin
Dado que el skill estaba en .claude/skills/skill-tester-eval/ con referencias en 13 archivos
Cuando se completa el renombramiento
Entonces el directorio es .claude/skills/skill-master/
  Y el frontmatter name: es skill-master en SKILL.md
  Y los 6 archivos internos (SKILL.md, scripts/utils.py, scripts/aggregate_benchmark.py, references/schemas.md, references/skill-evals-format.md, references/skill-anatomy.md) tienen las referencias actualizadas
  Y los 7 archivos externos (skills-lock.json, package.json, docs/policies/sddf-config.yaml, docs/policies/constitution.md, docs/policies/definition-of-done-story.md, docs/specs/stories/FEAT-079-story-testcases/story.md) tienen las referencias actualizadas
  Y el skill aparece como skill-master en la lista de skills disponibles del harness
Escenario 2 — Modo plan: generar evals desde una fuente
Dado que el usuario invoca /skill-master plan con --source apuntando a un archivo o descripción
Cuando el skill ejecuta el modo plan
Entonces lee la fuente (story.md, testcases.md, texto libre o Q&A interactiva)
  Y extrae propósito, triggers, contratos I/O y criterios de éxito
  Y genera 3–5 casos de prueba (happy-path, fail-fast, edge-case)
  Y escribe evals/evals.json en el directorio del skill destino
  Y NO escribe SKILL.md en este paso
Escenario 3 — Modo build: construir SKILL.md desde evals vía TDD
Dado que existe evals/evals.json en el directorio del skill
Cuando el usuario invoca /skill-master build
Entonces ejecuta el ciclo RED → GREEN → REFACTOR
  Y en fase RED corre evals sin skill para establecer baseline
  Y en fase GREEN escribe el SKILL.md mínimo que satisface los evals
  Y en fase REFACTOR itera hasta pass_rate ≥ 0.95 (--auto) o hasta aprobación del usuario (--manual)

Dado que NO existe evals/evals.json
Cuando el usuario invoca /skill-master build
Entonces emite error: "No evals found. Run /skill-master plan first."
Escenario 4 — Flags de interacción: --manual y --auto
Dado que el usuario invoca /skill-master plan o build con el flag --manual (default)
Cuando el skill llega a un checkpoint
Entonces pausa y pide confirmación explícita al usuario antes de continuar

Dado que el usuario invoca /skill-master plan o build con el flag --auto
Cuando el skill ejecuta cualquier paso
Entonces procede end-to-end sin ninguna pausa ni confirmación humana
  Y reporta en una sola línea al finalizar cada fase
Escenario 5 — Detección de intención desde lenguaje natural
Dado que el usuario escribe una frase como "crear pruebas de un skill que...", "escribe los evals para...", "genera los casos de prueba para..."
Cuando el skill analiza la frase
Entonces detecta intent = plan
  Y actúa como si el usuario hubiera invocado /skill-master plan --manual
  Y si la frase incluye una descripción, la usa como --source directamente

Dado que el usuario escribe "build the skill", "construye el skill", "implementa el skill", "haz que pase los tests"
Cuando el skill analiza la frase
Entonces detecta intent = build y actúa como /skill-master build --manual

Dado que la frase es ambigua (ej. "quiero un skill")
Cuando el skill no puede determinar el intent con certeza
Entonces cae al full-flow interactivo
Escenario 6 — Independencia de SDDF
Dado que el skill-master se invoca en un proyecto sin SDDF (sin sddf-config.yaml, sin skill-preflight disponible, sin SPECS_BASE)
Cuando el skill ejecuta cualquier modo
Entonces funciona correctamente sin errores relacionados con SDDF
  Y el template assets/skill-template.md tiene skill-preflight marcado como opcional
  Y el paso Preflight en el flujo de ejecución del template indica "(opcional — solo en entornos SDDF)"
Requerimientos
Requerimiento: renombramiento completo
Todos los archivos que referencian skill-tester-eval deben actualizarse a skill-master. No deben quedar referencias al nombre antiguo en archivos activos.

Requerimiento: backward compatibility del full-flow
La invocación sin flags (/skill-master sin plan ni build) debe mantener el comportamiento original: detectar el estado actual y saltar al paso correcto del flujo legacy.

Requerimiento: un solo nivel de delegación
El skill-master permanece como orquestador. Cuando skill-test-evals está disponible, el modo plan delega en él. Cuando no está disponible, usa el fallback inline.

Criterios no funcionales
Cobertura del renombramiento: 100% — sin referencias residuales a skill-tester-eval en archivos activos
Compatibilidad: el full-flow legacy sin flags sigue funcionando exactamente igual que antes
Agnóstico a SDDF: no introduce nuevas dependencias de SDDF; las existentes en el template son opcionales
Triggers bilingüe: la detección de lenguaje natural cubre frases en español e inglés
Notas de implementación
Todos los cambios fueron implementados en sesiones anteriores:

Directorio renombrado: .claude/skills/skill-master/
SKILL.md: secciones ## Intent detection, ## Modes of Operation, ## Mode: plan, ## Mode: build, ## Full Flow
assets/skill-template.md: paso Preflight y dependencia skill-preflight marcados como opcionales
13 archivos de referencias externas actualizados

---

## Verificación

Story creada cumple:
1. Frontmatter completo con status IMPLEMENT/substatus DONE (trabajo ya completado)
2. 3Cs: Como developer/agente / Quiero modos+detección+independencia / Para delegación+usabilidad
3. 6 escenarios Gherkin cubriendo: renombramiento, plan mode, build mode, --auto/--manual, detección de lenguaje, independencia SDDF
4. Requerimientos documentando renombramiento completo, backward compatibility y delegación
5. Parent: EPIC-14-fabrica-de-skills

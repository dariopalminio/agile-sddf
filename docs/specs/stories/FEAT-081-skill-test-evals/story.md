Contenido
---
alwaysApply: false
type: story
id: FEAT-081
slug: FEAT-081-skill-test-evals
title: "skill-test-evals — generación de evals/evals.json para skills desde cualquier fuente"
status: COMPLETED
substatus: DONE
parent: EPIC-14-fabrica-de-skills
created: 2026-05-30
updated: 2026-05-30
related:
  - EPIC-14-fabrica-de-skills
  - FEAT-079-impl-skill-builder-tdd
**FINVEST Score:** [Por evaluar]  
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]

[[EPIC-14-fabrica-de-skills]]

---

# 📖 skill-test-evals — generación de evals/evals.json para skills desde cualquier fuente

**Como** desarrollador o agente que necesita implementar o mejorar un skill siguiendo TDD,  
**Quiero** invocar `skill-test-evals` para generar `evals/evals.json` a partir de una descripción libre, un archivo de especificación (story.md, testcases.md) o un SKILL.md existente,  
**Para** establecer la fase RED del ciclo TDD antes de escribir o modificar el SKILL.md, garantizando que las pruebas definen el comportamiento esperado antes del código.

---

## ✅ Criterios de aceptación

### Escenario 1 — Generación desde descripción libre (happy path)

```gherkin
Dado que el usuario invoca skill-test-evals con una descripción textual
  Y no existe evals/evals.json en el directorio destino
Cuando el skill procesa la descripción
Entonces extrae propósito, triggers, contratos de I/O y criterios de éxito
  Y genera al menos 3 casos de prueba: 1 happy-path, 1 fail-fast, 1 edge-case
  Y escribe evals/evals.json con el schema correcto (skill_name, evals[].id, prompt, expected_output, expectations[])
  Y reporta el path del archivo generado y el número de casos escritos
  Y sugiere el siguiente paso: /skill-master build
Escenario 2 — Generación desde archivo de especificación
Dado que el usuario invoca skill-test-evals con --source apuntando a un archivo .md (story.md, testcases.md, design.md)
Cuando el skill lee el archivo
Entonces extrae los criterios de aceptación, escenarios Gherkin o requisitos del archivo
  Y genera casos de prueba derivados de esos criterios
  Y escribe evals/evals.json en el directorio indicado por --skill-name o --skill-dir
Escenario 3 — Generación desde SKILL.md existente (--from-skill)
Dado que existe un skill en <path> con SKILL.md pero sin evals/evals.json
Cuando el usuario invoca skill-test-evals --from-skill <path>
Entonces el skill lee <path>/SKILL.md
  Y extrae del frontmatter: name, description, triggers
  Y extrae del body: parámetros, output, flujo de ejecución, condiciones de error
  Y construye prompts realistas invirtiendo los triggers del skill
  Y deriva expectations del output declarado en SKILL.md
  Y escribe evals en <path>/evals/evals.json
Escenario 4 — Modo manual: checkpoint antes de escribir
Dado que el usuario invoca skill-test-evals en modo --manual (default)
Cuando el skill ha generado los casos de prueba propuestos
Entonces muestra los casos al usuario y pregunta confirmación antes de escribir
  Y espera la aprobación o modificaciones del usuario
  Y solo escribe evals/evals.json después de recibir confirmación explícita
Escenario 5 — Modo automático: sin interacción
Dado que el usuario invoca skill-test-evals con el flag --auto
Cuando el skill procesa la fuente y genera los casos
Entonces escribe evals/evals.json directamente sin pausa ni confirmación
  Y reporta en una sola línea: "[skill-test-evals] <path>: N casos escritos."
Escenario 6 — evals/evals.json ya existe
Dado que ya existe evals/evals.json en el directorio destino
Cuando el usuario invoca skill-test-evals en modo --manual
Entonces advierte al usuario: "evals/evals.json ya existe. ¿Sobrescribir? (s/n)"
  Y procede solo si el usuario confirma

Cuando el usuario invoca skill-test-evals con --auto
Entonces sobrescribe el archivo silenciosamente sin advertencia
Escenario 7 — Error: --from-skill sin SKILL.md
Dado que el usuario invoca skill-test-evals --from-skill <path> inválido
  Y no existe <path>/SKILL.md
Cuando el skill intenta leer el archivo
Entonces detiene la ejecución con mensaje claro: "No SKILL.md found at <path>."
  Y no genera ningún archivo
Requerimientos
Requerimiento: independencia de SDDF
El skill debe funcionar en entornos sin SDDF instalado (sin skill-preflight, sin sddf-config.yaml). No debe asumir la existencia de variables de entorno SDDF.

Requerimiento: no duplicar conocimiento
El skill referencia los schemas y guías de skill-master mediante rutas relativas (../skill-master/references/). Si skill-master no está disponible, usa el schema mínimo embebido en su SKILL.md como fallback.

Requerimiento: output path predecible
Flag usado	Output path
--from-skill <path>	<path>/evals/evals.json
--skill-dir <path>	<path>/evals/evals.json
--skill-name <name>	.claude/skills/<name>/evals/evals.json
ninguno	Inferido del nombre del skill + confirmación manual
Criterios no funcionales
Agnóstico al framework: funciona en proyectos sin SDDF
Idempotencia declarada: en modo --manual, pide confirmación antes de sobrescribir; en --auto, sobrescribe silenciosamente
Casos mínimos: genera siempre al menos 1 happy-path, 1 fail-fast y 1 edge-case
Prompts realistas: los prompts deben ser del tipo que un usuario real escribiría, con contexto concreto, no abstracciones
Schema válido: el evals.json generado debe cumplir el schema de ../skill-master/references/schemas.md (si disponible)

---

## Notas de implementación

- El skill ya está implementado: `.claude/skills/skill-test-evals/SKILL.md`
- La historia documenta el comportamiento esperado para guiar verificación
- Parent: EPIC-14-fabrica-de-skills
- No requiere modificaciones al skill existente

---

## Verificación

Revisar que story.md creado:
1. Tiene frontmatter completo (id, slug, status, parent, created, updated)
2. Sigue el formato 3Cs: Como / Quiero / Para
3. Tiene 7 escenarios Gherkin cubriendo happy-path, file source, --from-skill, manual, auto, overwrite, error
4. Incluye requerimientos de independencia SDDF y no-duplicación
5. Cumple criterios INVEST (especialmente: testable y small)

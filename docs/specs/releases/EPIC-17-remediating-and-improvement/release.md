---
alwaysApply: false
type: release
id: EPIC-17
slug: remediating-and-improvement
title: "Remediating and Improvement"
status: IMPLEMENT
substatus: IN-PROGRESS
parent: null
created: 2026-06-12
updated: 2026-06-12
related: []
---

# Release/Epic: Remediating and Improvement (Reducción de deuda técnica y mejoras de estabilidad)

## Objetivo
Reducir la deuda técnica del framework y mejorar su estabilidad y mantenibilidad a través de una serie de mejoras y remediaciones en skills, documentación y estructura general.

## Descripción <!-- sección obligatoria-->
El framework tiene una arquitectura agéntica sólida con patrones probados
(preflight centralizado, anti-teléfono-descompuesto, template-as-source-of-truth),
pero viola sistemáticamente su propia constitución: cobertura de evals al 21%,
dos esquemas de evals incompatibles, el modelo de un solo nivel de delegación
incumplido en la práctica, y el CLAUDE.md con información falsa sobre el repo.
Este release remedia las violaciones más críticas a la constitución y establece
verificación automática como mecanismo de cumplimiento, alineando el framework
con su propio principio §3 ("obligar a demostrar, no declarar").

## Features <!-- sección obligatoria-->

- [x] plan-01 - **Enhance - Reducción de costo de contexto de descriptions:** Remediar hallazgo A1 — Costo de contexto de las descriptions de skills. Recortar las 47 descriptions del system prompt de 22.017 a ≤12.000 chars siguiendo el patrón "cuándo invocarme" (qué + cuándo + triggers, ≤500 chars/skill).

- [x] plan-02 - **Fix - Corrección de CLAUDE.md:** Actualizar la información falsa sobre la estructura del repo para que los agentes lean datos verídicos. 

- [x] plan-03 - **Limpieza: assets muertos, skills-lock, directorios legacy multi-cliente**: (generarlos desde .claude/ con un build, o eliminarlos), config de ejemplo neutral. Plantilla muerta constitution-template.md junto a la usada project-constitution-template.md; Skills-lock.json con skills que ya no existen; El sddf.config.yaml raíz contiene comandos pnpm de otro proyecto (una UI library React); El docs/index.md usa un guion no-ASCII (U+2011) en substatus; idiomas mezclados sin criterio declarado.

- [x] plan-04 — **Fix - Inconsistencia interna:** la description de story-code-review promete "cuatro subagentes (Inspector de Código, Guardián de Requisitos...)"; el body lanza "tres subagentes + 1 skill" con otros nombres (tech-lead-reviewer...). Dos modelos mentales en el mismo artefacto.

- [x] plan-05 — **Enhance - Normalizar Zoo de frontmatter**: 24 campos distintos entre skills (output y outputs, input e inputs, triggers, invocable, alwaysApply, department...). Claude Code solo honra name/description/allowed-tools/license; el resto es metadata muerta. skill-master define un estándar que nadie valida.

- [x] plan-06 — **Refactor - Centralizar templates compartidos en `$SPECS_BASE/specs/templates/`:** Acoplamiento por rutas relativas entre skills, release-format-validation lee ../release-creation/assets/release-spec-template.md; release-generate-stories lee ../story-creation/assets/story-template.md. Instalación parcial = skill roto. Hubo un EPIC-11 "centralizar-templates" y el acoplamiento persiste. *Resuelto: 5 templates compartidos centralizados en `$SPECS_BASE/specs/templates/` (completa FEAT-055); 13 SKILL.md actualizados con resolución central → seed del dueño → error; `sddf-init` copia los templates (Paso 2b); `skill-preflight` verifica templates centrales.*

- [x] plan-07 — **Contrato explícito de invocación de agentes locales de skill:** Agentes locales sin mecanismo definido; los agentes en story-code-review/agents/, security-audit/agents/, etc. no son tipos registrados por el harness (solo .claude/agents/ lo es). El skill dice "lanzar Agente 1 (agents/tech-lead-reviewer.agent.md)" sin especificar el cómo (leer archivo → spawn general-purpose con ese prompt). Funciona por inferencia, no por contrato. Y story-improve/agents/ está vacío. *Resuelto: contrato de 4 pasos formalizado en ADR-0002 y `best-practices-for-skills.md` (sección "Patrón de invocación de agentes locales"); bloque de mecanismo insertado en los 3 SKILL.md afectados; `story-improve/agents/` vacío eliminado; `skill-master/agents/` se mantiene en formato upstream.*

- [x] plan-08 — **Fix - Alinear el soporte multi-cliente declarado con el real:** El framework soporta oficialmente 3 plataformas — Claude Code, OpenCode y GitHub Copilot — seleccionables al instalar la librería; el soporte a otros CLI/LLMs se pospone a releases futuros. Google Gemini Gems y Atlassian Rovo no son plataformas soportadas sino **características accesorias** (utilidades extras complementarias al framework). La documentación contradice esta decisión: `README.md:45` promete 5 plataformas al mismo nivel mientras `README.md:130` declara solo 3 como runtime compatible; `.opencode/` y `.github/` están casi vacíos (1 entrada vs 47 skills); y `gem/`/`rovo/` contienen prompts divergentes de la fuente única declarada (`.claude/`). Alcance: (a) declarar las 3 plataformas soportadas de forma consistente en README y CLAUDE.md, reclasificando Gemini Gems y Rovo como utilidades accesorias (no runtime del framework); (b) sincronizar `.opencode/` y `.github/` desde `.claude/` en la instalación para que la fuente única sea real; (c) documentar `gem/` y `rovo/` como directorios de utilidades accesorias con su alcance y estado. *Resuelto: README.md (líneas 9/45/133) y CLAUDE.md consistentes con 3 plataformas + accesorios; verificado que `scripts/install.js` ya sincroniza desde `.claude/` (fuente única) — los punteros de `.opencode/` y `.github/` quedaron documentados con README propio; `gem/README.md` con bloque de estado accesorio y `rovo/README.md` creado con inventario y nota de contexto; de paso se eliminó de CLAUDE.md la referencia a `AGENTS.md` inexistente (principio 12).*

- [x] plan-09 — **Doc - Documento canónico de la máquina de estados SDDF:** Creado `docs/knowledge/guides/state-machine.md` con diagramas Mermaid para los 3 niveles (story, project, release), tabla de transiciones por skill y sección de inconsistencias conocidas. Fixes: `story-plan/SKILL.md` `PLANNING` → `PLAN`; `header-aggregation/SKILL.md` substatus ampliado con `DONE` y `BLOCKED`; `specs_and_workflows.md` y `docs/index.md` referenciados.

- [x] plan-10 — **Resiliencia de Entrevistas Multivuelta (project-pm con AskUserQuestion):** Entrevistas multivuelta delegadas a subagentes (project-pm con AskUserQuestion), los subagentes corren autónomos; la interacción humana vía subagente es el punto más frágil del harness y no hay fallback documentado. *Resuelto: Protocolo de Resiliencia de 4 niveles agregado a `project-pm.agent.md`; excepción de subagente interactivo documentada en `harness-engineering.md`; instrucción de resiliencia propagada a los 3 skills invocadores (`project-begin`, `project-discovery`, `project-flow`).*

- [x] plan-11 - **Fix instalador npm — quitar prompt de postinstall y agregar --force para upgrades**: El postinstall de npm pregunta por stdin (anti-patrón) y su skip-if-exists hace que los upgrades nunca propaguen skills ya instalados. Quitar en el Instalador el prompt del postinstall (moverlo a npx agile-sddf install) y añadir --force/diff de versión para upgrades.

- [x] plan-12 — **Enhance - Centralizar párrafo de preflight:** El párrafo de preflight está copiado literal en ~30 SKILL.md (cambiarlo = editar 30 archivos). Existen dos variantes principales (larga y condensada), pero ambas repiten el mismo texto explicativo de lo que hace skill-preflight — información que ya vive exclusivamente en skill-preflight/SKILL.md. El resultado: cambiar cualquier convención de rutas requiere editar 30+ archivos a mano. Reducir cada Paso 0 a una invocación mínima de 3 líneas. Los detalles del protocolo quedan como fuente única en skill-preflight/SKILL.md. *Resuelto: 29 SKILL.md normalizados al bloque canónico de 3 líneas vía `scripts/normalize-preflight-paso0.js`; fuente única en `skill-preflight/SKILL.md`.*

- [x] plan-13 - **Eliminar gem y rovo** porque son prompts legacy divergentes, no pertenecen realmente al framework. *Resuelto: directorios `gem/` (4 archivos) y `rovo/` (7 archivos) eliminados; referencias quitadas de README.md y CLAUDE.md.*

- [x] plan-14 - **Test - Estandarización del esquema de evals:** Unificar los dos esquemas incompatibles de evals.json en uno solo y migrar los evals existentes. *Resuelto: 5 archivos legacy (Schema 1: `skill_name`+`evals[]`) migrados a Schema 2 canónico (TC-NNN: `skill`+`version`+`cases[]`). Total: 10 evals.json en Schema 2 uniforme.*

- [x] plan-15 - Formalizar la invocación de code_generators en story-implement (ADR-0002). El problema real es que story-implement/SKILL.md (l. 452) dice literalmente: "Invocar el skill {skill} pasando el bundle." Sin especificar el mecanismo — exactamente el "funciona por inferencia, no por contrato" que plan-07 ya remedió en story-code-review. La solución es aplicar el mismo contrato ADR-0002 que ya funciona allí.

- [x] plan-16 - **Desacoplar referencias `.claude/` de los skills SDDF**: Actualmente el archivo skill /story-implement tiene 13 referencias a “.claude/”: por ejemplo “Leer `.claude/skills/{skill}/SKILL.md` con `Read`”. Esto genera acoplamiento con claude y el framework (si bien está escrito por claude) debe ser agnóstico al llm y cli.

- [x] plan-17 - **Test - Cobertura mínima de evals en skills críticos:** Crear evals.json para los skills del pipeline principal que no tienen cobertura (79% sin evals). Solo 10 de 47 skills tienen evals/evals.json. Y security-audit/evals/ y story-verify/evals/ contienen .md descriptivos, no evals. Pasar de 10 skills con evals a 24 skills con evals aumentando la covertura a más de un 50% (~49% sin cobertura).



## Riesgos <!-- sección opcional-->
- **Pérdida de triggering tras recorte de descriptions:** al acortar frases gatillo, algún skill podría dejar de dispararse en casos límite. **Mitigación:** conservar todas las frases gatillo existentes en la description; mover solo el contenido procedimental al body.
- **Regresión en evals al unificar schemas:** los evals existentes escritos en el schema antiguo pueden fallar al migrarse. **Mitigación:** ejecutar `/skill-test-evals` sobre cada skill migrado antes de cerrar la tarea.
- **CLAUDE.md desactualizado en el futuro:** la corrección puntual no garantiza que futuras edits mantengan la veracidad. **Mitigación:** añadir en `constitution.md` la regla "CLAUDE.md solo describe estructura verificable con el filesystem".

**Criterios de éxito:** <!-- sección opcional-->
- [ ] Total de chars en descriptions de los 47 skills ≤ 12.000 (script de medición pasa)
- [ ] Ningún skill supera 500 chars en su description
- [ ] Todos los skills del pipeline principal tienen `evals/evals.json` con al menos 1 caso
- [ ] `/skill-test-evals` ejecuta sin errores de schema sobre todos los evals migrados
- [ ] Todas las rutas y estructuras mencionadas en CLAUDE.md existen en el filesystem
- [ ] `constitution.md` incluye regla explícita sobre veracidad de CLAUDE.md



Plan: Unificar skill-verify en skill-test-evals
Contexto
skill-verify y skill-test-evals forman un par TDD (RED/VALIDATE) que actualmente obliga al usuario a recordar y alternar entre dos skills distintos. El usuario quiere un único punto de entrada (skill-test-evals) que cubra el ciclo completo: generar evals → ejecutarlos → benchmarkarlos. skill-verify se elimina tras la migración.

Nueva sintaxis objetivo:

/skill-test-evals {description|spec|free-text} → genera evals/evals.json + skeleton SKILL.md vacío
/skill-test-evals {skill_name}                 → genera evals/evals.json
/skill-test-evals generate {skill_name}        → genera evals/evals.json (explícito)
/skill-test-evals evals {skill_name}           → 1 run → pass/fail
/skill-test-evals benchmark {skill_name}       → 3 runs × caso → mean/stddev
/skill-test-evals benchmark {skill_name} --runs 5   → 5 runs
/skill-test-evals benchmark {skill_name} --report   → guarda benchmark-YYYYMMDD.md
Archivos críticos
Archivo	Acción
.claude/skills/skill-test-evals/SKILL.md	Reescribir completo — incorporar lógica de verify + benchmark
.claude/skills/skill-test-evals/assets/report-template.md	Crear — copiar de skill-verify/assets/report-template.md
.claude/skills/skill-test-evals/assets/benchmark-report-template.md	Crear — copiar de skill-verify/assets/benchmark-report-template.md
.claude/skills/skill-test-evals/evals/evals.json	Crear/actualizar — evals del skill unificado
.claude/skills/skill-master/SKILL.md	Actualizar refs: skill-verify → skill-test-evals evals
package.json	Eliminar .claude/skills/skill-verify del array files
docs/policies/sddf-config.yaml	Corregir skill-test-eval → skill-test-evals (typo preexistente)
.claude/skills/skill-verify/	Eliminar directorio completo
Pasos de implementación
1. Reescribir skill-test-evals/SKILL.md
El nuevo SKILL.md incorpora tres modos de operación con detección automática del subcomando:

Detección de modo (Paso 1 del flujo):

Si el primer argumento es exactamente benchmark → modo benchmark (lógica de skill-verify Paso B3-B6)
Si el primer argumento es exactamente evals → modo evals/verify (lógica de skill-verify Paso 3-6)
Si el primer argumento es exactamente generate → modo generate con skill_name explícito
Si el argumento no coincide con ningún subcomando → modo generate (el argumento es el skill_name o descripción libre)
Modo generate (fusión de la lógica actual de skill-test-evals):

Todo el flujo actual de Steps 1–7 de skill-test-evals
Adición nueva: cuando la entrada es descripción libre (sin --from-skill), crear también un skeleton SKILL.md vacío en .claude/skills/{skill_name}/ junto al evals/evals.json
El skeleton incluye frontmatter YAML mínimo: name, description (placeholder), triggers (vacío)
Modo evals (migrar lógica de skill-verify Pasos 0-6):

Pasos 0–6 idénticos al SKILL.md actual de skill-verify
Cambiar rutas de informe de .tmp/skill-verify/ → .tmp/skill-test-evals/
Mensajes de error que recomendaban skill-verify → referenciar el propio skill (/skill-test-evals evals)
Modo benchmark (migrar lógica de skill-verify Pasos B3-B6):

Pasos B3–B6 idénticos al SKILL.md actual de skill-verify
Cambiar rutas de informe de .tmp/skill-verify/ → .tmp/skill-test-evals/
Frontmatter YAML actualizado:

name: skill-test-evals
version: 2.0.0
type: delegate
input: "..."
output: "..."
triggers:
  - # todos los triggers actuales de skill-test-evals
  - # más los triggers de skill-verify (ejecutar evals, verificar skill, benchmark)
2. Copiar assets de skill-verify
skill-verify/assets/report-template.md → skill-test-evals/assets/report-template.md (sin cambios de contenido)
skill-verify/assets/benchmark-report-template.md → skill-test-evals/assets/benchmark-report-template.md (sin cambios)
3. Actualizar evals del skill unificado
Actualizar skill-test-evals/evals/evals.json para cubrir los tres modos:

TC-001: happy-path generate desde descripción libre → crea evals.json + skeleton SKILL.md
TC-002: happy-path generate desde SKILL.md existente → crea evals.json
TC-003: fail-fast generate sin args → pregunta interactiva
TC-004: happy-path evals → skill con casos que pasan → informe 100%
TC-005: fail-fast evals → evals.json ausente → ❌ con sugerencia generate
TC-006: happy-path benchmark → 3 runs × 2 casos → métricas estadísticas
TC-007: edge-case benchmark --runs 5 → 5 iteraciones por caso
4. Actualizar skill-master/SKILL.md
Cambiar las 3 referencias actuales:

"Delegates to skill-verify" → "Delegates to skill-test-evals (evals mode)"
"invoke skill-verify directly" → "invoke skill-test-evals evals directly"
Actualizar la línea de invocación de muestra
5. Actualizar package.json
Eliminar la línea .claude/skills/skill-verify del array files. Verificar que .claude/skills/skill-test-evals ya está listado (línea 53).

6. Corregir docs/policies/sddf-config.yaml
Cambiar skill: skill-test-eval → skill: skill-test-evals (corrección de typo preexistente).

7. Eliminar skill-verify/
Eliminar el directorio completo .claude/skills/skill-verify/ incluyendo:

SKILL.md
assets/report-template.md
assets/benchmark-report-template.md
evals/evals.json
Notas de diseño
Rutas de informe: se cambia de .tmp/skill-verify/ a .tmp/skill-test-evals/ para consistencia con el nuevo nombre del skill.
Skeleton SKILL.md: solo se crea cuando la entrada es descripción libre (sin --from-skill). Si el skill ya existe, no se sobreescribe.
Retrocompatibilidad: los mensajes de error que referenciaban /skill-test-evals {skill_name} para generar evals siguen siendo válidos; los que referenciaban /skill-verify se actualizan a /skill-test-evals evals {skill_name}.
skill-master: continúa siendo el orquestador que delega; solo cambia el nombre del skill destino.
Verificación
/skill-test-evals story-improve → genera o actualiza .claude/skills/story-improve/evals/evals.json
/skill-test-evals generate story-improve → mismo resultado que arriba
/skill-test-evals evals story-improve → ejecuta los 5 TC-NNN y produce informe pass/fail
/skill-test-evals benchmark story-improve --runs 3 → 3 runs × 5 casos, métricas estadísticas
/skill-test-evals "un skill que formatea commits de git" → crea .claude/skills/commit-formatter/evals/evals.json + skeleton SKILL.md
Verificar que skill-verify ya no existe como directorio
package.json files array no contiene skill-verify

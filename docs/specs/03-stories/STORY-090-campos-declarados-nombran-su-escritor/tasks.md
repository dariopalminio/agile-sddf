---
alwaysApply: false
type: tasks
id: STORY-090
slug: STORY-090-campos-declarados-nombran-su-escritor-tasks
title: "Tasks: Todo campo declarado en un template nombra a su escritor"
date: 2026-09-10
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-17-remediating-and-improvement
story: STORY-090
design: STORY-090
related:
  - STORY-090-campos-declarados-nombran-su-escritor
  - STORY-089-story-fix-post-code-review
---

<!-- Referencias -->
[[STORY-090-campos-declarados-nombran-su-escritor]]

> Trazabilidad: `AC-n` = criterios de aceptación de `story.md` (numerados en `design.md` › Context); `D-n` = decisiones de `design.md`; `V-n` = contratos de verificación de `design.md`; `NFR-n` = criterios no funcionales.
> Orden de commits (D-8): grupos 1–4 → commit 1 · grupos 5–6 → commit 2 (aislado) · grupo 7 → commit 3 · grupo 8 = verificación final sin commit propio.

## 1. Setup — Inventario y decisiones previas

- [ ] 1.1 Ejecutar el inventario base y guardarlo como evidencia en `.tmp/story-090/inventario-inicial.txt`: conteo de historias, conteo de historias con `^\*\*FINVEST Score`, grafías de `Score` y `Decisión` (`sort | uniq -c`), lista de directorios con `finvest-evaluation-report.md`. Confirmar que coincide con la sección Context de `design.md` (82 / 38 / 2 casos reales: STORY-067, STORY-078) — AC-1, AC-2
- [ ] 1.2 Resolver con el usuario OQ-1 (STORY-067: reconstruir reporte vs. aceptar pérdida) y OQ-2 (STORY-078) y confirmar CR-001 (la detención cubre también `Decisión`). Registrar las respuestas en `.tmp/story-090/decisiones.md` para citarlas en el `implement-report.md` — AC-2, NFR-1, D-4
- [ ] 1.3 [P] Inventariar por template, en `.tmp/story-090/inventario-campos.md`, cada campo declarado según la regla 2 de D-1 (claves de frontmatter · líneas `**Etiqueta:**` · encabezados `#/##/###`) y asignarle escritor usando la tabla "Los cinco templates y su skill dueño" de `design.md`. Marcar cualquier campo sin escritor identificable como huérfano — AC-3, AC-5, D-1

## 2. Script de migración — `scripts/migrate-finvest-field.js`

- [ ] 2.1 Crear `scripts/migrate-finvest-field.js` siguiendo el encabezado y estilo de `scripts/normalize-preflight-paso0.js` (shebang, docblock con uso, `DRY_RUN` por `process.argv`), con parámetros `--dry-run` y `--stories-dir <ruta>` (defecto `docs/specs/03-stories`) — D-3
- [ ] 2.2 Implementar la detección del bloque: localizar el `---` de cierre del frontmatter y comprobar que las tres líneas siguientes son `**FINVEST Score:** …`, `**FINVEST Decisión:** …` y `---`; si el literal aparece en cualquier otra posición, clasificar `FORMA INESPERADA` sin modificar — D-2, D-3
- [ ] 2.3 Implementar la clasificación de valor: conjunto cerrado de grafías de vacío (`—`, `-`, `pendiente`, `[pendiente]`, `[Por evaluar]`, `[pendiente de evaluación]`, `[pendiente — ejecutar /story-evaluation]`, `[FINVEST Score]`, `[APROBADA | REFINAR | RECHAZAR]`, `[no aplica…]`), comparación tras `trim` e insensible a mayúsculas, y toda cadena entre `[` `]` como placeholder; cualquier otro valor en Score **o** Decisión = dato real — D-3, CR-001
- [ ] 2.4 Implementar la regla de decisión por historia: vacío → `MIGRADA`; dato real con `finvest-evaluation-report.md` en el directorio → `MIGRADA`; dato real sin reporte → `REQUIERE DECISIÓN` (sin tocar el archivo); sin bloque → `SIN CAMBIOS`; archivo ilegible o sin frontmatter → `ERROR LECTURA` sin abortar el recorrido — AC-2, D-3
- [ ] 2.5 Implementar la escritura preservando encoding (UTF-8 sin BOM) y finales de línea originales (`\n` / `\r\n`); no escribir nada en `--dry-run` — D-3
- [ ] 2.6 Implementar la salida: tabla `ID │ resultado │ Score │ Decisión`, resumen de conteos y exit code `0` solo si no hubo `REQUIERE DECISIÓN`, `FORMA INESPERADA` ni `ERROR LECTURA` — D-3
- [ ] 2.7 Probar el script en `--dry-run` sobre el árbol real y verificar: 36 `MIGRADA`, 44 `SIN CAMBIOS`, 2 `REQUIERE DECISIÓN` (STORY-067, STORY-078), exit 1, `git status` sin cambios. Guardar la salida en `.tmp/story-090/dry-run-1.txt` — AC-2, V-6

## 3. Template de historia — retiro del campo FINVEST y anotación de escritores

- [ ] 3.1 Editar `docs/specs/templates/story-template.md`: eliminar las tres líneas del bloque FINVEST (dos `**FINVEST …**` y el `---` que las sigue), dejando el `---` del frontmatter seguido del comentario de referencias — AC-1, D-2
- [ ] 3.2 En el mismo archivo, anotar cada clave del frontmatter con `# escritor: …` según el inventario de 1.3 (creadores: `story-creation · epic-generate-stories · epic-generate-all-stories`; `status/substatus`: creador (inicial) · `story-evaluation` → SPECIFY/DONE · `story-plan`, `story-implement-tasks`, `story-verify`, `story-acceptance` (transiciones); `updated`: todo skill que edite el archivo; `related`: creador · `story-split`) — AC-5, D-1
- [ ] 3.3 En el mismo archivo, incluir en la anotación de `status`/`substatus` la equivalencia *"SPECIFY/DONE lo escribe story-evaluation solo con decisión APROBADA — señal de un vistazo; el score vive en finvest-evaluation-report.md"* — AC-1, D-5
- [ ] 3.4 En el mismo archivo, añadir el comentario de escritor por defecto del cuerpo inmediatamente después del frontmatter (`<!-- escritor del cuerpo: story-creation | epic-generate-stories | epic-generate-all-stories — salvo anotación distinta junto a la sección -->`) y anotar localmente solo las secciones cuyo escritor difiera (p. ej. `## 📎 Notas` también `story-improve`) — AC-5, D-1
- [ ] 3.5 Copiar el resultado a `skills/story-creation/assets/story-template.md` y verificar `diff` vacío entre canónico y seed — AC-1, V-3
- [ ] 3.6 Añadir en `skills/story-evaluation/SKILL.md`, Paso 7, una frase que declare que la transición `SPECIFY/DONE` es la única huella de la aprobación en `story.md` y que el score vive en el frontmatter del reporte — AC-1, D-5

## 4. Los otros cuatro templates — anotación de escritores

- [ ] 4.1 [P] Anotar `docs/specs/templates/epic-template.md` (frontmatter clave a clave; defecto de cuerpo `epic-creation | epic-from-project-plan`; `## Historias` con anotación local: `epic-creation (inicial) · epic-generate-stories (actualiza lista)`) y copiar a `skills/epic-creation/assets/epic-template.md` — AC-3, AC-5, D-1
- [ ] 4.2 [P] Anotar `docs/specs/templates/project-intent-template.md` (defecto `project-begin (project-pm)`) y copiar a `skills/project-begin/assets/project-intent-template.md` — AC-3, AC-5, D-1
- [ ] 4.3 [P] Anotar `docs/specs/templates/project-template.md` (defecto `project-discovery (project-pm, project-ux, project-architect) · reverse-engineering (reverse-engineer-synthesizer)`; anotación local en las secciones UI/UX si el escritor es solo `project-ux`, y en `# 4. Arquitectura Técnica` si es solo `project-architect`) y copiar a `skills/project-discovery/assets/project-template.md` — AC-3, AC-5, D-1
- [ ] 4.4 [P] Anotar `docs/specs/templates/project-plan-template.md` (defecto `project-planning (project-architect)`; `## Backlog de Historias` local: `project-planning · epic-from-project-plan (lee, no escribe)` solo si aplica) y copiar a `skills/project-planning/assets/project-plan-template.md` — AC-3, AC-5, D-1
- [ ] 4.5 Resolver cualquier campo marcado huérfano en 1.3: retirarlo del template o anotarlo con el skill que pasará a escribirlo **e** instruir esa escritura en el `SKILL.md` correspondiente; registrar la lista (posiblemente vacía) para el `implement-report.md` — AC-3, D-1 regla 5
- [ ] 4.6 Verificar V-1, V-2 y V-3: lectura de los cinco templates sin campo sin anotación; grep de `FINVEST Score|FINVEST Decisi` vacío en `docs/specs/templates/` y en `skills/*/assets/*-template.md`; `diff` vacío en las cinco parejas canónico/seed — AC-3, AC-5, V-1, V-2, V-3
- [ ] 4.7 Commit 1: `chore(templates): anotar escritor en los cinco templates y retirar campo FINVEST` (templates centrales + 5 seeds + `story-evaluation` Paso 7 + `scripts/migrate-finvest-field.js`). Refrescar la copia instalada con `node scripts/cli.js install --target .claude --force` — D-8

## 5. Resolución de los casos con dato real sin reporte (según 1.2)

- [ ] 5.1 STORY-067 — si *reconstruir*: crear `docs/specs/03-stories/STORY-067-story-implement-continuar-parcial/finvest-evaluation-report.md` con frontmatter `type: finvest-evaluation`, `story-id: STORY-067`, `finvest-score: 4.33`, `decision: APROBADA`, `evaluated: 2026-05-09` y una nota de que el cuerpo se reconstruyó desde el campo retirado; si *aceptar pérdida*: añadir la línea de aceptación en `## 📎 Notas / contexto adicional` de su `story.md` — AC-2, NFR-1, D-4
- [ ] 5.2 [P] STORY-078 — aplicar la opción elegida en 1.2 (recomendada: nota de aceptación en `## 📎 Notas / contexto adicional` indicando que `Decisión: APROBADA` es redundante con su `status`) — AC-2, NFR-1, D-4, CR-001

## 6. Migración de las historias existentes

- [ ] 6.1 Ejecutar `node scripts/migrate-finvest-field.js --dry-run` tras 5.x y verificar 0 `REQUIERE DECISIÓN` (o exactamente las que el usuario decidió dejar pendientes); guardar en `.tmp/story-090/dry-run-2.txt` — AC-2, D-3
- [ ] 6.2 Ejecutar la migración real; verificar en la salida el conteo de `MIGRADA` y en `git status` que solo cambian `docs/specs/03-stories/**/story.md` (más los archivos de 5.x) — AC-1, NFR-3
- [ ] 6.3 Verificar V-5: grep de `^\*\*FINVEST Score` en `docs/specs/03-stories/STORY-*/story.md` vacío; muestrear 3 historias migradas y comprobar que el `---` del frontmatter va seguido directamente de `<!-- Referencias -->` como en STORY-087 — AC-1, D-2
- [ ] 6.4 Verificar V-7 (idempotencia): segunda ejecución real → 0 `MIGRADA`, exit 0, `git status` sin cambios nuevos; guardar en `.tmp/story-090/run-2.txt` — NFR-2
- [ ] 6.5 Commit 2 aislado: `chore(stories): migrar campo FINVEST retirado (STORY-090)` conteniendo únicamente `docs/specs/03-stories/**` (historias migradas + reporte reconstruido / notas de 5.x). Verificar V-8 con `git show --stat HEAD` — NFR-3, D-8

## 7. Constitución — principio 13

- [ ] 7.1 Añadir el ítem `13. **Todo campo declarado nombra a su escritor:** …` al final de la lista *"✅ Principios Técnicos Inamovibles"* en `docs/policies/constitution.md` con el enunciado de D-6 (campo = clave de frontmatter, línea de dato o sección; retirar o anotar con el skill que pasará a escribirlo; clave `escritor:`; no se copia a los documentos generados) y actualizar `updated:` del frontmatter — AC-4, D-6
- [ ] 7.2 Commit 3: `docs(constitution): principio 13 — todo campo declarado nombra a su escritor` — D-8

## 8. Verificación final y cierre

- [ ] 8.1 [P] Verificar V-4: grep de `FINVEST Score` vacío en `skills/story-creation/SKILL.md`, `skills/epic-generate-stories/SKILL.md`, `skills/epic-generate-all-stories/SKILL.md`; instanciar una historia de prueba con `/story-creation` (o dry-run leyendo el template) y comprobar que no contiene el bloque ni comentarios `escritor:`; descartar la historia de prueba sin commit — AC-1, D-7
- [ ] 8.2 [P] Verificar V-11: `git diff main -- skills/story-improve/SKILL.md skills/story-split/SKILL.md` vacío; ambos siguen leyendo `finvest-evaluation-report.md` (Paso 2 y Paso 3b respectivamente) — AC-1
- [ ] 8.3 [P] Verificar V-9 y V-10: la anotación de `status` en `story-template.md` y el Paso 7 de `story-evaluation` mencionan `SPECIFY/DONE ⇔ APROBADA`; `constitution.md` tiene el ítem 13 con el formato de los existentes — AC-1, AC-4
- [ ] 8.4 Recorrer la Definition of Done para PLAN/IMPLEMENT de `docs/policies/definition-of-done-story.md` y dejar constancia de cada ítem en el `implement-report.md`, incluyendo: decisiones de 1.2, lista de huérfanos de 4.5, salidas de `.tmp/story-090/`, y la nota de que los fixtures de ejemplo (`story-improve/examples`, `story-split/examples`) se dejaron intactos por diseño — AC-1..AC-5
- [ ] 8.5 Actualizar la nota de `story.md` "Decisión abierta para la planificación" con las cifras reales medidas (82 / 38 / STORY-067 y STORY-078) según CR-001, y marcar todas las tareas de este archivo como `[x]` — CR-001

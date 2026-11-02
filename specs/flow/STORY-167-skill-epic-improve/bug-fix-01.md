# Plan de solución — bug `epic-improve` (eval TC-002 FAIL)

**Fecha:** 2026-11-01 · **Rama:** `epic/EPIC-23-completar-flujo-de-epic` · **Estado:** decisiones tomadas (plan mode)
**Nota:** guardado en `.opencode/plans/` (permiso de plan mode); al implementar, mover a `.tmp/epic-improve/`.

**Decisiones (usuario, 2026-11-01):**
- Dirección: **Opción B — motor determinista** (A y C descartadas).
- `AGENTS.md`: **conservar** las 2 líneas nuevas (convenciones de invocación/subagentes).
- Trazabilidad: **CR-004 en `design.md` de STORY-167** (no se crea historia nueva).

## 1. Síntesis

El eval `TC-002` de `epic-improve` falla (`report-20261101.md`: 1 caso, 0% pass). Las causas son
(doble): el runner LLM no ejecuta el contrato de `SKILL.md` de forma determinista (el skill es de
instrucciones, sin motor) **y** el eval tiene expectativas que ni un runner perfecto podría cumplir
(mayúsculas/minúsculas). Los cambios ya hechos en el working tree (script vacío de 0 bytes + README
reescrito en inglés) parten de un mal diagnóstico ("falta el script de implementación"): el diseño
`D-1` de STORY-167 decidió explícitamente **sin script**.

## 2. El bug — evidencia

- Reporte: `.tmp/skill-test-evals/epic-improve/report-20261101.md` → `TC-002 ❌ FAIL`.
- Salida del runner: `.tmp/skill-test-evals/epic-improve/runs/TC-002.txt`.
- Contrato: `skills/epic-improve/SKILL.md` + `skills/epic-improve/references/correction-rules.md`.
- Comparación del runner: `scripts/run-evals.js:985` (`out.includes(s)`, **case-sensitive**);
  el prompt obliga a copiar mensajes tal cual (`run-evals.js:495-533`).

### Desviaciones del runner en TC-002 (5)

| # | Esperado (`evals.json` TC-002) | Salieron / falta | Causa |
|---|---|---|---|
| 1 | contains `requiere decisión del PO` (minúscula) | salió `Requiere decisión del PO:` (mayúscula, tal el template del Paso 5 de `SKILL.md`) | **Desfase test ↔ contrato**: el contrato emite mayúscula; un runner perfecto fallaría este `contains`. El `not_contains` de TC-001 usa la minúscula, por lo que TC-001 "pasa" por mayúsculas. |
| 2 | contains `=== FILE: .../epic.md.bak ===` | no se emitió (solo el FILE de `epic.md`) | El contexto del eval pide "uno por cada archivo escrito (incluido epic.md.bak)"; el runner lo omitió. |
| 3 | contains `- Exportar CSV: permite exportar datos` | la línea quedó `- [ ] Exportar CSV — permite exportar datos` | D-2 (`formato-historias`) mal clasificada como «Ya resueltos»; `correction-rules.md` §4 es determinista: `- [ ] Nombre — desc` (sin ID) → F1 `- Nombre: desc`. |
| 4 | contains `La validación seguirá en NEEDS-REFINEMENT` | ausente | Aviso obligatorio del Paso 8 cuando quedan decisiones del PO (había 1). |
| 5 | not_contains `CS-1` | se escribió `- [ ] **CS-1** — obtiene un archivo con sus datos` | §6: «varias mejoras» no es verificable → decisión del PO; §7: fuente válida solo título/`Objetivo`/`Alcance`/`Historias` (el runner usó el smoke test). Viola AC-2. |

### Señal adicional: TC-001 es "verde" frágil

En el run de TC-001 (`runs/TC-001.events.jsonl`) el runner escribe la línea `CS-1` **y** lista
`Requiere decisión del PO: D-1 · M-criterios` — contradictorio; solo pasa porque el `not_contains`
es minúscula y la salida es mayúscula. Semánticamente, con ese fixture no debe haber decisiones del PO.

### Causa raíz

`epic-improve` es un skill de instrucciones (diseño `D-1`, `specs/flow/STORY-167-skill-epic-improve/design.md:55`):
la ejecución depende de que el LLM (real o runner headless) siga `SKILL.md` + catálogo al pie de la
letra. Los pasos semánticos (clasificación D-3, fuente citada, aviso del Paso 8) no son
deterministas entre ejecuciones. El patrón del repo para escrituras irreversibles es el **motor
Node.js determinista** (`skills/epic-complete/SKILL.md:17`, `skills/story-complete/SKILL.md:18`):
"el motor se prueba con `node --test` sin consumir cuota de evals".

## 3. Cambios ya hechos (working tree, sin commit) y su estado

| Archivo | Estado | Problema |
|---|---|---|
| `skills/epic-improve/scripts/epic-improve.js` | nuevo, untracked, **0 bytes** | Mitad de cambio: `SKILL.md` no lo referencia, no hay tests, no está en `.opencode/skills/`. Contradice `D-1` si se deja así. |
| `skills/epic-improve/README.md` | reescrito en **inglés** | Viola la regla no negociable «Idioma: español» (`AGENTS.md`). Afirma "TC-001/TC-004/TC-005 PASSED" y "ready for production" sin evidencia (el único reporte es TC-002 FAIL, 0%). Diagnostica "falta el script" como root cause, en contra de `D-1`. |
| `AGENTS.md` | +2 líneas (skills en `.opencode/skills`; convención de subagentes vía `task`) | Ajenas al bug; son convenciones de sesión plausibles. Decidir: conservar o descartar. |

## 4. Opciones de solución

**Elegida: Opción B.** A y C se conservan como referencia del trade-off.

### Opción A — Reforzar el contrato (respeta `D-1`, sin script) — *descartada*

1. `evals.json`: alinear mayúsculas con el contrato real del `SKILL.md`
   (TC-002 contains → `Requiere decisión del PO`; TC-001 not_contains → mayúscula, para que sea honesto).
2. `SKILL.md` / `correction-rules.md`: ejemplo trabajado del escenario F-2 (fixture
   `requiere-decision-po`), regla explícita «el smoke test no es fuente válida (§7)», aviso del
   Paso 8 obligatorio si la lista del PO no está vacía, y recordatorio de "un bloque FILE por
   archivo escrito, incluido `.bak`".
3. Re-ejecutar evals (criterio humano, `npm run test:eval -- epic-improve`).

- ✅ Mínimo, respeta el diseño. ❌ No elimina la no-determinismo; TC-001 sigue frágil; cada
  verificación gasta cuota.

### Opción B — Motor determinista (patrón `epic-complete`/`story-complete`) — **ELEGIDA**

1. **Decisión documentada:** CR-004 en `design.md` de STORY-167:
   el trabajo determinista (resolver, gate, clasificar los 4 tipos de defecto, F1/F2/F3, `SMOKE-N`,
   backup, escritura, relectura) pasa al motor; la mejora semántica `M-objetivo`/`M-criterios`
   (juicio de verificabilidad) sigue en el orquestador LLM — exactamente los límites que `D-1`
   argumentaba contra un script completo.
2. **Completar `skills/epic-improve/scripts/epic-improve.js`** (hoy vacío) con el contrato CLI de
   `epic-complete.js`: `node epic-improve.js <plan|apply> --repo-root <dir> (--id EPIC-NN | --path <ruta>)`,
   salida JSON única en stdout, exit 0/1/2, `plan` de solo lectura, `apply` re-planifica +
   escribe `.bak` + una escritura de `epic.md` + relectura con restauración. Sin dependencias npm.
   Invariantes: solo escribe `epic.md` y `epic.md.bak`; `status`/`substatus` intactos; UTF-8 sin BOM;
   sin placeholders; IDs `CS-N`/`SMOKE-N` estables.
3. **`test/epic-improve.test.js`** (`node --test`, directorios temporales, como `test/epic-complete.test.js`):
   conversiones F1/F2/F3, `SMOKE-N`, inserción de `CS-N` con fuente, gates por veredicto, `plan` sin
   escrituras, `apply` con backup/restauración, y el escenario exacto de TC-002
   (fixture «Mejoras varias» → decisión del PO, sin `CS-1`).
4. **`SKILL.md`:** párrafo de motor (como `epic-complete/SKILL.md:17`), invocación del motor en los
   pasos 1–8, mensajes exactos; mantener `<!-- SDDF-FIXED-LAYOUT: v1 -->` y presupuesto ≤ 220 líneas.
5. **README** en español (restaurar original + nota del motor, formato de `epic-complete/README.md`).
6. **Evals:** los de la opción A (mayúsculas) — con el motor, la simulación se vuelve estable porque
   el contrato es "ejecuta el motor y muestra su salida".
7. **Instalar** (`agile-sddf install`) para sincronizar `.opencode/skills/epic-improve/`.

- ✅ Escritura irreversible determinista; tests sin cuota; coherente con el rumbo de EPIC-23
  (`epic-complete`, `epic-validate` ya usan motores); el cambio ya hecho (crear el script) deja de
  ser un desecho. ❌ Más trabajo; el texto del plan de `M-*` sigue siendo LLM.

### Opción C — Limpieza mínima + re-ejecución — *descartada*

Descartar el script vacío (untracked, 0 bytes), restaurar el README en español
(`git checkout -- skills/epic-improve/README.md`), aplicar solo la corrección de mayúsculas de los
evals y re-ejecutar. Si TC-002 vuelve a fallar → escalar a B.

- ✅ Rápido. ❌ Probablemente insuficiente: el fallo de TC-002 no es solo de mayúsculas.

## 5. Pasos de verificación (comunes)

1. `npm test` → verde (incluye `test/epic-improve.test.js` si se aplica B; `test/epic-template.test.js` intacto).
2. `npm run verify:repository` → verde (layout, eval-inventory, links; CS-21).
3. `npm run test:eval -- epic-improve` (criterio humano) → 8/8 TC, con TC-001 semánticamente honesto.
4. Working tree limpio de mitades de cambio: sin archivos untracked vacíos; README en español.

## 6. Fuera de alcance

- Modificar `epic-format-validation` (STORY-166, ya entregada).
- Consistencia épica ↔ historias (`epic-refine`).
- Push/PR/merge (regla del repo).

## 7. Decisiones tomadas (2026-11-01)

1. **Dirección:** B (motor determinista).
2. **`AGENTS.md`:** conservar las 2 líneas nuevas.
3. **Trazabilidad:** CR-004 en `design.md` de STORY-167 (texto del CR: "El trabajo determinista —
   resolver, gate por veredicto, clasificación de los 4 tipos de defecto, conversiones F1/F2/F3 y
   `SMOKE-N`, backup, escritura única y relectura con restauración — pasa al motor
   `scripts/epic-improve.js` (contrato CLI `plan|apply` de `epic-complete.js`); la mejora semántica
   `M-objetivo`/`M-criterios` (juicio de verificabilidad) sigue en el orquestador LLM, como
   argumenta `D-5`. Supera parcialmente `D-1` (sin script), que se aplica ahora solo a las mejoras.")

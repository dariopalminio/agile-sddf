---
type: improvement-log
story-id: STORY-127
improved: 2026-10-17
dimensions-improved: [I, V, E, S, T]
previous-score: 3.65
---

# Log de mejoras: STORY-127

## Resumen

- **Fecha:** 2026-10-17
- **Dimensiones mejoradas:** I, V, E, S, T
- **Score previo (FINVEST):** 3.65
- **Decisión previa:** REFINAR

## Cambios por dimensión

### I – Independencia (score previo: 2)

**Recomendación aplicada:** Declarar en `📎 Notas` el contrato consumido de STORY-124 a STORY-126 (ruta de `epic-validate-report.md` y el campo o sección donde se lee el veredicto `APPROVED`/`BLOCKED`) y explicitar cómo probar AC-1 y AC-2 con un `epic-validate-report.md` de prueba con veredicto fijo, para desarrollar en paralelo.

**Cambio realizado:** En "Notas / contexto adicional" se añadieron dos viñetas:
- "Contrato consumido": el `verdict` del frontmatter y la sección `## Veredicto`, ambos definidos por STORY-124, y la remisión a STORY-126 para la forma de distinguir éxito de fallo.
- "Desarrollo independiente": un reporte de prueba con `verdict` fijo para AC-1 y AC-2, y la indicación de que AC-3 solo requiere `skills/epic-validate/SKILL.md`.

Se revisaron las historias hermanas para no reintroducir responsabilidades que ya cubren. "Fuera de alcance" mantiene fuera las comprobaciones del veredicto.

---

### V – Valiosa (score previo: 3)

**Recomendación aplicada:** Hacer que el `Para` se pueda verificar: "ninguna épica llegue a VALIDATE sin un veredicto APPROVED vigente y cualquier runtime instalado aplique la misma regla".

**Cambio realizado:** El `Para` pasó de "que el equipo use una única regla de liberación comprensible y ejecutable" a "que ninguna épica llegue a VALIDATE sin un veredicto APPROVED vigente y que todo runtime instalado aplique la misma regla de liberación".

---

### E – Estimable (score previo: 3)

**Recomendación aplicada:** Definir quién ejecuta la transición `DEVELOP → VALIDATE` (hoy ningún skill la gestiona) e indicar la guía que se actualiza y los runtimes en los que se verifica la instalación.

**Cambio realizado:**
- El `Quiero` nombra explícitamente la transición `DEVELOP → VALIDATE`.
- En Notas, "Mecanismo de transición" indica que hoy ningún skill la escribe, según `state-machine.md`, y que el gateway se incorpora como precondición documentada, como `epic-format-validation`.
- En "Fuera de alcance" se añadió la automatización de la escritura de `status: VALIDATE`.
- CNF-1 nombra los documentos concretos: `docs/guides/sddf-commands-pipeline.md` y la sección "Nivel ÉPICA" de `docs/architecture/state-machine.md`.
- En Notas, la viñeta "Runtimes" remite a `config/runtimes.json` con `support: supported` sin duplicar la lista, como exige AGENTS.md.

---

### S – Small (score previo: 3)

**Recomendación aplicada:** Evaluar con `/story-split` una división en transición con gateway (AC-1 y AC-2) y distribución con documentación (AC-3).

**Cambio realizado:** No se dividió la historia, porque story-improve no hace splits y S=3 no obliga a dividir. Sí se separaron las responsabilidades de cada escenario:
- AC-3 cubre solo la distribución y la instalación.
- La verificación de la guía pasó a una precondición de AC-1 y a CNF-1, que ahora se comprueba de forma objetiva.

La historia mantiene 3 escenarios, cada uno con un único foco. Sigue disponible `/story-split` si la reevaluación lo indica.

---

### T – Testeable (score previo: 3)

**Recomendación aplicada:** Concretar la evidencia en AC-1, añadir `Pero el estado de la épica permanece en DEVELOP` en AC-2 y hacer coherentes el `Cuando` y el `Entonces` de AC-3. Las comprobaciones de la guía debían ser objetivas.

**Cambio realizado:**
- **AC-1:** usa `verdict: APPROVED` como precondición y verifica que el status puede pasar a VALIDATE y que `epic-validate-report.md` permanece en el directorio de la épica.
- **AC-2:** usa `verdict: BLOCKED`, remite a la sección `## Veredicto` y añade `Pero el status de la épica permanece en DEVELOP`.
- **AC-3:** se reescribió como causa y efecto: empaquetar e instalar con `npx agile-sddf install --target <runtime>` hace que el paquete incluya `skills/epic-validate/` gracias a `files`, y que el destino contenga `SKILL.md`.
- **Scenario Outline descartado:** no se usó una tabla `Ejemplos` con los runtimes, para no duplicar la lista de `config/runtimes.json` (AGENTS.md). El escenario se parametriza por `support: supported`.
- **Guía:** "explica su uso" se sustituyó en CNF-1 por una comprobación objetiva: la guía nombra `/epic-validate <EPIC-ID>` como precondición de `DEVELOP → VALIDATE`.
- **Notas:** se añadió la regla de que la ausencia del reporte también bloquea la transición.

---

## Refinamiento del 2026-10-29: decisión del PO sobre el gateway

**Origen:** INC-002 e INC-003 de `analyze.md` (WARNING, tipo D), que quedaron fuera de alcance de `/story-fix-plan`.

**Decisión del PO:** el gateway es parte del proceso de `/epic-validate`. Con `APPROVED`, el skill cambia la épica de `VALIDATE/IN-PROGRESS` a `VALIDATE/DONE` (lista para `SHIP`). Con `NEEDS-CHANGES` o `BLOCKED`, la devuelve a `DEVELOP/IN-PROGRESS` y no puede transicionar a `SHIP`.

**Cambios en story.md:**
- `Quiero` y `Para`: el gateway lo aplica `/epic-validate` sobre `VALIDATE/IN-PROGRESS → VALIDATE/DONE`, con vuelta a `DEVELOP`, y su objetivo es que ninguna épica quede lista para `SHIP` sin `APPROVED`.
- AC-1: épica en `VALIDATE/IN-PROGRESS` con `APPROVED` → `VALIDATE/DONE`; el reporte permanece como evidencia.
- AC-2: esquema del escenario con `NEEDS-CHANGES` y `BLOCKED` → `DEVELOP/IN-PROGRESS`, remisión a `## Veredicto` y sin acceso a `SHIP` (resuelve INC-003).
- CNF-1: suma `skills/epic-validate/SKILL.md` a los documentos que deben coincidir y nombra las dos transiciones.
- Fuera de alcance: se retira «automatizar la escritura de `status`» y se agregan `DEVELOP → VALIDATE` y la exigencia de `VALIDATE/DONE` en `epic-ship` (STORY-170).
- Notas: «Mecanismo de transición» registra la decisión y el impacto en CS-7 y STORY-126; «Contrato consumido» nombra los tres valores; «Regla» define cuándo no cambia el status; «Desarrollo independiente» pasa a «Dependencia» de STORY-124 y STORY-126.

**Plan regenerado:** design.md y tasks.md se reescribieron para la nueva decisión (copias previas en `.bak`). Las alineaciones con epic.md (CS-7), STORY-126, STORY-170 y los documentos de dominio quedan como CR-004 a CR-007 en design.md.

---

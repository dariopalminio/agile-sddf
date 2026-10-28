---
type: epic
id: EPIC-23
slug: EPIC-23-completar-flujo-de-epic
title: "Completar flujo de epic"
status: DEFINE
substatus: TODO
parent: null
created: 2026-10-12
updated: 2026-10-27
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - EPIC-27-completar-flujo-de-story
---

# Épica: Completar flujo de epic

## Objetivo

Cerrar el ciclo de vida de la épica en el flujo flow-forward, de `DEFINE` a `COMPLETED`, con un skill por paso del flujo de referencia y gates con veredicto que deciden cada avance o bucle de corrección.

## Alcance

Skills nuevos y ajustes, por fase del flujo de referencia (`docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid`):

- **DEFINE:** skill nuevo `epic-improve`, que corrige y completa `epic.md` cuando `epic-format-validation` no lo aprueba. `epic-format-validation` se ajusta para emitir un veredicto que cierre ese bucle.
- **PLAN:** skill nuevo `epic-refine`, que aplica a la épica y a sus historias los hallazgos de `epic-analyze-report.md`.
- **DEVELOP:** skill nuevo `epic-track-progress`, un semáforo de solo lectura que informa el estado de las historias hijas y si todas están terminadas.
- **VALIDATE:** skill nuevo `epic-validate`, que ejecuta las suites de integración, E2E y regresión completa de la épica, verifica su evidencia estructural y operativa y escribe `epic-validate-report.md` con `APPROVED` (avanza a `SHIP`), `NEEDS-CHANGES` (vuelve a `DEVELOP`) o `BLOCKED`. Solo lee artefactos y, fuera de `--dry-run`, escribe únicamente su reporte; no reejecuta las verificaciones de historias que ya cuentan con evidencia.
- **SHIP:** skill nuevo `epic-ship`, que genera la entrada de `CHANGELOG.md` y las notas de versión a partir del valor entregado por las historias, muestra los pasos de liberación que el humano ejecuta a mano y registra `SHIP/DONE` cuando el humano confirma que los completó. No hace commits, tags, merges, releases ni despliegues.
- **COMPLETED:** skill nuevo `epic-complete`, que cierra la épica liberada (`SHIP/DONE → COMPLETED/DONE`) tras verificar su operatividad post-despliegue y la archiva en `specs/flow/archive/`; también archiva, sin cambiar su status, las épicas `CANCELED/DONE`.
- **Gobierno:** ADR nuevo que reemplaza a ADR-0017 para admitir épicas en `specs/flow/archive/`, y ajuste de `domain-epic-lifecycle`, `domain-state-management` y `validation-contract-policy` para los nuevos escritores de estado y los nuevos gates.

`epic-creation`, `epic-generate-stories` y `epic-analyze` ya existen y se reutilizan sin cambios.

## Historias

Fase DEFINE — ajuste de `epic-format-validation`:
- [ ] **STORY-166** — Veredicto de epic-format-validation: Como Solo Builder, quiero que `/epic-format-validation EPIC-NN` declare un veredicto canónico (`APPROVED` o `NEEDS-REFINEMENT`) en lugar de `APROBADO` / `REFINAR` / `RECHAZADO`, para que el bucle de `DEFINE` decida sin interpretar texto libre y `epic-improve` reciba el diagnóstico de cada defecto.

Fase DEFINE — skill nuevo `epic-improve`:
- [ ] **STORY-167** — Skill epic-improve: Como Solo Builder, quiero ejecutar `/epic-improve EPIC-NN` cuando la validación de formato no aprueba la épica, para que proponga y, con mi confirmación, aplique en `epic.md` las correcciones de frontmatter, secciones obligatorias, líneas F1/F2/F3 y smoke tests `SMOKE-N`, y el enriquecimiento de objetivos poco claros o criterios de salida faltantes, con backup previo, y la deje lista para volver a pasar por `/epic-format-validation`.

Fase PLAN — skill nuevo `epic-refine`:
- [ ] **STORY-165** — Aplicar hallazgos de `epic-analyze` a la épica: corregir índice de historias, enlaces rotos y cobertura de criterios de salida según el reporte de análisis.

Fase DEVELOP — skill nuevo `epic-track-progress`:
- [ ] **STORY-168** — Skill epic-track-progress: Como Solo Builder, quiero ejecutar `/epic-track-progress EPIC-NN` para ver el status y substatus de cada historia hija, incluidas las archivadas, y saber si todas están terminadas sin que se modifique ningún archivo, para pasar a `/epic-validate` solo cuando no queda ninguna historia pendiente.

Fase VALIDATE — skill nuevo `epic-validate` (dividido en siete historias):
- [ ] **STORY-124** — Validar la preparación estructural de una épica: determinar el veredicto a partir del cierre de historias y del análisis de la épica.
- [ ] **STORY-125** — Validar la evidencia operativa de una épica: incorporar smoke tests, verificación de release y DoD aplicable.
- [ ] **STORY-126** — Operar la validación de épicas de manera segura: ofrecer modos manual, automático y de previsualización sin efectos inesperados.
- [ ] **STORY-127** — Integrar y documentar el gateway de validación de épicas: aplicar el gateway antes de la transición y hacerlo disponible en los runtimes soportados.
- [ ] **STORY-128** — Evaluar la validación de épicas de forma repetible: cubrir resultados APPROVED, NEEDS-CHANGES y BLOCKED contra regresiones.
- [ ] **STORY-137** — Controlar el detalle y los límites de la ejecución de la validación de épicas: `--verbose` y rechazo de `--mode auto` sin pruebas configuradas.
- [ ] **STORY-169** — Suites de integración y regresión de la épica: Como Solo Builder, quiero que `/epic-validate` ejecute en `--mode auto` las suites de nivel épica declaradas en `verify` de `sddf.config.yaml` (integración, E2E y regresión completa) sobre el entorno de staging e incorpore sus resultados al veredicto, para certificar que el conjunto de historias funciona como un release unificado.

Fase SHIP — skill nuevo `epic-ship`:
- [ ] **STORY-170** — Skill epic-ship: Como Solo Builder, quiero ejecutar `/epic-ship EPIC-NN` para que lea el valor entregado por las historias de la épica, actualice `CHANGELOG.md`, redacte las notas de versión para stakeholders en `release-notes.md` y me muestre los pasos de liberación que ejecuto a mano (commit, tag, merge y despliegue), para preparar una versión documentada sin escribirla yo y dejar la épica en `SHIP/DONE` cuando confirmo que la liberé. Incluye el ajuste de `domain-state-management` (invariante 6) y de `domain-epic-lifecycle` para que este skill escriba `SHIP` de épica con confirmación humana.

Fase COMPLETED — skill nuevo `epic-complete` (dividido en dos historias):
- [ ] **STORY-171** — Skill epic-complete (Core) — completar y archivar una épica liberada: Como Solo Builder que liberó una épica con SDD flow-forward, quiero completarla con `/epic-complete EPIC-NN` tras verificar su operatividad post-despliegue, para que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`, `specs/flow/` conserve solo el trabajo activo y la épica quede como registro histórico con su historial de git intacto. Incluye el ADR nuevo que reemplaza a ADR-0017 y el ajuste de los documentos de dominio para que este skill escriba `COMPLETED` de épica con confirmación humana.
- [ ] **STORY-172** — Skill epic-complete — archivar épicas canceladas: Como Solo Builder que canceló una épica, quiero archivarla con `/epic-complete EPIC-NN` en `specs/flow/archive/` sin que deje de figurar como `CANCELED`, para sacar de `specs/flow/` el trabajo que ya no se hará sin que una épica cancelada se confunda con una liberada en el registro histórico.

## Criterios de salida

Skill `epic-validate`:
- [ ] **CS-1** — `skills/epic-validate/SKILL.md` existe, resuelve solo `REPO_ROOT` y declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` (ADR-0017).
- [ ] **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada sección su marcador `sección obligatoria · clave · escritor` y tiene `## Veredicto` como primera sección tras el título.
- [ ] **CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.
- [ ] **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista.
- [ ] **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo `verdict` del frontmatter con el vocabulario único `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`.
- [ ] **CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.
- [ ] **CS-7** — El skill solo escribe `epic-validate-report.md`; no modifica código, fuentes ni otros documentos.
- [ ] **CS-8** — `skills/epic-validate/` figura en el arreglo `files` de `package.json`.
- [ ] **CS-9** — `skills/epic-validate/evals/evals.json` incluye al menos una épica consistente que resulte APPROVED, una inconsistente que resulte NEEDS-CHANGES y una cuya evidencia no se puede obtener que resulte BLOCKED.
- [ ] **CS-10** — Se reconocen y manejan correctamente los flags `--mode manual`, `--mode auto`, `--dry-run` y `--verbose`.
- [ ] **CS-11** — En `--mode auto`, `epic-validate` ejecuta las suites de nivel épica declaradas en `verify` de `sddf.config.yaml` (integración, E2E y regresión completa) y registra el resultado de cada una en el reporte; una suite que falla produce `NEEDS-CHANGES` y una que no se puede ejecutar, `BLOCKED`.

Resto del flujo y gobierno:
- [ ] **CS-12** — `skills/<skill>/SKILL.md` existe para `epic-improve`, `epic-refine`, `epic-track-progress`, `epic-ship` y `epic-complete`; cada uno declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, figura en el arreglo `files` de `package.json` y tiene `evals/evals.json`.
- [ ] **CS-13** — `epic-format-validation` declara un veredicto canónico: un `epic.md` conforme obtiene `APPROVED` y uno con faltantes o formato inválido obtiene `NEEDS-REFINEMENT`, con el diagnóstico de cada defecto.
- [ ] **CS-14** — `epic-improve` crea `epic.md.bak` antes de escribir, solo modifica `epic.md`, no cambia `status` ni `substatus` y, tras aplicar sus correcciones, `/epic-format-validation` devuelve `APPROVED` para los defectos corregidos; lo que requiere decisión del PO queda listado sin modificarse.
- [ ] **CS-15** — `epic-refine` aplica los hallazgos de `epic-analyze-report.md` con backup de cada archivo modificado, escribe `epic-refine-report.md` y no cambia `status` ni `substatus`; con `verdict: APPROVED` no modifica ningún archivo.
- [ ] **CS-16** — `epic-track-progress` lista el status y substatus de cada historia hija, incluidas las archivadas, responde si todas están terminadas y no escribe ningún archivo.
- [ ] **CS-17** — `epic-ship` genera, a partir de las historias de la épica, la entrada de `CHANGELOG.md` y las notas de versión para stakeholders en `release-notes.md` del directorio de la épica.
- [ ] **CS-18** — `epic-ship` no ejecuta ninguna operación de git (commit, tag, merge ni push) ni dispara releases o despliegues; muestra los pasos de liberación manuales y escribe `SHIP/DONE` en la épica solo cuando el humano confirma que los completó.
- [ ] **CS-19** — `epic-complete` rechaza una épica que no esté en `SHIP/DONE`, `COMPLETED/DONE` ni `CANCELED/DONE` y archiva las que sí lo están en `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` conservando su historial de git: las `SHIP` pasan a `status: COMPLETED` y las `CANCELED` conservan su status.
- [ ] **CS-20** — Un ADR nuevo reemplaza a ADR-0017 para admitir épicas en `specs/flow/archive/`; `domain-epic-lifecycle` y `domain-state-management` documentan que `epic-ship` y `epic-complete` escriben `SHIP` y `COMPLETED` de épica con confirmación humana, y `validation-contract-policy` registra los gates del flujo de épica de forma coherente con su flowchart.
- [ ] **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.

## Smoke tests

### SMOKE-1 — Épica consistente obtiene APPROVED
```gherkin
Escenario: Épica consistente obtiene APPROVED
  Dado una épica con historias terminales y análisis APPROVED
    Y con smoke tests y verificación de release aprobados
  Cuando se ejecuta /epic-validate sobre la épica
  Entonces se escribe epic-validate-report.md con APPROVED
    Y no hay motivos de rechazo ni de bloqueo
```

### SMOKE-2 — Épica inexistente no escribe reporte
```gherkin
Escenario: Épica inexistente
  Dado que no existe ningún directorio para EPIC-77
  Cuando se ejecuta /epic-validate EPIC-77
  Entonces informa la ruta buscada, no escribe reporte y finaliza con error
```

### SMOKE-3 — Historia no terminal rechaza la épica
```gherkin
Escenario: Épica con historia no terminal
  Dado una épica cuya historia STORY-042 no está en estado terminal
  Cuando se ejecuta /epic-validate sobre la épica
  Entonces el reporte declara NEEDS-CHANGES e identifica STORY-042 y su estado
```

### SMOKE-4 — Bucle de DEFINE: épica con formato inválido se corrige
```gherkin
Escenario: Épica con formato inválido se corrige y aprueba
  Dado una épica cuyo epic.md no tiene la sección de criterios de salida
  Cuando se ejecuta /epic-format-validation, luego /epic-improve con confirmación y de nuevo /epic-format-validation
  Entonces la primera validación declara NEEDS-REFINEMENT y señala la sección faltante
    Y epic-improve deja epic.md.bak junto a epic.md
    Y la segunda validación declara APPROVED
```

### SMOKE-5 — Bucle de PLAN: historia huérfana entra al índice
```gherkin
Escenario: Historia huérfana entra al índice
  Dado una épica cuyo epic-analyze-report.md declara NEEDS-REFINEMENT por una historia huérfana
  Cuando se ejecuta /epic-refine con confirmación y de nuevo /epic-analyze
  Entonces el índice de historias de epic.md incluye la historia como línea F2
    Y el nuevo análisis declara APPROVED
```

### SMOKE-6 — Gate de DEVELOP: historia pendiente impide avanzar
```gherkin
Escenario: Historia pendiente impide avanzar
  Dado una épica con una historia en IMPLEMENT/IN-PROGRESS y el resto en DELIVER/DONE
  Cuando se ejecuta /epic-track-progress sobre la épica
  Entonces informa que no todas las historias están terminadas e identifica la historia pendiente
    Y ningún archivo cambia
```

### SMOKE-7 — SHIP prepara la versión sin operaciones de git
```gherkin
Escenario: SHIP prepara la versión sin operaciones de git
  Dado una épica con epic-validate-report.md en APPROVED
  Cuando se ejecuta /epic-ship sobre la épica
  Entonces CHANGELOG.md tiene una entrada nueva con las historias de la épica y existe release-notes.md
    Y no se crea ningún commit, tag ni merge, ni se dispara ningún despliegue
    Y se muestran los pasos de liberación que ejecuta el humano
    Y la épica pasa a SHIP/DONE solo cuando el usuario confirma que completó esos pasos
```

### SMOKE-8 — Cierre y archivado de una épica liberada
```gherkin
Escenario: Cierre y archivado de una épica liberada
  Dado una épica en SHIP/DONE
  Cuando el usuario ejecuta /epic-complete sobre la épica y confirma el cierre
  Entonces la épica queda con status COMPLETED en specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/
    Y ya no aparece en specs/flow/
```

## Notas

- **Flujo de referencia:** `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid`. Cada skill de esta épica es un nodo del diagrama; `epic-creation`, `epic-generate-stories` y `epic-analyze` ya existen.
- La épica se crea en `DEFINE/TODO` para no activar otro ítem de nivel épica mientras existen épicas en progreso.
- Las historias STORY-124 a STORY-128, STORY-137 y STORY-165 ya existían; se registran como F2 sin asignarles nuevos IDs. Las líneas F1 recibieron los IDs STORY-166 a STORY-172 con `/epic-generate-stories` (2026-10-27).
- **Tamaño:** seis skills nuevos y un ajuste. En `PLAN` evaluar si conviene dividir la épica (por ejemplo, `DEFINE`–`DEVELOP` y `VALIDATE`–`COMPLETED`).
- **SHIP simplificado (decisión del PO, 2026-10-27):** por ahora ningún skill hace despliegues a producción, releases ni tags de git; quedan como acción manual humana. Por eso `epic-ship` absorbe el trabajo de `epic-release-notes`, que no se crea. El diagrama ya muestra un único nodo `epic-ship`, alineado con el estado `SHIP`.
- **`epic-improve` no es alias de `epic-refine`:** a diferencia de `story-improve` (alias deprecado de `story-refine`), cada uno cierra un bucle distinto. `epic-improve` corrige la forma tras `epic-format-validation` (`DEFINE`); `epic-refine` corrige la consistencia tras `epic-analyze` (`PLAN`).
- **Veredicto de rechazo en `DEFINE` (decisión del PO, 2026-10-27):** `epic-format-validation` rechaza con `NEEDS-REFINEMENT`, el valor que `validation-contract-policy` §2 reserva para artefactos de especificación (épica o historia). El diagrama ya rotula `NEEDS-REFINEMENT` la rama hacia `epic-improve`. Falta versionar la política, que hoy excluye a `epic-format-validation` en §1 y no le asigna fila en §4 (STORY-166).
- **Coherencia flowchart ↔ política:** la invariante de §4 de la política exige que las ramas `verdict` de cada skill coincidan con sus valores permitidos. `epic-validate` admite `BLOCKED`, que no tiene rama en el diagrama; al enlazar el flowchart desde la política, agregar esa rama.
- **`READY-FOR-DEV`:** el diagrama pasa de `PLAN` a `DEVELOP` sin el buffer. El estado y su WIP siguen vigentes según `domain-epic-lifecycle`; ningún skill de esta épica lo escribe.
- **Historia terminada (gate de `DEVELOP`):** la decisión «all stories done?» del diagrama es la invariante 3 de `domain-epic-lifecycle` (todas las historias en `DELIVER`). `epic-track-progress` cuenta como terminadas las `DELIVER/DONE` y `COMPLETED/DONE`, incluidas las archivadas; el tratamiento de las `CANCELED/DONE` se decide al refinar STORY-168.
- **Posición de `epic-validate`:** en el diagrama, el gate de completitud `DEVELOP → VALIDATE` lo resuelve `epic-track-progress`; `epic-validate` decide `VALIDATE → SHIP` y, con `NEEDS-CHANGES`, devuelve la épica a `DEVELOP`.
- **Suites de staging:** `sddf.config.yaml` declara las suites en `verify` (`integration`, `e2e`, `e2e-regression`), pero no define entornos. STORY-169 decide cómo se declara el entorno de staging.
- **Escritores de estado:** la invariante 6 de `domain-state-management` impide hoy que un skill escriba `SHIP` o `COMPLETED` de épica. STORY-170 (`epic-ship`) y STORY-171 (`epic-complete`) ajustan los documentos de dominio, como hizo EPIC-27 con `DELIVER` y `COMPLETED` de story.
- **Archivo de épicas:** ADR-0017 (aceptado, inmutable) deja las épicas en `specs/flow/`. Para que `epic-complete` las archive, STORY-171 (Core) incluye un ADR nuevo que lo reemplaza (`superseded-by`) y actualiza `AGENTS.md`, `docs/constitution.md` y `docs/domains/`.
- **Operaciones de repositorio:** `epic-ship` no hace commit, tag, merge, push, release ni despliegue; solo lista esos pasos para que el humano los ejecute. Es coherente con `AGENTS.md`, que prohíbe a los agentes hacer push, PR o merge en este repositorio.
- **Métricas:** el repositorio no tiene tableros de métricas. `epic-complete` se limita a dejar legibles los datos de cierre (fechas y versión) que permiten medir el tiempo de ciclo.
- **Vocabulario del veredicto de `epic-validate` (decisión del PO, 2026-10-17):** sigue el contrato de validación de EPIC-25 (`docs/policies/validation-contract-policy.md`, STORY-138).
  - `NEEDS-CHANGES`: la evidencia existe pero no cumple. Por ejemplo, una historia no terminal, un análisis de la épica sin `APPROVED`, smoke tests, suites o `verify:release` fallidos, o el DoD incumplido.
  - `BLOCKED`: un bloqueo impide obtener la evidencia, por ejemplo, los smoke tests, las suites o `verify:release` no se pueden ejecutar.
  - Si hay a la vez algo que no cumple y algo bloqueado, gana `NEEDS-CHANGES`.
  - Antes, `BLOCKED` significaba «la validación falló»; ese caso es ahora `NEEDS-CHANGES`.
- **Alineación pendiente de historias existentes** (el `parent` de STORY-124 a STORY-128, STORY-137 y STORY-165 ya apunta a `EPIC-23-completar-flujo-de-epic`, 2026-10-27):
  - STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED` y deben alinearse con el vocabulario descrito arriba.
  - STORY-124 cita el texto anterior de CS-1, con `SPECS_BASE`, retirado por ADR-0017.
  - STORY-127 sitúa el gateway en `DEVELOP → VALIDATE`; debe situarlo en `VALIDATE → SHIP`.
- Los IDs `CS-N` de los criterios de salida son estables, como los `SMOKE-N`: no se renumeran al insertar o eliminar criterios.
- Cada criterio de salida y cada smoke test tiene una historia dueña que lo cita en sus notas: STORY-124 (CS-1, CS-2, CS-3, CS-5, CS-6; SMOKE-2, SMOKE-3), STORY-125 (CS-4; SMOKE-1), STORY-126 (CS-7), STORY-127 (CS-8), STORY-128 (CS-9), STORY-137 (CS-10, junto con STORY-126 para `--mode` y `--dry-run`), STORY-165 (CS-15; SMOKE-5), STORY-166 (CS-13; la parte de CS-20 sobre `validation-contract-policy`), STORY-167 (CS-14; SMOKE-4), STORY-168 (CS-16; SMOKE-6), STORY-169 (CS-11), STORY-170 (CS-17, CS-18; la parte de CS-20 sobre `SHIP`; SMOKE-7), STORY-171 (CS-19 para `SHIP/DONE` y `COMPLETED/DONE`; el ADR nuevo y la parte de CS-20 sobre `COMPLETED`; SMOKE-8) y STORY-172 (CS-19 para `CANCELED/DONE`). CS-12 se reparte entre las historias de cada skill nuevo: STORY-165, STORY-167, STORY-168, STORY-170 y STORY-171. CS-21 es transversal: toda historia lo cumple antes de entregarse.
- Flags de `/epic-validate`:

  | Flag | Descripción |
  |------|-------------|
  | `--mode manual` | Fuerza el modo interactivo aunque existan tests automáticos |
  | `--mode auto` | Fuerza ejecución automática (falla si no hay tests configurados) |
  | `--dry-run` | Simula sin escribir archivos ni ejecutar tests |
  | `--verbose` | Muestra salida completa de los comandos de prueba |

- Modos de uso de `/epic-validate`:

  ```bash
  /epic-validate EPIC-23
  /epic-validate EPIC-23 --mode manual
  /epic-validate EPIC-23 --dry-run
  /epic-validate EPIC-23 --verbose
  ```

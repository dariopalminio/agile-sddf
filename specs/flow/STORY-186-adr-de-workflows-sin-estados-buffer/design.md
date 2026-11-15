---
alwaysApply: false
type: design
id: STORY-186
slug: STORY-186-adr-de-workflows-sin-estados-buffer-design
title: "Design: ADR de workflows sin estados buffer"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-186
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - EPIC-029-eliminar-estados-buffer
---

<!-- Referencias -->
[[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[EPIC-029-eliminar-estados-buffer]] · [[migracion-retroactiva-de-estados-de-epica]] · [[rework-sin-estado-propio]] · [[guia-de-revision-review-md]]

## Context

EPIC-029 retira los dos estados buffer del framework: `READY-FOR-IMPLEMENT`, que dice lo mismo que `PLAN/DONE`, y `READY-FOR-DEV`, que nunca se usó. La constitución (§16, «Reglas de framework») exige un ADR para una decisión que afecta a varios skills y restringe a las demás historias. Esta historia es ese ADR, y STORY-187 a STORY-193 lo implementan.

Estado actual verificado en el filesystem (2026-11-13):

- `docs/adr/` llega a ADR-0021 (`guia-de-revision-review-md`). El siguiente número libre es **ADR-0022**.
- ADR-0006 (`status: ACCEPTED`, `supersedes: ADR-0003`) fija los workflows con `READY-FOR-IMPLEMENT` y `READY-FOR-DEV`. ADR-0008 (`status: ACCEPTED`, `supersedes: null`) fija que no hay estado de rework, que la señal es `fix-directives.md` y que los retrocesos van a `READY-FOR-IMPLEMENT/DONE`. También deja como deuda que verify y acceptance no producen un artefacto que el ejecutor reconozca.
- `docs/adr/adr-template.md` define el frontmatter (`type`, `id`, `slug`, `title`, `status`, `date`, `supersedes`, `superseded-by`) y siete secciones: `Contexto y problema`, `Decisión`, `Rationale`, `Alternativas consideradas`, `Consecuencias` (con **Positivas** y **Negativas / trade-offs**) y `Referencias`.
- `docs/adr/README.md` tiene la tabla `| ID | Título | Estado | Fecha |`. Un ADR reemplazado se muestra como `SUPERSEDED → [ADR-NNNN](archivo.md)`.
- `skills/story-code-review/assets/fix-directives-template.md` es el contrato actual de `fix-directives.md`: frontmatter `type`, `story`, `title`, `date`, `max-severity`, `round`, `based-on: code-review-report.md`, la tabla `| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |`, la lista blanca y el ciclo de corrección. `story-code-review` (Paso 4f) calcula `round` como la ronda previa del archivo + 1 y lo borra al aprobar (Paso 4h). Desde ADR-0021, los hallazgos PREEXISTENTE y los `no verificado` no entran, y un hallazgo fusionado entra una vez, con `Reportado por:`.
- Los ejecutores ya dejan rastro de la ronda en `implement-report.md`. `story-implement` escribe `## Ciclo de corrección — ronda {N}` (SKILL.md:1059) y `story-implement-tasks` escribe `## Correcciones de fix-directives.md (ronda <N>)` (SKILL.md:592).
- La regla de evidencia de `story-implement` (Paso 6b) da error solo si la columna `Dimensión` contiene `requirements-coverage`. Ante cualquier otra dimensión, incluida una desconocida, da una advertencia.
- `verify-report.md` lista sus defectos como `### [SEVERITY] título` con `- **Location**:`. `acceptance-report.md` lista los criterios en `| # | Criterio | Resultado | Observaciones del validador | Timestamp |` y no tiene archivo de origen.
- `package.json` está en la versión `5.2.1`. La épica fija que el cambio es BREAKING y lleva a 6.0.0.

La historia es `kind: chore` documental: no cambia ningún skill, script ni test. Sus artefactos son un ADR nuevo, dos ediciones de frontmatter y el índice.

## Goals / Non-Goals

**Goals:**

- Registrar ADR-0022 `ACCEPTED`, con todas las secciones de `adr-template.md`, que fije los workflows sin buffers de historia y de épica. // satisface: AC-1
- Marcar ADR-0006 y ADR-0008 como reemplazados, cambiando solo `status` y `superseded-by`. // satisface: AC-1, CNF-3
- Fijar el contrato de `fix-directives.md` con tres escritores: `based-on`, dimensión por gate y numeración de `round`. // satisface: AC-2
- Fijar la regla del valor legado `READY-FOR-IMPLEMENT/DONE` y la versión en la que se cierra la ventana. // satisface: AC-3
- Cerrar las cuatro «Decisiones para el ADR» de la épica y registrar las alternativas descartadas. // satisface: CNF-1, CNF-2
- Dejar el gate verde. // satisface: CNF-4

**Non-Goals:**

- Modificar skills, plantillas (incluida `docs/templates/fix-directives-template.md`, que crea STORY-190), documentos de dominio, requisitos, guías o ejemplos.
- Añadir la nota visible de reemplazo bajo el título de ADR-0006 y ADR-0008 que pide la convención de `docs/adr/README.md` (ver D-07 y CR-001).
- Tocar ADR-0003, `CHANGELOG.md` o la versión de `package.json`.
- `HUMAN-REVIEW`, un WIP de cola o una política de planificación justo a tiempo.

## Componentes afectados

| # | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | ADR de workflows sin buffers | crear | `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` | AC-1, AC-2, AC-3, CNF-1, CNF-2 |
| C-2 | Frontmatter de ADR-0006 | modificar (`status`, `superseded-by`) | `docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md` | AC-1, CNF-3 |
| C-3 | Frontmatter de ADR-0008 | modificar (`status`, `superseded-by`) | `docs/adr/ADR-0008-rework-sin-estado-propio.md` | AC-1, CNF-3 |
| C-4 | Índice de ADRs | modificar (fila nueva y dos celdas `Estado`) | `docs/adr/README.md` | AC-1 |
| C-5 | Índice wiki | modificar (una línea en `### Decisiones de arquitectura (adr/)`) | `docs/index.md` | AC-1 (descubribilidad; mismo patrón que ADR-0021) |

No se crea ningún componente de código. P3: se reutilizan `adr-template.md`, la tabla de índice existente y el contrato de `fix-directives-template.md` como base del contrato común.

## Interfaces

| Interfaz | Contrato | Satisface |
|---|---|---|
| Frontmatter de ADR-0022 | `type: adr` · `id: ADR-0022` · `slug: workflows-sin-estados-buffer` · `title: "Workflows de Story y Epic sin estados buffer"` · `status: ACCEPTED` · `date: <fecha de implementación, YYYY-MM-DD>` · `supersedes: [ADR-0006, ADR-0008]` · `superseded-by: null` | AC-1 |
| Frontmatter de ADR-0006 y ADR-0008 tras el cambio | `status: SUPERSEDED` · `superseded-by: ADR-0022`. Ningún otro byte cambia (`git diff` muestra exactamente 2 líneas `-` y 2 `+` por archivo) | AC-1, CNF-3 |
| Fila nueva en `docs/adr/README.md` | `\| [ADR-0022](ADR-0022-workflows-sin-estados-buffer.md) \| Workflows de Story y Epic sin estados buffer \| ACCEPTED \| <misma fecha que date> \|`, al final de la tabla | AC-1 |
| Celdas `Estado` de ADR-0006 y ADR-0008 en el índice | `SUPERSEDED → [ADR-0022](ADR-0022-workflows-sin-estados-buffer.md)` | AC-1 |
| Línea en `docs/index.md` | `- [[workflows-sin-estados-buffer]] — [ADR-0022-workflows-sin-estados-buffer.md](adr/ADR-0022-workflows-sin-estados-buffer.md) — Workflows de Story y Epic sin estados buffer`, tras la línea de ADR-0021 | AC-1 |
| Contrato de `fix-directives.md` (lo declara el ADR y lo implementa STORY-190) | ver «Esquema de datos» | AC-2 |

## Decisions

### D-01 — Número, nombre y forma de `supersedes` // satisface: AC-1

- **Elegida:** `ADR-0022-workflows-sin-estados-buffer.md`, con `supersedes: [ADR-0006, ADR-0008]` (lista YAML en línea).
- **Rechazadas:** (a) `supersedes: ADR-0006` y mencionar ADR-0008 solo en el texto, porque el frontmatter perdería la mitad del reemplazo y el AC exige que ambos apunten al nuevo. (b) `supersedes: "ADR-0006, ADR-0008"` como cadena, porque no se puede tratar como lista y mezcla dos valores en un escalar.
- **Justificación:** ninguno de los scripts (`scripts/`, `skills/memory-system/scripts/`) ni de los tests lee `supersedes` de un ADR (verificado con grep). La lista en línea es YAML válido y no rompe nada.

### D-02 — Workflows fijados // satisface: AC-1

- **Historia:** `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`. `story-analyze` con `APPROVED` escribe `PLAN/DONE`, y los ejecutores aceptan `PLAN/DONE`, `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS`.
- **Épica:** `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`. La aprobación del PO es `PLAN/DONE` y se escribe a mano: ningún skill la escribe.
- `status` expresa la etapa y `substatus` el progreso (NFR-006). `TODO` significa «pendiente de iniciar» en cualquier estado activo. No hay WIP limit de cola: la constitución §9 solo limita `IN-PROGRESS`. Los conjuntos cerrados de `status` y `substatus` solo pierden valores, no ganan ninguno.
- **Rechazada:** conservar `READY-FOR-IMPLEMENT` como alias permanente de `PLAN/DONE`, porque duplica la semántica y mantiene las 290 ocurrencias que la épica retira.

### D-03 — Destino del rework: `IMPLEMENT/TODO`, sin estado ni substatus propios // satisface: AC-2, AC-3

- **Elegida:** los tres gates (`story-code-review`, `story-verify`, `story-acceptance`) con `NEEDS-CHANGES` escriben `status: IMPLEMENT` / `substatus: TODO`. La única señal de rework sigue siendo la presencia de `fix-directives.md`, como en ADR-0008.
- **Rechazadas (se registran en el ADR, CNF-2):**
  - **Rework en `PLAN/DONE`:** es el renombrado más barato, pero tras un rechazo de VERIFY o de ACCEPTANCE sugiere que hay que replanificar, y mezcla la cola de «listas para empezar» con la de «devueltas».
  - **Usar el estado como señal de rework:** se pierde al reanudar en `IMPLEMENT/IN-PROGRESS` y no dice qué corregir.
  - **Estado `NEEDS-CHANGES` o substatus `REWORK`:** se mantiene el descarte de ADR-0008 (duplica `story-implement`, abre el conjunto cerrado de substatus).

### D-04 — Contrato de `fix-directives.md` con tres escritores // satisface: AC-2, CNF-1

| Gate | `based-on` | Filas que entran | `Dimensión` | `Archivo:Línea` | `Severidad` | Lista blanca |
|---|---|---|---|---|---|---|
| `story-code-review` | `code-review-report.md` | hallazgos bloqueantes; sin PREEXISTENTE ni `no verificado`; un fusionado una vez, con `Reportado por:` (ADR-0021) | la del revisor (`code-quality`, `requirements-coverage`, `integration-architecture`, `security`) o `DoD-CODE-REVIEW` | la del hallazgo | la del hallazgo | la actual (archivos de los hallazgos que entran) |
| `story-verify` | `verify-report.md` | un defecto `CRITICAL`/`HIGH` abierto de `## Findings` y un criterio DoD VERIFY `❌` | `verify-defect` | `Location` del defecto, o `<ruta del DoD>:<línea>` del criterio | la del defecto, o `HIGH` en un criterio DoD | rutas del repositorio citadas en `Location` de las filas que entran |
| `story-acceptance` | `acceptance-report.md` | un criterio `REJECTED` | `requirements-coverage` | `story.md:<línea del encabezado del AC>` | `HIGH` | vacía, sin error |

- **Dimensión de verify, `verify-defect`** (CNF-1): no es `requirements-coverage`, así que la regla del Paso 6b de `story-implement` da una advertencia y no exige un test nuevo. Un defecto de verify suele venir de un test que ya existe y falla. Se rechazaron `requirements-coverage` (exigiría un test aunque el test fallido ya sea la evidencia), `DoD-VERIFY` (los defectos manuales no son criterios del DoD) y `test-failure` (un defecto encontrado en una prueba manual no es un test fallido).
- **Dimensión de aceptación, `requirements-coverage`:** un criterio rechazado es un requisito no cubierto, así que `story-implement` exige el test del criterio (CS-3 y SMOKE-4).
- **Lista blanca de aceptación, vacía** (CNF-1): el rechazo no tiene archivo de origen. Con la lista vacía, el ejecutor, en modo interactivo, pide confirmar en cada fase los archivos existentes que modifica y, con `--auto`, los registra en `### Archivos fuera de lista blanca`. Se rechazaron dos opciones. Usar los archivos que tocó la implementación no tiene fuente versionada: `cycle-status.json` vive en `.tmp/` y `implement-report.md` solo lista archivos en modo rework. Inferirla de git no es determinista.
- **Ciclo de corrección común:** cualquier rework vuelve a pasar por `/story-code-review` (paso 3 del ciclo), que borra `fix-directives.md` al aprobar. `story-verify` y `story-acceptance` nunca borran el archivo. Tras la revisión, la historia vuelve a recorrer el pipeline hasta el gate que la rechazó.
- **Plantilla:** el ADR fija que el contrato común vive en `docs/templates/fix-directives-template.md`. La crea STORY-190, partiendo de `skills/story-code-review/assets/fix-directives-template.md`, y `based-on` pasa a ser un placeholder.

### D-05 — De dónde lee cada gate la ronda anterior // satisface: AC-2, CNF-1

- **Elegida:** `round = ronda previa + 1`, donde la ronda previa es el **máximo** entero ≥ 1 entre dos fuentes versionadas del directorio de la historia:
  1. el `round` del frontmatter de `fix-directives.md`, si existe;
  2. los `N` de los encabezados de nivel 2 de `implement-report.md` que siguen los patrones `## Ciclo de corrección — ronda N` (`story-implement`) y `## Correcciones de fix-directives.md (ronda N)` (`story-implement-tasks`).
  Sin ningún valor válido, la ronda previa es `0` (la misma degradación sin error que hoy aplica el Paso 4f). Los tres gates aplican la misma regla, así que `round` continúa aunque `story-code-review` haya aprobado entre medias.
- **Rechazadas:** (a) Campo nuevo en el frontmatter de `story.md`: cambia el esquema de historia y añade un escritor, lo que ADR-0008 ya descartó. (b) `cycle-status.json`: vive en `.tmp/`, que no se versiona. (c) Solo `fix-directives.md`: `story-code-review` lo borra al aprobar y la numeración volvería a 1 en el rechazo de verify o acceptance siguiente.
- **Traza:** CR aprueba la ronda 1 (borra `fix-directives.md`, `implement-report.md` conserva la ronda 1) y verify rechaza: máx(—, 1) + 1 = 2. Si un gate rechaza dos veces sin implementar entre medias, cuenta `fix-directives.md` (N) y da N + 1, como hoy.

### D-06 — Valor legado y ventana de transición // satisface: AC-3, CNF-1

- **Regla:** en un proyecto en 6.x, una historia con `READY-FOR-IMPLEMENT/DONE` se trata como `IMPLEMENT/TODO` si existe `implement-report.md` en su directorio y como `PLAN/DONE` si no existe. Los ejecutores la aceptan con un aviso, y `skill-preflight` informa los `status` legados de `story.md` y `epic.md` con un `[WARNING]`, sin modificar archivos. La migración es una edición manual: no hay `memory-system migrate`. `READY-FOR-DEV` no tiene tratamiento de ejecución porque ningún archivo lo usó nunca: solo lo avisa `skill-preflight`.
- **Ventana:** se abre en 6.0.0 y **termina en 7.0.0**, que retira el alias y los avisos. Una ventana de una versión mayor sigue el versionado semántico: retirar un valor aceptado es BREAKING.
- **Sin estado ni substatus de rework:** la regla mapea el valor legado a dos estados que ya existen.
- **Rechazadas (CNF-2):** (a) Clasificar por la presencia de `fix-directives.md`: clasificaba como `PLAN/DONE` los rechazos de verify y acceptance, que antes de 6.0.0 no escribían ese archivo. (b) Una ventana abierta, sin versión de cierre: el alias quedaría de forma permanente. (c) Una ventana hasta una versión menor (6.1.0): retiraría un valor aceptado sin una versión mayor.

### D-07 — Cambios en ADR-0006 y ADR-0008: solo dos campos // satisface: AC-1, CNF-3

- **Elegida:** cambiar solo `status: ACCEPTED → SUPERSEDED` y `superseded-by: null → ADR-0022`, sin la nota visible bajo el título.
- **Rechazada:** seguir la convención de `docs/adr/README.md`, que añade una nota de reemplazo bajo el título (como en ADR-0016 y ADR-0017). La rechazan AC-1 («sin ningún otro cambio») y CNF-3 («solo cambian `status` y `superseded-by`»). La historia es más específica y la convención admite la nota sin exigirla (ADR-0003 tampoco la tiene). Se registra como CR-001.

### D-08 — Alternativas descartadas que registra el ADR // satisface: CNF-2

La sección `## Alternativas consideradas` de ADR-0022 incluye, con su motivo, como mínimo:

1. Rework en `PLAN/DONE` (D-03).
2. Que los ejecutores lean `verify-report.md` y `acceptance-report.md`: tres formatos distintos, y los reportes conservan `NEEDS-CHANGES` después de corregir hasta que el gate vuelve a ejecutarse.
3. Usar el estado como señal de rework (D-03).
4. Clasificar el valor legado por la presencia de `fix-directives.md` (D-06).

Además: `round` en `story.md` (D-05), la dimensión `requirements-coverage` para verify (D-04), un alias permanente de `READY-FOR-IMPLEMENT` (D-02) y la migración automática con `memory-system migrate` (descartada en la épica: edición manual con el aviso de `skill-preflight`).

## Esquema de datos // satisface: AC-1, AC-2, AC-3

Estructura de ADR-0022, en el orden de `adr-template.md` (sin comentarios `escritor:`, como los ADR aceptados):

| Sección | Contenido mínimo | Satisface |
|---|---|---|
| Frontmatter | ver «Interfaces» | AC-1 |
| `# ADR-0022: Workflows de Story y Epic sin estados buffer` | título igual a `title` | AC-1 |
| `## Contexto y problema` | los dos buffers y su evidencia (épica, «Evidencia» y «Volumen»), la deuda de ADR-0008 y las cuatro decisiones abiertas | AC-1, CNF-1 |
| `## Decisión` | D-02 (workflows), D-03 (rework), D-04 (tabla del contrato por gate y ciclo común), D-05 (regla de ronda), D-06 (valor legado y ventana hasta 7.0.0) y la frase «no existe estado ni substatus de rework» | AC-1, AC-2, AC-3 |
| `## Rationale` | simplicidad y coherencia con NFR-006, no el argumento Lean; se conserva la decisión de ADR-0008 sobre la señal y se cierra su deuda | AC-1 |
| `## Alternativas consideradas` | D-08 | CNF-2 |
| `## Consecuencias` | **Positivas** y **Negativas / trade-offs** (BREAKING 6.0.0, edición manual de los consumidores, lista blanca vacía en aceptación, encabezados de ronda distintos en los dos ejecutores) | AC-1 |
| `## Referencias` | ADR-0003, ADR-0006, ADR-0008, ADR-0021, EPIC-029 y STORY-187 a STORY-193 | AC-1 |

Frontmatter de `fix-directives.md` que fija el ADR (lo implementa STORY-190): `type: fix-directives` · `story` · `title` · `date` · `max-severity` · `round` (regla D-05) · `based-on` ∈ {`code-review-report.md`, `verify-report.md`, `acceptance-report.md`}. Tabla, lista blanca y ciclo de corrección según D-04.

## Flujos clave

**F-1 — Registrar el ADR (AC-1):** crear C-1 desde `adr-template.md` → editar los dos campos de C-2 y C-3 → añadir la fila y cambiar las dos celdas de C-4 → añadir la línea de C-5 → `npm run verify:repository` y `npm test`.

**F-2 — Rework por gate (AC-2, lo que describe el ADR):** el gate emite `NEEDS-CHANGES` → calcula `round` (D-05) → escribe `fix-directives.md` (D-04) → `story.md` pasa a `IMPLEMENT/TODO` → el ejecutor detecta el archivo y entra en modo rework → `IMPLEMENT/DONE` → `/story-code-review` (borra el archivo al aprobar) → el pipeline continúa hasta el gate que rechazó.

**F-3 — Valor legado (AC-3):** el ejecutor lee `READY-FOR-IMPLEMENT/DONE` → avisa → ¿existe `implement-report.md`? sí → `IMPLEMENT/TODO`; no → `PLAN/DONE` → continúa como con el estado nuevo.

## Decisiones de complejidad justificada

- **Dos fuentes para la ronda (D-05):** una sola fuente versionada no basta, porque `fix-directives.md` se borra al aprobar y `implement-report.md` solo existe tras implementar. El máximo de las dos se calcula con dos lecturas y no añade campos ni escritores.
- **Una dimensión nueva (`verify-defect`):** no reutiliza ninguna existente para no activar el error de evidencia de `requirements-coverage` ni confundir un defecto con un criterio del DoD. La regla de `story-implement` ya trata cualquier dimensión desconocida como advertencia, así que no exige ningún cambio en el ejecutor.
- **Línea en `docs/index.md` (C-5):** no la exige el AC, pero ADR-0021 la añadió y los enlaces del índice los valida `check-doc-links`. Cuesta una línea.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | Existe `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` con `status: ACCEPTED` | lectura del frontmatter | AC-1 |
| V-2 | ADR-0022 tiene los 7 encabezados de `adr-template.md` | `grep -c "^## "` y comparación de nombres con la plantilla | AC-1 |
| V-3 | El ADR contiene los dos workflows literales y `PLAN/DONE` como aprobación manual del PO | grep de las cadenas de AC-1 | AC-1 |
| V-4 | ADR-0006 y ADR-0008: `status: SUPERSEDED`, `superseded-by: ADR-0022`, y nada más | `git diff --stat` y `git diff` (2 líneas `-` y 2 `+` por archivo) | AC-1, CNF-3 |
| V-5 | ADR-0003 sin cambios | `git diff --quiet -- docs/adr/ADR-0003-*` | CNF-3 |
| V-6 | `README.md`: fila ADR-0022 con el mismo título, estado y fecha que el frontmatter, y ADR-0006/0008 como `SUPERSEDED → ADR-0022` | grep y comparación con el frontmatter | AC-1 |
| V-7 | La tabla de gates del ADR contiene las 3 filas de AC-2, con `based-on`, dimensión (`DoD-CODE-REVIEW`, `verify-defect`, `requirements-coverage`) y la regla de ronda continua | lectura de `## Decisión` | AC-2, CNF-1 |
| V-8 | Regla del valor legado por `implement-report.md`, la ventana hasta 7.0.0 y «sin estado ni substatus de rework» | grep de `implement-report.md`, `7.0.0` y `substatus` en `## Decisión` | AC-3, CNF-1 |
| V-9 | `## Alternativas consideradas` registra las 4 alternativas obligatorias con su motivo | lectura de la sección | CNF-2 |
| V-10 | Gate verde | `npm run verify:repository` y `npm test`, con salida 0 | CNF-4 |
| V-11 | Archivos sin BOM ni caracteres U+FEFF | comprobación de bytes de los 5 archivos tocados | CNF-4 (memoria del proyecto: U+FEFF recurrente) |

## Risks / Trade-offs

- [Un `docs/index.md` desactualizado o con un enlace roto hace fallar `check-doc-links`] → se añade la línea de C-5 a mano con la ruta exacta, como la de ADR-0021, y se ejecuta el gate.
- [Una edición de ADR-0006 o ADR-0008 cambia más bytes de los permitidos (fin de línea, BOM)] → V-4 con `git diff` y V-11 por bytes.
- [La regla de ronda depende de los encabezados de los ejecutores, que difieren] → el ADR nombra los dos patrones literales. Si STORY-190 los unifica, actualiza la regla con un ADR nuevo o se ajusta a los dos patrones.
- [Lista blanca vacía en aceptación: el ejecutor interactivo pide más confirmaciones] → trade-off aceptado y registrado en `Consecuencias`.
- [Encolar en `IMPLEMENT/TODO` deja de medir la espera del rework como tiempo de cola (argumentos 7 y 8 de ADR-0008)] → `TODO` sigue siendo «pendiente de iniciar» y la cola de listas pasa a ser una consulta (primero `IMPLEMENT/TODO`, después `PLAN/DONE`, nota «Indicador de producto» de la épica).

## Open Questions

Ninguna. Las cuatro «Decisiones para el ADR» de la épica se cierran en D-04 (dimensión de verify y lista blanca de aceptación), D-05 (ronda anterior) y D-06 (ventana).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → D-01, D-02, D-07, C-1 a C-5. AC-2 → D-03, D-04, D-05. AC-3 → D-06. CNF-1 → D-04 a D-06. CNF-2 → D-08. CNF-3 → D-07, V-4, V-5. CNF-4 → V-10.
- **Ambigüedad:** AC-2 deja abierta la dimensión de verify («la que nombra el ADR»), y el diseño la fija como `verify-defect`. La fecha de ADR-0022 es la de implementación, igual en el frontmatter y el índice (V-6).
- **Nombres:** «ventana de transición», «valor legado» y «ronda» se usan igual que en la historia y la épica. El slug `workflows-sin-estados-buffer` coincide con el nombre del archivo sin el prefijo `ADR-0022-`, como en los demás ADR.
- **Estructura:** sin dependencias cíclicas: C-1 no depende de nada, C-2, C-3, C-4 y C-5 referencian a C-1, y cada componente tiene una sola razón de cambio.

## Registro de Cambios (CR)

### CR-001

- **Tipo:** ambigüedad
- **Descripción:** la convención de `docs/adr/README.md` («se añade una nota visible de reemplazo bajo su título») contradice AC-1 («sin ningún otro cambio») y CNF-3 («solo cambian `status` y `superseded-by`»).
- **Documento afectado:** design.md (D-07). `docs/adr/README.md` queda fuera del alcance de la convención.
- **Acción requerida:** ninguna en esta historia: se aplica la historia, más específica, y no se añade la nota. Si el PO quiere la nota, se edita la historia antes de implementar. Alinear la redacción de la convención («opcional») queda como propuesta aparte.

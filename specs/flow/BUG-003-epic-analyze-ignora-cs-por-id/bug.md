---
type: bug
id: BUG-003
slug: BUG-003-epic-analyze-ignora-cs-por-id
title: "epic-analyze no acepta CS-N por ID y altera el texto citado de un criterio"
created: 2026-11-12
updated: 2026-11-12
status: SHIP
substatus: IN-PROGRESS
parent: null
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-175-admitir-epicas-archivadas-en-layout
---

## Título: epic-analyze no acepta CS-N por ID y altera el texto citado de un criterio

`/epic-analyze` no da por cubierto un criterio de salida cuando una historia lo menciona por su ID `CS-N`, y en un hallazgo SAL-01 citó un criterio con texto que no está en `epic.md`.

## Resumen (opcional)

Son dos defectos de `skills/epic-analyze/SKILL.md`, detectados al analizar EPIC-28.

1. **Mención por ID.** Para un smoke test basta con citar `SMOKE-<N>` en el `story.md` (evidencia E1). Para un criterio de salida, en cambio, el skill exige que el texto completo del criterio aparezca en el `story.md`, aunque el template de épica le da un ID estable (`**CS-N**`) y las historias ya lo citan así («Cubre **CS-5** de EPIC-28»). Resultado: SAL-01 en criterios que sí están cubiertos.
2. **Fidelidad del informe.** En H-004, el texto citado de CS-5 incluye una cláusula que no está en `epic.md:45` y que proviene de la línea de STORY-183 en el índice de historias (`epic.md:35`).

Si no se corrige el primero, el mismo SAL-01 aparecerá en todas las épicas cuyas historias citen los criterios por ID, y `/epic-validate` (comprobación EST-02) dejará esas épicas en NEEDS-CHANGES.

## Ambiente

- **Versión del producto**: 5.1.1 (commit `a33621b9`, 2026-11-12). `skills/epic-analyze/SKILL.md` no cambia desde `0e9cb3d0` (2026-10-30), así que el defecto sigue en 5.2.0.
- **Navegador**: No aplica: el defecto está en las instrucciones de `skills/epic-analyze/SKILL.md`, que ejecuta el agente.
- **Paquetes y versiones instalados**: Agile SDDF 5.1.1, ejecutado como dogfooding en este repositorio.
- **Sistema operativo**: Independiente del sistema. Se detectó en Windows 11.
- **Modelo de dispositivo**: No aplica.
- **Conexión**: No aplica.

## Pasos para reproducir

1. Partir de una épica cuyos criterios de salida usen el formato del template, `- [ ] **CS-N** — <texto>` (`docs/templates/epic-template.md:30`), y cuyo índice de historias resuma cada historia en una línea.
2. En el `story.md` de una historia que cubra un criterio, citarlo solo por su ID en las Notas, por ejemplo `- Cubre **CS-5** de EPIC-NN.`, sin copiar el texto del criterio.
3. Ejecutar `/epic-analyze EPIC-NN`.
4. Revisar la tabla «Cobertura del contrato de salida» y los hallazgos SAL-01 de `epic-analyze-report.md`.

Reproducción concreta: EPIC-28 en el commit `a33621b9` (ver «Evidencias»).

## Resultado observado

- **Defecto 1:** CS-2, CS-5 y CS-7 quedan como SAL-01, con la mención por ID ignorada. Las mismas historias citan `SMOKE-1`, `SMOKE-3` y `SMOKE-4` del mismo modo, y esos smokes sí quedan cubiertos (✓).
- **Defecto 2:** el «Elemento» de H-004 y la fila CS-5 de la tabla añaden a CS-5 la cláusula «y los criterios cubiertos por un revisor toman su resultado en lugar de crear hallazgos nuevos», que no está en `epic.md:45`.

## Resultado esperado (opcional)

- **Defecto 1:** cuando la épica declara un ID explícito `**CS-<id>**`, la aparición de ese token en el cuerpo del `story.md`, con límite de palabra y fuera de «Fuera de alcance», es evidencia E1. Es la misma regla que ya se aplica a `SMOKE-<N>`. Así, `CS-1` no casa con `CS-10` ni con `CS-1a`.
- **Defecto 2:** el «Elemento» de cada hallazgo SAL y la columna «Texto o nombre» de la tabla reproducen el texto literal de la línea de `epic.md` que citan, sin añadir ni quitar cláusulas.

## Evidencias (opcional)

**Regla actual** (`skills/epic-analyze/SKILL.md:198`, evidencia E1): «**Smoke:** el token `SMOKE-<N>` aparece en el cuerpo con límite de palabra […]. **Criterio:** su texto completo normalizado es subcadena de una línea normalizada del cuerpo.»

**Origen de la diferencia** (`skills/epic-analyze/SKILL.md:191`): el skill numera los criterios por posición y afirma que `CS-<n>` «es una etiqueta del reporte, no un ID de la épica». Sin embargo, el template de épica sí declara el ID en cada criterio:

```text
docs/templates/epic-template.md:30
- [ ] **CS-N** — [Criterio técnico verificable]
```

**Menciones por ID ignoradas** (`git show a33621b9:specs/flow/STORY-NNN-*/story.md`):

```text
STORY-180 story.md:86  - Cubre **CS-2** y **CS-3** de EPIC-28, y el escenario **SMOKE-1** y **SMOKE-3**.
STORY-183 story.md:76  - Cubre **CS-5** de EPIC-28.
STORY-184 story.md:69  - Cubre **CS-6** de EPIC-28 y el escenario **SMOKE-4**.
STORY-177 story.md:67  - Corresponde al criterio de salida **CS-7** de EPIC-28. […]
```

En `epic-analyze-report.md` (`a33621b9`), CS-2, CS-5 y CS-7 aparecen como SAL-01 con evidencia solo `parcial`, mientras que SMOKE-1, SMOKE-3 y SMOKE-4 aparecen como ✓.

**Texto alterado en H-004** (`a33621b9`, `epic-analyze-report.md:88-91`):

```text
- **Elemento:** `dod-story-code-review.md y su plantilla en skills/sddf-constitution/assets/dod-story/ no contienen
  criterios que el orquestador satisface por sí mismo (informe creado, veredicto APPROVED, ausencia de bloqueantes),
  y los criterios cubiertos por un revisor toman su resultado en lugar de crear hallazgos nuevos, y memory-system check pasa`
- **Evidencia:** epic.md:45 · […]
```

El criterio real en `epic.md:45`:

```text
- [ ] **CS-5** — `dod-story-code-review.md` y su plantilla en `skills/sddf-constitution/assets/dod-story/` no contienen
  criterios que el orquestador satisface por sí mismo (informe creado, veredicto `APPROVED`, ausencia de bloqueantes),
  y `memory-system check` pasa.
```

La cláusula extra está en la línea de STORY-183 del índice de historias (`epic.md:35`): «[…] y que los criterios cubiertos por un revisor tomen su resultado en lugar de crear hallazgos nuevos, para que un mismo defecto no aparezca varias veces en `fix-directives.md`.»

## Datos de prueba (opcional)

- `git show a33621b9:specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md` (criterios en las líneas 41-48 e índice en las líneas 29-37).
- `git show a33621b9:specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic-analyze-report.md` (`verdict: NEEDS-REFINEMENT`, 6 errores, H-001 a H-006).
- Ningún caso de `skills/epic-analyze/evals/evals.json` (30 casos) cubre una mención `CS-<n>` por ID en un `story.md`: los casos que citan `CS-1`/`CS-2` lo hacen en el reporte esperado y cubren el criterio por E2 o por texto literal.

## Contexto adicional (opcional)

**Impacto en EPIC-28.** De los 6 SAL-01, el defecto 1 explica 3 (CS-2, CS-5 y CS-7). Los otros 3 tienen causas distintas que el skill aplica según su especificación y que este bug no cambia: CS-1 y CS-4 tenían cobertura repartida entre varias historias (el skill no suma evidencias parciales, `SKILL.md:201`), y CS-8 no lo mencionaba ninguna historia. La épica se desbloqueó a mano: se copió el texto literal de cada criterio en las historias y CS-1, CS-4 y CS-8 se dividieron en `epic.md` (`d32fb24e`, nota «Refinamiento del contrato de salida» en la épica archivada). Con esa solución, cada historia repite el texto del criterio, y esas copias quedan desactualizadas si el criterio cambia.

**Síntoma relacionado (mismo origen que el defecto 1).** Como la etiqueta es posicional, deja de coincidir con el ID de la épica en cuanto hay IDs no secuenciales. En el reporte de `d32fb24e`, la fila etiquetada `CS-5` es el criterio `**CS-4a**` y la fila `CS-8` es `**CS-5**`. La corrección del defecto 1 debería usar el ID declarado como etiqueta y dejar la etiqueta posicional solo para los criterios sin ID.

**Causa probable del defecto 2.** El texto del criterio lo transcribe el agente: no hay un script que lo extraiga. La línea del índice de STORY-183 parafrasea CS-5 y le añade una cláusula, y el agente mezcló las dos. Un extractor determinista de criterios, con su línea y su texto literal, eliminaría esta clase de error. Como alternativa más ligera, el skill puede exigir copiar el texto de la línea citada sin reformularlo.

**Corrección propuesta.**

1. Escribir primero los casos de eval (principio 11 de la constitución): una historia que cita `**CS-2**` por ID queda cubierta (E1); `CS-1` no casa con `CS-10` ni con `CS-1a`; una mención en «Fuera de alcance» no cuenta; un criterio sin ID conserva la regla actual de texto literal; y el texto citado en un hallazgo SAL-01 coincide con la línea de `epic.md` aunque el índice de historias la parafrasee.
2. En `SKILL.md:191`, si el criterio declara `**CS-<id>**`, usar ese ID como etiqueta. En `SKILL.md:198`, aceptar el token `CS-<id>` como E1 con las mismas reglas que `SMOKE-<N>`.
3. Actualizar la acción sugerida de SAL-01 (`SKILL.md:217`) para que proponga «citar `CS-<id>` en su `story.md`», no copiar el texto completo.
4. Reforzar la fidelidad del texto citado (defecto 2), con un extractor determinista o con una regla explícita de copia literal.

**Fuera de alcance.** Sumar coberturas parciales de varias historias (`SKILL.md:201`) es una decisión de diseño, no un defecto. Si se quiere cambiar, se registra como mejora aparte.

### Corrección aplicada (2026-11-12)

Plan: [plan.md](plan.md) (`plan-03`). Defecto 2 corregido con una regla de copia literal, sin extractor determinista (decisión del usuario).

- **Evals primero:** `skills/epic-analyze/evals/evals.json` (TC-031 a TC-034, versión 1.5.0) y `skills/epic-refine/evals/evals.json` (TC-026, versión 1.5.0, con el ejemplo nuevo `skills/epic-refine/examples/cobertura-por-id/`).
- **`skills/epic-analyze/SKILL.md`:** Paso 5b.1 (ID declarado `**CS-<id>**` como etiqueta, `(implícito)` para los criterios sin ID), regla E1 por ID con límite de palabra, párrafo «Texto citado (copia literal)», dos ejemplos nuevos y acción de SAL-01 «citar `CS-<id>` en su `story.md`».
- **`skills/epic-analyze/assets/epic-analyze-report-template.md`:** comentario de `cobertura-salida` alineado.
- **`skills/epic-refine/references/sal-corrections.md`:** etiqueta, elemento vigente y regla E1 alineados con `epic-analyze`; AC de cierre y cita E1 usan el enunciado sin el prefijo del ID.

**Verificación:**

- `npm test`: 584/584 en verde.
- `npm run verify:repository`: aprobado (una primera ejecución falló en una prueba de `run-evals` que no se reprodujo al repetir el gate).
- Sin U+FEFF en los archivos editados; marcador `SDDF-FIXED-LAYOUT: v1` intacto; `grep "no un ID de la épica"` sin resultados en `epic-analyze` y `epic-refine`.

**Pendiente (manual, a criterio humano por cuota):** `npm run test:eval -- epic-analyze` (TC-011, TC-012, TC-031 a TC-034) y `npm run test:eval -- epic-refine` (TC-026 y los casos SAL), y la comprobación del proceso sobre la próxima épica que cite `CS-<id>`.

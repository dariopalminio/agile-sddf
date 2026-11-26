# Intención: Optimizar el desglose de épicas en historias
Autor: D. Palminio (PO de Agile-SDDF).
Estado: borrador.

## Problema
El desglose de una épica en historias optimiza el tamaño de cada historia, no el costo total de la épica. En este harness cada historia tiene un costo fijo alto: en las historias archivadas STORY-180 a STORY-184 el promedio ronda las 1.200 líneas de artefactos (design.md ~319, analyze.md ~166, implement-report.md ~148, verify-report.md ~140, code-review-report.md ~120, testcases.md ~84, story.md ~81, finvest-evaluation-report.md ~74, tasks.md ~60), además de las puertas humanas y la cuota de tokens.

El caso de EPIC-029 (eliminar los buffers READY-FOR-*) lo hizo visible: `/epic-generate-stories` y `/story-split` produjeron 14 historias para un cambio cuya mayor parte es un renombrado. Eso proyectaba unas 17.000 líneas de proceso frente a un diff real estimado (sin medir) de 1.000 a 2.000 líneas. Hubo que reagrupar a mano en 8 historias, cancelar 6 y aprobar manualmente dos veredictos SPLIT de `/story-evaluation` (STORY-190 y STORY-191, S = 1).

Los síntomas observados en ese desglose:

- **Corte por comportamiento sobre los mismos archivos:** cuatro historias tocaban story-implement y story-implement-tasks, y otras cuatro, los tres gates. Cada una volvía a leer, diseñar, probar y revisar (con 4 subagentes) el mismo SKILL.md.
- **Pérdida de independencia (la «I» de INVEST):** el corte fino exigió andamiaje de estados intermedios («Orden y coordinación») para que ningún estado transitorio dejara historias sin ejecutor.
- **Micro-historias por presión del split:** STORY-196 (una guardia, 2 AC) y STORY-199 (un anuncio y un aviso) salieron de dividir por «complejidad de criterios».
- **Documentación dividida que se valida en conjunto:** dos historias de Markdown cuyo test real era el mismo grep de un criterio de salida, llevadas a TDD con testcases.md, code review y verify.
- **Épicas con dos objetivos mezclados:** simplificación y funcionalidad nueva de más riesgo en la misma épica.

Comparado con Spec Kit (~1.500 líneas, estimado) y OpenSpec (~500 líneas, estimado) para el mismo alcance, la diferencia es de 10 a 30 veces. Parte es control legítimo (gates, puertas humanas con WIP, trazabilidad de los criterios de salida a la evidencia), pero solo la capa de spec y plan (unas 700 líneas por historia) sigue sumando ~10.000 líneas frente a ~1.500. Ese sobrecosto sale del costo fijo por historia y de un design.md cuatro veces más largo que la historia que diseña.

## Resultado esperado (outcome)
Que el desglose de una épica busque el tamaño de lote óptimo (la curva en U de Reinertsen) y no la historia más pequeña posible. Así se reducen el costo total de proceso de la épica, las puertas humanas y la cuota de tokens, sin perder la cobertura de su contrato de salida ni la trazabilidad. Con eso desaparece la reagrupación manual posterior al split.

## Solución propuesta (output)
Mejorar `/epic-generate-stories` y `/story-split` para que el desglose tenga en cuenta el costo total de la épica:

1. **Agrupar por superficie de cambio:** que un mismo SKILL.md o artefacto lo toque, en lo posible, una sola historia. Evitar cortes por comportamiento que obligan a varias historias a rediseñar y revisar los mismos archivos.
2. **Preservar la independencia:** no partir cuando el corte exige andamiaje de estados intermedios o coordinación de orden entre historias hermanas.
3. **Evitar micro-historias:** no dividir solo por «complejidad de criterios». Los casos parecidos van como filas de un mismo escenario (por ejemplo, verify y acceptance como dos filas de una tabla), no como escenarios ni historias aparte.
4. **No dividir documentación que se valida en conjunto:** si varias piezas de Markdown comparten la misma verificación (un grep o un gate), quedan en una sola historia.
5. **Señalar épicas con objetivos mezclados:** advertir cuando una épica combina simplificación y funcionalidad nueva de más riesgo, y sugerir separarlas.
6. **Resolver el conflicto con FINVEST:** definir cómo se concilia un veredicto SPLIT de `/story-evaluation` (S = 1) con el costo total de la épica, para que la aprobación manual no sea la única salida.
7. **Vía ligera para historias de documentación:** registrar como mejora del harness un recorrido para historias de documentación o chore sin testcases.md ni TDD, con el grep o el gate como verificación.

## Usuarios y sistemas afectados
Usuarios: PO y desarrolladores que usan Agile-SDDF para desglosar y planificar épicas, en este repositorio (dogfooding) y en los proyectos consumidores.
Sistemas: skills `epic-generate-stories`, `story-split` y `story-evaluation`; de forma indirecta, `epic-generate-all-stories`, `epic-analyze`, `story-plan` y el template `docs/templates/story-template.md` (campo `kind`).

## Restricciones
- El desglose debe seguir cubriendo el contrato de salida de la épica (criterios de salida y smoke tests) y superar `/epic-analyze` sin hallazgos ERROR.
- No relajar FINVEST como evaluación de calidad: la mejora concilia tamaño y costo total, no elimina la «S» de INVEST.
- Las cifras de costo de Spec Kit y OpenSpec son estimaciones, no mediciones; las decisiones deben basarse en datos medidos del propio harness.
- Respetar el layout fijo (ADR-0023), los WIP-Limit y la inmutabilidad de los ADR aceptados.
- Los skills y documentos se redactan en español.

## Preguntas abiertas
1. ¿Qué heurística o métrica concreta usa el desglose para estimar el costo fijo por historia frente al tamaño de cada una (por ejemplo, cantidad de archivos compartidos entre historias)? Se puede usar la cantidad de archivos compartidos y la complejidad de los cambios como referencia para estimar el costo fijo por historia.
2. ¿Cómo debe resolverse el conflicto entre un veredicto SPLIT de `/story-evaluation` y el costo total de la épica: un umbral, una excepción documentada o una decisión explícita del PO registrada en la historia? La resolución puede combinar un umbral de costo, excepciones documentadas y decisiones explícitas del PO según corresponda.
3. ¿La vía ligera para historias de documentación es parte de esta épica o una épica propia? ¿Requiere un nuevo valor de `kind` (hoy solo `feat | fix | chore | hotfix`)? Sí, es parte de esta épica. Sí requiere un nuevo valor de `kind`; se puede registrar como `docs`.
4. ¿Conviene además reducir el tamaño de design.md (~320 líneas de promedio) dentro de esta épica, o queda fuera de alcance? Queda fuera del alcance de esta épica, se deja para épica futura de optimización.
5. ¿Hay que agregar a `/epic-analyze` un aviso de «sobre-desglose» (por ejemplo, varias historias que tocan el mismo SKILL.md)? Sí, sería útil para detectar redundancias y optimizar el desglose de historias.

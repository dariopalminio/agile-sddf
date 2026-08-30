---
type: adr
id: ADR-0006
slug: migracion-retroactiva-de-estados-de-epica
title: "Workflows canónicos de Story y Epic, con migración retroactiva de los estados históricos"
status: ACCEPTED
date: 2026-08-30
supersedes: ADR-0003
superseded-by: null
---

# ADR-0006: Workflows canónicos de Story y Epic, con migración retroactiva de los estados históricos

## Contexto y problema

[[workflow-canonico-story-y-epic]] (ADR-0003, 2026-06-14) formalizó los workflows canónicos de los
niveles L1 y L2, pero aceptó explícitamente como trade-off no migrar los artefactos ya escritos:

> Los artefactos `release.md` históricos en `docs/specs/releases/EPIC-*/` quedan con valores del
> esquema antiguo (`DEFINITION`, `RELEASED`, `IMPLEMENT`). No se migran retroactivamente — son
> artefactos cerrados y la inconsistencia es aceptable.

Dos meses y medio después esa premisa ya no se sostiene:

1. **La inconsistencia dejó de ser marginal.** 15 de 19 épicas quedaron fuera de la máquina de
   estados: 13 con `status: RELEASED`, una con `DEFINITION` y una con `IMPLEMENT` (un estado de
   *story*, no de épica). Además 12 declaraban `substatus: READY`, valor que no pertenece al conjunto
   canónico `TODO | IN-PROGRESS | DONE | BLOCKED`. La excepción era mayoría, no residuo.
2. **`RELEASED` pasó a ser un término prohibido.** [[nivel-l2-epic-y-directorios-numerados]]
   (ADR-0004) reservó `release` exclusivamente para su sentido CI/CD. Un `status: RELEASED` en un
   `epic.md` reintroduce justo la colisión semántica que ADR-0004 eliminó.
3. **Los artefactos no estaban tan cerrados como se asumió.** La reescritura de `project.md` del
   2026-08-30 tuvo que leer el estado de las 19 épicas para construir su apéndice de estado de
   implementación. Los artefactos históricos siguen siendo entrada de skills y de agentes, no
   documentos muertos.
4. **El coste real fue trivial.** La migración es una sustitución de cuatro literales en el
   frontmatter, sin impacto en ningún skill: ningún `SKILL.md` lee ni escribe `RELEASED`,
   `DEFINITION` ni `READY`.

## Decisión

Se mantienen sin cambios los workflows canónicos establecidos por ADR-0003 para el campo `status`
del frontmatter YAML:

**Story:**
```
SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED
```

**Épica:**
```
DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED
```

`COMPLETED` es terminal pasivo y compartido por ambos niveles. Los substatus canónicos son
`TODO | IN-PROGRESS | DONE | BLOCKED`. El rationale completo de cada estado sigue siendo el de
ADR-0003 y no se repite aquí.

**Lo que esta decisión cambia:** los artefactos históricos **sí se migran retroactivamente**. Ningún
documento de spec conserva valores de `status` o `substatus` fuera de la máquina de estados de su
nivel. La tabla de equivalencias aplicada el 2026-08-30 a las 19 épicas es:

| Valor histórico | Valor canónico | Justificación |
|---|---|---|
| `status: RELEASED` | `status: COMPLETED` | `RELEASED` era el terminal del esquema de 2 estados. Su sucesor semántico es el terminal pasivo, no `SHIP` (que ADR-0003 define como «último estado **activo**»). Aplicado a 13 épicas cerradas y publicadas |
| `status: DEFINITION` | `status: DEFINE` | Renombrado puro, ya previsto en ADR-0003 («DEFINE reemplaza DEFINITION»). Aplicado a EPIC-13 |
| `status: IMPLEMENT` | `status: DEVELOP` | `IMPLEMENT` es un estado de *story*; su equivalente en el nivel épica es `DEVELOP`. Aplicado a EPIC-17 |
| `substatus: READY` | `substatus: DONE` | `READY` significaba «documento terminado, listo para avanzar», que es exactamente `DONE`. Aplicado a 12 épicas |

La migración es una **traducción de etiquetas, no una reevaluación del avance**: preserva la
afirmación de progreso que cada documento ya hacía. Reconsiderar si una épica está realmente
terminada es trabajo aparte.

## Rationale

- **Un conjunto de valores válidos que no admite excepciones es verificable; uno que sí, no.** Con la
  excepción histórica en pie, ningún linter ni skill podía validar el campo `status` sin una lista de
  valores legacy tolerados. Migrar convierte la máquina de estados en un contrato comprobable con un
  `grep`.
- **Principio constitucional 1 (el repositorio como sistema).** Un agente que lee un `epic.md` para
  orientarse recibe un `status` que no puede situar en ninguna máquina de estados documentada. La
  inconsistencia no es cosmética: degrada la fuente de verdad que los agentes consumen.
- **Principio constitucional 8 (patrones de resultado predecibles).** Dos épicas igual de terminadas
  (EPIC-12 y EPIC-14) declaraban estados distintos por el mero azar de la fecha en que se escribieron.
- **KISS (principio 4).** Mantener dos vocabularios vivos —el canónico y el histórico— es más caro de
  explicar y de mantener que ejecutar la sustitución una vez.
- **Coherencia con ADR-0004.** Erradicar `release` como nombre de work item exige erradicar también
  `RELEASED` como estado de épica.

## Alternativas consideradas

- **Mantener ADR-0003 tal cual (no migrar):** descartada — la excepción alcanzaba al 79% de las
  épicas, es decir, el esquema antiguo seguía siendo el mayoritario. Una convención que la mayoría
  del corpus incumple no es una convención.
- **Migrar `RELEASED` → `SHIP`** (lo que proponía el hallazgo F-12 de `plan-05` de STORY-086):
  descartada — ADR-0003 define `SHIP` como «el último estado **activo** del flujo». Dejaría 13 épicas
  históricas parqueadas para siempre en un estado activo y desalineadas de EPIC-14, 15, 16 y 18, que
  ya estaban en `COMPLETED`.
- **Añadir una nota de enmienda al final de ADR-0003:** descartada — viola la regla de inmutabilidad
  de `docs/adr/README.md`, según la cual el único cambio permitido sobre un ADR aceptado es rellenar
  su campo `superseded-by`.
- **Registrar la migración solo en el CHANGELOG, sin ADR:** descartada — dejaría a ADR-0003, que
  sigue siendo lectura obligatoria para entender los workflows, afirmando algo que ya no es cierto.
- **Aprovechar la migración para reevaluar el avance real de cada épica:** descartada — mezcla dos
  cambios de naturaleza distinta (traducción de vocabulario vs. juicio sobre el estado del trabajo) en
  una sola operación, lo que impediría revisar cualquiera de los dos por separado.

## Consecuencias

**Positivas:**

- Las 19 épicas usan valores de la máquina de estados canónica: 17 `COMPLETED/DONE`, 1 `DEVELOP/DONE`
  (EPIC-17) y 1 `DEFINE/IN-PROGRESS` (EPIC-13).
- El campo `status` de cualquier artefacto spec queda validable contra una lista cerrada por nivel,
  sin valores legacy tolerados.
- Se elimina el último uso de `RELEASED` como estado de work item, cerrando la migración de
  vocabulario iniciada en ADR-0004.
- `docs/guides/state-machine.md` describe ahora el corpus completo, no solo los artefactos nuevos.

**Negativas / trade-offs:**

- Los 19 `epic.md` registran un commit de cambio de metadatos que no corresponde a trabajo de
  producto, lo que añade ruido al historial de esos archivos.
- La equivalencia `RELEASED → COMPLETED` asume que todo lo marcado como *released* estaba
  administrativamente cerrado. Es cierto para las 13 épicas migradas, pero es una inferencia sobre el
  significado que tenía el estado antiguo, no un dato registrado en su momento.
- La migración preserva afirmaciones de avance que pueden ser inexactas: EPIC-13 sigue en `DEFINE`
  pese a tener todas sus historias marcadas, y EPIC-17 en `DEVELOP/DONE` con sus 17 planes cerrados.
  Revisar esos dos estados queda pendiente como trabajo separado.
- Diez épicas (EPIC-00 a EPIC-09) conservan el campo `date:` en vez del par canónico
  `created:`/`updated:` que define `header-aggregation`. Esta decisión no aborda esa deriva.

## Referencias

- [[workflow-canonico-story-y-epic]] — ADR-0003, superseded por este ADR: conserva el rationale
  completo de cada uno de los estados de ambos workflows
- [[nivel-l2-epic-y-directorios-numerados]] — ADR-0004: reserva `release` para su sentido CI/CD
- [[state-machine]] — máquina de estados canónica con diagramas Mermaid por nivel
- [[specs-and-workflows]] — descripción narrativa de estados y subestados
- [[constitution]] — principios 1, 4 y 8, y patrón 14 (ciclo de vida con `status` + `substatus`)
- [[PROJ-01-agile-sddf]] — apéndices A y B, donde se documentó la brecha que originó esta decisión

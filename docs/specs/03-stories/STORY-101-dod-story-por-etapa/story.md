---
type: story
id: STORY-101
slug: STORY-101-dod-story-por-etapa
title: "Dividir el DoD de Story en un guardrail por etapa, referenciado explÃ­citamente por cada skill"
status: CODE-REVIEW
substatus: DONE
kind: feat
parent: EPIC-20-memory-system
created: 2026-09-23
updated: 2026-09-24
related: none
---

# STORY-101: Dividir el DoD de Story en un guardrail por etapa, referenciado explÃ­citamente por cada skill

---

## ðŸ“– Historia

**Como** mantenedor del framework SDDF que quiere un DoD eficiente y mantenible,  
**Quiero** dividir `dod-story-checklist.md` en un archivo `dod-story-<stage>.md` por etapa, con **referencia explÃ­cita desde el SKILL.md de cada skill** (OpciÃ³n A) y un **mapeo opcional en `sddf.config.yaml`** que permita overrides por proyecto (OpciÃ³n C),  
**Para** reducir el consumo de tokens, aislar el mantenimiento por etapa, permitir `enforcement` granular, corregir el orden del pipeline y alinear el DoD con el patrÃ³n `guardrails/` (un guardrail por archivo, per ADR-0001/0007).

---

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ DivisiÃ³n en un archivo por etapa

```gherkin
Dado el archivo monolÃ­tico `docs/guardrails/dod-story-checklist.md`
Cuando se ejecuta la migraciÃ³n
Entonces existen los siguientes archivos en `docs/guardrails/`:
  Â· dod-story-specify.md
  Â· dod-story-plan.md
  Â· dod-story-implement.md
  Â· dod-story-code-review.md
  Â· dod-story-verify.md
  Â· dod-story-acceptance.md
 Y cada uno declara en su frontmatter la transiciÃ³n que protege, el cierre de su etapa:
  Â· type: guardrail
  Â· kind: transition
  Â· enforcement: error | warn (segÃºn la etapa)
  Â· from: <ETAPA>/IN-PROGRESS
  Â· to: <ETAPA>/DONE
  Â· applies-to: story
 Y existe ademÃ¡s dod-story-deliver.md (checklist de despliegue, ver escenario de deliver)
 Y cada archivo es autocontenido: un solo criterio de transiciÃ³n, sin mezclar etapas
```

### Escenario principal â€“ Cada skill referencia explÃ­citamente su DoD (OpciÃ³n A)

```gherkin
Dado el skill `story-implement`
Cuando se inspecciona su `SKILL.md`
Entonces contiene una secciÃ³n "## DoD aplicable" con la ruta explÃ­cita:
  `docs/guardrails/dod-story-implement.md`
 Y esa misma secciÃ³n existe en cada uno de los 9 skills de Story que usan un DoD:
  Â· story-specify          â†’ dod-story-specify.md
  Â· story-plan             â†’ dod-story-plan.md (lo evalÃºa story-analyze)
  Â· story-design           â†’ dod-story-plan.md
  Â· story-analyze          â†’ dod-story-plan.md
  Â· story-implement        â†’ dod-story-implement.md
  Â· story-implement-tasks  â†’ dod-story-implement.md
  Â· story-code-review      â†’ dod-story-code-review.md
  Â· story-verify           â†’ dod-story-verify.md
  Â· story-acceptance       â†’ dod-story-acceptance.md
 Y ningÃºn SKILL.md referencia el archivo monolÃ­tico `dod-story-checklist.md`
 Y dod-story-deliver.md no tiene skill asociado por ahora
```

### Escenario principal â€“ Mapeo centralizado en `sddf.config.yaml` (OpciÃ³n C)

```gherkin
Dado el archivo `sddf.config.yaml`
Cuando se inspecciona su secciÃ³n `guardrails`
Entonces contiene el mapeo completo:
  guardrails:
    dod:
      story:
        specify:      dod-story-specify
        plan:         dod-story-plan
        implement:    dod-story-implement
        code-review:  dod-story-code-review
        verify:       dod-story-verify
        acceptance:   dod-story-acceptance
        deliver:      dod-story-deliver
 Y cada skill lee la ruta desde `sddf.config.yaml` con fallback a la convenciÃ³n por nombre
 Y un proyecto consumidor puede sobrescribir el mapeo sin tocar los skills
```

### Escenario principal â€“ Orden del pipeline corregido

```gherkin
Dado el contenido de la secciÃ³n VERIFY del archivo monolÃ­tico original
Cuando se migra a `dod-story-verify.md`
Entonces el archivo declara `from: VERIFY/IN-PROGRESS` y `to: VERIFY/DONE`
 Y el archivo `dod-story-code-review.md` declara `from: CODE-REVIEW/IN-PROGRESS` y `to: CODE-REVIEW/DONE`
 Y el orden canÃ³nico de las etapas con DoD es:
  SPECIFY â†’ PLAN â†’ IMPLEMENT â†’ CODE-REVIEW â†’ VERIFY â†’ ACCEPTANCE
 Y no queda ninguna secciÃ³n que invierta CODE-REVIEW y VERIFY
```

### Escenario alternativo â€“ Checklist de despliegue (deliver) movido a su propio archivo

```gherkin
Dado el bloque "ðŸš€ Criterios de Despliegue en ProducciÃ³n" del archivo monolÃ­tico
Cuando se migra
Entonces se convierte en `docs/guardrails/dod-story-deliver.md`
 Y ese archivo declara `applies-to: deliver` (no `story`) y `kind: content`, sin `from` ni `to`
 Y ningÃºn archivo `dod-story-<stage>.md` contiene criterios de deliver
```

### Escenario alternativo â€“ Referencias cruzadas a guardrails convertidas en wikilinks

```gherkin
Dado el criterio:
  "[ ] Se cumple el [Checklist de Seguridad de IA](../guardrails/gr-ai-security-checklist.md)"
Cuando se migra a `dod-story-implement.md`
Entonces la referencia se convierte en un wikilink:
  "- [ ] Se cumple [[gr-ai-security-checklist]]"
 Y se aplica la misma conversiÃ³n a los otros dos checklists referenciados
```

### Escenario alternativo â€“ Compatibilidad temporal durante una versiÃ³n

```gherkin
Dado un proyecto que ya usa `dod-story-checklist.md`
Cuando se actualiza el framework a la versiÃ³n que introduce la divisiÃ³n
Entonces el archivo monolÃ­tico sigue existiendo durante una versiÃ³n minor
 Y su contenido se reemplaza por un Ã­ndice temporal:
  "# DoD Story (deprecado) â€” ver [[dod-story-specify]], [[dod-story-plan]], [[dod-story-implement]], [[dod-story-code-review]], [[dod-story-verify]], [[dod-story-acceptance]], [[dod-story-deliver]]"
 Y el CHANGELOG documenta la deprecaciÃ³n y la fecha de eliminaciÃ³n (siguiente major)
```

### Escenario â€“ Idempotencia de la migraciÃ³n

```gherkin
Dado que la migraciÃ³n ya se ejecutÃ³ una vez
Cuando se vuelve a ejecutar el skill `memory-system migrate --from=dod-monolithic`
Entonces los archivos existentes no se sobrescriben sin `--force`
 Y el comando reporta "creados: 0 Â· sobrescritos: 0 Â· preservados: N Â· reemplazados: 0"
 Y no duplica contenido entre archivos
```

---

## ðŸ“‹ Requerimientos

### Requerimientos funcionales

- **CF-01 â€” DivisiÃ³n:** `dod-story-checklist.md` se divide en 6 archivos `dod-story-<stage>.md` (uno por etapa) + 1 archivo `dod-story-deliver.md` (checklist de despliegue). El monolÃ­tico se conserva como Ã­ndice deprecado durante una versiÃ³n: 8 archivos `dod-story-*.md` en total.

- **CF-02 â€” Frontmatter enriquecido:** cada archivo por etapa declara la transiciÃ³n que protege (`from: <ETAPA>/IN-PROGRESS`, `to: <ETAPA>/DONE`), `applies-to: story`, `enforcement` y `kind: transition`. `dod-story-deliver.md` declara `kind: content` y `applies-to: deliver`, sin `from`/`to`.

- **CF-03 â€” Referencia explÃ­cita (OpciÃ³n A):** cada SKILL.md de Story que usa un DoD (9 skills, ver AC-2) incluye una secciÃ³n "## DoD aplicable" con la ruta explÃ­cita al archivo de su etapa. NingÃºn SKILL.md referencia el monolÃ­tico.

- **CF-04 â€” Mapeo centralizado (OpciÃ³n C):** `sddf.config.yaml` incluye la secciÃ³n `guardrails.dod.story` con el mapeo etapa â†’ slug. Los skills leen la ruta con la precedencia: `sddf.config.yaml` â†’ convenciÃ³n por nombre (`dod-story-<etapa>.md`) â†’ aviso accionable (el skill continÃºa sin validaciÃ³n DoD; el DoD es opcional).

- **CF-05 â€” Orden corregido:** el orden canÃ³nico de las etapas con DoD es `SPECIFY â†’ PLAN â†’ IMPLEMENT â†’ CODE-REVIEW â†’ VERIFY â†’ ACCEPTANCE`. NingÃºn archivo invierte `CODE-REVIEW` y `VERIFY`. `DELIVER` no forma parte de la cadena: su checklist es de contenido.

- **CF-06 â€” ConversiÃ³n a wikilinks:** las referencias a `../guardrails/gr-*.md` se convierten en wikilinks `[[gr-*]]` en los archivos migrados.

- **CF-07 â€” Modo de migraciÃ³n en `memory-system`:** el skill `memory-system` acepta un modo `migrate --from=dod-monolithic` que realiza la divisiÃ³n de forma idempotente y reporta creados/preservados.

- **CF-08 â€” ValidaciÃ³n en `memory-system check`:** el modo `check` verifica que:
  - Cada skill de Story referencia un archivo `dod-story-<stage>.md` existente.
  - Cada archivo `dod-story-<stage>.md` declara `from`, `to` y `enforcement`.
  - El mapeo en `sddf.config.yaml` apunta a archivos existentes.
  - No hay referencias al monolÃ­tico `dod-story-checklist.md` (excepto en el Ã­ndice deprecado).

### Criterios no funcionales

- **CNF-01 â€” Tokens:** cada skill de Story carga â‰¤ 40 lÃ­neas de cuerpo de DoD, sin contar el frontmatter (vs. ~140 lÃ­neas del monolÃ­tico).
- **CNF-02 â€” Idempotencia:** `memory-system migrate --from=dod-monolithic` puede ejecutarse N veces sin efectos adversos.
- **CNF-03 â€” Trazabilidad:** el CHANGELOG documenta la divisiÃ³n como `Changed` y el monolÃ­tico como `Deprecated`.
- **CNF-04 â€” Compatibilidad:** la divisiÃ³n se introduce en una versiÃ³n minor; el monolÃ­tico se elimina en la siguiente major.
- **CNF-05 â€” DocumentaciÃ³n:** actualizar `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md` y `README.md` con la nueva estructura.
- **CNF-06 â€” ConvenciÃ³n de guion:** ASCII U+002D `-` en todos los slugs.
- **CNF-07 â€” Sin dependencias nuevas:** la migraciÃ³n usa solo mÃ³dulos nativos de Node y `node --test`.

---

## ðŸš« Fuera de alcance

- Cambios en los guardrails `gr-*-checklist.md` (AI security, code security, skill creation). Solo se referencian, no se modifican.
- DivisiÃ³n de DoD de Epic o Project. Se abordarÃ¡ en historias posteriores si aplica.
- TraducciÃ³n a otros idiomas.
- Interfaz de UI para navegar los DoD.
- Cambios en el motor de estados (`domain-state-management`, `domain-story-lifecycle`). El DoD es un guardrail de transiciÃ³n; no cambia la mÃ¡quina de estados.
- Skill asociado a la etapa `deliver` (todavÃ­a no implementado).
---

## Notas / contexto adicional

### Contexto

El DoD de Story vive actualmente en un Ãºnico archivo monolÃ­tico `docs/guardrails/dod-story-checklist.md` (~140 lÃ­neas) que contiene las siete etapas del pipeline en secciones. Cada skill de Story lo carga completo para leer solo su secciÃ³n.

Problemas identificados:

- **Ineficiencia de tokens:** cada skill carga las 7 etapas para usar 1.
- **ViolaciÃ³n de SRP:** un artefacto con 7 responsabilidades.
- **Conflictos de merge** entre colaboradores que editan etapas distintas.
- **`enforcement: error` a nivel archivo** cuando cada etapa podrÃ­a tener uno distinto.
- **Orden inconsistente:** `VERIFY` y `ACCEPTANCE` aparecen antes de `CODE-REVIEW`, contradiciendo el pipeline canÃ³nico.
- **Mezcla de tipos:** el checklist de release (despliegue a producciÃ³n) convive con el DoD de transiciones del pipeline.

Origen: discusiÃ³n de arquitectura del sistema de memoria y revisiÃ³n del modelo de guardrails.

Nota sobre deliver:
- El checklist de despliegue (antes "release") se mueve a `dod-story-deliver.md`.
- Es un guardrail de tipo `content` con `applies-to: deliver`; no declara `from`/`to` porque no protege una transiciÃ³n de la historia.
- NingÃºn otro archivo `dod-story-<stage>.md` debe contener criterios de despliegue en producciÃ³n.
- TodavÃ­a no se ha implementado el skill asociado a la etapa `deliver`.

Nota sobre `from`/`to`: un DoD es la condiciÃ³n para **cerrar** su etapa, asÃ­ que protege la transiciÃ³n
`<ETAPA>/IN-PROGRESS` â†’ `<ETAPA>/DONE` (p. ej. `dod-story-specify.md`: `from: SPECIFY/IN-PROGRESS`,
`to: SPECIFY/DONE`, verificado por `story-specify` antes de escribir `SPECIFY/DONE`). El orden entre
etapas lo fija la tabla de etapas del motor, no el campo `from`.

### Notas / mapa de implementaciÃ³n

| Archivo | Cambio |
|---------|--------|
| `docs/guardrails/dod-story-specify.md` | Nuevo (migrado de la secciÃ³n SPECIFY). |
| `docs/guardrails/dod-story-plan.md` | Nuevo (migrado de PLAN). |
| `docs/guardrails/dod-story-implement.md` | Nuevo (migrado de IMPLEMENT). |
| `docs/guardrails/dod-story-code-review.md` | Nuevo (migrado de CODE-REVIEW). |
| `docs/guardrails/dod-story-verify.md` | Nuevo (migrado de VERIFY). |
| `docs/guardrails/dod-story-acceptance.md` | Nuevo (migrado de ACCEPTANCE). |
| `docs/guardrails/dod-story-deliver.md` | Nuevo (migrado de "Criterios de Despliegue en ProducciÃ³n"). |
| `docs/guardrails/dod-story-checklist.md` | Reemplazar contenido por Ã­ndice deprecado. |
| `sddf.config.yaml` | AÃ±adir secciÃ³n `guardrails.dod.story`. |
| `skills/story-{specify,plan,design,analyze,implement,implement-tasks,code-review,verify,acceptance}/SKILL.md` | AÃ±adir secciÃ³n "## DoD aplicable" con ruta explÃ­cita (fuente Ãºnica `skills/`; `.claude/skills/` se regenera con `agile-sddf install`). |
| `skills/memory-system/SKILL.md` y `scripts/dod-story.js` | AÃ±adir modo `migrate --from=dod-monolithic`; extender `check`. |
| `skills/project-policies-generation/`, `skills/sddf-init/` | Generar el DoD por etapa y el mapeo en los proyectos consumidores. |
| `docs/architecture/memory-system.md` | Actualizar la tabla de guardrails con la nueva estructura. |
| `docs/guides/sddf-commands-pipeline.md` | Documentar la referencia por skill y el mapeo en config. |
| `README.md` | Mencionar DoD por etapa. |
| `CHANGELOG.md` | Entrada `[Unreleased]` â†’ `Changed` (dividido) y `Deprecated` (monolÃ­tico). |

---

## âœ”ï¸ VerificaciÃ³n

1. Existen los 8 archivos `dod-story-*.md` en `docs/guardrails/` (6 etapas, `deliver` e Ã­ndice deprecado), cada uno con frontmatter vÃ¡lido (`type`, `kind`, `enforcement`, `applies-to` y, en las etapas, `from`/`to`).
2. `grep -rn "dod-story-checklist" skills/*/SKILL.md` solo aparece en `memory-system` (el migrador); ninguna referencia activa.
3. `grep -ln "## DoD aplicable" skills/story-*/SKILL.md` devuelve los 9 skills de AC-2, cada uno con su archivo.
4. `sddf.config.yaml` contiene la secciÃ³n `guardrails.dod.story` con las 7 entradas.
5. `memory-system check --skills-dir skills` no reporta problemas `dod-guardrail` ni problemas nuevos en las demÃ¡s familias respecto a la deuda previa declarada en STORY-100.
6. `memory-system migrate --from=dod-monolithic --dry-run` reporta "0 cambios pendientes" tras la migraciÃ³n.
7. Ejecutar `/story-implement` en un cambio de prueba carga solo `dod-story-implement.md` (verificable por logs de contexto).
8. Un proyecto consumidor puede sobrescribir el mapeo en su `sddf.config.yaml` sin tocar los skills.
9. El orden `CODE-REVIEW â†’ VERIFY` se respeta en el pipeline resultante (verificar con `/story-*` en secuencia).
10. `CHANGELOG.md` documenta la divisiÃ³n y la deprecaciÃ³n con fecha de eliminaciÃ³n.

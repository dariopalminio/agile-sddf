---
type: adr
id: ADR-0012
slug: escritor-en-templates-de-autoria-manual
title: "Los templates de autoría manual anotan `escritor: autoría manual` en línea completa"
status: PROPOSED
date: 2026-09-22
supersedes: null
superseded-by: null
---

<!-- Referencias -->
[[constitution]]
[[centralizar-templates-compartidos]]
[[templates-como-capa-propia]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[memory-system]]

# ADR-0012: Los templates de autoría manual anotan `escritor: autoría manual` en línea completa

## Contexto y problema

El principio 13 de la constitución exige que **ningún template de `$SPECS_BASE/templates/` declare un campo sin anotar junto a él qué skill lo escribe**, y ofrece dos remedios cuando el escritor no existe: retirar el campo, o anotarlo con el skill que pasará a escribirlo en la misma historia.

La STORY-096 introduce el scaffolding de la capa `templates/`, que distribuye seis plantillas a todo proyecto scaffoldeado. Cinco se copian en tiempo de ejecución desde su skill dueño (ADR-0001) y ya llevan anotaciones `escritor:`. La sexta, `adr-template.md`, es distinta en dos aspectos:

1. **Ningún skill escribe ADRs.** Los ADRs de este repositorio son documentos de autoría humana. Ninguno de los dos remedios de la constitución encaja: retirar los campos vaciaría la plantilla, y no hay ningún skill que «pase a escribirlos» ni en esta historia ni en el backlog.
2. **Vivía fuera del alcance del principio.** `docs/adr/adr-template.md` está en la capa `adr/`, no en `templates/`, así que nunca tuvo que declarar escritores. Es el scaffolding de la STORY-096 el que la coloca en `templates/` y, con ello, bajo el principio 13.

La `code-review` de la STORY-096 registró la omisión como hallazgo bloqueante (MEDIUM): la plantilla se replica en cada proyecto scaffoldeado, de modo que la desviación se propaga más allá de este repositorio.

Existe además una restricción técnica. La constitución describe la anotación como «comentario inline», y `story-template.md` la aplica al final de la línea del campo. El parser de frontmatter de `memory-system` (`parseFrontmatter`, `skills/memory-system/scripts/memory-system.js:237`) **no reconoce comentarios finales de línea**: `title: "<Título>"   # escritor: X` produce el valor literal `"<Título>"   # escritor: X`, con las comillas sin desescapar, porque `unquote` solo actúa cuando el valor empieza y termina por comilla.

La capa `templates/` está excluida del índice (`references/memory-rules.md` §2, "sus wikilinks son placeholders"), así que la copia scaffoldeada no se indexa. Pero **`docs/adr/adr-template.md` sí se indexa**, porque vive en la capa `adr/`: aparece hoy en `docs/index.md` como `- [adr-template.md](adr/adr-template.md) — <Título de la decisión> ⚠️ slug placeholder`. Y como ADR-0012 exige mantener ambas copias byte a byte idénticas, la forma de anotación debe ser segura para la copia indexada. Con anotación inline, esa línea del índice pasaría a mostrar el título con sus comillas y el comentario pegado. `story-template.md` no sufre este problema porque vive en los assets de un skill, fuera de `SPECS_BASE`.

## Decisión

Un template cuyos campos no escribe ningún skill **satisface el principio 13 anotando `escritor: autoría manual`**, en lugar de retirar el campo. La anotación se escribe:

- **en el frontmatter, como comentario de línea completa inmediatamente encima del campo** (`# escritor: …`), no al final de su línea;
- **en el cuerpo, como comentario HTML** al inicio de cada sección, igual que el resto de templates.

`adr-template.md` es el primer template bajo esta regla, en sus dos copias sincronizadas: la semilla `skills/memory-system/assets/scaffold/templates/adr-template.md` y el original del framework `docs/adr/adr-template.md`.

## Rationale

- **Cumple el propósito del principio 13.** Lo que el principio previene es el campo huérfano que nadie rellena. `escritor: autoría manual` responde la misma pregunta que `escritor: story-creation`: quién es responsable de ese campo. Un lector del template ya no tiene que deducirlo.
- **Retirar los campos no era viable.** Es el otro remedio que ofrece la constitución, pero `type`, `id`, `slug`, `title`, `status` y `date` son el esquema canónico de un ADR; sin ellos la plantilla no sirve y los ADRs dejarían de ser indexables.
- **El comentario de línea completa es la única forma segura.** Es la que el parser ya ignora (`line.trim().startsWith('#') → continue`), verificada contra `docs/adr/adr-template.md`: los ocho campos se parsean con exactamente los mismos valores que antes de anotar. La forma inline habría roto el título en el índice de todo proyecto scaffoldeado.
- **Mantiene las dos copias byte a byte idénticas**, cerrando de paso el riesgo de deriva entre la semilla y el original del framework que la propia `code-review` señaló como hallazgo LOW.

## Alternativas consideradas

- **Anotar `escritor:` con un skill futuro (`adr-creation`):** descartada porque ese skill no existe ni está en el backlog. La constitución exige que el skill anotado pase a escribir el campo *en la misma historia*; anotar un skill inexistente sería una promesa vacía y dejaría el template mintiendo sobre su propio contrato.
- **Registrar una exención de `adr-template.md` en `memory-rules.md` sin tocar el template:** descartada porque deja el template sin anotación alguna. La regla viviría lejos del archivo que la necesita, y ningún proyecto scaffoldeado recibiría `memory-rules.md` — solo la plantilla, otra vez sin escritores declarados.
- **Excluir `adr-template.md` de las seis plantillas distribuidas:** descartada porque el requerimiento «seis plantillas base» es explícito en la STORY-096 y `adr-template.md` es la única sin skill dueño del que copiarla en runtime; sacarla dejaría la capa `adr/` scaffoldeada sin plantilla.
- **Anotación inline como en `story-template.md`:** descartada por la restricción del parser descrita arriba — contaminaría `title` en el índice de cada proyecto scaffoldeado.

## Consecuencias

**Positivas:**
- `adr-template.md` cumple el principio 13 sin perder campos y sin inventar un escritor.
- La regla es general: cualquier template futuro de autoría humana tiene una forma declarada de cumplir el principio.
- Las dos copias de la plantilla quedan sincronizadas byte a byte, reduciendo el riesgo de deriva.
- Los valores de frontmatter que lee el índice no cambian, así que ningún índice ya generado se ve afectado.

**Negativas / trade-offs:**
- Coexisten dos estilos de anotación `escritor:` en el repositorio: inline en los templates de skills (no indexados) y de línea completa en los templates indexados. La diferencia está documentada aquí y en el propio encabezado de `adr-template.md`, pero es una inconsistencia visible.
- La constitución describe la anotación como «comentario inline»; este ADR introduce una excepción a esa forma —no al principio— que convendría reflejar en el texto del principio 13 cuando se revise.
- `escritor: autoría manual` no es verificable automáticamente por un guardrail que busque nombres de skills instalados.

## Referencias

- [[constitution]] — principio 13
- [[centralizar-templates-compartidos]] — un dueño por template
- [[templates-como-capa-propia]] — `templates/` como capa de memoria
- [[STORY-096-memory-system-scaffold-ensure-rebuild]] — historia que distribuye la plantilla
- [[memory-system]] — §5 de `references/memory-rules.md`

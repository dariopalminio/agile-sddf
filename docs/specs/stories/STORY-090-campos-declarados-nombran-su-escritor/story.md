---
alwaysApply: false
type: story
kind: chore
id: STORY-090
slug: STORY-090-campos-declarados-nombran-su-escritor
title: "Todo campo declarado en un template nombra a su escritor"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-10
updated: 2026-09-11
related:
  - EPIC-19-framework-consistency
  - STORY-089-story-fix-post-code-review
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]

# 📖 Historia: Todo campo declarado en un template nombra a su escritor

**Como** mantenedor del framework SDDF que audita la coherencia entre templates y skills
**Quiero** que ningún template declare un campo sin anotar qué skill lo escribe, empezando por retirar el campo FINVEST de `story.md` que hoy nadie lee
**Para** detectar los campos huérfanos leyendo el template, en vez de descubrirlos auditando las 78 historias del repositorio

## ✅ Criterios de aceptación

### Escenario principal – El campo sin lectores desaparece y los consumidores reales siguen funcionando
```gherkin
Dado que las líneas "FINVEST Score" y "FINVEST Decisión" del cuerpo de story-template.md tienen tres skills que las escriben y ningún skill que las lea
Cuando se retiran del template canónico, de su copia seed y de las historias existentes que las contienen
Entonces story-improve y story-split siguen obteniendo score y decisión desde el frontmatter de finvest-evaluation-report.md
  Y ninguna ejecución de story-creation, epic-generate-stories ni epic-generate-all-stories vuelve a escribir el campo
  Y la equivalencia entre SPECIFY/DONE y decisión APROBADA queda documentada como la señal de un vistazo que sustituye al campo retirado
```

### Escenario alternativo – Historia cuyo único ejemplar del dato vive en el campo retirado
```gherkin
Dado una historia que contiene un score real en el cuerpo
  Y que no tiene finvest-evaluation-report.md en su directorio
Cuando la migración procesa esa historia
Entonces se detiene sobre ella y la reporta como caso que requiere decisión explícita
  Y no elimina la línea hasta que el dato esté preservado o su pérdida haya sido aceptada
  Pero continúa migrando el resto de las historias sin bloquearse
```

### Escenario de error – Campo declarado para el que ningún skill escribe un valor
```gherkin
Dado un campo declarado en alguno de los cinco templates de $SPECS_BASE/specs/templates/ para el que ningún skill del framework escribe un valor
Cuando se aplica el nuevo principio de la constitución sobre ese template
Entonces el campo queda retirado del template, o anotado con el skill que pasará a escribirlo
  Y ningún template de $SPECS_BASE/specs/templates/ conserva un campo declarado sin anotación de escritor
  Pero los campos cuyo escritor ya existe se conservan sin cambios en su declaración
```

### Requerimiento: Nuevo principio en la constitución
Agregar a `docs/policies/constitution.md` el principio **"Todo campo declarado nombra a su escritor"**: ningún template puede declarar un campo sin anotar qué skill lo escribe. Sigue el formato de los principios numerados existentes; su número se asigna al escribirlo, según cuántos haya en ese momento.

### Requerimiento: Anotación de dueño en los templates existentes
Los cinco templates de `$SPECS_BASE/specs/templates/` deben quedar anotados con el skill responsable de cada campo declarado. La anotación debe ser legible sin ejecutar nada y vivir junto al campo que describe; su forma concreta (comentario en el propio template, tabla de propiedad, u otra) se decide en `/story-design`.

## ⚙️ Criterios no funcionales

* Sin pérdida de datos: ningún valor real puede desaparecer sin que exista otra copia o una decisión explícita registrada
* Idempotencia: reejecutar la migración sobre historias ya migradas no produce cambios ni errores
* Reversibilidad: el cambio masivo debe poder revertirse desde el control de versiones como un commit aislado, sin mezclarse con otras ediciones

## 📎 Notas / contexto adicional

**Origen.** Auditoría derivada de [[STORY-089-rechazo-nombra-ejecutor-correcciones]]. El campo FINVEST del cuerpo de `story.md` no lo rellena nadie porque el skill que conoce el valor (`story-evaluation`) tiene prohibido tocar el cuerpo del archivo, y los tres skills que sí escriben el campo lo hacen al crear la historia, cuando el valor todavía no existe.

**Evidencia medida sobre el repositorio.** De 78 historias, 37 contienen la línea y solo una tiene un número real. Las otras 36 se reparten en **diez grafías distintas de "vacío"** —desde `—` y `pendiente` hasta el placeholder crudo `[FINVEST Score]` sin sustituir y una frase completa de prosa—, que es la firma de un campo cuya escritura ninguna instrucción define.

**Por qué se retira en vez de reasignarse.** El registro canónico ya existe, es machine-readable y tiene consumidores: el frontmatter de `finvest-evaluation-report.md`, que `story-improve` y `story-split` ya leen. La copia en `story.md` no tiene lectores y sí envejece: una historia refinada tras su evaluación deja el número desactualizado. Se descartó moverlo al frontmatter porque conserva la duplicación y obliga a propagar campos nuevos a `header-aggregation` y a los 78 archivos, por un dato que nadie consulta.

**Decisión abierta para la planificación.** `STORY-067` es la única historia con un score real en el cuerpo y no tiene reporte en su directorio: su valor no existe en ningún otro sitio. Hay que reconstruirle el reporte o aceptar la pérdida de forma explícita. El escenario alternativo obliga a que la migración se detenga en ese caso en vez de resolverlo por su cuenta.

**Cifras reales al implementar (2026-09-10, ver `design.md` › Context y CR-001):** 82 historias, 38 con el bloque; dos casos con dato real sin reporte — `STORY-067` (score 4.33: reporte reconstruido) y `STORY-078` (solo decisión `APROBADA`, redundante con su `status`: pérdida aceptada con nota).

**Fuera de alcance:** validación automatizada del nuevo principio (un script o eval que falle ante un campo sin anotación). Esta historia lo establece como regla legible y anota los templates; el escenario de error se verifica leyendo los cinco templates, sin necesidad de ese script. Automatizar la verificación es una historia hermana, coherente con el principio §3 de la constitución de "obligar a demostrar, no declarar".

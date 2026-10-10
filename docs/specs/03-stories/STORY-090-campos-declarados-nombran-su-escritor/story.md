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

# ðŸ“– Historia: Todo campo declarado en un template nombra a su escritor

**Como** mantenedor del framework SDDF que audita la coherencia entre templates y skills
**Quiero** que ningÃºn template declare un campo sin anotar quÃ© skill lo escribe, empezando por retirar el campo FINVEST de `story.md` que hoy nadie lee
**Para** detectar los campos huÃ©rfanos leyendo el template, en vez de descubrirlos auditando las 78 historias del repositorio

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ El campo sin lectores desaparece y los consumidores reales siguen funcionando
```gherkin
Dado que las lÃ­neas "FINVEST Score" y "FINVEST DecisiÃ³n" del cuerpo de story-template.md tienen tres skills que las escriben y ningÃºn skill que las lea
Cuando se retiran del template canÃ³nico, de su copia seed y de las historias existentes que las contienen
Entonces story-improve y story-split siguen obteniendo score y decisiÃ³n desde el frontmatter de finvest-evaluation-report.md
  Y ninguna ejecuciÃ³n de story-creation, epic-generate-stories ni epic-generate-all-stories vuelve a escribir el campo
  Y la equivalencia entre SPECIFY/DONE y decisiÃ³n APROBADA queda documentada como la seÃ±al de un vistazo que sustituye al campo retirado
```

### Escenario alternativo â€“ Historia cuyo Ãºnico ejemplar del dato vive en el campo retirado
```gherkin
Dado una historia que contiene un score real en el cuerpo
  Y que no tiene finvest-evaluation-report.md en su directorio
Cuando la migraciÃ³n procesa esa historia
Entonces se detiene sobre ella y la reporta como caso que requiere decisiÃ³n explÃ­cita
  Y no elimina la lÃ­nea hasta que el dato estÃ© preservado o su pÃ©rdida haya sido aceptada
  Pero continÃºa migrando el resto de las historias sin bloquearse
```

### Escenario de error â€“ Campo declarado para el que ningÃºn skill escribe un valor
```gherkin
Dado un campo declarado en alguno de los cinco templates de $SPECS_BASE/specs/templates/ para el que ningÃºn skill del framework escribe un valor
Cuando se aplica el nuevo principio de la constituciÃ³n sobre ese template
Entonces el campo queda retirado del template, o anotado con el skill que pasarÃ¡ a escribirlo
  Y ningÃºn template de $SPECS_BASE/specs/templates/ conserva un campo declarado sin anotaciÃ³n de escritor
  Pero los campos cuyo escritor ya existe se conservan sin cambios en su declaraciÃ³n
```

### Requerimiento: Nuevo principio en la constituciÃ³n
Agregar a `docs/policies/constitution.md` el principio **"Todo campo declarado nombra a su escritor"**: ningÃºn template puede declarar un campo sin anotar quÃ© skill lo escribe. Sigue el formato de los principios numerados existentes; su nÃºmero se asigna al escribirlo, segÃºn cuÃ¡ntos haya en ese momento.

### Requerimiento: AnotaciÃ³n de dueÃ±o en los templates existentes
Los cinco templates de `$SPECS_BASE/specs/templates/` deben quedar anotados con el skill responsable de cada campo declarado. La anotaciÃ³n debe ser legible sin ejecutar nada y vivir junto al campo que describe; su forma concreta (comentario en el propio template, tabla de propiedad, u otra) se decide en `/story-design`.

## âš™ï¸ Criterios no funcionales

* Sin pÃ©rdida de datos: ningÃºn valor real puede desaparecer sin que exista otra copia o una decisiÃ³n explÃ­cita registrada
* Idempotencia: reejecutar la migraciÃ³n sobre historias ya migradas no produce cambios ni errores
* Reversibilidad: el cambio masivo debe poder revertirse desde el control de versiones como un commit aislado, sin mezclarse con otras ediciones

## ðŸ“Ž Notas / contexto adicional

**Origen.** AuditorÃ­a derivada de [[STORY-089-rechazo-nombra-ejecutor-correcciones]]. El campo FINVEST del cuerpo de `story.md` no lo rellena nadie porque el skill que conoce el valor (`story-evaluation`) tiene prohibido tocar el cuerpo del archivo, y los tres skills que sÃ­ escriben el campo lo hacen al crear la historia, cuando el valor todavÃ­a no existe.

**Evidencia medida sobre el repositorio.** De 78 historias, 37 contienen la lÃ­nea y solo una tiene un nÃºmero real. Las otras 36 se reparten en **diez grafÃ­as distintas de "vacÃ­o"** â€”desde `â€”` y `pendiente` hasta el placeholder crudo `[FINVEST Score]` sin sustituir y una frase completa de prosaâ€”, que es la firma de un campo cuya escritura ninguna instrucciÃ³n define.

**Por quÃ© se retira en vez de reasignarse.** El registro canÃ³nico ya existe, es machine-readable y tiene consumidores: el frontmatter de `finvest-evaluation-report.md`, que `story-improve` y `story-split` ya leen. La copia en `story.md` no tiene lectores y sÃ­ envejece: una historia refinada tras su evaluaciÃ³n deja el nÃºmero desactualizado. Se descartÃ³ moverlo al frontmatter porque conserva la duplicaciÃ³n y obliga a propagar campos nuevos a `header-aggregation` y a los 78 archivos, por un dato que nadie consulta.

**DecisiÃ³n abierta para la planificaciÃ³n.** `STORY-067` es la Ãºnica historia con un score real en el cuerpo y no tiene reporte en su directorio: su valor no existe en ningÃºn otro sitio. Hay que reconstruirle el reporte o aceptar la pÃ©rdida de forma explÃ­cita. El escenario alternativo obliga a que la migraciÃ³n se detenga en ese caso en vez de resolverlo por su cuenta.

**Cifras reales al implementar (2026-09-10, ver `design.md` â€º Context y CR-001):** 82 historias, 38 con el bloque; dos casos con dato real sin reporte â€” `STORY-067` (score 4.33: reporte reconstruido) y `STORY-078` (solo decisiÃ³n `APROBADA`, redundante con su `status`: pÃ©rdida aceptada con nota).

**Fuera de alcance:** validaciÃ³n automatizada del nuevo principio (un script o eval que falle ante un campo sin anotaciÃ³n). Esta historia lo establece como regla legible y anota los templates; el escenario de error se verifica leyendo los cinco templates, sin necesidad de ese script. Automatizar la verificaciÃ³n es una historia hermana, coherente con el principio Â§3 de la constituciÃ³n de "obligar a demostrar, no declarar".

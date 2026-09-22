---
# Ningún skill escribe ADRs: todos los campos son de autoría manual (ADR-0012).
# Las anotaciones `escritor:` van en línea completa y no al final de la línea del campo:
# el parser de frontmatter de memory-system ignora las líneas que empiezan por `#`, pero
# incorporaría un comentario final de línea al valor, contaminando `title` en el índice.
# escritor: autoría manual (valor fijo)
type: adr
# escritor: autoría manual — número correlativo siguiente en `adr/`
id: ADR-NNNN
# escritor: autoría manual — debe coincidir con el nombre del archivo sin extensión
slug: <slug-kebab>
# escritor: autoría manual — primer `#` del documento
title: "<Título de la decisión>"
# escritor: autoría manual — PROPOSED al crear; ACCEPTED, REJECTED o SUPERSEDED al resolver
status: PROPOSED
# escritor: autoría manual — fecha de la decisión
date: <YYYY-MM-DD>
# escritor: autoría manual — id del ADR que esta decisión reemplaza, o null
supersedes: null
# escritor: autoría manual — id del ADR que reemplaza a esta decisión, o null
superseded-by: null
---

# ADR-NNNN: <Título de la decisión>

## Contexto y problema

<!-- escritor: autoría manual -->
<!-- Qué situación o necesidad motiva la decisión. Qué problema hay que resolver.
     Incluir referencias a EPICs, historias o hallazgos que la originaron. -->

[Por completar]

## Decisión

<!-- escritor: autoría manual -->
<!-- La decisión tomada, en una o dos frases afirmativas.
     Ej: "Los templates compartidos por varios skills viven en X y se resuelven con el orden Y." -->

[Por completar]

## Rationale

<!-- escritor: autoría manual -->
<!-- Por qué esta opción y no otra. Qué principios del proyecto satisface
     (constitución, KISS, repositorio-como-sistema, etc.). -->

[Por completar]

## Alternativas consideradas

<!-- escritor: autoría manual -->
<!-- Cada alternativa con su motivo de descarte. Una decisión sin alternativas
     descartadas probablemente no necesita un ADR. -->

- **[Alternativa 1]:** [descripción] — descartada porque [motivo]
- **[Alternativa 2]:** [descripción] — descartada porque [motivo]

## Consecuencias

<!-- escritor: autoría manual -->

**Positivas:**
- [Por completar]

**Negativas / trade-offs:**
- [Por completar]

## Referencias

<!-- escritor: autoría manual -->
<!-- Wikilinks a specs, historias, releases o documentos relacionados. -->

- [[slug-relacionado]]

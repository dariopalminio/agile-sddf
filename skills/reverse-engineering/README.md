# reverse-engineering

## What it does

Analiza un repositorio existente con cuatro especialistas y sintetiza perfiles de usuario y requisitos individuales en las capas de producto y requisitos.

## Produces

- `$SPECS_BASE/product/stakeholders.md`.
- Un archivo por requisito en `$SPECS_BASE/requirements/functional/` y `$SPECS_BASE/requirements/non-functional/`.
- `.tmp/reverse-engineering/gaps.md` con incertidumbres y preguntas de revisión.

## Update mode

`--update` conserva los requisitos ya revisados. Solo propone modificar los que contienen `PENDING MANUAL REVIEW`; cada modificación requiere confirmación individual.

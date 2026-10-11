# project-discovery

## What it does

Descubre perfiles, necesidades y requisitos desde una visión de producto terminada. Propone el resultado en staging y lo materializa solo tras la confirmación del usuario.

## Inputs

- `$SPECS_BASE/product/vision.md` con `substatus: DONE`.
- `stakeholders-template.md` y `requirement-template.md`, centralizados o incluidos como seed.
- Inventario opcional de requisitos y stakeholders ya existentes.

## Produces

- `$SPECS_BASE/product/stakeholders.md`.
- `$SPECS_BASE/requirements/functional/FR-NNN-<slug>.md`.
- `$SPECS_BASE/requirements/non-functional/NFR-NNN-<slug>.md`.

No escribe en las capas finales hasta que el usuario elige `Confirmar`.

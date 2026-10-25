# project-discovery

## What it does

Descubre perfiles, necesidades y requisitos desde una visión de producto terminada. Propone el resultado en staging y lo materializa solo tras la confirmación del usuario.

## Inputs

- `docs/product/vision.md` con `substatus: DONE`.
- `stakeholders-template.md` y `requirement-template.md`, centralizados o incluidos como seed.
- Inventario opcional de requisitos y stakeholders ya existentes.

## Produces

- `docs/product/stakeholders.md`.
- `docs/requirements/functional/FR-NNN-<slug>.md`.
- `docs/requirements/non-functional/NFR-NNN-<slug>.md`.

No escribe en las capas finales hasta que el usuario elige `Confirmar`.

## Convención de nomenclatura de templates

Los archivos de plantilla usan el sufijo `-template.md`:

- `story-template.md`
- `vision-template.md`
- `epic-template.md`
- `srs-template.md`

Esta convención aplica tanto a `*/templates/<name>-template.md` como a `*/SKILL/<skill>/assets/<name>-template.md`.

Excepción: `README.md` en la carpeta de templates no lleva sufijo (es documentación, no plantilla).

Las once plantillas base incluyen cinco de autoría manual: `adr-template.md`,
`domain-template.md`, `guardrail-template.md`, `policy-template.md` y `srs-template.md`.

## Plantillas con copia semilla en los skills

[`fix-directives-template.md`](fix-directives-template.md) es la plantilla común de `fix-directives.md`, la señal de
rework que escriben `story-code-review`, `story-verify` y `story-acceptance` con veredicto `NEEDS-CHANGES`
([ADR-0022](../adr/ADR-0022-workflows-sin-estados-buffer.md)). `based-on` toma el valor del reporte del gate que la
instancia: `code-review-report.md`, `verify-report.md` o `acceptance-report.md`.

Cada uno de esos tres skills lleva en `assets/fix-directives-template.md` una copia semilla idéntica, que usa si falta
la plantilla central. `test/fix-directives-template.test.js` comprueba que las tres semillas son iguales byte a byte a
la central: si la personalizas en este repositorio, actualiza también las semillas.

---

Esta capa es hermana de `specs/`, no un subdirectorio suyo: los templates son meta-artefactos que
definen la estructura de otros artefactos, no especificaciones de work items. Ver
[ADR-0007](../adr/ADR-0007-templates-como-capa-propia.md).

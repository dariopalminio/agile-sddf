---
type: adr
id: ADR-0018
slug: adoptar-cucumber-para-specs-living
title: "Adoptar Cucumber (Gherkin en archivos .feature) para specs/living/"
status: PROPOSED
date: 2026-10-28
supersedes: null
superseded-by: null
---

# ADR-0018: Adoptar Cucumber (Gherkin en archivos .feature) para specs/living/

## Contexto y problema

[ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) separa `specs/` en dos raíces con semánticas
distintas:

- `specs/flow/` contiene las **specs de cambio**: épicas e historias que describen qué se va a construir. Cuando una
  historia se completa, se archiva.
- `specs/living/` está reservado para las **specs de estado**: cómo se comporta hoy el sistema. No tiene formato ni
  estructura definidos.

Las historias ya expresan sus criterios de aceptación en Gherkin en español (`Dado`/`Cuando`/`Entonces`, ver
`docs/templates/story-template.md`), pero esos escenarios quedan dentro de cada `story.md` y se dispersan por
`specs/flow/archive/`. Para saber cómo se comporta hoy una capacidad hay que reconstruirlo a partir de varias historias
archivadas, algunas contradictorias entre sí.

La pregunta que motiva este ADR es: **¿qué formato y qué estructura de archivos usa `specs/living/` para describir el
comportamiento vigente del sistema?**

Origen: la épica de Living Spec, ya anticipada por ADR-0017, y la separación entre spec de cambio y spec de estado
planteada en [ADR-0011](ADR-0011-archivos-canonicos-por-tipo.md).

## Decisión

El comportamiento vigente del sistema se especifica en **Gherkin, en archivos `.feature` ejecutables por Cucumber**,
dentro de `specs/living/features/`, agrupados por dominio:

```
specs/living/features/
├── pagos/
│   ├── checkout.feature
│   ├── checkout.md
│   ├── reembolsos.feature
│   └── calculo-impuestos.feature
├── autenticacion/
│   ├── login.feature
│   └── recuperacion-password.feature
└── catalogo/
    └── busqueda.feature
```

Reglas:

1. **Un `Feature` por archivo.** Es una restricción del propio Gherkin: un archivo `.feature` solo admite un `Feature`.
2. **Kebab-case** para los directorios de dominio y los nombres de archivo (`calculo-impuestos.feature`), sin tildes ni
   `ñ`.
3. **Gherkin en español:** cada `.feature` empieza con `# language: es`, igual que los criterios de aceptación de
   `story.md`, para que un escenario pase de una historia a la spec viva sin traducirse.
4. **`.md` de contexto opcional, con el mismo nombre base.** Cuando el contexto, las reglas de negocio o el glosario
   de una feature no caben en la descripción libre del `Feature`, se escriben en un `.md` hermano con el mismo nombre
   base (`checkout.feature` + `checkout.md`). El `.md` no contiene escenarios: el comportamiento se especifica solo en
   el `.feature`.
5. **Organización por dominio, no por historia.** Una feature describe una capacidad del sistema, no el cambio que la
   introdujo. Varias historias pueden modificar el mismo `.feature` a lo largo del tiempo.

Cucumber es el runner previsto: cada `.feature` debe poder ejecutarse con la implementación de Cucumber del stack del
proyecto (por ejemplo `@cucumber/cucumber` en Node.js). Las *step definitions* son código del proyecto, no de SDDF, y
SDDF no exige que existan para que una feature sea válida como spec viva.

## Rationale

1. **Spec ejecutable frente a spec descriptiva.** Un `.feature` puede verificarse contra el sistema; un `.md` no. Si la
   spec viva se ejecuta, deja de describir el comportamiento del sistema el mismo día en que deja de pasar, y eso se
   detecta. Es la forma más directa de evitar que la documentación viva se desincronice.
2. **Continuidad con `specs/flow/`.** Las historias ya escriben sus criterios de aceptación en Gherkin. Usar el mismo
   lenguaje y el mismo idioma en `specs/living/` hace que consolidar los escenarios de una historia completada sea
   copiar y ajustar, no reescribir.
3. **Formato estándar con tooling existente.** `.feature` es la extensión de Gherkin que reconocen Cucumber, los
   editores y los formatters. SDDF no inventa un formato propio.
4. **Emparejamiento sin ambigüedad.** El mismo nombre base y el mismo directorio permiten descubrir el `.md` de una
   feature, y validar el par, con una regla trivial: cambiar la extensión.
5. **Kebab-case por coherencia con el repositorio.** La referencia de Gherkin no prescribe casing para los nombres de
   archivo. SDDF elige kebab-case porque ya lo usa en todos sus slugs (`EPIC-NN-<slug>`, `STORY-NNN-<slug>`, ADRs,
   skills), y porque evita colisiones en sistemas de archivos que no distinguen mayúsculas, como el de Windows.
6. **El `.md` es opcional para no duplicar.** Gherkin ya admite descripciones libres en Markdown bajo `Feature` y
   `Rule`. Exigir siempre un `.md` crearía archivos vacíos o repetidos; solo se justifica cuando el contexto es extenso.

La decisión respeta los principios de la [constitución](../constitution.md): KISS (un formato estándar y una regla de
nombres) y repositorio como sistema (la spec viva es verificable desde el propio repositorio).

## Alternativas consideradas

- **Un `spec.md` por capacidad (estilo OpenSpec):** descartada. Los escenarios escritos en Markdown no se ejecutan,
  así que la spec viva se desincroniza sin que nadie lo note.
- **Markdown con Gherkin (`.feature.md`):** descartada. El soporte de Cucumber para este formato es experimental y el
  tooling de editores y formatters es mucho menor que para `.feature`.
- **`.feature` con `.md` obligatorio para cada feature:** descartada. Genera archivos sin contenido propio cuando la
  descripción del `Feature` basta.
- **Organizar `specs/living/` por historia (`specs/living/STORY-NNN/`):** descartada. Reproduciría la estructura de
  `specs/flow/`; la spec viva describe capacidades, no cambios.
- **snake_case (como algunos ejemplos de Cucumber) o PascalCase:** descartadas por incoherentes con los slugs del
  repositorio.
- **Gherkin en inglés (idioma por defecto de Cucumber):** descartada. Obligaría a traducir los criterios de aceptación
  de las historias, que se escriben en español.

## Consecuencias

**Positivas:**

- El comportamiento vigente de cada capacidad está en un solo lugar y puede verificarse ejecutándolo.
- Los criterios de aceptación de una historia tienen un destino definido cuando la historia se completa.
- El formato es estándar y funciona con el tooling de Cucumber sin adaptaciones.

**Negativas / trade-offs:**

- Un `.feature` sin *step definitions* es documentación, no una prueba. Hasta que el proyecto implemente los pasos, la
  garantía de sincronización del punto 1 del rationale no existe.
- `memory-system` solo indexa archivos `.md` de `docs/` y `specs/flow/`: hoy no indexa `specs/living/` ni archivos
  `.feature`. Habrá que extender `index` y `check` para incluirlos.
- No existe todavía un validador que compruebe kebab-case, `# language: es` o el emparejamiento `.feature`/`.md`. Hay
  que implementarlo, por ejemplo como regla de `check` o como script en `scripts/`.
- Los requisitos no funcionales encajan mal en escenarios Gherkin. El destino de `docs/requirements/` en
  `specs/living/`, que ADR-0017 anticipa, queda pendiente.

**Fuera del alcance de este ADR** (a resolver en la épica de Living Spec):

- Qué skill consolida los escenarios de una historia completada en `specs/living/features/` y en qué etapa del flujo.
- La trazabilidad entre escenarios vivos e historias (por ejemplo, con tags `@STORY-NNN`).
- La migración de `docs/requirements/` a `specs/living/`.

## Referencias

- [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) — Layout fijo y raíz reservada `specs/living/`
- [ADR-0011](ADR-0011-archivos-canonicos-por-tipo.md) — Nombres de los work items de `specs/flow/`
- [Referencia de Gherkin](https://cucumber.io/docs/gherkin/reference) — Sintaxis, palabras clave e idiomas
- [Feature en la referencia de Gherkin](https://cucumber.io/docs/gherkin/reference#feature)
- [User story en Cucumber](https://cucumber.io/docs/terms/user-story) — Criterios de aceptación escritos en Gherkin
- [[domain-work-item-hierarchy]] — Modelo de work items
- [[memory-system]] — Indexación y validación de la memoria

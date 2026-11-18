---
type: adr
id: ADR-0023
slug: separar-changes-de-specs
title: "Separar los cambios en curso de la especificación viva"
status: PROPOSED
date: 2026-11-17
supersedes: ADR-0019
superseded-by: null
---

# ADR-0023: Separar los cambios en curso de la especificación viva

## Contexto y problema

ADR-0016 introdujo el layout fijo de tres raíces. ADR-0017 y ADR-0019 lo ampliaron para admitir el archivo de
historias y épicas cerradas. Esta propuesta reemplaza ADR-0019, sucesor vigente de ADR-0016, sin alterar la cadena
histórica de reemplazos.

Actualmente, `specs/` reúne dos clases de artefactos con propósitos y ciclos de vida distintos:

- `specs/flow/`: épicas e historias que describen cambios propuestos o en curso, junto con su historial archivado.
- `specs/living/`: espacio destinado a la especificación vigente del sistema.

Esta organización mezcla intención de cambio con fuente de verdad vigente bajo una misma raíz. Consultar una
historia, incluso completada, no equivale a consultar la especificación consolidada del sistema.

Se necesita distinguir explícitamente qué se está cambiando de qué comportamiento está vigente, con una
organización intuitiva para personas y agentes de IA que no dependa de herramientas específicas.

## Decisión

El repositorio adopta cuatro raíces hermanas y fijas: `docs/` para conocimiento, `specs/` para especificación viva,
`changes/` para el flujo de cambios y `workflow/` para proceso.

```text
<REPO_ROOT>/
├── docs/                  conocimiento: product/, requirements/, domains/, architecture/, adr/,
│                          policies/, guardrails/, guides/, runbooks/, templates/, constitution.md, index.md
├── specs/                 especificación viva: fuente de verdad vigente
├── changes/               flow-forward specs: trabajo en curso
│   ├── EPIC-NNN-<slug>/
│   ├── STORY-NNN-<slug>/
│   └── archive/           historias y épicas COMPLETED o CANCELED
│                          <YYYY-MM-DD>-STORY-NNN-<slug>/
│                          <YYYY-MM-DD>-EPIC-NNN-<slug>/
└── workflow/              proceso, reservado
```

### Reglas

1. **Organización agnóstica de herramientas (tool-agnostic).** Las especificaciones vivas, fuente de verdad del
   sistema, deben residir directamente en `specs/` en la raíz del repositorio. Los cambios —intención, planificación
   y trabajo en curso— deben residir en `changes/`, también en la raíz. Estas ubicaciones forman parte del contrato
   de SDDF y no dependen de una herramienta, proveedor, runtime o agente de IA específico. Se favorecen estándares
   agnósticos de herramientas; los nombres de estos directorios son una convención de SDDF, no un estándar formal
   para IA.
2. **Cambios.** `specs/flow/` se reemplaza por `changes/`, incluido su archivo. Épicas e historias siguen siendo
   hermanas, sin contenedores intermedios `epics/` o `stories/`.
3. **Especificación viva.** `specs/` asume directamente el propósito de `specs/living/`. Se elimina el nivel
   intermedio `living/`; el contenido existente, si lo hubiera, se traslada conservando su organización interna.
4. **Responsabilidades.** `changes/` describe la intención, planificación, implementación y evidencia de los
   cambios. Su archivo conserva el historial, pero no sustituye a la especificación viva de `specs/`.
5. **Archivo.** Se conservan las reglas de ADR-0019, con destino `changes/archive/`:
   - Recibe historias y épicas con `status: COMPLETED` o `CANCELED`, siempre con `substatus: DONE`.
   - Conserva el status y el slug; el nombre del directorio solo antepone la fecha.
   - La fecha es el `updated:`; si no es válido, el `created:`; si el frontmatter no tiene ninguna de esas dos
     claves, el `date:`. Un work item sin fecha válida no se archiva.
   - Las historias las archiva `story-complete` y las épicas `epic-complete`, con confirmación humana explícita.
     `epic-complete` escribe `COMPLETED` desde `SHIP/DONE` y archiva sin cambiar el status las épicas que ya están
     en `COMPLETED/DONE` o `CANCELED/DONE`.
   - Los ítems en cualquier otro estado permanecen en `changes/`.
6. **Numeración y resolución.** La numeración consulta los ítems activos en `changes/` y los archivados en
   `changes/archive/`: el siguiente número es el máximo del mismo nivel más uno. Ningún identificador archivado
   se reutiliza. Los skills que trabajan sobre una épica activa solo la resuelven en `changes/EPIC-*/`;
   las épicas archivadas son terminales y no se reabren ni se analizan.
7. **Rutas fijas.** El layout sigue sin ser configurable. Los skills resuelven únicamente `REPO_ROOT`; no se
   reintroducen `SDDF_ROOT`, `SPECS_BASE` ni la clave `root` de `sddf.config.yaml`.
8. **Requisitos.** `docs/requirements/` no se mueve mediante esta decisión. Cualquier migración posterior hacia
   especificaciones vivas tendrá como destino `specs/`, no `specs/living/`.
9. **Alcance.** Esta decisión cambia ubicaciones y responsabilidades de las raíces. No define formatos de
   especificación viva ni automatismos de consolidación desde historias hacia `specs/`.

## Rationale

1. **Separación semántica.** `changes/` expresa qué se quiere cambiar; `specs/`, qué está vigente.
2. **Tool-agnostic y descubrimiento intuitivo.** Evitar dependencias de herramientas específicas favorece la
   interoperabilidad. Dos directorios raíz con responsabilidades explícitas son reconocibles por personas y
   agentes de IA sin exigir conocimiento previo de la estructura interna de SDDF ni de un producto concreto.
3. **Menor profundidad.** Desaparecen los niveles `flow/` y `living/`, redundantes con el propósito de sus nuevas
   raíces.
4. **Continuidad.** Se mantienen identificadores, estados, archivo, confirmaciones humanas y relaciones entre
   work items.
5. **Simplicidad.** Se mantienen rutas fijas, sin resolvers configurables ni dos ubicaciones canónicas para un
   mismo artefacto.

## Alternativas consideradas

- **Mantener `specs/flow/` y `specs/living/`:** descartada porque conserva la mezcla de cambios y especificación
  vigente bajo una misma raíz.
- **Mover solo `specs/flow/`:** descartada porque mantener `specs/living/` añade un nivel redundante cuando
  `specs/` tiene una sola responsabilidad.
- **Adoptar directorios propios de una herramienta o proveedor:** descartada porque acopla el descubrimiento de
  artefactos a ese ecosistema y contradice el objetivo tool-agnostic.
- **Hacer configurables las rutas:** descartada porque reintroduce complejidad de resolución y validación.
- **Archivar únicamente historias completadas:** descartada porque haría retroceder las reglas vigentes de
  archivo de épicas e ítems cancelados.

## Consecuencias

**Positivas:**
- La ubicación distingue especificación vigente de trabajo de cambio.
- La organización es intuitiva para personas y agentes de IA, sin depender de una herramienta específica.
- El historial permanece separado sin perder trazabilidad.
- Las rutas de trabajo y especificación viva son más cortas.

**Negativas / trade-offs:**
- Cambio incompatible de layout: requiere migración explícita y tratamiento como cambio mayor del contrato
  público.
- Deben actualizarse skills fuente, scripts, pruebas, templates, instrucciones, constitución, documentación y
  enlaces afectados.
- Las propuestas ADR-0018 y ADR-0020 deben alinear sus rutas con `specs/` antes de aceptarse, sin que este ADR
  apruebe sus decisiones de formato.
- La migración debe preservar identificadores, metadatos, relaciones y contenidos; ante colisiones debe
  detenerse y notificarlas, sin sobrescribir.
- No se ejecutan migraciones automáticas en proyectos instalados ni se mantienen copias paralelas como fuentes
  de verdad.
- Mientras este ADR permanezca `PROPOSED`, ADR-0019 sigue vigente. Su aceptación requiere registrar el reemplazo
  en ADR-0019 y actualizar el índice; no se reescriben los cuerpos de los ADR aceptados.
- Crear este ADR no implica que la migración ya esté implementada.

## Referencias

- [[layout-fijo-de-tres-raices]] — ADR-0016, origen histórico del layout.
- [[layout-fijo-con-archivo-de-historias-canceladas]] — ADR-0017.
- [[layout-fijo-con-archivo-de-epicas]] — ADR-0019, decisión que esta propuesta reemplaza.
- [[adoptar-cucumber-para-specs-living]] — ADR-0018, propuesta relacionada.
- [[contratos-centralizados-para-spec-living]] — ADR-0020, propuesta relacionada.

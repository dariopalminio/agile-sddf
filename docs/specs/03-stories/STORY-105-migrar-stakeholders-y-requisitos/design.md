---
type: design
id: STORY-105
slug: STORY-105-migrar-stakeholders-y-requisitos-design
title: "Design: Migrar project.md a product/stakeholders.md y requirements/"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-105
created: 2026-10-07
updated: 2026-10-10
related:
  - STORY-105-migrar-stakeholders-y-requisitos
  - eliminar-specs-01-projects
  - stakeholders
  - requirements-index
  - STORY-104-migrar-project-intent-a-vision
  - STORY-118-requirements-srs-unico-primero
---

<!-- Referencias -->
[[STORY-105-migrar-stakeholders-y-requisitos]] · [[eliminar-specs-01-projects]] · [[stakeholders]] · [[requirements-index]] · [[STORY-104-migrar-project-intent-a-vision]] · [[STORY-118-requirements-srs-unico-primero]]

# Diseño técnico: migrar `project.md` a `product/stakeholders.md` y `requirements/`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) asigna los perfiles de usuario de `project.md` a `docs/product/stakeholders.md` y sus
FR/NFR a `docs/requirements/functional/FR-NNN-*.md` y `docs/requirements/non-functional/NFR-NNN-*.md`.

**Origen** (`docs/specs/01-projects/PROJ-01-agile-sddf/project.md`, 1264 líneas), inventariado con un parser de las líneas 161–885:

| Sección | Líneas | Contenido | Forma |
|---|---|---|---|
| `## 1.8. Características de los Usuarios` | 125–159 | US-001…US-006 | `- **US-NNN**: <nombre>` + `    - **Descripción**: …` (continuaciones con 6 espacios) |
| `## 2.1 Requisitos Funcionales` | 163–656 | Nota "Convención de fuente" (blockquote, 165–167) + 9 subsecciones `### 2.1.1`…`### 2.1.9` | 53 ítems (FR-001…FR-054, sin FR-049), **todos** con los campos `Descripción`, `Prioridad`, `Usuario`, `Fuente` |
| `## 2.2. Requisitos No Funcionales` | 658–885 | 10 subsecciones `### 2.2.1`…`### 2.2.10` | 24 ítems (NFR-001…NFR-024), **todos** con `Descripción`, `Prioridad`, `Criterio de aceptación` (sin `Usuario` ni `Fuente`) |

No hay IDs duplicados, ni ítems con líneas fuera del patrón campo/continuación, ni enlaces Markdown dentro de estas secciones.
Los títulos más largos tienen 64 caracteres; tres contienen backticks (FR-052, NFR-006, NFR-014). Los wikilinks que aparecen en
descripciones (`[[slug]]`, `[[state-machine]]`, `[[best-practices-for-skills]]`) están dentro de spans de código: `memory-system`
no los cuenta hoy y seguirán sin contar.

**Destino actual:**

- `docs/product/stakeholders.md`: semilla del scaffold con tres secciones (`Usuarios y roles`, `Patrocinadores y decisores`,
  `Intereses y conflictos`), cada una con un marcador `[Por completar: …]`.
- `docs/requirements/README.md` (`slug: requirements-index`): ya documenta la estrategia "SRS único primero, fragmentación cuando
  duela" y el esquema de archivo fragmentado (`type: requirement`, `kind`, `id`, `slug`, `title`, `status: active`, `created`,
  `updated`, `related`; cuerpo `# FR-NNN — <título>`, `## Criterios de verificación`, `## Verificado por`). Con 77 requisitos y
  ~720 líneas, el umbral (> 15 requisitos o > 500 líneas) exige la disposición **fragmentada**. No existen `functional/` ni
  `non-functional/`.

**Gates afectados:**

- `memory-system check --root docs` exige `type`, `slug`, `title` en todo nodo con frontmatter (`REQUIRED_FIELDS.all`); `id` y
  `status` solo para `project`/`epic`/`story`. Línea base 2026-10-07: 55 problemas, ninguno en `product/` ni `requirements/`.
- `npm run verify:repository` (CI `quality.yml`) ejecuta `scripts/check-doc-links.js`, que valida los wikilinks de `docs/index.md`.
- Una regeneración de prueba de `docs/index.md` sobre una copia del repo emite la entrada
  `[[<nombre-del-directorio-de-la-epica>   # escritor: …]]` y `check-doc-links` falla con `Missing wikilink target`. Causa:
  `docs/specs/03-stories/STORY-103-replace-the-epic-template/epic-template.md` (borrador adjunto de STORY-103) tiene comentarios
  YAML en línea en su frontmatter; el parser de `memory-system` no los elimina, así que `slug` deja de casar con
  `PLACEHOLDER_SLUG = /^<.*>$/` y el archivo se indexa como si fuera un nodo real.

Stack: Markdown versionado; la parte ejecutable se limita a scripts Node desechables en `.tmp/` (no versionados, AGENTS.md).

## Goals / Non-Goals

**Goals:**

- `stakeholders.md › Usuarios y roles` contiene literalmente US-001…US-006; las otras dos secciones conservan su marcador. // satisface: AC-1
- 53 archivos FR y 24 archivos NFR, uno por requisito, con el ID original, contenido literal y su categoría; sin `FR-049-*`. // satisface: AC-2, CNF-1
- `project.md` deja de contener los perfiles y requisitos, sustituidos por enlaces a `[[stakeholders]]` y `[[requirements-index]]`;
  `memory-system check` sin problemas en `product/` ni `requirements/`. // satisface: AC-3
- `requirements/README.md` navega a los 77 requisitos por categoría; `docs/index.md` regenerado los lista sin enlaces rotos. // satisface: CNF-2
- UTF-8 sin BOM en todo lo creado o modificado. // satisface: CNF-3

**Non-Goals:**

- Eliminar `project.md` o reubicar §1.1–1.7, §2.3, §3, §4, §11, §12 y los apéndices.
- Reescribir el texto de los requisitos (p. ej. menciones a `01-projects/` en FR-001) o renumerar (el hueco FR-049 se conserva).
- Añadir `implements:` a épicas o historias; crear un template de requisito; cambiar `project-discovery` o `reverse-engineering`.
- Implementar la resolución corta `[[FR-001]]`, `memory-system migrate --from=srs-single` ni el `index.md` de `requirements/` que
  describe el README (pertenecen a STORY-118).
- Corregir el parser de comentarios YAML de `memory-system` (ver CR-003).

## Decisions

### D-1 — Disposición fragmentada con `README.md` como índice // satisface: AC-2, CNF-2

Se usa la disposición fragmentada (`functional/` + `non-functional/`), la que el propio README prescribe por encima del umbral.
El punto de entrada de la capa sigue siendo `docs/requirements/README.md` (`slug: requirements-index`): se le añade el índice
de requisitos (D-6). **No** se crea `docs/requirements/index.md`.

**Alternativas rechazadas:**

- *SRS único `srs-agile-sddf.md`:* el README lo descarta explícitamente por encima de 15 requisitos / 500 líneas, y AC-2 exige un
  archivo por requisito.
- *Crear `requirements/index.md` como dice el README:* duplicaría el rol de `README.md`, que es la semilla gestionada por
  `memory-system` (`<capa>-index`) y la que AC-3 enlaza como `[[requirements-index]]`; además el README afirma que ese
  `index.md` lo regenera `memory-system index`, algo que el motor no hace hoy (CR-002).

### D-2 — Contrato del archivo de requisito // satisface: AC-2, CNF-1

Ruta: `docs/requirements/functional/FR-NNN-<slug>.md` o `docs/requirements/non-functional/NFR-NNN-<slug>.md` (slug según D-3).

Frontmatter (esquema del README, sin claves adicionales):

| Clave | Valor |
|---|---|
| `type` | `requirement` |
| `kind` | `functional` / `non-functional` |
| `id` | `FR-NNN` / `NFR-NNN` (el original) |
| `slug` | nombre del archivo sin `.md` |
| `title` | título original literal, entre comillas dobles |
| `status` | `active` |
| `created` / `updated` | fecha de implementación |
| `related` | `[]` |

Cuerpo:

| Bloque | FR | NFR | Origen |
|---|---|---|---|
| `# <ID> — <título>` | ✓ | ✓ | Línea `- **ID**: <título>` |
| `## Descripción` + texto | ✓ | ✓ | Campo `Descripción` |
| `## Criterios de verificación` + texto | — | ✓ | Campo `Criterio de aceptación` (encabezado del esquema del README) |
| `## Atributos` + lista | `Prioridad`, `Usuario`, `Fuente`, `Categoría de origen` | `Prioridad`, `Categoría de origen` | Campos homónimos; `Categoría de origen` = título de la `###` contenedora (p. ej. `2.1.1 Infraestructura y protocolo de entorno`) |

Regla de literalidad: el texto de cada campo se copia carácter a carácter, quitando solo el prefijo `- **Campo**: ` y la sangría de
continuación de 6 espacios; se conservan los saltos de línea originales. Los ítems de `## Atributos` se escriben como
`- **Prioridad**: Alta`, igual que en origen. No se crea `## Verificado por` (no hay datos de origen; YAGNI).

**Alternativas rechazadas:**

- *Copiar el ítem de lista completo sin encabezados:* conserva el texto pero deja el archivo sin `#` ni estructura navegable, al
  margen del esquema del README.
- *Llevar `Prioridad`, `Usuario`, `Fuente` y categoría al frontmatter:* nada los consulta hoy; añadiría claves no documentadas en el
  esquema y alejaría el contenido del lector humano.
- *Mantener la etiqueta `Criterio de aceptación` dentro de `## Atributos` en los NFR:* desaprovecha la sección
  `## Criterios de verificación` que el esquema reserva justamente para ese contenido.

### D-3 — Regla de slug // satisface: AC-2

`<slug>` = título original → descomposición Unicode NFD sin marcas diacríticas → minúsculas → toda secuencia que no sea `[a-z0-9]`
se sustituye por `-` → sin `-` iniciales ni finales → recorte a ≤ 50 caracteres en el último `-` anterior al límite. El nombre es
`<ID>-<slug>.md`. Ejemplos: `FR-001-inicializacion-del-entorno-sddf.md`; NFR-014 ("Contrato `.tmp/<skill-name>/` contra el
«teléfono descompuesto»", 55 caracteres de slug) → `NFR-014-contrato-tmp-skill-name-contra-el-telefono.md`. El prefijo de ID
garantiza unicidad aunque dos títulos coincidan.

**Alternativas rechazadas:** slug manual por requisito (77 decisiones sin valor añadido) y solo ID (`FR-001.md`), que contradice la
convención `FR-NNN-<slug>.md` del README y de la historia.

### D-4 — Generación con un script desechable y verificación independiente // satisface: AC-2, CNF-1, CNF-3

La migración de los 77 requisitos la hace un script Node de un solo uso, `.tmp/story-implement/STORY-105/migrate-requirements.js`
(no versionado), que lee `project.md`, aplica D-2/D-3 y escribe los archivos en UTF-8 sin BOM. Un segundo script independiente,
`.tmp/story-implement/STORY-105/verify-requirements.js`, relee el origen (desde `git show HEAD:<ruta>` una vez editado
`project.md`) y comprueba archivo por archivo los contratos #3–#6.

El script falla (sin escribir nada) si el parser encuentra un ítem con un conjunto de campos distinto de los dos esperados, una
línea fuera del patrón, un ID duplicado, o si existe ya algún archivo de destino (degradación: no se sobrescribe un requisito
existente). Ningún paso del script modifica `project.md`.

**Alternativas rechazadas:**

- *Escritura manual de 77 archivos:* error humano casi garantizado al copiar ~720 líneas; sin verificación reproducible.
- *Implementar `memory-system migrate --from=srs-single`:* resuelve otro problema (SRS → fragmentado, STORY-118) y añade código
  mantenido al framework para un caso de un solo uso.

### D-5 — `stakeholders.md`: bloque §1.8 literal en `Usuarios y roles` // satisface: AC-1, CNF-1

Se sustituye solo el marcador de `## Usuarios y roles` por el bloque de lista de las líneas 127–159 de `project.md`, sin cambios
(seis ítems `- **US-NNN**: <nombre>` con su `- **Descripción**:`). `## Patrocinadores y decisores` e `## Intereses y conflictos`
conservan su marcador. Frontmatter: solo cambia `updated`. Se conserva `Volver al mapa: [[index]].`

**Alternativas rechazadas:** convertir cada perfil en `### US-NNN — <nombre>` (cambia la forma sin necesidad y aleja el texto de su
origen) y un archivo por perfil (ADR-0013 asigna los perfiles a un único `stakeholders.md`).

### D-6 — Índice de requisitos en `requirements/README.md` // satisface: CNF-2

Se añade al final del README una sección `## Índice de requisitos` con:

1. Una línea de procedencia: `Migrados desde project.md (§2.1 y §2.2) por [[eliminar-specs-01-projects]]; el hueco FR-049 se conserva.`
2. La nota "Convención de fuente" de §2.1, literal (deja de existir en `project.md`, D-7).
3. `### Requisitos funcionales` y `### Requisitos no funcionales`, cada una con una subsección `####` por categoría de origen
   (9 + 10, mismo título que en `project.md`) y una línea por requisito en orden de ID: `- [[<slug>]] — <título>`.

El resto del README no se toca (su texto de estrategia pertenece a STORY-118). Frontmatter: solo cambia `updated`.

**Alternativas rechazadas:** depender solo de `docs/index.md` (lista plana sin categorías, no satisface "agrupados por categoría")
y generar un `README.md` por subcarpeta (dos índices más que mantener).

### D-7 — `project.md`: secciones sustituidas por enlaces // satisface: AC-3

Se conservan los encabezados `## 1.8. Características de los Usuarios`, `# 2. Requisitos`, `## 2.1 Requisitos Funcionales` y
`## 2.2. Requisitos No Funcionales` (la numeración del documento y sus anclas no cambian). Bajo cada uno se reemplaza todo el
contenido hasta el siguiente encabezado del mismo nivel o superior por una sola línea:

| Sección | Línea nueva |
|---|---|
| 1.8 | `Los perfiles de usuario (US-001 a US-006) viven en [[stakeholders]] › Usuarios y roles.` |
| 2.1 | `Los 53 requisitos funcionales (FR-001 a FR-054, sin FR-049) viven como un documento por requisito en docs/requirements/functional/; índice por categoría en [[requirements-index]].` |
| 2.2 | `Los 24 requisitos no funcionales (NFR-001 a NFR-024) viven como un documento por requisito en docs/requirements/non-functional/; índice por categoría en [[requirements-index]].` |

`## 2.3.` y todo lo demás quedan intactos; en el frontmatter solo cambia `updated`. Los cambios se localizan por encabezado, no por
número de línea, para no chocar con STORY-104 (que edita `related:`, la línea `<!-- Referencias -->` y `## 11. Referencias`).

**Alternativas rechazadas:** dejar el contenido con un aviso "obsoleto" (duplicación que AC-3 prohíbe) y borrar los encabezados
(rompe la numeración y las anclas de un documento que sigue vivo hasta su propia historia).

### D-8 — Regenerar `docs/index.md`, neutralizando antes el borrador de STORY-103 // satisface: CNF-2, AC-3

`docs/index.md` se regenera con `node skills/memory-system/scripts/memory-system.js index --root docs` tras crear todos los
archivos. Prerrequisito: en `docs/specs/03-stories/STORY-103-replace-the-epic-template/epic-template.md` se eliminan **solo** los
comentarios `# escritor: …` en línea del bloque de frontmatter (los valores quedan idénticos; el cuerpo no se toca). Así `slug`
vuelve a ser `<nombre-del-directorio-de-la-epica>`, casa con `PLACEHOLDER_SLUG` y el motor lo indexa por ruta con
`⚠️ slug placeholder`, sin wikilink.

La regeneración también incorpora las entradas que el índice ya tenía pendientes (EPIC-21, STORY-102…118, conteos): es el efecto
esperado de "regenerar" y se acepta en este cambio.

**Alternativas rechazadas:**

- *Regenerar y borrar a mano la línea inválida:* el índice declara "no edites las entradas a mano" y la siguiente regeneración la
  reintroduciría, rompiendo `verify:repository`.
- *Corregir el parser de `memory-system` para quitar comentarios YAML en línea:* es la corrección de raíz, pero es un cambio de
  código de un skill con su propio alcance y evals (CR-003).
- *No regenerar y añadir 78 entradas a mano:* contradice CNF-2 ("`docs/index.md` (regenerado)").

### D-9 — Orden de la operación // satisface: AC-3

(1) Línea base de `check`; (2) generar y verificar los 77 requisitos (D-4); (3) `stakeholders.md` (D-5); (4) índice en el README
(D-6); (5) sustituir secciones en `project.md` (D-7); (6) neutralizar el borrador y regenerar `docs/index.md` (D-8);
(7) verificaciones. `project.md` se edita solo después de que el contenido existe y está verificado en su nuevo hogar, de modo que
ningún requisito queda sin copia en ningún momento.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Requisitos funcionales (53) | crear | `docs/requirements/functional/FR-NNN-<slug>.md` | AC-2, CNF-1, CNF-3 |
| Requisitos no funcionales (24) | crear | `docs/requirements/non-functional/NFR-NNN-<slug>.md` | AC-2, CNF-1, CNF-3 |
| Índice de requisitos | modificar | `docs/requirements/README.md` | CNF-2 |
| Stakeholders | modificar | `docs/product/stakeholders.md` | AC-1 |
| Especificación PROJ-01 | modificar (§1.8, §2.1, §2.2) | `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` | AC-3 |
| Índice de documentación | regenerar | `docs/index.md` | CNF-2 |
| Borrador de template de STORY-103 | modificar (comentarios del frontmatter) | `docs/specs/03-stories/STORY-103-replace-the-epic-template/epic-template.md` | CNF-2 (prerrequisito) |
| Migrador desechable | crear (no versionado) | `.tmp/story-implement/STORY-105/migrate-requirements.js` | AC-2 |
| Verificador desechable | crear (no versionado) | `.tmp/story-implement/STORY-105/verify-requirements.js` | AC-2, CNF-1 |

Se reutilizan `memory-system.js` (`index`, `check`) y `scripts/check-doc-links.js` (P3). Ningún skill, agente ni template cambia.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Nombre de archivo de requisito | `<ID>-<slug>.md`, `<ID>` ∈ {`FR-NNN`, `NFR-NNN`} original; slug por D-3 | AC-2 |
| Frontmatter de requisito | Tabla de D-2; `type`, `slug`, `title` presentes (requeridos por `check`) | AC-2, AC-3 |
| Cuerpo de requisito | Bloques de D-2 en ese orden | AC-2, CNF-1 |
| Wikilinks de destino | `[[stakeholders]]`, `[[requirements-index]]`, `[[<slug de requisito>]]` (slugs completos; no `[[FR-NNN]]`) | AC-3, CNF-2 |
| `migrate-requirements.js` | Entrada: ruta de `project.md`; salida: 77 archivos; exit ≠ 0 y cero escrituras ante cualquier anomalía del parser o destino existente | AC-2 |
| `verify-requirements.js` | Entrada: origen (`git show HEAD:`) y `docs/requirements/`; salida: informe por ID y exit 0 solo si todos los contratos #3–#6 pasan | AC-2, CNF-1 |

## Esquema de datos

Inventario del origen (registro interno del migrador, uno por ítem):

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | `FR-NNN` / `NFR-NNN` | `FR-001` |
| `title` | texto | `Inicialización del entorno SDDF` |
| `category` | texto (encabezado `###` contenedor sin `### `) | `2.1.1 Infraestructura y protocolo de entorno` |
| `fields` | mapa ordenado campo → texto multilínea | `Descripción`, `Prioridad`, `Usuario`, `Fuente` (FR) · `Descripción`, `Prioridad`, `Criterio de aceptación` (NFR) |

Ejemplo de archivo resultante (FR):

```
---
type: requirement
kind: functional
id: FR-001
slug: FR-001-inicializacion-del-entorno-sddf
title: "Inicialización del entorno SDDF"
status: active
created: <fecha>
updated: <fecha>
related: []
---

# FR-001 — Inicialización del entorno SDDF

## Descripción

<texto literal del campo Descripción>

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: `sddf-init` · STORY-054 · EPIC-10
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
```

## Flujos clave

### F-1 — Migración completa (AC-1, AC-2, AC-3)

Sigue el orden de D-9. Cada paso termina con su verificación antes de pasar al siguiente; si el migrador o el verificador fallan,
`project.md` no se toca.

### F-2 — Una historia futura referencia un requisito

Declara `implements: [FR-012]` y enlaza `[[FR-012-<slug>]]`; el lector abre un archivo de pocas decenas de líneas en lugar de
`project.md`. La resolución corta `[[FR-012]]` llega con STORY-118.

### F-3 — Degradación (P7)

- Parser con anomalía o destino existente → el migrador aborta sin escribir; se corrige el origen o el destino y se reintenta.
- Regeneración del índice con un problema nuevo de enlaces → `check-doc-links` lo detecta antes del commit; no se publica.
- Si STORY-104 ya se implementó, sus líneas de `project.md` están fuera de las secciones que edita D-7: no hay conflicto.

## Decisiones de complejidad justificada

- **Dos scripts desechables (migrar y verificar).** Un solo script que se verifica a sí mismo no detecta sus propios errores de
  parseo; uno independiente que relee el origen desde git sí. Ambos viven en `.tmp/` y no añaden superficie mantenida.
- **Tocar un artefacto de STORY-103.** Es el cambio mínimo que permite cumplir CNF-2 sin romper el gate de CI; solo elimina
  comentarios y no altera ningún valor. La corrección de raíz queda como CR-003.
- **`## Criterios de verificación` solo en NFR.** Los FR no tienen ese dato en origen; inventarlo violaría CNF-1.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Perfiles migrados | `stakeholders.md › Usuarios y roles` contiene exactamente las líneas 127–159 de `project.md` (HEAD) y 6 líneas `- **US-00[1-6]**` | AC-1 |
| 2 | Marcadores conservados | `grep -c "\[Por completar" docs/product/stakeholders.md` → `2`, en `Patrocinadores y decisores` e `Intereses y conflictos` | AC-1 |
| 3 | Conteo de archivos | `ls docs/requirements/functional/FR-*.md \| wc -l` → `53`; `ls docs/requirements/non-functional/NFR-*.md \| wc -l` → `24`; `ls docs/requirements/functional/FR-049-*` → sin coincidencias | AC-2 |
| 4 | ID por archivo | Para cada archivo: prefijo del nombre = `id` del frontmatter = ID del `#`; conjunto de IDs = conjunto de origen | AC-2 |
| 5 | Contenido literal | `verify-requirements.js`: título, `Descripción`, `Prioridad`, `Usuario`/`Fuente` (FR), `Criterio de aceptación` (NFR) idénticos al origen tras quitar prefijo y sangría | AC-2, CNF-1 |
| 6 | Categoría | `Categoría de origen` de cada archivo = `###` contenedor en origen | AC-2 |
| 7 | Sin duplicación en `project.md` | `grep -cE "^- \*\*(N?FR\|US)-[0-9]{3}\*\*" project.md` → `0`; §1.8, §2.1 y §2.2 contienen solo la línea de D-7 | AC-3 |
| 8 | Enlaces de sustitución | `project.md` contiene `[[stakeholders]]` (1) y `[[requirements-index]]` (2) | AC-3 |
| 9 | `check` limpio en las capas destino | `memory-system check --root docs` sin ninguna línea cuyo path empiece por `product/` o `requirements/`; total ≤ línea base | AC-3 |
| 10 | Índice de requisitos | `README.md` contiene 77 wikilinks `[[FR-…]]`/`[[NFR-…]]`, todos resolubles, bajo 19 subsecciones de categoría | CNF-2 |
| 11 | Índice global | `docs/index.md` regenerado lista los 77 requisitos y `[[stakeholders]]`; `node scripts/check-doc-links.js` → `[OK]` | CNF-2 |
| 12 | Encoding | Ningún archivo creado o modificado empieza por `EF BB BF`; `grep -lE "Ã\|ðŸ"` sobre ellos → vacío | CNF-3 |
| 13 | Borrador neutralizado | El frontmatter de `STORY-103-…/epic-template.md` no contiene `#`; sus valores y su cuerpo son idénticos a HEAD | CNF-2 |

## Risks / Trade-offs

- [Regenerar `docs/index.md` arrastra entradas ajenas (EPIC-21, STORY-102…118)] → Es el comportamiento pedido por CNF-2; se revisa
  el diff para confirmar que solo hay altas/actualizaciones derivadas del estado real.
- [El texto de algunos requisitos describe la estructura de tres niveles] → Fuera de alcance; lo corrigen las historias de skills y
  documentación de EPIC-21.
- [La plantilla `docs/templates/epic-template.md` también lleva comentarios en línea; si un skill los conserva al crear una épica,
  su `slug` se parseará mal] → No afecta a esta historia (`templates/` está excluido del escaneo); registrado en CR-003.
- [Recorte del slug a 50 caracteres puede truncar palabras significativas] → Se recorta en límite de palabra; el título completo
  sigue en `title` y en el `#`.
- [Conflicto de edición con STORY-104 sobre `project.md`] → Secciones disjuntas y localización por encabezado (D-7).

## Open Questions

Ninguna. Las ambigüedades se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-2 dice que "cada archivo conserva la descripción, la prioridad, los usuarios, la fuente y la categoría". Los 24
  NFR no tienen `Usuario` ni `Fuente` en origen; tienen `Criterio de aceptación`, que AC-2 no menciona.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño conserva los campos que cada requisito tiene (D-2): FR → descripción, prioridad, usuario, fuente,
  categoría; NFR → descripción, prioridad, criterio de aceptación, categoría. Recomendado: precisar AC-2 en `story.md`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: `docs/requirements/README.md` describe, para la disposición fragmentada, un `requirements/index.md` regenerado por
  `memory-system index` y la resolución corta `[[FR-001]]`. Ninguno existe hoy: ese texto anticipa STORY-118 (en SPECIFY). AC-3 y
  CNF-2 de esta historia usan `README.md` (`[[requirements-index]]`) como índice.
- **Documento afectado**: story.md (STORY-118) / docs/requirements/README.md
- **Acción requerida**: esta historia usa `README.md` como índice y wikilinks con slug completo (D-1, D-6). STORY-118 debe decidir si
  mantiene `README.md` como índice de la disposición fragmentada y ajustar el README en consecuencia.

### CR-003
- **Tipo**: dependencia
- **Descripción**: regenerar `docs/index.md` hoy rompe `npm run verify:repository` porque el parser de frontmatter de `memory-system`
  no elimina comentarios YAML en línea: el borrador `STORY-103-…/epic-template.md` produce el wikilink inválido
  `[[<nombre-del-directorio-de-la-epica>   # escritor: …]]`. El mismo defecto afectaría a cualquier épica que conserve los
  comentarios del template v2.
- **Documento afectado**: design.md / skill `memory-system`
- **Acción requerida**: esta historia aplica la mitigación mínima de D-8. Recomendado: historia aparte para que el parser de
  `memory-system` descarte los comentarios `#` en línea de los escalares sin comillas, con caso de eval.


### CR-004
- **Tipo**: corrección de inventario
- **Descripción**: §2.1 contiene una nota en blockquote que documenta la retirada de FR-049 entre FR-048 y FR-050. No es un requisito
  ni un campo de requisito; por tanto contradice la afirmación de Context de que no había líneas fuera del patrón.
- **Documento afectado**: design.md / migrador desechable.
- **Acción requerida**: el migrador acepta exclusivamente los blockquotes de «Convención de fuente» y «FR-049 retirado», pero no crea
  ningún archivo FR-049. Cualquier otro blockquote o línea ajena al formato sigue abortando la migración.

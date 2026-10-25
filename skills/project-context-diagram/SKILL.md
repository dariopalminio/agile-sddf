---
name: project-context-diagram
description: >-
  Genera architecture/c4/context-diagram.puml (C4 Nivel 1 en PlantUML) desde
  las capas del producto, requisitos o una entrevista. Úsalo para comunicar el
  alcance a stakeholders.
triggers:
  - /project-context-diagram
  - /context-diagram
  - diagrama de contexto
  - context diagram
  - C4 context
---

# Skill: `/project-context-diagram`

## Objetivo

Genera un diagrama de contexto C4 de Nivel 1 en `docs/architecture/c4/context-diagram.puml`, siguiendo la convención de `docs/architecture/README.md` para fuente PlantUML L1.

## Entrada

- `product/vision.md`, `product/stakeholders.md` y `requirements/` para `--from-files`.
- `README.md`, manifiestos e imports como complemento de inferencia.
- `assets/c4-context-template.puml`, solo lectura.
- Argumentos: `--interactive`, `--from-files` o una ruta explícita usada como fuente principal.

## Precondiciones

- La raíz se resuelve con el contrato local.
- Debe existir `assets/c4-context-template.puml`.

## Modos de ejecución

| Modo | Comportamiento |
|---|---|
| `--interactive` (predeterminado) | Entrevista guiada sobre sistema, actores, sistemas externos y relaciones. |
| `--from-files` | Infiere los elementos desde capas, README y código. |
| Ruta explícita | La ruta existente es fuente principal y se completa con las capas. |
| Ruta inexistente | Ofrece continuar con `--from-files` o `--interactive`; sin respuesta usa `--from-files`. |

El modo automático omite solo el preview; nunca omite la confirmación de sobrescritura.

## Restricciones / Reglas

- El template es de solo lectura.
- Usa solo `Person()`, `System()`, `System_Ext()` y `Rel()`; hay un único `System()` principal y toda relación tiene etiqueta.
- `Person()` representa humanos o roles; los sistemas técnicos usan `System_Ext()`.
- El skill nunca escribe, mueve ni borra `context-diagram.png`.
- La confirmación de sobrescritura aplica a todos los modos.
- El `.puml` se guarda en UTF-8 sin BOM.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

### Paso 1 — Validar template

Lee `assets/c4-context-template.puml`. Si no existe, detén el flujo con `❌ No se encontró el template requerido en assets/c4-context-template.puml.`

### Paso 2 — Detectar modo

- Sin argumentos o con `--interactive`: entrevista.
- Con `--from-files`: escaneo de capas.
- Con ruta explícita existente: úsala como fuente principal y completa con las capas.
- Con ruta explícita inexistente: informa `❌ No se encontró el archivo indicado: <ruta>`; ofrece **A)** `--from-files` sobre las capas y **B)** `--interactive`. Sin respuesta, usa A.

### Paso 3 — Recopilar datos

#### Modo interactivo

Recaba nombre y descripción del sistema; luego actores, sistemas externos, protocolo y relaciones. Pregunta hasta que el usuario indique que no hay más elementos.

#### Modo from-files

Escanea en este orden y deduplica por nombre normalizado (minúsculas y sin acentos); ante conflicto gana la fuente de menor número:

| # | Fuente | Aporta |
|---|---|---|
| 1 | `docs/product/vision.md` | `System()`: `**Nuestro producto:**` y `**Que provee:**`, o la primera frase del problema. |
| 2 | `docs/product/stakeholders.md` en `## Usuarios y roles` | Un `Person()` por perfil `US-NNN` y su descripción. Patrocinadores no generan personas. |
| 3 | `docs/requirements/` | `System_Ext()` y `Rel()` desde requisitos funcionales, no funcionales y SRS; el NFR de tecnología aporta protocolo. |
| 4 | README, manifiestos, imports y código | Nombre faltante, protocolos y sistemas complementarios. |

Vision y stakeholders cuentan solo si existen y su `substatus` no es `TODO`. En las relaciones, usa los FR cuyo `**Usuario**` referencia cada `US-NNN`. Genera IDs en minúsculas, sin acentos y con secuencias no alfanuméricas convertidas a `_`.

Si falta nombre de sistema o no hay `Person()`, muestra `⚠️ No se encontraron <elementos> en product/ ni requirements/.` En modo interactivo completa lo faltante; en modo automático termina con `❌ No hay contexto suficiente para el diagrama; ejecuta /project-discovery o usa --interactive.` sin escribir.

### Paso 4 — Generar PlantUML

Usa el template como estructura. Incluye un `System()` principal, cada `Person()` y `System_Ext()` inferido, y relaciones `Rel()` con etiqueta y protocolo.

### Paso 5 — Preview

En modo manual muestra el PlantUML completo y permite corregirlo antes de continuar. El modo automático omite solo este preview.

### Paso 6 — Confirmar y escribir

Define `$DIAGRAM_PATH = docs/architecture/c4/context-diagram.puml`. Si ya existe, pregunta en todos los modos: `⚠️ Ya existe docs/architecture/c4/context-diagram.puml. ¿Deseas sobrescribirlo? (Sí / No)`.

La respuesta predeterminada, incluida la ausencia de respuesta, es `No`: `Sin cambios: se conservan context-diagram.puml y context-diagram.png.` y finaliza sin escribir. Con `Sí`, o si no existe, crea `architecture/c4/` si falta y escribe el `.puml` en UTF-8 sin BOM. Si existe el PNG, informa `⚠️ context-diagram.png no se regeneró: renderízalo desde el .puml para que coincidan.`

### Paso 7 — Confirmar resultado

Informa la ruta de `$DIAGRAM_PATH`, cómo renderizar el diagrama y sugiere `/project-planning`.

## Salida

- `docs/architecture/c4/context-diagram.puml`: diagrama C4 Nivel 1 en PlantUML.

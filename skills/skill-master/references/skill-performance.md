# Rendimiento y Optimización de Skills

Léeme **antes de dar por terminado un `SKILL.md`**, o cuando un skill se sienta pesado: contexto que se consume sin aportar, referencias que nadie carga, un cuerpo que crece sin control.

El rendimiento de un skill no se mide en milisegundos: se mide en **tokens de contexto gastados por invocación**. Cada línea del `SKILL.md` se paga cada vez que el skill dispara; cada carácter del `description` se paga en **todas** las sesiones, disparen o no el skill.

Fuente normativa: `docs/policies/references/skill_creation_policy.md` §7.

---

## Presupuestos

| Elemento | Límite | Cómo verificar | Acción si se excede |
|----------|--------|----------------|---------------------|
| `SKILL.md` | < 500 líneas | `wc -l SKILL.md` | Dividir en archivos de `references/` y enlazarlos |
| `description` (frontmatter) | ≤ 350 chars objetivo · 500 duro | contar caracteres | Mover el "cómo" al cuerpo; dejar solo "¿cuándo invocarme?" |
| Archivo de `references/` | < 300 líneas | `wc -l references/*.md` | Añadir tabla de contenidos, o dividir por dominio |
| Cualquier archivo empaquetado | < 5 MB | `du -h` | Alojar externo y referenciar por URL |

Los límites del `description` provienen del propio `SKILL.md` de skill-master (sección "Write the SKILL.md"); esta referencia los recoge, no los redefine.

---

## Reglas

### R-01 — El `SKILL.md` DEBE mantenerse bajo 500 líneas

El cuerpo se carga **completo** en contexto cada vez que el skill dispara. Un `SKILL.md` de 900 líneas cobra 900 líneas incluso cuando la tarea del usuario solo usa una sección. Si el contenido crece, **divide**: el material que solo se necesita en algunos casos DEBE vivir en `references/`, enlazado desde el cuerpo con una indicación de *cuándo* leerlo.

### R-02 — La divulgación progresiva DEBE ser el modo por defecto

Solo el `SKILL.md` se carga de entrada. Lo que hay en `scripts/`, `references/`, `assets/` y `examples/` DEBE cargarse **bajo demanda**. Un enlace no cuesta tokens; el archivo enlazado solo se paga si el agente decide leerlo. En tareas simples eso reduce el consumo drásticamente. Detalle del modelo de tres niveles: `skill-anatomy.md`.

### R-03 — Cada archivo empaquetado DEBE pesar menos de 5 MB

Los archivos grandes ralentizan la transferencia, la instalación y el procesamiento. Si un asset es inevitablemente pesado (dataset, binario, media), aloja fuera y referencia por URL — respetando la validación de dominios de la política de seguridad (G-05).

### R-04 — El skill NO DEBE incluir archivos innecesarios

Un `README.md` que repite el `SKILL.md` no aporta y compite por ser el punto de entrada: el agente puede leer el archivo equivocado. Incluye `README.md` solo cuando sirva a **humanos** con información que el `SKILL.md` no da (instalación, contexto de proyecto, licencia).

### R-05 — La claridad DEBE primar sobre la verbosidad

Instrucciones concisas y directas; ejemplos breves y representativos. Una tabla suele reemplazar tres párrafos con menos tokens y más precisión. Evita explicaciones redundantes y repetir en prosa lo que un ejemplo ya muestra. Estilo detallado: `writing-guide.md`.

### R-06 — Las referencias DEBEN estructurarse para carga selectiva

Si un skill cubre varios dominios, divídelos en archivos separados (`references/api.md`, `references/faq.md`, `references/advanced.md`) en lugar de un único archivo enorme. Así el agente carga solo el dominio que necesita en cada momento.

---

## De dónde sale el coste

| Nivel | Qué contiene | Cuándo se paga |
|-------|--------------|----------------|
| 1. Metadata | `name` + `description` | En **toda** sesión, dispare o no el skill |
| 2. Cuerpo | `SKILL.md` completo | Cada vez que el skill dispara |
| 3. Recursos | `references/`, `assets/`, `examples/`, `scripts/` | Solo si el agente los lee (los scripts pueden ejecutarse sin cargarse) |

El nivel 1 es el más caro por carácter: es el único que se multiplica por todas las sesiones del usuario. Por eso el `description` responde únicamente "¿cuándo invocarme?" y nunca "¿cómo hago la tarea?".

---

## Checklist de auditoría

Sobre un skill ya escrito:

- [ ] `wc -l SKILL.md` < 500 (R-01)
- [ ] `description` ≤ 350 chars y sin instrucciones de "cómo" (R-05, nivel 1)
- [ ] Cada archivo de `references/` se enlaza desde el cuerpo **con una indicación de cuándo leerlo** (R-02)
- [ ] Ninguna referencia queda huérfana (enlazada desde ningún sitio) ni duplicada dentro del cuerpo
- [ ] Ningún archivo supera 5 MB (R-03)
- [ ] No hay `README.md` que duplique el `SKILL.md` (R-04)
- [ ] Los archivos de `references/` > 300 líneas tienen tabla de contenidos, o se han dividido (R-06)
- [ ] El trabajo repetitivo que el agente rehace en cada invocación está empaquetado en `scripts/` en lugar de descrito en prosa

---

## Señales de que hay que dividir el `SKILL.md`

- Cubre **varios dominios o variantes** (aws / gcp / azure) en un mismo archivo → un archivo de referencia por variante.
- Tiene secciones que **solo aplican a una plataforma** o a un modo de ejecución poco frecuente.
- Contiene **tablas de referencia largas**, esquemas JSON completos o catálogos de campos.
- Los **ejemplos ocupan más que las instrucciones**.
- Hay secciones que el agente rara vez necesita para completar la tarea típica.

---

## Anti-patrones

| ❌ Patrón | ✅ Alternativa | Regla |
|-----------|---------------|-------|
| `README.md` que repite el `SKILL.md` | Un único punto de entrada; `README.md` solo con lo específico para humanos | R-04 |
| Un `references/all.md` monolítico | Un archivo por dominio, cargados selectivamente | R-06 |
| Volcar el procedimiento en el `description` | El "cuándo" en el `description`, el "cómo" en el cuerpo | R-05 |
| Duplicar contenido entre `SKILL.md` y una referencia | Enlazar; una sola fuente de verdad por tema | R-01 |
| Tres párrafos donde bastaba una tabla | Tabla o lista | R-05 |
| Enumerar los pasos de un script en prosa cada vez | Empaquetar el script en `scripts/` e invocarlo | R-05 |
| Enlazar todas las referencias "por si acaso" al inicio | Enlazar en el punto donde se necesitan, indicando cuándo leerlas | R-02 |

---

## Referencias relacionadas

- `skill-anatomy.md` — modelo de tres niveles y divulgación progresiva en detalle
- `skill-structure.md` — qué va en cada directorio y cuándo omitirlo
- `skill-frontmatter.md` — convenciones del frontmatter YAML
- `writing-guide.md` — estilo de escritura y cómo mantener el prompt ligero

# Cerrar los 8 hallazgos `(warn)` del `ai-security-checklist`

## Context

Pregunta de partida: **¿se cumple [docs/policies/ai-security-checklist.md](docs/policies/ai-security-checklist.md) en este repositorio?**

Respuesta, tras correr las 11 reglas deterministas del bloque *How to run the validation* sobre los 446 archivos trackeados: **sí en todo lo que bloquea.** Las 7 reglas `(error)` pasan. Quedan **8 hallazgos `(warn)`**, y el guardrail no permite ignorarlos: *"`(warn)` does not block — apply it, or state why you did not"*. Hoy no están ni corregidos ni justificados en ninguna parte, así que el repo está en un estado indefinido respecto de su propia política.

| Regla | Peso | Resultado |
|---|---|---|
| `ai-no-prompt-override` | error | ✅ |
| `ai-no-safety-bypass` | error | ✅ |
| `ai-tools-not-wildcard` | error | ✅ |
| `ai-no-hidden-characters` | error | ✅ |
| `ai-no-home-path` | error | ✅ |
| `ai-no-remote-pipe` | error | ✅ |
| `ai-locked-skill-hash` / `-source` / `-path` | error | ✅ por vacuidad — no existe `skills-lock.json` |
| `ai-no-opaque-blob` | warn | ✅ |
| `ai-untrusted-content-clause` | warn | ✅ por vacuidad — 0 `SKILL.md` dispara el trigger |
| **`ai-confirm-before-irreversible`** | warn | ❌ **7 archivos** |
| **`ai-https-only`** | warn | ❌ **1 archivo** |

El objetivo es dejar los 8 en estado resuelto: **corregir los 2 que son reales, justificar por escrito los 5 falsos positivos donde el revisor los va a volver a encontrar, y cerrar 1 hallazgo de encoding descubierto de paso.**

---

## Triage de los 8 `(warn)`

| # | Archivo:Línea | Patrón | Veredicto |
|---|---|---|---|
| 1 | [docs/runbooks/deployment-to-npm.md:41](docs/runbooks/deployment-to-npm.md#L41) | `npm publish --access public` | **Real** — acción irreversible hacia fuera, sin confirmación documentada |
| 2 | [docs/guides/best-practices-for-testing.md:198](docs/guides/best-practices-for-testing.md#L198) | `http://www.extremeprogramming.org/rules/testfirst.html` | **Real** — trivial |
| 3 | [docs/guides/best-practices-for-agents.md:58](docs/guides/best-practices-for-agents.md#L58) | `rm -rf` | **Falso positivo** — la frase argumenta *a favor* del mínimo privilegio ("un ingeniero de pruebas no necesita `runCommands` para `rm -rf`") |
| 4 | [docs/runbooks/docker-dev-container-with-security-scann.md:30](docs/runbooks/docker-dev-container-with-security-scann.md#L30) | `rm -rf /var/lib/apt/lists/*` | **Falso positivo** — limpieza de capa dentro de una imagen Docker, no toca la máquina del usuario |
| 5 | `docs/specs/02-epics/EPIC-17.../plan-13-remove-gem-and-rovo.md:40` | `rm -rf gem/ rovo/` | **Falso positivo** — registro histórico de un plan ya ejecutado |
| 6-8 | `STORY-039/story.md`, `STORY-046/story.md`, `STORY-087/story.md` | `npm publish` | **Falso positivo** — escenarios Gherkin que *especifican* el flujo de publicación; nadie los ejecuta |

Patrón: los 6 falsos positivos son todos artefactos que **describen** o **citan** un comando, no que lo instruyan. La regla no distingue, y no se va a tocar la regla.

---

## Trabajo a realizar

### 1. Corregir los dos hallazgos reales

**`docs/runbooks/deployment-to-npm.md`** — añadir el paso de confirmación que precede a `npm publish`, antes de la línea 41. Es un runbook de publicación a npm: publicar es irreversible pasadas 72 h y afecta a todo el que instale. Basta con un paso explícito que falle cerrado (sin respuesta ⇒ no se publica), redactado como el resto del runbook. Eso satisface la regla de verdad, no solo al grep: la regla busca `confirm|approval|approve|ask the user|authoriz` en el archivo, pero el objetivo es el control, no la palabra.

**`docs/guides/best-practices-for-testing.md:198`** — cambiar `http://` por `https://` en el enlace a extremeprogramming.org. Verificar antes que el destino responde por HTTPS; si no, sustituir la referencia por una fuente equivalente que sí lo haga.

### 2. Justificar los seis falsos positivos donde el guardrail los muestra

El guardrail exige justificarlos, y una justificación que vive en el historial de un PR se pierde. Va en el propio guardrail, en una subsección nueva **`### Excepciones aceptadas`** dentro de *Verification*, con una tabla `archivo | regla | por qué no aplica`. Es el único lugar donde quien vuelva a correr el check en seis meses la va a encontrar junto al hallazgo.

> Editar el guardrail es tocar una política. Se añade **solo** la sección de excepciones —
> no se modifica ninguna regla, ni su peso, ni el script de validación. La regla semántica
> *"a change that relaxes any control in this file states why, who decided it, and what
> compensating control applies"* aplica: la tabla dice por qué, y el control compensatorio
> es que cada excepción nombra archivo y línea, así que un cambio en esos archivos
> invalida la excepción y vuelve a exigir revisión.

### 3. Cerrar el hallazgo de encoding descubierto de paso

`docs/specs/03-stories/STORY-039-publicar-framework-en-npm/story.md` **no es UTF-8 válido** — byte `0xfa` en la posición 424 (`público`, `versión` aparecen corruptos). No lo detecta este guardrail, pero viola la convención de encoding que los propios skills imponen a todo `.md` generado. Reconvertir de CP-1252 a UTF-8 sin BOM, preservando los `CRLF` que ya tiene el archivo.

---

## Lo que NO se hace en este cambio

- **No se modifican las reglas del guardrail** ni sus pesos ni el script de validación.
- **No se toca `.github/workflows/skill-security-audit.yml`** — el path filter apunta a `.claude/skills/**` (0 archivos trackeados) mientras la fuente son `skills/` y `agents/`. Ya está declarado como limitación conocida en [SECURITY.md](SECURITY.md); corregirlo es un cambio propio.
- **No se amplía la cobertura de `$DOCS`.** La variable del script cubre `skills/*/SKILL.md`, `skills/*/references/*.md` y `skills/*/assets/*.md`, pero **no** `agents/*.md` (10 archivos) ni `skills/*/agents/*.md` (5). Son 15 archivos agent-facing que `ai-no-home-path` no mira. Extendí el grep a mano sobre esos 15: **no hay hallazgos ocultos**, así que no es urgente — pero es una brecha real de la definición del check frente a la estructura de este repo, y merece su propio cambio.

---

## Verificación

1. **El guardrail completo queda limpio salvo las excepciones documentadas.** Extraer y correr el bloque tal como lo documenta el propio archivo:
   ```bash
   sed -n '/^```bash$/,/^```$/p' docs/policies/ai-security-checklist.md | sed '1d;$d' > /tmp/run-ai.sh
   bash /tmp/run-ai.sh
   ```
   Esperado: `ai-confirm-before-irreversible` baja de 7 a 6 líneas (queda solo lo justificado en la tabla de excepciones) y `ai-https-only` no imprime nada.
2. **El control de `deployment-to-npm.md` es real, no cosmético** — leer el runbook y comprobar que el paso de confirmación precede a `npm publish` y falla cerrado.
3. **El enlace HTTPS resuelve** — comprobar que `https://www.extremeprogramming.org/rules/testfirst.html` responde antes de dar el cambio por bueno.
4. **Toda excepción de la tabla sigue viva** — cada fila nombra un archivo y una línea que todavía dispara la regla; una fila que ya no corresponda a un hallazgo real es una excepción caducada y se borra.
5. **Encoding de STORY-039** —
   ```bash
   python -c "open('docs/specs/03-stories/STORY-039-publicar-framework-en-npm/story.md','rb').read().decode('utf-8')"
   ```
   debe terminar sin excepción, y `público` / `versión` deben leerse bien.
6. **No hubo regresión en las reglas `(error)`** — las 7 siguen sin imprimir nada.
7. **El guardrail de código sigue igual** — correr también `code-security-checklist.md`; los 3 `sec-gitignore-coverage` preexistentes (`.agents`, `.temp`, `__pycache__`) no deben aumentar. Cerrarlos es otro cambio.

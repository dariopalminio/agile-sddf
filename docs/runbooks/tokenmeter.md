# Runbook: Tokenmeter

> Dashboard local de consumo de tokens y costos para Claude Code, Codex y Copilot CLI.

## 1. Instalación

Requiere Python 3.9 o superior. Elige un método:

```bash
# Homebrew (macOS)
brew install serkankorkut/tap/tokenmeter && tokenmeter start

# pipx (Linux/Windows)
pipx install tokenmeter-dashboard && pipx ensurepath && ~/.local/bin/tokenmeter start

# uvx (efímero sin instalación permanente)
uvx --from tokenmeter-dashboard tokenmeter --open

# Plugin de Claude Code (directo desde GitHub)
claude plugin marketplace add serkankorkut/tokenmeter
claude plugin install tokenmeter@tokenmeter
```

**Para instalar también el skill de Codex** (y el comando `tokenmeter`):

En Unix/macOS:

```bash
git clone https://github.com/serkankorkut/tokenmeter ~/repo/tokenmeter
~/repo/tokenmeter/install.sh
```

Verificar:

```bash
tokenmeter --help
```

## 2. Configuración inicial

Crear `~/.tokenmeter/config.json` con solo las claves que quieras sobrescribir. Se fusiona sobre el `pricing.json` incluido, así que las actualizaciones nunca pisan tu configuración.

Ejemplo para plan Claude de $100 y ChatGPT Plus de $20, con presupuesto diario de $30:

```json
{
  "_plans": { "claude": 100, "codex": 20 },
  "_budget": { "daily": 30 }
}
```

Claves disponibles:

| Clave | Propósito |
|---|---|
| `_plans` | Lo que pagas al mes por herramienta. Alimenta el tile de suscripción. |
| `_budget` | Topes `daily` y `monthly` en USD equivalente-API. Notificación de escritorio al exceder. |
| `_context_windows` | Tamaño de contexto por prefijo de modelo, para el gauge de llenado. |
| `_port` | Puerto alternativo (por defecto 7788). |

## 3. Uso diario

```bash
tokenmeter start        # Arranca en segundo plano y abre el navegador
tokenmeter stop         # Detiene el proceso en segundo plano
tokenmeter              # Ejecuta en la terminal (sin segundo plano)
tokenmeter --open       # Arranca y abre navegador explícitamente
tokenmeter --port 8080  # Puerto alternativo
```

El dashboard queda disponible en `http://127.0.0.1:7788` y se refresca cada 4 segundos. Se reinicia automáticamente al login (launchd en macOS, systemd user service en Linux).

**Proceso de larga duración:** `tokenmeter start` no termina solo. Usa `tokenmeter stop` para detenerlo.

## 4. Integración con agentes

### 4.1 Skill `/tokenmeter`

Dentro de **Claude Code** o **Codex**, el comando `/tokenmeter` arranca `server.py` y devuelve el enlace al dashboard. Es un atajo que evita salir del agente.

- **Claude Code:** se instala automáticamente con el plugin o con `install.sh`.
- **Codex:** se instala con `install.sh` (clone and link).

### 4.2 Menú bar (macOS)

Copiar `menubar/tokenmeter.1m.sh` a la carpeta de plugins de SwiftBar o xbar. Muestra el gasto del día y, al hacer clic, las cifras de 5 horas y mensuales.

## 5. Alertas y presupuesto

Configurar `_budget` en `~/.tokenmeter/config.json`:

```json
{
  "_budget": { "daily": 30, "monthly": 500 }
}
```

Tokenmeter envía una notificación de escritorio una vez por período cuando se cruza el umbral. No hay webhooks ni integraciones externas.

## 6. Team mode (opcional)

Para compartir métricas con un equipo sin enviar el texto de los prompts:

```bash
# En el servidor compartido
tokenmeter --host 0.0.0.0
# Con TOKENMETER_TOKEN=<secreto> definido en el entorno

# En cada laptop
tokenmeter --export http://servidor:7788
# Con TOKENMETER_TOKEN=<mismo_secreto>
```

Solo viajan conteos de tokens, modelos, rutas de proyecto y timestamps. El texto de los prompts permanece local.

## 7. Referencias

- **Troubleshooting:** `tokenmeter-troubleshooting.md`
- **Arquitectura CLI/skill/MCP:** `docs/architecture/agentes-y-herramientas.md`
- **Graphify (herramienta complementaria):** `runbooks/graphify.md`
- **Repositorio oficial:** https://github.com/serkankorkut/tokenmeter
- **Documentación:** https://tokenmeter.fyi

# Test 01 — Modo interactivo

**Invocación:** `/project-context-diagram`

El usuario define el sistema, dos actores y dos sistemas externos; el skill muestra el preview PlantUML. Tras confirmar que el preview es correcto, el destino es automáticamente:

```text
$SPECS_BASE/architecture/c4/context-diagram.puml
```

Si el archivo ya existe, el skill pregunta si desea sobrescribirlo. `No` conserva tanto el `.puml` como `context-diagram.png`; `Sí` escribe solo el `.puml` y avisa que debe renderizarse el PNG nuevamente.

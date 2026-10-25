# 📖 Historia: Fixture sin frontmatter

**Como** mantenedor del fixture
**Quiero** un archivo de historia sin bloque YAML inicial
**Para** verificar que header-aggregation deriva y antepone el frontmatter canónico

**substatus**: IN-PROGRESS

Épica padre: EPIC-90-fixture-a

## ✅ Criterios de aceptación

```gherkin
Dado un archivo story.md sin frontmatter
Cuando ejecuto /header-aggregation sobre él
Entonces el archivo comienza con un bloque YAML con slug, type, title, status y created
```

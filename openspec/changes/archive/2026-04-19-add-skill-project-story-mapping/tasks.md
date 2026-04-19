## 1. Create the project-story-mapper agent

- [x] 1.1 Create `.claude/agents/project-story-mapper.agent.md` with frontmatter (name, description, allowed-tools)
- [x] 1.2 Define agent role: Jeff Patton User Story Mapping specialist integrated with SDDF project pipeline
- [x] 1.3 Add instructions to read `docs/specs/project/project-intent.md` and `docs/specs/project/requirement-spec.md` if they exist
- [x] 1.4 Add interactive questioning logic for when project documents are absent
- [x] 1.5 Define the mapping process steps: personas → backbone → walking skeleton → user tasks → release slices
- [x] 1.6 Add output instructions: write `docs/specs/project/story-map.md` with ASCII map + structured sections

## 2. Create the project-story-mapping skill

- [x] 2.1 Create directory `.claude/skills/project-story-mapping/`
- [x] 2.2 Create `.claude/skills/project-story-mapping/SKILL.md` with frontmatter (name, description, allowed-tools)
- [x] 2.3 Define skill trigger keywords and when to use
- [x] 2.4 Add skill logic: read project context documents → spawn `project-story-mapper` agent
- [x] 2.5 Document expected output and integration with SDDF pipeline

## 3. Validate and test

- [x] 3.1 Verify skill appears in skills list and trigger description is accurate
- [ ] 3.2 Run the skill on an existing project with `project-intent.md` and verify `story-map.md` is generated
- [ ] 3.3 Run the skill without project documents and verify agent asks for context interactively
- [ ] 3.4 Confirm output document contains all required sections (personas, backbone, walking skeleton, release slices, ASCII map)

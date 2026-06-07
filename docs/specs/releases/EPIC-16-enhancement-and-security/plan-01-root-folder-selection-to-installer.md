---
alwaysApply: false
type: release
id: plan-01-root-folder-selection-to-installer
slug: plan-01-root-folder-selection-to-installer
title: "Plan 01: Root Folder Selection for Installer"
status: COMPLETED
substatus: DONE
parent: EPIC-16-enhancement-and-security
created: 2026-06-05
updated: 2026-06-05
related: [
  - EPIC-16-enhancement-and-security
]
---
[[EPIC-16-enhancement-and-security]]

## Plan (ya ejecutado): Agregar selección de root folder de skills al instalador

### Context
Currently the SDDF installer always copies skills and agents into .claude/ (local project) or ~/.claude/ (global). The framework supports multiple AI runtimes — Claude Code (.claude/), OpenCode (.agents/), and GitHub Copilot (.github/) — but the installer doesn't let users choose. This feature adds an interactive folder selection prompt when running agile-sddf install, while keeping the postinstall hook silent (defaulting to .claude/).

### Approach
Modify the three scripts with minimal changes: add a readline-based interactive prompt in install.js, expose a --target flag in cli.js, and leave postinstall.js unchanged.

Valid target folders: .claude | .agents | .github

### Files to modify

1. scripts/install.js
Add promptFolderSelection() — uses Node.js built-in readline to present a numbered menu:

Where would you like to install SDDF skills and agents?
  1) .claude   (Claude Code — recommended)
  2) .agents   (OpenCode)
  3) .github   (GitHub Copilot)
Enter choice [1]:
Returns the chosen folder name string (e.g. '.claude').

Update resolveDestDir(options) — accept a folder option (string). Replace the hardcoded '.claude' segment with options.folder || '.claude':

// global mode
path.join(os.homedir(), options.folder || '.claude')
// local mode
path.join(projectDir, options.folder || '.claude')
Update installSDDF(options) — if options.folder is not provided AND process.stdin.isTTY (interactive terminal), call promptFolderSelection() and set options.folder from the result. Non-interactive runs (postinstall) skip the prompt and use the default.

Export promptFolderSelection alongside installSDDF (for testability).

2. scripts/cli.js
Add --target <folder> flag parsing (looks for --target in args, reads next element):
const targetIdx = args.indexOf('--target');
const targetFolder = targetIdx !== -1 ? args[targetIdx + 1] : undefined;
Validate that targetFolder, if provided, is one of the three allowed values; exit with error if not.
Pass { global: isGlobal, folder: targetFolder } to installSDDF().
Update USAGE string to document the new flag:
Options:
  --global            Install to ~/.{folder} instead of the current project
  --target <folder>   Target folder: .claude (default), .agents, .github
3. scripts/postinstall.js
No changes. It calls installSDDF() with no options; process.stdin.isTTY is undefined/falsy in npm lifecycle hooks, so it will silently default to .claude/.

4. README.md (root)
Add a section in the installation instructions about the new folder selection feature, including the interactive prompt and the --target flag for non-interactive use.

### Verification

Interactive prompt — Run node scripts/cli.js install (or npx agile-sddf install) in a terminal. Confirm the numbered menu appears, selecting option 2 copies to .agents/skills and .agents/agents.
Flag bypass — Run agile-sddf install --target .agents. Confirm no prompt appears and files land in .agents/.
Invalid target — Run agile-sddf install --target .invalid. Confirm it prints an error and exits with code 1.
Postinstall silent — Run node scripts/postinstall.js. Confirm no prompt appears and files copy to .claude/ as before.
Global + target — Run agile-sddf install --global --target .agents. Confirm files land in ~/.agents/.


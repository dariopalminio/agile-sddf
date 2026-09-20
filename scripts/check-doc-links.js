#!/usr/bin/env node
'use strict';

/**
 * Deterministic checker for the documentation users and maintainers rely on.
 *
 * It deliberately does not fetch the network: external URLs are checked for a
 * valid, safe scheme only. Historical specs and ADRs are excluded because they
 * preserve the context in which they were written rather than being rewritten
 * when a later directory or runtime changes.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const ACTIVE_ROOTS = [
  'README.md',
  'SECURITY.md',
  'docs/index.md',
  'docs/constitution.md',
  'docs/policies',
  'docs/guardrails',
  'docs/guides',
  'docs/runbooks',
];
const HISTORICAL_EXCLUSIONS = [
  'CHANGELOG.md',
  'docs/adr',
  'docs/specs',
];

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function lineAt(contents, index) {
  return contents.slice(0, index).split('\n').length;
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function walkMarkdown(target, files) {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (path.extname(target).toLowerCase() === '.md') files.push(target);
    return;
  }

  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const child = path.join(target, entry.name);
    if (entry.isDirectory()) walkMarkdown(child, files);
    else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') files.push(child);
  }
}

function activeMarkdownFiles(repoRoot = REPO_ROOT) {
  const files = [];
  for (const relativePath of ACTIVE_ROOTS) {
    const candidate = path.join(repoRoot, relativePath);
    if (!fs.existsSync(candidate)) {
      throw new Error(`Active documentation root is missing: ${relativePath}`);
    }
    walkMarkdown(candidate, files);
  }
  return files.sort();
}

function withoutFencedCode(contents) {
  return contents.replace(/^```[^\n]*[\s\S]*?^```\s*$/gm, (block) => block.replace(/[^\n]/g, ' '));
}

function visibleMarkdown(contents) {
  return withoutFencedCode(contents).replace(/`[^`\n]*`/g, (span) => span.replace(/[^\n]/g, ' '));
}

function githubAnchor(headings, heading) {
  const base = heading
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
    .replace(/^-+|-+$/g, '');
  const count = headings.get(base) || 0;
  headings.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

function anchorsFor(filePath, cache) {
  if (cache.has(filePath)) return cache.get(filePath);
  const contents = withoutFencedCode(fs.readFileSync(filePath, 'utf8'));
  const headings = new Map();
  const anchors = new Set();
  const pattern = /^(?:#{1,6})\s+(.+?)\s*#*\s*$/gm;
  let match;
  while ((match = pattern.exec(contents)) !== null) {
    anchors.add(githubAnchor(headings, match[1]));
  }
  cache.set(filePath, anchors);
  return anchors;
}

function normalizeMarkdownTarget(rawTarget) {
  let target = rawTarget.trim();
  if (target.startsWith('<')) {
    const closeIndex = target.indexOf('>');
    if (closeIndex === -1) return target;
    return target.slice(1, closeIndex).trim();
  }
  const titleMatch = target.match(/^(\S+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?$/);
  return titleMatch ? titleMatch[1] : target;
}

function extractMarkdownTargets(contents) {
  const targets = [];
  const visible = visibleMarkdown(contents);
  // Titles are deliberately supported, but targets themselves cannot contain
  // unescaped spaces. That is the CommonMark form used by the active docs and
  // avoids consuming prose after a closing parenthesis in a list item.
  const inline = /!?\[[^\]]*]\((?:<([^>]+)>|([^\s)]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\)/g;
  let match;
  while ((match = inline.exec(visible)) !== null) {
    targets.push({ target: normalizeMarkdownTarget(match[1] || match[2]), index: match.index });
  }

  const referenceDefinition = /^\s*\[[^\]]+]:\s*(\S+)/gm;
  while ((match = referenceDefinition.exec(visible)) !== null) {
    targets.push({ target: normalizeMarkdownTarget(match[1]), index: match.index });
  }

  return targets;
}

function extractWikiTargets(contents) {
  const targets = [];
  const visible = visibleMarkdown(contents);
  const wikilink = /(?<!!)\[\[([^\]]+)\]\]/g;
  let match;
  while ((match = wikilink.exec(visible)) !== null) {
    const target = match[1].split('|', 1)[0].trim();
    if (target) targets.push({ target, index: match.index });
  }
  return targets;
}

function slugIndex(files) {
  const result = new Map();
  for (const filePath of files) {
    const contents = fs.readFileSync(filePath, 'utf8');
    const frontmatter = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) continue;
    const slugMatch = frontmatter[1].match(/^slug:\s*["']?([^\r\n"']+)["']?\s*$/m);
    if (!slugMatch) continue;
    const slug = slugMatch[1].trim();
    if (!result.has(slug)) result.set(slug, []);
    result.get(slug).push(filePath);
  }
  for (const [slug, matches] of result) {
    if (matches.length < 2) continue;
    const canonical = matches.filter((filePath) => /(?:^|[\\/])(story|epic|project|project-intent|project-plan)\.md$/i.test(filePath));
    if (canonical.length === 1) result.set(slug, canonical);
  }
  return result;
}

function isExternal(target) {
  return /^(?:https?:|mailto:|tel:)/i.test(target);
}

function validateExternal(target) {
  if (/^(?:mailto:|tel:)/i.test(target)) return null;
  try {
    const parsed = new URL(target);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return `Unsupported external link scheme: ${parsed.protocol}`;
    }
  } catch {
    return `Invalid external URL: ${target}`;
  }
  return null;
}

function splitFragment(target) {
  const hashIndex = target.indexOf('#');
  const beforeHash = hashIndex === -1 ? target : target.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : target.slice(hashIndex + 1);
  const queryIndex = beforeHash.indexOf('?');
  return {
    filePart: queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex),
    fragment,
  };
}

function checkLocalTarget({ repoRoot, sourcePath, target, line, anchorCache }) {
  if (!target || target === '#') return 'Empty link target.';
  if (isExternal(target)) return validateExternal(target);
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return `Unsupported link scheme: ${target}`;
  if (target.startsWith('//')) return `Protocol-relative links are not allowed: ${target}`;

  const { filePart, fragment } = splitFragment(target);
  let destination = sourcePath;
  if (filePart) {
    const decoded = decodeURIComponent(filePart);
    if (path.isAbsolute(decoded)) return `Absolute local link is not allowed: ${target}`;
    destination = path.resolve(path.dirname(sourcePath), decoded);
    if (!isContained(repoRoot, destination)) return `Local link escapes repository: ${target}`;
    if (!fs.existsSync(destination)) return `Missing local target: ${toPosix(path.relative(repoRoot, destination))}`;
  }

  if (fragment) {
    const anchor = decodeURIComponent(fragment).toLowerCase();
    if (!anchorsFor(destination, anchorCache).has(anchor)) {
      return `Missing anchor '#${fragment}' in ${toPosix(path.relative(repoRoot, destination))}`;
    }
  }
  return null;
}

function checkWikiTarget({ repoRoot, sourcePath, target, line, slugTargets, anchorCache }) {
  const { filePart: slug, fragment } = splitFragment(target);
  const matches = slugTargets.get(slug) || [];
  if (matches.length === 0) return `Missing wikilink target: [[${target}]]`;
  if (matches.length > 1) return `Ambiguous wikilink target: [[${target}]]`;
  if (fragment && !anchorsFor(matches[0], anchorCache).has(decodeURIComponent(fragment).toLowerCase())) {
    return `Missing anchor '#${fragment}' in wikilink target ${toPosix(path.relative(repoRoot, matches[0]))}`;
  }
  return null;
}

function checkDocumentation({ repoRoot = REPO_ROOT, files = activeMarkdownFiles(repoRoot) } = {}) {
  const errors = [];
  const allMarkdown = [];
  walkMarkdown(path.join(repoRoot, 'docs'), allMarkdown);
  for (const rootFile of ['README.md', 'SECURITY.md']) {
    const candidate = path.join(repoRoot, rootFile);
    if (fs.existsSync(candidate)) allMarkdown.push(candidate);
  }
  const slugs = slugIndex(allMarkdown);
  const anchors = new Map();

  for (const sourcePath of files) {
    const contents = fs.readFileSync(sourcePath, 'utf8');
    for (const reference of extractMarkdownTargets(contents)) {
      const error = checkLocalTarget({
        repoRoot,
        sourcePath,
        target: reference.target,
        line: lineAt(contents, reference.index),
        anchorCache: anchors,
      });
      if (error) errors.push(`${toPosix(path.relative(repoRoot, sourcePath))}:${lineAt(contents, reference.index)}: ${error}`);
    }
    for (const reference of extractWikiTargets(contents)) {
      const error = checkWikiTarget({
        repoRoot,
        sourcePath,
        target: reference.target,
        line: lineAt(contents, reference.index),
        slugTargets: slugs,
        anchorCache: anchors,
      });
      if (error) errors.push(`${toPosix(path.relative(repoRoot, sourcePath))}:${lineAt(contents, reference.index)}: ${error}`);
    }
  }
  return { files, errors };
}

function main() {
  const result = checkDocumentation();
  if (result.errors.length > 0) {
    console.error(`[ERROR] ${result.errors.length} broken active documentation link(s):`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[OK] Checked ${result.files.length} active Markdown files; local links and anchors resolve.`);
  console.log(`[INFO] External URLs are syntax-checked only; excluded historical roots: ${HISTORICAL_EXCLUSIONS.join(', ')}.`);
}

if (require.main === module) main();

module.exports = {
  ACTIVE_ROOTS,
  HISTORICAL_EXCLUSIONS,
  activeMarkdownFiles,
  checkDocumentation,
  githubAnchor,
};

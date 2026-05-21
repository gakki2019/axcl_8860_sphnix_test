const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');

function getCandidateExecutables() {
  const primaryExecutable = chromium.executablePath();
  const cacheRoot = path.dirname(path.dirname(path.dirname(primaryExecutable)));
  const candidates = [primaryExecutable];

  try {
    for (const entry of fs.readdirSync(cacheRoot)) {
      if (!entry.startsWith('chromium_headless_shell-')) {
        continue;
      }
      const shellPath = path.join(cacheRoot, entry, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
      if (fs.existsSync(shellPath)) {
        candidates.push(shellPath);
      }
    }
  } catch (error) {
    // Ignore cache probing failures and keep the primary executable result.
  }

  return candidates;
}

function inspectExecutable(executablePath) {
  if (process.platform === 'darwin') {
    return {
      executablePath,
      ok: true,
      missingLibraries: [],
      diagnostics: ['Skipping ldd check on macOS'],
      nonElf: false,
    };
  }
  const result = spawnSync('ldd', [executablePath], { encoding: 'utf8' });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const diagnostics = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (result.error) {
    return {
      executablePath,
      ok: false,
      missingLibraries: [],
      diagnostics: [`ldd execution failed: ${result.error.message}`],
      nonElf: false,
    };
  }

  const nonElf = diagnostics.some((line) => line.includes('not an ELF file'));
  const missingLibraries = diagnostics
    .filter((line) => line.includes('=> not found'))
    .map((line) => line.split('=>')[0].trim());

  return {
    executablePath,
    ok: !nonElf && missingLibraries.length === 0 && result.status === 0,
    missingLibraries,
    diagnostics,
    nonElf,
  };
}

function probeExecutable(executablePath) {
  const result = spawnSync(executablePath, ['--version'], { encoding: 'utf8' });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const diagnostics = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const missingLibraries = diagnostics
    .map((line) => {
      const match = line.match(/error while loading shared libraries: ([^:]+):/i);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  return {
    executablePath,
    missingLibraries,
    diagnostics,
    ok: result.status === 0 && missingLibraries.length === 0,
  };
}

function getChromiumPreflight() {
  const inspections = getCandidateExecutables().map(inspectExecutable);
  const relevantInspections = inspections.filter((inspection) => !inspection.nonElf);
  const probes = getCandidateExecutables().map(probeExecutable);
  const missingLibraries = [
    ...new Set([
      ...relevantInspections.flatMap((inspection) => inspection.missingLibraries),
      ...probes.flatMap((probe) => probe.missingLibraries),
    ]),
  ];
  const failingCandidate =
    probes.find((probe) => probe.missingLibraries.length > 0) ||
    probes.find((probe) => !probe.ok) ||
    relevantInspections.find((inspection) => !inspection.ok) ||
    inspections[0];

  return {
    ok:
      missingLibraries.length === 0 &&
      relevantInspections.length > 0 &&
      relevantInspections.every((inspection) => inspection.ok) &&
      probes.every((probe) => probe.ok),
    executablePath: failingCandidate.executablePath,
    checkedExecutables: inspections.map((inspection) => inspection.executablePath),
    missingLibraries,
    diagnostics: [...inspections.flatMap((inspection) => inspection.diagnostics), ...probes.flatMap((probe) => probe.diagnostics)],
  };
}

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(getChromiumPreflight(), null, 2)}\n`);
}

module.exports = {
  getChromiumPreflight,
};

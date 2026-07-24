#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PID_FILE = path.join(ROOT, 'node_modules', '.cache', 'interactive-dev.pid');
const SELF_PID = process.pid;

// Enable raw mode for keyboard input
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  lightBlueBg: '\x1b[104m',
  white: '\x1b[97m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
};

let nxChild = null;
let shuttingDown = false;

function restoreTerminal() {
  if (process.stdin.isTTY) {
    try {
      process.stdin.setRawMode(false);
    } catch {
      // ignore
    }
  }
}

function sleepSync(ms) {
  const seconds = Math.max(0.1, ms / 1000);
  try {
    execSync(`sleep ${seconds}`, { stdio: 'ignore' });
  } catch {
    // ignore
  }
}

function ensureCacheDir() {
  fs.mkdirSync(path.dirname(PID_FILE), { recursive: true });
}

function readPidFile() {
  try {
    const raw = fs.readFileSync(PID_FILE, 'utf8').trim();
    const pid = Number(raw);
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

function writePidFile(pid) {
  ensureCacheDir();
  fs.writeFileSync(PID_FILE, `${pid}\n`, 'utf8');
}

function clearPidFile() {
  try {
    fs.unlinkSync(PID_FILE);
  } catch {
    // ignore
  }
}

function isProcessAlive(pid) {
  if (!pid || pid === SELF_PID) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function listProcesses() {
  try {
    const out = execSync('ps -eo pid=,ppid=,args=', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(\d+)\s+(\d+)\s+(.*)$/);
        if (!match) return null;
        return {
          pid: Number(match[1]),
          ppid: Number(match[2]),
          args: match[3],
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function collectDescendantPids(rootPid, processes) {
  const childrenByParent = new Map();
  for (const proc of processes) {
    if (!childrenByParent.has(proc.ppid)) {
      childrenByParent.set(proc.ppid, []);
    }
    childrenByParent.get(proc.ppid).push(proc.pid);
  }

  const collected = new Set();
  const stack = [rootPid];
  while (stack.length > 0) {
    const pid = stack.pop();
    if (collected.has(pid)) continue;
    collected.add(pid);
    const children = childrenByParent.get(pid) || [];
    for (const child of children) stack.push(child);
  }
  return [...collected];
}

function collectAncestorPids(pid, processes) {
  const byPid = new Map(processes.map((proc) => [proc.pid, proc]));
  const ancestors = new Set();
  let current = byPid.get(pid);
  while (current && current.ppid && !ancestors.has(current.ppid)) {
    ancestors.add(current.ppid);
    current = byPid.get(current.ppid);
  }
  return ancestors;
}

function getProtectedPids(processes) {
  const protectedPids = new Set([SELF_PID, ...collectAncestorPids(SELF_PID, processes)]);
  return protectedPids;
}

function killPids(pids, signal = 'SIGTERM') {
  const unique = [...new Set(pids)].filter(
    (pid) => pid && pid !== SELF_PID && isProcessAlive(pid)
  );

  for (const pid of unique) {
    try {
      // Prefer process-group kill when the pid is a group leader.
      process.kill(-pid, signal);
    } catch {
      try {
        process.kill(pid, signal);
      } catch {
        // already gone
      }
    }
  }

  return unique.length;
}

function forceKillPids(pids) {
  sleepSync(400);
  const stillAlive = pids.filter((pid) => isProcessAlive(pid));
  if (stillAlive.length === 0) return;
  killPids(stillAlive, 'SIGKILL');
}

function getPidsListeningOnPort(port) {
  const pids = new Set();

  try {
    const out = execSync(`ss -tlnp 'sport = :${port}'`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    for (const match of out.matchAll(/pid=(\d+)/g)) {
      pids.add(Number(match[1]));
    }
  } catch {
    // ss may be unavailable; fall through
  }

  if (pids.size === 0) {
    try {
      const out = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      for (const line of out.split('\n')) {
        const pid = Number(line.trim());
        if (pid) pids.add(pid);
      }
    } catch {
      // ignore
    }
  }

  return [...pids];
}

function discoverAppPort(appName) {
  if (appName === 'strapi') {
    for (const envFile of ['.env', '.env.development', '.env.local']) {
      const envPath = path.join(ROOT, 'apps', 'strapi', envFile);
      if (!fs.existsSync(envPath)) continue;
      const match = fs.readFileSync(envPath, 'utf8').match(/^PORT=(\d+)\s*$/m);
      if (match) return Number(match[1]);
    }
    return 1337;
  }

  for (const fileName of ['vite.config.ts', 'vite.config.js', 'vite.config.mts']) {
    const configPath = path.join(ROOT, 'apps', appName, fileName);
    if (!fs.existsSync(configPath)) continue;
    const content = fs.readFileSync(configPath, 'utf8');
    const serverBlock = content.match(/server\s*:\s*\{([\s\S]*?)\}/);
    const scope = serverBlock ? serverBlock[1] : content;
    const match = scope.match(/port\s*:\s*(\d+)/);
    if (match) return Number(match[1]);
  }

  return null;
}

function findExistingServePids(selectedApps) {
  const processes = listProcesses();
  const protectedPids = getProtectedPids(processes);
  const matched = new Set();
  const selectedSet = new Set(selectedApps);

  const mentionsSelectedApp = (args) =>
    selectedApps.some(
      (app) =>
        args.includes(`${app}:serve`) ||
        args.includes(`apps/${app}`) ||
        args.includes(`/${app}/`) ||
        // nx -p app1,app2,... list
        new RegExp(`(?:^|[,\\s])${app}(?=,|\\s|$)`).test(args)
    );

  for (const proc of processes) {
    if (protectedPids.has(proc.pid)) continue;
    const args = proc.args;

    const isInteractiveDev =
      args.includes('interactive-dev.js') && !args.includes('vim');
    const isRunManyServe =
      /run-many/.test(args) &&
      /\bserve\b/.test(args) &&
      (mentionsSelectedApp(args) ||
        args.includes('orwa-monorepo') ||
        args.includes(ROOT));

    if (isInteractiveDev || isRunManyServe) {
      for (const pid of collectDescendantPids(proc.pid, processes)) {
        if (!protectedPids.has(pid)) matched.add(pid);
      }
      matched.add(proc.pid);
      continue;
    }

    for (const app of selectedSet) {
      const appPath = `apps/${app}`;
      const isAppServe =
        args.includes(`${app}:serve`) ||
        (args.includes(appPath) &&
          (/\bvite\b/.test(args) ||
            /\bstrapi\b/.test(args) ||
            args.includes('run-executor.js') ||
            args.includes('fork.js') ||
            args.includes('strapi develop')));

      if (isAppServe) {
        matched.add(proc.pid);
      }
    }
  }

  return [...matched].filter((pid) => !protectedPids.has(pid));
}

function stopExistingDevProcesses(selectedApps) {
  console.log('\n🔍 Checking for existing/orphaned dev processes...');

  const processes = listProcesses();
  const protectedPids = getProtectedPids(processes);
  const pidsToKill = new Set();

  const previousPid = readPidFile();
  if (previousPid && isProcessAlive(previousPid) && !protectedPids.has(previousPid)) {
    console.log(`   Found previous session PID ${previousPid}`);
    for (const pid of collectDescendantPids(previousPid, processes)) {
      if (!protectedPids.has(pid)) pidsToKill.add(pid);
    }
    pidsToKill.add(previousPid);
  } else if (previousPid && !isProcessAlive(previousPid)) {
    clearPidFile();
  }

  for (const pid of findExistingServePids(selectedApps)) {
    pidsToKill.add(pid);
  }

  // Free configured ports for selected apps (covers orphans that lost their cmdline)
  const ports = selectedApps
    .map((app) => ({ app, port: discoverAppPort(app) }))
    .filter((entry) => entry.port);

  for (const { app, port } of ports) {
    const listeners = getPidsListeningOnPort(port);
    if (listeners.length > 0) {
      console.log(
        `   Port ${port} (${app}) still in use by PID(s): ${listeners.join(', ')}`
      );
      for (const pid of listeners) {
        if (!protectedPids.has(pid)) pidsToKill.add(pid);
      }
    }
  }

  for (const pid of protectedPids) {
    pidsToKill.delete(pid);
  }

  if (pidsToKill.size === 0) {
    console.log('   No conflicting processes found');
    return;
  }

  const pidList = [...pidsToKill];
  console.log(
    `   Stopping ${pidList.length} process(es): ${pidList.slice(0, 12).join(', ')}${
      pidList.length > 12 ? ', …' : ''
    }`
  );

  killPids(pidList, 'SIGTERM');
  forceKillPids(pidList);
  clearPidFile();

  // Brief wait so TIME_WAIT / TIME_WAIT-like binds can clear
  sleepSync(500);

  const stillBusy = ports.filter(
    ({ port }) => getPidsListeningOnPort(port).length > 0
  );
  if (stillBusy.length > 0) {
    console.log(
      `${colors.yellow}   Warning: ports still busy after cleanup: ${stillBusy
        .map((entry) => `${entry.app}:${entry.port}`)
        .join(', ')}${colors.reset}`
    );
    for (const { port } of stillBusy) {
      killPids(getPidsListeningOnPort(port), 'SIGKILL');
    }
    sleepSync(300);
  } else {
    console.log('   ✅ Previous processes cleared');
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  restoreTerminal();

  if (nxChild && nxChild.pid && isProcessAlive(nxChild.pid)) {
    console.log('\n🛑 Stopping development processes...');
    const processes = listProcesses();
    const tree = collectDescendantPids(nxChild.pid, processes);
    killPids([nxChild.pid, ...tree], 'SIGTERM');
    forceKillPids([nxChild.pid, ...tree]);
  }

  clearPidFile();
  process.exit(exitCode);
}

// Discover apps by scanning the apps directory
function discoverApps() {
  const appsDir = path.join(ROOT, 'apps');
  const appFolders = fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        !dirent.name.includes('-e2e') &&
        dirent.name !== 'node_modules'
    )
    .map((dirent) => dirent.name)
    .filter((appName) => {
      // Only list apps that actually have an nx serve target / project.json
      return fs.existsSync(path.join(appsDir, appName, 'project.json'));
    });

  return appFolders.map((appName) => ({
    name: appName,
    selected: appName === 'strapi',
    required: appName === 'strapi',
  }));
}

const apps = discoverApps();

let currentPosition = 0;
const runAllOption = {
  name: 'Run all applications',
  selected: false,
  required: false,
};
const startOption = {
  name: '✅ Start selected applications',
  selected: false,
  required: false,
};
const quitOption = { name: '❌ Quit', selected: false, required: false };

const options = [...apps, runAllOption, startOption, quitOption];

function renderMenu() {
  console.clear();

  console.log('🚀 ORWA Interactive Development Environment');
  console.log('==========================================');
  console.log(
    'Use arrow keys to navigate, Space to select/deselect, Enter to confirm'
  );
  console.log('');

  options.forEach((option, index) => {
    const isCurrent = index === currentPosition;
    const prefix = isCurrent ? '➤ ' : '  ';
    const checkbox = option.selected ? '[✓]' : '[ ]';
    const suffix = option.required ? ' (required)' : '';

    let line;

    if (index >= apps.length) {
      line = `${prefix}${option.name}`;
    } else {
      const port = discoverAppPort(option.name);
      const portSuffix = port ? ` (:${port})` : '';
      line = `${prefix}${checkbox} ${option.name}${suffix}${portSuffix}`;
    }

    if (isCurrent) {
      console.log(
        `${colors.lightBlueBg}${colors.white}${line}${colors.reset}`
      );
    } else {
      console.log(line);
    }
  });
}

function startApps() {
  if (runAllOption.selected) {
    apps.forEach((app) => {
      app.selected = true;
    });
  }

  const selectedApps = apps.filter((app) => app.selected).map((app) => app.name);

  if (selectedApps.length === 0) {
    console.error('❌ No applications selected');
    process.exit(1);
  }

  console.clear();
  console.log('🚀 ORWA Interactive Development Environment');
  console.log('==========================================');

  stopExistingDevProcesses(selectedApps);

  console.log(`\n✅ Starting Docker services...`);
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
    console.log('✅ Docker services started successfully');
  } catch (error) {
    console.error('❌ Failed to start Docker services:', error.message);
    process.exit(1);
  }

  const projectsParam = selectedApps.join(',');
  console.log(`\n🚀 Starting selected applications: ${projectsParam}`);

  // Serve tasks are continuous (never finish), so every selected app needs its
  // own task-runner thread. Nx defaults to --parallel=3, which starves any app
  // beyond the first three with "Waiting for available thread...". Add headroom
  // for requisite one-shot tasks (e.g. dependency builds).
  const parallelism = selectedApps.length + 3;
  const nxArgs = [
    'nx',
    'run-many',
    '-t',
    'serve',
    '-p',
    projectsParam,
    `--parallel=${parallelism}`,
  ];
  console.log(`\nRunning command: npx ${nxArgs.join(' ')}`);

  nxChild = spawn('npx', nxArgs, {
    stdio: 'inherit',
    shell: false,
    // New process group so we can kill the whole tree on shutdown (Unix).
    detached: process.platform !== 'win32',
    cwd: ROOT,
    env: process.env,
  });

  writePidFile(nxChild.pid);
  console.log(
    `${colors.dim}   Session PID ${nxChild.pid} (saved to ${path.relative(
      ROOT,
      PID_FILE
    )})${colors.reset}`
  );

  nxChild.on('error', (error) => {
    console.error(`❌ Error starting applications: ${error.message}`);
    clearPidFile();
    process.exit(1);
  });

  nxChild.on('exit', (code, signal) => {
    clearPidFile();
    if (shuttingDown) return;
    if (signal) {
      console.error(`❌ Process killed by signal ${signal}`);
      process.exit(1);
    }
    if (code !== 0 && code != null) {
      console.error(`❌ Process exited with code ${code}`);
      process.exit(code);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));
process.on('SIGHUP', () => shutdown(129));
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  shutdown(1);
});

// Initial render
renderMenu();

process.stdin.on('keypress', (str, key) => {
  if (!key) return;

  if (key.name === 'c' && key.ctrl) {
    shutdown(130);
  } else if (key.name === 'up' && currentPosition > 0) {
    currentPosition--;
    renderMenu();
  } else if (key.name === 'down' && currentPosition < options.length - 1) {
    currentPosition++;
    renderMenu();
  } else if (key.name === 'space') {
    if (currentPosition < apps.length) {
      if (
        !(
          options[currentPosition].required &&
          options[currentPosition].selected
        )
      ) {
        options[currentPosition].selected = !options[currentPosition].selected;
      }
    } else if (currentPosition === apps.length) {
      runAllOption.selected = !runAllOption.selected;
    }
    renderMenu();
  } else if (key.name === 'return') {
    if (currentPosition === options.length - 1) {
      restoreTerminal();
      process.exit(0);
    } else if (currentPosition === options.length - 2) {
      process.stdin.setRawMode(false);
      process.stdin.removeAllListeners('keypress');
      startApps();
    } else if (currentPosition === apps.length) {
      runAllOption.selected = !runAllOption.selected;
      renderMenu();
    } else if (
      !(options[currentPosition].required && options[currentPosition].selected)
    ) {
      options[currentPosition].selected = !options[currentPosition].selected;
      renderMenu();
    }
  }
});

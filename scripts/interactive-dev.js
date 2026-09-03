#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PID_FILE = path.join(ROOT, 'node_modules', '.cache', 'interactive-dev.pid');
const SELF_PID = process.pid;
const ARGV = process.argv.slice(2);
const FLAG_CHECK_PORTS = ARGV.includes('--check-ports');
const FLAG_FREE_PORTS = ARGV.includes('--free-ports');
const CLI_APPS = ARGV.filter((arg) => !arg.startsWith('--'));
const INTERACTIVE = !FLAG_CHECK_PORTS && !FLAG_FREE_PORTS;

// Enable raw mode for keyboard input (interactive menu only)
if (INTERACTIVE) {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  lightBlueBg: '\x1b[104m',
  white: '\x1b[97m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

let nxChild = null;
const remapChildren = [];
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

function getProcessCwd(pid) {
  try {
    return fs.readlinkSync(`/proc/${pid}/cwd`);
  } catch {
    return '';
  }
}

function getProcessCmdline(pid) {
  try {
    return fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8').replace(/\0/g, ' ').trim();
  } catch {
    return '';
  }
}

function isRepoProcess(pid) {
  const cwd = getProcessCwd(pid);
  return cwd === ROOT || cwd.startsWith(`${ROOT}${path.sep}`);
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
      } catch (error) {
        if (error && error.code === 'EPERM') {
          console.log(
            `${colors.yellow}   PID ${pid} is not killable from WSL (${error.code})${colors.reset}`
          );
        }
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

function pythonBindCheck(code) {
  try {
    execSync(`python3 -c ${JSON.stringify(code)}`, { stdio: 'ignore', timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

function isPortBindable(port) {
  const parsed = Number(port);
  if (!Number.isInteger(parsed) || parsed <= 0) return true;
  // Vite may bind 127.0.0.1, 0.0.0.0, or ::1 (host: 'localhost').
  if (
    !pythonBindCheck(
      `import socket; s=socket.socket(); s.bind(('127.0.0.1', ${parsed})); s.close()`
    )
  ) {
    return false;
  }
  if (
    !pythonBindCheck(
      `import socket; s=socket.socket(); s.bind(('0.0.0.0', ${parsed})); s.close()`
    )
  ) {
    return false;
  }
  const ipv6Available = pythonBindCheck(
    'import socket; socket.socket(socket.AF_INET6, socket.SOCK_STREAM).close()'
  );
  if (
    ipv6Available &&
    !pythonBindCheck(
      `import socket; s=socket.socket(socket.AF_INET6, socket.SOCK_STREAM); s.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 1); s.bind(('::1', ${parsed})); s.close()`
    )
  ) {
    return false;
  }
  return true;
}

function extractBalancedObjectBody(content, key) {
  const match = content.match(new RegExp(`${key}\\s*:\\s*\\{`));
  if (!match || match.index == null) return null;
  const openAt = match.index + match[0].length - 1;
  let depth = 0;
  for (let i = openAt; i < content.length; i++) {
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return content.slice(openAt + 1, i);
    }
  }
  return null;
}

function decodePsOutput(buf) {
  if (!buf) return '';
  if (!Buffer.isBuffer(buf)) return String(buf);
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString('utf16le');
  }
  if (buf.length >= 2 && buf[1] === 0x00 && buf[3] === 0x00) {
    return buf.toString('utf16le');
  }
  return buf.toString('utf8');
}

function canRunPowershell() {
  try {
    execSync('command -v powershell.exe', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runPowershell(script, { timeout = 45000, label = 'powershell' } = {}) {
  if (!canRunPowershell()) return '';
  try {
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    const out = execSync(
      `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${encoded}`,
      {
        encoding: 'buffer',
        timeout,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    return decodePsOutput(out).trim();
  } catch (error) {
    const stdout = decodePsOutput(error.stdout).trim();
    const stderr = decodePsOutput(error.stderr).trim();
    if (error.killed) {
      console.log(
        `${colors.yellow}   ${label} timed out after ${timeout}ms${colors.reset}`
      );
    } else if (stderr) {
      const first = stderr.split(/\r?\n/).find(Boolean);
      if (first) {
        console.log(`${colors.dim}   ${label}: ${first}${colors.reset}`);
      }
    }
    return stdout;
  }
}

function parsePowershellJson(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw).replace(/^\uFEFF/, ''));
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function parseWindowsListenerRows(raw) {
  return parsePowershellJson(raw)
    .map((row) => ({
      port: Number(row.port),
      pid: Number(row.pid),
      state: String(row.state || ''),
      name: String(row.name || ''),
      commandLine: String(row.commandLine || ''),
      hasWindow: Boolean(row.hasWindow),
    }))
    .filter((row) => Number.isInteger(row.port) && Number.isInteger(row.pid));
}

function parseNetstatTcpRows(text, portSet) {
  const rows = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5 || !/^TCP$/i.test(parts[0])) continue;
    const state = String(parts[3] || '');
    if (!/^(LISTENING|TIME_WAIT)$/i.test(state)) continue;
    const local = parts[1] || '';
    const colon = local.lastIndexOf(':');
    if (colon < 0) continue;
    const port = Number(local.slice(colon + 1));
    if (!portSet.has(port)) continue;
    const pid = Number(parts[4]);
    if (!Number.isInteger(pid)) continue;
    rows.push({
      port,
      pid,
      state: /^listen/i.test(state) ? 'Listen' : 'TimeWait',
      name: '',
      commandLine: '',
      hasWindow: false,
    });
  }
  return rows;
}

function getWindowsListenersViaNetstatExe(ports) {
  const portSet = new Set(ports);
  const candidates = ['/mnt/c/Windows/System32/netstat.exe', 'netstat.exe'];
  for (const bin of candidates) {
    try {
      if (bin.startsWith('/') && !fs.existsSync(bin)) continue;
      const command = bin.startsWith('/') ? `${JSON.stringify(bin)} -ano -p tcp` : 'netstat.exe -ano -p tcp';
      const out = execSync(command, {
        encoding: 'utf8',
        timeout: 15000,
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return parseNetstatTcpRows(out, portSet);
    } catch {
      // try next
    }
  }
  return [];
}

function getWindowsListenersViaPowershell(ports) {
  // Never name a PowerShell variable $pid — $PID is a read-only automatic
  // variable. Assigning it throws, SilentlyContinue swallows that, and the
  // query looks empty (the post-reboot "ghost port" abort).
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new()
$ports = @(${ports.join(',')})
$rows = New-Object System.Collections.Generic.List[object]
$conns = Get-NetTCPConnection -LocalPort $ports -State Listen,TimeWait
foreach ($conn in $conns) {
  $rows.Add([PSCustomObject]@{
    port = [int]$conn.LocalPort
    pid = [int]$conn.OwningProcess
    state = [string]$conn.State
  })
}
if ($rows.Count -eq 0) { '' } else { $rows | ConvertTo-Json -Compress }
`.trim();
  return parseWindowsListenerRows(
    runPowershell(script, { label: 'Windows port query' })
  );
}

function enrichWindowsProcesses(pids) {
  const unique = [...new Set(pids)].filter((id) => Number.isInteger(id) && id > 0);
  const map = new Map();
  if (unique.length === 0) return map;
  const script = `
$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new()
$ids = @(${unique.join(',')})
$rows = New-Object System.Collections.Generic.List[object]
foreach ($procId in $ids) {
  $gp = Get-Process -Id $procId -ErrorAction SilentlyContinue
  $cim = Get-CimInstance Win32_Process -Filter "ProcessId=$procId"
  $cmd = [string]$cim.CommandLine
  if ($cmd.Length -gt 500) { $cmd = $cmd.Substring(0, 500) }
  $hasWindow = $false
  if ($gp) { $hasWindow = ($gp.MainWindowHandle -ne [IntPtr]::Zero) }
  $name = ''
  if ($cim -and $cim.Name) { $name = [string]$cim.Name }
  elseif ($gp) { $name = [string]$gp.Name }
  $rows.Add([PSCustomObject]@{
    pid = [int]$procId
    name = $name
    commandLine = $cmd
    hasWindow = [bool]$hasWindow
  })
}
if ($rows.Count -eq 0) { '' } else { $rows | ConvertTo-Json -Compress }
`.trim();
  for (const row of parsePowershellJson(
    runPowershell(script, { label: 'Windows process enrich' })
  )) {
    const pid = Number(row.pid);
    if (!Number.isInteger(pid)) continue;
    map.set(pid, {
      name: String(row.name || ''),
      commandLine: String(row.commandLine || ''),
      hasWindow: Boolean(row.hasWindow),
    });
  }
  return map;
}

function getWindowsPortListeners(ports) {
  const uniquePorts = [...new Set(ports)].filter((port) => Number.isInteger(port) && port > 0);
  if (uniquePorts.length === 0) return [];

  const byKey = new Map();
  const add = (row) => {
    const port = Number(row.port);
    const pid = Number(row.pid);
    const state = String(row.state || '');
    if (!Number.isInteger(port) || !Number.isInteger(pid)) return;
    const key = `${port}:${pid}:${state.toLowerCase()}`;
    if (!byKey.has(key)) {
      byKey.set(key, {
        port,
        pid,
        state,
        name: String(row.name || ''),
        commandLine: String(row.commandLine || ''),
        hasWindow: Boolean(row.hasWindow),
      });
    }
  };

  for (const row of getWindowsListenersViaNetstatExe(uniquePorts)) add(row);
  for (const row of getWindowsListenersViaPowershell(uniquePorts)) add(row);

  const merged = [...byKey.values()];
  const enrich = enrichWindowsProcesses(merged.map((row) => row.pid));
  return merged.map((row) => {
    const extra = enrich.get(row.pid) || {};
    return {
      ...row,
      name: extra.name || row.name,
      commandLine: extra.commandLine || row.commandLine,
      hasWindow: Boolean(extra.hasWindow),
    };
  });
}

let excludedRangesCache = null;
function getHyperVExcludedRanges() {
  if (excludedRangesCache) return excludedRangesCache;
  const raw = runPowershell(
    '[Console]::OutputEncoding = [Text.UTF8Encoding]::new(); netsh interface ipv4 show excludedportrange protocol=tcp',
    { label: 'netsh excludedportrange' }
  );
  const ranges = [];
  for (const line of String(raw || '').split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)/);
    if (match) ranges.push({ start: Number(match[1]), end: Number(match[2]) });
  }
  excludedRangesCache = ranges;
  return ranges;
}

function excludedRangeFor(port) {
  return getHyperVExcludedRanges().find((range) => port >= range.start && port <= range.end) || null;
}

function windowsProcessName(listener) {
  return String(listener.name || '')
    .replace(/\.exe$/i, '')
    .toLowerCase();
}

function isCursorOrCodeOwner(listener) {
  const name = windowsProcessName(listener);
  return name === 'cursor' || name === 'code' || name === 'code - insiders';
}

function isSafeWindowsPortOwner(listener) {
  const pid = Number(listener.pid);
  if (!Number.isInteger(pid) || pid <= 4) return false;

  const name = windowsProcessName(listener);
  if (['node', 'wslrelay', 'vite'].includes(name)) return true;

  // WSL mirrored mode: Cursor/VS Code auto-forward leftover sockets are owned
  // by the shared-process utility (NodeService), not the main window.
  // Killing the main Cursor/Code window would close the editor — never do that.
  if (isCursorOrCodeOwner(listener)) {
    const cmd = String(listener.commandLine || '');
    return cmd.includes('--type=utility') && cmd.includes('node.mojom.NodeService');
  }
  return false;
}

function isIgnorableWindowsHolder(listener) {
  // Auto-forwards persist across host reboot. Vite cannot bind 127.0.0.1, but
  // aborting the whole session is the false-positive after a clean boot.
  // NodeService is still auto-killed when we can see it.
  return isCursorOrCodeOwner(listener);
}

function killWindowsPids(pids) {
  const unique = [...new Set(pids)].filter((pid) => Number.isInteger(pid) && pid > 0);
  if (unique.length === 0) return;
  runPowershell(
    `$ErrorActionPreference = 'SilentlyContinue'; ${unique
      .map((pid) => `Stop-Process -Id ${pid} -Force`)
      .join('; ')}`
  );
}

function freeWindowsHeldPorts(portEntries) {
  const busy = portEntries.filter(({ port }) => !isPortBindable(port));
  if (busy.length === 0) return [];

  const listeners = getWindowsPortListeners(busy.map((entry) => entry.port));
  const listening = listeners.filter((row) => /^listen$/i.test(row.state));
  const timeWait = listeners.filter((row) => /timewait/i.test(row.state));

  if (listeners.length === 0) {
    for (const { app, port } of busy) {
      console.log(
        `${colors.yellow}   Port ${port} (${app}) is not bindable, but no WSL or Windows socket was found${colors.reset}`
      );
    }
  }

  const safePids = new Set();
  for (const listener of listening) {
    const app =
      portEntries.find((entry) => entry.port === listener.port)?.app || 'unknown';
    const label = `${listener.name || 'unknown'} PID ${listener.pid}`;
    if (isSafeWindowsPortOwner(listener)) {
      console.log(
        `   Port ${listener.port} (${app}) held by Windows ${label} — stopping it`
      );
      safePids.add(listener.pid);
    } else {
      console.log(
        `${colors.yellow}   Port ${listener.port} (${app}) held by Windows ${label} (not auto-killed)${colors.reset}`
      );
    }
  }

  if (timeWait.length > 0) {
    const ports = [...new Set(timeWait.map((row) => row.port))].join(', ');
    console.log(`   Windows TIME_WAIT still occupying port(s) ${ports}`);
  }

  if (safePids.size > 0) {
    killWindowsPids([...safePids]);
    sleepSync(600);
  }

  const stillBusy = portEntries.filter(({ port }) => !isPortBindable(port));
  if (stillBusy.length === 0) return [];

  const waitable = stillBusy.filter(({ port }) => {
    if (excludedRangeFor(port)) return false;
    const holders = listening.filter((row) => row.port === port);
    if (holders.some((row) => !isSafeWindowsPortOwner(row))) return false;
    // Only wait when we actually saw TIME_WAIT. An empty holder list used to
    // wait 90s for a "ghost" that was really Cursor (query bug) or Hyper-V.
    return timeWait.some((row) => row.port === port);
  });

  if (waitable.length === 0) return stillBusy;

  // Mirrored WSL treats Windows TIME_WAIT as EADDRINUSE even with no listener.
  console.log(
    `   Waiting for ${waitable
      .map((entry) => `${entry.app}:${entry.port}`)
      .join(', ')} to become bindable (Windows TIME_WAIT)...`
  );
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    sleepSync(1000);
    if (waitable.every(({ port }) => isPortBindable(port))) break;
  }

  return portEntries.filter(({ port }) => !isPortBindable(port));
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
    const serverBlock = extractBalancedObjectBody(content, 'server') || content;
    const match = serverBlock.match(/port\s*:\s*(\d+)/);
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

    // Orphans often have a bare `vite` / `run-executor.js` cmdline with no app
    // path — identify them by cwd under this repo instead.
    if (
      isRepoProcess(proc.pid) &&
      (/\bvite\b/.test(args) ||
        args.includes('run-executor.js') ||
        args.includes('fork.js') ||
        args.includes('strapi develop'))
    ) {
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

function collectPortEntries(selectedApps) {
  return selectedApps
    .map((app) => ({ app, port: discoverAppPort(app) }))
    .filter((entry) => entry.port);
}

const REMAP_PORT_START = 4210;

function allocateDevPort(usedPorts) {
  let candidate = REMAP_PORT_START;
  while (candidate <= 65535) {
    if (!usedPorts.has(candidate) && isPortBindable(candidate)) {
      return candidate;
    }
    candidate += 1;
  }
  console.error(
    `${colors.red}❌ Cannot assign a free port at or above ${REMAP_PORT_START}.${colors.reset}`
  );
  process.exit(1);
}

// Config collisions (associate-directory + awards both :4207) are not fatal.
// First selected app keeps the configured port; extras get 4210+ (or next free).
function remapCollidingPorts(portEntries) {
  const remaps = [];
  const usedPorts = new Set(portEntries.map((entry) => entry.port));
  const byPort = new Map();
  for (const entry of portEntries) {
    if (!byPort.has(entry.port)) byPort.set(entry.port, []);
    byPort.get(entry.port).push(entry);
  }

  for (const [port, group] of byPort) {
    if (group.length < 2) continue;
    const names = group.map((entry) => entry.app);
    const assignedParts = [];
    for (let i = 1; i < group.length; i++) {
      const next = allocateDevPort(usedPorts);
      usedPorts.add(next);
      remaps.push({ app: group[i].app, from: port, to: next });
      group[i].port = next;
      assignedParts.push(`${group[i].app} to ${next}`);
    }
    console.log(
      `${colors.yellow}   ${port}: ${names.join(', ')} — assigning ${assignedParts.join(', ')}${colors.reset}`
    );
  }
  return remaps;
}

function busyForAssignedPorts(stillBusy, portEntries) {
  const assigned = new Map(portEntries.map((entry) => [entry.app, entry.port]));
  return stillBusy.filter((entry) => assigned.get(entry.app) === entry.port);
}

function remappedServeSpec(app, port) {
  const appDir = path.join(ROOT, 'apps', app);
  const viteBin = path.join(ROOT, 'node_modules', '.bin', 'vite');
  const hasViteConfig = [
    'vite.config.ts',
    'vite.config.js',
    'vite.config.mts',
    'vite.config.mjs',
  ].some((name) => fs.existsSync(path.join(appDir, name)));
  // Call vite directly — `npm run dev` is rejected by this repo's packageManager=pnpm.
  if (hasViteConfig && fs.existsSync(viteBin)) {
    return {
      command: viteBin,
      args: ['--port', String(port), '--strictPort'],
      cwd: appDir,
      env: process.env,
      display: `vite --port ${port} --strictPort`,
    };
  }
  if (app === 'strapi') {
    return {
      command: 'npx',
      args: ['nx', 'serve', 'strapi'],
      cwd: ROOT,
      env: { ...process.env, PORT: String(port) },
      display: `PORT=${port} npx nx serve strapi`,
    };
  }
  return {
    command: 'npx',
    args: ['nx', 'serve', app, `--port=${port}`, '--strictPort=true'],
    cwd: ROOT,
    env: process.env,
    display: `npx nx serve ${app} --port=${port}`,
  };
}

function spawnRemappedServe(app, port) {
  const spec = remappedServeSpec(app, port);
  console.log(`   ${app}: ${spec.display}`);
  return spawn(spec.command, spec.args, {
    stdio: 'inherit',
    shell: false,
    detached: process.platform !== 'win32',
    cwd: spec.cwd,
    env: spec.env,
  });
}

function discoverStrictPort(appName) {
  for (const fileName of ['vite.config.ts', 'vite.config.js', 'vite.config.mts']) {
    const configPath = path.join(ROOT, 'apps', appName, fileName);
    if (!fs.existsSync(configPath)) continue;
    const content = fs.readFileSync(configPath, 'utf8');
    const serverBlock = extractBalancedObjectBody(content, 'server') || content;
    const match = serverBlock.match(/strictPort\s*:\s*(true|false)/);
    if (match) return match[1] === 'true';
  }
  return false;
}

function isFatalBusyEntry({ port }) {
  if (getPidsListeningOnPort(port).length > 0) return true;
  const listens = getWindowsPortListeners([port]).filter((row) =>
    /^listen/i.test(row.state)
  );
  return listens.some((row) => !isIgnorableWindowsHolder(row));
}

function findHopSteals(portEntries, busyPorts) {
  const busy = new Set(busyPorts);
  const appsByPort = new Map();
  for (const entry of portEntries) {
    if (!appsByPort.has(entry.port)) appsByPort.set(entry.port, []);
    appsByPort.get(entry.port).push(entry.app);
  }
  const steals = [];
  for (const { app, port } of portEntries) {
    if (!busy.has(port)) continue;
    if (discoverStrictPort(app)) continue;
    for (let hop = port + 1; hop <= port + 30; hop++) {
      if (busy.has(hop)) continue;
      const victims = (appsByPort.get(hop) || []).filter((name) => name !== app);
      if (victims.length > 0) {
        steals.push({ app, port, hop, victims });
      }
      break;
    }
  }
  return steals;
}

function abortIfFatalBusy(portEntries, stillBusy) {
  const fatal = stillBusy.filter(isFatalBusyEntry);
  if (fatal.length > 0) {
    printPortDiagnosis(fatal);
    process.exit(1);
  }
  // Hop-steal abort is only for real leftovers we could not free — not Cursor
  // auto-forwards / Hyper-V ghosts (Vite may hop; reportNonFatalBusy warns).
  const steals = findHopSteals(
    portEntries,
    fatal.map((entry) => entry.port)
  );
  if (steals.length > 0) {
    console.error(
      `\n${colors.red}❌ Starting would hop one app onto another selected app.${colors.reset}`
    );
    for (const steal of steals) {
      console.error(
        `     ${steal.app}:${steal.port} would hop onto ${steal.hop} (${steal.victims.join(', ')})`
      );
    }
    process.exit(1);
  }
}

function reportNonFatalBusy(stillBusy) {
  if (stillBusy.length === 0) return;
  console.log(
    `${colors.yellow}   Ports still not bindable (Cursor auto-forward / Hyper-V / hidden holder). Starting anyway; Vite may hop.${colors.reset}`
  );
  for (const { app, port } of stillBusy) {
    const win = getWindowsPortListeners([port]).filter((row) =>
      /^listen/i.test(row.state)
    );
    const range = excludedRangeFor(port);
    const holder = win
      .map((row) => `${row.name || 'unknown'} PID ${row.pid}`)
      .join(', ');
    const extra = range
      ? ` hyperv ${range.start}-${range.end}`
      : holder
        ? ` ${holder}`
        : ' no visible owner';
    console.log(`     ${app}:${port}${extra}`);
  }
}

function printPortDiagnosis(busyEntries) {
  console.error(
    `\n${colors.red}❌ Cannot bind configured port(s). Not starting Nx.${colors.reset}`
  );
  for (const { app, port } of busyEntries) {
    const wsl = getPidsListeningOnPort(port);
    const range = excludedRangeFor(port);
    const win = getWindowsPortListeners([port]);
    console.error(`\n   ${app}:${port}`);
    if (wsl.length > 0) {
      for (const pid of wsl) {
        console.error(`     WSL PID ${pid}: ${getProcessCmdline(pid) || '(no cmdline)'}`);
      }
    } else {
      console.error('     No WSL listener (ss/lsof empty)');
    }
    if (range) {
      console.error(
        `     Windows Hyper-V/WinNAT excluded range ${range.start}-${range.end}. ` +
          'No process owns this port; it cannot be killed from WSL.'
      );
      console.error(
        '     Admin workaround (disrupts WSL networking): net stop winnat && net start winnat'
      );
    }
    const listens = win.filter((row) => /^listen/i.test(row.state));
    if (listens.length > 0) {
      for (const listener of listens) {
        const safe = isSafeWindowsPortOwner(listener)
          ? 'would auto-kill'
          : 'NOT auto-killed';
        console.error(
          `     Windows ${listener.name || 'unknown'} PID ${listener.pid} (${listener.state}, ${safe})`
        );
        if (!isSafeWindowsPortOwner(listener) && /cursor|code/i.test(listener.name || '')) {
          console.error(
            "     Unforward this port in Cursor's Ports tab, or stop only the " +
              'Cursor NodeService utility — never the main Cursor window.'
          );
        }
      }
    } else if (!range) {
      console.error(
        '     No Windows socket either (Get-NetTCPConnection/netstat empty). ' +
          'Mirrored WSL often hides the real holder on the Windows side.'
      );
    }
  }
}

function stopExistingDevProcesses(selectedApps, { quiet = false } = {}) {
  if (!quiet) console.log('\n🔍 Checking for existing/orphaned dev processes...');

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
  const ports = collectPortEntries(selectedApps);

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
    console.log('   No conflicting WSL processes found');
  } else {
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

    const stillBusyWsl = ports.filter(
      ({ port }) => getPidsListeningOnPort(port).length > 0
    );
    if (stillBusyWsl.length > 0) {
      console.log(
        `${colors.yellow}   Warning: WSL ports still busy after cleanup: ${stillBusyWsl
          .map((entry) => `${entry.app}:${entry.port}`)
          .join(', ')}${colors.reset}`
      );
      for (const { port } of stillBusyWsl) {
        killPids(getPidsListeningOnPort(port), 'SIGKILL');
      }
      sleepSync(300);
    }
  }

  // ss/lsof miss Windows-owned sockets under WSL mirrored networking.
  // Cursor auto-forwards stay bound on 127.0.0.1 after the WSL vite dies,
  // so a bind() test is required — not just a WSL listener list.
  const stillBusy = freeWindowsHeldPorts(ports);
  if (stillBusy.length > 0) {
    console.log(
      `${colors.yellow}   Warning: ports still not bindable: ${stillBusy
        .map((entry) => `${entry.app}:${entry.port}`)
        .join(', ')}${colors.reset}`
    );
  } else if (!quiet) {
    console.log('   ✅ Previous processes cleared');
  }
  return stillBusy;
}

function managedChildPids() {
  const pids = [];
  if (nxChild && nxChild.pid) pids.push(nxChild.pid);
  for (const child of remapChildren) {
    if (child && child.pid) pids.push(child.pid);
  }
  return pids.filter((pid) => isProcessAlive(pid));
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  restoreTerminal();

  const managed = managedChildPids();
  if (managed.length > 0) {
    console.log('\n🛑 Stopping development processes...');
    const processes = listProcesses();
    const tree = managed.flatMap((pid) => collectDescendantPids(pid, processes));
    killPids([...managed, ...tree], 'SIGTERM');
    forceKillPids([...managed, ...tree]);
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

  const portEntries = collectPortEntries(selectedApps);
  stopExistingDevProcesses(selectedApps);

  console.log(`\n✅ Starting Docker services...`);
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
    console.log('✅ Docker services started successfully');
  } catch (error) {
    console.error('❌ Failed to start Docker services:', error.message);
    process.exit(1);
  }

  // Cursor/Windows can re-grab auto-forwards while compose is coming up.
  console.log('\n🔍 Re-checking ports after Docker...');
  const stillBusy = stopExistingDevProcesses(selectedApps, { quiet: true });
  // After leftovers are cleared, assign extras on shared configured ports
  // (e.g. 4207) to 4210+ so selecting both associate-directory and awards works.
  const remaps = remapCollidingPorts(portEntries);
  const activeBusy = busyForAssignedPorts(stillBusy, portEntries);
  abortIfFatalBusy(portEntries, activeBusy);
  if (activeBusy.length === 0) {
    console.log('   ✅ Configured ports are bindable');
  } else {
    reportNonFatalBusy(activeBusy);
  }

  const remappedNames = new Set(remaps.map((remap) => remap.app));
  const runManyApps = selectedApps.filter((app) => !remappedNames.has(app));
  console.log(`\n🚀 Starting selected applications: ${selectedApps.join(',')}`);

  // Serve tasks are continuous (never finish), so every selected app needs its
  // own task-runner thread. Nx defaults to --parallel=3, which starves any app
  // beyond the first three with "Waiting for available thread...". Add headroom
  // for requisite one-shot tasks (e.g. dependency builds).
  if (runManyApps.length > 0) {
    const parallelism = runManyApps.length + 3;
    const nxArgs = [
      'nx',
      'run-many',
      '-t',
      'serve',
      '-p',
      runManyApps.join(','),
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
        shutdown(1);
        return;
      }
      if (code !== 0 && code != null) {
        console.error(`❌ Process exited with code ${code}`);
        shutdown(code);
        return;
      }
      shutdown(0);
    });
  }

  if (remaps.length > 0) {
    console.log('\n🚀 Starting remapped apps on assigned ports:');
    for (const remap of remaps) {
      const child = spawnRemappedServe(remap.app, remap.to);
      remapChildren.push(child);
      child.on('error', (error) => {
        console.error(`❌ Error starting ${remap.app}: ${error.message}`);
      });
    }
  }
}

function selectedAppsFromCli() {
  if (CLI_APPS.length === 0) return apps.map((app) => app.name);
  const known = new Set(apps.map((app) => app.name));
  const unknown = CLI_APPS.filter((name) => !known.has(name));
  if (unknown.length > 0) {
    console.error(`Unknown app(s): ${unknown.join(', ')}`);
    process.exit(1);
  }
  return CLI_APPS;
}

if (FLAG_CHECK_PORTS) {
  const selected = selectedAppsFromCli();
  const ports = collectPortEntries(selected);
  const remaps = remapCollidingPorts(ports);
  const remapByApp = new Map(remaps.map((remap) => [remap.app, remap]));
  console.log('Port check:');
  for (const { app, port } of ports) {
    const bindable = isPortBindable(port);
    const wsl = getPidsListeningOnPort(port);
    const range = excludedRangeFor(port);
    const win = getWindowsPortListeners([port]).filter((row) =>
      /^listen/i.test(row.state)
    );
    const remap = remapByApp.get(app);
    const label = remap ? `${app}:${remap.from} -> ${port}` : `${app}:${port}`;
    const bits = [
      bindable ? 'FREE' : 'BUSY',
      wsl.length ? `wsl-pid=${wsl.join(',')}` : '',
      win.length
        ? `win=${win.map((row) => `${row.name || '?' }#${row.pid}`).join(',')}`
        : '',
      range ? `hyperv=${range.start}-${range.end}` : '',
    ].filter(Boolean);
    console.log(`  ${label} ${bits.join(' ')}`);
  }
  if (remaps.length > 0) {
    console.log('\nRemap serve overrides (first app keeps the configured port):');
    for (const remap of remaps) {
      const spec = remappedServeSpec(remap.app, remap.to);
      console.log(`  ${remap.app}: ${spec.display}`);
    }
  }
  process.exit(ports.every(({ port }) => isPortBindable(port)) ? 0 : 1);
}

if (FLAG_FREE_PORTS) {
  const selected = selectedAppsFromCli();
  const ports = collectPortEntries(selected);
  const stillBusy = stopExistingDevProcesses(selected);
  const remaps = remapCollidingPorts(ports);
  const activeBusy = busyForAssignedPorts(stillBusy, ports);
  abortIfFatalBusy(ports, activeBusy);
  if (activeBusy.length > 0) {
    reportNonFatalBusy(activeBusy);
  }
  if (remaps.length > 0) {
    console.log(
      `${colors.dim}   Remaps are start-time only; --free-ports cleared configured listeners.${colors.reset}`
    );
  }
  process.exit(0);
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

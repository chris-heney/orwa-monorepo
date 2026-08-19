#!/usr/bin/env node
/**
 * Several apps keep nested package.json / package-lock.json installs that a
 * root pnpm/npm install does not populate. Missing nested node_modules shows up as:
 *   - `strapi: command not found`
 *   - Vite "Failed to resolve dependency… Are they installed?"
 *   - plugins requiring ./dist/server
 *
 * Works on macOS and Windows (shell: true so npm.cmd resolves).
 */
const { existsSync, readdirSync } = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const strapiDir = path.join(root, 'apps', 'strapi');
const pluginsDir = path.join(strapiDir, 'src', 'plugins');
const memberManagerDir = path.join(root, 'apps', 'member-manager');

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

function ensureNpmApp(appDir, label, markerRelative, npmArgs = ['install']) {
  const marker = path.join(appDir, ...markerRelative);
  if (existsSync(marker)) return;
  console.log(`Installing ${label} dependencies (${path.relative(root, appDir)})...`);
  run('npm', npmArgs, appDir);
}

function ensurePlugin(pluginDir) {
  const pkgPath = path.join(pluginDir, 'package.json');
  const serverEntry = path.join(pluginDir, 'strapi-server.js');
  const distServer = path.join(pluginDir, 'dist', 'server');
  if (!existsSync(pkgPath) || !existsSync(serverEntry)) return;
  if (existsSync(distServer) || existsSync(`${distServer}.js`)) return;

  const name = path.basename(pluginDir);
  if (!existsSync(path.join(pluginDir, 'node_modules'))) {
    console.log(`Installing ${name} plugin dependencies...`);
    run('npm', ['install'], pluginDir);
  }

  console.log(`Building ${name} plugin (tsc → dist/server)...`);
  run('npm', ['run', 'build'], pluginDir);
}

ensureNpmApp(
  strapiDir,
  'Strapi',
  ['node_modules', '@strapi', 'strapi', 'package.json']
);

if (existsSync(pluginsDir)) {
  for (const entry of readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    ensurePlugin(path.join(pluginsDir, entry.name));
  }
}

// Peer conflicts (@types/react 19 vs react-calendar) need --legacy-peer-deps on both OS.
ensureNpmApp(
  memberManagerDir,
  'member-manager',
  ['node_modules', 'vite', 'package.json'],
  ['install', '--legacy-peer-deps']
);

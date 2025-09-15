#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Enable raw mode for keyboard input
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  lightBlue: '\x1b[94m',
  lightBlueBg: '\x1b[104m',
  white: '\x1b[97m',
  green: '\x1b[32m',
  red: '\x1b[31m'
};

// Discover apps by scanning the apps directory
function discoverApps() {
  const appsDir = path.join(process.cwd(), 'apps');
  const appFolders = fs.readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.includes('-e2e'))
    .map(dirent => dirent.name);
  
  // Create app objects with mm-strapi marked as required
  return appFolders.map(appName => ({
    name: appName,
    selected: appName === 'mm-strapi',
    required: appName === 'mm-strapi'
  }));
}

// Get apps from the apps directory
const apps = discoverApps();

let currentPosition = 0;
const runAllOption = { name: 'Run all applications', selected: false, required: false };
const startOption = { name: '✅ Start selected applications', selected: false, required: false };
const quitOption = { name: '❌ Quit', selected: false, required: false };

const options = [...apps, runAllOption, startOption, quitOption];

// Function to render the menu
function renderMenu() {
  // Clear console
  console.clear();
  
  console.log('🚀 ORWA Interactive Development Environment');
  console.log('==========================================');
  console.log('Use arrow keys to navigate, Space to select/deselect, Enter to confirm');
  console.log('');
  
  options.forEach((option, index) => {
    const isCurrent = index === currentPosition;
    const prefix = isCurrent ? '➤ ' : '  ';
    const checkbox = option.selected ? '[✓]' : '[ ]';
    const suffix = option.required ? ' (required)' : '';
    
    let line;
    
    // Special formatting for the last three options
    if (index >= apps.length) {
      line = `${prefix}${option.name}`;
    } else {
      line = `${prefix}${checkbox} ${option.name}${suffix}`;
    }
    
    // Apply highlighting to the current selection
    if (isCurrent) {
      if (index === options.length - 2) {
        // Highlight start option in green
        console.log(`${colors.lightBlueBg}${colors.white}${line}${colors.reset}`);
      } else if (index === options.length - 1) {
        // Highlight quit option in red
        console.log(`${colors.lightBlueBg}${colors.white}${line}${colors.reset}`);
      } else {
        // Highlight normal options in light blue
        console.log(`${colors.lightBlueBg}${colors.white}${line}${colors.reset}`);
      }
    } else {
      console.log(line);
    }
  });
}

// Function to start the selected applications
function startApps() {
  // If "Run all" was selected, select all apps
  if (runAllOption.selected) {
    apps.forEach(app => app.selected = true);
  }

  const selectedApps = apps.filter(app => app.selected).map(app => app.name);
  
  console.clear();
  console.log('🚀 ORWA Interactive Development Environment');
  console.log('==========================================');
  
  console.log(`\n✅ Starting Docker services...`);
  try {
    execSync('docker-compose up -d', { stdio: 'inherit' });
    console.log('✅ Docker services started successfully');
  } catch (error) {
    console.error('❌ Failed to start Docker services:', error.message);
    process.exit(1);
  }

  const projectsParam = selectedApps.join(',');
  console.log(`\n🚀 Starting selected applications: ${projectsParam}`);
  
  const nxCommand = `nx run-many -t serve -p ${projectsParam}`;
  console.log(`\nRunning command: ${nxCommand}`);
  
  const child = spawn('npx', nxCommand.split(' ').slice(1), { 
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`❌ Error starting applications: ${error.message}`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Process exited with code ${code}`);
    }
    process.exit(code);
  });
}

// Initial render
renderMenu();

// Handle keypress events
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'c' && key.ctrl) {
    // Ctrl+C to exit
    process.exit(0);
  } else if (key.name === 'up' && currentPosition > 0) {
    // Move up
    currentPosition--;
    renderMenu();
  } else if (key.name === 'down' && currentPosition < options.length - 1) {
    // Move down
    currentPosition++;
    renderMenu();
  } else if (key.name === 'space') {
    // Toggle selection for regular app options
    if (currentPosition < apps.length) {
      // Don't allow deselecting mm-strapi if it's required
      if (!(options[currentPosition].required && options[currentPosition].selected)) {
        options[currentPosition].selected = !options[currentPosition].selected;
      }
    } else if (currentPosition === apps.length) {
      // Run all option
      runAllOption.selected = !runAllOption.selected;
    }
    renderMenu();
  } else if (key.name === 'return') {
    // Handle Enter key
    if (currentPosition === options.length - 1) {
      // Quit option
      process.exit(0);
    } else if (currentPosition === options.length - 2) {
      // Start option
      process.stdin.setRawMode(false);
      process.stdin.removeAllListeners('keypress');
      startApps();
    } else if (currentPosition === apps.length) {
      // Run all option - toggle it
      runAllOption.selected = !runAllOption.selected;
      renderMenu();
    } else {
      // Toggle app selection
      if (!(options[currentPosition].required && options[currentPosition].selected)) {
        options[currentPosition].selected = !options[currentPosition].selected;
        renderMenu();
      }
    }
  }
});
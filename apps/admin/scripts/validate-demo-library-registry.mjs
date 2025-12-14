#!/usr/bin/env node
/**
 * Demo Library Registry Validator
 * 
 * Validates that all sourceFiles[] entries in the registry exist.
 * Run: node apps/admin/scripts/validate-demo-library-registry.mjs
 * 
 * Exit codes:
 *   0 = All paths exist
 *   1 = Missing paths found
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Navigate to repo root (apps/admin/scripts -> repo root)
const repoRoot = resolve(__dirname, '..', '..', '..');
const registryPath = resolve(repoRoot, 'docs/demo-library/darkone-demo-library.registry.json');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║       Demo Library Registry Validator                        ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`Registry: ${registryPath}\n`);

// Load registry
let registry;
try {
  const content = readFileSync(registryPath, 'utf-8');
  registry = JSON.parse(content);
} catch (err) {
  console.error(`❌ Failed to load registry: ${err.message}`);
  process.exit(1);
}

const items = registry.items || [];
let totalFiles = 0;
let missingFiles = [];
let validFiles = 0;

console.log(`Found ${items.length} registry items.\n`);
console.log('Validating sourceFiles...\n');

for (const item of items) {
  const sourceFiles = item.sourceFiles || [];
  
  for (const filePath of sourceFiles) {
    totalFiles++;
    const absolutePath = resolve(repoRoot, filePath);
    
    if (existsSync(absolutePath)) {
      validFiles++;
    } else {
      missingFiles.push({
        id: item.id,
        file: filePath,
      });
    }
  }
}

// Report
console.log('══════════════════════════════════════════════════════════════\n');
console.log(`Total items:       ${items.length}`);
console.log(`Total files:       ${totalFiles}`);
console.log(`Valid files:       ${validFiles}`);
console.log(`Missing files:     ${missingFiles.length}`);
console.log('');

if (missingFiles.length === 0) {
  console.log('✅ PASS — All sourceFiles paths are valid.\n');
  process.exit(0);
} else {
  console.log('❌ FAIL — Missing files found:\n');
  for (const missing of missingFiles) {
    console.log(`  [${missing.id}]`);
    console.log(`    → ${missing.file}`);
  }
  console.log('');
  process.exit(1);
}

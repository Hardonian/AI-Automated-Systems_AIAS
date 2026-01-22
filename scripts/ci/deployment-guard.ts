import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

const root = process.cwd();
const errors: string[] = [];

const requiredFiles = [
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.prod.yml',
  'vercel.json',
  'next.config.mjs',
];

const ensureFileExists = (relativePath: string): void => {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${relativePath}`);
  }
};

const readJson = (relativePath: string): unknown => {
  const fullPath = path.join(root, relativePath);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    errors.push(`Invalid JSON in ${relativePath}: ${(error as Error).message}`);
    return null;
  }
};

const readYaml = (relativePath: string): unknown => {
  const fullPath = path.join(root, relativePath);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    return yaml.load(raw);
  } catch (error) {
    errors.push(`Invalid YAML in ${relativePath}: ${(error as Error).message}`);
    return null;
  }
};

requiredFiles.forEach(ensureFileExists);

const vercelConfig = readJson('vercel.json');
if (vercelConfig && typeof vercelConfig !== 'object') {
  errors.push('vercel.json must contain a JSON object at the root.');
}

(['docker-compose.yml', 'docker-compose.prod.yml'] as const).forEach((file) => {
  const composeConfig = readYaml(file);
  if (!composeConfig || typeof composeConfig !== 'object') {
    errors.push(`${file} must contain a YAML object at the root.`);
    return;
  }

  const services = (composeConfig as { services?: Record<string, unknown> }).services;
  if (!services || Object.keys(services).length === 0) {
    errors.push(`${file} must define at least one service.`);
  }
});

if (errors.length > 0) {
  console.error('Deployment guard failed with the following issues:');
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Deployment guard passed: core deployment files are valid.');

import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { resolveDeployment } from '../src/lib/deployment.ts';

// Native Node 24 dotenv support; dashboard/shell values take precedence.
if (existsSync('.env')) loadEnvFile('.env');
export const deployment = resolveDeployment(process.env);

import { rm } from 'node:fs/promises';
import { URL } from 'node:url';

const rootFolder = new URL('../', import.meta.url);
const distFolder = new URL('dist/', rootFolder);

const options = { recursive: true, force: true };

await Promise.all([rm(distFolder, options)]);

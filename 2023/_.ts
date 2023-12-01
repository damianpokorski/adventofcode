import { readFileSync } from 'fs';

export const loadDay = (file: string) => readFileSync(file).toString().split("\n");
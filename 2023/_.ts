import { readFileSync } from 'fs';

export const loadDay = (file: string) => readFileSync(file).toString().split("\n");
export const mapReplace = (str: string, map: Record<string, string>) => Object.entries(map).reduce((value, replacePair) => value.split(replacePair[0]).join(replacePair[1]), str);
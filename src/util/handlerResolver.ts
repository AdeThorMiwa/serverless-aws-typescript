import 'source-map-support/register';
import { join } from 'path';

export const handlerPath = (context: string): string => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

export const handlerPathFromLibs = (context: string, base: string): string => {
  return `${handlerPath(join(context, '../functions/', base))}`;
};

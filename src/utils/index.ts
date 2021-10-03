import { ComponentOptions, ConfigFileOptions } from '../@types';

export const hasStyles = (options: ComponentOptions | ConfigFileOptions) =>
  ['css', 'scss'].includes(options.styling);

export const toKebabCase = (str: string) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
    ?.map((x) => x.toLowerCase())
    ?.join('-');

export const sleep = (timer: number) => new Promise((resolve) => setTimeout(resolve, timer));

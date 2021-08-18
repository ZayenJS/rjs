import { ComponentOptions, ConfigFileOptions } from '../@types';

export const hasStyles = (options: ComponentOptions | ConfigFileOptions) =>
  ['css', 'scss'].includes(options.styling);

import { ComponentOptions, ConfigFileOptions } from '../@types';

export const hasStyles = (options: ComponentOptions | ConfigFileOptions) =>
  options.styling !== 'none';

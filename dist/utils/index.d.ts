import { ComponentOptions, ConfigFileOptions } from '../@types';
export declare const hasStyles: (options: ComponentOptions | ConfigFileOptions) => boolean;
export declare const toKebabCase: (str: string) => string | undefined;
export declare const sleep: (timer: number) => Promise<unknown>;

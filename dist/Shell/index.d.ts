import { ComponentOptions, HookOptions } from '../@types';
declare class Shell {
    parseOptions: (options: any, init?: boolean) => Promise<ComponentOptions & {
        type: 'react' | 'next';
    } & HookOptions>;
    alreadyExistPromp: (message: string) => Promise<{
        overwrite: boolean;
    }>;
    togglePrompt: (name: string, message: string) => Promise<{
        [key: string]: boolean;
    }>;
}
declare const _default: Shell;
export default _default;

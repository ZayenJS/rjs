import { ComponentOptions } from '../@types';
declare class Shell {
    parseOptions: (options: any, init?: boolean) => Promise<ComponentOptions & {
        type: 'react' | 'next';
    }>;
    alreadyExistPromp: (message: string) => Promise<{
        overwrite: boolean;
    }>;
    togglePrompt: (name: string, message: string) => Promise<{}>;
}
declare const _default: Shell;
export default _default;

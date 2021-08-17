declare class Shell {
    parseOptions: (options: any) => Promise<any>;
    alreadyExistPromp: (message: string) => Promise<{
        overwrite: boolean;
    }>;
}
declare const _default: Shell;
export default _default;

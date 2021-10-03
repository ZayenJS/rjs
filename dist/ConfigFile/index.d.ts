import { ConfigFileOptions } from '../@types';
export declare class ConfigFile {
    private rootDirPath?;
    private destinationPath;
    private defaultOptions;
    private OVERWRITE_PROMPT;
    private OVERWRITE_FAIL;
    private SUCCESS_MESSAGE;
    private ERROR_MESSAGE;
    constructor(rootDirPath?: string | undefined);
    generate: (options: ConfigFileOptions) => Promise<void>;
    private createRcTemplate;
    private readFile;
    getConfig: (init?: boolean) => Promise<ConfigFileOptions>;
    private getConfigFileContent;
    private findRcFile;
}
declare const _default: ConfigFile;
export default _default;

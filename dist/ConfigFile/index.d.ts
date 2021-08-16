import { ConfigFileOptions } from '../@types';
declare class ConfigFile {
    private rootDirPath;
    private destinationPath;
    private defaultOptions;
    generate: (options: ConfigFileOptions) => Promise<void>;
    private createRcTemplate;
    private prompForOverwrite;
    private readFile;
    getConfig: () => Promise<ConfigFileOptions>;
    private getConfigFileContent;
    private findRcFile;
}
declare const _default: ConfigFile;
export default _default;

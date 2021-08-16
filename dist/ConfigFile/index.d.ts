import { ConfigFileOptions } from '../@types';
declare class ConfigFile {
    private rootDirPath;
    private destinationPath;
    generate: (options: ConfigFileOptions) => Promise<void>;
    private copyRcTemplate;
    private createRcTemplate;
    private prompForOverwrite;
    parse: (filePath: string) => Promise<string>;
}
declare const _default: ConfigFile;
export default _default;

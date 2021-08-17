declare class FileUtil {
    createFile: (directoryPath: string, fileName: string) => Promise<string | undefined>;
    private checkDirectoryExistence;
    writeToFile: (path: string, data: string) => Promise<void>;
    private createPathPromp;
    private createDirecoryRecursively;
    fileExist: (path: string) => Promise<boolean>;
}
declare const _default: FileUtil;
export default _default;

declare class FileUtil {
    createFile: (directoryPath: string, fileName: string) => Promise<string | undefined>;
    private checkRootDir;
    getFileAbsolutePath: (filePath: string) => Promise<string | undefined>;
    writeToFile: (path: string, data: string) => Promise<void>;
    private createPathPromp;
    private createDirecoryRecursively;
    fileExist: (path: string) => Promise<boolean>;
}
declare const _default: FileUtil;
export default _default;

import fs from 'fs/promises';
import { CreatFileRecusrsion } from '../@types';
declare class FileUtil {
    createFile: (directoryPath: string, fileName: string) => Promise<CreatFileRecusrsion | fs.FileHandle | undefined>;
    writeToFile: (file: fs.FileHandle, data: string) => Promise<void>;
    private createPathPromp;
    private createDirecoryRecursively;
    fileExist: (path: string) => Promise<boolean>;
}
declare const _default: FileUtil;
export default _default;

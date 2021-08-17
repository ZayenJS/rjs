import { constants } from 'fs';
import path from 'path';
import fs from 'fs/promises';

import { prompt } from 'enquirer';
import chalk from 'chalk';
import logger from '../Logger';
import findUp, { exists } from 'find-up';

class FileUtil {
  public createFile = async (
    directoryPath: string,
    fileName: string,
  ): Promise<string | undefined> => {
    try {
      const filePath = path.join(directoryPath, fileName);
      const dirExists = await this.checkDirectoryExistence(directoryPath);

      if (!dirExists) {
        await this.createDirecoryRecursively(directoryPath);
        logger.italic('green', `Directory ${directoryPath} created successfully!`);
      }

      const file = await fs.open(filePath, constants.O_CREAT);
      await file.close();
      return fs.readFile(filePath, { encoding: 'utf8' });
    } catch (error) {
      logger.debug(error);
      logger.exit('Path not created.');
    }
  };

  private checkDirectoryExistence = async (directoryPath: string) => {
    const packageJsonDirPath = await findUp('package.json');

    let rootDirPath = '';
    if (!packageJsonDirPath)
      return logger.exit('Package.json not found... Make sure you are in the right directory.');

    rootDirPath = packageJsonDirPath.split('package.json')[0];
    return exists(path.join(rootDirPath, directoryPath));
  };

  public writeToFile = async (path: string, data: string) => {
    try {
      await fs.writeFile(path, data, { encoding: 'utf-8' });
    } catch (error) {
      logger.exit(error);
    }
  };

  private createPathPromp = async (path: string, message: string): Promise<{ create: boolean }> =>
    prompt({
      type: 'toggle',
      name: 'create',
      message: chalk`{yellow ${message}}`,
      required: true,
    });

  private createDirecoryRecursively = async (path: string) => {
    await fs.mkdir(path, { recursive: true });
  };

  public fileExist = async (path: string) => {
    try {
      return !!(await fs.readFile(path, { encoding: 'utf-8' }));
    } catch {
      return false;
    }
  };
}

export default new FileUtil();

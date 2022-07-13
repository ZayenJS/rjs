import { constants } from 'fs';
import path from 'path';
import fs from 'fs/promises';

import { prompt } from 'enquirer';
import chalk from 'chalk';
import logger from '../Logger';

import findUp, { exists } from 'find-up';
import configFile from '../ConfigFile';

class FileUtil {
  public createFile = async (
    directoryPath: string,
    fileName: string,
    forceCreate = false,
  ): Promise<string | undefined> => {
    try {
      await this.checkRootDir();

      const folderName = fileName.split('.')[0];
      let filePath = path.join(directoryPath, fileName);

      filePath = (await this.getFileAbsolutePath(filePath)) ?? directoryPath;
      directoryPath = filePath?.split(fileName)[0];

      const dirExists = await exists(path.join(directoryPath));

      if (!dirExists && !forceCreate) {
        const { create } = await this.createPathPromp(
          directoryPath,
          `The path ${filePath} doesn't exist, do you want to create it?`,
        );
        if (!create) {
          logger.exit('Action canceled by user, path and file not created.');
        }

        await this.createDirecoryRecursively(directoryPath);
        logger.italic('green', `${directoryPath} directory created successfully.`);
      } else if (!dirExists && forceCreate) {
        await this.createDirecoryRecursively(directoryPath);
        logger.italic('green', `${directoryPath} directory created successfully.`);
      }

      const file = await fs.open(filePath, constants.O_CREAT);

      await file.close();

      return fs.readFile(filePath, { encoding: 'utf8' });
    } catch (error) {
      logger.debug(error);
      logger.exit('Path not created.');
    }
  };

  private checkRootDir = async () => {
    const packageJsonDirPath = await findUp('package.json');

    if (!packageJsonDirPath)
      logger.exit('Package.json not found... Make sure you are in the right directory.');

    return packageJsonDirPath?.split('package.json')[0];
  };

  public getFileAbsolutePath = async (filePath: string) => {
    const rootDirPath = await this.checkRootDir();
    const { type } = await configFile.getConfig();

    if (type === 'react' && rootDirPath) {
      const splitRootDirPath = rootDirPath?.split('/').filter((word) => word !== '');
      const rootDirname = splitRootDirPath[splitRootDirPath.length - 1];

      const splitFilePath = filePath.split('/');
      const rootDirIndex = splitFilePath.indexOf(rootDirname);

      // check to verify that src is the folder next to the root folder in the array
      // if so the file will be generated inisde the src folder
      if (splitFilePath[rootDirIndex + 1] !== 'src')
        logger.exit('Files can only be created in src folder when using react, please try again.');

      return filePath;
    }
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

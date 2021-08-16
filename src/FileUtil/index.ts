import path from 'path';
import { constants } from 'fs';
import fs from 'fs/promises';

import { prompt } from 'enquirer';
import chalk from 'chalk';
import logger from '../Logger';
import { ComponentOptions, CreatFileRecusrsion } from '../@types';

class FileUtil {
  public createFile = async (
    directoryPath: string,
    fileName: string,
  ): Promise<CreatFileRecusrsion | fs.FileHandle | undefined> => {
    try {
      const filePath = path.join(directoryPath, fileName);

      return await fs.open(filePath, 'w+');
    } catch (error) {
      const { create } = await this.createPathPromp(directoryPath);

      if (create) {
        await this.createDirecoryRecursively(directoryPath);
        logger.log('green', `${directoryPath} created successfully!`);
        return this.createFile(directoryPath, fileName);
      }

      logger.exit('Path not created.');
    }
  };

  public writeToFile = async (file: fs.FileHandle, data: string) => {
    try {
      await file.writeFile(data, { encoding: 'utf-8' });
    } catch (error) {
      logger.exit(error);
    }
  };

  private createPathPromp = async (path: string): Promise<{ create: boolean }> =>
    prompt({
      type: 'toggle',
      name: 'create',
      message: chalk`{yellow Path ${path} doesn't exist, do you want to create it?}`,
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

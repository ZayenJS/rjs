import path from 'path';

import chalk from 'chalk';
import { prompt } from 'enquirer';

import configFile from '../ConfigFile';
import logger from '../Logger';

class Shell {
  public parseOptions = async (options: any) => {
    const baseOptions: any = await configFile.getConfig();

    let dirPath = options.componentDir;

    for (const key in options) {
      baseOptions[key] = options[key];
    }

    if (dirPath) {
      if (dirPath.startsWith('./')) {
        const cleanedDirPath = dirPath.split('./')[1];
        dirPath = path.join(process.cwd(), cleanedDirPath);
      } else if (dirPath.startsWith('/')) {
        logger.exit('Absolute paths are not supported, please use a relative one.');
      } else {
        dirPath = path.join(process.cwd(), dirPath);
      }

      baseOptions.componentDir = dirPath;
    }

    return baseOptions ?? options;
  };

  public alreadyExistPromp = async (message: string): Promise<{ overwrite: boolean }> =>
    prompt({
      type: 'toggle',
      name: 'overwrite',
      message: chalk`{yellow ${message}}`,
      required: true,
    });
}

export default new Shell();

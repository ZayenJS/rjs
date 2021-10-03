import path from 'path';

import chalk from 'chalk';
import { prompt } from 'enquirer';

import configFile from '../ConfigFile';
import logger from '../Logger';
import { ComponentOptions } from '../@types';

class Shell {
  public parseOptions = async (options: any, init = false) => {
    const baseOptions: any = await configFile.getConfig(init);
    let dirPath = options.componentDir;

    for (const key in options) {
      baseOptions[key] = options[key];
    }

    if (dirPath && dirPath.startsWith('/')) {
      logger.exit('Absolute paths are not supported, please use a relative one.');
    } else if (init && dirPath && !dirPath.includes('src') && baseOptions.type === 'react') {
      baseOptions.componentDir = `src/${dirPath}`;
    }

    if (!init && dirPath) {
      if (dirPath && dirPath.startsWith('./')) {
        const cleanedDirPath = dirPath.split('./')[1];
        dirPath = path.join(process.cwd(), cleanedDirPath);
      } else {
        dirPath = path.join(process.cwd(), dirPath);
      }

      baseOptions.componentDir = dirPath;
    }

    return {
      type: baseOptions.type,
      importReact: baseOptions.importReact,
      typescript: baseOptions.typescript,
      styling: baseOptions.styling,
      cssModules: baseOptions.cssModules,
      componentType: baseOptions.componentType,
      componentDir: baseOptions.componentDir,
      containerDir: baseOptions.containerDir,
      pageDir: baseOptions.pageDir,
      packageManager: baseOptions.packageManager,
    } as unknown as ComponentOptions & { type: 'react' | 'next' };
  };

  public alreadyExistPromp = async (message: string): Promise<{ overwrite: boolean }> =>
    prompt({
      type: 'toggle',
      name: 'overwrite',
      message: chalk`{yellow ${message}}`,
      required: true,
    });

  public togglePrompt = async (
    name: string,
    message: string,
  ): Promise<{ [key: typeof name]: boolean }> =>
    prompt({
      type: 'toggle',
      name,
      message,
      required: true,
    });
}

export default new Shell();

import path from 'path';

import chalk from 'chalk';
import { prompt } from 'enquirer';

import configFile from '../ConfigFile';
import logger from '../Logger';
import { ComponentOptions, HookOptions } from '../@types';
import { spawnSync } from 'child_process';

class Shell {
  public parseOptions = async (options: any, init = false) => {
    const baseOptions: any = await configFile.getConfig(init);
    let dirPath = options.componentDir;

    for (const key in options) {
      baseOptions[key] = options[key];
    }

    if (dirPath?.startsWith('/')) {
      logger.exit('Absolute paths are not supported, please use a relative one.');
    } else if (init && dirPath && !dirPath.includes('src') && baseOptions.type === 'react') {
      baseOptions.componentDir = `src/${dirPath}`;
    }

    if (!init && dirPath) {
      if (dirPath?.startsWith('./')) {
        const cleanedDirPath = dirPath.split('./')[1];
        dirPath = path.join(process.cwd(), cleanedDirPath);
      } else {
        dirPath = path.join(process.cwd(), dirPath);
      }

      baseOptions.componentDir = dirPath;
    }

    return baseOptions as unknown as ComponentOptions & { type: 'react' | 'next' } & HookOptions;
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

  public exec = (command: string, options: string[]) => {
    spawnSync(command, options, {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  };
}

export default new Shell();

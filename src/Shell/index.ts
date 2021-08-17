import chalk from 'chalk';
import { prompt } from 'enquirer';

import configFile from '../ConfigFile';

class Shell {
  public parseOptions = async (options: any) => {
    const baseOptions: any = await configFile.getConfig();

    for (const key in options) {
      baseOptions[key] = options[key];
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

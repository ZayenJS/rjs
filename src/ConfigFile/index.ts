import path from 'path';
import { constants } from 'fs';
import fs from 'fs/promises';

import { prompt } from 'enquirer';
import findUp from 'find-up';
import chalk from 'chalk';

import logger from '../Logger';
import { PACKAGE_NAME } from '../constants';
import { ConfigFileOptions } from '../@types';
import { hasNoOptions } from '../utils';

class ConfigFile {
  private rootDirPath = '';
  private destinationPath = '';

  public generate = async (options: ConfigFileOptions) => {
    const packageJsonAbsolutePath = await findUp('package.json');

    if (packageJsonAbsolutePath) {
      this.rootDirPath = packageJsonAbsolutePath?.split('package.json')[0];
      this.destinationPath = `${this.rootDirPath}.${PACKAGE_NAME}rc.json`;

      if (hasNoOptions(options)) {
        return this.copyRcTemplate();
      }

      return this.createRcTemplate(options);
    }

    logger.exit("Could not find a package.json... Make sure you're in the right directory.");
  };

  private copyRcTemplate = async () => {
    const rcTemplatePath = path.join(this.rootDirPath, 'rc-template.json');
    try {
      await fs.copyFile(rcTemplatePath, this.destinationPath, constants.COPYFILE_EXCL);
      logger.log('green', 'Config file successfully created!');
    } catch (error) {
      if (error.code === 'EEXIST') {
        const { overwrite } = await this.prompForOverwrite();
        console.log(overwrite);

        if (overwrite) {
          await fs.copyFile(rcTemplatePath, this.destinationPath);

          return logger.log('green', 'Config file successfully created!');
        }

        logger.exit('Config file not overwritten.');
      }

      logger.error(`An unexpected error occured while creating the .${PACKAGE_NAME}rc.json file.`);
      logger.exit(error);
    }
  };

  private createRcTemplate = async (options: ConfigFileOptions) => {
    const rcTemplatePath = path.join(this.rootDirPath, 'rc-template.json');
    const rcTemplateJSONFile = await this.parse(rcTemplatePath);
    const rcTemplate = JSON.parse(rcTemplateJSONFile);

    for (const key in options) {
      rcTemplate[key] = options[key as keyof ConfigFileOptions];
    }

    try {
      const file = await fs.readFile(this.destinationPath, { encoding: 'utf-8' });
      if (file) {
        const { overwrite } = await this.prompForOverwrite();

        if (overwrite) {
          fs.writeFile(this.destinationPath, JSON.stringify(rcTemplate, null, 2));

          return logger.log('green', 'Config file successfully created!');
        }

        logger.exit('Config file not overwritten.');
      }
    } catch (error) {
      if (error.code === 'ENOENT')
        await fs.writeFile(this.destinationPath, JSON.stringify(rcTemplate, null, 2));
    }
  };

  private prompForOverwrite = async (): Promise<{ overwrite: boolean }> => {
    return prompt({
      type: 'toggle',
      name: 'overwrite',
      message: chalk`{yellow File already exists, do you want to overwrite it?}`,
      required: true,
    });
  };

  public parse = async (filePath: string) => fs.readFile(filePath, { encoding: 'utf-8' });
}

export default new ConfigFile();

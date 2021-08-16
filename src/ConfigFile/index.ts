import fs from 'fs/promises';

import { prompt } from 'enquirer';
import findUp from 'find-up';
import chalk from 'chalk';

import shell from '../Shell';
import fileUtil from '../FileUtil';

import logger from '../Logger';
import { PACKAGE_NAME } from '../constants';
import { ConfigFileOptions } from '../@types';

class ConfigFile {
  private rootDirPath = '';
  private destinationPath = '';
  private defaultOptions: ConfigFileOptions = {
    type: 'react',
    importReact: false,
    typescript: true,
    styling: 'css',
    cssModules: false,
    componentType: 'function',
    componentDir: 'src/components',
    containerDir: 'src/containers',
    pageDir: 'src/pages',
    packageManager: 'npm',
  };

  public generate = async (options: ConfigFileOptions) => {
    const packageJsonAbsolutePath = await findUp('package.json');

    options = await shell.parseOptions(options);

    if (packageJsonAbsolutePath) {
      this.rootDirPath = packageJsonAbsolutePath?.split('package.json')[0];
      this.destinationPath = `${this.rootDirPath}.${PACKAGE_NAME}rc.json`;

      return this.createRcTemplate(options);
    }

    logger.exit("Could not find a package.json... Make sure you're in the right directory.");
  };

  private createRcTemplate = async (options: ConfigFileOptions) => {
    try {
      const fileExists = await fileUtil.fileExist(this.destinationPath);

      if (fileExists) {
        const { overwrite } = await this.prompForOverwrite();

        if (overwrite) {
          fs.writeFile(this.destinationPath, JSON.stringify(options, null, 2));

          return logger.log('green', 'Config file successfully created!');
        }

        logger.exit('Config file not overwritten.');
      }
    } catch (error) {
      if (error.code === 'ENOENT')
        await fs.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
    }
  };

  private prompForOverwrite = async (): Promise<{ overwrite: boolean }> =>
    prompt({
      type: 'toggle',
      name: 'overwrite',
      message: chalk`{yellow File already exists, do you want to overwrite it?}`,
      required: true,
    });

  private readFile = async (filePath: string) => fs.readFile(filePath, { encoding: 'utf-8' });

  public getConfig = async () => {
    let config = await this.getConfigFileContent();

    if (!config) config = this.defaultOptions;

    return config;
  };

  private getConfigFileContent = async (): Promise<ConfigFileOptions | null> => {
    const rcFilePath = await this.findRcFile();

    let rcFileJsonContent;
    if (rcFilePath) {
      rcFileJsonContent = await this.readFile(rcFilePath);
      return JSON.parse(rcFileJsonContent);
    }

    return null;
  };

  private findRcFile = async () => findUp(`.${PACKAGE_NAME}rc.json`);
}

export default new ConfigFile();

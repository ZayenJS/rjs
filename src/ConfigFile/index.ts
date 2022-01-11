import fs from 'fs/promises';

import findUp from 'find-up';

import shell from '../Shell';
import fileUtil from '../FileUtil';

import logger from '../Logger';
import { RC_FILE_NAME } from '../constants';
import { ConfigFileOptions } from '../@types';

export class ConfigFile {
  private destinationPath = '';
  private defaultOptions: ConfigFileOptions = {
    type: 'react',
    importReact: false,
    typescript: false,
    styling: 'css',
    cssModules: false,
    componentType: 'function',
    componentDir: 'src/components',
    hooksDir: 'src/hooks',
    pageDir: 'src/pages',
    packageManager: 'npm',
  };

  private OVERWRITE_PROMPT = 'File already exists, do you want to overwrite it?';
  private OVERWRITE_FAIL = 'Config file not overwritten.';
  private SUCCESS_MESSAGE = 'Config file successfully created!';
  private ERROR_MESSAGE =
    "Could not find a package.json... Make sure you're in the right directory.";

  constructor(private rootDirPath?: string) {}

  public generate = async (options: ConfigFileOptions) => {
    options = await shell.parseOptions(options, true);
    if (this.rootDirPath) {
      this.destinationPath = `${this.rootDirPath}${RC_FILE_NAME}`;

      await this.createRcTemplate(options);
      return;
    }

    const packageJsonAbsolutePath = await findUp('package.json');
    this.rootDirPath = packageJsonAbsolutePath?.split('package.json')[0];
    this.destinationPath = `${this.rootDirPath}${RC_FILE_NAME}`;

    if (!packageJsonAbsolutePath) logger.exit(this.ERROR_MESSAGE);

    await this.createRcTemplate(options);
  };

  private createRcTemplate = async (options: ConfigFileOptions) => {
    try {
      const fileExists = await fileUtil.fileExist(this.destinationPath);

      if (fileExists) {
        const { overwrite } = await shell.alreadyExistPromp(this.OVERWRITE_PROMPT);

        if (overwrite) {
          fs.writeFile(this.destinationPath, JSON.stringify(options, null, 2));

          return logger.log('green', this.SUCCESS_MESSAGE);
        }

        logger.exit(this.OVERWRITE_FAIL);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT')
        await fs.writeFile(this.destinationPath, JSON.stringify(options, null, 2));
    }

    fs.writeFile(this.destinationPath, JSON.stringify(options, null, 2));

    logger.log('green', this.SUCCESS_MESSAGE);
  };

  private readFile = async (filePath: string) => fs.readFile(filePath, { encoding: 'utf-8' });

  public getConfig = async (init = false) => {
    if (init) return this.defaultOptions;

    const config = await this.getConfigFileContent();

    if (!config) return this.defaultOptions;

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

  private findRcFile = async () => findUp(RC_FILE_NAME);
}

export default new ConfigFile();

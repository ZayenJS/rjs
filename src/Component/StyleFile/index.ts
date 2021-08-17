import path from 'path';

import { ComponentOptions } from '../../@types';

import fileUtil from '../../FileUtil';
import shell from '../../Shell';
import logger from '../../Logger';

export class StyleFile {
  constructor(private name: string, private options: ComponentOptions) {}

  public generate = async () => {
    let styleFile = null;
    let styleFileName = null;

    if (this.options.styling !== 'none') {
      styleFileName = `${this.name}`;
      if (this.options.cssModules) styleFileName += '.module';

      styleFile = await fileUtil.createFile(
        path.join(this.options.componentDir, this.name),
        `${styleFileName}.${this.options.styling}`,
      );
    }

    let response = true;

    if (styleFile && styleFileName) {
      const { overwrite } = await shell.alreadyExistPromp(
        `The style file ${styleFileName}.${this.options.styling} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response && styleFileName) {
      await fileUtil.writeToFile(
        path.join(this.options.componentDir, this.name, `${styleFileName}.${this.options.styling}`),
        '@import "";',
      );
    }

    return response;
  };
}

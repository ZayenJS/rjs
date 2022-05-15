import path from 'path';

import fileUtil from '../../FileUtil';
import shell from '../../Shell';
import { BaseFile } from '../BaseFile/BaseFile';
import { toKebabCase } from '../../utils';
import { ComponentOptions } from '../../@types';

export class StyleFile extends BaseFile<ComponentOptions> {
  protected gatherOptionsInteractively(): Promise<void> {
    return Promise.resolve();
  }

  public generate = async () => {
    let styleFile = null;
    let styleFileName = null;

    if (this.options.styling !== 'none') {
      styleFileName = `${this.name}`;
      if (this.options.cssModules) styleFileName += '.module';

      styleFile = await fileUtil.createFile(
        path.join(this.options.componentDir, this.options.flat ? '' : this.name),
        `${styleFileName}.${this.options.styling}`,
      );

      this._nameWithExtension = `${styleFileName}.${this.options.styling}`;
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
        path.join(
          this.options.componentDir,
          this.options.flat ? '' : this.name,
          `${styleFileName}.${this.options.styling}`,
        ),
        await this.getData(),
      );
    }

    return response;
  };

  protected getData = async (name: string = this.name) => {
    const { styling, cssModules } = this.options;

    const imports =
      styling === 'scss'
        ? [this.addLine(0, '// @import "path_to_file";'), this.addLine(0, '')]
        : [];

    const className = cssModules ? 'Container' : toKebabCase(name);

    return [
      ...imports,
      this.addLine(0, `.${className} {`),
      this.addLine(1, '/* your styles here... */'),
      this.addLine(0, '}'),
    ]
      .filter((line) => typeof line === 'string')
      .join('\n');
  };
}

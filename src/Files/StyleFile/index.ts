import logger from '../../Logger';
import { BaseFile } from '../BaseFile/BaseFile';
import { toKebabCase } from '../../utils';
import { StyleSheetOptions } from '../../@types';

export class StyleFile extends BaseFile<StyleSheetOptions> {
  public constructor(name: string, options: StyleSheetOptions) {
    super({
      name,
      options,
      dirPath: options.dirPath ?? options.componentDir,
    });
  }

  public generate = async (forceCreateFile = false) => {
    let fileName = null;

    if (this._options.styling !== 'none') {
      fileName = `${this._name}`;
      if (this._options.cssModules) fileName += '.module';

      const response = await this._generate(
        fileName,
        this._options.styling,
        'stylesheet',
        forceCreateFile,
      );

      if (response) {
        logger.italic('green', `Style file created successfully! (${this.getFileName()})`);
        return true;
      }
    }

    return false;
  };

  protected getData = async (name: string = this._name) => {
    if (this._data) return this._data;

    const { styling, cssModules } = this._options;

    const imports =
      styling === 'scss'
        ? [this.addLine(0, '// @import "path_to_file";'), this.addLine(0, '')]
        : [];

    const className = cssModules ? 'Container' : toKebabCase(name);

    return this.parse([
      ...imports,
      this.addLine(0, `.${className} {`),
      this.addLine(1, '/* your styles here... */'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ]);
  };
}

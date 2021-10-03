import { ComponentOptions } from '../@types';

import shell from '../Shell';
import logger from '../Logger';
import { CodeFile } from './CodeFile';
import { StyleFile } from './StyleFile';
import { hasStyles } from '../utils';

class Component {
  private name: string = '';
  private options: ComponentOptions = {
    importReact: false,
    typescript: false,
    styling: 'css',
    cssModules: false,
    componentType: 'function',
    componentDir: 'src/components',
    tag: 'div',
  };

  public getName = () => this.name;
  public getDefaultOptions = () => this.options;

  public generate = async (componentName: string, options: ComponentOptions) => {
    options = await shell.parseOptions(options);

    this.options = { ...options, tag: options.tag ?? 'div' };

    const codeFile = new CodeFile(componentName, this.options);
    const generatedCodeFile = await codeFile.generate();

    if (generatedCodeFile) logger.italic('green', `Component file created successfully!`);

    // only creates a style file if styling is css or scss
    if (hasStyles(this.options)) {
      const styleFile = new StyleFile(componentName, this.options);
      const generatedStyleFile = await styleFile.generate();
      if (generatedStyleFile) logger.italic('green', `Style file created successfully!`);
    }
  };
}

export default new Component();

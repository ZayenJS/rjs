import { ComponentOptions } from '../@types';

import shell from '../Shell';
import logger from '../Logger';
import { CodeFile } from './CodeFile';
import { StyleFile } from './StyleFile';

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

    const codeFile = new CodeFile(componentName, options);
    const generatedCodeFile = await codeFile.generate();

    const styleFile = new StyleFile(componentName, options);
    const generatedStyleFile = await styleFile.generate();

    if (generatedCodeFile) logger.italic('green', `Component file created successfully!`);
    if (generatedStyleFile) logger.italic('green', `Style file created successfully!`);
  };
}

export default new Component();

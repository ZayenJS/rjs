import { ComponentOptions } from '../@types';

import shell from '../Shell';
import logger from '../Logger';
import { ComponentFile } from './ComponentFile';
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
    hooksDir: 'src/hooks',
    tag: 'div',
    flat: false,
  };

  public getName = () => this.name;
  public getDefaultOptions = () => this.options;

  public generate = async (componentName: string, options: ComponentOptions) => {
    options = await shell.parseOptions(options);

    options = { ...options, tag: options.tag ?? 'div' };

    const componentFile = new ComponentFile(componentName, options);
    const generatedComponentFile = await componentFile.generate();

    if (generatedComponentFile)
      logger.italic(
        'green',
        `Component file created successfully! (${componentFile.getFileName()})`,
      );

    // only creates a style file if styling is css or scss
    if (hasStyles(options)) {
      const styleFile = new StyleFile(componentName, options);
      const generatedStyleFile = await styleFile.generate();
      if (generatedStyleFile)
        logger.italic('green', `Style file created successfully! (${styleFile.getFileName()})`);
    }
  };
}

export default new Component();

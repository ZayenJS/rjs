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
    packageManager: 'npm',
  };

  public getName = () => this.name;
  public getDefaultOptions = () => this.options;

  public generate = async (componentName: string, options: ComponentOptions) => {
    options = await shell.parseOptions(options);

    const componentFile = new ComponentFile({
      name: componentName,
      options,
      dirPath: options.componentDir,
      possibleExtensions: ['tsx', 'js'],
    });
    const generatedComponentFile = await componentFile.generate();

    if (!generatedComponentFile) logger.error(`Could not generate component ${componentName}`);

    // only creates a style file if styling is css or scss
    if (hasStyles(options)) {
      options = componentFile.getOptions();
      const styleFile = new StyleFile(componentName ?? componentFile.getName(), options);
      const generatedStyleFile = await styleFile.generate();

      if (!generatedStyleFile)
        logger.error(`Could not generate style file for component ${componentName}`);
    }
  };
}

export const component = new Component();

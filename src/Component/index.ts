import path from 'path';

import shell from '../Shell';
import logger from '../Logger';
import fileUtil from '../FileUtil';
import { ComponentOptions } from '../@types';
import { isFileHandle } from '../utils';

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

  public generate = async (componentName: string, options: ComponentOptions) => {
    this.name = componentName;

    options = await shell.parseOptions(options);
    this.options = { ...options, tag: options.tag ?? 'div' };

    //? ACTIVATE THIS TO TEST OUTPUT IN SHELL
    // logger.exit(this.getData());

    const codeFile = await fileUtil.createFile(
      path.join(options.componentDir, componentName),
      `${componentName}.${options.typescript ? 'tsx' : 'js'}`,
    );

    let styleFile = null;
    if (options.styling !== 'none') {
      let styleFileName = `${componentName}`;
      if (options.cssModules) styleFileName += '.module';

      styleFile = await fileUtil.createFile(
        path.join(options.componentDir, componentName),
        `${styleFileName}.${options.styling}`,
      );
    }

    // TODO: prompt for overwrite
    if (isFileHandle(codeFile)) {
      logger.debug(codeFile);
      await fileUtil.writeToFile(codeFile, this.getData());
      await codeFile.close();
    }
    if (isFileHandle(styleFile)) logger.debug(styleFile);

    logger.debug('generate component');
  };

  private addLine = (tabs = 0, str: string | null = null) => {
    if (str === null) {
      return null;
    }

    return str ? '\t'.repeat(tabs) + str : '';
  };

  public getData = () => {
    return [
      ...this.getHeaderImports(),
      ...this.getStylingImports(),
      ...this.getComponentBody(),
      this.addLine(0, `export default ${this.name};`),
    ]
      .filter((line) => typeof line === 'string')
      .join('\n');
  };

  private getHeaderImports = () => {
    const { componentType, importReact, typescript } = this.options;

    let headerImport = null;

    if (importReact && typescript) {
      headerImport = `import React, { FC } from 'react';`;
    } else if (importReact && !typescript) {
      headerImport = "import React from 'react';";
    } else if (!importReact && typescript) {
      headerImport = "import { FC } from 'react';";
    }

    if (componentType === 'class') {
      headerImport = importReact
        ? `import React, { Component } from 'react';`
        : `import { Component } from 'react';`;
    }

    return [
      this.addLine(0, headerImport),
      this.addLine(0, importReact || typescript || componentType === 'class' ? '' : null),
    ];
  };

  private getStylingImports = () => {
    const { cssModules, styling } = this.options;

    return [
      this.addLine(
        0,
        ['css', 'scss'].includes(styling) && !cssModules
          ? `import './${this.name}.${styling}';`
          : null,
      ),
      this.addLine(
        0,
        ['css', 'scss'].includes(styling) && cssModules
          ? `import classes from './${this.name}.module.${styling}';`
          : null,
      ),
      this.addLine(0, styling !== 'none' ? '' : null),
    ];
  };

  private getComponentBody = () => {
    const { componentType, importReact, typescript, tag } = this.options;

    const component =
      componentType === 'function' ? this.getFunctionComponent() : this.getClassComponent();

    return [
      this.addLine(0, typescript ? `export interface ${this.name}Props {}` : null),
      this.addLine(0, importReact || typescript ? '' : null),
      this.addLine(
        0,
        typescript && componentType === 'class' ? `export interface ${this.name}State {}` : null,
      ),
      this.addLine(0, typescript && componentType === 'class' ? '' : null),
      ...component,
    ];
  };

  private getClassComponent = () => {
    const { styling, cssModules, typescript, tag } = this.options;

    let className = '';

    if (['css', 'scss'].includes(styling)) {
      className = ` className=${cssModules ? '{classes.Container}' : `'${this.name}'`}`;
    }

    return [
      this.addLine(
        0,
        `class ${this.name} extends Component${
          typescript ? `<${this.name}Props, ${this.name}State>` : ''
        } {`,
      ),
      this.addLine(1, 'state = {};'),
      this.addLine(0, ''),
      this.addLine(1, 'render () {'),
      this.addLine(2, `return <${tag}${className}>${this.name} Class Component</${tag}>;`),
      this.addLine(1, '}'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  private getFunctionComponent = () => {
    const { typescript, tag } = this.options;

    return [
      this.addLine(0, `const ${this.name}${typescript ? `: FC<${this.name}Props>` : ''} = () => {`),
      this.addLine(1, 'return ('),
      // TODO: apply class to div
      this.addLine(2, `<${tag}>${this.name} Component</${tag}>`),
      this.addLine(1, ');'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };
}

export default new Component();

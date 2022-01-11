import path from 'path';

import fileUtil from '../../FileUtil';
import shell from '../../Shell';
import logger from '../../Logger';
import { hasStyles, toKebabCase } from '../../utils';
import { BaseFile } from '../BaseFile/BaseFile';
import { ComponentOptions } from '../../@types';

export class ComponentFile extends BaseFile<ComponentOptions> {
  public generate = async () => {
    // ? ACTIVATE THIS TO TEST OUTPUT IN SHELL
    // logger.exit(this.options);

    const componentFileName = `${this.name}.${this.options.typescript ? 'tsx' : 'js'}`;
    this._nameWithExtension = componentFileName;
    const dirPath = this.options.componentDir;

    const componentFile = await fileUtil.createFile(
      path.join(dirPath, this.options.flat ? '' : this.name),
      componentFileName,
    );

    let response = true;

    if (componentFile) {
      const { overwrite } = await shell.alreadyExistPromp(
        `The component ${componentFileName} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response) {
      await fileUtil.writeToFile(
        path.join(dirPath, this.options.flat ? '' : this.name, componentFileName),
        this.getData(),
      );
    }

    return response;
  };

  protected getData = (name: string = this.name) =>
    [
      ...this.getHeaderImports(),
      ...this.getStylingImports(name),
      ...this.getComponentBody(name),
      this.addLine(0, `export default ${name};`),
    ]
      .filter((line) => typeof line === 'string')
      .join('\n');

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

  private getStylingImports = (name: string) => {
    const { cssModules, styling } = this.options;

    return [
      this.addLine(
        0,
        hasStyles(this.options) && !cssModules ? `import './${name}.${styling}';` : null,
      ),
      this.addLine(
        0,
        hasStyles(this.options) && cssModules
          ? `import classes from './${name}.module.${styling}';`
          : null,
      ),
      this.addLine(0, styling !== 'none' ? '' : null),
    ];
  };

  private getComponentBody = (name: string) => {
    const { componentType, importReact, typescript } = this.options;

    const component =
      componentType === 'function' ? this.getFunctionComponent(name) : this.getClassComponent(name);

    return [
      this.addLine(0, typescript ? `export interface ${name}Props {}` : null),
      this.addLine(0, importReact || typescript ? '' : null),
      this.addLine(
        0,
        typescript && componentType === 'class' ? `export interface ${name}State {}` : null,
      ),
      this.addLine(0, typescript && componentType === 'class' ? '' : null),
      ...component,
    ];
  };

  private getClassComponent = (name: string) => {
    const { typescript, tag } = this.options;

    const className = this.getClassName(name);

    return [
      this.addLine(
        0,
        `class ${name} extends Component${typescript ? `<${name}Props, ${name}State>` : ''} {`,
      ),
      this.addLine(1, 'state = {};'),
      this.addLine(0, ''),
      this.addLine(1, 'render () {'),
      this.addLine(2, `return <${tag}${className}>${name} Class Component</${tag}>;`),
      this.addLine(1, '}'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  private getFunctionComponent = (name: string) => {
    const { typescript, tag } = this.options;

    const className = this.getClassName(name);

    return [
      this.addLine(0, `const ${name}${typescript ? `: FC<${name}Props>` : ''} = () => {`),
      this.addLine(1, 'return ('),
      this.addLine(2, `<${tag}${className}>${name} Component</${tag}>`),
      this.addLine(1, ');'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  private getClassName = (name: string) => {
    const { cssModules } = this.options;

    if (hasStyles(this.options)) {
      return ` className=${cssModules ? '{classes.Container}' : `'${toKebabCase(name)}'`}`;
    }

    return '';
  };
}

import path from 'path';

import { ComponentOptions } from '../../@types';

import fileUtil from '../../FileUtil';
import shell from '../../Shell';
import logger from '../../Logger';
import { hasStyles } from '../../utils';

export class CodeFile {
  constructor(private name: string, private options: ComponentOptions) {}

  public generate = async () => {
    // ? ACTIVATE THIS TO TEST OUTPUT IN SHELL
    // logger.exit(this.getData());

    const codeFileName = `${this.name}.${this.options.typescript ? 'tsx' : 'js'}`;
    let dirPath = this.options.componentDir;

    const codeFile = await fileUtil.createFile(path.join(dirPath, this.name), codeFileName);

    let response = true;

    if (codeFile) {
      const { overwrite } = await shell.alreadyExistPromp(
        `The component ${codeFileName} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response) {
      await fileUtil.writeToFile(path.join(dirPath, this.name, codeFileName), this.getData());
    }

    return response;
  };

  private addLine = (tabs = 0, str: string | null = null) => {
    if (str === null) {
      return null;
    }

    return str ? '\t'.repeat(tabs) + str : '';
  };

  private getData = (name: string = this.name) => {
    return [
      ...this.getHeaderImports(name),
      ...this.getStylingImports(name),
      ...this.getComponentBody(name),
      this.addLine(0, `export default ${name};`),
    ]
      .filter((line) => typeof line === 'string')
      .join('\n');
  };

  private getHeaderImports = (name: string) => {
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

    let className = this.getClassName(name);

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

    let className = this.getClassName(name);

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

    let className = '';

    if (hasStyles(this.options)) {
      className = ` className=${cssModules ? '{classes.Container}' : `'${name}'`}`;
    }

    return className;
  };
}

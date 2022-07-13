import path from 'path';

import shell from '../../Shell';
import logger from '../../Logger';
import { hasStyles, toKebabCase } from '../../utils';
import { BaseFile } from '../BaseFile/BaseFile';
import { ComponentOptions, ComponentType, Styling } from '../../@types';
import { prompt } from 'enquirer';

export class ComponentFile extends BaseFile<ComponentOptions> {
  protected props: { [key: string]: string | null } = {};
  protected _interactive: boolean = true;

  // TODO: add dirPath option

  public getName = () => this._name;
  public getOptions = () => this._options;

  protected gatherOptionsInteractively = async () => {
    const { name }: { name: string } = await prompt({
      type: 'input',
      name: 'name',
      message: "What is the component's name?",
      format: (value) =>
        value
          ? value
              .split(/\W/gim)
              .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
              .join('')
          : '',

      result: (value) =>
        value
          .split(/\W/gim)
          .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
          .join(''),
      required: true,
    });

    const { importReact } = await shell.togglePrompt(
      'importReact',
      'Do you want to import React from react ?',
    );

    this._options.importReact = importReact;

    const { typescript } = await shell.togglePrompt('typescript', 'Do you want to use typescript?');

    const { styling }: { styling: Styling } = await prompt({
      type: 'select',
      name: 'styling',
      message: 'Which styling option do you want? (pick one)',
      choices: ['css', 'scss', 'none'],
    });

    if (styling !== 'none') {
      const { cssModules }: { cssModules: boolean } = await prompt({
        type: 'toggle',
        name: 'cssModules',
        message: 'Do you want to use css modules?',
        required: true,
      });

      this._options.cssModules = cssModules;
    }

    const { componentType }: { componentType: ComponentType } = await prompt({
      type: 'select',
      name: 'componentType',
      message: 'What type of components do you use?',
      choices: ['function', 'class'],
    });

    const { componentDir }: { componentDir: string } = await prompt({
      type: 'input',
      name: 'componentDir',
      initial: 'src/components',
      format: (value) => `./${value}`,
      result: (value) => path.join(process.cwd(), value),
      message: "Component's folder path? (will be appended to the current path)",
    });

    const { tag }: { tag: string } = await prompt({
      type: 'input',
      name: 'tag',
      initial: 'div',
      message: 'What tag do you want to use?',
    });

    const { flat }: { flat: boolean } = await prompt({
      type: 'toggle',
      name: 'flat',
      message: 'Do you want to generate the files inside a folder?',
    });

    this._name = name;
    this._options = {
      ...this._options,
      componentDir,
      componentType,
      importReact,
      styling,
      typescript,
      tag,
      flat: !flat,
    };

    const { props }: { props: boolean } = await prompt({
      type: 'toggle',
      name: 'props',
      message: 'Do you want to add props?',
    });

    if (props) await this.addProps();
  };

  public generate = async (forceCreateFile: boolean = false): Promise<boolean> => {
    if (!this._name) await this.gatherOptionsInteractively();

    const response = await this._generate(
      this._name,
      this._options.typescript ? 'tsx' : 'js',
      'component',
      forceCreateFile,
    );

    if (response)
      logger.italic('green', `Component file created successfully! (${this.getFileName()})`);

    return response;
  };

  // TODO: refactor method to use less code (avoid repetition)
  public addProps = async (props?: { [key: string]: string | null }) => {
    if (props) {
      this.props = props;
      return;
    }

    while (true) {
      const response: { propName: string } = await prompt({
        type: 'input',
        name: 'propName',
        message:
          "Enter the prop name (press enter if when you're done, write props to list all the current added props): ",
      });

      let { propName } = response;

      while (propName.toLowerCase() === 'props') {
        this.displayCurrentProps();
        const response: { propName: string } = await prompt({
          type: 'input',
          name: 'propName',
          message:
            "Enter the prop name (press enter if when you're done, write props to list all the current added props): ",
        });

        propName = response.propName;
      }

      if (!propName) break;

      let propType = null;

      if (this._options.typescript) {
        const response: { propType: string } = await prompt({
          type: 'input',
          name: 'propType',
          message:
            'Enter the prop type (? to see all available types, props to list the current added props): ',
          required: true,
        });

        propType = response.propType;

        while (propType === '?') {
          this.displayPropTypes();

          const response: { propType: string } = await prompt({
            type: 'input',
            name: 'propType',
            message: 'Enter the prop type (? to see all available types): ',
            required: true,
          });

          propType = response.propType;
        }
      }

      if (propType === 'function') propType = '() => void';
      else if (propType?.toLowerCase() === 'array') {
        const response: { arrayType: string } = await prompt({
          type: 'input',
          name: 'arrayType',
          message: 'Enter the array type (? to see all available types): ',
          required: true,
        });

        propType = `${response.arrayType}[]`;
      }

      this.props[propName] = propType;
    }
  };

  private displayPropTypes = () => {
    logger.log('yellow', '\tAVAILABLE TYPES');
    logger.log('yellow', '___________________________________');
    logger.log('white', 'string');
    logger.log('white', 'number');
    logger.log('white', 'boolean');
    logger.log('white', 'array');
    logger.log('white', 'function');
  };

  private displayCurrentProps = () => {
    logger.log('yellow', '\tCURRENT ADDED PROPS');
    logger.log('yellow', '__________________________________________');

    const start = this.addLine(0, 'props {');
    const props = [];
    const end = this.addLine(0, '}');

    for (const key of Object.keys(this.props)) {
      props.push(this.addLine(1, `${key}, `));
    }

    if (this._options.typescript) {
      props.length = 0;

      for (const entry of Object.entries(this.props)) {
        props.push(this.addLine(1, `${entry[0]}: ${entry[1]};`));
      }
    }
    console.log(props);

    logger.log('white', start);
    logger.log('white', this.parse(props));
    logger.log('white', end);
  };

  protected getData = (name: string = this._name) =>
    this._data ||
    this.parse([
      ...this.getHeaderImports(),
      ...this.getStylingImports(name),
      ...this.getComponentBody(name),
      this.addLine(0, `export default ${name};`),
      this.addLine(0, ''),
    ]);

  protected getHeaderImports = () => {
    const { componentType, importReact, typescript } = this._options;

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

  protected getStylingImports = (name: string) => {
    const { cssModules, styling } = this._options;

    return [
      this.addLine(
        0,
        hasStyles(this._options) && !cssModules ? `import './${name}.${styling}';` : null,
      ),
      this.addLine(
        0,
        hasStyles(this._options) && cssModules
          ? `import classes from './${name}.module.${styling}';`
          : null,
      ),
      this.addLine(0, styling !== 'none' ? '' : null),
    ];
  };

  protected getComponentBody = (name: string) => {
    const { componentType, importReact, typescript } = this._options;

    // sets the default tag to a div
    this._options.tag = this._options.tag ?? 'div';

    const component =
      componentType === 'function' ? this.getFunctionComponent(name) : this.getClassComponent(name);

    let typescriptInterface = [
      this.addLine(0, typescript ? `export interface ${name}Props {}` : null),
    ];

    if (Object.keys(this.props).length && typescript) {
      typescriptInterface = [this.addLine(0, `export interface ${name}Props {`)];

      for (const entry of Object.entries(this.props)) {
        typescriptInterface.push(this.addLine(1, `${entry[0]}: ${entry[1]};`));
      }

      typescriptInterface.push(this.addLine(0, '}'));
    }

    return [
      ...typescriptInterface,
      this.addLine(0, importReact || typescript ? '' : null),
      this.addLine(
        0,
        typescript && componentType === 'class' ? `export interface ${name}State {}` : null,
      ),
      this.addLine(0, typescript && componentType === 'class' ? '' : null),
      ...component,
    ];
  };

  protected getClassComponent = (name: string) => {
    const { typescript, tag } = this._options;

    const className = this.getClassName(name);

    return [
      this.addLine(
        0,
        `class ${name} extends Component${typescript ? `<${name}Props, ${name}State>` : ''} {`,
      ),
      this.addLine(1, 'state = {};'),
      this.addLine(0, ''),
      this.addLine(1, 'render() {'),
      this.addLine(2, `return <${tag}${className}>${name} Class Component</${tag}>;`),
      this.addLine(1, '}'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  protected getFunctionComponent = (name: string) => {
    const { typescript, tag } = this._options;

    const className = this.getClassName(name);

    return [
      this.addLine(
        0,
        `const ${name}${typescript ? `: FC<${name}Props>` : ''} = (${
          Object.keys(this.props).length ? `{${Object.keys(this.props).join(', ')}}` : ''
        }) => {`,
      ),
      this.addLine(1, `return <${tag}${className}>${name} Function Component</${tag}>;`),
      this.addLine(0, '};'),
      this.addLine(0, ''),
    ];
  };

  protected getClassName = (name: string) => {
    const { cssModules } = this._options;

    if (hasStyles(this._options)) {
      return ` className=${cssModules ? '{classes.Container}' : `'${toKebabCase(name)}'`}`;
    }

    return '';
  };
}

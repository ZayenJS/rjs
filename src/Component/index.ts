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

    //! ACTIVATE THIS TO TEST FILE
    logger.exit(this.getData());

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
    // TODO: take class component into account
    const { componentType, cssModules, importReact, styling, typescript, tag } = this.options;

    return [
      this.addLine(0, importReact && typescript ? `import React, { FC } from 'react';` : null),
      this.addLine(0, importReact && !typescript ? "import React from 'react';" : null),
      this.addLine(0, !importReact && typescript ? "import { FC } from 'react';" : null),
      this.addLine(0, importReact || typescript ? '' : null),
      this.addLine(
        0,
        ['css', 'scss'].includes(styling) && !cssModules
          ? `import './${this.name}.${styling}';`
          : null,
      ),
      this.addLine(
        0,
        ['css', 'scss'].includes(styling) && cssModules
          ? `import './${this.name}.module.${styling}';`
          : null,
      ),
      this.addLine(0, importReact || typescript ? '' : null),
      this.addLine(0, typescript ? `export interface ${this.name}Props {}` : null),
      this.addLine(0, importReact || typescript ? '' : null),
      this.addLine(0, `const ${this.name}${typescript ? `: FC<${this.name}Props>` : ''} = () => {`),
      this.addLine(1, 'return ('),
      // TODO: apply class to div
      this.addLine(2, `<${tag}>${this.name} Component</${tag}>`),
      this.addLine(1, ');'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
      this.addLine(0, `export default ${this.name};`),
    ]
      .filter((line) => typeof line === 'string')
      .join('\n');
  };
}

export default new Component();

// return [
//     line(0, ostr(props === 'jsdoc', '//@ts-check')),
//     line(0, ostr(importReact, "import React from 'react';")),
//     line(0, ostr(createStylesFile && stylingModule, `import classes from './${kcName}.module.${styling}';`)),
//     line(0, ostr(createStylesFile && !stylingModule, `import './${kcName}.${styling}';`)),
//     line(0, ostr(styling === 'jss', "import { createUseStyles } from 'react-jss';")),
//     line(0, ostr(styling === 'mui', "import { makeStyles } from '@material-ui/core';")),
//     line(0, ostr(props === 'prop-types', "import PropTypes from 'prop-types';")),
//     '',
//     line(0, ostr(styling === 'jss', 'const useStyles = createUseStyles({});')),
//     line(0, ostr(styling === 'mui', `const useStyles = makeStyles((theme${cstr(typescript, ': Theme')}) => {});`)),
//     line(0, ostr(styling === 'jss' || styling === 'mui', '')),

//     line(0, ostr(TSProps, `export interface ${pcName}Props {}`)),
//     line(0, ostr(TSProps, '')),

//     line(0, ostr(props === 'jsdoc', '/**')),
//     line(0, ostr(props === 'jsdoc', ` * @typedef ${interfaceName}`)),
//     line(0, ostr(props === 'jsdoc', ' */')),

//     line(0, ostr(props === 'jsdoc', '/**')),
//     line(0, ostr(props === 'jsdoc', ` * @type {${componentType}}`)),
//     line(0, ostr(props === 'jsdoc', ' */')),

//     line(0, `export const ${pcName}${cstr(TSProps, `: ${componentType}`)} = (${cstr(children, '{ children }')}) => {`),
//     '',
//     line(1, ostr(styling === 'jss' || styling === 'mui', 'const classes = useStyles();')),
//     line(1, ostr(styling === 'jss' || styling === 'mui', '')),

//     line(1, 'return ('),
//     line(2, `${children ? '<div>{children}</div>' : '<div />'}`),
//     line(1, ');'),
//     line(0, '}'),
//     line(0, ostr(props === 'prop-types', '')),
//     line(0, ostr(props === 'prop-types', `${pcName}.propTypes = {}`))
//   ].filter(line => typeof line === 'string').join('\n');

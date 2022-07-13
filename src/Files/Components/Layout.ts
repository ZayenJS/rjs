import { ComponentFile } from '../ComponentFile';

export class LayoutComponent extends ComponentFile {
  protected getHeaderImports = () => {
    const { componentType, importReact, typescript } = this._options;

    let headerImport = null;

    if (importReact && typescript) {
      headerImport = `import React, { FC, ReactNode } from 'react';`;
    } else if (importReact && !typescript) {
      headerImport = "import React from 'react';";
    } else if (!importReact && typescript) {
      headerImport = "import { FC, ReactNode } from 'react';";
    }

    if (componentType === 'class') {
      headerImport = importReact
        ? `import React, { Component } from 'react';`
        : `import { Component } from 'react';`;
    }

    return [
      this.addLine(0, headerImport),
      this.addLine(0, importReact || typescript || componentType === 'class' ? '' : null),
      this.addLine(0, `import Header from '../Header/Header';`),
      this.addLine(0, `import Footer from '../Footer/Footer';`),
      this.addLine(0, ''),
    ];
  };

  protected getClassComponent = (name: string) => {
    const { typescript } = this._options;

    const className = this.getClassName(name);
    this.addProps({ 'children?': 'ReactNode | ReactNode[]' });

    const props = Object.keys(this.props)
      .map((prop) => prop.replace(/\?/g, ''))
      .join(', ');

    return [
      this.addLine(
        0,
        `class ${name} extends Component${typescript ? `<${name}Props, ${name}State>` : ''} {`,
      ),
      this.addLine(1, 'state = {};'),
      this.addLine(0, ''),
      this.addLine(1, 'render () {'),
      this.addLine(2, `const { ${props} } = this.props;`),
      this.addLine(2, `return (<div ${className}>`),
      this.addLine(3, `<Header />`),
      this.addLine(3, `<main>{children}</main>`),
      this.addLine(3, `<Footer />`),
      this.addLine(2, '</div>)'),
      this.addLine(1, '}'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  protected getFunctionComponent = (name: string) => {
    const { typescript } = this._options;

    const className = this.getClassName(name);

    this.addProps({ 'children?': 'ReactNode | ReactNode[]' });

    const props = Object.keys(this.props)
      .map((prop) => prop.replace(/\?/g, ''))
      .join(', ');

    return [
      this.addLine(
        0,
        `const ${name}${typescript ? `: FC<${name}Props>` : ''} = (${
          Object.keys(this.props).length ? `{ ${props} }` : ''
        }) => {`,
      ),
      this.addLine(1, 'return ('),
      this.addLine(2, `<div${className}>`),
      this.addLine(3, `<Header />`),
      this.addLine(3, `<main>{children}</main>`),
      this.addLine(3, `<Footer />`),
      this.addLine(2, '</div>'),
      this.addLine(1, ');'),
      this.addLine(0, '};'),
      this.addLine(0, ''),
    ];
  };
}

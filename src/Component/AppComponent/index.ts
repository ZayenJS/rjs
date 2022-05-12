import { ComponentOptions } from '../../@types';
import CLI from '../../CLI/CLI';
import { ComponentFile } from '../ComponentFile';

export class AppComponent extends ComponentFile {
  constructor(options: ComponentOptions) {
    super('App', options);
  }
  protected getClassComponent = (name: string) => {
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

  protected getFunctionComponent = (name: string) => {
    const { typescript, tag } = this.options;

    const className = this.getClassName(name);

    return [
      this.addLine(
        0,
        `const ${name}${typescript ? `: FC<${name}Props>` : ''} = (${
          Object.keys(this.props).length ? `{${Object.keys(this.props).join(', ')}}` : ''
        }) => {`,
      ),
      this.addLine(1, 'return ('),
      this.addLine(2, `<${tag}${className}>Hello from ${CLI.getPackageName('long')}!</${tag}>`),
      this.addLine(1, ');'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  protected getData = (name: string = this.name) =>
    this.parse([
      ...this.getHeaderImports(),
      this.addLine(0, 'import "some_logo";'),
      ...this.getStylingImports(name),
      ...this.getComponentBody(name),
      this.addLine(0, `export default ${name};`),
    ]);
}

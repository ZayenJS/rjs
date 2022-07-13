import { ComponentOptions } from '../../@types';
import CLI from '../../CLI';
import { ComponentFile } from '../ComponentFile';

export class AppComponent extends ComponentFile {
  constructor(options: ComponentOptions) {
    super({
      name: 'App',
      options,
      dirPath: 'src',
    });
  }

  public generate = async (forceCreateFile = true) => {
    return this._generate(
      this._name,
      this._options.typescript ? 'tsx' : 'js',
      'component',
      forceCreateFile,
    );
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
      this.addLine(1, 'render () {'),
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
      this.addLine(1, 'return ('),
      this.addLine(2, `<${tag}${className}>Hello from ${CLI.getPackageName('long')}!</${tag}>`),
      this.addLine(1, ');'),
      this.addLine(0, '}'),
      this.addLine(0, ''),
    ];
  };

  protected getData = (name: string = this._name) =>
    this.parse([
      ...this.getHeaderImports(),
      this.addLine(0, 'import "../logo.svg";'),
      ...this.getStylingImports(name),
      ...this.getComponentBody(name),
      this.addLine(0, `export default ${name};`),
    ]);
}

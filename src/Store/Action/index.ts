import { BaseFile } from '../../Files/BaseFile/BaseFile';

interface ActionOptions {
  typescript: boolean;
  flat: boolean;
}

export class Action extends BaseFile<ActionOptions> {
  public constructor(name: string, options: ActionOptions) {
    super({ name, options, dirPath: 'src/store/actions' });
  }

  public generate = async (forceCreateFile = true) => {
    return this._generate(
      this._name,
      this._options.typescript ? 'ts' : 'js',
      'action',
      forceCreateFile,
    );
  };

  protected getData = () => {
    if (this._data) return this._data;

    if (this._name === 'index') return this.parse([this.addLine(0, `export * from './template';`)]);

    return this.parse([]);
  };
}

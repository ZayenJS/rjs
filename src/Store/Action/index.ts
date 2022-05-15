import { BaseFile } from '../../Component/BaseFile/BaseFile';

interface ActionOptions {
  typescript: boolean;
  flat: boolean;
}

export class Action extends BaseFile<ActionOptions> {
  protected _dirPath = 'src/store/actions';
  protected _possibleFileExtensions: [string, string] = ['ts', 'js'];

  public constructor(name: string, options: ActionOptions) {
    super(name, options);
  }

  protected getData = () => {
    if (this._data) return this._data;

    if (this.name === 'index') return this.parse([this.addLine(0, `export * from './template';`)]);

    return this.parse([]);
  };
}

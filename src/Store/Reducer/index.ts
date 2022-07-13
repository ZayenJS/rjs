import { BaseFile } from '../../Files/BaseFile/BaseFile';

interface ReducerOptions {
  typescript: boolean;
  flat: boolean;
  state?: { [key: string]: string };
}

export class Reducer extends BaseFile<ReducerOptions> {
  public constructor(name: string, options: ReducerOptions) {
    super({ name, options, dirPath: 'src/store/reducers' });
  }

  public generate = async (forceCreateFile = true) => {
    return this._generate(
      this._name,
      this._options.typescript ? 'ts' : 'js',
      'reducer',
      forceCreateFile,
    );
  };

  protected getData = () => {
    if (this._data) return this._data;

    if (this._name === 'index') {
      const data: (string | null)[] = [
        this.addLine(0, `import { combineReducers } from '@reduxjs/toolkit';`),
        this.addLine(0, `import { templateReducer } from './template';`),
        this.addLine(0, ''),
        this.addLine(0, `const rootReducer = combineReducers({ template: templateReducer });`),
        this.addLine(0, ''),
        this.addLine(0, `export default rootReducer;`),
        this.addLine(0, ''),
      ];

      return this.parse(data);
    }

    return this.parse([]);
  };
}

import { BaseFile } from '../../Component/BaseFile/BaseFile';

interface ReducerOptions {
  typescript: boolean;
  flat: boolean;
  state?: { [key: string]: string };
}

export class Reducer extends BaseFile<ReducerOptions> {
  protected _dirPath = 'src/store/reducers';
  protected _possibleFileExtensions: [string, string] = ['ts', 'js'];

  public constructor(name: string, options: ReducerOptions) {
    super(name, options);
  }

  protected gatherOptionsInteractively(): Promise<void> {
    return Promise.resolve();
  }

  protected getData = () => {
    if (this._data) return this._data;

    if (this.name === 'index') {
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

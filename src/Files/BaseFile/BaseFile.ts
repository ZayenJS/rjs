import path from 'path';
import sh from '../../Shell';
import FileUtil from '../../FileUtil';

export abstract class BaseFile<T extends { flat: boolean }> {
  protected _name = '';
  protected _nameWithExtension = '';
  protected _data: string;
  protected _dirPath;
  protected _options: T;

  public getFileName = () => this._nameWithExtension;

  constructor(params: {
    name: string;
    dirPath?: string;
    data?: string;
    possibleExtensions?: [string, string];
    options: T;
  }) {
    this._name = params.name;
    this._dirPath = params.dirPath ?? '';
    this._data = params.data ?? '';
    this._options = params.options;
  }

  protected addLine = (tabs = 0, str: string | null = null) => {
    if (str === null) {
      return null;
    }

    return str ? '  '.repeat(tabs) + str : '';
  };

  protected abstract getData: (name?: string) => string | Promise<string>;

  public setDirPath = (dirPath: string) => {
    this._dirPath = dirPath;

    return this;
  };

  public setData = (data: string) => {
    this._data = data;

    return this;
  };

  public abstract generate: (forceCreateFile: boolean) => Promise<boolean>;

  protected _generate = async (
    fileName: string = '',
    extension: 'scss' | 'css' | 'tsx' | 'ts' | 'js' = 'ts',
    type: string = '',
    forceCreateFile = false,
  ) => {
    this._nameWithExtension = `${fileName}.${extension}`;
    const { _dirPath } = this;

    const file = await FileUtil.createFile(
      path.join(_dirPath, this._options.flat ? '' : this._name),
      this._nameWithExtension,
      forceCreateFile,
    );

    let response = true;

    if (file) {
      const { overwrite } = await sh.alreadyExistPromp(
        `The ${type} ${this._nameWithExtension} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response) {
      await FileUtil.writeToFile(
        path.join(_dirPath, this._options.flat ? '' : this._name, this._nameWithExtension),
        await this.getData(),
      );
    }

    return response;
  };

  protected parse = (collection: unknown[]) =>
    collection.filter((line) => typeof line === 'string').join('\n');
}

import path from 'path';
import sh from '../../Shell';
import FileUtil from '../../FileUtil';
import Logger from '../../Logger';

export abstract class BaseFile<T extends { typescript: boolean; flat: boolean }> {
  protected _nameWithExtension = '';
  protected _dirPath = '';
  protected _possibleFileExtensions: [string, string] = ['', ''];
  protected _data: string = '';

  public getFileName = () => this._nameWithExtension;

  constructor(protected name: string, protected options: T) {}

  protected addLine = (tabs = 0, str: string | null = null) => {
    if (str === null) {
      return null;
    }

    return str ? '  '.repeat(tabs) + str : '';
  };

  protected abstract getData: (name?: string) => string | Promise<string>;

  public setData = (data: string) => {
    this._data = data;

    return this;
  };

  public generate = async (forceCreateFile: boolean) => this._generate(forceCreateFile);

  protected _generate = async (forceCreateFile = false) => {
    const fileName = `${this.name}.${
      this.options.typescript ? this._possibleFileExtensions[0] : this._possibleFileExtensions[1]
    }`;
    this._nameWithExtension = fileName;
    const { _dirPath } = this;

    Logger.debug(`Generating file ${fileName} in ${_dirPath}`);
    Logger.debug(path.join(_dirPath, this.options.flat ? '' : this.name));

    const file = await FileUtil.createFile(
      path.join(_dirPath, this.options.flat ? '' : this.name),
      fileName,
      forceCreateFile,
    );

    let response = true;

    if (file) {
      const { overwrite } = await sh.alreadyExistPromp(
        `The component ${fileName} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response) {
      await FileUtil.writeToFile(
        path.join(_dirPath, this.options.flat ? '' : this.name, fileName),
        await this.getData(),
      );
    }

    return response;
  };

  protected parse = (collection: unknown[]) =>
    collection.filter((line) => typeof line === 'string').join('\n');
}

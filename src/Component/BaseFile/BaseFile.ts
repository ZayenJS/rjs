export abstract class BaseFile<T> {
  protected _nameWithExtension = '';

  public getFileName = () => this._nameWithExtension;

  constructor(protected name: string, protected options: T) {}

  protected addLine = (tabs = 0, str: string | null = null) => {
    if (str === null) {
      return null;
    }

    return str ? '  '.repeat(tabs) + str : '';
  };

  protected abstract getData: (name: string) => void;

  public abstract generate: () => Promise<boolean>;
}

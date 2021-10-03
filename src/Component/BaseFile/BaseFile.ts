import { ComponentOptions } from '../../@types';

export abstract class BaseFile {
  constructor(protected name: string, protected options: ComponentOptions) {}

  protected addLine = (tabs = 0, str: string | null = null) => {
    if (str === null) {
      return null;
    }

    return str ? '\t'.repeat(tabs) + str : '';
  };

  protected abstract getData: (name: string) => void;
}

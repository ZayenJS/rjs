import os from 'os';
import Logger from '../Logger';

import sh from '../Shell';
import { sleep } from '../utils';

export class Folder {
  public constructor(private _basePath: string, private _folders: string[]) {}

  public create = async () => {
    const separator = os.platform() === 'win32' ? '\\' : '/';

    for (const folder of this._folders) {
      sh.exec('mkdir', ['-p', `${this._basePath}${separator}${folder}`]);
      Logger.italic(
        'green',
        `${this._basePath}${separator}${folder} directory created successfully.`,
      );
      await sleep(100);
    }

    return this;
  };
}

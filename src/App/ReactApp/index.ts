import shell from 'shelljs';

import logger from '../../Logger';
import component from '../../Component';
import { ReactAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';

export class ReactApp extends AppConfig {
  constructor(protected options: ReactAppOptions) {
    super();
  }

  public generate = async () => {
    this.createReactApp();
    // TODO: add custom App component and custom index file etc...
  };

  private createReactApp = () => {
    let command = `npx create-react-app ${this.options.name}`;
    if (this.options.typescript) command += ' --template typescript';
    shell.exec(command);
  };
}

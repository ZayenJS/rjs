import chalk from 'chalk';
import { NextAppOptions, ReactAppOptions } from '../@types';
import Logger from '../Logger';
import sh from '../Shell';
import { sleep } from '../utils';

export class Dependencies {
  private command: { base: string[]; dev: string[] } = {
    base: [],
    dev: [],
  };

  public constructor(private options: ReactAppOptions | NextAppOptions) {}

  public add = (name: string, devDep: boolean = false, atTypes: boolean = true) => {
    if (devDep) {
      this.command.dev = [...this.command.dev, atTypes ? `@types/${name}` : name];

      return this;
    }

    this.command.base = [...this.command.base, name];

    if (this.options.typescript) {
      const type = atTypes ? '@types/' : '';
      this.command.dev = [...this.command.dev, `${type}${name}`];
    }
  };

  public buildFromOptions = () => {
    if (this.options.typescript) {
      this.add('typescript', true, false);
    }

    if (this.options.redux) {
      this.add('@reduxjs/toolkit', false, false);
      this.add('react-redux', false, true);
    }

    if (this.options.router) {
      this.add('react-router-dom', false, true);
    }

    if (this.options.axios) {
      this.add('axios', false, true);
    }

    if (this.options.styling === 'scss') {
      this.add('sass', true, false);
    }

    return this;
  };

  public install = async () => {
    if (this.options.packageManager === 'npm') {
      if (this.command.base.length) {
        console.info('Installing', chalk.italic.blueBright(this.command.base.join(' ')));
        await sleep(1000);
        sh.exec('npm', ['install', ...this.command.base]);
      }

      if (this.options.typescript && this.command.dev.length) {
        console.info(
          'Installing dev dependencies',
          chalk.italic.blueBright(this.command.dev.join(' ')),
        );
        await sleep(1000);
        sh.exec('npm', ['install', '-D', ...this.command.dev]);
      }
    } else if (this.options.packageManager === 'yarn') {
      if (this.command.base.length) {
        console.info('Installing', chalk.italic.blueBright(this.command.base.join(' ')));
        await sleep(1000);
        sh.exec('yarn', ['add', ...this.command.base]);
      }

      if (this.options.typescript && this.command.dev.length) {
        console.info(
          'Installing dev dependencies',
          chalk.italic.blueBright(this.command.dev.join(' ')),
        );
        await sleep(1000);
        sh.exec('yarn', ['add', '-D', ...this.command.dev]);
      }
    }
  };
}

import shell from 'shelljs';
import { prompt } from 'enquirer';

import logger from '../Logger';
import { ConfigFile } from '../ConfigFile';
import { ReactApp } from './ReactApp';
import { NextApp } from './NextApp';
import { AppOptions, ComponentType, Styling } from '../@types';
import { AppConfig } from './AppConfig';
import { sleep } from '../utils';
import sh from '../Shell';

export class App extends AppConfig {
  private gatherOptionsInteractively = async (type: 'react' | 'next') => {
    if (!this.options.name) {
      const { name }: { name: string } = await prompt({
        type: 'input',
        name: 'name',
        message: 'What is the name of the app?',
      });

      this.options.name = name;
    }

    if (type === 'react') {
      const { importReact } = await sh.togglePrompt(
        'importReact',
        'Do you want to import React from react ?',
      );

      this.options.importReact = importReact;
    }

    const { typescript } = await sh.togglePrompt('typescript', 'Do you want to use typescript?');

    const { styling }: { styling: Styling } = await prompt({
      type: 'select',
      name: 'styling',
      message: 'Which styling option do you want? (pick one)',
      choices: ['css', 'scss', 'none'],
    });

    if (styling !== 'none') {
      const { cssModules }: { cssModules: boolean } = await prompt({
        type: 'toggle',
        name: 'cssModules',
        message: 'Do you want to use css modules?',
        required: true,
      });

      this.options.cssModules = cssModules;
    }

    const { componentType }: { componentType: ComponentType } = await prompt({
      type: 'select',
      name: 'componentType',
      message: 'What type of components fo you use?',
      choices: ['function', 'class'],
    });

    const { componentDir }: { componentDir: string } = await prompt({
      type: 'input',
      name: 'componentDir',
      message:
        'Where do you want your components to be generated? (please use a relative path. e.g: src/components)',
    });

    const { router }: { router: boolean } = await prompt({
      type: 'toggle',
      name: 'router',
      message: 'Do you plan on using a router?',
      required: true,
    });

    const { redux }: { redux: boolean } = await prompt({
      type: 'toggle',
      name: 'redux',
      message: 'Do you want redux as your state management option?',
      required: true,
    });

    const { axios }: { axios: boolean } = await prompt({
      type: 'toggle',
      name: 'axios',
      message: 'Do you need axios?',
      required: true,
    });

    const { packageManager }: { packageManager: 'npm' | 'yarn' } = await prompt({
      type: 'select',
      name: 'componentType',
      message: 'What package manager do you want to use?',
      choices: ['npm', 'yarn'],
    });

    this.options = {
      ...this.options,
      typescript,
      styling,
      componentType,
      componentDir,
      router,
      redux,
      axios,
      packageManager,
    };
  };

  public createReactApp = async (name: string, options: AppOptions) => {
    if (!name || options.interactive) {
      await this.gatherOptionsInteractively('react');
    } else {
      this.options.name = name;
      this.options = this.parseAppOptions(options);
    }

    const reactApp = new ReactApp(this.options);
    await reactApp.generate();
    const confFile = new ConfigFile(`${this.options.name}/`);
    await confFile.generate({ ...this.options, type: 'react' });
    await this.commit();
  };

  public createNextApp = async (name: string, options: AppOptions) => {
    if (!name) {
      this.gatherOptionsInteractively('next');
    }

    shell.exec(`npx create-react-app ${name}`);
    const confFile = new ConfigFile(name + '/');
    await confFile.generate({ ...options, type: 'next', pageDir: 'pages' });
    const nextApp = new NextApp(name, this.options);
    await nextApp.generate();
  };

  private parseAppOptions = (options: AppOptions) => {
    const opts: any = { ...this.options };
    for (const [key, value] of Object.entries(options)) {
      if (value) {
        opts[key] = value;
      }
    }

    return opts as AppOptions;
  };

  private commit = async () => {
    try {
      logger.log('yellow', 'Creating git commit...');
      shell.cd(this.options.name);
      await sleep(2000);
      shell.exec('git add .');
      shell.exec('git commit --amend -qm "initial commit made by r8y!"');
      logger.log('green', 'Done !');
    } catch (e) {
      console.log(e);
    }
  };
}

export default new App();

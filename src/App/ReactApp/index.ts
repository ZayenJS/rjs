import { spawnSync } from 'child_process';

import shell from 'shelljs';
import { ReactAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';
import { StyleFile } from '../../Component/StyleFile';
import { ConfigFile } from '../../ConfigFile';
import { AppComponent } from '../../Component/AppComponent';
import Logger from '../../Logger';

export class ReactApp extends AppConfig {
  constructor(protected options: ReactAppOptions) {
    super();
  }

  public generate = async () => {
    await this.createReactApp();

    shell.cd(this.options.name);

    const confFile = new ConfigFile();
    await confFile.generate({ ...this.options, type: 'react' });

    shell.rm('src/App.*', 'src/index.*');

    const options = {
      importReact: this.options.importReact,
      typescript: this.options.typescript,
      styling: this.options.styling,
      cssModules: this.options.cssModules,
      componentType: this.options.componentType,
      componentDir: 'src',
      hooksDir: this.options.hooksDir,
      tag: 'div',
      flat: false,
      packageManager: this.options.packageManager,
      pageDir: this.options.pageDir,
    };

    // TODO: create the app component content
    const appComponent = new AppComponent(options);
    await appComponent.generate(true);

    const appStyleFile = new StyleFile('App', options);
    await appStyleFile.generate();

    // TODO: add custom index file etc...
    // TODO: REFACTOR!
    shell.touch('src/index.tsx');
    shell.mkdir('src/components');
    shell.mkdir('src/pages');
    shell.mkdir('src/hooks');

    Logger.log('green', 'Directory src/components created');
    Logger.log('green', 'Directory src/pages created');
    Logger.log('green', 'Directory src/hooks created');

    if (this.options.redux) {
      shell.mkdir('src/store');
      // TODO: create store file
      shell.touch('src/store/index.ts');
      shell.mkdir('src/store/reducers');
      shell.mkdir('src/store/actions');
      shell.mkdir('src/store/middlewares');

      shell.touch('src/store/reducers/index.ts');
      shell.touch('src/store/actions/index.ts');
      shell.touch('src/store/middlewares/index.ts');

      Logger.log('green', 'Redux store files and folders successfully created!');
    }

    shell.mkdir('src/utils');
    shell.mkdir('src/assets');
    shell.mkdir(`src/assets/${this.options.styling !== 'none' ? this.options.styling : ''}`);
    // TODO: add reset css + scss variables if needed
    shell.mkdir('src/assets/images');
    shell.mkdir('src/assets/fonts');
    shell.mkdir('src/assets/icons');

    Logger.log('green', 'Directory src/utils created');
    Logger.log('green', 'Directory src/assets created');
    Logger.log(
      'green',
      `src/assets/${this.options.styling !== 'none' ? this.options.styling : ''}`,
    );
    Logger.log('green', 'Directory src/assets/images created');
    Logger.log('green', 'Directory src/assets/fonts created');
    Logger.log('green', 'Directory src/assets/icons created');
  };

  private createReactApp = async () => {
    const options = ['create-react-app', this.options.name];

    if (this.options.typescript) {
      options.push('--template', 'typescript');
    }

    spawnSync('npx', options, {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  };
}

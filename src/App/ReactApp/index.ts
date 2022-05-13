import { spawnSync } from 'child_process';

import shell from 'shelljs';
import { ReactAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';
import { StyleFile } from '../../Component/StyleFile';
import { ConfigFile } from '../../ConfigFile';
import { AppComponent } from '../../Component/AppComponent';
import Logger from '../../Logger';
import sh from '../../Shell';
import { Dependencies } from '../../Dependencies';
import { Folder } from '../../Folder';
import { sleep } from '../../utils';
import { AppEntryPoint } from '../../Component/AppEntryPoint';

export class ReactApp extends AppConfig {
  constructor(protected options: ReactAppOptions) {
    super();
  }

  public generate = async () => {
    await this.createReactApp();
    shell.cd(this.options.name);

    await new Dependencies(this.options).buildFromOptions().install();

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
    const appEntryPoint = new AppEntryPoint(options, [
      this.options.redux ? 'redux' : '',
      this.options.router ? 'react-router-dom' : '',
    ]);
    await appEntryPoint.generate(true);

    // TODO: REFACTOR!
    shell.touch('src/index.tsx');

    await new Folder('src', ['components', 'hooks', 'pages', 'utils']).create();

    const styling = this.options.styling ?? '';
    // TODO: add reset css + scss variables if needed
    await new Folder('src/assets', [styling, 'images', 'fonts', 'icons']).create();

    if (this.options.redux) {
      await new Folder('src/store', ['actions', 'reducers', 'selectors', 'middlewares']).create();
      // TODO: create store file
      shell.touch('src/store/index.ts');

      shell.touch('src/store/reducers/index.ts');
      shell.touch('src/store/actions/index.ts');
      shell.touch('src/store/middlewares/index.ts');

      Logger.italic('green', 'Redux store files and folders created successfully.');
    }
  };

  private createReactApp = async () => {
    const options = ['create-react-app', this.options.name];

    if (this.options.typescript) {
      options.push('--template', 'typescript');
    }

    sh.exec('npx', options);
  };
}

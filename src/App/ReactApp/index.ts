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
import { AppEntryPoint } from '../../Component/AppEntryPoint';
import { Store } from '../../Store';

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
      const store = await new Store({ typescript: this.options.typescript, flat: true }).create();
      await store.generate();

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

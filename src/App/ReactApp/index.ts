import shell from 'shelljs';
import { ReactAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';
import { StyleFile } from '../../Files/StyleFile';
import { ConfigFile } from '../../ConfigFile';
import { AppComponent } from '../../Files/AppComponent';
import Logger from '../../Logger';
import sh from '../../Shell';
import { Dependencies } from '../../Dependencies';
import { Folder } from '../../Folder';
import { AppEntryPoint } from '../../Files/AppEntryPoint';
import { Store } from '../../Store';
import { CSSReset } from '../../Files/CSSReset';
import { StyleFileFromTemplate } from '../../Files/StyleFileFromTemplate';
import { ComponentFile } from '../../Files/ComponentFile';
import { LayoutComponent } from '../../Files/Components/Layout';

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

    const styling = this.options.styling ?? '';

    const promises = [];

    promises.push(
      // TODO: create the app component content
      new AppComponent(options).generate(true),
      new StyleFile('App', options).generate(true),
      new AppEntryPoint(options, [
        this.options.redux ? 'redux' : '',
        this.options.router ? 'react-router-dom' : '',
      ]).generate(true),
      new Folder('src', ['components', 'hooks', 'pages', 'utils']).create(),
      new Folder('src/assets', [styling, 'images', 'fonts', 'icons']).create(),
    );

    if (styling !== 'none') {
      const fileName = styling === 'scss' ? '_reset' : 'reset';

      promises.push(
        new CSSReset(fileName, {
          ...options,
          flat: true,
          cssModules: false,
          dirPath: `src/assets/${styling}`,
        }).generate(true),
        new StyleFile('index', {
          ...options,
          flat: true,
          cssModules: false,
          dirPath: `src/assets/${styling}`,
        })
          .setData(styling === 'scss' ? '@import "./reset";' : '')
          .generate(true),
      );

      if (styling === 'scss') {
        promises.push(
          new StyleFileFromTemplate('_variables', {
            ...options,
            flat: true,
            cssModules: false,
            dirPath: `src/assets/${styling}`,
          }).generate(true),
          new StyleFileFromTemplate('_mixins', {
            ...options,
            flat: true,
            cssModules: false,
            dirPath: `src/assets/${styling}`,
          }).generate(true),
        );
      }
    }

    promises.push(
      new ComponentFile({
        name: 'Header',
        options,
        dirPath: 'src/components',
      }).generate(true),
      new StyleFile('Header', {
        ...options,
        dirPath: 'src/components',
      }).generate(true),
      new ComponentFile({
        name: 'Footer',
        options,
        dirPath: 'src/components',
      }).generate(true),
      new StyleFile('Footer', {
        ...options,
        dirPath: 'src/components',
      }).generate(true),
      new LayoutComponent({
        name: 'Layout',
        options,
        dirPath: 'src/components',
      }).generate(true),
      new StyleFile('Layout', {
        ...options,
        dirPath: 'src/components',
      }).generate(true),
    );

    await Promise.all(promises);

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

import { AppOptions } from '../@types';

export abstract class AppConfig {
  protected options: AppOptions = {
    name: '',
    interactive: false,
    router: false,
    redux: false,
    axios: false,
    importReact: false,
    typescript: false,
    styling: 'scss',
    cssModules: false,
    componentType: 'function',
    componentDir: 'src/components',
    containerDir: 'src/containers',
    pageDir: 'src/pages',
    packageManager: 'npm',
  };
}

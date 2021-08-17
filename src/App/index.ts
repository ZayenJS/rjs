import logger from '../Logger';
import configFile from '../ConfigFile';
import component from '../Component';

export class App {
  public static initProject = async () => {};

  public createReactApp = async () => {
    const componentOptions = component.getDefaultOptions();
    await component.generate('App', componentOptions);
  };

  public createNextApp = () => {};
}

export default new App();

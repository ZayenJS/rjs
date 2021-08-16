import findUp from 'find-up';
import configFile from '../ConfigFile';
import { PACKAGE_NAME } from '../constants';
import logger from '../Logger';
import { hasNoOptions } from '../utils';

class Component {
  public name: string = '';

  public generate = async (componentName: string, options: any) => {
    this.name = componentName;

    options = await this.parseOptions(options);

    console.log(options);

    logger.debug('generate component');
  };

  private parseOptions = async (cliOptions: any) => {
    const baseOptions = await this.getRCFileConfigData();

    for (const key in cliOptions) {
      baseOptions[key] = cliOptions[key];
    }

    return baseOptions;
  };

  private getRCFileConfigData = async () => {
    const rcFilePath = await findUp(`.${PACKAGE_NAME}rc.json`);

    let rcFileJsonContent;
    if (rcFilePath) {
      rcFileJsonContent = await configFile.parse(rcFilePath);
      return JSON.parse(rcFileJsonContent);
    }
  };
}

export default new Component();

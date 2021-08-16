import configFile from '../ConfigFile';

class Shell {
  public parseOptions = async (options: any) => {
    const baseOptions: any = await configFile.getConfig();

    for (const key in options) {
      baseOptions[key] = options[key];
    }

    return baseOptions ?? options;
  };
}

export default new Shell();

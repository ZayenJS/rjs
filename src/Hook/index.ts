import Logger from '../Logger';
import shell from '../Shell';
import { HookFile } from './HookFile';

class Hook {
  public generate = async (hookName: string, options: any) => {
    options = await shell.parseOptions(options);

    const hookFile = new HookFile(hookName, options);
    if (await hookFile.generate()) {
      Logger.log('green', `Hook file successfully generated! (${hookFile.getFileName()})`);
      return;
    }

    Logger.error(`An error occured while generating the "${hookName}" hook.`);
  };
}

export default new Hook();

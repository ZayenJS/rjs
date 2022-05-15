import { NextAppOptions } from '../../@types';
import { AppConfig } from '../AppConfig';

export class NextApp extends AppConfig {
  constructor(private readonly name: string, options: NextAppOptions) {
    super();

    for (const key in options) {
      //@ts-ignore
      this.options[key] = options[key];
    }
  }

  public generate = async () => {
    // TODO: create app component
  };
}

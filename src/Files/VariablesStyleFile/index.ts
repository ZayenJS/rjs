import fsp from 'fs/promises';
import path from 'path';
import { StyleFile } from '../StyleFile';

export class VariablesStyleFile extends StyleFile {
  protected getData = async () => {
    return fsp.readFile(
      path.join(__dirname, '..', '..', '..', 'templates', '_variables.scss'),
      'utf8',
    );
  };
}

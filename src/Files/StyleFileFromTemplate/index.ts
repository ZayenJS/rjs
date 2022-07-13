import fsp from 'fs/promises';
import path from 'path';
import { StyleFile } from '../StyleFile';

export class StyleFileFromTemplate extends StyleFile {
  protected getData = async () => {
    return fsp.readFile(
      path.join(__dirname, '..', '..', '..', 'templates', this.getFileName()),
      'utf8',
    );
  };
}

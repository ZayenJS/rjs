import path from 'path';
import shell from '../../Shell';
import { BaseFile } from '../../Component/BaseFile/BaseFile';
import fileUtil from '../../FileUtil';
import logger from '../../Logger';
import { HookOptions } from '../../@types';

export class HookFile extends BaseFile<HookOptions> {
  public generate = async () => {
    if (!this.name.startsWith('use')) logger.exit('Hooks must start with "use"!');
    if (this.name === 'use') logger.exit('The hook name "use" is invalid!');
    // ? ACTIVATE THIS TO TEST OUTPUT IN SHELL
    // logger.exit(this.options);

    const hookFileName = `${this.name}.${this.options.typescript ? 'ts' : 'js'}`;
    this._nameWithExtension = hookFileName;
    const dirPath = this.options.hooksDir;

    const hookFile = await fileUtil.createFile(path.join(dirPath), hookFileName);

    let response = true;

    if (hookFile) {
      const { overwrite } = await shell.alreadyExistPromp(
        `The hook ${hookFileName} already exists, do you want to overwrite it?`,
      );

      response = overwrite;
    }

    if (response) {
      await fileUtil.writeToFile(path.join(dirPath, hookFileName), this.getData());
    }

    return response;
  };

  protected getData = () =>
    [...this.addImports(), this.addLine(0, ''), ...this.addFunctionBody()]
      .filter((line) => typeof line === 'string')
      .join('\n');

  private addImports = () => {
    const { useDispatch, useEffect, useSelector, useState } = this.options;

    let reactImports = `import { `;
    let reactReduxImports = `import { `;

    const reactHooks = [];
    const reactReduxHooks = [];

    if (useState) reactHooks.push('useState');
    if (useEffect) reactHooks.push('useEffect');

    if (useSelector) reactReduxHooks.push('useSelector');
    if (useDispatch) reactReduxHooks.push('useDispatch');

    reactImports += `${reactHooks.join(', ')} } from 'react';`;
    reactReduxImports += `${reactReduxHooks.join(', ')} } from 'react-redux';`;

    return [
      reactHooks.length ? this.addLine(0, reactImports) : null,
      reactReduxHooks.length ? this.addLine(0, reactReduxImports) : null,
    ];
  };

  private addFunctionBody = () => {
    const { useDispatch, useEffect, useSelector, useState, typescript } = this.options;

    const state = useState ? this.addLine(1, 'const [state, setState] = useState({});') : null;
    const effect = useEffect
      ? [
          this.addLine(1, 'useEffect(() => {'),
          this.addLine(2, ''),
          this.addLine(2, 'return () => {} // TODO?: implement for cleanup'),
          this.addLine(1, '}, []);'),
        ]
      : [];
    const dispatch = useDispatch ? this.addLine(1, 'const dispatch = useDispatch();') : null;
    const selector = useSelector
      ? this.addLine(
          1,
          `const selector = useSelector((state) => {});${
            typescript ? ' // TODO: type the state parameter' : ''
          }`,
        )
      : null;

    const hasBody = state || effect.length || dispatch || selector;

    return [
      this.addLine(0, `export const ${this.name} = () => {`),
      state,
      selector,
      dispatch,
      hasBody ? this.addLine(0, ``) : null,
      ...effect,
      hasBody ? this.addLine(0, ``) : null,
      this.addLine(1, 'return {}; // TODO?: return value from hook'),
      this.addLine(0, `}`),
    ];
  };
}

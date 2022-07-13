import { BaseFile } from '../Files/BaseFile/BaseFile';
import { Folder } from '../Folder';
import Logger from '../Logger';
import { Action } from './Action';
import { Reducer } from './Reducer';
import sh from '../Shell';

export interface StoreOptions {
  typescript: boolean;
  flat: boolean;
}

export class Store extends BaseFile<StoreOptions> {
  private _generated = false;

  public constructor(options: StoreOptions) {
    super({ name: 'index', options, dirPath: 'src/store', possibleExtensions: ['ts', 'js'] });
  }

  public create = async () => {
    await new Folder('src/store', ['actions', 'middlewares', 'reducers', 'selectors']).create();

    return this;
  };

  public generate = async (forceCreateFile = true) => {
    if (this._generated) return true;

    await this._generate('index', this._options.typescript ? 'ts' : 'js', 'store', forceCreateFile);
    await new Reducer('index', this._options).generate(forceCreateFile);
    await new Reducer('template', this._options)
      .setData(this._getTemplateReducer())
      .generate(forceCreateFile);

    await new Folder('src/store/actions', ['template']).create();

    await new Action('index', this._options)
      .setData(this.parse([this.addLine(0, `export * from './template';`), this.addLine(0, '')]))
      .generate(forceCreateFile);

    await new Action('template/index', this._options)
      .setData(this._getTemplateIndex())
      .generate(forceCreateFile);

    await new Action('template/template.action', this._options)
      .setData(this._getTemplateActions())
      .generate(forceCreateFile);

    if (this._options.typescript) {
      await new Action('template/template.payload', this._options)
        .setData(this._getTemplatePayload())
        .generate(forceCreateFile);
    }

    return true;
  };

  protected getData = () => {
    const data = [
      this.addLine(0, `import { configureStore } from '@reduxjs/toolkit';`),
      this.addLine(0, ''),
      this.addLine(0, `import rootReducer from './reducers';`),
      this.addLine(0, ''),
      this.addLine(0, `const store = configureStore({`),
      this.addLine(1, `reducer: rootReducer,`),
      this.addLine(1, 'devTools: true,'),
      this.addLine(1, 'middleware: [],'),
      this.addLine(0, `});`),
      this.addLine(0, ''),
    ];

    if (this._options.typescript) {
      data.push(this.addLine(0, `export type State = ReturnType<typeof rootReducer>;`));
      data.push(this.addLine(0, ''));
    }

    data.push(this.addLine(0, `export default store;`));
    data.push(this.addLine(0, ''));

    return this.parse(data);
  };

  private _getTemplateReducer = () => {
    const data = [
      this.addLine(0, `import { createReducer } from '@reduxjs/toolkit';`),
      this.addLine(0, `import { setTemplate } from '../actions';`),
      this.addLine(0, ''),
    ];

    if (this._options.typescript) {
      data.push(this.addLine(0, `export type TemplateState = {`));
      data.push(this.addLine(1, `template: string;`));
      data.push(this.addLine(0, `};`));
      data.push(this.addLine(0, ''));
    }

    data.push(
      this.addLine(
        0,
        `const INITIAL_STATE${this._options.typescript ? ': TemplateState' : ''} = {`,
      ),
    );
    data.push(this.addLine(1, `template: '',`));
    data.push(this.addLine(0, `};`));

    data.push(
      this.addLine(0, `export const templateReducer = createReducer(INITIAL_STATE, (builder) => {`),
    );
    data.push(this.addLine(1, `builder.addCase(setTemplate, (state, action) => {`));
    data.push(this.addLine(2, `state.template = action.payload.template;`));
    data.push(this.addLine(1, `});`));
    data.push(this.addLine(0, `});`));
    data.push(this.addLine(0, ''));

    return this.parse(data);
  };

  private _getTemplateIndex = () =>
    this.parse([
      this.addLine(0, `export * from './template.action';`),
      this._options.typescript ? this.addLine(0, `export * from './template.payload';`) : null,
      this.addLine(0, ''),
    ]);

  private _getTemplateActions = () => {
    const data = [
      this.addLine(0, `import { createAction } from '@reduxjs/toolkit';`),
      this._options.typescript
        ? this.addLine(0, `import { SetTemplatePayload } from './template.payload';`)
        : null,
      this.addLine(0, ''),
    ];

    if (this._options.typescript) {
      data.push(
        this.addLine(0, `export enum TemplateActionType {`),
        this.addLine(1, `SET_TEMPLATE = 'SET_TEMPLATE',`),
      );
    } else {
      data.push(
        this.addLine(0, `export const TemplateActionType = {`),
        this.addLine(1, `SET_TEMPLATE: 'SET_TEMPLATE',`),
      );
    }

    data.push(
      this.addLine(0, `}`),
      this.addLine(0, ''),
      this.addLine(0, `export const setTemplate = createAction(`),
      this.addLine(1, `TemplateActionType.SET_TEMPLATE,`),
    );

    if (this._options.typescript) {
      data.push(this.addLine(1, `(payload: SetTemplatePayload) => ({ payload }),`));
    } else {
      data.push(this.addLine(1, `(payload) => ({ payload }),`));
    }

    data.push(this.addLine(0, `);`));
    data.push(this.addLine(0, ''));

    return this.parse(data);
  };

  private _getTemplatePayload = () => {
    const data = [
      this.addLine(0, `export interface SetTemplatePayload {`),
      this.addLine(1, `template: string;`),
      this.addLine(0, `}`),
      this.addLine(0, ''),
    ];

    return this.parse(data);
  };
}

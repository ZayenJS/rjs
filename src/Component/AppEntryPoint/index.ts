import { ComponentOptions } from '../../@types';
import { ComponentFile } from '../ComponentFile';

export class AppEntryPoint extends ComponentFile {
  constructor(options: ComponentOptions, private readonly packages: string[]) {
    super('index', {
      ...options,
      flat: true,
    });
  }

  protected getHeaderImports = () => {
    const headerImports = [
      this.addLine(0, "import { StrictMode } from 'react';"),
      this.addLine(0, "import ReactDOM from 'react-dom/client';"),
      this.addLine(0, "import App from './App/App';"),
      this.addLine(0, "import reportWebVitals from './reportWebVitals';"),
    ];

    if (this.packages.includes('react-router-dom')) {
      headerImports.push(this.addLine(0, "import { Router } from 'react-router-dom';"));
    }

    if (this.packages.includes('redux')) {
      headerImports.push(this.addLine(0, "import { Provider } from 'react-redux';"));
      headerImports.push(this.addLine(0, "import store from './store';"));
    }

    return headerImports;
  };

  protected getData = (name: string = this.name) => {
    const data = [
      ...this.getHeaderImports(),
      ...this.getStylingImports(name),
      this.addLine(0, 'const root = ReactDOM.createRoot('),
      this.addLine(1, 'document.getElementById("root") as HTMLElement'),
      this.addLine(0, ');'),
      this.addLine(0, ''),
      this.addLine(0, 'root.render('),
      this.addLine(1, '<StrictMode>'),
    ];

    const appWrappingComponents = [];

    if (this.packages.includes('react-router-dom')) {
      appWrappingComponents.push(this.addLine(2, '<Router>'));
    }

    if (this.packages.includes('redux')) {
      const indentation = appWrappingComponents.length > 0 ? 3 : 2;
      appWrappingComponents.push(this.addLine(indentation, '<Provider store={store}>'));
    }

    appWrappingComponents.push(this.addLine(appWrappingComponents.length + 2, '<App />'));

    if (this.packages.includes('redux')) {
      const indentation = appWrappingComponents.length > 1 ? 3 : 2;
      appWrappingComponents.push(this.addLine(indentation, '</Provider>'));
    }

    if (this.packages.includes('react-router-dom')) {
      appWrappingComponents.push(this.addLine(2, '</Router>'));
    }

    data.push(...appWrappingComponents);

    data.push(
      this.addLine(1, '</StrictMode>'),
      this.addLine(0, ');'),
      this.addLine(0, ''),
      this.addLine(0, '// If you want to start measuring performance in your app, pass a function'),
      this.addLine(0, '// to log results (for example: reportWebVitals(console.log))'),
      this.addLine(0, '// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals'),
      this.addLine(0, 'reportWebVitals();'),
    );

    return this.parse(data);
  };
}

#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const App_1 = __importDefault(require("./App"));
const ConfigFile_1 = __importDefault(require("./ConfigFile"));
const Component_1 = __importDefault(require("./Component"));
const Container_1 = __importDefault(require("./Container"));
const Page_1 = __importDefault(require("./Page"));
const constants_1 = require("./constants");
commander_1.program.version('1.0.0-beta-0.1');
commander_1.program
    .command('config')
    .description('Creates a config file for ' + constants_1.PACKAGE_NAME)
    .option('-T, --type <type>', 'Specifies the framework used', 'react')
    .option('--import-react', 'This will influence the future component generation with the import React from "react" line', false)
    .option('-t, --typescript', `If true, the components generated by ${constants_1.PACKAGE_NAME} will use typescript`, false)
    .option('-s, --styling <type>', 'The styling to use for the components', 'css')
    .option('-m, --css-modules', 'Whether or not to use the module styling system for css/scss', false)
    .option('-c, --component-type <value>', 'Whether to use funcion or class components', 'function')
    .option('-d, --component-dir <directory_path>', 'The default location to generate components', 'src/components')
    .action(ConfigFile_1.default.generate);
commander_1.program
    .command('new-react-app  [app-name]')
    .description('Uses create-react-app to create a new react app')
    .option('-i, --interactive', 'Starts the interactive mode', false)
    .option('-t, --use-typescript', 'Uses typescript template to create react app', false)
    .option('-r, --use-router', 'Bootstraps a react app with built in react router', false)
    .option('-S, --use-sass', 'Bootstraps a react app with built in node-sass', false)
    .option('-m, --use-modules', 'Uses css/scss modules to create App component', false)
    .option('-R, --use-redux', 'Bootstraps a react app with built in Redux', false)
    .option('-a, --use-axios', 'Bootstraps a react app with built in Axios', false)
    .option('-N, --use-npm', 'Uses npm as a package manager', false)
    .action(App_1.default.createReactApp);
commander_1.program
    .command('new-next-app  [app-name]')
    .description('Uses create-next-app to create a new next app')
    .option('-i, --interactive', 'Starts the interactive mode', false)
    .option('-t, --use-typescript', 'Uses typescript template to create react app', false)
    .option('-S, --use-sass', 'Bootstraps a react app with built in node-sass', false)
    .option('-m, --use-modules', 'Uses css/scss modules to create App component', false)
    .option('-R, --use-redux', 'Bootstraps a react app with built in Redux', false)
    .option('-a, --use-axios', 'Bootstraps a react app with built in Axios', false)
    .option('-N, --use-npm', 'Uses npm as a package manager', false)
    .action(App_1.default.createNextApp);
const generate = commander_1.program.command('generate').alias('g');
generate
    .command('component <component_name>')
    .alias('comp')
    .description('Generates a component with a <name>')
    .option('-d, --component-dir <path>', 'Will generate the component in the specified path', 'src/components')
    .option('-t, --typescript', 'Generates a component with typescript', false)
    .option('-c, --component-type <type>', 'Generate a funcion or class component', 'function')
    .option('-s, --styling <type>', 'Generates a componente with a stylesheet associated with <type> = css | scss', 'scss')
    .option('-m, --css-modules', 'Whether or not to use the module styling system for css/scss', false)
    .option('--import-react', 'This will influence the future component generation with the import React from "react" line', false)
    .action(Component_1.default.generate);
generate.command('container <container_name>').alias('cont').action(Container_1.default.generate);
generate.command('page <page_name>').alias('p').action(Page_1.default.generate);
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map
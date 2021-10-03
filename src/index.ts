#! /usr/bin/env node
import { program } from 'commander';
import app from './App';
import configFile from './ConfigFile';
import component from './Component';
import container from './Container';
import page from './Page';
import { PACKAGE_NAME } from './constants';

program.version('1.0.0-beta-0.1');

/*

    ____ ___  _   _ _____ ___ ____
   / ___/ _ \| \ | |  ___|_ _/ ___|
  | |  | | | |  \| | |_   | | |  _
  | |__| |_| | |\  |  _|  | | |_| |
   \____\___/|_| \_|_|   |___\____|


*/
program
  .command('config')
  .description('Creates a config file for ' + PACKAGE_NAME)
  .option('-T, --type <type>', 'Specifies the framework used')
  .option(
    '--import-react',
    'This will influence the future component generation with the import React from "react" line',
  )
  .option(
    '-t, --typescript',
    `If true, the components generated by ${PACKAGE_NAME} will use typescript`,
  )
  .option('-s, --styling <type>', 'The styling to use for the components')
  .option('-m, --css-modules', 'Whether or not to use the module styling system for css/scss')
  .option('-c, --component-type <value>', 'Whether to use funcion or class components')
  .option('-d, --component-dir <directory_path>', 'The default location to generate components')
  .action(configFile.generate);

/*

   _   _ _______        __
  | \ | | ____\ \      / /
  |  \| |  _|  \ \ /\ / /
  | |\  | |___  \ V  V /
  |_| \_|_____|  \_/\_/


*/
const newCommand = program.command('new');
newCommand
  .command('react-app [app-name]')
  .description('Uses create-react-app to create a new react app')
  .option('-i, --interactive', 'Starts the interactive mode')
  .option('-r, --router', 'Bootstraps a react app with built in react router')
  .option('-R, --redux', 'Bootstraps a react app with built in Redux')
  .option('-a, --axios', 'Bootstraps a react app with built in Axios')
  .option(
    '--import-react',
    'This will influence the future component generation with the import React from "react" line',
  )
  .option(
    '-t, --typescript',
    `If true, the components generated by '${PACKAGE_NAME}' will use typescript`,
  )
  .option('-s, --styling <type>', 'The styling to use for the components')
  .option('-m, --css-modules', 'Whether or not to use the module styling system for css/scss')
  .option('-c, --component-type <value>', 'Whether to use funcion or class components')
  .option('-d, --component-dir <directory_path>', 'The default location to generate components')
  .action(app.createReactApp);

newCommand
  .command('next-app  [app-name]')
  .description('Uses create-next-app to create a new next app')
  .option('-i, --interactive', 'Starts the interactive mode')
  .option('-r, --router', 'Bootstraps a react app with built in react router')
  .option('-R, --redux', 'Bootstraps a react app with built in Redux')
  .option('-a, --axios', 'Bootstraps a react app with built in Axios')
  .option(
    '--import-react',
    'This will influence the future component generation with the import React from "react" line',
  )
  .option(
    '-t, --typescript',
    `If true, the components generated by '${PACKAGE_NAME}' will use typescript`,
  )
  .option('-s, --styling <type>', 'The styling to use for the components')
  .option('-m, --css-modules', 'Whether or not to use the module styling system for css/scss')
  .option('-c, --component-type <value>', 'Whether to use funcion or class components')
  .option('-d, --component-dir <directory_path>', 'The default location to generate components')
  .action(app.createNextApp);

/*

    ____ _____ _   _ _____ ____      _  _____ _____
   / ___| ____| \ | | ____|  _ \    / \|_   _| ____|
  | |  _|  _| |  \| |  _| | |_) |  / _ \ | | |  _|
  | |_| | |___| |\  | |___|  _ <  / ___ \| | | |___
   \____|_____|_| \_|_____|_| \_\/_/   \_\_| |_____|


*/
const generate = program.command('generate').alias('g');

// COMPONENT
generate
  .command('component <component_name>')
  .alias('comp')
  .description('Generates a component with a <component_name>')
  .option('-d, --component-dir <path>', 'Will generate the component in the specified path')
  .option('-t, --typescript', 'Generates a component with typescript')
  .option('-c, --component-type <type>', 'Generate a funcion or class component')
  .option(
    '-s, --styling <type>',
    'Generates a componente with a stylesheet associated with <type> = css | scss',
  )
  .option('-m, --css-modules', 'Whether or not to use the module styling system for css/scss')
  .option(
    '--import-react',
    'This will influence the future component generation with the import React from "react" line',
  )
  .option('-T, --tag <tag_name>', 'The HTML tag to use for the component')
  .action(component.generate);

// CONTAINER
generate
  .command('container <container_name>')
  .description('Generates a container with a <container_name>')
  .option('-t, --typescript', 'Generates a container with typescript', false)
  .alias('cont')
  .action(container.generate);

// PAGE
generate
  .command('page <page_name>')
  .alias('p')
  .description('Generates a page with a <page_name>')
  .option('-t, --typescript', 'Generates a page with typescript', false)
  .action(page.generate);

program.parse(process.argv);

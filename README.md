#

## ❯ Why ?

I've been using React for a while now and I've always been annoyed by the fact that I have to create a new component, container or page every time I need one. I wanted something that would generate the component, container or page for me and also add the import to the index file. I also wanted to be able to customize the way the components are generated. So I created this cli.

## ❯ Getting Started

### Prerequisites

You need to have Node.js installed on your machine. You can download it from [here](https://nodejs.org/en/download/)

You also need to have npm or yarn installed on your machine. You can download it from [here](https://yarnpkg.com/en/docs/install)

## ❯ Install

You can install the cli globally with npm or yarn

```bash
$ npm install -g @zayenjs/rjs
```

```bash
$ yarn global add @zayenjs/rjs
```

## ❯ Usage

### config

Once installed, creating a new React project is simple. You can simply run:

```bash
$ rjs config [options]
```

This will create a rc.json config file for the project

Or if you don't want to install you can run:

```bash
$ npx @zayenjs/rjs config [options]
```

(npx is a package runner tool that comes with npm 5.2+)

#### options

You can customize the config file with the followings

| Option               | Description                                                                                 | Possible Values        | Default Value    |
| -------------------- | ------------------------------------------------------------------------------------------- | ---------------------- | ---------------- |
| -t, --type           | The framework used                                                                          | "react", "next"        | "react"          |
| --import-react       | This will influence the future component generation with the import React from "react" line | true, false            | false            |
| -t, --typescript     | If true, the components generated by \_\_\_\_ will use typescript                           | true, false            | false            |
| -s, --styling        | The styling to use for the components                                                       | css, scss, none        | css              |
| -m, --css-modules    | Whether or not to use the module styling system for css/scss                                | true, false            | false            |
| -c, --component-type | Whether to use funcion or class components                                                  | "function", "class"    | "function"       |
| --component-dir      | The default location to generate components                                                 | any possible directory | "src/components" |
| --page-dir           | The default location to generate pages                                                      | any possible directory | "src/pages"      |

### Generate

#### ❯ component

Here are the options for the component generation

| Option               | Description                                                                                                         | Possible Values                 | Default Value    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------- |
| --import-react       | Whether or not to have the import React from "react"; line                                                          | true, false                     | false            |
| --flat               | If passed the component will not be generated inside a folder but directly inside the specified component directory |                                 | false            |
| -t, --typescript     | If passed, the generated component will be configured for typescript                                                |                                 | false            |
| -T, --tag            | What tag to use as the root component's element                                                                     | any valid html tag or Component | "div"            |
| -s, --styling        | The styling to use for the components                                                                               | css, scss, none                 | css              |
| -m, --css-modules    | Whether or not to use the module styling system for css/scss                                                        |                                 | false            |
| -c, --component-type | Whether to use funcion or class components                                                                          | "function", "class"             | "function"       |
| -d, --component-dir  | The default location to generate components                                                                         | any possible directory          | "src/components" |

> usage

```bash
$ rjs generate component [options] <name>

# or

$ rjs g c [options] <name>


# with typescript and css modules with scss styling

$ rjs g c -t -m -s scss <name>
# or shorter

$ rjs g c -tms scss <name>

# with typescript and css modules with scss styling and class component

$ rjs g c -tms scss -c class <name>

# without css modules with scss styling and typescript

$ rjs g c -ts scss <name>

```

NOTE: If remembering the options is too cumbersome, you can create a config file with the config command and then use the generate command without any options or you can just run the generate command without passing any options and it will switch to interactive mode and ask you for the options.

#### Page

#### Hook

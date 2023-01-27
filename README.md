# @keonnie/vite-plugin-index-html-cloner

Clone the main index.html file in sub directories mainly for Single Page Application hosted in storage like GCS.

We have been deploying most of our single-page application built with [Vite](https://vitejs.dev/) on [Google Cloud Storage](https://cloud.google.com/storage), and our pain point was to let our users directly access different URLs while having only one single entry point. Google Cloud Storage currently does not support redirection or requiring an index.html file in the subdirectory folder when calling the URL directly (without file name). This plugin creates subdirectories from source for those who have a `view.js` file and copies the main `index.html` file to each directory at build time.

# Install

All Keonnie Nodejs projects use yarn: `yarn install`

# Compatibility

| Name | Version |
| ---- | ------- |
| vite | 4.0.0   |

# Setup

Define the file name that is used in all source directories if your directory is a URL path that will require a clone of `index.html`.

```
...
import indexHTMLCloner from '@keonie/vite-plugin-index-html-cloner'

export default {
  ...
  build: {
    outDir: join(__dirname, 'dist'),
    detectViewPattern: 'view.html' // Any common file accross your directories
    ...
  },
  ...
  plugins: [indexHTMLCloner()],
}
```

# Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to contribute to this project.

- [Setup with VSCode](CONTRIBUTING.md#contribute-easily-with-vscode)
- [Start coding](CONTRIBUTING.md#start-coding)

# Documentation

See [Documentation](doc/index.md)

# Testing

See [How to run test](CONTRIBUTING.md#testing) and [Tests Styleguide](CONTRIBUTING.md#tests-styleguide)

# Dependencies

See [DEPENDENCIES.md](DEPENDENCIES.md)

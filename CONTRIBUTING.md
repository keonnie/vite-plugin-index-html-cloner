# Contributing to any of our projects

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to our projects and its packages, which are hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to project owner.

# Contribute easily with VSCode

This project has been built with VSCode in a devcontainer. This allows for development environment consistency across engineers and eases onboarding and setup. This avoids frustration when the environment version changes and the required programming languages and/or dependencies must be installed on the local machine.

1. Open Terminal
1. Clone project
1. `cd` into project root directory
1. Type `code .` (this will open VSCode in current directory)
1. In VSCode, `ctrl+shift+P` and select `Remote container: Rebuild Container`

It usually takes some time the first time to build (download images/container). Once built, you will have all the VSCode plugins required and be able to work on the project. The test explorer is a good tool for debugging and running specific tests visually.

## Start coding

To contribute to this project, follow these steps:

1. Fork/clone this repository
1. Create a branch: `git checkout -b <branch_name>
1. Make your changes
1. Check formatting comply with project's standard: `yarn format`
1. Check all test pass: `yarn test`
1. Commit your changes: `git commit -m '<commit_message>'
1. Push to the original branch: `git push origin <project_name>/<location>
1. Create pull request.

See also:

- [Git commit messages styleguide](#git-commit-message)
- [Commit messages guideline](COMMIT_MESSAGES.md)

## Testing

### Run once

`yarn test`

### Live testing

`yarn dev:test`

## Styleguides

### Before committing

It's our intention to keep the code base as manageable as possible by following standards and our guidelines. We also want to keep the code coverage above 95%. Before pushing, please ensure everything is in order by running the formatting and coverage: `yarn pre-commit`.

This will format the code based on standard rules and run the coverage.

### Git Commit Messages

See [Commit message guideline](COMMIT_MESSAGES.md)

### JavaScript Styleguide

All JavaScript code is linted with [Prettier](https://prettier.io/).

- Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
- Prefer `async/await` to chaining `.then`
- Inline `export`s with expressions whenever possible

  ```js
  // Use this:
  export default class ClassName {

  }

  // Instead of:
  class ClassName {

  }
  export default ClassName
  ```

- Place requires in the following order:
  - Built in Node Modules (such as `path`)
  - Local Modules (using relative paths)
- Place class properties in the following order:
  - Class methods and properties (methods starting with `static`)
  - Instance methods and properties

### Tests Styleguide

- Name end file with `.spec.js` for testing isolated components.
- Name end file with `.test.js` for testing multiple components.
- Mock complex and external dependencies when possible in `__mocks__`
- Include thoughtfully-worded, well-structured [Jest](https://jestjs.io/) tests.
- Put `.test.js` in the corresponding folder under `__tests__`.
- Include the test's type (acceptance, unit) in the first `describe`
- Treat `describe` as a noun or situation.
- Treat `test` as a statement about state or how an operation changes state.

#### Example

```js
describe('Unit | Dog', () => {
  it('barks', () => {})

  describe('when happy' => {
    it('wags its tail' => {})
  })
})
```

### Documentation Styleguide

- Reference methods and classes in markdown with the custom `{}` notation:
  - Reference classes with `{ClassName}`
  - Reference primary with `{Type}`
  - Reference array with `{[]}` including the type `{[String]}`
  - Reference all property of a plain Javascript object

#### Example

```js
/**
 * Perform an action
 * @param {String} name
 * @param {{
 *   id: Number,
 *   text: String,
 *   children: [Class]
 * }} obj
 * @param {[{
 *   id: Number,
 *   text: String,
 * }]} arr
 * @returns {Promise}
 */
doAction(name, obj, arr) {}
```

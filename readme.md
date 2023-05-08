# @oscarnewman/defer-if

`@oscarnewman/defer-if` is a utility package that extends the functionality of Remix's `defer` method, allowing you to conditionally defer the resolution of promises based on a predicate function or a boolean value. This package can be helpful in server-rendering scenarios where you might want to control the loading behavior of certain data.

## Installation

To install the package, run the following command:

```sh
npm install @oscarnewman/defer-if
```

## Usage

```javascript
import { deferIf } from "@oscarnewman/defer-if";

// Your data object containing promises and/or other values
const data = {
  value1: fetchSomething(),
  value2: "This is a static value",
  value3: fetchSomethingElse(),
};

// Using deferIf
const deferredData = await deferIf(
  data,
  () => someCondition, // Predicate function or boolean
  {
    alwaysAwait: ["value1"],
    neverAwait: ["value2"],
  }
);
```

## Documentation

`deferIf` accepts three arguments:

1. `data`: An object containing key-value pairs where values can be Promises or any other values.
2. `predicate`: A function that returns a boolean value or a boolean value itself. If the function returns true, the promise will be deferred (not awaited); otherwise, it will be awaited (blocking the response).
3. `options`: An optional configuration object containing:
   - `init`: A number or ResponseInit value.
   - `alwaysAwait`: An array of keys that should always be awaited, even if the predicate returns true.
   - `neverAwait`: An array of keys that should never be awaited, even if the predicate returns false.

## Contributing

1. Fork the repository on GitHub.
2. Clone the forked repository to your local machine.
3. Run `npm install` to install the dependencies.
4. Make your changes or add new features, and ensure that your code follows the existing style and conventions.
5. If you've added new functionality, update the README.md file with relevant information.
6. Run tests to ensure everything is working as expected.
7. Commit your changes and push them to your forked repository.
8. Create a pull request from your fork to the main repository with a clear and concise description of your changes.

## License

This package is released under the [MIT License](./LICENSE).

# Dependencies

A list of dependencies used in this project. The intent is to provide the process of using a specific dependency and ease the maintenance for the future.

## Live

## yaml

We have included the `yaml` library in our project to transform configuration files written in YAML format into JavaScript objects. This allows us to easily read and process YAML configuration files in applications. By using `yaml`, we can efficiently parse and serialize YAML data, making it easier to work with YAML configuration files in JavaScript applications.

## Development

### eslint & prettier & its plugins

Code quality and uniformity are important to us. The code base must be consistent in order to facilitate maintenance and keep the code uniform in accordance with community standards as well as our own rules.

### jest

All our projects related to JavaScript use `jest`, and we wanted to ensure that we kept things uniform across all projects. We love the syntax, the snapshot, and the mocking abilities of the entire package.

### typescript

This project needs to include a typescript package to ensure that this package can be used both with commonjs and esm. When building, this package is translated into typescript for that purpose.

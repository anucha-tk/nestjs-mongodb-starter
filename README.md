# Nestjs Starter Project

- [Nestjs Starter Project](#nestjs-starter-project)
  - [Features](#features)
- [How to start](#how-to-start)
  - [with mongo docker](#with-mongo-docker)
  - [seed user, api-key, role](#seed-user-api-key-role)
  - [run server](#run-server)
  - [try login](#try-login)
- [Testing](#testing)
  - [unit-test](#unit-test)
  - [e2e-test](#e2e-test)

> this complex Nestjs and more feature

## Features

- high complex project structure
- apy-key
- authenticate
- authorization
- debugger
- logger
- multi langues
- devtools environment eg. husky, commitlint, lint-staged and more
- docker
- seed
- swagger (doc)
- unit-test(33%)
- e2e-test(92%)
- and more

# How to start

- change .env

## with mongo docker

```bash
make start-mongo-dev
```

## seed user, api-key, role

**caution!!** on production change your user email and password before seed

```bash
yarn seed
```

## run server

```bash
yarn start
```

## try login

> http://localhost:5000/api/v1/public/user/login

```json
{
  "email": "admin@mail.com",
  "password": "aaAA@@123444"
}
```

# Testing

## unit-test

![My Image](docs/images/unit.png)

## e2e-test

![My Image](docs/images/e2e.png)

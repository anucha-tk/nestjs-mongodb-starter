# Nestjs Starter Project

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
- unit-test(33%) and e2e-test
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

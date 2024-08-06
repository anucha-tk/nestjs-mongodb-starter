# Nestjs Starter Project

A robust and feature-rich starter template for building scalable applications using NestJS. This project offers a comprehensive setup to kickstart your development with essential tools and configurations.

<!--toc:start-->

- [Nestjs Starter Project](#nestjs-starter-project)
  - [Features](#features)
  - [How to Start](#how-to-start)
    - [Seed user, api-key, role](#seed-user-api-key-role)
    - [Run server](#run-server)
    - [Try login](#try-login)
  - [Unit-test coverage](#unit-test-coverage)
  - [E2E-test coverage](#e2e-test-coverage)
  <!--toc:end-->

## Features

- **Complex Project Structure**: Organized and scalable architecture to manage large applications.
- **API Key Management**: Integrated system for handling API keys.
- **Authentication**: Built-in support for user authentication.
- **Authorization**: Comprehensive role-based access control.
- **Debugger**: Tools and configurations for effective debugging.
- **Logger**: Advanced logging for monitoring and troubleshooting.
- **Multi-Language Support**: Internationalization and localization features.
- **DevTools Environment**: Includes tools like Husky, Commitlint, Lint-staged, and more for a smooth development workflow.
- **Docker**: Containerization support for development and deployment.
- **Seed Data**: Predefined data for initializing the application.
- **Swagger Documentation**: Interactive API documentation using Swagger.
- **Unit Tests**: Approximately 33% test coverage for unit tests.
- **End-to-End Tests**: High coverage with 92% end-to-end tests.
- **And More**: Additional features and configurations for enhanced development.

## How to Start

1. **Configure Environment Variables**: Update the `.env.example` file with your environment-specific settings.

2. **Run MongoDB with Docker**:

```bash
   make start-mongo-dev
```

### Seed user, api-key, role

**caution!!** on production change your user email and password before seed

```bash
yarn seed
```

### Run server

```bash
yarn start
```

### Try login

> <http://localhost:5000/api/v1/public/user/login>

```json
{
  "email": "admin@mail.com",
  "password": "aaAA@@123444"
}
```

## Unit-test coverage

![My Image](docs/images/unit.png)

## E2E-test coverage

![My Image](docs/images/e2e.png)

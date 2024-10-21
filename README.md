
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Dockerizing the App

```bash
# development
$ docker-compose up

# Rebuild the container 
$ docker-compose up --build

# production mode
$ TARGET=production CMD="node dist/main.js" docker-compose up --build

# Stopping container
$ docker-compose down

```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Implementation 

Swagger Integration: The API uses Swagger for documentation and testing. All endpoints are accessible through the Swagger UI at /api-docs. This makes it easy to explore the API and test its functionality interactively.

DTOs (Data Transfer Objects): All requests and responses use DTOs for standardization. The DTOs leverage class-validator for validation and class-transformer for transformation of incoming and outgoing data. This ensures that every request is validated against the required structure before it reaches the service layer, and responses are cleanly formatted.

Role-based Access Control: Security is enforced using a custom RolesGuard. This guard checks the user-role metadata in the request headers to determine if the user has admin privileges. Admins are required for certain endpoints (like creating, updating, or deleting a product), while general users can access product information.

TypeORM and PostgreSQL: The API connects to a PostgreSQL database using TypeORM for seamless database operations. We define a Product entity that maps to the PRODUCT table in the database, ensuring that all product data, including product codes, locations, and prices, are stored and retrieved efficiently.

Database Configuration: The database configuration is encapsulated in a separate module, DatabaseModule, located within the lib folder to maintain a clean and neat folder structure. The module leverages @nestjs/config to load environment-specific configurations. The connection uses connection pooling for performance optimization and caching for frequently accessed data.

## Stay in touch

- Author - [Viknesh Krishnan](www.vikneshkrishnan.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

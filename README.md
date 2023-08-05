## Nestjs OAuth2 Server

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <img src="https://github.com/killmenot/nestjs-oauth2-server/blob/master/oauth2.png?raw=true" width="120" alt="OAuth2 Logo" />
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@killmenot/nestjs-oauth2-server" target='_blank'><img alt="npm" src="https://img.shields.io/npm/dm/@killmenot/nestjs-oauth2-server" alt="NPM Downloads"></a>
    <a href="https://coveralls.io/github/killmenot/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/killmenot/nestjs-oauth2-server"></a>
    <a href="https://npmjs.com/@killmenot/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="npm version" src="https://img.shields.io/npm/v/@killmenot/nestjs-oauth2-server?label=NPM&logo=NPM"></a>
    <a href="https://npmjs.com/@killmenot/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="LICENCE" src="https://img.shields.io/npm/l/@killmenot/nestjs-oauth2-server"></a>
    <a href="https://circleci.com/gh/killmenot/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="CircleCI build" src="https://img.shields.io/circleci/build/gh/killmenot/nestjs-oauth2-server/master"></a>
    <a href="https://www.npmjs.com/package/@killmenot/nestjs-oauth2-server" target="_blank" rel="noopener noreferrer"><img alt="synk vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/npm/@killmenot/nestjs-oauth2-server"></a>
</p>

<p>
A <a href="https://nestjs.com" target='_blank'>Nestjs</a> wrapper module for the <a href='https://oauth2-server.readthedocs.io/en/latest/index.html' target='_blank'>oauth2-server</a> package.
</p>

<p>This project is a fork of <a href="https://github.com/toondaey/nestjs-oauth2-server" target='_blank'>toondaey/nestjs-oauth2-server</a></p>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->

-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Learnings](#learnings)
-   [Contributing](#contributing)
    <!-- tocstop -->
    </details>

## Installation

Installation is as simple as running:

`npm install @killmenot/nestjs-oauth2-server`

or

`yarn add @killmenot/nestjs-oauth2-server`.

## Configuration

1. **oauth2-server** requires a [model](https://oauth2-server.readthedocs.io/en/latest/model/overview.html) to create the server. This can be provided as a service from any part of the application. This should be able to fetch data about clients, users, token, and authorization codes.

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuth2ModelService implements RequestAuthenticationModel {
    getAccessToken() {
        // ...
    }

    verifyScope() {
        // ...
    }

    // ...
}
```

2. Include the module as a dependency in the module where pdf will be generated:

`app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from '@killmenot/nestjs-oauth2-server';
import { OAuth2ModelService } from './oauth2-model.service';


@Module({
    imports: [
        // ... other modules
        OAuth2ServerModule.forRoot({
            model: OAuth2ModelService,
        }),
    ],
})
export class AppModule {}
```


## Usage

The module also provides some nifty decorators to help with configuring the oauth2 handler endpoints. An example controller covering the entire array of decorators is given below

```ts
import { Controller } from '@nestjs/common';
import {
    OAuth2Authenticate,
    OAuth2Authorize,
    OAuth2Authorization,
    OAuth2RenewToken,
    OAuth2Token,
} from '@killmenot/nestjs-oauth2-server';

@Controller()
export class ExampleController {
    @Post()
    @OAuth2Authenticate()
    authenticateClient(@OAuth2Token() token: Token) {
        return of(token);
    }

    @OAuth2Authorize()
    @Post()
    authorizeClient(
        @OAuth2Authorization()
        authorization: AuthorizationCode,
    ) {
        return of(authorization);
    }

    @Post()
    @OAuth2RenewToken()
    renewToken(@OAuth2Token() token: Token) {
        return of(token);
    }
}
```

## Async Configuration

The module could also be included asynchronously using the `forRootAsync` method.

Examples below:

-   Using factory provider approach

```ts
import { Module } from '@nestjs/common';
import {
    OAuth2ServerModule,
    IOAuth2ServerModuleOptions,
    OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
} from '@killmenot/nestjs-oauth2-server';
import { OAuth2ModelService } from './oauth2-model.service';

@Module({
    imports: [
        // ... other modules
        OAuth2ServerModule.forRootAsync({
            useFactory: (): IOAuth2ServerModuleOptions => ({}),
            extraProviders: [
                {
                    provide: OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                    useClass: OAuth2ModelService,
                },
            ],
        }),
    ],
})
export class AppModule {}
```

-   Using class or existing provider approach:

`./oauth2-server-config.service.ts`

```ts
import {
    IOAuth2ServerModuleOptions,
    IOAuth2ServerOptionsFactory,
} from '@killmenot/nestjs-oauth2-server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuth2ServerConfigService implements IOAuth2ServerOptionsFactory {
    createOAuth2ServerOptions(): IOAuth2ServerModuleOptions {
        return {};
    }
}
```

The `OAuth2ServerConfigService` **SHOULD** implement the `IOAuth2ServerOptionsFactory`, **MUST** declare the `createOAuth2ServerOptions` method and **MUST** return `IOAuth2ServerModuleOptions` object.

```ts
import { Module } from '@nestjs/common';
import { OAuth2ServerModule } from '@killmenot/nestjs-oauth2-server';
import { OAuth2ServerConfigService } from './oauth2-server-config.service.ts';
import { OAuth2ModelService } from './oauth2-model.service';

@Module({
    imports: [
        // ... other modules
        OAuth2ServerModule.forRootAsync({
            useClass: OAuth2ServerConfigService,
            extraProviders: [
                {
                    provide: OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                    useClass: OAuth2ModelService,
                },
            ],
        }),
    ],
})
export class AppModule {}
```

## Learnings

The concept of OAuth2 can be further understood in this article [here](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2). Also you can head over to the oauth2-server package [documentation](package)

## Contributing

Suggestions for improvement are welcomed, however, please adhere to the [contributing](./Contributing.md) guidelines

[package]: https://oauth2-server.readthedocs.io/en/latest/index.html

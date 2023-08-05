import { Type, Module, Global, Provider, DynamicModule } from '@nestjs/common';
import OAuth2Server, { ServerOptions } from 'oauth2-server';
import {
    OAuth2ServerTokenGuard,
    OAuth2ServerAuthorizationGuard,
    OAuth2ServerAuthenticationGuard,
} from './guards';
import {
    IOAuth2ServerModuleOptions,
    IOAuth2ServerOptionsFactory,
    IOAuth2ServerModuleAsyncOptions,
} from './interfaces';
import {
    OAUTH2_SERVER,
    OAUTH2_SERVER_OPTIONS_TOKEN,
    OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
} from './oauth2-server.constants';

@Global()
@Module({})
export class OAuth2ServerCoreModule {
    static forRoot(options: IOAuth2ServerModuleOptions): DynamicModule {
        const { model: modelProvider, ...otherOptions } = options;

        return {
            module: OAuth2ServerCoreModule,
            providers: [
                {
                    provide: OAUTH2_SERVER_OPTIONS_TOKEN,
                    useValue: otherOptions,
                },
                {
                    provide: OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                    useClass: modelProvider,
                },
                {
                    provide: OAUTH2_SERVER,
                    useFactory: (
                        options: IOAuth2ServerModuleOptions,
                        model: ServerOptions['model'],
                    ): OAuth2Server =>
                        new OAuth2Server(Object.assign({}, options, { model })),
                    inject: [
                        OAUTH2_SERVER_OPTIONS_TOKEN,
                        OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                    ],
                },
                OAuth2ServerTokenGuard,
                OAuth2ServerAuthorizationGuard,
                OAuth2ServerAuthenticationGuard,
            ],
            exports: [OAUTH2_SERVER],
        };
    }

    static forRootAsync(
        options: IOAuth2ServerModuleAsyncOptions,
    ): DynamicModule {
        return {
            module: OAuth2ServerCoreModule,
            providers: [
                ...(options.extraProviders || []),
                ...this.createAsyncProviders(options),
                {
                    provide: OAUTH2_SERVER,
                    useFactory: (
                        options: IOAuth2ServerModuleOptions,
                        model: ServerOptions['model'],
                    ): OAuth2Server =>
                        new OAuth2Server(Object.assign({}, options, { model })),
                    inject: [
                        OAUTH2_SERVER_OPTIONS_TOKEN,
                        OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                    ],
                },
                OAuth2ServerTokenGuard,
                OAuth2ServerAuthorizationGuard,
                OAuth2ServerAuthenticationGuard,
            ],
            imports: options.imports || [],
            exports: [OAUTH2_SERVER],
        };
    }

    private static createAsyncProviders(
        options: IOAuth2ServerModuleAsyncOptions,
    ): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProvider(options)];
        }

        const useClass = options.useClass as Type<IOAuth2ServerOptionsFactory>;

        return [this.createAsyncOptionsProvider(options), useClass];
    }

    private static createAsyncOptionsProvider(
        options: IOAuth2ServerModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: OAUTH2_SERVER_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass ||
                options.useExisting) as Type<IOAuth2ServerOptionsFactory>,
        ];

        return {
            provide: OAUTH2_SERVER_OPTIONS_TOKEN,
            useFactory: (factory: IOAuth2ServerOptionsFactory) =>
                factory.createOAuth2ServerOptions(),
            inject,
        };
    }
}

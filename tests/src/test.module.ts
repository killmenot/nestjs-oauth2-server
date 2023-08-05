import { Module, DynamicModule } from '@nestjs/common';

import { ExistingModule } from './existing.module';
import { IOAuth2ServerOptions } from '../../lib';
import { TestConfigService } from './test-config.service';
import { TestModelService } from './test-model.service';
import { OAUTH2_SERVER_MODEL_PROVIDER_TOKEN } from '../../lib/oauth2-server.constants';
import { OAuth2ServerModule } from '../../lib/oauth2-server.module';

@Module({})
export class TestModule {
    static withForRoot(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRoot({
                    model: TestModelService,
                }),
            ],
        };
    }

    static withUseFactoryForRootAsync(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRootAsync({
                    useFactory: (): IOAuth2ServerOptions => ({}),
                    extraProviders: [
                        {
                            provide: OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                            useClass: TestModelService,
                        },
                    ],
                }),
            ],
        };
    }

    static withUseClassForRootAsync(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRootAsync({
                    useClass: TestConfigService,
                    extraProviders: [
                        {
                            provide: OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                            useClass: TestModelService,
                        },
                    ],
                }),
            ],
        };
    }

    static withUseExistingForRootAsync(): DynamicModule {
        return {
            module: TestModule,
            imports: [
                OAuth2ServerModule.forRootAsync({
                    imports: [ExistingModule],
                    useExisting: TestConfigService,
                    extraProviders: [
                        {
                            provide: OAUTH2_SERVER_MODEL_PROVIDER_TOKEN,
                            useClass: TestModelService,
                        },
                    ],
                }),
            ],
        };
    }
}

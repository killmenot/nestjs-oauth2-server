import { Injectable } from '@nestjs/common';

import { IOAuth2ServerOptions, IOAuth2ServerOptionsFactory } from '../../lib';

@Injectable()
export class TestConfigService implements IOAuth2ServerOptionsFactory {
    createOAuth2ServerOptions(): IOAuth2ServerOptions {
        return {};
    }
}

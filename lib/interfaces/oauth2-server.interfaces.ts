import { Type } from '@nestjs/common';
import { ModuleMetadata, Provider } from '@nestjs/common/interfaces';
import { ServerOptions } from 'oauth2-server';

export type IOAuth2ServerOptions = Omit<ServerOptions, 'model'>;

export type IOAuth2ServerModuleOptions = IOAuth2ServerOptions & {
    model: Type<ServerOptions['model']>;
};

export interface IOAuth2ServerOptionsFactory {
    createOAuth2ServerOptions(): IOAuth2ServerOptions;
}

export interface IOAuth2ServerModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useClass?: Type<IOAuth2ServerOptionsFactory>;
    useExisting?: Type<IOAuth2ServerOptionsFactory>;
    useFactory?: (...args: any[]) => IOAuth2ServerOptions;
    inject?: any[];
    extraProviders?: Provider[];
}

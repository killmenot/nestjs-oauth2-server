import OAuth2Server from 'oauth2-server';
import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../src/test.module';
import { OAUTH2_SERVER } from '../../lib/oauth2-server.constants';

describe('ExampleModule', () => {
    let module: TestingModule;

    describe('forRoot()', () => {
        beforeEach(async () => {
            module = await Test.createTestingModule({
                imports: [TestModule.withForRoot()],
            }).compile();
        });

        it('should be defined', () => {
            expect(module.get<OAuth2Server>(OAUTH2_SERVER)).toBeDefined();
        });
    });

    describe('forRootAsync()', () => {
        describe('useFactory()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [TestModule.withUseFactoryForRootAsync()],
                }).compile();

                expect(module.get<OAuth2Server>(OAUTH2_SERVER)).toBeDefined();
            });
        });

        describe('useClass()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [TestModule.withUseClassForRootAsync()],
                }).compile();

                expect(module.get<OAuth2Server>(OAUTH2_SERVER)).toBeDefined();
            });
        });

        describe('useExisting()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [TestModule.withUseExistingForRootAsync()],
                }).compile();

                expect(module.get<OAuth2Server>(OAUTH2_SERVER)).toBeDefined();
            });
        });
    });
});

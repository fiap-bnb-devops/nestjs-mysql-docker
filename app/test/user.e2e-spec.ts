import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserModule } from "../src/user/user.module";
import * as request from 'supertest';

describe('UserController (e2e)', () => {

    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/user (GET)', () => {

        request(app.getHttpServer())
            .get('/user')
            .expect(200)
            .then((response) => {

                expect(response).toHaveProperty('text');

                const users = JSON.parse(response.text)

                expect(users).toHaveLength(6);

            });

    });

});
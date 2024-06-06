import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserModule } from "../src/user/user.module";
import * as request from 'supertest';
import { execSync } from "child_process";

describe('UserController (e2e)', () => {

    const databaseTestUrl = process.env.DATABASE_TEST_URL;
    let app: INestApplication;

    const name = 'Usuário Teste';
    const email = 'teste@gmail.com';
    const password = '123456789';

    beforeAll(() => {

        process.env = Object.assign(process.env, {
            DATABASE_URL: databaseTestUrl,
        });

        execSync('npm run prisma:reset', {
            env: {
                ...process.env,
                DATABASE_URL: databaseTestUrl,
            },
        });

    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('POST routes', () => {

        it('/user (POST)', () => {

            return request(app.getHttpServer())
                .post('/user')
                .send({
                    name,
                    email,
                    password,
                })
                .expect(201)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const data = JSON.parse(response.text);

                    expect(data).toHaveProperty('name', name);
                    expect(data).toHaveProperty('email', email);

                });

        });

        it('/user (POST) should verify existed user', () => {

            return request(app.getHttpServer())
                .post('/user')
                .send({
                    name,
                    email,
                    password,
                })
                .expect(400)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Usuário já cadastrado');

                })

        });

    });

    describe('GET routes', () => {

        it('/user (GET)', () => {

            return request(app.getHttpServer())
                .get('/user')
                .expect(200)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const users = JSON.parse(response.text);

                    expect(users).toHaveLength(1);

                });

        });

        it('/user/1 (GET)', () => {

            return request(app.getHttpServer())
                .get('/user/1')
                .expect(200)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const user = JSON.parse(response.text);

                    expect(user).toHaveProperty('name', name);
                    expect(user).toHaveProperty('email', email);

                });

        });

        it('/user/2 (GET)', () => {

            return request(app.getHttpServer())
                .get('/user/2')
                .expect(404)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Usuário inexistente');

                });

        });

        it('/user/abc (GET)', () => {

            return request(app.getHttpServer())
                .get('/user/abc')
                .expect(400)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Validation failed (numeric string is expected)');

                });

        });

    });

    describe('UPDATE routes', () => {

        const updateName = 'Usuário atualizado';

        it('/user/1 (PUT)', () => {

            return request(app.getHttpServer())
                .put('/user/1')
                .send({
                    name: updateName,
                    email,
                    password,
                })
                .expect(200)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const user = JSON.parse(response.text);

                    expect(user).toHaveProperty('name', updateName);

                });

        });

        it('/user/2 (PUT)', () => {

            return request(app.getHttpServer())
                .put('/user/2')
                .send({
                    name: updateName,
                    email,
                    password,
                })
                .expect(404)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Usuário inexistente');

                });

        });

        it('/user/abc (PUT)', () => {

            return request(app.getHttpServer())
                .put('/user/abc')
                .send({
                    name: updateName,
                    email,
                    password,
                })
                .expect(400)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Validation failed (numeric string is expected)');

                });

        });

    });

    describe('DELETE routes', () => {

        it('/user/1 (DELETE)', () => {

            return request(app.getHttpServer())
                .delete('/user/1')
                .expect(200)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const user = JSON.parse(response.text);

                    expect(user).toHaveProperty('id', 1);

                });

        });

        it('/user/1 (DELETE) should throw an exception', () => {

            return request(app.getHttpServer())
                .delete('/user/1')
                .expect(404)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Usuário inexistente');

                });

        });

        it('/user/abc (DELETE)', () => {

            return request(app.getHttpServer())
                .delete('/user/abc')
                .expect(400)
                .then((response) => {

                    expect(response).toHaveProperty('text');

                    const res = JSON.parse(response.text);

                    expect(res).toHaveProperty('message', 'Validation failed (numeric string is expected)');

                });

        });

    });

});
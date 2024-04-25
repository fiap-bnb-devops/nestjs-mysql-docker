import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";

describe('UserService', () => {

    let service: UserService;
    let fakePrismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: fakePrismaService,
                },
            ],
        }).compile();

        fakePrismaService = {
            users: {
                findMany: (() => {
                    return Promise.resolve([{
                        id: 1,
                        email: 'rafael@hcode.com.br',
                        name: 'Rafael Ribeiro',
                    }]);
                }),
                findUnique: (({
                    where,
                }) => {

                    // Pode retornar um valor null
                    if (where.id !== 1) {
                        return Promise.resolve(null);
                    }

                    return Promise.resolve({
                        id: where.id,
                        email: 'rafa@hcode.com.br',
                        name: 'Rafa',
                        password: '123456',
                    });

                }),
                findFirst: (({
                    where,
                }) => {

                    if (where.email === 'rafael@hcode.com.br') {

                        return Promise.resolve({
                            id: 2,
                            name: 'Rafael',
                            email: 'rafa@hcode.com.br',
                        });

                    }

                    return Promise.resolve(null);

                }),
                create: ((args) => {

                    return Promise.resolve({
                        id: 1,
                        ...args.data,
                    });

                }),
                update: (({
                    data,
                    where,
                }) => {

                    return Promise.resolve({
                        ...where,
                        ...data,
                    });

                }),
                delete: (({
                    where,
                }) => {

                    return Promise.resolve({
                        ...where,
                    });

                }),
            },
        } as unknown as PrismaService;

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll method', () => {

        it('should return a list of users', async () => {

            const users = await service.findAll();

            expect(users.length).toBe(1);

        });

    });

    describe('findOne method', () => {

        it('should return a single user based on id', async () => {

            const user = await service.findOne(1);

            expect(user.id).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.name).toBeDefined();
            expect(user.password).toBeDefined();

        });

        it('should throw an exception when user is not found', async () => {

            try {

                await service.findOne(5);

            } catch (err) {

                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status');
                expect(err.status).toEqual(404);

            }

        });

        it('should throw an exception when id is invalid', async () => {

            try {

                await service.findOne("abc" as unknown as number);

            } catch (err) {

                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status');
                expect(err.status).toEqual(400);

            }

        });

    });

    describe('create method', () => {

        it('should create a user with provided args', async () => {

            const user = await service.create({
                name: 'João',
                email: 'joao@hcode.com.br',
                password: '123456789',
            });

            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');

        });

        it('should throw an exception when user is already created', async () => {

            try {

                await service.create({
                    name: 'Rafa',
                    email: 'rafael@hcode.com.br',
                    password: '123456789',
                });

            } catch (err) {

                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status', 400);

            }

        });

        it('should throw an expection when name is not provided', async () => {

            try {

                await service.create({
                    name: '',
                    email: 'rafa@hcode.com.br',
                    password: '123456789',
                });

            } catch (err) {

                expect(err).toBeDefined();
                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status', 400);

            }

        });

        it('should throw an expection when email is not provided', async () => {

            try {

                await service.create({
                    name: 'Rafael',
                    email: '',
                    password: '123456789',
                });

            } catch (err) {

                expect(err).toBeDefined();
                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status', 400);

            }

        });

        it('should throw an expection when password is not provided', async () => {

            try {

                await service.create({
                    name: 'Rafael',
                    email: 'rafa@hcode.com.br',
                    password: '',
                });

            } catch (err) {

                expect(err).toBeDefined();
                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status', 400);

            }

        });

    });

    describe('update method', () => {

        it('should update an user', async () => {

            const id = 1;
            const name = 'Rafa Ribeiro';
            const email = 'rafa@hcode.com.br';

            const updatedUser = await service.update(id, {
                name,
                email,
            });

            expect(updatedUser).toHaveProperty('id', id);
            expect(updatedUser).toHaveProperty('name', name);
            expect(updatedUser).toHaveProperty('email', email);

        });

        it('should throw an exception when update an unexisted user', async () => {

            try {

                const id = 2;
                const name = 'Rafa Ribeiro';
                const email = 'rafa@hcode.com.br';

                await service.update(id, {
                    name,
                    email,
                });

            } catch (err) {

                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status', 404);

            }

        });

    });

    describe('delete method', () => {

        it('should delete a user', async () => {

            const id = 1;

            const result = await service.delete(id);

            expect(result).toHaveProperty('id', id);

        });

        it('should throw an exception when delete unexisted user', async () => {

            try {

                await service.delete(60);

            } catch (err) {

                expect(err).toHaveProperty('response');
                expect(err).toHaveProperty('status', 404);

            }

        });

    });

});
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

});
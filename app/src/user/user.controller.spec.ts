import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

function generateRandomNumber() {

    return Math.floor(Math.random() * 100);

}

describe('UserController', () => {

    let controller: UserController;
    let fakeUserService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                UserController,
            ],
            providers: [{
                provide: UserService,
                useValue: fakeUserService,
            }],
        }).compile();

        fakeUserService = {
            findAll: (() => {
                return Promise.resolve([{
                    id: 1,
                    name: 'Rafael',
                    email: 'rafa@hcode.com.br',
                }, {
                    id: 2,
                    name: 'João',
                    email: 'joao@hcode.com.br',
                }])
            }),
            findOne: ((userId: number) => {
                return Promise.resolve({
                    id: userId,
                });
            }),
            create: ((data: CreateUserDto) => {
                return Promise.resolve({
                    id: Math.floor(Math.random() * 100),
                    ...data,
                })
            }),
            update: ((id: number, data: UpdateUserDto) => {
                return Promise.resolve({
                    id,
                    ...data,
                });
            }),
            delete: ((id: number) => {
                return Promise.resolve({
                    id,
                });
            }),
        } as unknown as UserService;

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {

        expect(controller).toBeDefined();

    });

    describe('index method', () => {

        it('should return a list of users', async () => {

            const users = await controller.index();

            expect(users).toHaveLength(2);

        });

    });

    describe('show method', () => {

        it('should return a single user', async () => {

            const id = 1;

            const user = await controller.show(id);

            expect(user).toHaveProperty('id', id);

        });

    });

    describe('create method', () => {

        it('should create a user', async () => {

            const name = 'João';
            const email = 'joao@hcode.com.br';
            const password = '654321';

            const newUser = await controller.create({
                name,
                email,
                password,
            });

            expect(newUser).toHaveProperty('id');
            expect(newUser).toHaveProperty('name', name);
            expect(newUser).toHaveProperty('email', email);

        });

    });

    describe('update methods', () => {

        it('should update an user', async () => {

            const randomId = Math.floor(Math.random() * 100);
            const name = 'Rafa Ribeiro';
            const email = 'rafael@hcode.com.br';

            const updatedUser = await controller.update(randomId, {
                name,
                email,
            });

            expect(updatedUser).toHaveProperty('id', randomId);
            expect(updatedUser).toHaveProperty('name', name);
            expect(updatedUser).toHaveProperty('email', email);

        });

        it('should update an user partially', async () => {

            const randomId = Math.floor(Math.random() * 100);
            const email = 'rafael@hcode.com.br';

            const updatedUser = await controller.updatePartial(randomId, {
                email,
            });

            expect(updatedUser).toHaveProperty('id', randomId);
            expect(updatedUser).toHaveProperty('email', email);

        });

    });

    describe('delete method', () => {

        it('should delete an user', async () => {

            const randomNumber = generateRandomNumber();

            const deletedUser = await controller.delete(randomNumber);

            expect(deletedUser).toBeDefined();
            expect(deletedUser).toHaveProperty('id', randomNumber);

        });

    });

});
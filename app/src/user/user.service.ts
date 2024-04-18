/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {

        return this.prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

    }

    async findOne(id: number) {

        const user = await this.prisma.users.findUnique({
            where: {
                id,
            },
        });

        if (!user) {

            throw new NotFoundException('Usuário não encontrado');

        }

        return user;

    }

    async create(data) {

        if (!data.nameUser) {
            throw new BadRequestException('Informe o nome do usuário');
        }

        if (!data.emailUser) {
            throw new BadRequestException('Informe o email do usuário');
        }

        if (!data.passwordUser) {
            throw new BadRequestException('Informe a senha do usuário');
        }

        const user = await this.prisma.users.findFirst({
            where: {
                email: data.emailUser,
            },
        });

        if (user) {

            throw new BadRequestException('Usuário já cadastrado');

        }

        return this.prisma.users.create({
            data: {
                name: data.nameUser,
                email: data.emailUser,
                password: data.passwordUser,
            },
        });

    }

}

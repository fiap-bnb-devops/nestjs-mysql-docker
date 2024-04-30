/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

        if (isNaN(Number(id))) {
            throw new BadRequestException('Informe um número válido');
        }

        const user = await this.prisma.users.findUnique({
            where: {
                id,
            },
        });

        if (!user) {

            throw new NotFoundException('Usuário inexistente');

        }

        return user;

    }

    async create(data: CreateUserDto) {

        if (!data.name) {
            throw new BadRequestException('Informe o nome');
        }

        if (!data.email) {
            throw new BadRequestException('Informe o email');
        }

        if (!data.password) {
            throw new BadRequestException('Informe a senha');
        }

        const user = await this.prisma.users.findFirst({
            where: {
                email: data.email,
            },
        });

        if (user) {

            throw new BadRequestException('Usuário já cadastrado');

        }

        return this.prisma.users.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            },
        });

    }

    async update(id: number, data: UpdateUserDto) {

        await this.findOne(id);

        return this.prisma.users.update({
            data,
            where: {
                id,
            },
        });

    }

    async delete(id: number) {

        await this.findOne(id);

        return this.prisma.users.delete({
            where: {
                id,
            },
        });

    }

}

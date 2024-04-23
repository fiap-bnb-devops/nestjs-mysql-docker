import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: 'Informe o nome do usuário'
    })
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
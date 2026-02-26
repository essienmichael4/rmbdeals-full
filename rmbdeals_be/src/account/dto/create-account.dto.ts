import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    number: string
}

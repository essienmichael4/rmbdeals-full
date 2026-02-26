import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "../entities/user.entity"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty({
        description: "name",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        description: "email",
        example: "test@example.com",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @ApiProperty({
        description: "Password",
        example: "xxxxxxxxxxx",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(8)
    password?:string

    @ApiProperty({
        description: "Role",
        example: "USER",
        required: false
    })
    @IsEnum(Role)
    @IsOptional()
    role?:Role
}

export class FindUsersDto {
    @ApiProperty({
        description: "name",
        example: "John Doe",
        required: false
    })
    @IsString()
    @IsOptional()
    name?:string 

    @ApiProperty({
        description: "email",
        example: "test@example.com",
        required: false
    })
    @IsEmail()
    @IsOptional()
    email?:string
}

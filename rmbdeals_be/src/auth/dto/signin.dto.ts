// import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsEmail, IsString, MinLength } from "class-validator"

export class UserSignInDto{
    // @ApiProperty({
    //     description: "email",
    //     example: "test@example.com",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    // @ApiProperty({
    //     description: "Password",
    //     example: "xxxxxxxxxxx",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @MinLength(8)
    password?:string
}

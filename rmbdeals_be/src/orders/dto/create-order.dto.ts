import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateOrderDto {
    @IsString()
    account: string

    @IsNumber()
    amount: number

    @IsString()
    currency: string

    @IsString()
    recipient: string
}

export class CheckoutDto {
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    name: string

    @IsString()
    whatsapp: string

    @IsString()
    momoName: string

    @IsString()
    @IsOptional()
    notes: string

    @IsString()
    @IsOptional()
    password: string
}

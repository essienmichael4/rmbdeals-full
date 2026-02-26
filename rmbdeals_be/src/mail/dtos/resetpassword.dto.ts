import { IsDefined, IsEmail, IsOptional, IsString } from "class-validator";
import { Account } from "src/account/entities/account.entity";
import { Order } from "src/orders/entities/order.entity";

export class ResetPasswordEventDto {
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsDefined()
    @IsString()
    name:string

    @IsDefined()
    @IsString()
    link:string
}

export class OrderCreatedDto {
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsDefined()
    @IsString()
    name:string

    @IsOptional()
    @IsString()
    status:string

    order: Order

    account?: Account
}

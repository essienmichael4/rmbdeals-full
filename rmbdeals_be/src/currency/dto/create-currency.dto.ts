import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateCurrencyDto {
    @IsString()
    @IsOptional()
    label: string

    @IsString()
    @IsNotEmpty()  
    currency: string

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    rate: number
}

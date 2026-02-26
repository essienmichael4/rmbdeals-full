import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Show } from "../entities/marque.entity"

export class CreateAnnouncementDto {
    @IsString()
    @IsOptional()
    title?:string 

    @IsString()
    @IsNotEmpty()
    subject:string

    @IsNumber()
    updatedBy:number
}

export class MarqueDto {
    @IsString()
    @IsNotEmpty()
    announcement:string 

    // @ApiProperty({
    //     description: "Review status",
    //     example: Show.FALSE,
    //     required: false
    // })
    @IsEnum(Show)
    @IsOptional()
    isShown?:Show
}

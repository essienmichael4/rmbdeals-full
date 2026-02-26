import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PageOptionsDto {
    @Type(()=> Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1

    @Type(()=> Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    readonly take?: number = 50

    get skip(): number{
        return (this.page - 1) * this.take
    }
}

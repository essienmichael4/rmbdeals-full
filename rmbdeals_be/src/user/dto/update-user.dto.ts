import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEnum, IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    name:string 

    @IsOptional()
    @IsString()
    @IsEmail()
    email:string

    @IsString()
    @IsOptional()
    phone?:string

    @IsOptional()
    @IsEnum(Role)
    role?:Role 
}

export class UpdateUserPasswordRequest {
    @IsString()
    @IsNotEmpty()
    currentPassword:string 

    @IsString()
    @IsNotEmpty()
    newPassword:string

    @IsString()
    @IsNotEmpty()
    confirmPassword?:string
}

export class UpdateUserCurrencyRequest {
    @IsString()
    @IsNotEmpty()
    currency?:string
}

export class UpdateUserPhoneRequest {
    @IsString()
    @IsNotEmpty()
    phone?:string
}

export class UpdateUserRoleRequest {
    @IsEnum(Role)
    role?:Role 
}

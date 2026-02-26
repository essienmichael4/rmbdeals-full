import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPhoneRequest, UpdateUserRequest } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import { compare, hash } from 'bcryptjs';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { AdminSignUpDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    try{
      const userEntity = this.userRepo.create()
      const saveEntity = {
        ...userEntity,
        password: await this.hashPassword(createUserDto.password),
        name: createUserDto.name,
        searchName: createUserDto.name.toLowerCase(),
        email: createUserDto.email.toLowerCase(),
        ...(createUserDto.role && {role: createUserDto.role as Role})
      }

      const user = await this.userRepo.save(saveEntity)
      return user
    }catch(err){
      throw err
    }
  }

  async createAdmin(createUserDto: AdminSignUpDto):Promise<User> {
    try{
      const userEntity = this.userRepo.create()
      const saveEntity = {
        ...userEntity,
        password: await this.hashPassword(process.env.PASSWORD as string),
        name: createUserDto.name,
        searchName: createUserDto.name.toLowerCase(),
        email: createUserDto.email.toLowerCase(),
        ...(createUserDto.role ? {role: createUserDto.role as Role} : {role: Role.ADMIN})
      }

      const user = await this.userRepo.save(saveEntity)
      return user
    }catch(err){
      throw err
    }
  }

  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findUserById(id:number){
    return await this.userRepo.findOneBy({id})
  }

  async findAll(pageOptionsDto:PageOptionsDto) {
    const clients = await this.userRepo.findAndCount({
      order:{
        id: "DESC"
      },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip
    })
    
      const pageMetaDto = new PageMetaDto({itemCount: clients[1], pageOptionsDto})
      return new PageDto(clients[0], pageMetaDto)
  }

  async findAllClients() {
    return await this.userRepo.find({
      where: {
        role: Role.USER
      }
    })
  }

  exportClients(){
    return this.userRepo.find({
      where: {
        role: Role.USER
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })
  }

  async findAllAdmins() {
    return await this.userRepo.find({
      where: {
        role: Role.ADMIN
      }
    })
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({
      where: {
        id
      }
    })
  }

  async updateUser(id: number, fields:UpdateUserRequest) {
    const {phone, name, email, role} = fields
    await this.userRepo.update(id, {
      ...(name && { name: name }),
      ...(name && { searchName: name.toLowerCase() }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(role && { role }),
    })
  
    return await this.userRepo.findOneBy({id});
  }

  async updateUserPhone(id: number, updateUserPhoneRequest:UpdateUserPhoneRequest) {
    await this.userRepo.update(id, {
      ...(updateUserPhoneRequest && { phone: updateUserPhoneRequest.phone }),
    })
  
    return await this.userRepo.findOneBy({id});
  }

  async updateUserCurrency(currency: string, userId: number){
    return await this.userRepo.update(userId, {currency})
  }

  async updateUserPassword(currentPassword: string, newPassword: string, confirmPassword: string, userId: number){
    const user = await this.userRepo.findOne({
      where: {id: userId}
    })
    const isValidPassword = await compare(currentPassword, user.password)
    if(!isValidPassword) throw new UnauthorizedException("Current password does not match with the existing password.")

    if(newPassword !== confirmPassword){
        throw new UnauthorizedException("Passwords do not match")
    }

    return await this.userRepo.update(user.id, {
      password: await this.hashPassword(newPassword)
    })
  }

  async resetPassword(id: number, password:string) {
    try{
      return await this.userRepo.update(id, {
        password: await this.hashPassword(password)
      })
    }catch(err){
      throw err
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }
}

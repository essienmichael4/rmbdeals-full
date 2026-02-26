import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/announcement/entities/announcement.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo:Repository<Account>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private userService: UserService,
  ){}

  async create(createAccountDto: CreateAccountDto, userId: number) {
    const user = await this.userService.findUserById(userId)
    
    const account = this.accountRepo.create({
      updatedBy: user,
      number: createAccountDto.number,
      name: createAccountDto.name
    })

    return await this.accountRepo.save(account);
  }

  findAccount() {
     return this.accountRepo.findOne({where: {id: 1}});
  }

  async update(id: number, updateAccountDto: UpdateAccountDto, userId: number) {
    const user = await this.userService.findUserById(userId)

    this.accountRepo.update(id, {
      updatedBy: user,
      number: updateAccountDto.number,
      name: updateAccountDto.name
    })

  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}

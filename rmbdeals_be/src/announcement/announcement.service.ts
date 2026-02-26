import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto, MarqueDto } from './dto/create-announcement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement, Show } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Marque, } from './entities/marque.entity';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement) private readonly announcementRepo:Repository<Announcement>,
    @InjectRepository(Marque) private readonly marqueRepo:Repository<Marque>, 
    private userService: UserService,
  ){}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const user = await this.userService.findUserById(createAnnouncementDto.updatedBy)

    const announcement = this.announcementRepo.create({
      ...(createAnnouncementDto.title && { title: createAnnouncementDto.title }), 
      subject: createAnnouncementDto.subject,
      updatedBy:  user || undefined,
      show: Show.FALSE,
    });

    return await this.announcementRepo.save(announcement)
  }

  async createMarqueeAnnouncement(marqueDto: MarqueDto, updatedBy:number){
    const user = await this.userService.findUserById(updatedBy)
    const marqueEntity = this.marqueRepo.create()
    const saveEntity = {
      ...marqueEntity,
      announcement: marqueDto.announcement,
      ...(marqueDto.isShown && {isShown: marqueDto.isShown}),
      updatedBy:  user || undefined
    }

    return await this.marqueRepo.save(saveEntity)
  }

  findAnnouncement() {
    return this.announcementRepo.findOne({where: {id: 1}});
  }

  findAllMarqueeAnnouncement(){
      return this.marqueRepo.find()
  }

  findMarqueeAnnouncementForUser(){
      return this.marqueRepo.find({
          where: {
              isShown: Show.TRUE
          }
      })
  }

  async update(id: number, updatedBy:number, subject:string, title?:string)  {
    const user = await this.userService.findUserById(updatedBy)

    await this.announcementRepo.update(id, {
      ...(title && { title: title }), 
      subject,
      updatedBy:  user || undefined
    });

    return await this.announcementRepo.findOneBy({id:1})
  }

  async updateMarqueeAnnouncement(id:number, marqueDto: MarqueDto, updatedBy:number){
        const user = await this.userService.findUserById(updatedBy)
        return await this.marqueRepo.update(id, {
            announcement: marqueDto.announcement,
            updatedBy:  user || undefined
        })
    }

  async updateStatus(id: number, updatedBy:number, show:Show)  {
    const user = await this.userService.findUserById(updatedBy)

    await this.announcementRepo.update(id, {
      show,
      updatedBy:  user || undefined
    });

    return await this.announcementRepo.findOneBy({id:1})
  }

  async updateMarqueeStatus(id: number, updatedBy:number, show:Show)  {
        const user = await this.userService.findUserById(updatedBy)

        await this.marqueRepo.update(id, {
            isShown: show,
            updatedBy:  user || undefined
        });

        return await this.marqueRepo.findOneBy({id})
    }

  deleteMarqueeAnnouncement(id: number){
      return this.marqueRepo.delete(id);
  }
}

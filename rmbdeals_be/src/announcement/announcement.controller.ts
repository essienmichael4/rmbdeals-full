import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto, MarqueDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Show } from './entities/announcement.entity';

interface AnnouncementUpdateRequest{
  title?:string,
  subject:string
}

interface ShowUpdateRequest{
  show:Show
}

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @UseGuards(JwtGuard)
  @Post("marquee")
  createMarqueAnnouncement(@Body() body: MarqueDto, @User() user:UserInfo){
    return this.announcementService.createMarqueeAnnouncement(body, user.sub.id)
  }

  @Get()
  findAnnouncement() {
    return this.announcementService.findAnnouncement();
  }

  @Get("marquee")
  findMarqueeAnnouncement(){
    return this.announcementService.findMarqueeAnnouncementForUser()
  }

  @UseGuards(JwtGuard)
  @Get("marquee/all")
  findAllMarqueAnnouncement(){
    return this.announcementService.findAllMarqueeAnnouncement()
  }

  @UseGuards(JwtGuard)
  @Patch("marquee/:id")
  updateMarqueAnnouncement(@Param('id', ParseIntPipe) id: number, @Body() body: MarqueDto, @User() user:UserInfo){
    return this.announcementService.updateMarqueeAnnouncement(id, body, user.sub.id)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: AnnouncementUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.update(id, user.sub.id, body.subject, body.title);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/show')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: ShowUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.updateStatus(id, user.sub.id, body.show);
  }

  @UseGuards(JwtGuard)
  @Patch('marquee/:id/show')
  updateMarqueeStatus(@Param('id', ParseIntPipe) id: number, @Body() body: ShowUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.updateMarqueeStatus(id, user.sub.id, body.show);
  }

  @UseGuards(JwtGuard)
  @Delete('marquee/:id')
  deleteMarqueeAnnouncemet(@Param('id', ParseIntPipe) id: number) {
    return this.announcementService.deleteMarqueeAnnouncement(id);
  }
}

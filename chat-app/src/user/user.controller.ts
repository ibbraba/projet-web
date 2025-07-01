/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserProducerService } from './user.producer';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  logger: any;
  constructor(private readonly userProducer: UserProducerService) {}

  @Post()
  async create(@Body() user: UserDto) {
    this.logger.log('Reception requete create user', user);
    const response = await this.userProducer.send('create', user);
    this.logger.log('Reponse worker:', response);
    return { message: 'Utilisateur créé', data: response };
  }


  @Get()
  async findAll() {
    const response = await this.userProducer.send('findAll', {});
    return { message: 'Liste utilisateurs', data: response };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.userProducer.send('findOne', { id });
    return { message: `Utilisateur ${id}`, data: response };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() user: Partial<UserDto>) {
    const response = await this.userProducer.send('update', { id, ...user });
    return { message: `Utilisateur ${id} mis à jour`, data: response };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.userProducer.send('delete', { id });
    return { message: `Utilisateur ${id} supprimé`, data: response };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository, OrderBy } from './repositories/contact.repository';

type OrderByQuery = {
  orderBy?: OrderBy;
};

@Controller('contacts')
export class ContactsController {
  constructor(private contactRepository: ContactRepository) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactRepository.create(createContactDto);
  }

  @Get()
  findAll(@Query() query) {
    const { orderBy }: OrderByQuery = query;
    return this.contactRepository.findAll(orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactRepository.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactRepository.update(id, updateContactDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.contactRepository.remove(id);
  }
}

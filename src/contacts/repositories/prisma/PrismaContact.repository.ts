import { CreateContactDto } from 'src/contacts/dto/create-contact.dto';
import { UpdateContactDto } from 'src/contacts/dto/update-contact.dto';
import { ContactRepository } from '../contact.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Contact } from 'src/contacts/entities/contact.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class PrismaContactRepository implements ContactRepository {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    if (!createContactDto.name) {
      throw new BadRequestException({ error: 'name is required' });
    }

    if (createContactDto.email) {
      const contactExist = await this.prisma.contact.findFirst({
        where: {
          email: createContactDto.email,
        },
      });
      if (contactExist) {
        throw new BadRequestException({ error: 'email already in use' });
      }
    }

    if (createContactDto.category_id) {
      if (!isUUID(createContactDto.category_id)) {
        throw new BadRequestException({ error: 'invalid category' });
      }

      const category = await this.prisma.category.findFirst({
        where: {
          id: createContactDto.category_id,
        },
      });

      if (!category) {
        throw new NotFoundException({ error: 'Category not found!' });
      }
    }

    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  findAll(order: Prisma.SortOrder = 'asc'): Promise<Contact[]> {
    const orderBy = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    return this.prisma.contact.findMany({
      orderBy: {
        name: orderBy,
      },
    });
  }

  async findOne(id: string): Promise<Contact> {
    if (!isUUID(id)) {
      throw new BadRequestException({ error: 'Invalid contact id' });
    }

    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
      },
    });

    if (!contact) {
      throw new NotFoundException({ error: 'Contact not found' });
    }

    return contact;
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    if (!isUUID(id)) {
      throw new BadRequestException({ error: 'Invalid contact id' });
    }

    if (!updateContactDto.name) {
      throw new BadRequestException({ error: 'name is required' });
    }

    const contactExist = await this.prisma.contact.findFirst({
      where: {
        id,
      },
    });

    if (!contactExist) {
      throw new NotFoundException({ error: 'Contact not found!' });
    }

    updateContactDto.category_id =
      updateContactDto.category_id === '' ? null : updateContactDto.category_id;

    if (updateContactDto.category_id) {
      if (!isUUID(updateContactDto.category_id)) {
        throw new BadRequestException({ error: 'invalid category' });
      }

      const category = await this.prisma.category.findFirst({
        where: {
          id: updateContactDto.category_id,
        },
      });

      if (!category) {
        throw new NotFoundException({ error: 'Category not found!' });
      }
    }

    if (updateContactDto.email) {
      const contactByEmail = await this.prisma.contact.findFirst({
        where: {
          email: updateContactDto.email,
        },
      });

      if (contactByEmail && contactByEmail.id !== id) {
        throw new BadRequestException({ error: 'email already in use' });
      }
    }

    return await this.prisma.contact.update({
      where: {
        id,
      },
      data: updateContactDto,
    });
  }

  async remove(id: string) {
    const contactExist = await this.prisma.contact.findFirst({
      where: {
        id,
      },
    });

    if (!contactExist) {
      throw new NotFoundException({ error: 'Contact not found!' });
    }

    await this.prisma.contact.delete({
      where: {
        id,
      },
    });
  }
}

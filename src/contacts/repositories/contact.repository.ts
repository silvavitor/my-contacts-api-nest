import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';
import { Contact } from '../entities/contact.entity';

export type OrderBy = 'asc' | 'desc';

export abstract class ContactRepository {
  abstract create(createContactDto: CreateContactDto): Promise<Contact>;
  abstract findAll(order: OrderBy): Promise<Contact[]>;
  abstract findOne(id: string): Promise<Contact>;
  abstract update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact>;
  abstract remove(id: string): void;
}

import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactRepository } from './repositories/contact.repository';
import { PrismaContactRepository } from './repositories/prisma/PrismaContact.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ContactsController],
  providers: [
    PrismaService,
    {
      provide: ContactRepository,
      useClass: PrismaContactRepository,
    },
  ],
})
export class ContactsModule {}

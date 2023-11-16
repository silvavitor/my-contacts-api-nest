import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { PrismaCategoryRepository } from './repositories/prisma/PrismaCategory.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoriesModule {}

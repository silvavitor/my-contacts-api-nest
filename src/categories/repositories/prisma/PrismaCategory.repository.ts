import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import { CategoryRepository } from '../category.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Category } from 'src/categories/entities/category.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (!createCategoryDto.name) {
      throw new BadRequestException({ error: 'name is required' });
    }

    const categoryExists = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (categoryExists) {
      throw new BadRequestException({ error: 'name already been taken' });
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll(order: Prisma.SortOrder = 'asc'): Promise<Category[]> {
    const orderBy = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    return this.prisma.category.findMany({
      orderBy: {
        name: orderBy,
      },
    });
  }

  async findOne(id: string): Promise<Category> {
    if (!isUUID(id)) {
      throw new BadRequestException({ error: 'Invalid contact id' });
    }

    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException({ error: 'Category not found' });
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (!isUUID(id)) {
      throw new BadRequestException({ error: 'Invalid category id' });
    }

    if (!updateCategoryDto.name) {
      throw new BadRequestException({ error: 'name is required' });
    }

    const categoryExist = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!categoryExist) {
      throw new NotFoundException({ error: 'Category not found!' });
    }

    const categoryByName = await this.prisma.category.findFirst({
      where: {
        name: updateCategoryDto.name,
      },
    });

    if (categoryByName && categoryByName.id !== id) {
      throw new BadRequestException({ error: 'name already in use' });
    }

    return await this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException({ error: 'Category not found' });
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}

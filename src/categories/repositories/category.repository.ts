import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

export type OrderBy = 'asc' | 'desc';

export abstract class CategoryRepository {
  abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>;
  abstract findAll(order: OrderBy): Promise<Category[]>;
  abstract findOne(id: string): Promise<Category>;
  abstract update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category>;
  abstract remove(id: string): void;
}

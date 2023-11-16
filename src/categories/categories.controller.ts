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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryRepository,
  OrderBy,
} from './repositories/category.repository';

type OrderByQuery = {
  orderBy?: OrderBy;
};

@Controller('categories')
export class CategoriesController {
  constructor(private categoryRepository: CategoryRepository) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query) {
    const { orderBy }: OrderByQuery = query;
    return this.categoryRepository.findAll(orderBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryRepository.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoryRepository.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query,ParseIntPipe,DefaultValuePipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * יצירת מוצר חדש - מוגן למנהלים בלבד
   * כולל ולידציה קשיחה לקובץ התמונה (Security & Quality)
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // מקסימום 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(file, createProductDto);
  }

  /**
   * שליפת כל המוצרים עם Pagination (תיקון ביצועים דחוף)
   * שימוש ב-Pipes מוודא שהנתונים הם מספרים חיוביים (Type Safety)
   */
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    // התיקון הקריטי: העברת הפרמטרים לשירות
    return await this.productsService.findAll(page, limit);
  }

  /**
   * שליפת מוצרים מחוקים - מוגן למנהלים בלבד
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('deleted')
  async findDeleted(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return await this.productsService.findDeleted(page, limit);
  }

  /**
   * שחזור מוצר מחוק - מוגן למנהלים בלבד
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('restore/:id')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.restore(id);
  }

  /**
   * שליפת מוצר בודד לפי ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  /**
   * עדכון מוצר קיים - כולל אפשרות להחלפת תמונה
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
        fileIsRequired: false, // התמונה אופציונלית בעדכון
      }),
    ) file?: Express.Multer.File,
  ) {
    return await this.productsService.update(id, updateProductDto, file);
  }

  /**
   * מחיקת מוצר - מוגן למנהלים בלבד
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';

// הגדרת ממשק לתשובת דפדופ (עוזר לסדר בתיעוד ובקוד)
export interface PaginatedProducts {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(file: Express.Multer.File | undefined, createProductDto: CreateProductDto): Promise<any> {
    try {
      let imageUrl:  string | undefined = undefined;
      if (file) {
        const result = await this.cloudinaryService.uploadImage(file);
        imageUrl = result.secure_url;
    }
    const product = this.productRepository.create({
      ...createProductDto,
      image_url:imageUrl,
    });
    
    const savedProduct = await this.productRepository.save(product);
    return { ...savedProduct, id: savedProduct.product_id };
  }catch (error) {
    // הדפסת השגיאה לטרמינל כדי שתוכל לראות אם יש בעיה ב-DB או ב-Cloudinary
    console.error('Error creating product:', error);
    throw error;
  }
}

  async findAll(page: number = 1, limit: number = 20): Promise<PaginatedProducts> {
    // שימוש ב-findAndCount לביצועים אופטימליים
    const [products, total] = await this.productRepository.findAndCount({
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { product_id: 'ASC' },
    });

    // מיפוי השדות כדי להוסיף 'id' עבור הקליינט כפי שביקשת
    const mappedData = products.map(product => ({
      ...product,
      id: product.product_id,
    }));

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { product_id: id, isDeleted: false },
      relations: ['cartItems', 'orderItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { ...product, id: product.product_id };
  }

  async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<any> {
    const product = await this.findOne(id); // שימוש ב-findOne הקיים כדי לחסוך קוד

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      updateProductDto.image_url = result.secure_url;
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    return { ...updatedProduct, id: updatedProduct.product_id };
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    product.isDeleted = true;
    await this.productRepository.save(product);
  }

  async findDeleted(page: number = 1, limit: number = 20): Promise<PaginatedProducts> {
    const [products, total] = await this.productRepository.findAndCount({
      where: { isDeleted: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { product_id: 'ASC' },
    });

    const mappedData = products.map(product => ({
      ...product,
      id: product.product_id,
    }));

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async restore(id: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { product_id: id, isDeleted: true },
    });

    if (!product) {
      throw new NotFoundException(`Deleted product with ID ${id} not found`);
    }

    product.isDeleted = false;
    const restoredProduct = await this.productRepository.save(product);
    return { ...restoredProduct, id: restoredProduct.product_id };
  }
  async createBulk(productsDto: CreateProductDto[]) {
  const newProducts = this.productRepository.create(productsDto);
  return await this.productRepository.save(newProducts);
}
}
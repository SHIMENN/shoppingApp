import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';

// הגדרת ממשק לתשובת דפדופ עם הישות המקורית
export interface PaginatedProducts {
  data: Product[];
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

  async create(file: Express.Multer.File | undefined, createProductDto: CreateProductDto): Promise<Product> {
    try {
      let imageUrl: string | undefined = undefined;
      if (file) {
        const result = await this.cloudinaryService.uploadImage(file);
        imageUrl = result.secure_url;
      }
      
      const product = this.productRepository.create({
        ...createProductDto,
        image_url: imageUrl,
      });
      
      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 20): Promise<PaginatedProducts> {
    const [products, total] = await this.productRepository.findAndCount({
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      order: { product_id: 'ASC' },
    });

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: id, isDeleted: false },
      relations: ['cartItems', 'orderItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
    const product = await this.findOne(id);

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      updateProductDto.image_url = result.secure_url;
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
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

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async restore(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: id, isDeleted: true },
    });

    if (!product) {
      throw new NotFoundException(`Deleted product with ID ${id} not found`);
    }

    product.isDeleted = false;
    return await this.productRepository.save(product);
  }
}
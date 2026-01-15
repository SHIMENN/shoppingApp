import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryServise:  CloudinaryService,
  ) {}

  async create(file: Express.Multer.File,createProductDto: CreateProductDto): Promise<Product> {
    const result =await this.cloudinaryServise.uploadImage(file);
    return await this.productRepository.save({
      ...createProductDto,
    imageUrl: result.secure_url,
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['cartItems', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { productId: id },
      relations: ['cartItems', 'orderItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}

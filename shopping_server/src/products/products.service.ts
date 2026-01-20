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
      image_url: result.secure_url,
    });
  }

  async findAll(): Promise<any[]> {
    const products = await this.productRepository.find({
      relations: ['cartItems', 'orderItems'],
    });

    // Add 'id' field for client compatibility
    return products.map(product => ({
      ...product,
      id: product.product_id,
    }));
  }

  async findOne(id: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['cartItems', 'orderItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Add 'id' field for client compatibility
    return {
      ...product,
      id: product.product_id,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // אם הועלתה תמונה חדשה, נעלה אותה ל-Cloudinary
    if (file) {
      const result = await this.cloudinaryServise.uploadImage(file);
      updateProductDto.image_url = result.secure_url;
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    // Add 'id' field for client compatibility
    return {
      ...updatedProduct,
      id: updatedProduct.product_id,
    };
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}

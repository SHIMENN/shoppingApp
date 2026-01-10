import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.cartRepository.findOne({
      where: { cartId: createCartItemDto.cartId },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${createCartItemDto.cartId} not found`);
    }

    const product = await this.productRepository.findOne({
      where: { productId: createCartItemDto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${createCartItemDto.productId} not found`);
    }

    const cartItem = this.cartItemRepository.create({
      cart,
      product,
      quantity: createCartItemDto.quantity,
    });
    return await this.cartItemRepository.save(cartItem);
  }

  async findAll(): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      relations: ['cart', 'product'],
    });
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartItemId: id },
      relations: ['cart', 'product'],
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return cartItem;
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const cartItem = await this.findOne(id);
    Object.assign(cartItem, updateCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }

  async remove(id: number): Promise<void> {
    const cartItem = await this.findOne(id);
    await this.cartItemRepository.remove(cartItem);
  }
}

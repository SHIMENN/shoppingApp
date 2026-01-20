import { Injectable } from '@nestjs/common';
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
  ) {}

  async findItem(cartId: number, productId: number): Promise<CartItem | null> {
    return await this.cartItemRepository.findOne({
      where: { cartCartId: cartId, productId: productId },
    });
  }

  async createOrUpdate(cartId: number, productId: number, quantity: number): Promise<CartItem> {
    let item = await this.findItem(cartId, productId);

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartItemRepository.create({
        cartCartId: cartId,
        productId,
        quantity,
      });
    }
    return await this.cartItemRepository.save(item);
  }

  async removeItem(cartId: number, productId: number): Promise<void> {
    await this.cartItemRepository.delete({ cartCartId: cartId, productId });
  }
}

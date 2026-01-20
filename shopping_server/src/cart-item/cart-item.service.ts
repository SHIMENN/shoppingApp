import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findItem(cartId: number, productId: number): Promise<CartItem | null> {
    return this.cartItemRepository.findOne({
      where: { cart_cart_id: cartId, product_id: productId },
      relations: ['product'],
    });
  }

  async findItemById(cartItemId: number): Promise<CartItem> {
    const item = await this.cartItemRepository.findOne({
      where: { cart_item_id: cartItemId },
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException('פריט העגלה לא נמצא');
    }

    return item;
  }

  async createOrUpdate(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem> {
    let item = await this.findItem(cartId, productId);

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartItemRepository.create({
        cart_cart_id: cartId,
        product_id: productId,
        quantity,
      });
    }
    return this.cartItemRepository.save(item);
  }

  async updateQuantity(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem | null> {
    const item = await this.findItem(cartId, productId);

    if (!item) {
      throw new NotFoundException('פריט העגלה לא נמצא');
    }

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
      return null;
    }

    item.quantity = quantity;
    return this.cartItemRepository.save(item);
  }

  async removeItem(cartId: number, productId: number): Promise<void> {
    await this.cartItemRepository.delete({
      cart_cart_id: cartId,
      product_id: productId,
    });
  }

  async clearCart(cartId: number): Promise<void> {
    await this.cartItemRepository.delete({ cart_cart_id: cartId });
  }
}

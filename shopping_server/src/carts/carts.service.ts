import { Injectable, NotFoundException,BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';

@Injectable()
export class CartsService {
  constructor(@InjectRepository(Cart)private readonly cartRepository: Repository<Cart>,@InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  async create( userId: number): Promise<Cart> { 
  const newCart = await this.cartRepository.create({
    userUserId:userId,
  });
  return await this.cartRepository.save(newCart);
}

  async findUserCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userUserId: userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userUserId: userId, cartItems: [] });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getCartForOrder(userId: number): Promise<Cart> {
  const cart = await this.cartRepository.findOne({
    where: { userUserId: userId },
    relations: ['cartItems', 'cartItems.product'], // טוען את הפריטים ואת פרטי המוצר שלהם
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new BadRequestException('העגלה ריקה, לא ניתן לבצע הזמנה');
  }

  return cart;
}
  async addToCart(productId: number, quantity: number, userId: number): Promise<Cart> {
    const cart = await this.findUserCart(userId);

    let item: CartItem | null = await this.cartItemRepository.findOne({
      where: { 
        cartCartId: cart.cartId, 
        productId: productId 
      },
    });

    if (item) {
      item.quantity += quantity;
      await this.cartItemRepository.save(item);
    } else {
      const newItem = this.cartItemRepository.create({
        productId,
        quantity,
        cartCartId: cart.cartId,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.findUserCart(userId);
  }

  async updateQuantity(productId: number, quantity: number, userId: number): Promise<Cart> {
    const cart = await this.findUserCart(userId);
    
    const item: CartItem | null = await this.cartItemRepository.findOne({
      where: { cartCartId: cart.cartId, productId },
    });

    if (!item) throw new NotFoundException('Item not found in cart');

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
    } else {
      item.quantity = quantity;
      await this.cartItemRepository.save(item);
    }

    return this.findUserCart(userId);
  }

  async removeFromCart(productId: number, userId: number): Promise<Cart> {
    const cart = await this.findUserCart(userId);
    
    const item: CartItem | null = await this.cartItemRepository.findOne({
      where: { cartCartId: cart.cartId, productId },
    });

    if (item) {
      await this.cartItemRepository.remove(item);
    }

    return this.findUserCart(userId);
  }

  async clearCart(userId: number): Promise<Cart> {
    const cart = await this.findUserCart(userId);
    await this.cartItemRepository.delete({ cartCartId: cart.cartId });
    return this.findUserCart(userId);
  }
}
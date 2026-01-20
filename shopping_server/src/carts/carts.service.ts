import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { CartResponse } from 'src/common/interfaces/cart.interface';
import { CartItemWithProduct } from 'src/common/interfaces/cart.interface';


@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(userId: number): Promise<Cart> {
    const newCart = this.cartRepository.create({
      user_user_id: userId,
    });
    return this.cartRepository.save(newCart);
  }

  async findUserCart(userId: number): Promise<CartResponse> {
    let cart = await this.cartRepository.findOne({
      where: { user_user_id: userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      const newCart = this.cartRepository.create({
        user_user_id: userId,
      });
      cart = await this.cartRepository.save(newCart);
      cart.cartItems = [];
    }

    const cartItems: CartItemWithProduct[] =
      cart.cartItems?.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              id: item.product.product_id,
            }
          : null,
      })) || [];

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) =>
        sum + (item.product ? Number(item.product.price) * item.quantity : 0),
      0,
    );

    return {
      cart_id: cart.cart_id,
      created_at: cart.created_at,
      user_user_id: cart.user_user_id,
      cartItems,
      totalItems,
      totalPrice,
    };
  }

  async getCartForOrder(userId: number): Promise<CartResponse> {
    const cart = await this.findUserCart(userId);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('העגלה ריקה, לא ניתן לבצע הזמנה');
    }

    return cart;
  }

  async addToCart(
    productId: number,
    quantity: number,
    userId: number,
  ): Promise<CartResponse> {
    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    if (!quantity || quantity <= 0) {
      throw new BadRequestException('quantity must be greater than 0');
    }

    const cart = await this.findUserCart(userId);

    const item = await this.cartItemRepository.findOne({
      where: {
        cart_cart_id: cart.cart_id,
        product_id: productId,
      },
    });

    if (item) {
      item.quantity += quantity;
      await this.cartItemRepository.save(item);
    } else {
      const newItem = this.cartItemRepository.create({
        cart_cart_id: cart.cart_id,
        product_id: productId,
        quantity: quantity,
      });
      await this.cartItemRepository.save(newItem);
    }

    return this.findUserCart(userId);
  }

  async updateQuantity(
    productId: number,
    quantity: number,
    userId: number,
  ): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { user_user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('העגלה לא נמצאה');
    }

    const item = await this.cartItemRepository.findOne({
      where: { cart_cart_id: cart.cart_id, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException('המוצר לא נמצא בעגלה');
    }

    if (quantity <= 0) {
      await this.cartItemRepository.remove(item);
    } else {
      item.quantity = quantity;
      await this.cartItemRepository.save(item);
    }

    return this.findUserCart(userId);
  }

  async increaseQuantity(
    productId: number,
    userId: number,
  ): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { user_user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('העגלה לא נמצאה');
    }

    const item = await this.cartItemRepository.findOne({
      where: { cart_cart_id: cart.cart_id, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException('המוצר לא נמצא בעגלה');
    }

    item.quantity += 1;
    await this.cartItemRepository.save(item);

    return this.findUserCart(userId);
  }

  async decreaseQuantity(
    productId: number,
    userId: number,
  ): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { user_user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('העגלה לא נמצאה');
    }

    const item = await this.cartItemRepository.findOne({
      where: { cart_cart_id: cart.cart_id, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException('המוצר לא נמצא בעגלה');
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      await this.cartItemRepository.save(item);
    } else {
      await this.cartItemRepository.remove(item);
    }

    return this.findUserCart(userId);
  }

  async removeFromCart(
    productId: number,
    userId: number,
  ): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { user_user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('העגלה לא נמצאה');
    }

    const item = await this.cartItemRepository.findOne({
      where: { cart_cart_id: cart.cart_id, product_id: productId },
    });

    if (item) {
      await this.cartItemRepository.remove(item);
    }

    return this.findUserCart(userId);
  }

  async clearCart(userId: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { user_user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('העגלה לא נמצאה');
    }

    await this.cartItemRepository.delete({ cart_cart_id: cart.cart_id });
    return this.findUserCart(userId);
  }
}

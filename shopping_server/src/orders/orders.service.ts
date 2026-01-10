import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItemService } from '../order-item/order-item.service';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderItemService: OrderItemService,
    private readonly cartsService: CartsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['user', 'orderItems'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async createFromCart(userId: number): Promise<Order> {
    // קבל את העגלה של המשתמש עם הפריטים והמוצרים
    const carts = await this.cartsService.findAll();
    const userCart = carts.find(c => c.user && c.user.userId === userId);

    if (!userCart || !userCart.cartItems || userCart.cartItems.length === 0) {
      throw new NotFoundException('Cart is empty or not found');
    }

    // חשב את הסכום הכולל - קח את המחיר מהמוצר
    const totalAmount = userCart.cartItems.reduce((sum, item) => {
      if (!item.product) {
        throw new NotFoundException(`Product not found for cart item ${item.cartItemId}`);
      }
      return sum + (item.product.price * item.quantity);
    }, 0);

    // צור הזמנה חדשה
    const order = await this.create({
      userId,
      totalAmount,
      status: 'pending'
    });

    // צור פריטי הזמנה מהפריטים בעגלה
    for (const cartItem of userCart.cartItems) {
      if (!cartItem.product) {
        throw new NotFoundException(`Product not found for cart item ${cartItem.cartItemId}`);
      }

      await this.orderItemService.create({
        orderId: order.orderId,
        productId: cartItem.product.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price
      });
    }

    return order;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}

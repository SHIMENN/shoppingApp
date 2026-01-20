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

 async createOrder(userId: number) {
  // 1. קבלת כל נתוני העגלה והפריטים
  const cart = await this.cartsService.getCartForOrder(userId);

  // 2. חישוב סכום כולל להזמנה
  const totalPrice = cart.cartItems.reduce((sum, item) => {
    return sum + (item.quantity * item.product.price);
  }, 0);

  // 3. יצירת ההזמנה (כאן אתה שומר בטבלת Orders)
  const newOrder = this.orderRepository.create({
    userId,
    totalAmount: totalPrice,
    // מיפוי פריטי העגלה לפריטי הזמנה
    orderItems: cart.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.product.price // חשוב: שומרים את המחיר ברגע הקנייה
    }))
  });

  const savedOrder = await this.orderRepository.save(newOrder);

  // 4. חשוב מאוד: ריקון העגלה לאחר שההזמנה הצליחה
  await this.cartsService.clearCart(userId);

  return savedOrder;
}

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}

import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order} from './entities/order.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CartsService } from '../carts/carts.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderStatus } from './enums/order.enum';
import { PaginatedOrders, PaginationOptions } from './enums/orders.interface';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartsService: CartsService,
    private readonly dataSource: DataSource,
  ) {}

  async createOrderFromCart(
    userId: number,
    createOrderDto?: CreateOrderDto,
  ): Promise<Order> {
    const cart = await this.cartsService.getCartForOrder(userId);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('העגלה ריקה, לא ניתן לבצע הזמנה');
    }

    const totalAmount = cart.cartItems.reduce(
      (sum: number, item: any) =>
        sum + Number(item.product.price) * item.quantity,
      0,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = this.orderRepository.create({
        user_id: userId,
        total_amount: totalAmount,
        status: OrderStatus.PENDING,
        shipping_address: createOrderDto?.shipping_address,
        notes: createOrderDto?.notes,
      });

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = cart.cartItems.map((item: any) =>
        this.orderItemRepository.create({
          order_id: savedOrder.order_id,
          product_id: item.product.product_id,
          quantity: item.quantity,
          price: item.product.price,
        }),
      );

      await queryRunner.manager.save(orderItems);

      // הורדת מלאי מכל מוצר
      for (const item of cart.cartItems) {
        if (!item.product) continue;

        const product = await queryRunner.manager.findOne(Product, {
          where: { product_id: item.product.product_id },
        });

        if (!product) {
          throw new NotFoundException(`מוצר ${item.product.name} לא נמצא`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`אין מספיק מלאי עבור ${product.name}`);
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      await this.cartsService.clearCart(userId);
      await queryRunner.commitTransaction();

      const finalOrder = await this.orderRepository.findOne({
        where: { order_id: savedOrder.order_id },
        relations: ['items', 'items.product', 'user'],
      });

      if (!finalOrder) {
        throw new NotFoundException('שגיאה ביצירת ההזמנה');
      }

      return finalOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserOrders(
    userId: number,
    options: PaginationOptions,
  ): Promise<PaginatedOrders> {
    const skip = (options.page - 1) * options.limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user_id: userId },
      relations: ['items', 'items.product'],
      order: { order_date: 'DESC' },
      skip,
      take: options.limit,
    });

    return {
      orders,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async getOrderById(userId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId, user_id: userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('ההזמנה לא נמצאה');
    }

    return order;
  }

  async cancelOrder(userId: number, orderId: number): Promise<Order> {
    const order = await this.getOrderById(userId, orderId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('לא ניתן לבטל הזמנה שכבר עברה עיבוד');
    }

    // החזרת המלאי
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of order.items) {
        if (!item.product) continue;

        const product = await queryRunner.manager.findOne(Product, {
          where: { product_id: item.product_id },
        });

        if (product) {
          product.stock += item.quantity;
          await queryRunner.manager.save(product);
        }
      }

      order.status = OrderStatus.CANCELLED;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrder(userId: number, orderId: number): Promise<{ message: string }> {
    const order = await this.getOrderById(userId, orderId);

    if (order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('ניתן למחוק רק הזמנות שבוטלו או נמסרו');
    }

    await this.orderItemRepository.delete({ order_id: orderId });
    await this.orderRepository.delete({ order_id: orderId, user_id: userId });

    return { message: 'ההזמנה נמחקה בהצלחה' };
  }

  // Admin methods
  async getAllOrdersForAdmin(
    options?: PaginationOptions,
  ): Promise<PaginatedOrders | Order[]> {
    if (options) {
      const skip = (options.page - 1) * options.limit;

      const [orders, total] = await this.orderRepository.findAndCount({
        relations: ['items', 'items.product', 'user'],
        order: { order_date: 'DESC' },
        skip,
        take: options.limit,
      });

      return {
        orders,
        total,
        page: options.page,
        totalPages: Math.ceil(total / options.limit),
      };
    }

    return this.orderRepository.find({
      relations: ['items', 'items.product', 'user'],
      order: { order_date: 'DESC' },
    });
  }

  async getOrderByIdForAdmin(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('ההזמנה לא נמצאה');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: number,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('ההזמנה לא נמצאה');
    }

    order.status = updateStatusDto.status;
    return this.orderRepository.save(order);
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
  }> {
    const orders = await this.orderRepository.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0,
    );

    const ordersByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
    };
  }

  async deleteOrderAdmin(orderId: number): Promise<{ message: string }> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    if (!order) {
      throw new NotFoundException('ההזמנה לא נמצאה');
    }

    await this.orderItemRepository.delete({ order_id: orderId });
    await this.orderRepository.delete({ order_id: orderId });

    return { message: 'ההזמנה נמחקה בהצלחה' };
  }
}

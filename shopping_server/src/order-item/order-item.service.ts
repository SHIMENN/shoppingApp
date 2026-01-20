import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity } = createOrderItemDto;

    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });
    if (!order) {
      throw new NotFoundException('ההזמנה לא נמצאה');
    }

    const product = await this.productRepository.findOne({
      where: { product_id: productId },
    });
    if (!product) {
      throw new NotFoundException('המוצר לא נמצא');
    }

    const orderItem = this.orderItemRepository.create({
      order_id: orderId,
      product_id: productId,
      quantity,
      price: product.price,
    });

    const savedOrderItem = await this.orderItemRepository.save(orderItem);
    await this.updateOrderTotal(orderId);

    const result = await this.orderItemRepository.findOne({
      where: { order_item_id: savedOrderItem.order_item_id },
      relations: ['product', 'order'],
    });

    if (!result) {
      throw new NotFoundException('שגיאה ביצירת פריט ההזמנה');
    }

    return result;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      where: { order_id: orderId },
      relations: ['product'],
    });
  }

  async findOne(orderItemId: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { order_item_id: orderItemId },
      relations: ['product', 'order'],
    });

    if (!orderItem) {
      throw new NotFoundException('פריט ההזמנה לא נמצא');
    }

    return orderItem;
  }

  async update(
    orderItemId: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(orderItemId);

    if (updateOrderItemDto.quantity !== undefined) {
      if (updateOrderItemDto.quantity <= 0) {
        throw new BadRequestException('הכמות חייבת להיות גדולה מ-0');
      }
      orderItem.quantity = updateOrderItemDto.quantity;
    }

    await this.orderItemRepository.save(orderItem);
    await this.updateOrderTotal(orderItem.order_id);

    return this.findOne(orderItemId);
  }

  async remove(orderItemId: number): Promise<{ message: string }> {
    const orderItem = await this.findOne(orderItemId);
    const orderId = orderItem.order_id;

    await this.orderItemRepository.remove(orderItem);
    await this.updateOrderTotal(orderId);

    return { message: 'פריט ההזמנה נמחק בהצלחה' };
  }

  private async updateOrderTotal(orderId: number): Promise<void> {
    const orderItems = await this.orderItemRepository.find({
      where: { order_id: orderId },
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    await this.orderRepository.update(
      { order_id: orderId },
      { total_amount: totalAmount },
    );
  }
}

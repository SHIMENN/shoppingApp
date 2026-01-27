import {Controller,Get,Post, Put,Delete,Body,Param,UseGuards,ParseIntPipe,} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Controller('order-items')
@UseGuards(JwtAuthGuard)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get('order/:orderId')
  async getOrderItems(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderItemService.getOrderItems(orderId);
  }

  @Get(':orderItemId')
  async getOne(@Param('orderItemId', ParseIntPipe) orderItemId: number) {
    return this.orderItemService.findOne(orderItemId);
  }

  @Put(':orderItemId')
  @UseGuards(AdminGuard)
  async update(
    @Param('orderItemId', ParseIntPipe) orderItemId: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(orderItemId, updateOrderItemDto);
  }

  @Delete(':orderItemId')
  @UseGuards(AdminGuard)
  async remove(@Param('orderItemId', ParseIntPipe) orderItemId: number) {
    return this.orderItemService.remove(orderItemId);
  }
}

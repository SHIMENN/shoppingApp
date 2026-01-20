import {
  Controller,
  Post,
  Get,
  Patch,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import type { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(
    @Req() req: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId = req.user.id;
    return this.ordersService.createOrderFromCart(userId, createOrderDto);
  }

  @Get('my-orders')
  async getMyOrders(
    @Req() req: RequestWithUser,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const userId = req.user.id;
    return this.ordersService.getUserOrders(userId, {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
    });
  }

  @Get(':orderId')
  async getOrderById(
    @Req() req: RequestWithUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const userId = req.user.id;
    return this.ordersService.getOrderById(userId, orderId);
  }

  @Patch(':orderId/cancel')
  async cancelOrder(
    @Req() req: RequestWithUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const userId = req.user.id;
    return this.ordersService.cancelOrder(userId, orderId);
  }

  // Admin routes
  @Get('admin/all')
  @UseGuards(AdminGuard)
  async getAllOrders(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    if (page && limit) {
      return this.ordersService.getAllOrdersForAdmin({
        page: Math.max(1, page),
        limit: Math.min(100, Math.max(1, limit)),
      });
    }
    return this.ordersService.getAllOrdersForAdmin();
  }

  @Get('admin/stats')
  @UseGuards(AdminGuard)
  async getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get('admin/:orderId')
  @UseGuards(AdminGuard)
  async getOrderByIdForAdmin(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.ordersService.getOrderByIdForAdmin(orderId);
  }

  @Patch('admin/:orderId/status')
  @UseGuards(AdminGuard)
  async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateStatusDto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto, UpdateQuantityDto } from './dto/create-cart.dto';
import type { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async getMyCart(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.cartsService.findUserCart(userId);
  }

  @Post()
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.cartsService.addToCart(
      addToCartDto.productId,
      addToCartDto.quantity,
      userId,
    );
  }

  @Patch(':productId/quantity')
  async updateQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateQuantityDto: UpdateQuantityDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.cartsService.updateQuantity(
      productId,
      updateQuantityDto.quantity,
      userId,
    );
  }

  @Patch(':productId/increase')
  async increaseQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.cartsService.increaseQuantity(productId, userId);
  }

  @Patch(':productId/decrease')
  async decreaseQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.cartsService.decreaseQuantity(productId, userId);
  }

  @Delete(':productId')
  async removeFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.cartsService.removeFromCart(productId, userId);
  }

  @Delete()
  async clearCart(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.cartsService.clearCart(userId);
  }
}

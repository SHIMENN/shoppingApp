import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  async create(@Body() createCartItemDto: CreateCartItemDto) {
    return await this.cartItemService.create(createCartItemDto);
  }

  @Post('add-to-cart')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Request() req, @Body() body: { productId: number; quantity: number }) {
    // כאן צריך למצוא את העגלה של המשתמש ולהוסיף את הפריט
    // זה דורש שיפור נוסף של הלוגיקה
    return await this.cartItemService.create({
      cartId: req.user.cart.cartId, // זה צריך להיות מיושם
      productId: body.productId,
      quantity: body.quantity
    });
  }

  @Get()
  async findAll() {
    return await this.cartItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.cartItemService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartItemDto: UpdateCartItemDto) {
    return await this.cartItemService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.cartItemService.remove(+id);
  }
}

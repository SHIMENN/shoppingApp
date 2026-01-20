import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // וודא שהנתיב תואם לפרויקט שלך

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // 1. קבלת העגלה של המשתמש המחובר
  @Get()
  async getMyCart(@Req() req) {
    const userId = req.user.id;
    return this.cartsService.findUserCart(userId);
  }

  // 2. הוספת מוצר לעגלה (או עדכון כמות אם כבר קיים)
  @Post()
  async addToCart(
    @Body() body: { productid: number; quantity: number },
    @Req() req
  ) {
    const userId = req.user.id;
    // מבצע הוספה ומחזיר את העגלה המלאה מיד
    return this.cartsService.addToCart(body.productid, body.quantity, userId);
  }

  // 3. עדכון כמות של מוצר ספציפי
  @Patch(':productId')
  async updateQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity') quantity: number,
    @Req() req
  ) {
    const userId = req.user.id;
    return this.cartsService.updateQuantity(productId, quantity, userId);
  }

  // 4. מחיקת מוצר מהעגלה
  @Delete(':productId')
  async remove(
    @Param('productId', ParseIntPipe) productId: number, 
    @Req() req
  ) {
    const userId = req.user.id;
    return this.cartsService.removeFromCart(productId, userId);
  }

  // 5. ריקון כל העגלה
  @Delete()
  async clear(@Req() req) {
    const userId = req.user.id;
    return this.cartsService.clearCart(userId);
  }
}
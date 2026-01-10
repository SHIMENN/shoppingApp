import { Entity,PrimaryGeneratedColumn,Column,ManyToOne} from 'typeorm';
import { Cart } from 'src/carts/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('cart items')
export class CartItem {
    @PrimaryGeneratedColumn()
    cartItemId: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, cart => cart.cartItems)
    cart: Cart;

    @ManyToOne(() => Product, product => product.cartItems)
    product: Product;


}

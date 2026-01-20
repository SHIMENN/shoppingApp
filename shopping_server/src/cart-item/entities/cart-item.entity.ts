import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn} from 'typeorm';
import { Cart } from 'src/carts/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('cart items')
export class CartItem {
    @PrimaryGeneratedColumn()
    cartItemId: number;

    @Column()
    quantity: number;

    @Column()
    cartCartId: number;

    @Column()
    productId: number;

    @ManyToOne(() => Cart, cart => cart.cartItems)
    @JoinColumn({ name: 'cartCartId' }) // השם כאן חייב להתאים ל-Column למעלה
    cart: Cart;

    @ManyToOne(() => Product, product => product.cartItems)
    @JoinColumn({ name: 'productId' })
    product: Product;


}

import { Entity, PrimaryGeneratedColumn,Column,OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('carts')   
export class Cart {
    @PrimaryGeneratedColumn()
    cartId: number;

    @Column()
    createdAt: Date;

    @OneToOne(() => User, user => user.cart)
    user: User;
}


import { Entity, PrimaryGeneratedColumn,Column,ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
@Entity('carts')   
export class Cart {
    @PrimaryGeneratedColumn()
    cartId: number;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, user => user.carts)
    user: User;
}


import { Entity, PrimaryGeneratedColumn, Column,OneToMany,OneToOne, CreateDateColumn,} from 'typeorm';
import { IsEmail,Min } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import {Exclude} from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({unique:true})
    username: string;

    @Column({unique: true})
    @IsEmail()
    email: string;


    @Column()
    @Min(8)
    @Exclude()
    password: string;

    @CreateDateColumn(

        
    )
    createdAt: Date;

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}


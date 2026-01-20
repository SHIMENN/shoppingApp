import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import {Exclude} from 'class-transformer';
import { UserRole } from '../enums/roles.enum';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true, nullable: true })
    user_name: string;

    @Column({ unique: true})
    @IsEmail()
    email: string;


    @Column({ nullable: true })
    @MinLength(8)
    @Exclude()
    password: string;


    @CreateDateColumn()
    created_at: Date;

    @Column({default: 'user'})
    role: UserRole;

    @Column({nullable: true })
    first_name: string;

    @Column({  nullable: true })
    last_name: string;

    @Column({  nullable: true })
    google_id: string;

    @Column({ default: 'local' }) // 'local' למשתמש רגיל, 'google' למשתמש גוגל
    provider: string;

    @Column({  nullable: true })
    picture: string;

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}


import { Entity, PrimaryGeneratedColumn, Column,OneToMany} from 'typeorm';
import { IsEmail,Min } from 'class-validator';
import { Cart } from 'src/carts/entities/cart.entity';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    UserId: number;

    @Column()
    username: string;

    @Column({unique: true})
    @IsEmail()
    email: string;


    @Column()
    @Min(8)
    password: string;

    @Column()
    createdAt: Date;

    @OneToMany(() => Cart, cart => cart.user)
    carts: Cart[];
}


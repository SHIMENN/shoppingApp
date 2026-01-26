import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,OneToMany,CreateDateColumn,JoinColumn,} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { OrderStatus } from '../../orders/enums/order.enum';



@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @CreateDateColumn()
  order_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @Column({type: 'enum',enum: OrderStatus,default: OrderStatus.PENDING,})
  status: OrderStatus;

  @Column({ nullable: true })
  shipping_address: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'user_id', nullable: true })
  user_id: number;

  @ManyToOne(() => User, (user) => user.orders, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}

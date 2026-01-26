import { Order } from '../entities/order.entity';


export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

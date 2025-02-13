export interface Order {
  _id: string;
  products: string[];
  total: number;
  orderDate: string;
  __v?: number;
}

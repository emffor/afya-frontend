import { Category } from './Category';

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: Category;
  __v?: number;
}

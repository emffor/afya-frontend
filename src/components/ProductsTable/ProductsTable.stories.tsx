import type { Meta, StoryObj } from '@storybook/react';
import { ProductsTable } from './ProductsTable';

const meta = {
  title: 'Components/ProductsTable',
  component: ProductsTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: [
      {
        _id: '1',
        name: 'Product 1',
        price: 99.99,
        category: {
          _id: 'cat1',
          name: 'Category 1',
          description: 'Description 1'
        }
      },
      {
        _id: '2',
        name: 'Product 2',
        price: 149.99,
        category: {
          _id: 'cat2',
          name: 'Category 2',
          description: 'Description 2'
        }
      }
    ],
    onEdit: (product) => console.log('Edit product:', product),
    onDelete: (id) => console.log('Delete product:', id)
  },
};
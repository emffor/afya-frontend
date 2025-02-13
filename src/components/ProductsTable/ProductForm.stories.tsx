import type { Meta, StoryObj } from '@storybook/react';
import { ProductForm } from './ProductForm';

const meta = {
  title: 'Components/ProductForm',
  component: ProductForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Add Product',
    formData: {
      name: '',
      price: 0,
      categoryId: '',
    },
    categories: [
      { _id: 'cat1', name: 'Category 1', description: 'Description 1' },
      { _id: 'cat2', name: 'Category 2', description: 'Description 2' },
    ],
    onClose: () => console.log('Close form'),
    onSave: () => console.log('Save form'),
    onChange: (e) => console.log('Form changed:', e),
  },
};
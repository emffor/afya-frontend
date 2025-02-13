import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Category } from '../../types/Category';
interface ProductFormProps {
  open: boolean;
  title: string;
  formData: {
    name: string;
    price: number;
    categoryId: string;
  };
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>,
    child?: React.ReactNode
  ) => void;
}

export const ProductForm = ({
  open,
  title,
  formData,
  categories,
  onClose,
  onSave,
  onChange
}: ProductFormProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Name"
          fullWidth
          value={formData.name}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          name="price"
          label="Price"
          type="number"
          fullWidth
          value={formData.price}
          onChange={onChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            name="categoryId"
            value={formData.categoryId}
            label="Category"
            onChange={onChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
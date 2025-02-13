import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product } from '../types/Product';
import { Category } from '../types/Category';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    categoryId: '',
  });

  const navigate = useNavigate();

  const fetchProducts = () => {
    api.get<Product[]>('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  const fetchCategories = () => {
    api.get<Category[]>('/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormData({ name: '', price: 0, categoryId: '' });
    setCurrentProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      categoryId: product.category._id,
    });
    setCurrentProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent
  ) => {
    const { name, value } = e.target as { name?: string; value: unknown };
    setFormData({ ...formData, [name as string]: value as string });
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      category: formData.categoryId,
    };

    if (currentProduct) {
      api.put(`/products/${currentProduct._id}`, payload)
        .then(() => {
          fetchProducts();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error updating product:', error));
    } else {
      api.post('/products', payload)
        .then(() => {
          fetchProducts();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error creating product:', error));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteProductId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteProductId) {
      api.delete(`/products/${deleteProductId}`)
        .then(() => {
          fetchProducts();
          setDeleteModalOpen(false);
          setDeleteProductId(null);
        })
        .catch((error) => console.error('Error deleting product:', error));
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteProductId(null);
  };

  return (
    <Container>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        {'< Back'}
      </Button>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Button variant="contained" color="primary" onClick={openAddModal}>
        Add Product
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category ? product.category.name : 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => openEditModal(product)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(product._id)} sx={{ ml: 1 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{currentProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleFormChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              name="categoryId"
              value={formData.categoryId}
              label="Category"
              onChange={handleFormChange}
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
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsPage;

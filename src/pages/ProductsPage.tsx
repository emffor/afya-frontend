import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Product } from '../types/Product';
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
} from '@mui/material';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    categoryId: '',
  });

  const fetchProducts = () => {
    api.get<Product[]>('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchProducts();
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (currentProduct) {
      // Atualiza produto
      api.put(`/products/${currentProduct._id}`, formData)
        .then(() => {
          fetchProducts();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error updating product:', error));
    } else {
      // Cria novo produto
      api.post('/products', formData)
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
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Button variant="contained" color="primary" onClick={openAddModal}>
        Add Product
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '16px' }}>
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
                <TableCell>{product.category.name}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => openEditModal(product)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(product._id)}>
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
          <TextField
            margin="dense"
            name="categoryId"
            label="Category ID"
            fullWidth
            value={formData.categoryId}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Deleção */}
      <Dialog open={deleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsPage;

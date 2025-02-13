import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
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
} from '@mui/material';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const fetchCategories = () => {
    api.get<Category[]>('/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormData({ name: '', description: '' });
    setCurrentCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setFormData({ name: category.name, description: category.description });
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (currentCategory) {
      api.put(`/categories/${currentCategory._id}`, formData)
        .then(() => {
          fetchCategories();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error updating category:', error));
    } else {
      api.post('/categories', formData)
        .then(() => {
          fetchCategories();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error creating category:', error));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteCategoryId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      api.delete(`/categories/${deleteCategoryId}`)
        .then(() => {
          fetchCategories();
          setDeleteModalOpen(false);
          setDeleteCategoryId(null);
        })
        .catch((error) => console.error('Error deleting category:', error));
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteCategoryId(null);
  };

  return (
    <Container>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        {'< Back'}
      </Button>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Categories
      </Typography>
      <Button variant="contained" color="primary" onClick={openAddModal}>
        Add Category
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => openEditModal(category)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(category._id)} sx={{ ml: 1 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{currentCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleFormChange}
          />
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
          <Typography>Are you sure you want to delete this category?</Typography>
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

export default CategoriesPage;

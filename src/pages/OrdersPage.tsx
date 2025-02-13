import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Order } from '../types/Order';
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

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    total: 0,
    orderDate: '',
    products: '', 
  });

  const fetchOrders = () => {
    api.get<Order[]>('/orders')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openAddModal = () => {
    setFormData({ total: 0, orderDate: '', products: '' });
    setCurrentOrder(null);
    setModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setFormData({
      total: order.total,
      orderDate: order.orderDate.substring(0, 10), 
      products: order.products.join(', '),
    });
    setCurrentOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentOrder(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      products: formData.products.split(',').map((p) => p.trim()),
    };

    if (currentOrder) {
      api.put(`/orders/${currentOrder._id}`, payload)
        .then(() => {
          fetchOrders();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error updating order:', error));
    } else {
      api.post('/orders', payload)
        .then(() => {
          fetchOrders();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error creating order:', error));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteOrderId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteOrderId) {
      api.delete(`/orders/${deleteOrderId}`)
        .then(() => {
          fetchOrders();
          setDeleteModalOpen(false);
          setDeleteOrderId(null);
        })
        .catch((error) => console.error('Error deleting order:', error));
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteOrderId(null);
  };

  return (
    <Container>
      <Typography variant="h4">Orders</Typography>
      <Button variant="contained" color="primary" onClick={openAddModal}>
        Add Order
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => openEditModal(order)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(order._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{currentOrder ? 'Edit Order' : 'Add Order'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="total"
            label="Total"
            type="number"
            fullWidth
            value={formData.total}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="orderDate"
            label="Order Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.orderDate}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="products"
            label="Products (comma separated IDs)"
            fullWidth
            value={formData.products}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;

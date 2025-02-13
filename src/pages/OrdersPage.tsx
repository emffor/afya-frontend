import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Order } from '../types/Order';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';


function setDeleteProductId(arg0: null) {
  throw new Error('Function not implemented.');
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    total: 0,
    orderDate: '',
    products: [] as string[],
  });
  const navigate = useNavigate();

  const fetchOrders = () => {
    api.get<Order[]>('/orders')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));
  };

  const fetchProducts = () => {
    api.get<Product[]>('/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setFormData({ total: 0, orderDate: '', products: [] });
    setCurrentOrder(null);
    setModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setFormData({
      total: order.total,
      orderDate: order.orderDate.substring(0, 10),
      products: order.products.map((prod) =>
        typeof prod === 'object' && prod !== null && '_id' in prod ? (prod as Product)._id : prod
      ),
    });
    setCurrentOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentOrder(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleProductsChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      products: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSave = () => {
    if (currentOrder) {
      api.put(`/orders/${currentOrder._id}`, formData)
        .then(() => {
          fetchOrders();
          setModalOpen(false);
        })
        .catch((error) => console.error('Error updating order:', error));
    } else {
      api.post('/orders', formData)
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
          setDeleteProductId(null);
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
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        {'< Back'}
      </Button>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Orders
      </Typography>
      <Button variant="contained" color="primary" onClick={openAddModal}>
        Add Order
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                  <Button variant="contained" color="primary" onClick={() => openEditModal(order)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(order._id)} sx={{ ml: 1 }}>
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="products-select-label">Products</InputLabel>
            <Select
              labelId="products-select-label"
              name="products"
              multiple
              value={formData.products}
              onChange={handleProductsChange}
              input={<OutlinedInput label="Products" />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => {
                    const prod = products.find((p) => p._id === id);
                    return prod ? prod.name : id;
                  })
                  .join(', ')
              }
            >
              {products.map((prod) => (
                <MenuItem key={prod._id} value={prod._id}>
                  <Checkbox checked={formData.products.indexOf(prod._id) > -1} />
                  <ListItemText primary={prod.name} />
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
          <Typography>Are you sure you want to delete this order?</Typography>
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

export default OrdersPage;



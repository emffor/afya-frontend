import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Grid
} from '@mui/material';
import { DashboardMetrics } from '../types/DashboardMetrics';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { OrdersByPeriod } from '../types/OrdersByPeriod';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [ordersByPeriod, setOrdersByPeriod] = useState<OrdersByPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const navigate = useNavigate();

  useEffect(() => {
    api.get<DashboardMetrics>('/dashboard')
      .then((response) => setMetrics(response.data))
      .catch((error) => console.error('Error fetching dashboard metrics:', error));
  }, []);

  useEffect(() => {
    api.get<OrdersByPeriod[]>(`/dashboard/orders-by-period?period=${selectedPeriod}`)
      .then((response) => setOrdersByPeriod(response.data))
      .catch((error) => console.error('Error fetching orders by period:', error));
  }, [selectedPeriod]);

  const chartDataMetrics = {
    labels: ['Total Orders', 'Total Revenue', 'Avg Order Value'],
    datasets: [
      {
        label: 'Metrics',
        data: [metrics.totalOrders, metrics.totalRevenue, metrics.averageOrderValue],
        backgroundColor: [
          'rgba(75,192,192,0.6)', 
          'rgba(153,102,255,0.6)', 
          'rgba(255,159,64,0.6)',
        ],
      },
    ],
  };

  const chartDataOrders = {
    labels: ordersByPeriod.map((item) => item.period),
    datasets: [
      {
        label: 'Orders',
        data: ordersByPeriod.map((item) => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Dashboard</Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={() => navigate('/products')} sx={{ mr: 1 }}>
            Products
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/categories')} sx={{ mr: 1 }}>
            Categories
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/orders')}>
            Orders
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Card sx={{ minWidth: 275, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShoppingCartIcon fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Orders</Typography>
              </Box>
              <Typography variant="h4">{metrics.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card sx={{ minWidth: 275, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(metrics.totalRevenue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card sx={{ minWidth: 275, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MonetizationOnIcon fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Order Value</Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(metrics.averageOrderValue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mr: 2 }}>Orders by Period:</Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel id="period-select-label">Period</InputLabel>
          <Select
            labelId="period-select-label"
            value={selectedPeriod}
            label="Period"
            onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card sx={{ mb: 4, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Orders by Period</Typography>
          <Box sx={{ height: 400 }}>
            <Bar
              data={chartDataOrders}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed.y;
                        return `Orders: ${value}`;
                      },
                    },
                  },
                  legend: { position: 'top' },
                  title: { display: true, text: 'Orders by Period' },
                },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DashboardPage;
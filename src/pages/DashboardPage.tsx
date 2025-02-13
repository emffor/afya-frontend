import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get<DashboardMetrics>('/dashboard')
      .then((response) => setMetrics(response.data))
      .catch((error) => console.error('Error fetching dashboard metrics:', error));
  }, []);

  const chartData = {
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

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
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
        <Grid item xs={12} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShoppingCartIcon fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Orders</Typography>
              </Box>
              <Typography variant="h4">{metrics.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4">${metrics.totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MonetizationOnIcon fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Order Value</Typography>
              </Box>
              <Typography variant="h4">${metrics.averageOrderValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 4, height: 400 }}>
        <CardContent sx={{ height: '100%', p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Metrics Overview
          </Typography>
          <Box sx={{ height: 'calc(100% - 48px)' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.dataset.label || '';
                          const value = context.parsed.y;
                          return `${label}: ${value}`;
                        },
                      },
                    },
                    legend: { position: 'top' },
                    title: { display: true, text: 'Dashboard Metrics' },
                  },
                }}
                style={{ height: '100%', width: '100%' }}
              />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DashboardPage;

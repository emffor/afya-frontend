import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
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
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(153,102,255,0.6)', 'rgba(255,159,64,0.6)'],
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Box mb={2}>
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

      <Box mb={2}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Dashboard Metrics' },
            },
          }}
        />
      </Box>

      <Typography variant="h6">Total Orders: {metrics.totalOrders}</Typography>
      <Typography variant="h6">Total Revenue: ${metrics.totalRevenue}</Typography>
      <Typography variant="h6">Average Order Value: ${metrics.averageOrderValue}</Typography>
    </Container>
  );
};

export default DashboardPage;

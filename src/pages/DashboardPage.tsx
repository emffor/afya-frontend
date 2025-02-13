import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DashboardMetrics } from '../types/DashboardMetrics';
import { Container, Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    api.get<DashboardMetrics>('/dashboard')
      .then((response) => setMetrics(response.data))
      .catch((error) => console.error('Error fetching dashboard metrics:', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="h6">Total Orders: {metrics.totalOrders}</Typography>
      <Typography variant="h6">Total Revenue: ${metrics.totalRevenue}</Typography>
      <Typography variant="h6">Average Order Value: ${metrics.averageOrderValue}</Typography>
    </Container>
  );
};

export default DashboardPage;

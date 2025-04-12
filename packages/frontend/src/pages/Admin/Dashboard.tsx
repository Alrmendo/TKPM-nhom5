import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Stack,
  Divider,
  Avatar,
  useTheme,
  alpha,
  Grow,
  Fade,
  Button,
  IconButton,
  Tab,
  Tabs,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { 
  ShoppingBag, 
  People, 
  CalendarToday, 
  AttachMoney,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Refresh,
  Settings,
  Storefront,
  DateRange,
} from '@mui/icons-material';

// Mock data (replace with actual API calls)
const salesData = [
  { month: 'Jan', sales: 4000, profit: 2400, orders: 80 },
  { month: 'Feb', sales: 3000, profit: 1398, orders: 65 },
  { month: 'Mar', sales: 2000, profit: 9800, orders: 45 },
  { month: 'Apr', sales: 2780, profit: 3908, orders: 60 },
  { month: 'May', sales: 1890, profit: 4800, orders: 40 },
  { month: 'Jun', sales: 2390, profit: 3800, orders: 50 },
];

const topProducts = [
  { name: 'Classic White Dress', value: 35 },
  { name: 'Mermaid Style', value: 25 },
  { name: 'Princess Cut', value: 20 },
  { name: 'A-Line Dress', value: 15 },
  { name: 'Ball Gown', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  percentChange?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, percentChange, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: 2, 
      borderRadius: 4, 
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 8,
      }
    }}>
      <Box sx={{ 
        height: 8, 
        bgcolor: color 
      }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" fontWeight="medium" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {percentChange !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {percentChange >= 0 ? (
                  <ArrowUpward sx={{ color: 'success.main', fontSize: 14, mr: 0.5 }} />
                ) : (
                  <ArrowDownward sx={{ color: 'error.main', fontSize: 14, mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  fontWeight="medium"
                  color={percentChange >= 0 ? 'success.main' : 'error.main'}
                >
                  {percentChange >= 0 ? '+' : ''}{percentChange}% since last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.15),
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Fade in={!loading} timeout={800}>
        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4 
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>Wedding Dress Management</Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Here's what's happening with your business today.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<DateRange />}
                sx={{ borderRadius: 2 }}
              >
                Last 30 Days
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Refresh />}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Orders"
                value="258"
                subtitle="Orders this month"
                icon={<ShoppingBag />}
                color={theme.palette.primary.main}
                percentChange={12.5}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Customers"
                value="458"
                subtitle="Active clients"
                icon={<People />}
                color={theme.palette.error.main}
                percentChange={5.8}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Upcoming Appointments"
                value="28"
                subtitle="Next 7 days"
                icon={<CalendarToday />}
                color={theme.palette.warning.main}
                percentChange={-2.7}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Revenue"
                value="$23,532"
                subtitle="This month"
                icon={<AttachMoney />}
                color={theme.palette.success.main}
                percentChange={8.3}
              />
            </Grid>
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  mx: 2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                }
              }}
            >
              <Tab label="Overview" />
              <Tab label="Sales" />
              <Tab label="Products" />
              <Tab label="Customers" />
            </Tabs>
          </Box>

          <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} lg={8}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    boxShadow: 2, 
                    height: '100%',
                    borderRadius: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Monthly Sales & Profit
                    </Typography>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
                      <XAxis 
                        dataKey="month" 
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: alpha(theme.palette.text.secondary, 0.3) }}
                      />
                      <YAxis 
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: alpha(theme.palette.text.secondary, 0.3) }}
                        domain={[0, 'dataMax + 1000']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          boxShadow: theme.shadows[3],
                          border: 'none'
                        }}
                        formatter={(value) => [`${value}`, '']}
                      />
                      <Legend 
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        iconSize={10}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke={theme.palette.primary.main} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        name="Sales" 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stroke={theme.palette.success.main} 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorProfit)" 
                        name="Profit"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    boxShadow: 2, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Top Selling Products
                    </Typography>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '100%' 
                  }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 8, 
                            boxShadow: theme.shadows[3],
                            border: 'none' 
                          }}
                          formatter={(value, name) => [`${name}: ${value}%`, '']}
                        />
                        <Pie
                          data={topProducts}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          innerRadius={70}
                          paddingAngle={3}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ percent }) => 
                            percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ''}
                        >
                          {topProducts.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                              stroke={theme.palette.background.paper}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Stack spacing={2} mt={2}>
                    {topProducts.map((product, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              sx={{ 
                                width: 10, 
                                height: 10, 
                                borderRadius: '50%', 
                                bgcolor: COLORS[index % COLORS.length],
                                mr: 1.5,
                              }} 
                            />
                            <Typography variant="body2" fontWeight="medium">
                              {product.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="bold">
                            {product.value}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={product.value} 
                          sx={{ 
                            height: 5, 
                            borderRadius: 5,
                            bgcolor: alpha(COLORS[index % COLORS.length], 0.2),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: COLORS[index % COLORS.length]
                            }
                          }} 
                        />
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Paper sx={{ 
                  p: 3, 
                  boxShadow: 2, 
                  borderRadius: 4,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Recent Orders
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ fontWeight: 'medium' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Stack spacing={2.5}>
                    {[1, 2, 3, 4].map((order) => (
                      <Box key={order} sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        }
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.15), 
                                color: theme.palette.primary.main,
                                mr: 2, 
                              }}
                            >
                              <ShoppingBag fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                Order #{1000 + order}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Customer: Jane Doe
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="subtitle1" fontWeight="bold">
                              ${(Math.random() * 1000).toFixed(2)}
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <CheckCircle fontSize="small" color="success" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" fontWeight="medium" color="success.main">
                                Completed
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Paper sx={{ 
                  p: 3, 
                  boxShadow: 2,
                  borderRadius: 4,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Upcoming Appointments
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Stack spacing={2.5}>
                    {[1, 2, 3, 4].map((appointment) => (
                      <Box key={appointment} sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.warning.main, 0.08),
                        }
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(theme.palette.warning.main, 0.15), 
                                color: theme.palette.warning.main,
                                mr: 2,
                              }}
                            >
                              <CalendarToday fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                Wedding Dress Fitting
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Customer: Jane Smith
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {`${new Date().getMonth() + 1}/${new Date().getDate() + appointment}/${new Date().getFullYear()}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                              {`${10 + appointment}:00 AM`}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </AdminLayout>
  );
};

export default Dashboard; 
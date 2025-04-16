import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid as MuiGrid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  CheckCircle,
  CreditCard,
  LocalShipping
} from '@mui/icons-material';
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from '../../api/order';

// Mock data - replace with actual API calls
interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'under-review';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  isRental: boolean;
  rentalPeriod?: {
    startDate: string;
    endDate: string;
  };
}

// Define OrderItem type for clarity
interface OrderItem {
  dress: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
  rentalDays?: number;
}

// Order statuses for filter and display
const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'In Cart', color: 'warning' },
  { value: 'confirmed', label: 'Under Review', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'secondary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'returned', label: 'Returned', color: 'default' },
  { value: 'under-review', label: 'Under Review', color: 'info' },
];

// Payment statuses with more options
const PAYMENT_STATUSES = [
  { value: 'all', label: 'All Payments' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'processing', label: 'Processing', color: 'info' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'default' },
  { value: 'partially_refunded', label: 'Partially Refunded', color: 'secondary' },
];

// Custom Grid component to fix compatibility issues with MUI v5
const Grid = (props: any) => {
  return <MuiGrid {...props} />;
};

const Orders = () => {
  // States for managing orders and filtering
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Order detail dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  
  // Order status dialog
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  
  // Payment status dialog
  const [updatePaymentStatusDialogOpen, setUpdatePaymentStatusDialogOpen] = useState(false);
  const [newPaymentStatus, setNewPaymentStatus] = useState<Order['paymentStatus']>('pending');
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Real API call to fetch orders
      const ordersData = await getAllOrders();
      
      // Map backend response to our frontend interface
      const mappedOrders: Order[] = Array.isArray(ordersData) ? ordersData.map(order => {
        // Provide default values for potentially missing fields
        return {
          _id: order._id || '',
          orderNumber: order.orderNumber || `ORD-${order._id?.substring(0, 6) || '000000'}`,
          customer: {
            _id: order.userId?._id || (typeof order.userId === 'string' ? order.userId : ''),
            name: order.userId?.name || 'Unknown Customer',
            email: order.userId?.email || 'unknown@example.com'
          },
          items: Array.isArray(order.items) ? order.items.map((item: any) => ({
            dress: {
              _id: item.dressId || '',
              name: item.name || 'Unknown Dress'
            },
            quantity: item.quantity || 1,
            price: item.pricePerDay || 0,
            rentalDays: 3 // Default rental days if not specified
          })) : [],
          totalAmount: order.totalAmount || 0,
          status: (order.status || 'pending') as Order['status'],
          paymentStatus: (order.paymentStatus || 'pending') as Order['paymentStatus'],
          createdAt: order.createdAt || new Date().toISOString(),
          shippingAddress: order.shippingAddress || {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A',
            country: 'N/A'
          },
          trackingNumber: order.trackingNumber,
          isRental: true, // Default to rental for wedding dress shop
          rentalPeriod: order.startDate && order.endDate ? {
            startDate: new Date(order.startDate).toISOString(),
            endDate: new Date(order.endDate).toISOString()
          } : undefined
        };
      }) : [];
      
      console.log('Mapped orders:', mappedOrders);
      setOrders(mappedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders from server');
      setOrders([]); // Set empty array to avoid undefined errors
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch orders when component mounts
    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders when filters change
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm && result.length > 0) {
      result = result.filter((order) => {
        return (
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply status filter
    if (filterStatus !== 'all' && result.length > 0) {
      result = result.filter(order => order.status === filterStatus);
    }
    
    // Apply payment status filter
    if (filterPaymentStatus !== 'all' && result.length > 0) {
      result = result.filter(order => order.paymentStatus === filterPaymentStatus);
    }
    
    // Update filtered orders
    setFilteredOrders(result);
  }, [orders, searchTerm, filterStatus, filterPaymentStatus]);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleOpenUpdateStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setUpdateStatusDialogOpen(true);
  };

  const handleOpenUpdatePaymentStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.paymentStatus);
    setUpdatePaymentStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      setLoading(true);
      
      // Call the API to update the order status
      await updateOrderStatus(selectedOrder._id, newStatus);
      
      // Update the local state with the updated order
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrder._id ? { ...order, status: newStatus } : order
        )
      );
      
      // Set success message
      setSuccessMessage(`Order ${selectedOrder.orderNumber} status updated to ${newStatus}`);
      
      // Close the dialog
      setUpdateStatusDialogOpen(false);
      setLoading(false);
      
      // If needed, also update payment status to maintain consistency
      // For example, if an order is delivered, payment status should be paid
      if (newStatus === 'delivered' && selectedOrder.paymentStatus === 'pending') {
        try {
          await updatePaymentStatus(selectedOrder._id, 'paid');
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order._id === selectedOrder._id ? { ...order, paymentStatus: 'paid' } : order
            )
          );
        } catch (error) {
          console.error('Failed to update payment status:', error);
        }
      }
      
      // If cancelled, update payment status accordingly
      if (newStatus === 'cancelled' && selectedOrder.paymentStatus === 'paid') {
        try {
          await updatePaymentStatus(selectedOrder._id, 'refunded');
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order._id === selectedOrder._id ? { ...order, paymentStatus: 'refunded' } : order
            )
          );
        } catch (error) {
          console.error('Failed to update payment status:', error);
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status. Please try again.');
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      setLoading(true);
      
      // Call the API to update the payment status
      await updatePaymentStatus(selectedOrder._id, newPaymentStatus);
      
      // Update the local state with the updated payment status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrder._id ? { ...order, paymentStatus: newPaymentStatus } : order
        )
      );
      
      // Set success message
      setSuccessMessage(`Payment status for order ${selectedOrder.orderNumber} updated to ${newPaymentStatus}`);
      
      // Close the dialog
      setUpdatePaymentStatusDialogOpen(false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to update payment status:', error);
      setError('Failed to update payment status. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const paymentStatus = PAYMENT_STATUSES.find(s => s.value === status);
    return paymentStatus?.color || 'default';
  };

  const renderGridComponent = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        {/* Header and Statistics */}
        <Paper sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" fontWeight="bold">Order Management</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                View and manage all customer orders
              </Typography>
            </Grid>
            
            {/* Statistics Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {orders.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h3" color="warning.main" fontWeight="bold">
                    {orders.filter(o => o.status === 'pending').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Processing
                  </Typography>
                  <Typography variant="h3" color="info.main" fontWeight="bold">
                    {orders.filter(o => o.status === 'confirmed').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    ${orders
                        .filter(order => order.paymentStatus === 'paid' && order.status !== 'cancelled')
                        .reduce((sum, order) => sum + order.totalAmount, 0)
                        .toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
          
        {/* Search and Filters */}
        <Paper sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by order #, customer name, email, or tracking #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                }}
                size="small"
                sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {ORDER_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment</InputLabel>
                <Select
                  value={filterPaymentStatus}
                  label="Payment"
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value="all"
                  label="Type"
                  onChange={() => {}}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="rental">Rentals</MenuItem>
                  <MenuItem value="purchase">Purchases</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
            
        {/* Orders Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow 
                      key={order._id} 
                      hover
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}
                    >
                      <TableCell sx={{ fontWeight: 'medium' }}>{order.orderNumber}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.isRental ? "Rental" : "Purchase"}
                          size="small"
                          color={order.isRental ? "primary" : "default"}
                          sx={{ fontWeight: 'medium', minWidth: 80, justifyContent: 'center' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          size="small"
                          color={getStatusColor(order.status) as any}
                          sx={{ fontWeight: 'medium', minWidth: 80, justifyContent: 'center' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Chip 
                            label={PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.label || order.paymentStatus} 
                            color={(getPaymentStatusColor(order.paymentStatus) as any)} 
                            size="small"
                            sx={{ fontWeight: 'medium', minWidth: 80, justifyContent: 'center' }}
                          />
                          {order.status === 'delivered' && order.paymentStatus === 'paid' && (
                            <Chip 
                              label="Auto-confirmed" 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.65rem' }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <ButtonGroup size="small" aria-label="order actions">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewOrder(order)}
                            size="small"
                            title="View order details"
                            sx={{ borderRadius: '4px 0 0 4px' }}
                          >
                            <Visibility />
                          </IconButton>
                          {order.status === 'confirmed' ? (
                            <IconButton
                              color="success"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus('delivered');
                                setUpdateStatusDialogOpen(true);
                              }}
                              size="small"
                              title="Mark as delivered"
                              sx={{ borderRadius: '0' }}
                            >
                              <CheckCircle />
                            </IconButton>
                          ) : order.status === 'pending' ? (
                            <IconButton
                              color="info"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus('confirmed');
                                setUpdateStatusDialogOpen(true);
                              }}
                              size="small"
                              title="Confirm order"
                              sx={{ borderRadius: '0' }}
                            >
                              <CheckCircle />
                            </IconButton>
                          ) : (
                            <IconButton
                              color="secondary"
                              onClick={() => handleOpenUpdateStatusDialog(order)}
                              size="small"
                              title="Update order status"
                              sx={{ borderRadius: '0' }}
                            >
                              <LocalShipping />
                            </IconButton>
                          )}
                          {['confirmed', 'shipped', 'delivered', 'cancelled', 'returned'].includes(order.status) && (
                            <IconButton
                              color="warning"
                              onClick={() => handleOpenUpdatePaymentStatusDialog(order)}
                              size="small"
                              title="Update payment status"
                              sx={{ borderRadius: '0 4px 4px 0' }}
                            >
                              <CreditCard />
                            </IconButton>
                          )}
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                      <Typography variant="h6" color="text.secondary">No orders found</Typography>
                      <Typography variant="body2" color="text.secondary">Create a new order or change search criteria</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
            />
          </TableContainer>
        </Paper>
      </Box>
    );
  };

  const renderOrderDetailDialog = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog
        open={orderDetailOpen}
        onClose={() => setOrderDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Order #{selectedOrder.orderNumber}</Typography>
                <Chip 
                  label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)} 
                  color={getStatusColor(selectedOrder.status) as any} 
                  size="small"
                />
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Customer Information
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedOrder.customer.name}
                        </Typography>
                        <Typography variant="body2">
                          {selectedOrder.customer.email}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Order Date
                        </Typography>
                        <Typography>
                          {formatDate(selectedOrder.createdAt)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Payment Status
                        </Typography>
                        <Chip 
                          label={PAYMENT_STATUSES.find(s => s.value === selectedOrder.paymentStatus)?.label || selectedOrder.paymentStatus} 
                          color={getPaymentStatusColor(selectedOrder.paymentStatus) as any} 
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Shipping Address
                        </Typography>
                        <Typography>
                          {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                        </Typography>
                      </Box>
                      
                      {selectedOrder.trackingNumber && (
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Tracking Number
                          </Typography>
                          <Typography>{selectedOrder.trackingNumber}</Typography>
                        </Box>
                      )}
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Shipping Duration
                        </Typography>
                        <Typography>{selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? '3 days' : 'N/A'}</Typography>
                      </Box>
                      
                      {selectedOrder.isRental && selectedOrder.rentalPeriod && (
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Rental Period
                          </Typography>
                          <Typography>
                            {formatDate(selectedOrder.rentalPeriod.startDate)} - {formatDate(selectedOrder.rentalPeriod.endDate)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Rental Days</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item: OrderItem, index: number) => (
                            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">{item.dress?.name || 'Unnamed Product'}</Typography>
                                {item.rentalDays && (
                                  <Typography variant="caption" color="text.secondary">
                                    Rental: {item.rentalDays} days
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">{item.quantity || 1}</TableCell>
                              <TableCell align="right">${(item.price || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">{item.rentalDays || 'N/A'}</TableCell>
                              <TableCell align="right">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>${selectedOrder.totalAmount.toFixed(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Order Status Timeline
                    </Typography>
                    <Stepper sx={{ mt: 2 }}>
                      <Step>
                        <StepLabel>Pending</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Confirmed</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Shipped</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Delivered</StepLabel>
                      </Step>
                    </Stepper>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', px: 3, py: 2 }}>
              <Button onClick={() => setOrderDetailOpen(false)} variant="outlined">Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setOrderDetailOpen(false);
                  handleOpenUpdateStatusDialog(selectedOrder);
                }}
                startIcon={<Edit />}
              >
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  };

  return (
    <AdminLayout>
      {loading && orders.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        renderGridComponent()
      )}
      
      {renderOrderDetailDialog()}
      
      {/* Update Status Dialog */}
      <Dialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', pb: 1 }}>
          {newStatus === 'confirmed' ? 'Confirm Order' : 
           newStatus === 'delivered' ? 'Mark as Delivered' : 
           'Update Order Status'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            {newStatus === 'confirmed' ? 
              `Are you sure you want to confirm order ${selectedOrder?.orderNumber}?` :
             newStatus === 'delivered' ? 
              `Are you sure you want to mark order ${selectedOrder?.orderNumber} as delivered?` :
              `Update the status for order ${selectedOrder?.orderNumber}`
            }
          </DialogContentText>
          {!['confirmed', 'delivered'].includes(newStatus) && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value as Order['status'])}
              >
                {ORDER_STATUSES.filter(s => s.value !== 'all').map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', px: 3, py: 2 }}>
          <Button onClick={() => setUpdateStatusDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color={
              newStatus === 'confirmed' ? 'info' :
              newStatus === 'delivered' ? 'success' : 
              'primary'
            }
          >
            {newStatus === 'confirmed' ? 'Confirm Order' :
             newStatus === 'delivered' ? 'Mark as Delivered' :
             'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Update Payment Status Dialog */}
      <Dialog
        open={updatePaymentStatusDialogOpen}
        onClose={() => setUpdatePaymentStatusDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', pb: 1 }}>
          Update Payment Status
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Update the payment status for order {selectedOrder?.orderNumber}
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={newPaymentStatus}
              label="Payment Status"
              onChange={(e) => setNewPaymentStatus(e.target.value as Order['paymentStatus'])}
            >
              {PAYMENT_STATUSES.filter(s => s.value !== 'all').map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', px: 3, py: 2 }}>
          <Button onClick={() => setUpdatePaymentStatusDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleUpdatePaymentStatus} 
            variant="contained" 
            color="primary"
          >
            Update Payment Status
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default Orders; 
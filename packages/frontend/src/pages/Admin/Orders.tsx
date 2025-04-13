import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
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
  Chip,
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  LocalShipping,
  CheckCircle,
  CancelOutlined,
} from '@mui/icons-material';

// Mock data - replace with actual API calls
interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    dress: {
      _id: string;
      name: string;
    };
    quantity: number;
    price: number;
    rentalDays?: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'under-review';
  paymentStatus: 'pending' | 'paid' | 'refunded';
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

// Generate mock orders
const generateMockOrders = (count: number): Order[] => {
  const statuses: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
  const paymentStatuses: Order['paymentStatus'][] = ['pending', 'paid', 'refunded'];
  
  return Array.from({ length: count }, (_, index) => {
    const isRental = Math.random() > 0.5;
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: itemCount }, (_, itemIndex) => ({
      dress: {
        _id: `dress-${itemIndex}`,
        name: `Wedding Dress ${itemIndex + 1}`,
      },
      quantity: 1,
      price: Math.floor(Math.random() * 500) + 100,
      ...(isRental ? { rentalDays: Math.floor(Math.random() * 7) + 1 } : {}),
    }));
    
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const now = new Date();
    const orderDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    let rentalPeriod;
    if (isRental) {
      const startDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + (items[0].rentalDays || 3) * 24 * 60 * 60 * 1000);
      rentalPeriod = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    }
    
    return {
      _id: `order-${index + 1}`,
      orderNumber: `ORD-${String(10000 + index).slice(1)}`,
      customer: {
        _id: `cust-${index % 20}`,
        name: `Customer ${index % 20 + 1}`,
        email: `customer${index % 20 + 1}@example.com`,
      },
      items,
      totalAmount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      createdAt: orderDate.toISOString(),
      shippingAddress: {
        street: `${100 + index} Main St`,
        city: `City ${index % 10}`,
        state: `State ${index % 5}`,
        zipCode: `${10000 + index}`,
        country: 'United States',
      },
      trackingNumber: Math.random() > 0.3 ? `TRK${100000 + index}` : undefined,
      isRental,
      rentalPeriod,
    };
  });
};

const mockOrders = generateMockOrders(100);

// Order statuses for filter and display
const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'In Cart', color: 'warning' },
  { value: 'confirmed', label: 'Under Review', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'secondary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'returned', label: 'Returned', color: 'default' },
];

// Payment statuses for filter and display
const PAYMENT_STATUSES = [
  { value: 'all', label: 'All Payments' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'refunded', label: 'Refunded', color: 'error' },
];

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Order detail dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Update status dialog
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  
  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Real API call to fetch orders
        const response = await fetch('/api/orders/admin');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Map the API response data to match the expected structure
          const mappedOrders = (data.data || []).map(order => ({
            ...order,
            // Map userId field to customer field
            customer: {
              _id: order.userId?._id || order.userId || 'unknown',
              name: order.userId?.name || 'Unknown Customer',
              email: order.userId?.email || 'unknown@example.com'
            },
            // Ensure orderNumber exists
            orderNumber: order.orderNumber || order._id,
            // Ensure other required fields
            paymentStatus: order.paymentStatus || (order.paymentMethod ? 'paid' : 'pending'),
            isRental: true, // Assuming all are rentals in your system
            createdAt: order.createdAt || new Date().toISOString(),
            shippingAddress: order.shippingAddress || {
              street: 'No address provided',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            }
          }));
          
          setOrders(mappedOrders);
          setFilteredOrders(mappedOrders);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data in development/testing
        if (process.env.NODE_ENV !== 'production') {
          setOrders(mockOrders);
          setFilteredOrders(mockOrders);
        }
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // Filter orders when filters change
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(search) ||
        order.customer.name.toLowerCase().includes(search) ||
        order.customer.email.toLowerCase().includes(search) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(search))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== 'all') {
      result = result.filter(order => order.paymentStatus === paymentStatusFilter);
    }
    
    // Apply order type filter
    if (orderTypeFilter !== 'all') {
      result = result.filter(order => 
        orderTypeFilter === 'rental' ? order.isRental : !order.isRental
      );
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, paymentStatusFilter, orderTypeFilter]);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };
  
  const handleOpenUpdateStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setUpdateStatusDialogOpen(true);
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      setLoading(true);
      
      // In a real app, make API call to update order status
      // Replace this with actual API call
      const response = await fetch(`/api/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update order status');
      }
      
      // Update order status in state
      const updatedOrders = orders.map(order => {
        if (order._id === selectedOrder._id) {
          return { ...order, status: newStatus as Order['status'] };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setFilteredOrders(prev => 
        prev.map(order => 
          order._id === selectedOrder._id ? { ...order, status: newStatus as Order['status'] } : order
        )
      );
      
      setUpdateStatusDialogOpen(false);
      setLoading(false);
      
      // If detail dialog is open, update the selected order
      if (detailDialogOpen) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setLoading(false);
      // Handle error (could show an error toast here)
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
    const statusObj = PAYMENT_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };
  
  const getOrderStatusSteps = () => {
    return ['pending', 'confirmed', 'shipped', 'delivered'];
  };
  
  const getActiveStep = (status: string) => {
    const steps = getOrderStatusSteps();
    if (status === 'cancelled' || status === 'returned') return -1;
    return steps.indexOf(status);
  };
  
  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Order Management</Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all customer orders
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ flexGrow: 1, minWidth: '180px' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4">
              {orders.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flexGrow: 1, minWidth: '180px' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h4">
              {orders.filter(o => o.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flexGrow: 1, minWidth: '180px' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Processing
            </Typography>
            <Typography variant="h4">
              {orders.filter(o => o.status === 'processing').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flexGrow: 1, minWidth: '180px' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Revenue
            </Typography>
            <Typography variant="h4">
              ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      <Paper sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by order #, customer name, email, or tracking #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
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
                value={paymentStatusFilter}
                label="Payment"
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
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
                value={orderTypeFilter}
                label="Type"
                onChange={(e) => setOrderTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="rental">Rentals</MenuItem>
                <MenuItem value="purchase">Purchases</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.isRental ? "Rental" : "Purchase"}
                      size="small"
                      color={order.isRental ? "primary" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      size="small"
                      color={getStatusColor(order.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      size="small"
                      color={getPaymentStatusColor(order.paymentStatus) as any}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewOrder(order)}
                      size="small"
                      title="View order details"
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
                        title="Process order"
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
                      >
                        <CheckCircle />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenUpdateStatusDialog(order)}
                        size="small"
                        title="Edit order status"
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No orders found
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
        />
      </TableContainer>
      
      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details: {selectedOrder.orderNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Box mb={3}>
                <Stepper activeStep={getActiveStep(selectedOrder.status)}>
                  {getOrderStatusSteps().map((label) => (
                    <Step key={label}>
                      <StepLabel>{label.charAt(0).toUpperCase() + label.slice(1)}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {selectedOrder.status === 'cancelled' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'error.main' }}>
                    <CancelOutlined sx={{ mr: 1 }} />
                    <Typography color="error">This order has been cancelled</Typography>
                  </Box>
                )}
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                      Order Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Order Date:
                        </Typography>
                        <Typography>{formatDate(selectedOrder.createdAt)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Order Type:
                        </Typography>
                        <Typography>{selectedOrder.isRental ? 'Rental' : 'Purchase'}</Typography>
                      </Box>
                      {selectedOrder.isRental && selectedOrder.rentalPeriod && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Rental Start:
                            </Typography>
                            <Typography>{formatDate(selectedOrder.rentalPeriod.startDate)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Rental End:
                            </Typography>
                            <Typography>{formatDate(selectedOrder.rentalPeriod.endDate)}</Typography>
                          </Box>
                        </>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                        <Chip
                          label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          size="small"
                          color={getStatusColor(selectedOrder.status) as any}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status:
                        </Typography>
                        <Chip
                          label={selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                          size="small"
                          color={getPaymentStatusColor(selectedOrder.paymentStatus) as any}
                        />
                      </Box>
                      {selectedOrder.trackingNumber && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Tracking Number:
                          </Typography>
                          <Typography>{selectedOrder.trackingNumber}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                  
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Name:
                        </Typography>
                        <Typography>{selectedOrder.customer.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email:
                        </Typography>
                        <Typography>{selectedOrder.customer.email}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography>
                      {selectedOrder.shippingAddress.street}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                      {selectedOrder.shippingAddress.country}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.name || (item.dress && item.dress.name) || 'Unnamed Product'}
                                {item.rentalDays && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    Rental: {item.rentalDays} days
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">{item.quantity || 1}</TableCell>
                              <TableCell align="right">${(item.price || item.pricePerDay || 0).toFixed(2)}</TableCell>
                              <TableCell align="right">${((item.price || item.pricePerDay || 0) * (item.quantity || 1)).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                              Total:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              ${selectedOrder.totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setDetailDialogOpen(false);
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
      
      {/* Update Status Dialog */}
      <Dialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
      >
        <DialogTitle>
          {newStatus === 'confirmed' ? 'Confirm Order' : 
           newStatus === 'delivered' ? 'Mark as Delivered' : 
           'Update Order Status'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {newStatus === 'confirmed' ? 
              `Are you sure you want to confirm order ${selectedOrder?.orderNumber}?` :
             newStatus === 'delivered' ? 
              `Are you sure you want to mark order ${selectedOrder?.orderNumber} as delivered?` :
              `Update the status for order ${selectedOrder?.orderNumber}`
            }
          </DialogContentText>
          {!['confirmed', 'delivered'].includes(newStatus) && (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
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
        <DialogActions>
          <Button onClick={() => setUpdateStatusDialogOpen(false)}>Cancel</Button>
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
    </AdminLayout>
  );
};

export default Orders; 
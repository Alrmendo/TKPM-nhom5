import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Grid,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  Delete,
  Edit,
  Mail,
  Phone,
  LocationOn,
  Person,
  MoreVert,
  AccountCircle,
} from '@mui/icons-material';

// Mock data - replace with actual API calls
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  lastLogin: string;
  totalOrders: number;
  status: 'active' | 'inactive' | 'blocked';
  avatar?: string;
}

const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, index) => ({
  _id: `cust-${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `+1 555-${String(index).padStart(3, '0')}-${String(index + 1000).slice(1)}`,
  address: `${index + 100} Main St, City ${index % 10}, State ${index % 5}`,
  createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
  lastLogin: new Date(Date.now() - index * 12 * 60 * 60 * 1000).toISOString(),
  totalOrders: Math.floor(Math.random() * 20),
  status: (['active', 'inactive', 'blocked'] as const)[Math.floor(Math.random() * 3)],
}));

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialogs
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // In a real app, replace this with an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCustomers(mockCustomers);
        setFilteredCustomers(mockCustomers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let results = customers;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(customer => customer.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        customer =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      );
    }
    
    setFilteredCustomers(results);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, customers]);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };
  
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailDialogOpen(true);
  };
  
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };
  
  const handleDeleteConfirm = (customerId: string) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      setLoading(true);
      // In a real app, replace with actual delete API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the customer from the list
      setCustomers(prev => prev.filter(c => c._id !== customerToDelete));
      
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting customer:', error);
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (loading && customers.length === 0) {
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
        <Typography variant="h4" fontWeight="bold">Customer Management</Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your customer database
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ flexGrow: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Customers
            </Typography>
            <Typography variant="h4">
              {customers.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flexGrow: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Active Customers
            </Typography>
            <Typography variant="h4">
              {customers.filter(c => c.status === 'active').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flexGrow: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              New this Month
            </Typography>
            <Typography variant="h4">
              {customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      <Paper sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        {customer.name.charAt(0)}
                      </Avatar>
                      {customer.name}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{formatDate(customer.createdAt)}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)} 
                      color={getStatusColor(customer.status) as "success" | "warning" | "error" | "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleViewCustomer(customer)}
                      size="small"
                    >
                      <Person />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteConfirm(customer._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      {/* Customer Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedCustomer && (
          <>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                  {selectedCustomer.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{selectedCustomer.name}</Typography>
                <Chip 
                  label={selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)} 
                  color={getStatusColor(selectedCustomer.status) as "success" | "warning" | "error" | "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Mail sx={{ color: 'text.secondary', mr: 2 }} />
                  <Typography>{selectedCustomer.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ color: 'text.secondary', mr: 2 }} />
                  <Typography>{selectedCustomer.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOn sx={{ color: 'text.secondary', mr: 2, mt: 0.5 }} />
                  <Typography>{selectedCustomer.address}</Typography>
                </Box>
                
                <Divider />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Registered
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedCustomer.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedCustomer.lastLogin)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.totalOrders}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailDialog}>Close</Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Edit />}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

const Divider = () => <Box sx={{ borderBottom: '1px solid #e0e0e0', my: 1 }} />;

export default Customers; 
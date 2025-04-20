import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import { 
  CameraAlt, 
  CheckCircle, 
  Cancel, 
  Schedule, 
  Done
} from '@mui/icons-material';
import { Bar, Pie } from 'react-chartjs-2';
import { getPhotographyBookingStatistics, PhotographyBookingStatistics } from '../../api/admin';
import AdminLayout from './AdminLayout';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Status color mapping
const statusColors = {
  'Pending': '#FFC107',
  'Confirmed': '#4CAF50',
  'Cancelled': '#F44336',
  'Completed': '#2196F3'
};

// Month names
const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const PhotographyStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<PhotographyBookingStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getPhotographyBookingStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Prepare data for status chart
  const prepareStatusChartData = () => {
    if (!statistics) return null;

    const statusData = {
      labels: Object.keys(statistics.bookingsByStatus),
      datasets: [
        {
          data: Object.values(statistics.bookingsByStatus),
          backgroundColor: Object.keys(statistics.bookingsByStatus).map(
            status => statusColors[status as keyof typeof statusColors] || '#999'
          ),
          borderWidth: 1,
        },
      ],
    };

    return statusData;
  };

  // Prepare data for package type chart
  const preparePackageTypeChartData = () => {
    if (!statistics) return null;

    const packageData = {
      labels: statistics.bookingsByPackageType.map(item => item._id),
      datasets: [
        {
          data: statistics.bookingsByPackageType.map(item => item.count),
          backgroundColor: [
            '#8884d8',
            '#82ca9d',
            '#ffc658',
            '#ff8042',
            '#0088FE',
          ],
          borderWidth: 1,
        },
      ],
    };

    return packageData;
  };

  // Prepare data for monthly bookings chart
  const prepareMonthlyChartData = () => {
    if (!statistics) return null;

    // Create an array with all months initialized to 0
    const monthlyData = Array(12).fill(0);
    
    // Fill in the actual data
    statistics.bookingsByMonth.forEach(item => {
      const monthIndex = item._id - 1; // MongoDB month index starts at 1
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex] = item.count;
      }
    });

    const data = {
      labels: monthNames,
      datasets: [
        {
          label: 'Số lượng đặt chụp',
          data: monthlyData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
        },
      ],
    };

    return data;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Schedule sx={{ color: statusColors.Pending }} />;
      case 'Confirmed':
        return <CheckCircle sx={{ color: statusColors.Confirmed }} />;
      case 'Cancelled':
        return <Cancel sx={{ color: statusColors.Cancelled }} />;
      case 'Completed':
        return <Done sx={{ color: statusColors.Completed }} />;
      default:
        return undefined;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ py: 3 }}>
          <Typography color="error" align="center">{error}</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Thống kê đơn đặt chụp ảnh
        </Typography>

        {/* Overview Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2">Tổng số đơn đặt</Typography>
                    <Typography variant="h4">{statistics?.totalBookings || 0}</Typography>
                  </div>
                  <CameraAlt fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card sx={{ bgcolor: statusColors.Pending, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2">Đơn chờ xác nhận</Typography>
                    <Typography variant="h4">{statistics?.bookingsByStatus?.Pending || 0}</Typography>
                  </div>
                  <Schedule fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card sx={{ bgcolor: statusColors.Confirmed, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2">Đơn đã xác nhận</Typography>
                    <Typography variant="h4">{statistics?.bookingsByStatus?.Confirmed || 0}</Typography>
                  </div>
                  <CheckCircle fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card sx={{ bgcolor: statusColors.Completed, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2">Đơn hoàn thành</Typography>
                    <Typography variant="h4">{statistics?.bookingsByStatus?.Completed || 0}</Typography>
                  </div>
                  <Done fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Charts */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {/* Monthly Bookings Chart */}
          <Box sx={{ flex: '1 1 60%', minWidth: '300px' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Số lượng đặt chụp theo tháng
              </Typography>
              <Box height={300}>
                {prepareMonthlyChartData() && (
                  <Bar 
                    data={prepareMonthlyChartData()!} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Box>

          {/* Status Distribution Chart */}
          <Box sx={{ flex: '1 1 30%', minWidth: '300px' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trạng thái đơn đặt chụp
              </Typography>
              <Box height={300}>
                {prepareStatusChartData() && (
                  <Pie 
                    data={prepareStatusChartData()!} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Box>

          {/* Package Type Distribution Chart */}
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Loại gói chụp ảnh
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                {preparePackageTypeChartData() && (
                  <Pie 
                    data={preparePackageTypeChartData()!} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Box>

          {/* Average Info */}
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Trung bình đặt chụp
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Trung bình đặt chụp mỗi tháng
                  </Typography>
                  <Typography variant="h3" color="primary.main">
                    {statistics?.avgBookingsPerMonth ? Math.round(statistics.avgBookingsPerMonth * 10) / 10 : 0}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ lệ đơn hoàn thành
                  </Typography>
                  <Typography variant="h3" color="success.main">
                    {statistics?.totalBookings && statistics.bookingsByStatus?.Completed
                      ? `${Math.round((statistics.bookingsByStatus.Completed / statistics.totalBookings) * 100)}%`
                      : '0%'
                    }
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Recent Bookings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Các đơn đặt chụp gần đây
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Gói chụp</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Ngày chụp</TableCell>
                  <TableCell>Địa điểm</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics?.recentBookings && statistics.recentBookings.length > 0 ? (
                  statistics.recentBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {booking.customerId?.name || booking.customerId?.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {booking.serviceId?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                      <TableCell>{formatDate(booking.shootingDate)}</TableCell>
                      <TableCell>{booking.shootingLocation}</TableCell>
                      <TableCell>
                        <Chip
                          {...(getStatusIcon(booking.status) && { icon: getStatusIcon(booking.status) })}
                          label={booking.status}
                          sx={{
                            bgcolor: `${statusColors[booking.status as keyof typeof statusColors]}20`,
                            color: statusColors[booking.status as keyof typeof statusColors],
                            fontWeight: 'bold'
                          }}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không có đơn đặt chụp gần đây
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default PhotographyStatistics;

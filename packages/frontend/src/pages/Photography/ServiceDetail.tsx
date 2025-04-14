import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Skeleton,
  ImageList,
  ImageListItem,
  Tab,
  Tabs,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Header from '../../components/header';
import Footer from '../../components/footer';
import axios from 'axios';
import { addPhotographyToCart } from '../../api/photographyCart';
import { toast } from 'react-hot-toast';

// API service type definition
interface PhotographyService {
  _id: string;
  name: string;
  packageType: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  photographer: string;
  status: string;
  imageUrls: string[];
  features: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const API_URL = 'http://localhost:3000/photography/services';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<PhotographyService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PhotographyService>(`${API_URL}/${id}`);
        setService(response.data);
        if (response.data.imageUrls && response.data.imageUrls.length > 0) {
          setSelectedImage(response.data.imageUrls[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetail();
    }
  }, [id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectPackage = async () => {
    if (service) {
      try {
        // Add to photography cart using localStorage service
        await addPhotographyToCart({
          serviceId: service._id,
          serviceName: service.name,
          serviceType: service.packageType,
          price: service.price,
          imageUrl: service.imageUrls[0] || '',
          bookingDate: new Date().toISOString(), // Default date (will be updated during checkout)
          location: service.location
        });
        
        // Navigate to cart page
        navigate('/cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add service to cart. Please try again.');
      }
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
          <Grid container spacing={4}>
            <Grid sx={{ width: { xs: '100%', md: '58.33%' }, padding: 1 }}>
              <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
              <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} variant="rectangular" width={100} height={100} sx={{ borderRadius: 1 }} />
                ))}
              </Box>
            </Grid>
            <Grid sx={{ width: { xs: '100%', md: '41.67%' }, padding: 1 }}>
              <Skeleton variant="text" height={60} width="80%" />
              <Skeleton variant="text" height={40} width="40%" />
              <Skeleton variant="text" height={100} width="100%" sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" height={200} width="100%" sx={{ mt: 3, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={50} width="100%" sx={{ mt: 3, borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Alert 
            severity="error" 
            sx={{ width: '100%', maxWidth: 600 }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/photography')}>
                Back to Packages
              </Button>
            }
          >
            {error || 'Service not found. Please try a different package.'}
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Container maxWidth="xl" sx={{ py: 6 }}>
          {/* Breadcrumb */}
          <Typography 
            variant="body2" 
            sx={{ mb: 3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/photography')}
          >
            &larr; Back to all packages
          </Typography>

          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 6 }}>
            <Grid container>
              {/* Left Column - Image */}
              <Grid sx={{ width: { xs: '100%', md: '60%' } }}>
                <Box
                  sx={{ 
                    height: { xs: 350, sm: 450, md: 600 },
                    backgroundImage: `url(${selectedImage || service.imageUrls[0] || "https://images.unsplash.com/photo-1583939003579-730e3918a45a"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                />
                
                {/* Thumbnail Gallery */}
                {service.imageUrls.length > 1 && (
                  <Box sx={{ p: 2 }}>
                    <ImageList sx={{ height: { xs: 80, md: 100 } }} cols={service.imageUrls.length > 4 ? 5 : service.imageUrls.length} rowHeight={100} gap={8}>
                      {service.imageUrls.map((image, index) => (
                        <ImageListItem 
                          key={index}
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedImage === image ? '2px solid #000' : 'none',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                          onClick={() => handleImageSelect(image)}
                        >
                          <img
                            src={image}
                            alt={`${service.name} - image ${index + 1}`}
                            loading="lazy"
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Grid>
              
              {/* Right Column - Service Details */}
              <Grid sx={{ width: { xs: '100%', md: '40%' }, p: 4 }}>
                <Chip 
                  label={service.packageType}
                  color="primary"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {service.name}
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="medium" sx={{ mb: 3 }}>
                  ${service.price}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {service.description}
                </Typography>

                {/* Service Details */}
                <List sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2, py: 1 }}>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Duration" 
                      secondary={service.duration}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Location" 
                      secondary={service.location}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CameraAltIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Photographer" 
                      secondary={service.photographer}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItem>
                </List>
                
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth 
                  onClick={handleSelectPackage}
                  sx={{ 
                    py: 1.5,
                    backgroundColor: '#000',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                    mb: 4
                  }}
                >
                  BOOK THIS PACKAGE
                </Button>
                
                {/* Features List */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Package Features
                  </Typography>
                  <List dense>
                    {service.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleOutlineIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Info Tabs */}
          <Box sx={{ mb: 4 }}>
            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="What to Expect" />
                <Tab label="Preparation Tips" />
                <Tab label="FAQ" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>What to Expect During Your Session</Typography>
                <Typography variant="body1" paragraph>
                  Our photography sessions are designed to be relaxed, enjoyable, and productive. Our experienced 
                  photographers will guide you through posed shots while also capturing candid moments that highlight 
                  your natural connection and emotions.
                </Typography>
                <Typography variant="body1" paragraph>
                  We'll start with a brief consultation to understand your vision and preferences. Throughout the 
                  session, we'll provide guidance on posing and expressions while ensuring you feel comfortable 
                  and look your best.
                </Typography>
                <Typography variant="body1">
                  After your session, we'll carefully edit and enhance your photos to create a beautiful 
                  collection of memories that you'll treasure for years to come.
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>How to Prepare for Your Photo Session</Typography>
                <Typography variant="subtitle1" gutterBottom>Clothing & Accessories</Typography>
                <Typography variant="body1" paragraph>
                  Choose outfits that make you feel confident and comfortable. Consider the location and style of 
                  your shoot when selecting colors and styles. Bring multiple outfit options to provide variety 
                  in your photos.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>Grooming & Appearance</Typography>
                <Typography variant="body1" paragraph>
                  Schedule haircuts or styling at least a week before your session. For makeup, aim for a natural, 
                  polished look that enhances your features without appearing overdone.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>Rest & Hydration</Typography>
                <Typography variant="body1">
                  Ensure you're well-rested before your session and stay hydrated in the days leading up to it. 
                  This will help you look and feel your best during the shoot.
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>Frequently Asked Questions</Typography>
                
                <Typography variant="subtitle1" gutterBottom>What if I need to reschedule my session?</Typography>
                <Typography variant="body1" paragraph>
                  We understand that circumstances change. Please notify us at least 48 hours in advance if you 
                  need to reschedule. Rescheduling fees may apply for short-notice changes.
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>How long until I receive my photos?</Typography>
                <Typography variant="body1" paragraph>
                  For standard sessions, you can expect to receive your edited photos within 2-3 weeks. Rush 
                  delivery is available for an additional fee.
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>Can I request specific poses or shots?</Typography>
                <Typography variant="body1" paragraph>
                  Absolutely! We encourage you to share your ideas and inspirations. Feel free to bring reference 
                  photos or create a Pinterest board to show us your vision.
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>What happens if it rains on the day of an outdoor shoot?</Typography>
                <Typography variant="body1">
                  For outdoor sessions, we monitor the weather closely. If conditions are unfavorable, we'll 
                  contact you to discuss rescheduling options or alternative indoor locations.
                </Typography>
              </TabPanel>
            </Paper>
          </Box>

          {/* Related Packages */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              You May Also Like
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Explore our other popular photography packages
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/photography')}
              sx={{ 
                borderColor: '#000',
                color: '#000',
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              View All Packages
            </Button>
          </Box>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;

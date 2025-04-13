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
  Grid,
  IconButton,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  FormHelperText
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
  Visibility,
  Image,
  Close
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  getAllDresses,
  createDress,
  updateDress,
  deleteDress,
  removeImage,
  Dress,
  DressVariant
} from '../../api/dress';
import { getAllSizes, getAllColors, Size, Color } from '../../api/admin';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Products = () => {
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Dresses state
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [filteredDresses, setFilteredDresses] = useState<Dress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDressId, setCurrentDressId] = useState<string | null>(null);
  
  // Form data
  const [name, setName] = useState('');
  const [dailyRentalPrice, setDailyRentalPrice] = useState<number | null>(null);
  const [purchasePrice, setPurchasePrice] = useState<number | null>(null);
  const [productDetail, setProductDetail] = useState('');
  const [sizeAndFit, setSizeAndFit] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [material, setMaterial] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Array<{
    size: string;
    color: string;
    stock: number;
  }>>([]);
  
  // Confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dressToDelete, setDressToDelete] = useState<string | null>(null);
  
  // Validation
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    dailyRentalPrice?: string;
    purchasePrice?: string;
    variants?: string;
  }>({});
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDresses();
    fetchSizesAndColors();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = dresses.filter(dress => 
        dress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dress.style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dress.material?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDresses(filtered);
    } else {
      setFilteredDresses(dresses);
    }
  }, [searchTerm, dresses]);

  const fetchDresses = async () => {
    try {
      setLoading(true);
      const dressesData = await getAllDresses();
      setDresses(dressesData);
      setFilteredDresses(dressesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dresses:', error);
      setError('Failed to load dresses');
      setLoading(false);
    }
  };

  const fetchSizesAndColors = async () => {
    try {
      const [sizesData, colorsData] = await Promise.all([
        getAllSizes(),
        getAllColors()
      ]);
      
      setSizes(sizesData);
      setColors(colorsData);
    } catch (error) {
      console.error('Error fetching sizes and colors:', error);
      setError('Failed to load sizes and colors');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenForm = (dress?: Dress) => {
    if (dress) {
      // Edit mode
      setEditMode(true);
      setCurrentDressId(dress._id);
      setName(dress.name);
      setDailyRentalPrice(dress.dailyRentalPrice);
      setPurchasePrice(dress.purchasePrice);
      setProductDetail(dress.description?.productDetail || '');
      setSizeAndFit(dress.description?.sizeAndFit || '');
      setDescription(dress.description?.description || '');
      setStyle(dress.style || '');
      setMaterial(dress.material || '');
      setExistingImages(dress.images || []);
      
      // Convert variants
      const formattedVariants = dress.variants.map(v => ({
        size: v.size._id,
        color: v.color._id,
        stock: v.stock
      }));
      
      setVariants(formattedVariants);
    } else {
      // Add mode
      setEditMode(false);
      setCurrentDressId(null);
      resetForm();
    }
    
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    resetForm();
    setFormErrors({});
  };

  const resetForm = () => {
    setName('');
    setDailyRentalPrice(null);
    setPurchasePrice(null);
    setProductDetail('');
    setSizeAndFit('');
    setDescription('');
    setStyle('');
    setMaterial('');
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setExistingImages([]);
    setVariants([]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files);
      setSelectedImages(prev => [...prev, ...newImages]);
      
      // Create preview URLs
      const newImageUrls = newImages.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  const handleRemoveSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    
    // Also remove the preview URL
    const urlToRevoke = imagePreviewUrls[index];
    URL.revokeObjectURL(urlToRevoke);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageUrl: string) => {
    if (!currentDressId) return;
    
    try {
      await removeImage(currentDressId, imageUrl);
      setExistingImages(prev => prev.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Error removing image:', error);
      setError('Failed to remove image');
    }
  };

  const handleAddVariant = () => {
    if (sizes.length === 0 || colors.length === 0) {
      setError('Please wait for sizes and colors to load first');
      return;
    }
    
    setVariants([
      ...variants,
      {
        size: sizes[0]._id,
        color: colors[0]._id,
        stock: 0
      }
    ]);
  };

  const handleVariantChange = (index: number, field: 'size' | 'color' | 'stock', value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      dailyRentalPrice?: string;
      purchasePrice?: string;
      variants?: string;
    } = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (dailyRentalPrice === null || isNaN(dailyRentalPrice) || dailyRentalPrice <= 0) {
      errors.dailyRentalPrice = 'Daily rental price must be a positive number';
    }
    
    if (purchasePrice === null || isNaN(purchasePrice) || purchasePrice <= 0) {
      errors.purchasePrice = 'Purchase price must be a positive number';
    }
    
    if (variants.length === 0) {
      errors.variants = 'At least one variant is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitDress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('dailyRentalPrice', dailyRentalPrice?.toString() || '0');
    formData.append('purchasePrice', purchasePrice?.toString() || '0');
    
    if (productDetail) formData.append('description[productDetail]', productDetail);
    if (sizeAndFit) formData.append('description[sizeAndFit]', sizeAndFit);
    if (description) formData.append('description[description]', description);
    if (style) formData.append('style', style);
    if (material) formData.append('material', material);
    
    // Add variants
    variants.forEach((variant, index) => {
      formData.append(`variants[${index}][size]`, variant.size);
      formData.append(`variants[${index}][color]`, variant.color);
      formData.append(`variants[${index}][stock]`, variant.stock.toString());
    });
    
    // Add images
    selectedImages.forEach(image => {
      formData.append('images', image);
    });
    
    try {
      setLoading(true);
      
      if (editMode && currentDressId) {
        await updateDress(currentDressId, formData);
      } else {
        await createDress(formData);
      }
      
      await fetchDresses();
      handleCloseForm();
      setLoading(false);
    } catch (error) {
      console.error('Error saving dress:', error);
      setError('Failed to save dress');
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (dressId: string) => {
    setDressToDelete(dressId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dressToDelete) return;
    
    try {
      setLoading(true);
      await deleteDress(dressToDelete);
      setConfirmDialogOpen(false);
      setDressToDelete(null);
      await fetchDresses();
      setLoading(false);
    } catch (error) {
      console.error('Error deleting dress:', error);
      setError('Failed to delete dress');
      setLoading(false);
    }
  };

  const getSizeLabel = (sizeId: string) => {
    const size = sizes.find(s => s._id === sizeId);
    return size ? size.name : 'Unknown Size';
  };

  const getColorName = (colorId: string) => {
    const color = colors.find(c => c._id === colorId);
    return color ? color.name : 'Unknown Color';
  };

  if (loading && dresses.length === 0) {
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Product Management</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your wedding dress inventory
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpenForm()}
          sx={{ height: 'fit-content' }}
        >
          Add New Product
        </Button>
      </Box>

      <Paper sx={{ mb: 4, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search products by name, style, or material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Daily Rental Price</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Style</TableCell>
              <TableCell>Material</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDresses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((dress) => (
                <TableRow key={dress._id}>
                  <TableCell>{dress.name}</TableCell>
                  <TableCell>${dress.dailyRentalPrice}</TableCell>
                  <TableCell>${dress.purchasePrice}</TableCell>
                  <TableCell>
                    {dress.variants.reduce((total, v) => total + v.stock, 0)}
                  </TableCell>
                  <TableCell>{dress.style || 'N/A'}</TableCell>
                  <TableCell>{dress.material || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenForm(dress)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteConfirm(dress._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredDresses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No dresses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDresses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Dress Form Dialog */}
      <Dialog 
        open={formOpen} 
        onClose={handleCloseForm}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editMode ? 'Edit Dress' : 'Add New Dress'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmitDress} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Daily Rental Price"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={dailyRentalPrice === null ? '' : dailyRentalPrice}
                  onChange={(e) => setDailyRentalPrice(Number(e.target.value))}
                  error={!!formErrors.dailyRentalPrice}
                  helperText={formErrors.dailyRentalPrice}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={purchasePrice === null ? '' : purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  error={!!formErrors.purchasePrice}
                  helperText={formErrors.purchasePrice}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Detail"
                  multiline
                  rows={3}
                  value={productDetail}
                  onChange={(e) => setProductDetail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Size and Fit"
                  multiline
                  rows={3}
                  value={sizeAndFit}
                  onChange={(e) => setSizeAndFit(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Variants
                </Typography>
                {formErrors.variants && (
                  <FormHelperText error>{formErrors.variants}</FormHelperText>
                )}
                {variants.map((variant, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Size</InputLabel>
                          <Select
                            value={variant.size}
                            label="Size"
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          >
                            {sizes.map((size) => (
                              <MenuItem key={size._id} value={size._id}>
                                {size.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Color</InputLabel>
                          <Select
                            value={variant.color}
                            label="Color"
                            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          >
                            {colors.map((color) => (
                              <MenuItem key={color._id} value={color._id}>
                                {color.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Stock"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton color="error" onClick={() => handleRemoveVariant(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddVariant}
                  sx={{ mt: 1 }}
                >
                  Add Variant
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Images
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Image />}
                >
                  Add Images
                  <VisuallyHiddenInput 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </Button>

                {/* Image Previews */}
                {(imagePreviewUrls.length > 0 || existingImages.length > 0) && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {existingImages.map((img, index) => (
                      <Box
                        key={`existing-${index}`}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100,
                        }}
                      >
                        <img
                          src={img}
                          alt={`Dress Preview ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={() => handleRemoveExistingImage(img)}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    {imagePreviewUrls.map((url, index) => (
                      <Box
                        key={`new-${index}`}
                        sx={{
                          position: 'relative',
                          width: 100,
                          height: 100,
                        }}
                      >
                        <img
                          src={url}
                          alt={`New Preview ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={() => handleRemoveSelectedImage(index)}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitDress}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this dress? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Products; 
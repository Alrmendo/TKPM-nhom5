import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllDresses,
  createDress,
  updateDress,
  deleteDress,
  removeImage,
  Dress,
  DressVariant,
  DressDescription
} from '../../api/dress';
import { getAllSizes, getAllColors, Size, Color } from '../../api/admin';
import { Box, Button, TextField, Typography, Paper, Grid, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete, Edit, Image, Close } from '@mui/icons-material';

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

const DressManager = () => {
  const navigate = useNavigate();
  
  // State for dresses
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  
  // State for form
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
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDresses();
    fetchSizesAndColors();
  }, []);

  const fetchDresses = async () => {
    try {
      const dressesData = await getAllDresses();
      setDresses(dressesData);
    } catch (error) {
      console.error('Error fetching dresses:', error);
      setError('Failed to load dresses');
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
      
      console.log('Loading variants:', formattedVariants);
      setVariants(formattedVariants);
      
      // Pre-load sizes and colors if they're not loaded yet
      if (sizes.length === 0 || colors.length === 0) {
        fetchSizesAndColors();
      }
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
    // Make sure sizes and colors are available
    if (sizes.length === 0 || colors.length === 0) {
      setError('Please wait for sizes and colors to load first');
      return;
    }
    
    setVariants([
      ...variants,
      {
        size: sizes[0]?._id || '',
        color: colors[0]?._id || '',
        stock: 1
      }
    ]);
  };

  const handleVariantChange = (index: number, field: 'size' | 'color' | 'stock', value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmitDress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || dailyRentalPrice === null || purchasePrice === null) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Make sure at least one variant is defined
    if (variants.length === 0) {
      setError('Please add at least one size and color variant');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('dailyRentalPrice', dailyRentalPrice.toString());
      formData.append('purchasePrice', purchasePrice.toString());
      
      if (style) formData.append('style', style);
      if (material) formData.append('material', material);
      
      // Add description
      const descriptionObj: DressDescription = {
        productDetail,
        sizeAndFit,
        description
      };
      formData.append('description', JSON.stringify(descriptionObj));
      
      // Add variants - ensure each variant has size, color and stock
      const validVariants = variants.filter(v => v.size && v.color && v.stock > 0);
      if (validVariants.length === 0) {
        setError('Please add at least one valid size and color variant');
        setLoading(false);
        return;
      }
      
      console.log('Saving variants:', validVariants);
      formData.append('variants', JSON.stringify(validVariants));
      
      // Add images
      selectedImages.forEach(image => {
        formData.append('images', image);
      });
      
      // Create or update dress
      if (editMode && currentDressId) {
        await updateDress(currentDressId, formData);
      } else {
        await createDress(formData);
      }
      
      // Refresh data and close form
      fetchDresses();
      handleCloseForm();
      setError(null);
    } catch (error) {
      console.error('Error saving dress:', error);
      setError('Failed to save dress');
    } finally {
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
      
      // Remove from state
      setDresses(prev => prev.filter(dress => dress._id !== dressToDelete));
      
      // Close dialog
      setConfirmDialogOpen(false);
      setDressToDelete(null);
    } catch (error) {
      console.error('Error deleting dress:', error);
      setError('Failed to delete dress');
    } finally {
      setLoading(false);
    }
  };

  // Get size label by ID for display purposes
  const getSizeLabel = (sizeId: string) => {
    const size = sizes.find(s => s._id === sizeId);
    return size ? size.label : 'Unknown';
  };

  // Get color name by ID for display purposes
  const getColorName = (colorId: string) => {
    const color = colors.find(c => c._id === colorId);
    return color ? color.name : 'Unknown';
  };

  // Render select dropdowns for variant form
  const renderVariantSelects = (variant: {size: string; color: string; stock: number}, index: number) => {
    return (
      <Grid item xs={12} key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id={`size-select-label-${index}`}>Size</InputLabel>
          <Select
            labelId={`size-select-label-${index}`}
            value={variant.size}
            label="Size"
            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
            renderValue={(selected) => getSizeLabel(selected as string)}
          >
            {sizes.map(size => (
              <MenuItem key={size._id} value={size._id}>
                {size.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id={`color-select-label-${index}`}>Color</InputLabel>
          <Select
            labelId={`color-select-label-${index}`}
            value={variant.color}
            label="Color"
            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
            renderValue={(selected) => getColorName(selected as string)}
          >
            {colors.map(color => (
              <MenuItem key={color._id} value={color._id}>
                {color.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Stock"
          type="number"
          value={variant.stock}
          onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
          sx={{ flex: 0.5 }}
          inputProps={{ min: "0", step: "1" }}
        />
        
        <IconButton onClick={() => handleRemoveVariant(index)} color="error">
          <Delete />
        </IconButton>
      </Grid>
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dress Manager</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Add New Dress
        </Button>
      </Box>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      <Grid container spacing={3}>
        {dresses.map(dress => (
          <Grid item xs={12} sm={6} md={4} key={dress._id}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                  {dress.name}
                </Typography>
                <Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenForm(dress)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleDeleteConfirm(dress._id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative', mb: 2, height: 200, overflow: 'hidden' }}>
                {dress.images && dress.images.length > 0 ? (
                  <img 
                    src={dress.images[0]} 
                    alt={dress.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: '#f5f5f5' 
                    }}
                  >
                    <Image sx={{ fontSize: 60, color: '#bdbdbd' }} />
                  </Box>
                )}
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Daily Rental:</strong> ${dress.dailyRentalPrice}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Purchase Price:</strong> ${dress.purchasePrice}
              </Typography>
              
              {dress.style && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Style:</strong> {dress.style}
                </Typography>
              )}
              
              <Box sx={{ mt: 'auto' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate(`/product/${dress._id}`)}
                  sx={{ mt: 1 }}
                >
                  View Details
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Add/Edit Dress Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Dress' : 'Add New Dress'}
        </DialogTitle>
        <form onSubmit={handleSubmitDress}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Dress Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Daily Rental Price ($)"
                  type="number"
                  value={dailyRentalPrice || ''}
                  onChange={(e) => setDailyRentalPrice(Number(e.target.value))}
                  fullWidth
                  required
                  inputProps={{ min: "0", step: "0.01" }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Purchase Price ($)"
                  type="number"
                  value={purchasePrice || ''}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  fullWidth
                  required
                  inputProps={{ min: "0", step: "0.01" }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  fullWidth
                />
              </Grid>
              
              {/* Descriptions */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Description</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Product Detail"
                  value={productDetail}
                  onChange={(e) => setProductDetail(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Size & Fit Information"
                  value={sizeAndFit}
                  onChange={(e) => setSizeAndFit(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              
              {/* Variants */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Size & Color Variants</Typography>
              </Grid>
              
              {variants.map((variant, index) => renderVariantSelects(variant, index))}
              
              <Grid item xs={12}>
                <Button 
                  startIcon={<Add />} 
                  onClick={handleAddVariant}
                  variant="outlined"
                >
                  Add Variant
                </Button>
              </Grid>
              
              {/* Images */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Images</Typography>
              </Grid>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Current Images</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {existingImages.map((imageUrl, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          position: 'relative', 
                          width: 100, 
                          height: 100,
                          border: '1px solid #e0e0e0', 
                          borderRadius: 1 
                        }}
                      >
                        <img 
                          src={imageUrl} 
                          alt={`Existing ${index}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: 4 
                          }}
                        />
                        <IconButton 
                          size="small"
                          onClick={() => handleRemoveExistingImage(imageUrl)}
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            bgcolor: 'white',
                            boxShadow: 1,
                            '&:hover': { bgcolor: '#f5f5f5' } 
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* New Images */}
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Image />}
                >
                  Add Images
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                </Button>
              </Grid>
              
              {imagePreviewUrls.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>New Images</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {imagePreviewUrls.map((url, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          position: 'relative', 
                          width: 100, 
                          height: 100,
                          border: '1px solid #e0e0e0', 
                          borderRadius: 1 
                        }}
                      >
                        <img 
                          src={url} 
                          alt={`Preview ${index}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            borderRadius: 4 
                          }}
                        />
                        <IconButton 
                          size="small"
                          onClick={() => handleRemoveSelectedImage(index)}
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            bgcolor: 'white',
                            boxShadow: 1,
                            '&:hover': { bgcolor: '#f5f5f5' } 
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Dress'}
            </Button>
          </DialogActions>
        </form>
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
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DressManager; 
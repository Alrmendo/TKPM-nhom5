const Review = require('../models/Review');
const Dress = require('../models/Dress');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Helper function to calculate average rating
const updateAverageRating = async (dressId) => {
  try {
    const reviews = await Review.find({ dressId });
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    await Dress.findByIdAndUpdate(dressId, { 
      avgRating,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { dressId, rating, reviewText } = req.body;
    const userId = req.user._id;
    const username = req.user.username || req.user.email;
    
    // Check if dress exists
    const dress = await Dress.findById(dressId);
    if (!dress) {
      return res.status(404).json({
        success: false,
        message: 'Dress not found'
      });
    }
    
    // Check if user already reviewed this dress
    const existingReview = await Review.findOne({ 
      dressId, 
      userId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this dress'
      });
    }
    
    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const imageUrl = `/uploads/reviews/${file.filename}`;
        images.push(imageUrl);
      });
    }
    
    // Create new review
    const review = new Review({
      dressId,
      userId,
      username,
      rating: parseInt(rating),
      reviewText,
      images,
      date: new Date()
    });
    
    await review.save();
    
    // Update dress average rating
    await updateAverageRating(dressId);
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// Get all reviews for a dress
exports.getDressReviews = async (req, res) => {
  try {
    const { dressId } = req.params;
    
    const reviews = await Review.find({ dressId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Add reply to a review
exports.addReplyToReview = async (req, res) => {
  try {
    const { dressId, reviewId } = req.params;
    const { replyText } = req.body;
    const userId = req.user._id;
    const username = req.user.username || req.user.email;
    
    // Check if review exists
    const review = await Review.findOne({
      _id: reviewId,
      dressId
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Add reply
    review.replies.push({
      userId,
      username,
      replyText,
      date: new Date()
    });
    
    await review.save();
    
    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: review
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is authorized to delete
    if (review.userId.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    // Delete review images from server
    if (review.images.length > 0) {
      review.images.forEach(image => {
        const imagePath = path.join(__dirname, '../../public', image);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }
    
    // Delete the review
    await Review.deleteOne({ _id: reviewId });
    
    // Update dress average rating
    await updateAverageRating(review.dressId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
}; 
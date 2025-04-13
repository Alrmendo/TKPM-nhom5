const mongoose = require('mongoose');

// Schema for replies to reviews
const ReplySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  replyText: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  icon: {
    type: String
  }
});

// Main Review schema
const ReviewSchema = new mongoose.Schema({
  dressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dress',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  icon: {
    type: String
  },
  replies: [ReplySchema]
}, { timestamps: true });

// Add index for faster queries
ReviewSchema.index({ dressId: 1 });

module.exports = mongoose.model('Review', ReviewSchema); 
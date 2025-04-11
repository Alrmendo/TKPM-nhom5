import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Star, Upload, X } from 'lucide-react';
import { submitReview, ReviewSubmission } from '../../../api/dress';
import { useAuth } from '../../../context/AuthContext';

interface ReviewFormProps {
  dressId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ dressId, onReviewSubmitted }: ReviewFormProps): JSX.Element {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  // Sử dụng useEffect để kiểm tra xác thực từ đầu
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        const isAuth = await checkAuthStatus();
        setIsAuthChecked(isAuth);
      } else {
        setIsAuthChecked(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, checkAuthStatus]);

  // Handle star rating selection
  const handleSetRating = (value: number) => {
    setRating(value);
  };

  // Handle star hover
  const handleHoverRating = (value: number) => {
    setHoverRating(value);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 3) {
        toast.error('You can upload up to 3 images');
        return;
      }

      // Create object URLs for preview
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      
      setImages(prevImages => [...prevImages, ...selectedFiles]);
      setImagePreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };

  // Remove an image from the selection
  const removeImage = (index: number) => {
    // Release the object URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  // Submit the review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to submit a review');
      return;
    }

    if (!isAuthChecked) {
      toast.error('Authentication required. Please sign in again.');
      return;
    }

    if (rating === null || rating < 1 || rating > 5) {
      toast.error('Please select a valid rating (1-5 stars)');
      return;
    }

    const trimmedReviewText = reviewText.trim();
    if (trimmedReviewText === '') {
      toast.error('Please enter a review');
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData: ReviewSubmission = {
        dressId,
        rating: rating,
        reviewText: trimmedReviewText,
        images: images.length > 0 ? images : undefined,
      };

      await submitReview(reviewData);
      
      // Reset form
      setRating(null);
      setReviewText('');
      setImages([]);
      setImagePreviewUrls(prevUrls => {
        // Release all object URLs
        prevUrls.forEach(url => URL.revokeObjectURL(url));
        return [];
      });
      
      toast.success('Your review has been submitted');
      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 border border-gray-200 rounded-md p-4">
      <h3 className="text-lg font-medium">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => handleSetRating(star)}
                onMouseEnter={() => handleHoverRating(star)}
                onMouseLeave={() => handleHoverRating(0)}
                className="focus:outline-none"
              >
                <svg
                  className={`w-6 h-6 ${
                    (hoverRating !== 0 ? star <= hoverRating : (rating !== null && star <= rating))
                      ? 'text-[#f4b740] fill-[#f4b740]'
                      : 'text-gray-300'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="review-text" className="text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#c3937c]"
            placeholder="Write your review here..."
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Upload Photos (up to 3)</label>
          
          {/* Image previews */}
          {imagePreviewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                  <img src={url} alt={`Upload preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* File input button */}
          {images.length < 3 && (
            <label className="flex items-center justify-center space-x-2 border border-dashed border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                {images.length === 0 ? 'Click to upload photos' : 'Add more photos'}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-md text-center ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#ead9c9] text-[#333333] hover:bg-[#e0cbb9]'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
} 
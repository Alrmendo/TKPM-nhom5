import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DressReview } from '../../../api/dress';
import { useAuth } from '../../../context/AuthContext';
import { replyToReview } from '../../../api/dress';

interface ReviewListProps {
  dressId: string;
  reviews: any[]; // Sử dụng any thay vì DressReview vì cần mở rộng để hỗ trợ replies
  onRefresh: () => void;
}

interface ReplyFormState {
  reviewId: string | null;
  replyText: string;
  isSubmitting: boolean;
}

export default function ReviewList({ dressId, reviews, onRefresh }: ReviewListProps): JSX.Element {
  const { isAuthenticated } = useAuth();
  const [replyForm, setReplyForm] = useState<ReplyFormState>({
    reviewId: null,
    replyText: '',
    isSubmitting: false,
  });
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

  // Toggle reply form
  const toggleReplyForm = (reviewId: string | null) => {
    setReplyForm(prev => ({
      ...prev,
      reviewId: prev.reviewId === reviewId ? null : reviewId,
      replyText: '',
    }));
  };

  // Handle reply text change
  const handleReplyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyForm(prev => ({
      ...prev,
      replyText: e.target.value,
    }));
  };

  // Submit reply
  const handleSubmitReply = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to reply to reviews');
      return;
    }

    if (replyForm.replyText.trim() === '') {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setReplyForm(prev => ({
        ...prev,
        isSubmitting: true,
      }));

      await replyToReview(dressId, reviewId, replyForm.replyText);
      
      // Reset form
      setReplyForm({
        reviewId: null,
        replyText: '',
        isSubmitting: false,
      });
      
      toast.success('Your reply has been submitted');
      onRefresh();
    } catch (error: any) {
      console.error('Error submitting reply:', error);
      toast.error(error.message || 'Failed to submit reply');
      
      setReplyForm(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  // Get reviews to display based on showAllReviews state
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (reviews.length === 0) {
    return (
      <div className="text-gray-500 italic text-center py-4">
        No reviews yet. Be the first to leave a review!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayedReviews.map((review, index) => (
        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#f2f2f2] overflow-hidden">
                <img 
                  src={review.icon || "/placeholder.svg?height=40&width=40"} 
                  alt={review.username} 
                  className="object-cover w-full h-full" 
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-[#333333]">{review.username}</h4>
                <span className="text-xs text-[#868686]">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>

              {/* Rating */}
              <div className="flex mb-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${star <= review.rating ? 'text-[#f4b740] fill-[#f4b740]' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm text-[#333333]">{review.reviewText}</p>

              {/* Review images if any */}
              {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.images.map((image: string, imgIndex: number) => (
                    <div key={imgIndex} className="w-16 h-16 rounded-md overflow-hidden">
                      <img src={image} alt={`Review image ${imgIndex + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Reply button */}
              <button
                onClick={() => toggleReplyForm(review._id)}
                className="text-xs text-[#c3937c] hover:underline"
              >
                {replyForm.reviewId === review._id ? 'Cancel Reply' : 'Reply'}
              </button>

              {/* Reply form */}
              {replyForm.reviewId === review._id && (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={replyForm.replyText}
                    onChange={handleReplyTextChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#c3937c]"
                    placeholder="Write your reply..."
                    rows={3}
                  />
                  <button
                    onClick={() => handleSubmitReply(review._id)}
                    disabled={replyForm.isSubmitting}
                    className={`px-4 py-1 rounded-md text-sm ${
                      replyForm.isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#ead9c9] text-[#333333] hover:bg-[#e0cbb9]'
                    }`}
                  >
                    {replyForm.isSubmitting ? 'Sending...' : 'Submit Reply'}
                  </button>
                </div>
              )}

              {/* Replies if any */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                  {review.replies.map((reply: any, replyIndex: number) => (
                    <div key={replyIndex} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#f2f2f2] overflow-hidden">
                          <img 
                            src={reply.icon || "/placeholder.svg?height=32&width=32"} 
                            alt={reply.username} 
                            className="object-cover w-full h-full" 
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-medium text-[#333333]">{reply.username}</h5>
                          <span className="text-xs text-[#868686]">
                            {new Date(reply.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#333333] mt-1">{reply.replyText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* View all / View less button */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-sm text-[#c3937c] hover:underline"
        >
          {showAllReviews 
            ? 'View less reviews' 
            : `View all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  );
} 
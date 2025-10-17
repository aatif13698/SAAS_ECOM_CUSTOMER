import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';
import customerService from '../../services/customerService';
import useDarkmode from '../../Hooks/useDarkMode';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'my-secret-key';

const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
  return encodeURIComponent(encrypted);
};

const decryptId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <span
              className={`text-2xl cursor-pointer mr-2 ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          </label>
        );
      })}
    </div>
  );
};

function RatingAndReview() {
  const { productMainStockId, productStockId, reviewId } = useParams();
  const [isDark] = useDarkmode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(!!reviewId); // Only load if editing
  const [stockIds, setStockIds] = useState({});
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // Array of { file, preview } for new images
  const [existingImages, setExistingImages] = useState([]); // Array of existing image URLs
  const [error, setError] = useState('');

  // Fetch review data if editing
  useEffect(() => {
    if (reviewId) {
      const fetchReview = async () => {
        try {
          setIsReviewLoading(true);
          const decryptedReviewId = decryptId(reviewId);
          if (!decryptedReviewId) {
            throw new Error('Invalid review ID');
          }
          const response = await customerService.getParticularRewview(decryptedReviewId); // Assume this API exists
          console.log("resposne get review", response?.data?.review);

          const review = response?.data?.review;
          if (review) {
            setRating(review.rating || 0);
            setName(review.name || '');
            setDescription(review.description || '');
            setExistingImages(review.images || []);
          }
        } catch (error) {
          console.error('Error fetching review:', error);
          toast.error('Failed to load review data');
          navigate('/list/rating'); // Redirect if fetch fails
        } finally {
          setIsReviewLoading(false);
        }
      };
      fetchReview();
    }
  }, [reviewId, navigate]);

  // Decrypt product IDs
  useEffect(() => {
    const decryptedProductMainStockId = decryptId(productMainStockId);
    const decryptedProductStockId = decryptId(productStockId);
    if (!decryptedProductMainStockId || !decryptedProductStockId) {
      toast.error('Invalid product IDs');
      navigate('/list/rating');
      return;
    }
    setStockIds({
      productMainStockId: decryptedProductMainStockId,
      productStockId: decryptedProductStockId,
    });
  }, [productMainStockId, productStockId, navigate]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 3 * 1024 * 1024; // 3MB
    const validFiles = [];

    if (selectedFiles.length + images.length + existingImages.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds 3MB limit.`);
        return;
      }
      if (file.type.startsWith('image/')) {
        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
        });
      } else {
        setError(`File ${file.name} is not an image.`);
        return;
      }
    }

    setError('');
    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('clientId', import.meta.env.VITE_DATABASE_ID);
      formData.append('productMainStockId', stockIds.productMainStockId);
      formData.append('productStock', stockIds.productStockId);
      formData.append('rating', rating);
      formData.append('name', name);
      formData.append('description', description);
      images.forEach(({ file }) => formData.append('file', file));
      formData.append('existingImages', JSON.stringify(existingImages)); // Send existing image URLs

      let response;
      if (reviewId) {
        // Update existing review
        const decryptedReviewId = decryptId(reviewId);
        formData.append('reviewId', decryptedReviewId);
        response = await customerService.updateRating(formData); // Assume updateReview API
        toast.success('Review updated successfully');
      } else {
        // Create new review
        response = await customerService.postRating(formData);
        toast.success('Review added successfully');
      }

      setRating(0);
      setName('');
      setDescription('');
      setImages([]);
      setExistingImages([]);
      setError('');
      navigate('/list/rating'); // Redirect to reviews list after submission
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  if (isReviewLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto py-8 px-4 ${isDark ? "bg-cardBgDark2" : "bg-white"} my-6  min-h-[60vh] flex flex-col items-center`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {reviewId ? 'Edit Review' : 'Rate and Review Product'}
      </h1>

      {/* Section 1: Guidelines */}
      <section className={`mb-12 w-[100%] ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600`}>
        <h2 className="text-2xl font-semibold mb-4">
          What makes a good review
        </h2>
        <ul className="list-none p-0 space-y-4">
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Have you used this product?</strong>
            <p className="text-gray-600 dark:text-gray-300">Your review should be about your experience with the product.</p>
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">Why review a product?</strong>
            <p className="text-gray-600 dark:text-gray-300">Your valuable feedback will help fellow shoppers decide!</p>
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-200">How to review a product?</strong>
            <p className="text-gray-600 dark:text-gray-300">
              Your review should include facts. An honest opinion is always appreciated. If you have an issue with the product or service, please contact us from the help centre.
            </p>
          </li>
        </ul>
      </section>

      {/* Section 2: Form */}
      <section className="w-[100%]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block mb-2 font-bold text-gray-800 dark:text-gray-200">Rating *</label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-800 dark:text-gray-200">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-[100%] p-3 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-800 dark:text-gray-200">Review Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`w-[100%] p-3 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Share your experience with the product"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-800 dark:text-gray-200">Upload Images (up to 5, each less than 3MB)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block mb-4 text-gray-600 dark:text-gray-300"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={img}
                    alt={`Existing ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, true)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.map((img, index) => (
                <div key={`new-${index}`} className="relative">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`group float-end relative px-4  border-2 border-lightButton  py-2 text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md  font-semibold ${isLoading ? 'cursor-not-allowed' : ''
              }  transition-all duration-300`}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : reviewId ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default RatingAndReview;
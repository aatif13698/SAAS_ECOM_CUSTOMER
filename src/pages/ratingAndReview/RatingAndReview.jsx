import React, { useState } from 'react';
import useDarkmode from '../../Hooks/useDarkMode';

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
              className={`text-2xl cursor-pointer mr-2 ${
                ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
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

function RatingAndReview({ productMainStockId }) {
  const [isDark] = useDarkmode();

  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 3 * 1024 * 1024; // 3MB
    const validFiles = [];

    if (selectedFiles.length + images.length > 5) {
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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    const formData = new FormData();
    formData.append('productMainStockId', productMainStockId);
    formData.append('rating', rating);
    formData.append('name', name);
    formData.append('description', description);
    images.forEach(({ file }) => formData.append('images', file));

    console.log('Submitting review:', { rating, name, description, images: images.map(i => i.file.name) });
    alert('Review submitted!');
    setRating(0);
    setName('');
    setDescription('');
    setImages([]);
    setError('');
  };

  return (
    <div className={`max-w-4xl mx-auto py-8 px-4 ${isDark ? "bg-cardBgDark2" : "bg-white"} my-6  min-h-[60vh] flex flex-col items-center`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Rate and Review Product
      </h1>

      {/* Section 1: Guidelines */}
      <section className={`mb-12 w-[100%]${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"}  p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600`}>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
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
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-800 dark:text-gray-200">Review Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
                  className={`w-[100%] ${isDark ? "bg-inputDark text-light" : "border-2 bg-inputLight text-dark"} p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-100`}
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
            />
            <div className="flex flex-wrap gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
                className={`group relative px-4  border-2 border-lightButton  py-2 text-lightButton hover:border-lightButton/60 hover:bg-lightButton/10 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md `}
          >
            Submit Review
          </button>
        </form>
      </section>
    </div>
  );
}

export default RatingAndReview;
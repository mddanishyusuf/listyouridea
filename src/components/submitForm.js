// src/components/submitForm.js
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/router';

const SubmitForm = () => {
    const { userObj } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        productTitle: '',
        productDescription: '',
        productUrl: '',
        productImage: '',
        featuredImages: [],
    });

    // File input refs
    const productImageInputRef = useRef(null);
    const featuredImageInputRef = useRef(null);

    // Validation
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.productTitle.trim()) {
            newErrors.productTitle = 'Product name is required';
        }

        if (!formData.productDescription.trim()) {
            newErrors.productDescription = 'Product description is required';
        } else {
            const wordCount = formData.productDescription
                .trim()
                .split(' ')
                .filter((word) => word.length > 0).length;
            if (wordCount > 100) {
                newErrors.productDescription = 'Description must be 100 words or less';
            }
        }

        if (!formData.productUrl.trim()) {
            newErrors.productUrl = 'Product URL is required';
        } else if (!isValidUrl(formData.productUrl)) {
            newErrors.productUrl = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.productImage) {
            newErrors.productImage = 'Product logo is required';
        }

        if (formData.featuredImages.length === 0) {
            newErrors.featuredImages = 'At least 1 featured image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateStep1()) {
            return;
        }

        if (currentStep === 2 && !validateStep2()) {
            return;
        }

        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleFileUpload = async (file, type = 'product') => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    uid: userObj?.uid,
                },
                body: formDataUpload,
            });

            const data = await res.json();

            if (type === 'product') {
                handleInputChange('productImage', data.url);
            } else {
                handleInputChange('featuredImages', [...formData.featuredImages, data.url]);
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleFileSelect = (type = 'product') => {
        if (type === 'product' && productImageInputRef.current) {
            productImageInputRef.current.click();
        } else if (type === 'featured' && featuredImageInputRef.current) {
            featuredImageInputRef.current.click();
        }
    };

    const handleFileChange = (event, type = 'product') => {
        const files = type === 'featured' ? Array.from(event.target.files) : [event.target.files[0]];

        if (type === 'featured') {
            const remainingSlots = 4 - formData.featuredImages.length;
            const filesToUpload = files.slice(0, remainingSlots);

            filesToUpload.forEach((file) => {
                handleFileUpload(file, type);
            });
        } else {
            handleFileUpload(files[0], type);
        }
    };

    const removeFeaturedImage = (indexToRemove) => {
        handleInputChange(
            'featuredImages',
            formData.featuredImages.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    uid: userObj?.uid,
                },
                body: JSON.stringify({
                    productTitle: formData.productTitle,
                    productDescription: formData.productDescription,
                    productImage: formData.productImage,
                    featuredImages: formData.featuredImages,
                }),
            });

            if (res.ok) {
                router.push('/');
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <form className="form-space">
            <div className="form-space-inner">
                <div className="form-item">
                    <label
                        className="form-label"
                        htmlFor="productTitle"
                    >
                        Product Name
                    </label>
                    <input
                        className="form-control"
                        placeholder="My Awesome Product"
                        id="productTitle"
                        value={formData.productTitle}
                        onChange={(e) => handleInputChange('productTitle', e.target.value)}
                    />
                    <p className="form-description">The name of your product that will be displayed to users.</p>
                    {errors.productTitle && <p className="form-error">{errors.productTitle}</p>}
                </div>

                <div className="form-item">
                    <label
                        className="form-label"
                        htmlFor="productDescription"
                    >
                        Product Description
                    </label>
                    <textarea
                        className="form-control form-textarea"
                        placeholder="Describe your product and what makes it unique..."
                        id="productDescription"
                        value={formData.productDescription}
                        onChange={(e) => handleInputChange('productDescription', e.target.value)}
                    />
                    <p className="form-description">
                        Provide a clear, concise description of what your product does and its main features. (Max 100 words)
                        <span className="word-count">
                            {
                                formData.productDescription
                                    .trim()
                                    .split(' ')
                                    .filter((word) => word.length > 0).length
                            }
                            /100 words
                        </span>
                    </p>
                    {errors.productDescription && <p className="form-error">{errors.productDescription}</p>}
                </div>

                <div className="form-item">
                    <label
                        className="form-label"
                        htmlFor="productUrl"
                    >
                        Product URL
                    </label>
                    <input
                        className="form-control"
                        placeholder="https://yourproduct.com"
                        id="productUrl"
                        value={formData.productUrl}
                        onChange={(e) => handleInputChange('productUrl', e.target.value)}
                    />
                    <p className="form-description">The website or landing page URL for your product.</p>
                    {errors.productUrl && <p className="form-error">{errors.productUrl}</p>}
                </div>
            </div>
        </form>
    );

    const renderStep2 = () => (
        <form className="form-space">
            <div className="form-space-inner">
                <div className="form-item">
                    <label className="form-label">Product Logo</label>

                    {formData.productImage ? (
                        <div className="image-preview-container">
                            <img
                                src={formData.productImage}
                                alt="Product logo"
                                className="uploaded-image"
                            />
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() => handleInputChange('productImage', '')}
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <div
                            className="upload-area"
                            onClick={() => handleFileSelect('product')}
                        >
                            <div className="upload-content">
                                <svg
                                    className="upload-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <p>Click to upload product logo</p>
                            </div>
                        </div>
                    )}

                    <p className="form-description">Upload your product logo or main image (PNG, JPG, GIF).</p>
                    {errors.productImage && <p className="form-error">{errors.productImage}</p>}
                </div>

                <div className="form-item">
                    <label className="form-label">Featured Images ({formData.featuredImages.length}/4)</label>

                    {formData.featuredImages.length > 0 && (
                        <div className="images-grid">
                            {formData.featuredImages.map((image, index) => (
                                <div
                                    key={index}
                                    className="image-preview-container"
                                >
                                    <img
                                        src={image}
                                        alt={`Featured ${index + 1}`}
                                        className="uploaded-image small"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => removeFeaturedImage(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {formData.featuredImages.length < 4 && (
                        <div
                            className="upload-area"
                            onClick={() => handleFileSelect('featured')}
                        >
                            <div className="upload-content">
                                <svg
                                    className="upload-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <p>{formData.featuredImages.length === 0 ? 'Click to add featured images' : `Add more images (${4 - formData.featuredImages.length} remaining)`}</p>
                            </div>
                        </div>
                    )}

                    <p className="form-description">Add up to 4 featured images showcasing your product.</p>
                    {errors.featuredImages && <p className="form-error">{errors.featuredImages}</p>}
                </div>

                {/* Hidden file inputs */}
                <input
                    type="file"
                    ref={productImageInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'product')}
                    accept="image/*"
                />
                <input
                    type="file"
                    ref={featuredImageInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'featured')}
                    accept="image/*"
                    multiple
                />
            </div>
        </form>
    );

    const renderStep3 = () => (
        <div className="form-space">
            <div className="form-space-inner">
                <div className="review-section">
                    <h3 className="review-title">Review Your Submission</h3>

                    <div className="review-item">
                        <strong>Product Name:</strong>
                        <p>{formData.productTitle}</p>
                    </div>

                    <div className="review-item">
                        <strong>Description:</strong>
                        <p>{formData.productDescription}</p>
                    </div>

                    <div className="review-item">
                        <strong>Product URL:</strong>
                        <p>{formData.productUrl}</p>
                    </div>

                    <div className="review-item">
                        <strong>Product Logo:</strong>
                        <img
                            src={formData.productImage}
                            alt="Product logo"
                            className="review-image"
                        />
                    </div>

                    <div className="review-item">
                        <strong>Featured Images ({formData.featuredImages.length}):</strong>
                        <div className="review-images-grid">
                            {formData.featuredImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Featured ${index + 1}`}
                                    className="review-image small"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!userObj) {
        return (
            <div className="submit-container">
                <div className="submit-content">
                    <div className="auth-required">
                        <h2>Please login to submit your product idea</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="submit-container">
            <div className="submit-content">
                <h1 className="submit-title">Share Your Product Idea</h1>

                {/* Progress bar */}
                <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={Math.round((currentStep / 3) * 100)}
                >
                    <div
                        className="progress-indicator"
                        style={{ transform: `translateX(-${100 - (currentStep / 3) * 100}%)` }}
                    />
                </div>

                {/* Form content */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {/* Navigation */}
                <div className="form-footer">
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                        >
                            <svg
                                className="btn-icon-left"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Previous
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                className="button button--primary"
                                onClick={handleNext}
                            >
                                Next
                                <svg
                                    className="btn-icon-right"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="button button--primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Product'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitForm;

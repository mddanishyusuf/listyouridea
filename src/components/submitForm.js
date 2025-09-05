// src/components/submitForm.js
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/router';
import { AltArrowRightLineDuotone, CameraOutline, LinkCircle02 } from '@/lib/icons';

const SubmitForm = () => {
    const { userObj } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);

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
        if (!file) return;

        setUploading(true);
        if (type === 'featured') {
            setUploadingFiles((prev) => [...prev, file.name]);
        }

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

            if (!res.ok) {
                throw new Error(`Upload failed: ${res.statusText}`);
            }

            const data = await res.json();

            if (type === 'product') {
                handleInputChange('productImage', data.url);
            } else {
                setFormData((prev) => ({
                    ...prev,
                    featuredImages: [...prev.featuredImages, data.url],
                }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Failed to upload ${file.name}. Please try again.`);
        } finally {
            setUploading(false);
            if (type === 'featured') {
                setUploadingFiles((prev) => prev.filter((name) => name !== file.name));
            }
        }
    };

    const handleFileSelect = (type = 'product') => {
        if (type === 'product' && productImageInputRef.current) {
            productImageInputRef.current.click();
        } else if (type === 'featured' && featuredImageInputRef.current) {
            if (formData.featuredImages.length >= 4) {
                alert('Maximum 4 images allowed');
                return;
            }
            featuredImageInputRef.current.click();
        }
    };

    const handleFileChange = (event, type = 'product') => {
        const files = event.target.files;

        if (!files || files.length === 0) return;

        if (type === 'featured') {
            const filesArray = Array.from(files);
            const remainingSlots = 4 - formData.featuredImages.length;
            const filesToUpload = filesArray.slice(0, remainingSlots);

            filesToUpload.forEach((file) => {
                handleFileUpload(file, type);
            });
        } else {
            handleFileUpload(files[0], type);
        }

        event.target.value = '';
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
                    productUrl: formData.productUrl,
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
        <div className="step-content">
            <div className="form-section">
                <label>Product Name</label>
                <input
                    className={`form-input ${errors.productTitle ? 'error' : ''}`}
                    placeholder="Enter your product name"
                    value={formData.productTitle}
                    onChange={(e) => handleInputChange('productTitle', e.target.value)}
                />
                {errors.productTitle && <span className="error-text">{errors.productTitle}</span>}
            </div>

            <div className="form-section">
                <label>Description</label>
                <textarea
                    className={`form-textarea ${errors.productDescription ? 'error' : ''}`}
                    placeholder="Describe your product..."
                    value={formData.productDescription}
                    onChange={(e) => handleInputChange('productDescription', e.target.value)}
                    rows={4}
                />
                <div className="form-helper">
                    <span className="word-count">
                        {
                            formData.productDescription
                                .trim()
                                .split(' ')
                                .filter((word) => word.length > 0).length
                        }
                        /100 words
                    </span>
                </div>
                {errors.productDescription && <span className="error-text">{errors.productDescription}</span>}
            </div>

            <div className="form-section">
                <label>Website URL</label>
                <input
                    className={`form-input ${errors.productUrl ? 'error' : ''}`}
                    placeholder="https://yourproduct.com"
                    value={formData.productUrl}
                    onChange={(e) => handleInputChange('productUrl', e.target.value)}
                />
                {errors.productUrl && <span className="error-text">{errors.productUrl}</span>}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="step-content">
            <div className="form-section">
                <label>Product Logo</label>
                {formData.productImage ? (
                    <div className="uploaded-image">
                        <img
                            src={formData.productImage}
                            alt="Product logo"
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => handleInputChange('productImage', '')}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div
                        className={`upload-box ${uploading ? 'uploading' : ''}`}
                        onClick={() => !uploading && handleFileSelect('product')}
                    >
                        {uploading ? (
                            <div className="upload-status">
                                <div className="spinner"></div>
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <CameraOutline />
                                <span>Upload Logo</span>
                            </>
                        )}
                    </div>
                )}
                {errors.productImage && <span className="error-text">{errors.productImage}</span>}
            </div>

            <div className="form-section">
                <label>Featured Images ({formData.featuredImages.length}/4)</label>
                <div className="images-grid">
                    {formData.featuredImages.map((image, index) => (
                        <div
                            key={index}
                            className="uploaded-image small"
                        >
                            <img
                                src={image}
                                alt={`Featured ${index + 1}`}
                            />
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeFeaturedImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {formData.featuredImages.length < 4 && (
                        <div
                            className={`upload-box small ${uploading ? 'uploading' : ''}`}
                            onClick={() => !uploading && handleFileSelect('featured')}
                        >
                            {uploading ? (
                                <div className="spinner small"></div>
                            ) : (
                                <>
                                    <CameraOutline />
                                    <span>Add Image</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {errors.featuredImages && <span className="error-text">{errors.featuredImages}</span>}
            </div>

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
    );

    const renderStep3 = () => (
        <div className="step-content">
            <div className="preview-post">
                <div className="post-header">
                    <div className="author-image">
                        <img
                            src={formData.productImage}
                            alt="Product Logo"
                            style={{
                                borderRadius: '8px',
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                    <div className="content">
                        <div className="content-head">
                            <div>
                                <h3 style={{ fontSize: 15, margin: 0 }}>{formData.productTitle}</h3>
                            </div>
                            <div className="content-head-right">
                                <a
                                    href={formData.productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="product-link-btn"
                                >
                                    Visit
                                </a>
                            </div>
                        </div>

                        <div className="product-post">
                            <div style={{ marginBottom: '12px', lineHeight: '1.5', fontSize: 14 }}>{formData.productDescription}</div>

                            {formData.featuredImages && formData.featuredImages.length > 0 && (
                                <div
                                    className="featured-images"
                                    style={{ marginTop: '12px' }}
                                >
                                    <div className="featured-images-row">
                                        {formData.featuredImages.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Featured ${index + 1}`}
                                                className="featured-image-small"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!userObj) {
        return (
            <div className="submit-form-container">
                <div className="auth-message">
                    <h2>Please login to submit your product</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="submit-form-container">
            <div className="form-header">
                <h1>Submit Your Product</h1>
                <div className="step-indicators">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <span>1</span>
                        <label>Details</label>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <span>2</span>
                        <label>Images</label>
                    </div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <span>3</span>
                        <label>Preview</label>
                    </div>
                </div>
            </div>

            <div className="form-body">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </div>

            <div className="form-footer">
                <button
                    type="button"
                    className="button button--secondary button--small"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                >
                    Previous
                </button>

                {currentStep < 3 ? (
                    <button
                        type="button"
                        className="button button--primary button--small"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        type="button"
                        className="button button--primary button--small"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Product'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SubmitForm;

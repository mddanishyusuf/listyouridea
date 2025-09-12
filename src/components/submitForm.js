// src/components/submitForm.js
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/router';
import { CameraOutline } from '@/lib/icons';

const PRODUCT_CATEGORIES = [
    'Productivity & Collaboration',
    'Marketing & Analytics',
    'Customer Relationship Management (CRM)',
    'Project Management',
    'E-commerce & Sales',
    'Communication & Messaging',
    'Design & Creative',
    'Developer Tools',
    'Finance & Accounting',
    'HR & Recruitment',
    'Education & E-learning',
    'Healthcare & Medical',
    'Security & Privacy',
    'Data & Business Intelligence',
    'AI & Machine Learning',
    'Social Media Management',
    'Content Management',
    'Automation & Workflow',
    'File Storage & Management',
    'Customer Support & Service',
    'Other',
];

const SubmitForm = () => {
    const { userObj } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        productTitle: '',
        productDescription: '',
        productUrl: '',
        productImage: '',
        featuredImages: [],
        category: '',
    });

    const [errors, setErrors] = useState({});
    const productImageInputRef = useRef(null);
    const featuredImageInputRef = useRef(null);

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

    const handleFileUpload = async (file, type = 'product') => {
        if (!file) return;

        setUploading(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    uid: userObj?.uid,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/schedule');
            } else {
                alert(data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userObj) {
        return (
            <main className="submit-form-container inherited-css">
                <div className="submit-form-grid">
                    <div className="auth-message">
                        <h2>Please login to submit your product</h2>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="submit-form-container inherited-css">
            <div className="submit-form-grid">
                <form
                    className="submit-form"
                    onSubmit={handleSubmit}
                >
                    {/* Product Details Section */}
                    <div className="form-section">
                        <div className="section-content">
                            <div className="form-field">
                                <label
                                    htmlFor="product-name"
                                    className="field-label"
                                >
                                    Product Name
                                </label>
                                <input
                                    id="product-name"
                                    className="form-input"
                                    type="text"
                                    placeholder="Enter your product name"
                                    value={formData.productTitle}
                                    onChange={(e) => handleInputChange('productTitle', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label
                                    htmlFor="product-description"
                                    className="field-label"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="product-description"
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Describe your product..."
                                    value={formData.productDescription}
                                    onChange={(e) => handleInputChange('productDescription', e.target.value)}
                                    required
                                />
                                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                                    {
                                        formData.productDescription
                                            .trim()
                                            .split(' ')
                                            .filter((word) => word.length > 0).length
                                    }
                                    /100 words
                                </small>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label
                                        htmlFor="category"
                                        className="field-label"
                                    >
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        className="form-input"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label
                                        htmlFor="product-url"
                                        className="field-label"
                                    >
                                        Website URL
                                    </label>
                                    <input
                                        id="product-url"
                                        className="form-input"
                                        type="url"
                                        placeholder="https://yourproduct.com"
                                        value={formData.productUrl}
                                        onChange={(e) => handleInputChange('productUrl', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="form-section">
                        <div className="section-content">
                            <div className="form-field">
                                <label className="field-label">Product Logo</label>
                                {formData.productImage ? (
                                    <div className="uploaded-image">
                                        <img
                                            src={formData.productImage}
                                            alt="Product logo"
                                        />
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => handleInputChange('productImage', '')}
                                        >
                                            <span className="remove-icon"></span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className={`upload-button ${uploading ? 'uploading' : ''}`}
                                        onClick={() => !uploading && handleFileSelect('product')}
                                        disabled={uploading}
                                    >
                                        <CameraOutline />
                                        <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                                    </button>
                                )}
                            </div>

                            <div className="form-field">
                                <label className="field-label">Featured Images ({formData.featuredImages.length}/4)</label>
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
                                                className="remove-button small"
                                                onClick={() => removeFeaturedImage(index)}
                                            >
                                                <span className="remove-icon"></span>
                                            </button>
                                        </div>
                                    ))}

                                    {formData.featuredImages.length < 4 && (
                                        <button
                                            type="button"
                                            className={`upload-button small ${uploading ? 'uploading' : ''}`}
                                            onClick={() => !uploading && handleFileSelect('featured')}
                                            disabled={uploading}
                                        >
                                            <CameraOutline />
                                            <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
                                        </button>
                                    )}
                                </div>
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
                    </div>

                    {/* Submit Section */}
                    <div className="form-section">
                        <div className="section-content">
                            <button
                                type="submit"
                                className="button button--primary"
                                disabled={isSubmitting}
                                style={{ width: '100%' }}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default SubmitForm;

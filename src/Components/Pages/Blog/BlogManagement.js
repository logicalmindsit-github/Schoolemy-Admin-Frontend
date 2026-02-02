import React, { useState, useEffect, useCallback } from 'react';
import { createBlog, getAllBlogsAdmin, updateBlog, deleteBlog, getImageUrl } from '../../../Utils/blogApi';
import DebugAuth from '../../Dashboard/DebugAuth';

const BlogManagement = () => {
  const [showDebug, setShowDebug] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    published: false,
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllBlogsAdmin();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Full error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      showMessage('error', 'Failed to load blogs: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const testAuth = async () => {
    try {
      const response = await fetch('/api/blog/admin/test-auth', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log('Auth test result:', data);
      alert('Auth test: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Auth test error:', error);
      alert('Auth test failed: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Please select an image file');
        return;
      }
      
      // Validate file size (45MB limit)
      if (file.size > 45 * 1024 * 1024) {
        showMessage('error', 'Image size must be less than 45MB');
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.onerror = () => {
        showMessage('error', 'Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const submitData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        tags: formData.tags,
        published: formData.published
      };
      
      // Add image if it exists and is not empty
      if (formData.image && formData.image.trim() !== '') {
        submitData.image = formData.image;
      }

      if (editingBlog) {
        await updateBlog(editingBlog._id, submitData);
        showMessage('success', 'Blog updated successfully!');
      } else {
        await createBlog(submitData);
        showMessage('success', 'Blog created successfully!');
      }

      resetForm();
      fetchBlogs();
      setShowEditor(false);
    } catch (error) {
      showMessage('error', error.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags.join(', '),
      published: blog.published,
      image: blog.image || ''
    });
    setImagePreview(blog.image ? getImageUrl(blog.image) : null);
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteBlog(id);
      showMessage('success', 'Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      showMessage('error', 'Failed to delete blog: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      tags: '',
      published: false,
      image: ''
    });
    setImagePreview(null);
    setEditingBlog(null);
  };

  const cancelEdit = () => {
    resetForm();
    setShowEditor(false);
  };

  return (
    <div style={styles.container}>
      {showDebug && (
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDebug(false)} 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Hide Debug
          </button>
          <DebugAuth />
        </div>
      )}
      
      <div style={styles.header}>
        <h2 style={styles.title}>Blog Management</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={testAuth} 
            style={{
              ...styles.secondaryButton,
              padding: '8px 16px',
              fontSize: '12px'
            }}
          >
            🔍 Test Auth
          </button>
          {!showEditor && (
            <button 
              onClick={() => setShowEditor(true)} 
              style={styles.primaryButton}
              disabled={loading}
            >
              + Create New Blog
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          borderColor: message.type === 'success' ? '#c3e6cb' : '#f5c6cb'
        }}>
          {message.text}
        </div>
      )}

      {showEditor ? (
        <div style={styles.editorCard}>
          <h3 style={styles.editorTitle}>
            {editingBlog ? 'Edit Blog' : 'Create New Blog'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength="200"
                  style={styles.input}
                  placeholder="Enter blog title"
                />
                <small style={styles.charCount}>{formData.title.length}/200</small>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  maxLength="500"
                  rows="3"
                  style={styles.textarea}
                  placeholder="Brief description (shown in blog list)"
                />
                <small style={styles.charCount}>{formData.excerpt.length}/500</small>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="15"
                  style={styles.textarea}
                  placeholder="Full blog content (supports HTML)"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., Technology, AI, Tutorial"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
                <small style={styles.charCount}>Max 45MB (JPG, PNG, GIF, WebP) - Will be stored as Base64</small>
                {imagePreview && (
                  <div style={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" style={styles.previewImg} />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: '' }));
                        setImagePreview(null);
                      }}
                      style={styles.removeImageButton}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label htmlFor="published" style={styles.checkboxLabel}>
                  Publish immediately (uncheck to save as draft)
                </label>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button 
                type="submit" 
                style={styles.primaryButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
              </button>
              <button 
                type="button" 
                onClick={cancelEdit} 
                style={styles.secondaryButton}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={styles.blogList}>
          {loading ? (
            <div style={styles.loading}>Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No blogs yet. Create your first blog post!</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {blogs.map(blog => (
                <div key={blog._id} style={styles.blogCard}>
                  {blog.image && (
                    <div style={styles.blogImageContainer}>
                      <img 
                        src={getImageUrl(blog.image)} 
                        alt={blog.title}
                        style={styles.blogImage}
                      />
                    </div>
                  )}
                  <div style={styles.blogContent}>
                    <div style={styles.blogHeader}>
                      <h3 style={styles.blogTitle}>{blog.title}</h3>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: blog.published ? '#28a745' : '#ffc107',
                        color: blog.published ? '#fff' : '#000'
                      }}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p style={styles.blogExcerpt}>{blog.excerpt}</p>
                    <div style={styles.blogMeta}>
                      <small style={styles.date}>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </small>
                      {blog.tags && blog.tags.length > 0 && (
                        <div style={styles.tags}>
                          {blog.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} style={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={styles.blogActions}>
                      <button 
                        onClick={() => handleEdit(blog)} 
                        style={styles.editButton}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id)} 
                        style={styles.deleteButton}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  message: {
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid',
    borderRadius: '4px'
  },
  editorCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  editorTitle: {
    fontSize: '24px',
    marginBottom: '25px',
    color: '#333'
  },
  formRow: {
    marginBottom: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#555',
    fontSize: '14px'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  textarea: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  charCount: {
    color: '#999',
    fontSize: '12px',
    marginTop: '5px'
  },
  fileInput: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  imagePreview: {
    marginTop: '15px',
    maxWidth: '400px',
    position: 'relative'
  },
  previewImg: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  removeImageButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  blogList: {
    marginTop: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#999'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px'
  },
  blogCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  blogImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  },
  blogImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  blogContent: {
    padding: '20px'
  },
  blogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    gap: '10px'
  },
  blogTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    flex: 1
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  blogExcerpt: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '15px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  blogMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  },
  date: {
    color: '#999',
    fontSize: '13px'
  },
  tags: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  blogActions: {
    display: 'flex',
    gap: '10px'
  },
  editButton: {
    flex: 1,
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};

export default BlogManagement;

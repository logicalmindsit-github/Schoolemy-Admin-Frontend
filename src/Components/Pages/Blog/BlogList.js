import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedBlogs, getImageUrl } from '../../../Utils/blogApi.js';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPublishedBlogs();
      setBlogs(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))];

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || blog.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Our Blog</h1>
        <p style={styles.heroSubtitle}>
          Discover insights, tutorials, and updates
        </p>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {allTags.length > 0 && (
          <div style={styles.tagFilter}>
            <button
              onClick={() => setSelectedTag('')}
              style={{
                ...styles.tagButton,
                background: !selectedTag ? '#667eea' : '#e5e7eb',
                color: !selectedTag ? 'white' : '#333'
              }}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  ...styles.tagButton,
                  background: selectedTag === tag ? '#667eea' : '#e5e7eb',
                  color: selectedTag === tag ? 'white' : '#333'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div style={styles.errorBox}>
          {error}
          <button onClick={fetchBlogs} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading blogs...</div>
      ) : filteredBlogs.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No blogs found</h3>
          <p>
            {searchTerm || selectedTag
              ? 'Try adjusting your filters'
              : 'Check back soon for new content!'}
          </p>
        </div>
      ) : (
        <div style={styles.blogGrid}>
          {filteredBlogs.map((blog) => (
            <article
              key={blog._id}
              style={styles.blogCard}
              onClick={() => navigate(`/blogs/${blog._id}`)}
            >
              {blog.image && (
                <div style={styles.imageContainer}>
                  <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    style={styles.image}
                  />
                </div>
              )}

              <div style={styles.cardContent}>
                <div style={styles.meta}>
                  <span style={styles.author}>By {blog.author}</span>
                  <span style={styles.date}>{formatDate(blog.createdAt)}</span>
                </div>

                <h2 style={styles.cardTitle}>{blog.title}</h2>
                <p style={styles.cardExcerpt}>{blog.excerpt}</p>

                {blog.tags && blog.tags.length > 0 && (
                  <div style={styles.tags}>
                    {blog.tags.map((tag, index) => (
                      <span key={index} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button style={styles.readMore}>
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {filteredBlogs.length > 0 && (
        <div style={styles.resultsInfo}>
          Showing {filteredBlogs.length} of {blogs.length} blogs
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5'
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center'
  },
  heroTitle: {
    margin: '0 0 15px 0',
    fontSize: '48px',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    margin: 0,
    fontSize: '20px',
    opacity: 0.9
  },
  filters: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  searchInput: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  tagFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  tagButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  },
  errorBox: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    padding: '0 20px'
  },
  retryButton: {
    marginLeft: '15px',
    padding: '8px 16px',
    background: '#c33',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#666'
  },
  emptyState: {
    maxWidth: '600px',
    margin: '60px auto',
    padding: '40px',
    background: 'white',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  blogGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px'
  },
  blogCard: {
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
    }
  },
  imageContainer: {
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    background: '#e5e7eb'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s'
  },
  cardContent: {
    padding: '25px'
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '13px',
    color: '#888'
  },
  author: {
    fontWeight: '600'
  },
  date: {},
  cardTitle: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    color: '#333',
    lineHeight: '1.3'
  },
  cardExcerpt: {
    margin: '0 0 15px 0',
    color: '#666',
    fontSize: '15px',
    lineHeight: '1.6'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px'
  },
  tag: {
    padding: '5px 12px',
    background: '#e5e7eb',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#555',
    fontWeight: '500'
  },
  readMore: {
    padding: '10px 20px',
    background: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  resultsInfo: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  }
};

export default BlogList;

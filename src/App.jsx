import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [noResults, setNoResults] = useState(false);
  
  const UNSPLASH_ACCESS_KEY = 'k9WUc3w5spMI0t154qEuXXzgMm5xl6V28zdUd82XoZ0';
  const PER_PAGE = 8;

  const fetchImages = async (searchQuery, pageNum = 1, isLoadMore = false) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setNoResults(false);
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&page=${pageNum}&per_page=${PER_PAGE}`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      
      const data = await response.json();
      // console.log("data:",data)
      if (data.results.length === 0 && pageNum === 1) {
        setNoResults(true);
        setImages([]);
      } else {
        if (isLoadMore) {
          setImages(prevImages => [...prevImages, ...data.results]);
        } else {
          console.log("acction")
          setImages(data.results);
        }
      }
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages(query);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(query, nextPage, true);
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Unsplash</h1>
        <form onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for images"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </header>

      <main>
        {noResults && (
          <div className="no-results">
            <p>No images found from this keyword "{query}"</p>
          </div>
        )}

        {images.length > 0 && (
          <div className="image-grid">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="image-card"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image.urls.small} 
                  alt={image.alt_description || 'Unsplash image'} 
                />
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="load-more-container">
            <button 
              className="load-more-btn" 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="lightbox-overlay">
          <div className="lightbox-container">
            <button className="close-btn" onClick={closeLightbox}>
              ✕
            </button>
            <img 
              src={selectedImage.urls.regular} 
              alt={selectedImage.alt_description || 'Unsplash image'} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
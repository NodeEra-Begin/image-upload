"use client";

import React, { useState, useEffect } from 'react';

interface ImageInfo {
  name: string;
  url: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/images');
        
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        
        const data = await response.json();
        setImages(data.images.map((img: ImageInfo) => ({
          ...img,
          url: `http://localhost:5000${img.url}`
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Function to refresh the gallery
  const refreshGallery = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/images');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setImages(data.images.map((img: ImageInfo) => ({
        ...img,
        url: `http://localhost:5000${img.url}`
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
        <div className="text-center py-8">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md">
          Error: {error}
          <button 
            onClick={refreshGallery}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Image Gallery</h2>
        <button 
          onClick={refreshGallery}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Refresh Gallery
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No images uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border rounded-md overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={image.url} 
                  alt={image.name} 
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="p-2 bg-gray-50">
                <p className="text-sm text-gray-700 truncate" title={image.name}>
                  {image.name}
                </p>
                <a 
                  href={image.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View full size
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
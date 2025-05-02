"use client";

import React, { useState, useRef } from 'react';

interface UploadedImage {
  filePath: string;
  originalName: string;
  size: number;
}

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (jpeg, jpg, png, gif, webp)');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      setUploadedImage({
        filePath: `http://localhost:5000${data.filePath}`,
        originalName: data.originalName,
        size: data.size,
      });
      
      // Reset the form
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Image Upload</h2>
      
      {/* File input */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select an image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Preview section */}
      {preview && (
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Preview:</p>
          <div className="relative h-48 w-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="rounded-md h-full max-w-full object-contain mx-auto"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {selectedFile?.name} ({Math.round(selectedFile?.size / 1024)} KB)
          </p>
        </div>
      )}
      
      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          !selectedFile || isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Uploaded image details */}
      {uploadedImage && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">Upload Successful!</h3>
          <div className="relative h-48 w-full mb-2">
            <img 
              src={uploadedImage.filePath} 
              alt="Uploaded" 
              className="rounded-md h-full max-w-full object-contain mx-auto"
            />
          </div>
          <p className="text-sm text-green-700">
            File: {uploadedImage.originalName}
          </p>
          <p className="text-sm text-green-700">
            Size: {Math.round(uploadedImage.size / 1024)} KB
          </p>
          <p className="text-sm text-green-700">
            URL: <a href={uploadedImage.filePath} target="_blank" rel="noopener noreferrer" className="underline">
              {uploadedImage.filePath}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
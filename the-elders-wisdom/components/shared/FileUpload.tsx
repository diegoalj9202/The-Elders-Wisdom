'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Music, Video, FileText, Loader } from 'lucide-react';
import { uploadFile } from '@/lib/firebase/operations';

interface FileUploadProps {
  accept: string;
  maxSize: number; // in MB
  onUpload: (url: string) => void;
  currentFile?: string;
  label: string;
  type: 'image' | 'audio' | 'video' | 'document';
  storagePath: string;
}

export default function FileUpload({
  accept,
  maxSize,
  onUpload,
  currentFile,
  label,
  type,
  storagePath
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8" />;
      case 'audio':
        return <Music className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      default:
        return <FileText className="w-8 h-8" />;
    }
  };

  const handleFile = async (file: File) => {
    setError('');
    
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim().replace('.', ''));
    if (!acceptedExtensions.includes(fileExtension || '')) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadFile(
        file,
        `${storagePath}/${Date.now()}-${file.name}`,
        (prog) => setProgress(prog)
      );
      onUpload(url);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeFile = () => {
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-parchment font-semibold mb-2">{label}</label>

      {!currentFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-gold bg-gold/10'
              : 'border-leather hover:border-gold'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-4">
              <Loader className="w-12 h-12 text-gold mx-auto animate-spin" />
              <p className="text-gold font-semibold">Uploading... {Math.round(progress)}%</p>
              <div className="progress-bar max-w-xs mx-auto">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <div className="text-gold mb-4">{getIcon()}</div>
              <p className="text-parchment mb-2">
                Drag & drop your file here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gold hover:text-gold-bright underline font-semibold"
                  type="button"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-parchment-aged">
                Accepted: {accept} (Max {maxSize}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative card">
          {type === 'image' && (
            <img
              src={currentFile}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
          )}
          {type === 'audio' && (
            <audio src={currentFile} controls className="w-full mb-3" />
          )}
          {type === 'video' && (
            <video src={currentFile} controls className="w-full h-64 rounded-lg mb-3" />
          )}

          <button
            onClick={removeFile}
            className="absolute top-2 right-2 p-2 bg-burgundy hover:bg-burgundy-light rounded-full text-parchment transition-colors"
            title="Remove file"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-sm text-parchment-aged break-all">
            {currentFile.split('/').pop()?.split('?')[0].substring(0, 50)}...
          </div>
        </div>
      )}

      {error && (
        <div className="text-amber text-sm p-2 parchment-bg rounded border border-amber">
          {error}
        </div>
      )}
    </div>
  );
}

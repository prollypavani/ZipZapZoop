'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  return (
    <div 
      {...getRootProps()} 
      className={`nb-card w-full p-10 text-center cursor-pointer transition-all duration-300 ${
        dragActive 
          ? 'bg-secondary/30 border-secondary scale-105 shadow-[10px_10px_0_0_rgba(0,0,0,0.2)]' 
          : 'hover:shadow-[10px_10px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-1'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-2xl border-[3px] border-primary bg-primary/10 transition-all duration-300 ${
          dragActive ? 'animate-bounce-soft scale-110' : ''
        }`}>
          <FiUpload className={`w-8 h-8 text-primary transition-transform duration-300 ${
            dragActive ? 'scale-125' : ''
          }`} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-bold text-foreground">
            {dragActive ? 'Drop it here! ' : '📁 Drag & drop a file here'}
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            or click to browse your files
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="inline-block px-2 py-1 bg-yellow/20 border-2 border-yellow/40 text-yellow-foreground rounded-lg text-xs font-semibold">
            Any file type
          </span>
          <span className="inline-block px-2 py-1 bg-success/20 border-2 border-success/40 text-success-foreground rounded-lg text-xs font-semibold">
            Secure transfer
          </span>
        </div>
      </div>
    </div>
  );
}
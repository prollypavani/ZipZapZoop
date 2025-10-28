'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import InviteCode from '@/components/InviteCode';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [port, setPort] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPort(response.data.port);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDownload = async (port: number) => {
    setIsDownloading(true);
    
    try {
      const response = await axios.get(`/api/download/${port}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const headers = response.headers;
      let contentDisposition = '';

      for (const key in headers) {
        if (key.toLowerCase() === 'content-disposition') {
          contentDisposition = headers[key];
          break;
        }
      }
      
      let filename = 'downloaded-file';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please check the invite code and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
          ZipZapZoop
        </h1>
        <p className="text-xl text-muted-foreground">Secure P2P File Sharing</p>
      </header>

      <div className="nb-card p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'download')}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Share a File</TabsTrigger>
            <TabsTrigger value="download">Receive a File</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            {uploadedFile && !isUploading && (
              <div className="mt-4 p-3 bg-secondary border-2 border-foreground/10 rounded-base">
                <p className="text-sm text-foreground">
                  Selected file: <span className="font-medium">{uploadedFile.name}</span> ({Math.round(uploadedFile.size / 1024)} KB)
                </p>
              </div>
            )}
            {isUploading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-muted-foreground">Uploading file...</p>
              </div>
            )}
            <InviteCode port={port} />
          </TabsContent>

          <TabsContent value="download">
            <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />
            {isDownloading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-muted-foreground">Downloading file...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
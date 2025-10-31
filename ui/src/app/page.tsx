'use client';
import { useState } from 'react';
import Image from 'next/image';
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
    <div className="container mx-auto -mt-40 max-w-4xl">
      <header className="text-center mb-12 animate-float">
        <div className="inline-block mb-4">
        </div>
        <div className="flex justify-center -mb-50">
          <Image
            src="/logo.png"
            alt="ZipZapZoop Logo"
            width={500} 
            height={75} 
            priority 
          />
        </div>
        <p className="text-xl text-muted-foreground font-medium">Secure P2P File Sharing </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="inline-block px-3 py-1 bg-secondary/30 border-2 border-secondary text-secondary-foreground rounded-full text-sm font-semibold">
            Fast
          </span>
          <span className="inline-block px-3 py-1 bg-primary/30 border-2 border-primary text-primary-foreground rounded-full text-sm font-semibold">
            Secure
          </span>
          <span className="inline-block px-3 py-1 bg-pink/30 border-2 border-pink text-pink-foreground rounded-full text-sm font-semibold">
            Easy
          </span>
        </div>
      </header>

      <div className="nb-card nb-card-hover p-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'download')}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Share a File</TabsTrigger>
            <TabsTrigger value="download">Receive a File</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            {uploadedFile && !isUploading && (
              <div className="mt-6 p-4 bg-secondary/20 border-[3px] border-secondary rounded-base shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(uploadedFile.size / 1024)} KB
                    </p>
                  </div>
                  <div className="text-2xl animate-bounce-soft">✓</div>
                </div>
              </div>
            )}
            {isUploading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                <p className="mt-3 text-muted-foreground font-semibold">Uploading file... </p>
              </div>
            )}
            <InviteCode port={port} />
          </TabsContent>

          <TabsContent value="download">
            <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />
            {isDownloading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                <p className="mt-3 text-muted-foreground font-semibold">Downloading file... </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
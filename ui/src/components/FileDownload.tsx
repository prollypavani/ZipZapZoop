'use client';

import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FileDownloadProps {
  onDownload: (port: number) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const port = parseInt(inviteCode.trim(), 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      setError('Please enter a valid port number (1-65535)');
      return;
    }
    
    try {
      await onDownload(port);
    } catch (err) {
      console.error("Download failed:", err);
      setError('Failed to download the file. Please check the invite code and try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="nb-card p-6 bg-gradient-to-br from-accent/10 to-pink/10">
        <div className="flex items-start gap-3">
          <div className="text-3xl animate-bounce-soft">📥</div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Receive a File</h3>
            <p className="text-sm text-muted-foreground font-medium">
              Enter the invite code shared with you to download the file securely! 
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="inviteCode" className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <span>🔑</span> Invite Code
          </label>
          <Input
            id="inviteCode"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter the invite code..."
            disabled={isDownloading}
            required
            className="text-base"
          />
          {error && (
            <p className="mt-2 text-sm text-destructive font-semibold flex items-center gap-1">
              {error}
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full text-base py-6" 
          disabled={isDownloading}
        >
          {isDownloading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Downloading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FiDownload className="w-5 h-5" />
              <span>Download File</span>
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
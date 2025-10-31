'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface InviteCodeProps {
  port: number | null;
}

export default function InviteCode({ port }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);
  
  if (!port) return null;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(port.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-success/20 to-secondary/20 border-[3px] border-success rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-bold text-success-foreground">File Ready to Share!</h3>
      </div>
      <p className="text-sm text-success-foreground/80 mb-4 font-medium">
        Share this invite code with anyone you want to share the file with:
      </p>
      
      <div className="flex items-stretch gap-0 mb-4">
        <div className="flex-1 bg-white p-4 border-[3px] border-r-0 border-foreground/30 rounded-l-xl font-mono text-2xl font-bold text-center text-foreground shadow-inner">
          {port}
        </div>
        <button
          onClick={copyToClipboard}
          className={`px-6 border-[3px] border-foreground/30 rounded-r-xl transition-all duration-200 font-bold ${
            copied 
              ? 'bg-success text-success-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.15)]' 
              : 'bg-primary text-primary-foreground hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]'
          }`}
          aria-label="Copy invite code"
        >
          {copied ? (
            <span className="flex items-center gap-2">
              <FiCheck className="w-5 h-5" />
              <span className="text-sm">Copied!</span>
            </span>
          ) : (
            <FiCopy className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg border-2 border-success/30">
        <span className="text-lg">💡</span>
        <p className="text-xs text-foreground/70 font-medium">
          This code will be valid as long as your file sharing session is active.
        </p>
      </div>
    </div>
  );
}
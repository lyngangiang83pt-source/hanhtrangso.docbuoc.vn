import React from 'react';
import { X, ExternalLink, QrCode, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function QRModal({ isOpen, onClose, title, method, url, qrText }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-800 relative">
        
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề Modal */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            {title || 'Quét Mã QR Hoặc Click Link'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dùng điện thoại quét mã QR hoặc mở đường liên kết để nộp bài
          </p>
        </div>

        {/* Khu vực Hiển thị Mã QR */}
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl mb-6 shadow-inner">
          <QRCodeSVG 
            value={url || 'https://padlet.com'} 
            size={180} 
            level="H" 
            includeMargin={true}
          />
          <span className="text-[10px] font-semibold text-slate-700 mt-2 uppercase tracking-widest">
            {method === 'padlet' ? 'Mã QR Padlet Nộp Bài' : method === 'zalo' ? 'Mã QR Zalo Nộp Bài' : 'Mã QR Google Drive'}
          </span>
        </div>

        {/* Link và nút bấm tương tác */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="truncate text-slate-300 mr-2 max-w-[240px] font-mono">
              {url}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors font-medium text-xs whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Mở Trang Nộp Bài Trực Tiếp</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

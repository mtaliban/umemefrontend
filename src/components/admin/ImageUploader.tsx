'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { adminUpload } from '@/lib/api';
import type { ImageField } from '@/lib/types';

interface ImageUploaderProps {
  value?: ImageField;
  onChange: (image: ImageField | undefined) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Upload Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [altEn, setAltEn] = useState(value?.alt?.en ?? '');
  const [altSw, setAltSw] = useState(value?.alt?.sw ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await adminUpload(fd);
      const image: ImageField = {
        url: result.url,
        alt: { en: altEn, sw: altSw },
        width: result.width,
        height: result.height,
        sizes: result.sizes,
      };
      onChange(image);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const updateAlt = (lang: 'en' | 'sw', val: string) => {
    if (lang === 'en') setAltEn(val);
    else setAltSw(val);
    if (value) {
      onChange({ ...value, alt: { en: lang === 'en' ? val : altEn, sw: lang === 'sw' ? val : altSw } });
    }
  };

  return (
    <div>
      {value?.url ? (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={value.url}
              alt={value.alt?.en ?? ''}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Alt (EN)</label>
              <input
                type="text"
                value={altEn}
                onChange={(e) => updateAlt('en', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                placeholder="Alt text in English"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Alt (SW)</label>
              <input
                type="text"
                value={altSw}
                onChange={(e) => updateAlt('sw', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                placeholder="Alt text in Kiswahili"
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            uploading ? 'border-primary/30 bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
          aria-label="Upload image"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          )}
          <p className="text-sm text-gray-500">
            {uploading ? 'Uploading...' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

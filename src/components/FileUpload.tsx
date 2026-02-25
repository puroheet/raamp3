import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { AppFile } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  onFileSelect: (files: AppFile[]) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: AppFile[] = acceptedFiles.map(file => ({
      id: uuidv4(),
      file: file,
      url: URL.createObjectURL(file),
    }));
    onFileSelect(newFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/wav': ['.wav'] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-celestial-blue bg-celestial-blue/10' : 'border-ghost-white/20 hover:border-celestial-blue'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-16 h-16 mx-auto text-ghost-white/50" />
      <p className="mt-4 text-lg font-bold">
        {isDragActive ? 'Drop the files here ...' : 'Drag & drop .WAV files here, or click to select'}
      </p>
      <p className="text-sm text-ghost-white/50">Batch export supported</p>
    </div>
  );
}

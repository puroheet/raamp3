import React, { useMemo, useRef, useEffect } from 'react';
import { Metadata } from '../types';
import { UploadCloud } from 'lucide-react';

interface MetadataEditorProps {
  metadata: Metadata;
  onMetadataChange: (newMetadata: Metadata) => void;
}

export default function MetadataEditor({ metadata, onMetadataChange }: MetadataEditorProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onMetadataChange({ ...metadata, [name]: value });
  };

  

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ghost-white/80 mb-1">Title</label>
        <input ref={titleInputRef} type="text" name="title" id="title" value={metadata.title} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
      </div>
      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-ghost-white/80 mb-1">Artist</label>
        <input type="text" name="artist" id="artist" value={metadata.artist} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
      </div>
      <div>
        <label htmlFor="album" className="block text-sm font-medium text-ghost-white/80 mb-1">Album</label>
        <input type="text" name="album" id="album" value={metadata.album} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-ghost-white/80 mb-1">Year</label>
          <input type="text" name="year" id="year" value={metadata.year} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
        </div>
        <div>
          <label htmlFor="track" className="block text-sm font-medium text-ghost-white/80 mb-1">Track</label>
          <input type="text" name="track" id="track" value={metadata.track} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
        </div>
      </div>
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-ghost-white/80 mb-1">Genre</label>
        <input type="text" name="genre" id="genre" value={metadata.genre} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
      </div>
      <div>
        <label htmlFor="composer" className="block text-sm font-medium text-ghost-white/80 mb-1">Composer</label>
        <input type="text" name="composer" id="composer" value={metadata.composer} onChange={handleChange} className="w-full bg-raisin-black/70 border border-ghost-white/20 rounded-md p-2 focus:ring-celestial-blue focus:border-celestial-blue" />
      </div>
    </div>
  );
}

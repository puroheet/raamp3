/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import jsmediatags from 'jsmediatags';
import FileUpload from './components/FileUpload';
import FileEditor from './components/FileEditor';
import BatchExportButton from './components/BatchExportButton';
import Card from './components/Card';
import { AppFile, Metadata } from './types';

const initialMetadata: Metadata = {
  title: '',
  artist: '',
  album: '',
  year: '',
  genre: '',
  track: '',
  composer: '',
};

export default function App() {
  const [wavFiles, setWavFiles] = useState<AppFile[]>([]);
  const [metadatas, setMetadatas] = useState<Record<string, Metadata>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newFiles = wavFiles.filter(f => !metadatas[f.id]);
    if (newFiles.length > 0) {
      newFiles.forEach(file => {
        jsmediatags.read(file.file, {
          onSuccess: (tag) => {
            const tags = tag.tags;
            setMetadatas(prev => ({ ...prev, [file.id]: {
              ...initialMetadata,
              title: tags.title || '',
              artist: tags.artist || '',
              album: tags.album || '',
              year: tags.year || '',
              genre: tags.genre || '',
              track: tags.track || '',
              composer: tags.composer || '',
              picture: tags.picture || null,
            }}));
          },
          onError: (error) => {
            console.log('Could not read metadata from WAV file, proceeding with empty fields.');
            setMetadatas(prev => ({ ...prev, [file.id]: initialMetadata }));
          }
        });
      });
    }
  }, [wavFiles]);

  const handleMetadataChange = (id: string, newMetadata: Metadata) => {
    setMetadatas(prev => ({ ...prev, [id]: newMetadata }));
  };

  const handleFileSelect = (newFiles: AppFile[]) => {
    setWavFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className="min-h-screen bg-raisin-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <img src="/logo.png" alt="Raamp3 Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-5xl font-display font-bold text-ghost-white">Raamp3</h1>
          <p className="text-celestial-blue mt-2">The ultimate WAV to MP3 converter.</p>
        </header>
        <main>
          <Card>
            {error && (
              <div className="bg-vermilion/20 border border-vermilion text-vermilion px-4 py-3 rounded-md mb-6" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            {wavFiles.length === 0 ? (
              <FileUpload onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-8">
                {wavFiles.map(file => (
                  <Card key={file.id}>
                    <FileEditor
                      file={file}
                      metadata={metadatas[file.id] || initialMetadata}
                      onMetadataChange={(newMetadata) => handleMetadataChange(file.id, newMetadata)}
                      onError={setError}
                    />
                  </Card>
                ))}
                <BatchExportButton files={wavFiles} metadatas={metadatas} onError={setError} />
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}

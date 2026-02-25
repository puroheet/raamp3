import { useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { AppFile, Metadata } from '../types';
import { loadFFmpeg, convertFile } from '../utils/ffmpeg';

interface BatchExportButtonProps {
  files: AppFile[];
  metadatas: Record<string, Metadata>;
  onError: (message: string) => void;
}

export default function BatchExportButton({ files, metadatas, onError }: BatchExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);

  const batchConvertToMp3 = async () => {
    setIsLoading(true);
    setProgress(0);
    setCurrentFile(0);

    try {
      const ffmpeg = await loadFFmpeg();
      const zip = new JSZip();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = metadatas[file.id];
        setCurrentFile(i + 1);
        
        const blob = await convertFile(ffmpeg, file, metadata, setProgress);
        zip.file(`${metadata.title || `track-${i+1}`}.mp3`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'raamp3_export.zip');

    } catch (error) {
      console.error('Error during conversion:', error);
      onError('An error occurred during the batch conversion. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 text-center">
      <button
        onClick={batchConvertToMp3}
        disabled={isLoading || files.length === 0}
        className="bg-mandarin text-raisin-black font-bold font-display py-3 px-8 rounded-full hover:bg-vermilion transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isLoading ? `Converting ${currentFile} of ${files.length}... ${progress}%` : `Export All (${files.length}) as .zip`}
      </button>
      {isLoading && (
        <div className="w-full bg-ghost-white/20 rounded-full h-2.5 mt-4">
          <div className="bg-celestial-blue h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}

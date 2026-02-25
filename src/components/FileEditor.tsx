import { useMemo, useState } from 'react';
import { AppFile, Metadata } from '../types';
import AudioPlayer from './AudioPlayer';
import MetadataEditor from './MetadataEditor';
import { UploadCloud, Download } from 'lucide-react';
import { loadFFmpeg, convertFile } from '../utils/ffmpeg';
import { saveAs } from 'file-saver';

interface FileEditorProps {
  file: AppFile;
  metadata: Metadata;
  onMetadataChange: (newMetadata: Metadata) => void;
  onError: (message: string) => void;
}

export default function FileEditor({ file, metadata, onMetadataChange, onError }: FileEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pictureFile = event.target.files?.[0];
    if (pictureFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          onMetadataChange({
            ...metadata,
            picture: { data: arrayBuffer, format: pictureFile.type },
          });
        }
      };
      reader.readAsArrayBuffer(pictureFile);
    }
  };

  const pictureUrl = useMemo(() => {
    if (metadata.picture?.data) {
      const blob = new Blob([metadata.picture.data], { type: metadata.picture.format });
      return URL.createObjectURL(blob);
    }
    return null;
  }, [metadata.picture]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveProgress(0);
    try {
      const ffmpeg = await loadFFmpeg();
      const blob = await convertFile(ffmpeg, file, metadata, setSaveProgress);
      saveAs(blob, `${metadata.title || 'output'}.mp3`);
    } catch (error) {
      console.error('Error during conversion:', error);
      onError('An error occurred during the MP3 conversion. Please check the console for details.');
    }
    finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1">
        <label htmlFor={`picture-upload-${file.id}`} className="cursor-pointer">
          <div className="aspect-square bg-raisin-black/70 border-2 border-dashed border-ghost-white/20 rounded-md flex items-center justify-center">
            {pictureUrl ? (
              <img src={pictureUrl} alt="Album Art" className="w-full h-full object-cover rounded-md" />
            ) : (
              <div className="text-center text-ghost-white/50">
                <UploadCloud className="w-12 h-12 mx-auto" />
                <p className="mt-2 text-sm">Upload Album Art</p>
              </div>
            )}
          </div>
        </label>
        <input type="file" id={`picture-upload-${file.id}`} accept="image/*" onChange={handlePictureChange} className="hidden" />
        <div className="mt-4">
          <AudioPlayer file={file} />
        </div>
      </div>
      <div className="md:col-span-2 flex flex-col">
        <div className="flex-grow">
          <MetadataEditor metadata={metadata} onMetadataChange={onMetadataChange} />
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center bg-celestial-blue/80 text-white font-bold py-2 px-4 rounded-full hover:bg-celestial-blue transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              `Saving... ${saveProgress}%`
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Save to Local</>
            )}
          </button>
          {isSaving && (
            <div className="w-full bg-ghost-white/20 rounded-full h-1.5 mt-2">
              <div className="bg-vermilion h-1.5 rounded-full" style={{ width: `${saveProgress}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

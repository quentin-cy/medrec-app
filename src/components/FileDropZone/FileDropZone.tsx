import { useRef, useState } from 'react';
import './FileDropZone.css';
import { UploadIcon } from '../common/icons/icons.tsx';

interface FileDropZoneProps {
  onFileSelected: (file: File) => void;
}

export function FileDropZone({ onFileSelected }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div
      className={`drop-zone ${isDragging ? 'drop-zone-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="drop-zone-input"
        onChange={handleChange}
      />
      <div className="drop-zone-content">
        <div className="drop-zone-icon">
          <UploadIcon />
        </div>
        <p className="drop-zone-text">
          <strong>Drop a JSON file here</strong> or click to browse
        </p>
        <p className="drop-zone-hint">Accepts .json medical record files</p>
      </div>
    </div>
  );
}



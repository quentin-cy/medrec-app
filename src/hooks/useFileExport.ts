import { useCallback } from 'react';
import { useMedRec } from '../context/MedRecContext';
import type { MedRecFile } from '../types/schema';
import { downloadJson } from '../lib/utils';

interface UseFileExportReturn {
  exportFile: () => void;
  canExport: boolean;
}

export function useFileExport(): UseFileExportReturn {
  const { animal, version, setVersion } = useMedRec();

  const exportFile = useCallback(() => {
    if (!animal) return;

    const newVersion = version + 1;

    const data: MedRecFile = {
      metadata: {
        version: newVersion,
        exportedAt: new Date().toISOString(),
      },
      animal,
    };
    const basename = animal.name
      ? `${animal.name.toLowerCase().replace(/\s+/g, '-')}-medrec`
      : 'animal-medrec';
    const filename = `${basename}_v${newVersion}.json`;

    downloadJson(data, filename);
    setVersion(newVersion);
  }, [animal, version, setVersion]);

  return {
    exportFile,
    canExport: animal !== null,
  };
}

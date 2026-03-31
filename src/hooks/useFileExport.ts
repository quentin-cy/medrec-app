import { useCallback } from 'react';
import { useMedRec } from '../context/MedRecContext';
import type { MedRecFile } from '../types/schema';
import { downloadJson } from '../lib/utils';

interface UseFileExportReturn {
  exportFile: () => void;
  canExport: boolean;
}

export function useFileExport(): UseFileExportReturn {
  const { animal } = useMedRec();

  const exportFile = useCallback(() => {
    if (!animal) return;

    const data: MedRecFile = { animal };
    const filename = animal.name
      ? `${animal.name.toLowerCase().replace(/\s+/g, '-')}-medrec.json`
      : 'animal-medrec.json';

    downloadJson(data, filename);
  }, [animal]);

  return {
    exportFile,
    canExport: animal !== null,
  };
}

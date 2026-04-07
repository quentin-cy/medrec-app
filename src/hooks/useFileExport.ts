import { useCallback, useContext } from 'react';
import type { MedRecFile } from '../types/schema';
import { downloadJson } from '../utils/utils';
import { MedRecContext } from '../context/MedRecContext.tsx';

interface UseFileExportReturn {
  exportFile: () => void;
  canExport: boolean;
}

export function useFileExport(): UseFileExportReturn {
  const { medicalRecord, recordVersion, setRecordVersion, medicalContext } = useContext(MedRecContext);

  const exportFile = useCallback(() => {
    if (!medicalRecord) return;

    const newVersion = recordVersion + 1;

    const data: MedRecFile = {
      metadata: {
        version: newVersion,
        exportedAt: new Date().toISOString(),
      },
      context: medicalContext,
      animal: medicalRecord,
    };
    const basename = medicalRecord.name
      ? `${medicalRecord.name.toLowerCase().replace(/\s+/g, '-')}-medrec`
      : 'animal-medrec';
    const filename = `${basename}_v${newVersion}.json`;

    downloadJson(data, filename);
    setRecordVersion(newVersion);
  }, [medicalRecord, recordVersion, setRecordVersion, medicalContext]);

  return {
    exportFile,
    canExport: medicalRecord !== null,
  };
}

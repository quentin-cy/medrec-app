import { useCallback } from 'react';
import { MedRecFileSchema } from '../types/schema';
import type { MedRecFile } from '../types/schema';

interface UseFileImportReturn {
  importFile: (file: File) => Promise<MedRecFile>;
  importFromDrop: (e: React.DragEvent) => Promise<MedRecFile>;
}

export function useFileImport(): UseFileImportReturn {
  const readFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const importFile = useCallback(
    async (file: File): Promise<MedRecFile> => {
      if (!file.name.endsWith('.json')) {
        throw new Error('File must be a .json file');
      }

      const text = await readFile(file);

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error('File contains invalid JSON');
      }

      const result = MedRecFileSchema.safeParse(parsed);
      if (!result.success) {
        const issues = result.error.issues
          .map(i => `${i.path.join('.')}: ${i.message}`)
          .join('; ');
        throw new Error(`Invalid medical record format: ${issues}`);
      }

      return result.data;
    },
    [readFile],
  );

  const importFromDrop = useCallback(
    async (e: React.DragEvent): Promise<MedRecFile> => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) {
        throw new Error('No file dropped');
      }
      return importFile(file);
    },
    [importFile],
  );

  return { importFile, importFromDrop };
}

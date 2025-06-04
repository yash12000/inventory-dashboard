import { useState } from 'react';
import { useInventoryStore } from '@/lib/store';
import { processExcelData } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const setData = useInventoryStore((state) => state.setData);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const data = await processExcelData(file);
      setData(data);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={isLoading}
        className="max-w-sm"
      />
      {isLoading && <span>Processing...</span>}
    </div>
  );
} 
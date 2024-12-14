import { utils, writeFile } from 'xlsx';
import type { Action } from '../types/action';

export const exportToExcel = async (data: any[], filename: string): Promise<boolean> => {
  try {
    // Create worksheet
    const ws = utils.json_to_sheet(data);

    // Create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');

    // Auto-size columns
    const maxWidth = 50;
    const wsColWidths = data.reduce((acc: { [key: string]: number }, row) => {
      Object.entries(row).forEach(([key, value], i) => {
        const width = Math.min(maxWidth, Math.max(String(key).length, String(value).length) + 2);
        acc[utils.encode_col(i)] = Math.max(acc[utils.encode_col(i)] || 0, width);
      });
      return acc;
    }, {});

    ws['!cols'] = Object.entries(wsColWidths).map(([, width]) => ({ width }));

    // Write file
    writeFile(wb, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

export const formatExcelDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES');
};

export const parseExcelDate = (date: string | number): string => {
  // Handle Excel serial date numbers
  if (typeof date === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const resultDate = new Date(excelEpoch.getTime() + (date * 24 * 60 * 60 * 1000));
    return resultDate.toISOString().split('T')[0];
  }
  
  // Handle string dates
  return new Date(date).toISOString().split('T')[0];
};
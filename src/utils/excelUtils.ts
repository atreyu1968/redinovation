// Simple CSV handling without external dependencies
export const exportToExcel = async (data: any[], filename: string): Promise<boolean> => {
  try {
    // Convert data to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(key => {
          const value = row[key];
          // Handle values that may contain commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

export const importFromExcel = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const [headers, ...rows] = text.split('\n').filter(row => row.trim());
        const data = rows.map(row => {
          const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split on commas not in quotes
          return headers.split(',').reduce((obj, header, index) => {
            const value = values[index]?.trim().replace(/^"|"$/g, ''); // Remove quotes
            obj[header.trim()] = value;
            return obj;
          }, {} as any);
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
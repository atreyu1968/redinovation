// Simple chart utilities without external dependencies
export const copyChartToClipboard = async (elementId: string): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return false;

    // Create canvas from element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Set canvas dimensions
    canvas.width = element.clientWidth * 2;
    canvas.height = element.clientHeight * 2;
    ctx.scale(2, 2);

    // Draw element to canvas
    ctx.drawImage(element, 0, 0);

    // Convert to blob and copy
    const blob = await new Promise<Blob | null>(resolve => 
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    
    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);

    return true;
  } catch (error) {
    console.error('Error copying chart:', error);
    return false;
  }
};

export const optimizeChartForExport = (element: HTMLElement) => {
  // Add white background
  element.style.backgroundColor = '#ffffff';
  
  // Add padding
  element.style.padding = '20px';
  
  // Increase font sizes
  const texts = element.getElementsByTagName('text');
  for (let text of texts) {
    const currentSize = parseInt(text.style.fontSize || '12');
    text.style.fontSize = `${currentSize * 1.2}px`;
  }

  // Return cleanup function
  return () => {
    element.style.backgroundColor = '';
    element.style.padding = '';
    for (let text of texts) {
      text.style.fontSize = '';
    }
  };
};
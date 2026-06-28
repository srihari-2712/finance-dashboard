import html2canvas from 'html2canvas';

export async function exportChartPng(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#131c2e',
    scale: 2,
    useCORS: true,
  });
  const link = document.createElement('a');
  link.download = `${filename.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Function to download the SVG
export default function downloadSVG(svgContainer) {
  const svgElement = svgContainer;
  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(svgElement)], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'heatmap.svg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

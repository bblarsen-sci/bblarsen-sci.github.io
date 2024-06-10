
import html2canvas from 'html2canvas';
import * as d3 from 'd3';

export default async function downloadImage(svgContainer) {
  try {
    const plotContainer = d3.select(svgContainer);

    if (!plotContainer) {
      console.error('SVG element not found');
      return;
    }

    const svgString = plotContainer.node().outerHTML;

    // Create a temporary container for the SVG
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = svgString;

    // Ensure the temporary container is visible and has dimensions
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-5000px';
    tempContainer.style.left = '0';
    tempContainer.style.width = '100%';
    tempContainer.style.height = '100%';
    tempContainer.style.zIndex = '-1';

    document.body.appendChild(tempContainer);

    // Render the temporary container as a canvas element
    const canvas = await html2canvas(tempContainer, {
      useCORS: true,
      logging: true,
      scale: 6, // Increase the scale for higher resolution
    });

    // Remove the temporary container
    document.body.removeChild(tempContainer);

    // Convert the canvas to a blob
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

    // Create a link to download the image
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'heatmap.png';
    link.click();

    // Remove the link
    link.remove();
  } catch (error) {
    console.error('Error downloading image:', error);
  }
}

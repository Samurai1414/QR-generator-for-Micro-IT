import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import LottieHeader from './LottieHeader'; // Import LottieHeader

function App() {
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = () => {
    const qrContainer = document.getElementById('qr-container');
    if (!qrContainer) {
      console.error('QR container not found');
      alert('Error: QR code container element not found.');
      return;
    }

    const svgElement = qrContainer.querySelector('svg');
    if (!svgElement) {
      console.error('SVG QR code element not found within qr-container');
      alert('Error: SVG QR code element not found. Cannot download.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      alert('Error: Could not prepare image for download.');
      return;
    }

    const img = new Image();

    img.onload = () => {
      const svgClientWidth = svgElement.clientWidth || 256;
      const svgClientHeight = svgElement.clientHeight || 256;

      canvas.width = svgClientWidth;
      canvas.height = svgClientHeight;
      ctx.drawImage(img, 0, 0, svgClientWidth, svgClientHeight);

      if (logo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = canvas.width * 0.20; // Logo size as 20% of QR code width
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;

          // Optional: Add a small white padding around the logo for better visibility if QR bg is dark
          ctx.fillStyle = bgColor; // Use QR background color, or 'white'
          ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8); // Small padding

          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          
          triggerDownload(canvas);
        };
        logoImg.onerror = () => {
          console.error("Error loading logo for QR download. Downloading QR without logo.");
          alert("Error loading logo. Downloading QR code without it.");
          triggerDownload(canvas); // Fallback to download without logo
        };
        logoImg.src = logo;
      } else {
        triggerDownload(canvas);
      }
    };

    img.onerror = () => {
      console.error("Error loading SVG QR code into image for download.");
      alert("Error: Could not load QR code image for download.");
    };
    
    // Encode SVG data properly for use in img.src
    const wellFormedSvgData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    img.src = wellFormedSvgData;
  };

  const triggerDownload = (canvas: HTMLCanvasElement) => {
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link); // Append to body for Firefox compatibility
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-center items-center">
      <LottieHeader />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8"> {/* Increased padding and shadow */}
        <div className="grid md:grid-cols-2 gap-10"> {/* Increased gap */}
          {/* Controls */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Your QR Code</h2> {/* Larger title */}
            <input
              type="text"
              placeholder="Enter URL or Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Foreground</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium text-gray-700">Upload Logo (Optional)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <button
              onClick={downloadQRCode}
              disabled={!text}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download QR Code
            </button>
          </div>

          {/* QR Display */}
          <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-200">
            {text ? (
              <div className="relative" id="qr-container">
                <QRCodeSVG
                  value={text}
                  size={256}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H" // High error correction level for logo robustness
                  includeMargin={true}
                />
                {logo && (
                  <img
                    src={logo}
                    alt="logo"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md" // Or rounded-full
                    style={{
                      width: '20%', // Logo size relative to QR code (20% of 256px ~ 51px)
                      height: '20%',
                      // Consider adding a small border or background to the logo img itself if needed
                      // border: `2px solid ${bgColor}`, // Example border matching background
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="w-[256px] h-[256px] flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code mb-2 text-gray-300"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16h.01"/><path d="M16 12h.01"/><path d="M21 12h.01"/></svg>
                <span>Enter text or URL to generate your QR code.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

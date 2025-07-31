import React, { useState, useEffect } from 'react';
import { QrCode, Download, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface QrCodeDisplayProps {
  orderId: string;
  onClose: () => void;
  apiBaseUrl: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ orderId, onClose, apiBaseUrl }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Generate QR code URL that points to the purchase details
        const purchaseUrl = `${apiBaseUrl}/purchases/${orderId}`;
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(purchaseUrl)}`);
      } catch (err) {
        setError('Failed to generate QR code');
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();
  }, [orderId, apiBaseUrl]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Your QR Code</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-gray-600">Generating QR code...</p>
              </div>
            </div>
          )}

          {error && (
            <ErrorMessage 
              message={error} 
              className="mb-4"
            />
          )}

          {qrCodeUrl && !loading && (
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto border-2 border-white shadow-lg rounded-lg"
                />
              </div>
              
              <p className="text-gray-600 text-sm mb-6">
                Scan this QR code to access your purchase details
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
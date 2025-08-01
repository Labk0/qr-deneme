import React, { useState, useEffect } from 'react';
import { QrCode, Download, X } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useApi } from '../hooks/useApi';

interface QrCodeDisplayProps {
  orderId: string;
  onClose: () => void;
  apiBaseUrl: string;
}

interface QrCodeResponse {
  qr_code_url: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ orderId, onClose, apiBaseUrl }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { fetchData, loading, error } = useApi();

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetchData<QrCodeResponse>(`${apiBaseUrl}/api/purchases/${orderId}/qrcode`);

      if (response?.qr_code_url) {
        setQrCodeUrl(response.qr_code_url);
      }
    };

    if (orderId) {
      fetchQrCode();
    }
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
              <h2 className="text-xl font-semibold text-gray-900">QR Kodun</h2>
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
                <p className="text-gray-600">QR kod oluşturuluyor...</p>
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
                Sipariş detaylarına ulaşmak için bu QR kodu tarayın veya indirin.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  İndir
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
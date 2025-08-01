import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, DollarSign, QrCode } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useApi } from '../hooks/useApi';

interface PurchaseDetailProps {
  apiBaseUrl: string;
}

interface Purchase {
  id: number;
  transaction_id: string;
  product_id: number;
  price: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
}

interface QrCodeResponse {
  qr_code_url: string;
}

export const PurchaseDetail: React.FC<PurchaseDetailProps> = ({ apiBaseUrl }) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { fetchData, loading, error } = useApi();

  useEffect(() => {
    const fetchPurchaseDetail = async () => {
      if (!transactionId) return;

      // Önce sipariş detaylarını al
      const purchaseResponse = await fetchData<Purchase>(`${apiBaseUrl}/api/purchases/${transactionId}`);
      
      if (purchaseResponse) {
        setPurchase(purchaseResponse);
        
        // Sonra QR kodu al
        const qrResponse = await fetchData<QrCodeResponse>(`${apiBaseUrl}/api/purchases/${transactionId}/qrcode`);
        if (qrResponse?.qr_code_url) {
          setQrCodeUrl(qrResponse.qr_code_url);
        }
      }
    };

    fetchPurchaseDetail();
  }, [transactionId, apiBaseUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Sipariş detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <ErrorMessage message={error} />
          <Link
            to="/"
            className="block w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Sipariş bulunamadı.</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Detayları</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Transaction ID */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">İşlem Numarası</h2>
              <p className="text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                {purchase.transaction_id}
              </p>
            </div>

            {/* Product Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Bilgileri</h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {purchase.product.imageUrl ? (
                  <img
                    src={purchase.product.imageUrl}
                    alt={purchase.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{purchase.product.name}</h3>
                  <p className="text-gray-600">{purchase.product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${purchase.price}</p>
                </div>

              </div>
            </div>

            {/* Purchase Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Sipariş Tarihi</p>
                    <p className="font-medium text-gray-900">
                      {new Date(purchase.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Toplam Tutar</p>
                    <p className="font-medium text-gray-900">${purchase.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Kod
                </h2>
                <div className="text-center bg-gray-50 rounded-lg p-6">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto border-2 border-white shadow-lg rounded-lg"
                  />
                  <p className="text-gray-600 text-sm mt-4">
                    Bu QR kodu ile sipariş detaylarına hızlıca ulaşabilirsiniz.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
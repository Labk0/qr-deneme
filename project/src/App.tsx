import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from './types';
import { PriceList } from './components/PriceList';
import { QrCodeDisplay } from './components/QrCodeDisplay';
import { SuccessMessage } from './components/SuccessMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { PurchaseDetail } from './components/PurchaseDetail';
import { useApi } from './hooks/useApi';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { fetchData, loading, error } = useApi();

  const API_BASE_URL = 'http://product-api.test';

  const fetchProducts = async () => {
    const response = await fetchData<{ data: Product[] }>(API_BASE_URL + '/api/products');
    if (response && response.data) {
      setProducts(response.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePurchaseSuccess = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSuccessMessage('Satın alma işlemi başarıyla tamamlandı!');
    setErrorMessage(null);
  };

  const handlePurchaseError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage(null);
  };

  const handleCloseQrCode = () => {
    setSelectedOrderId(null);
  };

  const dismissSuccess = () => {
    setSuccessMessage(null);
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Ürün Mağazası</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ürünlerimizi inceleyin ve anında satın alın. Her başarılı işlem sonrası QR kodlu fişinizi alın!
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-6 space-y-4">
          {successMessage && (
            <SuccessMessage
              message={successMessage}
              onDismiss={dismissSuccess}
            />
          )}
          {errorMessage && (
            <ErrorMessage
              message={errorMessage}
              onDismiss={dismissError}
            />
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <PriceList
            products={products}
            loading={loading}
            error={error}
            onRetry={fetchProducts}
            onPurchaseSuccess={handlePurchaseSuccess}
            onPurchaseError={handlePurchaseError}
            apiBaseUrl={API_BASE_URL}
          />
        </div>

        {selectedOrderId && (
          <QrCodeDisplay
            orderId={selectedOrderId}
            onClose={handleCloseQrCode}
            apiBaseUrl={API_BASE_URL}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const API_BASE_URL = 'http://product-api.test';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/purchases/:transactionId" element={<PurchaseDetail apiBaseUrl={API_BASE_URL} />} />
      </Routes>
    </Router>
  );
}

export default App;
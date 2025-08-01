import React from 'react';
import { Product } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import {ProductListItem} from "./ProductListItem.tsx";

interface PriceListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPurchaseSuccess: (orderId: string) => void;
  onPurchaseError: (error: string) => void;
  apiBaseUrl: string;
}

export const PriceList: React.FC<PriceListProps> = ({
  products,
  loading,
  error,
  onRetry,
  onPurchaseSuccess,
  onPurchaseError,
  apiBaseUrl
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Ürünler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <ErrorMessage message={error} />
        <button
          onClick={onRetry}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Bir ürün bulunamadı.</p>
      </div>
    );
  }

  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/*
        Her bir elemanın arasına bir çizgi koymak için `divide-y` kullanıyoruz.
      */}
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
              <ProductListItem
                  key={product.id}
                  product={product}
                  onPurchaseSuccess={onPurchaseSuccess}
                  onPurchaseError={onPurchaseError}
                  apiBaseUrl={apiBaseUrl}
              />
          ))}
        </div>
      </div>
  );
};
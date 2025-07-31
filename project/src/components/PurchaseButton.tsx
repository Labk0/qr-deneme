import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { PurchaseResponse } from '../types';

interface PurchaseButtonProps {
  productId: string;
  onPurchaseSuccess: (orderId: string) => void;
  onPurchaseError: (error: string) => void;
  disabled?: boolean;
  apiBaseUrl: string;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  productId,
  onPurchaseSuccess,
  onPurchaseError,
  disabled = false,
  apiBaseUrl
}) => {
  const [purchased, setPurchased] = useState(false);
  const { fetchData, loading } = useApi();

  const handlePurchase = async () => {
    const response = await fetchData<PurchaseResponse>(apiBaseUrl + '/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });

    if (response?.data) {
      setPurchased(true);
      onPurchaseSuccess(response.data.transaction_id);
      
      // Reset purchased state after animation
      setTimeout(() => setPurchased(false), 2000);
    } else {
      onPurchaseError('Purchase failed');
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={disabled || loading || purchased}
      className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
        purchased
          ? 'bg-green-500 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          Processing...
        </>
      ) : purchased ? (
        <>
          <Check className="w-4 h-4" />
          Purchased!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Purchase
        </>
      )}
    </button>
  );
};
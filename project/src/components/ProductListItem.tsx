// src/components/ProductListItem.tsx

import React from 'react';
import { Product } from '../types';
import { PurchaseButton } from './PurchaseButton';
import { Package } from 'lucide-react'; // Resim olmadığında göstereceğimiz ikon

interface ProductListItemProps {
    product: Product;
    onPurchaseSuccess: (orderId: string) => void;
    onPurchaseError: (error: string) => void;
    apiBaseUrl: string;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
                                                                    product,
                                                                    onPurchaseSuccess,
                                                                    onPurchaseError,
                                                                    apiBaseUrl,
                                                                }) => {
    return (
        // Her bir satır için ana kapsayıcı
        <div className="flex items-center gap-4 p-4">
            {/* Sol Taraf: Resim veya Varsayılan İkon */}
            <div className="flex-shrink-0">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Orta Kısım: Ürün Adı, Açıklama ve Fiyat */}
            <div className="flex-1 min-w-0">
                <p className="text-md font-semibold text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-500 truncate">
                    {product.description || 'Açılama bulunamadı.'}
                </p>
                <p className="text-md font-bold text-blue-600 mt-1">${product.price}</p>
            </div>

            {/* Sağ Taraf: Satın Alma Butonu */}
            <div className="w-40 flex-shrink-0">
                <PurchaseButton
                    productId={product.id}
                    onPurchaseSuccess={onPurchaseSuccess}
                    onPurchaseError={onPurchaseError}
                    apiBaseUrl={apiBaseUrl}
                />
            </div>
        </div>
    );
};
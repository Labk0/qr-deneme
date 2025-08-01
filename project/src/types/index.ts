export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string; // Bu alan opsiyonel olabilir
  imageUrl?: string;    // Bu alan da opsiyonel olabilir
}

// PurchaseResponse arayüzü aynı kalabilir, o doğru görünüyor.
export interface PurchaseResponse {
  data?: {
    id: number;
    transaction_id: string;
    product_id: number;
    price: number;
    created_at: string;
    updated_at: string;
  };
}

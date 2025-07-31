export interface Product {
  id: string;
  name: string;
  price: number;
}

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


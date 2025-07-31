<?php

namespace App\Services;

use App\Models\Purchase;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PurchaseService {
    /**
     * Get all products.
     *
     * @return LengthAwarePaginator
     */
    public function getAllProducts(): LengthAwarePaginator
    {
        return Purchase::latest()->paginate(10);
    }

    /**
     * Get a product by ID.
     *
     * @param int $id
     * @return Purchase
     */
    public function getPurchaseById(int $id): Purchase
    {
        return Purchase::find($id);
    }

    /**
     * Create a new purchase.
     *
     * @param array $validatedData
     */
    public function createPurchase(array $validatedData)
    {
        // Get the product to get its price
        $product = Product::find($validatedData['product_id']);
        
        // Generate a unique transaction ID
        $transactionId = 'TXN_' . uniqid() . '_' . time();
        
        return Purchase::create([
            'product_id' => $validatedData['product_id'],
            'price' => $product->price,
            'transaction_id' => $transactionId,
        ]);
    }

    /**
     * Update an existing product.
     *
     * @param array $validatedData
     * @param Purchase $purchase
     * @return Purchase
     */
    public function updateProduct(array $validatedData, Purchase $purchase): Purchase
    {
        $purchase->update($validatedData);
        return $purchase;
    }

    /**
     * Delete a product.
     *
     * @param int $id
     * @return bool
     */
    public function deletePurchase(int $id): bool
    {
        return Purchase::destroy($id) > 0;
    }
}

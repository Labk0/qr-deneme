<?php

namespace App\Services;

use App\Models\Purchase;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
        $product = Product::find($validatedData['product_id']);
        $transactionId = 'TXN_' . uniqid() . '_' . time();

        $purchaseDetailUrl = env('FRONTEND_URL') . '/purchases/' . $transactionId;

        $qrCodeImage = QrCode::format('svg')
            ->size(256)
            ->generate($purchaseDetailUrl);

        $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCodeImage);

        $purchase = Purchase::create([
            'product_id' => $validatedData['product_id'],
            'price' => $product->price,
            'transaction_id' => $transactionId,
        ]);

        return [
            'purchase' => $purchase,
            'qr_code_url' => $qrCodeBase64,
        ];
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

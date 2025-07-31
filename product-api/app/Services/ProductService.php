<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService {
    /**
     * Get all products.
     *
     * @return LengthAwarePaginator
     */
    public function getAllProducts(): LengthAwarePaginator
    {
        return Product::latest()->paginate(10);
    }

    /**
     * Get a product by ID.
     *
     * @param int $id
     * @return Product
     */
    public function getProductById(int $id): Product
    {
        return Product::find($id);
    }

    /**
     * Create a new product.
     *
     * @param array $validatedData
     */
    public function createProduct(array $validatedData)
    {
        return Product::create($validatedData);
    }

    /**
     * Update an existing product.
     *
     * @param array $validatedData
     * @param Product $product
     * @return Product
     */
    public function updateProduct(array $validatedData, Product $product): Product
    {
        $product->update($validatedData);
        return $product;
    }

    /**
     * Delete a product.
     *
     * @param int $id
     * @return bool
     */
    public function deleteProduct(int $id): bool
    {
        return Product::destroy($id) > 0;
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
use App\Models\Purchase;
use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Services\PurchaseService;

class PurchaseController extends Controller
{

    public function __construct(private PurchaseService $purchaseService){
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchases = $this->purchaseService->getAllProducts();

        return PurchaseResource::collection($purchases);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurchaseRequest $request)
    {
        $validated = $request->validated();

        $purchase = $this->purchaseService->createPurchase($validated);

        return (new PurchaseResource($purchase))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        return new PurchaseResource($this->purchaseService->getPurchaseById($purchase->id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $validated = $request->validated();

        $purchase = $this->purchaseService->updateProduct($validated, $purchase);

        return new PurchaseResource($purchase);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $this->purchaseService->deletePurchase($purchase->id);

        return response()->noContent();
    }
}

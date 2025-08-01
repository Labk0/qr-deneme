<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseResource;
use App\Models\Purchase;
use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Services\PurchaseService;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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

        $purchaseData = $this->purchaseService->createPurchase($validated);

        $purchase = $purchaseData['purchase'];

        return (new PurchaseResource($purchase))
            ->response()
            ->setStatusCode(201);
    }
    /**
     * Display the specified resource.
     */
    public function show($transactionId)
    {
        $purchase = Purchase::where('transaction_id', $transactionId)
            ->with('product')
            ->firstOrFail();

        return new PurchaseResource($purchase);
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

    public function getQrCode($transactionId)
    {
        Purchase::where('transaction_id', $transactionId)->firstOrFail();

        $purchaseDetailUrl = env('FRONTEND_URL') . '/purchases/' . $transactionId;

        $qrCodeData = QrCode::format('svg')->generate($purchaseDetailUrl);

        $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCodeData);

        return response()->json([
            'qr_code_url' => $qrCodeBase64
        ]);
    }
}

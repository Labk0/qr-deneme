<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::patch('/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);

Route::get('/purchases', [PurchaseController::class, 'index']);
Route::post('/purchases', [PurchaseController::class, 'store']);
Route::get('/purchases/{transactionId}', [PurchaseController::class, 'show']);
Route::patch('/purchases/{purchase}', [PurchaseController::class, 'update']);
Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy']);

Route::get('/purchases/{transactionId}/qrcode', [PurchaseController::class, 'getQrCode']);

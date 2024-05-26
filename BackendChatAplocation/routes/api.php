<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class)->names('user');
    //Route::apiResource('/notes',NoteController::class)->names('notes');
});
Route::post('/login',[AuthController::class,'login']);

Route::apiResource('contacts', ContactController::class);
Route::apiResource('messages', MessageController::class);
Route::apiResource('media', MediaController::class);



//Route::apiResource('user', UserController::class);
/*
Route::apiResource('/users',UserController::class)->names('users');

Route::apiResource('/users',UserController::class)->names('users');
Route::apiResource('/categories',CategoryController::class)->names('categories');
Route::apiResource('/notes',NoteController::class)->names('notes');
Route::apiResource('/images',ImageController::class)->names('images');
*/


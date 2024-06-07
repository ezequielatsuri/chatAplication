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

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class)->names('users');
    Route::apiResource('/contacts', ContactController::class)->names('contacts');
    Route::apiResource('/messages', MessageController::class)->names('messages');
    Route::apiResource('/media', MediaController::class)->names('media');
    Route::get('messages/between/{userId1}/{userId2}', [MessageController::class, 'getMessagesBetweenUsers']);
    Route::get('/contacts/senders-from-messages/{userId}', [MessageController::class, 'getSenders']);
});




// Rutas de autenticación pública
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);  // Opcional, si tienes registro de usuarios
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');  // Opcional, si tienes logout


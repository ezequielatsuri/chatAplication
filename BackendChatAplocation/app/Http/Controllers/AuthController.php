<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){
        $credentials = $request->only("email","password");

        if(Auth::attempt($credentials)){
            return $this->handleLogin($request);
        }
        return response()->json(["message" => "Credenciales inválidas"], 401);
    }

    private function handleLogin(Request $request){
        $user = auth()->user();
        $token = $user->createToken('auth_token');

        return response()->json([
            'token' => $token->plainTextToken,
            'user' => $user
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::all();
        return response()->json($contacts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar el email del nuevo contacto
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Obtener el usuario autenticado
        $user = auth()->user();

        // Buscar el usuario con el email proporcionado
        $contactUser = User::where('email', $request->email)->first();

        // Verificar si la relación de contacto ya existe
        $existingContact = Contact::where('user_id', $user->id)
                                  ->where('contact_id', $contactUser->id)
                                  ->first();

        if ($existingContact) {
            return response()->json([
                'message' => 'El contacto ya existe.',
                'contact' => $existingContact
            ], 409);
        }

        // Crear la nueva relación de contacto
        $contact = Contact::create([
            'user_id' => $user->id,
            'contact_id' => $contactUser->id,
        ]);

        // Devolver la respuesta con los detalles del contacto
        return response()->json([
            'id' => $contact->id,
            'name' => $contactUser->name,
            'email' => $contactUser->email,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return response()->json($contact);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'contact_id' => 'sometimes|required|exists:users,id',
        ]);

        $contact->update($request->all());
        return response()->json($contact);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json('contacto eliminado');
    }
}

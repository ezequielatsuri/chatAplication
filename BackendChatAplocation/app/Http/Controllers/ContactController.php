<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $contacts = Contact::where('user_id', $user->id)->with('contact')->get();

        $contacts = $contacts->map(function ($contact) {
            return [
                'id' => $contact->id,
                'name' => $contact->contact->name,
                'email' => $contact->contact->email,
            ];
        });

        return response()->json($contacts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = Auth::user();
        $contactUser = User::where('email', $request->email)->first();

        $existingContact = Contact::where('user_id', $user->id)
                                  ->where('contact_id', $contactUser->id)
                                  ->first();

        if ($existingContact) {
            return response()->json([
                'message' => 'El contacto ya existe.',
                'contact' => $existingContact
            ], 409);
        }

        $contact = Contact::create([
            'user_id' => $user->id,
            'contact_id' => $contactUser->id,
        ]);

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

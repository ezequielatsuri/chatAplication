<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Contactos",
 *     description="Operaciones sobre contactos"
 * )
 */
class ContactController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/contacts",
     *     summary="Mostrar lista de contactos",
     *     tags={"Contactos"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de contactos"
     *     )
     * )
     */
    public function index()
    {
        $user = Auth::user();
        $contacts = Contact::where('user_id', $user->id)->with('contact')->get();

        $contacts = $contacts->map(function ($contact) {
            return [
                'id' => $contact->id,
                'user_id' => $contact->contact_id, // Aquí incluimos el contact_id
                'name' => $contact->contact->name,
                'email' => $contact->contact->email,
            ];
        });

        return response()->json($contacts);
    }

    /**
     * @OA\Post(
     *     path="/api/contacts",
     *     summary="Agregar un nuevo contacto",
     *     tags={"Contactos"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="email", type="string", example="example@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Contacto creado"
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="El contacto ya existe"
     *     )
     * )
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
            'user_id' => $contactUser->id, // Aquí devolvemos el contact_id
            'name' => $contactUser->name,
            'email' => $contactUser->email,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/contacts/{id}",
     *     summary="Mostrar un contacto específico",
     *     tags={"Contactos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contacto específico"
     *     )
     * )
     */
    public function show(Contact $contact)
    {
        return response()->json($contact);
    }

    /**
     * @OA\Put(
     *     path="/api/contacts/{id}",
     *     summary="Actualizar un contacto",
     *     tags={"Contactos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="contact_id", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contacto actualizado"
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/contacts/{id}",
     *     summary="Eliminar un contacto",
     *     tags={"Contactos"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contacto eliminado"
     *     )
     * )
     */
    public function destroy(Contact $contact)
    {
    $contact->delete();
    return response()->json(['message' => 'contacto eliminado']);
    }

}

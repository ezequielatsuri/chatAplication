<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->input('sender_id'),
            'receiver_id' => $request->input('receiver_id'),
            'content' => $request->input('content'),
            'sent_at' => now()
        ]);

        if ($request->hasFile('images')) {
            $files = $request->file('images');

            if (is_array($files) && count($files) > 0) {
                foreach ($files as $file) {
                    $filename = time() . '.' . $file->getClientOriginalName();
                    Storage::disk('public')->putFileAs('images', $file, $filename);
                    $message->media()->create([
                        'url' => 'images/' . $filename,
                        'type' => $file->getClientMimeType(),
                    ]);
                }
            }
        }

        return response()->json($message, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        return response()->json($message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        $request->validate([
            'content' => 'sometimes|required|string',
        ]);

        $message->update($request->only(['content']));
        return response()->json($message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json('mensaje eliminado');
    }

    /**
     * Get messages between two users.
     */
    public function getMessagesBetweenUsers($userId1, $userId2)
    {
        $messages = Message::where(function ($query) use ($userId1, $userId2) {
            $query->where('sender_id', $userId1)
                  ->where('receiver_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('sender_id', $userId2)
                  ->where('receiver_id', $userId1);
        })->orderBy('sent_at', 'asc')->get();

        return response()->json($messages);
    }
    public function getSenders($userId)
    {
        try {
            // Obtiene los IDs de los usuarios que han enviado mensajes al usuario especificado
            $senderIds = Message::where('receiver_id', $userId)
                                ->pluck('sender_id')
                                ->unique();

            // Comprueba si hay remitentes encontrados
            if ($senderIds->isEmpty()) {
                return response()->json(['message' => 'No hay remitentes encontrados'], 404);
            }

            // Obtiene los detalles de los usuarios remitentes
            $senders = User::whereIn('id', $senderIds)->get();

            // Retorna los detalles de los remitentes en formato JSON
            return response()->json($senders);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener remitentes', 'error' => $e->getMessage()], 500);
        }
    }
}

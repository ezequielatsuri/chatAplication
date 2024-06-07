<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Mensajes",
 *     description="Operaciones sobre mensajes"
 * )
 */
class MessageController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/messages",
     *     summary="Mostrar lista de mensajes",
     *     tags={"Mensajes"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de mensajes"
     *     )
     * )
     */
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    /**
     * @OA\Post(
     *     path="/api/messages",
     *     summary="Crear un nuevo mensaje",
     *     tags={"Mensajes"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="sender_id", type="integer", example=1),
     *                 @OA\Property(property="receiver_id", type="integer", example=2),
     *                 @OA\Property(property="content", type="string", example="Hola, ¿cómo estás?"),
     *                 @OA\Property(property="images[]", type="file", description="Archivos de imagen")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Mensaje creado"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,mp4,svg|max:2048', // Validación para las imágenes
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
                    $filename = time() . '_' . $file->getClientOriginalName();
                    Storage::disk('public')->putFileAs('images', $file, $filename);
                    $message->media()->create([
                        'url' => 'images/' . $filename,
                        'type' => $file->getClientMimeType(),
                    ]);
                }
            }
        }

        // Recargar el mensaje con las relaciones para incluir las imágenes
        $message->load('media');

        return response()->json($message, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/messages/{id}",
     *     summary="Mostrar un mensaje específico",
     *     tags={"Mensajes"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mensaje específico"
     *     )
     * )
     */
    public function show(Message $message)
    {
        return response()->json($message);
    }

    /**
     * @OA\Put(
     *     path="/api/messages/{id}",
     *     summary="Actualizar un mensaje",
     *     tags={"Mensajes"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="content", type="string", example="Hola, ¿cómo estás?")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mensaje actualizado"
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/messages/{id}",
     *     summary="Eliminar un mensaje",
     *     tags={"Mensajes"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mensaje eliminado"
     *     )
     * )
     */

    public function destroy(Message $message)
    {
    $message->delete();
    return response()->json(['message' => 'mensaje eliminado']);
    }


    /**
     * @OA\Get(
     *     path="/api/messages/between/{userId1}/{userId2}",
     *     summary="Obtener mensajes entre dos usuarios",
     *     tags={"Mensajes"},
     *     @OA\Parameter(
     *         name="userId1",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="userId2",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Mensajes entre usuarios"
     *     )
     * )
     */
    public function getMessagesBetweenUsers($userId1, $userId2)
    {
        $messages = Message::with('media')->where(function ($query) use ($userId1, $userId2) {
            $query->where('sender_id', $userId1)
                  ->where('receiver_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('sender_id', $userId2)
                  ->where('receiver_id', $userId1);
        })->orderBy('sent_at', 'asc')->get();

        return response()->json($messages);
    }

    /**
     * @OA\Get(
     *     path="/api/messages/senders/{userId}",
     *     summary="Obtener remitentes de un usuario",
     *     tags={"Mensajes"},
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de remitentes"
     *     )
     * )
     */
    public function getSenders($userId)
    {
        try {
            $senderIds = Message::where('receiver_id', $userId)
                                ->pluck('sender_id')
                                ->unique();

            if ($senderIds->isEmpty()) {
                return response()->json(['message' => 'No hay remitentes encontrados'], 404);
            }

            $senders = User::whereIn('id', $senderIds)->get();
            return response()->json($senders);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener remitentes', 'error' => $e->getMessage()], 500);
        }
    }
}

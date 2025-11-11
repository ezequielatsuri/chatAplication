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
            'content' => 'nullable|string',
            'images.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,txt|max:5120', // 5MB máximo
        ]);

        try {
            $message = Message::create([
                'sender_id' => $request->input('sender_id'),
                'receiver_id' => $request->input('receiver_id'),
                'content' => $request->input('content') ?: '', // Si content está vacío, usar string vacío
                'sent_at' => now()
            ]);

            if ($request->hasFile('images')) {
                $files = $request->file('images');

                if (is_array($files) && count($files) > 0) {
                    foreach ($files as $file) {
                        if ($file && $file->isValid()) {
                            $filename = time() . '_' . $file->getClientOriginalName();
                            
                            // Asegurar que el directorio existe
                            $directory = 'images';
                            if (!Storage::disk('public')->exists($directory)) {
                                Storage::disk('public')->makeDirectory($directory);
                            }
                            
                            // Guardar el archivo
                            $path = Storage::disk('public')->putFileAs($directory, $file, $filename);
                            
                            if ($path) {
                                $message->media()->create([
                                    'url' => $path,
                                    'type' => $file->getClientMimeType(),
                                ]);
                            }
                        }
                    }
                }
            }

            // Recargar el mensaje con las relaciones para incluir las imágenes
            $message->load('media');

            return response()->json($message, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating message: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear el mensaje',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/messages/test-upload",
     *     summary="Probar subida de archivos",
     *     tags={"Mensajes"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="test_file", type="file", description="Archivo de prueba")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo subido correctamente"
     *     )
     * )
     */
    public function testUpload(Request $request)
    {
        try {
            $request->validate([
                'test_file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,txt|max:5120',
            ]);

            if ($request->hasFile('test_file')) {
                $file = $request->file('test_file');
                
                if ($file && $file->isValid()) {
                    $filename = 'test_' . time() . '_' . $file->getClientOriginalName();
                    
                    // Asegurar que el directorio existe
                    $directory = 'images';
                    if (!Storage::disk('public')->exists($directory)) {
                        Storage::disk('public')->makeDirectory($directory);
                    }
                    
                    // Guardar el archivo
                    $path = Storage::disk('public')->putFileAs($directory, $file, $filename);
                    
                    if ($path) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Archivo subido correctamente',
                            'filename' => $filename,
                            'path' => $path,
                            'size' => $file->getSize(),
                            'mime_type' => $file->getClientMimeType(),
                            'url' => url('storage/' . $path)
                        ], 200);
                    } else {
                        return response()->json([
                            'success' => false,
                            'message' => 'Error al guardar el archivo'
                        ], 500);
                    }
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Archivo inválido'
                    ], 400);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No se recibió ningún archivo'
                ], 400);
            }
        } catch (\Exception $e) {
            \Log::error('Error in test upload: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error en la subida',
                'error' => $e->getMessage()
            ], 500);
        }
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

            // Obtener usuarios existentes
            $existingUsers = User::whereIn('id', $senderIds)->get();
            
            // Crear usuarios temporales para IDs que no existen
            $missingIds = $senderIds->diff($existingUsers->pluck('id'));
            $temporaryUsers = collect();
            
            foreach ($missingIds as $missingId) {
                // Crear un usuario temporal con información básica
                $temporaryUser = new User();
                $temporaryUser->id = $missingId;
                $temporaryUser->name = "Usuario #{$missingId}";
                $temporaryUser->email = "usuario{$missingId}@temporal.com";
                $temporaryUser->created_at = now();
                $temporaryUser->updated_at = now();
                $temporaryUser->is_temporary = true; // Marcar como temporal
                
                $temporaryUsers->push($temporaryUser);
            }
            
            // Combinar usuarios existentes y temporales
            $allSenders = $existingUsers->concat($temporaryUsers);
            
            return response()->json($allSenders);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener remitentes', 'error' => $e->getMessage()], 500);
        }
    }
}

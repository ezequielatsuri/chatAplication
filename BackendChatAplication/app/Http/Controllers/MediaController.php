<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Media",
 *     description="Operaciones sobre archivos multimedia"
 * )
 */
class MediaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/media",
     *     summary="Mostrar lista de archivos multimedia",
     *     tags={"Media"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de archivos multimedia"
     *     )
     * )
     */
    public function index()
    {
        $media = Media::all();
        return response()->json($media);
    }

    /**
     * @OA\Post(
     *     path="/api/media",
     *     summary="Subir un nuevo archivo multimedia",
     *     tags={"Media"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="message_id", type="integer", example=1),
     *                 @OA\Property(property="url", type="file", description="Archivo multimedia")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Archivo multimedia subido"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'message_id' => 'required|exists:messages,id',
            'url' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:20480', // Ajustar los tipos y tamaño máximo de archivo según necesidades
        ]);

        $path = $request->file('url')->store('media', 'public');

        $media = Media::create([
            'message_id' => $request->input('message_id'),
            'type' => $request->file('url')->getClientMimeType(),
            'url' => $path,
        ]);

        return response()->json($media, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/media/{id}",
     *     summary="Mostrar un archivo multimedia específico",
     *     tags={"Media"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo multimedia específico"
     *     )
     * )
     */
    public function show(Media $media)
    {
        return response()->json($media);
    }

    /**
     * @OA\Put(
     *     path="/api/media/{id}",
     *     summary="Actualizar un archivo multimedia",
     *     tags={"Media"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="url", type="file", description="Nuevo archivo multimedia")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo multimedia actualizado"
     *     )
     * )
     */
    public function update(Request $request, Media $media)
    {
        $request->validate([
            'url' => 'sometimes|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:20480',
        ]);

        if ($request->hasFile('url')) {
            // Borrar el archivo anterior
            Storage::disk('public')->delete($media->url);

            // Almacenar el nuevo archivo
            $path = $request->file('url')->store('media', 'public');
            $media->update([
                'type' => $request->file('url')->getClientMimeType(),
                'url' => $path,
            ]);
        }

        return response()->json($media);
    }

    /**
     * @OA\Delete(
     *     path="/api/media/{id}",
     *     summary="Eliminar un archivo multimedia",
     *     tags={"Media"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Archivo multimedia eliminado"
     *     )
     * )
     */
    public function destroy(Media $media)
    {
        // Borrar el archivo del almacenamiento
        Storage::disk('public')->delete($media->url);

        $media->delete();
        return response()->json('archivo eliminado');
    }
}

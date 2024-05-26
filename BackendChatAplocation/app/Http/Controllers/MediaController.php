<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $media = Media::all();
        return response()->json($media);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'message_id' => 'required|exists:messages,id',
            'url' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:20480', // Ajustar los tipos y tamaño máximo de archivo según necesidades
        ]);

        $path = $request->file('url')->store('media');

        $media = Media::create([
            'message_id' => $request->input('message_id'),
            'type' => $request->file('url')->getClientMimeType(),
            'url' => $path,
        ]);

        return response()->json($media, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Media $media)
    {
        return response()->json($media);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Media $media)
    {
        $request->validate([
            'url' => 'sometimes|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:20480',
        ]);

        if ($request->hasFile('url')) {
            // Borrar el archivo anterior
            Storage::delete($media->url);

            // Almacenar el nuevo archivo
            $path = $request->file('url')->store('media');
            $media->update([
                'type' => $request->file('url')->getClientMimeType(),
                'url' => $path,
            ]);
        }

        return response()->json($media);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Media $media)
    {
        // Borrar el archivo del almacenamiento
        Storage::delete($media->url);

        $media->delete();
        return response()->json('archivo eliminado');
    }
}

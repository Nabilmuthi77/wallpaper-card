<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wallpaper;
use Illuminate\Support\Facades\Validator;

class WallpaperController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wallpaper = Wallpaper::all();
        return response()->json([
            'status' => true,
            'message' => 'Semua Data Wallpaper Berhasil Diambil',
            'data' => $wallpaper
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pict_name' => 'required|string|max:255',
            'element' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi error',
                'errors' => $validator->errors()
            ], 422);
        }

        $wallpaper = Wallpaper::create($request->all());
        return response()->json([
            'status' => true,
            'message' => 'Data Berhasil Disimpan',
            'data' => $wallpaper
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $wallpaper = Wallpaper::findorfail($id);
        return response()->json([
            'status' => true,
            'message' => 'Data Wallpaper Berhasil Diambil',
            'data' => $wallpaper
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'pict_name' => 'required|string|max:255',
            'element' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi error',
                'errors' => $validator->errors()
            ], 422);
        }

        $wallpaper = Wallpaper::findorfail($id);
        $wallpaper->update($request->all());
        return response()->json([
            'status' => true,
            'message' => 'Data Berhasil Diubah',
            'data' => $wallpaper
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $wallpaper = Wallpaper::findorfail($id);
        $wallpaper->delete();
        return response()->json([
            'status' => true,
            'message' => 'Data Berhasil Dihapus',
        ], 204);

    }
}

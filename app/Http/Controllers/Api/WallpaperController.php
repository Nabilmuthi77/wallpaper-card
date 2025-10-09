<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wallpaper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

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
     * Store a newly created resource in storage (upload file).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'element' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Upload file
        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('wallpaper'), $fileName);

        // Simpan data ke database
        $wallpaper = Wallpaper::create([
            'pict_name' => $fileName,
            'element' => $request->element,
        ]);

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
        $wallpaper = Wallpaper::findOrFail($id);
        return response()->json([
            'status' => true,
            'message' => 'Data Wallpaper Berhasil Diambil',
            'data' => $wallpaper
        ], 200);
    }

    /**
     * Update the specified resource in storage (ganti gambar kalau dikirim).
     */
    public function update(Request $request, string $id)
    {
        $wallpaper = Wallpaper::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'element' => 'required|string|max:255',
            'file' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Jika ada file baru, hapus lama dan upload baru
        if ($request->hasFile('file')) {
            $oldFile = public_path('wallpaper/' . $wallpaper->pict_name);
            if (File::exists($oldFile)) {
                File::delete($oldFile);
            }

            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('wallpaper'), $fileName);

            $wallpaper->pict_name = $fileName;
        }

        $wallpaper->element = $request->element;
        $wallpaper->save();

        return response()->json([
            'status' => true,
            'message' => 'Data Berhasil Diperbarui',
            'data' => $wallpaper
        ], 200);
    }

    /**
     * Remove the specified resource from storage (hapus file juga).
     */
    public function destroy(string $id)
    {
        $wallpaper = Wallpaper::findOrFail($id);

        $filePath = public_path('wallpaper/' . $wallpaper->pict_name);
        if (File::exists($filePath)) {
            File::delete($filePath);
        }

        $wallpaper->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data Berhasil Dihapus'
        ], 200);
    }
}

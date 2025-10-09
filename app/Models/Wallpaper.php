<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallpaper extends Model
{
    protected $table = 'wallpaper';
    protected $fillable = ['pict_name', 'char_name', 'element'];
}

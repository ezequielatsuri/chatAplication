<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'type',
        'url'
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}

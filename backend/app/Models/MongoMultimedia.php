<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class MongoMultimedia extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'multimedia';
    protected $fillable = [
        'filename', 'mimetype', 'size', 'url', 'uploaded_by', 'uploaded_at',
        'context', 'context_id', 'type', 'thumbnail_url'
    ];
}

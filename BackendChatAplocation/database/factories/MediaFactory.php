<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition()
    {
        return [
            'message_id' => Message::factory(),
            'type' => 'image/jpeg',
            'url' => $this->faker->imageUrl,
        ];
    }
}

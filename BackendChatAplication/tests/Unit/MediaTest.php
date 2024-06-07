<?php

namespace Tests\Unit;

use App\Models\Media;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_a_message()
    {
        $message = Message::factory()->create();
        $media = Media::factory()->create(['message_id' => $message->id]);

        $this->assertInstanceOf(Message::class, $media->message);
        $this->assertEquals($message->id, $media->message->id);
    }
}

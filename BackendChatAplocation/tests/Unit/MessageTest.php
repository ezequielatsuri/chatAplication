<?php

namespace Tests\Unit;

use App\Models\Message;
use App\Models\User;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_a_sender()
    {
        $sender = User::factory()->create();
        $message = Message::factory()->create(['sender_id' => $sender->id]);

        $this->assertInstanceOf(User::class, $message->sender);
        $this->assertEquals($sender->id, $message->sender->id);
    }

    /** @test */
    public function it_has_many_receivers()
    {
        $receiver = User::factory()->create();
        $message = Message::factory()->create(['receiver_id' => $receiver->id]);

        $this->assertInstanceOf(User::class, $message->receiver->first());
        $this->assertEquals($receiver->id, $message->receiver->first()->id);
    }

    /** @test */
    public function it_has_many_media()
    {
        $message = Message::factory()->create();
        $media = Media::factory()->create(['message_id' => $message->id]);

        $this->assertInstanceOf(Media::class, $message->media->first());
        $this->assertEquals($media->id, $message->media->first()->id);
    }
}

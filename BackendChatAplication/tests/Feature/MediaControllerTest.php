<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token);
        return $user;
    }

    /** @test */
    public function it_lists_all_media()
    {
        $this->authenticate();
        Media::factory()->count(3)->create();

        $response = $this->getJson('/api/media');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function it_creates_a_new_media()
    {
        Storage::fake('public');
        $this->authenticate();

        $message = Message::factory()->create();
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->postJson('/api/media', [
            'message_id' => $message->id,
            'url' => $file,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id', 'message_id', 'type', 'url', 'created_at', 'updated_at'
                 ]);

        Storage::disk('public')->assertExists('media/' . $file->hashName());
    }

    public function it_shows_a_specific_media()
    {
        $this->authenticate();
        $media = Media::factory()->create();

        $response = $this->getJson("/api/media/{$media->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $media->id,
                 ]);
    }




}

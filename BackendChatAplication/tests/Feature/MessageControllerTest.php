<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\User;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MessageControllerTest extends TestCase
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
    public function it_lists_all_messages()
    {
        $this->authenticate();
        Message::factory()->count(3)->create();

        $response = $this->getJson('/api/messages');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }



    /** @test */
    public function it_shows_a_specific_message()
    {
        $this->authenticate();
        $message = Message::factory()->create();

        $response = $this->getJson("/api/messages/{$message->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $message->id,
                 ]);
    }

    /** @test */
    public function it_updates_a_message()
    {
        $this->authenticate();
        $message = Message::factory()->create();

        $response = $this->putJson("/api/messages/{$message->id}", [
            'content' => 'Updated content',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $message->id,
                     'content' => 'Updated content',
                 ]);
    }

    /** @test */
    public function it_deletes_a_message()
    {
        $this->authenticate();
        $message = Message::factory()->create();

        $response = $this->deleteJson("/api/messages/{$message->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'mensaje eliminado'
                 ]);
    }

    /** @test */
    public function it_gets_messages_between_two_users()
    {
        $this->authenticate();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Message::factory()->create(['sender_id' => $user1->id, 'receiver_id' => $user2->id]);
        Message::factory()->create(['sender_id' => $user2->id, 'receiver_id' => $user1->id]);

        $response = $this->getJson("/api/messages/between/{$user1->id}/{$user2->id}");

        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

   /** @test */


}

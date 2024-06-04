<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'api');
        return $user;
    }

    /** @test */
    public function it_lists_contacts()
    {
        $user = $this->authenticate();

        $contacts = Contact::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/contacts');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function it_creates_a_contact()
    {
        $user = $this->authenticate();
        $contactUser = User::factory()->create();

        $response = $this->postJson('/api/contacts', [
            'email' => $contactUser->email,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id', 'user_id', 'name', 'email'
                 ]);
    }

    /** @test */
    public function it_shows_a_specific_contact()
    {
        $user = $this->authenticate();

        $contact = Contact::factory()->create(['user_id' => $user->id]);

        $response = $this->getJson("/api/contacts/{$contact->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $contact->id,
                 ]);
    }

    /** @test */
    public function it_updates_a_contact()
    {
        $user = $this->authenticate();

        $contact = Contact::factory()->create(['user_id' => $user->id]);
        $newContactUser = User::factory()->create();

        $response = $this->putJson("/api/contacts/{$contact->id}", [
            'contact_id' => $newContactUser->id,
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $contact->id,
                     'contact_id' => $newContactUser->id,
                 ]);
    }

    /** @test */
    public function it_deletes_a_contact()
    {
        $user = $this->authenticate();

        $contact = Contact::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson("/api/contacts/{$contact->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'contacto eliminado'
                 ]);
    }
}

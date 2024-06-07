<?php

namespace Tests\Unit;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $contact = Contact::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $contact->user);
        $this->assertEquals($user->id, $contact->user->id);
    }

    /** @test */
    public function it_belongs_to_a_contact()
    {
        $contactUser = User::factory()->create();
        $contact = Contact::factory()->create(['contact_id' => $contactUser->id]);

        $this->assertInstanceOf(User::class, $contact->contact);
        $this->assertEquals($contactUser->id, $contact->contact->id);
    }
}

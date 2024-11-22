<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Velden die massaal toewijsbaar zijn.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_picture', // Voeg dit toe als je profielafbeeldingen ondersteunt
        'bio',             // Optioneel veld voor een bio
        'favourites',      // Slaat favorieten op als een JSON-array
        'role',            // Toegangscontrole gebaseerd op rollen (bijv. admin, gebruiker)
    ];

    /**
     * Velden die verborgen moeten zijn in arrays.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Velden die moeten worden geconverteerd naar een specifiek datatype.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'favourites' => 'array', // Zorg ervoor dat de favorites als array worden opgeslagen
    ];

    /**
     * Relatie: prompts die door deze gebruiker zijn aangemaakt.
     */
    public function prompts()
    {
        return $this->hasMany(Prompt::class);
    }

    /**
     * Relatie: volgers van deze gebruiker.
     */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'user_follows', 'followed_id', 'follower_id')
            ->withPivot('followed_id', 'follower_id');
    }


    /**
     * Relatie: gebruikers die deze gebruiker volgt.
     */
    public function following()
    {
        return $this->belongsToMany(User::class, 'user_follows', 'follower_id', 'followed_id');
    }

    /**
     * Controleer of de gebruiker een specifieke prompt als favoriet heeft.
     */
    public function hasFavouritedPrompt($promptId)
    {
        $favourites = json_decode($this->favourites, true);
        return in_array($promptId, $favourites);
    }

    public function addFavouritePrompt($promptId)
    {
        $favourites = json_decode($this->favourites, true);
        if (!in_array($promptId, $favourites)) {
            $favourites[] = $promptId;
            $this->favourites = json_encode($favourites);
            $this->save();
        }
    }

    public function getFavouritesAttribute($value)
    {
        return json_decode($value, true) ?? []; // Return empty array if null
    }


    public function removeFavouritePrompt($promptId)
    {
        $favourites = json_decode($this->favourites, true);
        if (($key = array_search($promptId, $favourites)) !== false) {
            unset($favourites[$key]);
            $this->favourites = json_encode(array_values($favourites)); // Reindex array
            $this->save();
        }
    }

    /**
     * Controleer of de gebruiker een specifieke andere gebruiker volgt.
     */
    public function isFollowing(User $user)
    {
        return $this->following()->where('followed_id', $user->id)->exists();
    }

    /**
     * Controleer of de gebruiker wordt gevolgd door een specifieke andere gebruiker.
     */
    public function isFollowedBy(User $user)
    {
        return $this->followers()->where('follower_id', $user->id)->exists();
    }

    /**
     * Controleer of de gebruiker een specifieke rol heeft.
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Geef de URL van de profielfoto, met een standaardwaarde als deze niet is ingesteld.
     */
    public function getProfilePictureUrl()
    {
        return $this->profile_picture
            ? asset('storage/' . $this->profile_picture)
            : asset('images/default-profile.png');
    }
}

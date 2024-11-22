<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Registreer een nieuwe gebruiker met gedetailleerde foutmeldingen.
     */
    public function register(Request $request): JsonResponse
    {
        // Validatie van de aanvraag, met name de naam en e-mail
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(), // Geeft gedetailleerde fouten per veld
            ], 400);
        }

        // Case-insensitieve controle of de naam al bestaat in de database
        $existingUser = User::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();

        if ($existingUser) {
            return response()->json([
                'message' => 'The name has already been taken.',
                'errors' => ['name' => ['The name is already in use.']],
            ], 400);
        }

        // Maak een nieuwe gebruiker aan
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user,
        ], 201);
    }


    /**
     * Login een gebruiker in met gedetailleerde foutmeldingen.
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email_or_username', 'password');

        // Controleer of het input een email is
        if (filter_var($credentials['email_or_username'], FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $credentials['email_or_username'])->first();
        } else {
            // Zoek de gebruiker op met case-insensitive zoekopdracht voor de naam
            $user = User::whereRaw('LOWER(name) = ?', [strtolower($credentials['email_or_username'])])->first();
        }

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Genereer het token en retourneer het samen met het user object
        $token = $user->createToken('AppName')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user // Voeg het user object toe aan de response
        ]);
    }

    /**
     * Log een gebruiker uit.
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke het API token
        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function getUserInfo($name): JsonResponse
    {
        $user = User::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $user->page_counter += 1;
        $user->save();

        // Aantal volgers en de volledige lijst van volgers
        $followers = $user->followers()
            ->select('users.id', 'users.name', 'user_follows.followed_id as pivot_followed_id', 'user_follows.follower_id as pivot_follower_id')
            ->get();

        $followersCount = $followers->count();
        $followingCount = $user->following()->count();

        // Alle prompts van de gebruiker ophalen
        $userPrompts = $user->prompts()->get();

        // Haal de favoriete prompts ID's op uit de 'favourites' data
        $favouritePromptIds = array_keys($user->favourites);

        // Als er favoriete prompts zijn, haal ze op en voeg de prompt_id toe
        $favouritePrompts = [];
        if (count($favouritePromptIds) > 0) {
            $favouritePrompts = Prompt::whereIn('id', $favouritePromptIds)->get()->map(function ($prompt) use ($user) {
                // Voeg de prompt_id (uit favourites) toe aan de prompt data
                $prompt->favourite_id = $user->favourites[$prompt->id]; // Dit is het aantal 'favourites' dat de prompt heeft
                return $prompt;
            });
        }

        // De verzamelde gegevens toevoegen aan de gebruiker
        $user->followers_count = $followersCount;
        $user->following_count = $followingCount;
        $user->followers = $followers; // Volgers-lijst toevoegen
        $user->prompts = $userPrompts;
        $user->favourite_prompts = $favouritePrompts; // Favoriete prompts toevoegen

        return response()->json([
            'user' => $user,
        ], 200);
    }


}

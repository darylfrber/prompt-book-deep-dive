<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function followUser(Request $request, $followedId)
    {
        $followerId = Auth::id(); // Haal de ingelogde gebruiker op

        // Controleer of de gebruiker zichzelf probeert te volgen
        if ($followerId == $followedId) {
            return response()->json(['message' => 'You cannot follow yourself.'], 400);
        }

        // Voeg de follow relatie toe, controleer eerst of die niet al bestaat
        $existingFollow = User::find($followerId)->following()->where('followed_id', $followedId)->exists();

        if ($existingFollow) {
            return response()->json(['message' => 'You are already following this user.'], 400);
        }

        // Voeg de follow relatie toe
        User::find($followerId)->following()->attach($followedId);

        return response()->json(['message' => 'You are now following the user.'], 200);
    }

    public function unfollowUser(Request $request, $followedId)
    {
        $followerId = Auth::id();

        // Verwijder de follow relatie
        User::find($followerId)->following()->detach($followedId);

        return response()->json(['message' => 'You have unfollowed the user.'], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use Illuminate\Http\Request;

class PromptController extends Controller
{
    /**
     * Display a listing of the prompts.
     */
    public function index()
    {
        return response()->json(Prompt::all(), 200);
    }

    /**
     * Store a newly created prompt in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $prompt = Prompt::create(array_merge($validated, [
            'user_id' => auth()->id(),
        ]));

        return response()->json($prompt, 201);
    }

    /**
     * Display the specified prompt.
     */
    public function show($id): \Illuminate\Http\JsonResponse
    {
        $prompt = Prompt::with(['user', 'reviews.user'])->find($id);

        if (!$prompt) {
            return response()->json(['message' => 'Prompt not found'], 404);
        }

        $prompt->views += 1;
        $prompt->save();

        return response()->json($prompt->toArray(), 200);
    }

    public function updateFavourite($id)
    {
        $prompt = Prompt::findOrFail($id);
        $user = auth()->user(); // Haal de ingelogde gebruiker op

        // Zorg ervoor dat de favourites kolom een array is, zelfs als het null is
        $favourites = $user->favourites ?? [];

        // Controleer of de gebruiker de prompt al als favoriet heeft
        if (in_array($prompt->id, $favourites)) {
            // Als de prompt al favoriet is, haal hem dan weg
            $favourites = array_diff($favourites, [$prompt->id]); // Verwijder de prompt uit de favourieten
            $user->favourites = $favourites;
            $prompt->favourites -= 1; // Verminder het aantal favorieten
            $prompt->save();
            $user->save(); // Bewaar de gewijzigde favourites
            return response()->json(['message' => 'Prompt unfavourited successfully']);
        }

        // Voeg de prompt toe aan de favorieten
        $favourites[] = $prompt->id; // Voeg de prompt toe aan de lijst
        $user->favourites = $favourites;
        $prompt->favourites += 1; // Verhoog het aantal favorieten
        $prompt->save();
        $user->save(); // Bewaar de gewijzigde favourites
        return response()->json(['message' => 'Prompt favourited successfully']);
    }




    /**
     * Update the specified prompt in storage.
     */
    public function update(Request $request, $id)
    {
        $prompt = Prompt::find($id);

        if (!$prompt) {
            return response()->json(['message' => 'Prompt not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $prompt->update($validated);

        return response()->json($prompt, 200);
    }

    /**
     * Remove the specified prompt from storage.
     */
    public function destroy($id)
    {
        $prompt = Prompt::find($id);

        if (!$prompt) {
            return response()->json(['message' => 'Prompt not found'], 404);
        }

        $prompt->delete();

        return response()->json(['message' => 'Prompt deleted successfully'], 200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prompt;
use App\Models\Review;

class ReviewController extends Controller
{
    /**
     * Sla een nieuwe review op.
     */
    public function store(Request $request, $promptId)
    {
        $prompt = Prompt::find($promptId);

        if (!$prompt) {
            return response()->json(['message' => 'Prompt not found'], 404);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Controleer of de gebruiker al een review heeft
        $existingReview = Review::where('prompt_id', $promptId)->where('user_id', auth()->id())->first();
        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this prompt'], 400);
        }

        $review = $prompt->reviews()->create([
            'user_id' => auth()->id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Update gemiddelde beoordeling
        $prompt->average_rating = $prompt->reviews()->avg('rating');
        $prompt->save();

        return response()->json($review, 201);
    }

    /**
     * Werk een bestaande review bij.
     */
    public function update(Request $request, $id)
    {
        $review = Review::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$review) {
            return response()->json(['message' => 'Review not found or unauthorized'], 404);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review->update($validated);

        // Update gemiddelde beoordeling van de prompt
        $review->prompt->average_rating = $review->prompt->reviews()->avg('rating');
        $review->prompt->save();

        return response()->json($review, 200);
    }

    /**
     * Verwijder een review.
     */
    public function destroy($id)
    {
        $review = Review::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$review) {
            return response()->json(['message' => 'Review not found or unauthorized'], 404);
        }

        $prompt = $review->prompt;

        $review->delete();

        // Update gemiddelde beoordeling van de prompt
        $prompt->average_rating = $prompt->reviews()->avg('rating');
        $prompt->save();

        return response()->json(['message' => 'Review deleted'], 200);
    }
}

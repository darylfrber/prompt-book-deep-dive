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
    public function show($id)
    {
        $prompt = Prompt::find($id);

        if (!$prompt) {
            return response()->json(['message' => 'Prompt not found'], 404);
        }

        return response()->json($prompt, 200);
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

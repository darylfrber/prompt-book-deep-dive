<?php

use App\Http\Controllers\FollowController;
use App\Http\Controllers\PromptController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// Public routes (zichtbaar voor iedereen)
Route::get('/prompts/{id}', [PromptController::class, 'show']);
Route::get('/prompts', [PromptController::class, 'index']);


Route::get('/user/{name}', [UserController::class, 'getUserInfo']);

// Routes die beveiligd zijn met authenticatie
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/prompts', [PromptController::class, 'store']);      // Prompt aanmaken
    Route::put('/prompts/{id}', [PromptController::class, 'update']); // Prompt updaten
    Route::delete('/prompts/{id}', [PromptController::class, 'destroy']); // Prompt verwijderen

    // Reviews routes (zoals eerder gedefinieerd)
    Route::post('/prompts/{promptId}/reviews', [ReviewController::class, 'store']);   // Aanmaken review
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);                 // Bijwerken review
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);             // Verwijderen review

    // Volg een gebruiker
    Route::post('/follow/{followedId}', [FollowController::class, 'followUser']);
    // Stop met volgen van een gebruiker
    Route::post('/unfollow/{followedId}', [FollowController::class, 'unfollowUser']);


    // Voeg de logout route toe
    Route::post('/logout', [UserController::class, 'logout']);  // Logout
});

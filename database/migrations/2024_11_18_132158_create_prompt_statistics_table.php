<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prompt_statistics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('prompt_id');  // Verwijzing naar de prompt
            $table->integer('views')->default(0);  // Aantal keer bekeken
            $table->integer('favorites')->default(0);  // Aantal favorieten
            $table->integer('ratings')->default(0);  // Aantal beoordelingen
            $table->decimal('average_rating', 2, 1)->default(0.0);  // Gemiddelde beoordeling
            $table->timestamps();

            // Foreign key
            $table->foreign('prompt_id')->references('id')->on('prompts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prompt_statistics');
    }
};

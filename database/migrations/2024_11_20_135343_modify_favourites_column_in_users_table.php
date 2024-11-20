<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Wijzig de 'favourites' kolom naar JSON datatype
            $table->json('favourites')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Zet de kolom terug naar zijn vorige type (bijvoorbeeld string)
            $table->string('favourites')->nullable()->change();
        });
    }
};

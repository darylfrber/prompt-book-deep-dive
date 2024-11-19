<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('welcome');  // Dit verwijst naar de React-app, meestal 'app.blade.php'
})->where('any', '.*');
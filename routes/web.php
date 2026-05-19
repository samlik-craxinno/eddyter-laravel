<?php

use App\Http\Controllers\BlogCreateController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::view('/', 'editor.basic')->name('editor.basic');
Route::view('/editor/lifecycle', 'editor.lifecycle')->name('editor.lifecycle');
Route::view('/editor/modal', 'editor.modal')->name('editor.modal');

Route::get('/blog/create', [BlogCreateController::class, 'create'])->name('blog.create');
Route::post('/blog/create', [BlogCreateController::class, 'store'])->name('blog.create.store');

Route::view('/blog/multiple-editors', 'blog.multiple-editors')->name('blog.multiple-editors');

Route::view('/comments', 'comments.feed')->name('comments.feed');

@extends('layouts.app')

@push('vite')
    @vite(['resources/js/editor/basic.js'])
@endpush

@section('title', 'Eddyter editor')

@section('content')
    <main class="basic-page" data-api-key="{{ config('services.eddyter.api_key') }}">
        <header class="basic-page__header">
            <h1 class="basic-page__title">Basic editor</h1>
            <div class="basic-page__actions">
                <button
                    type="button"
                    class="basic-page__theme-toggle"
                    id="basic-theme-toggle"
                    aria-pressed="false"
                >
                    Dark theme
                </button>
            </div>
        </header>
        <p class="basic-page__hint">Open the browser console for lifecycle logs.</p>
        <div id="editor" class="basic-page__editor"></div>
    </main>
@endsection

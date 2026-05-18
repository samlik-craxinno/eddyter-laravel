@extends('layouts.minimal')

@push('vite')
    @vite(['resources/js/blog/multiple-editors.js'])
@endpush

@section('title', 'Multiple editors')

@section('content')
    <main class="multi-editors" data-api-key="{{ config('services.eddyter.api_key') }}">
        <header class="multi-editors__header">
            <h1 class="multi-editors__title">Multiple editors</h1>
            <p class="multi-editors__hint">Three independent Eddyter instances. Each has its own state, preview, save button, and onChange log. Open the browser console to see per-editor onChange events.</p>
        </header>

        @include('blog.partials.editor-card', [
            'id' => 'excerpt',
            'label' => 'Excerpt',
            'description' => 'Short summary shown in listings.',
            'initial' => '<p>Short summary of the post…</p>',
        ])

        @include('blog.partials.editor-card', [
            'id' => 'content',
            'label' => 'Main content',
            'description' => 'The body of the post.',
            'initial' => '<p>Write your post here…</p>',
        ])

        @include('blog.partials.editor-card', [
            'id' => 'seo',
            'label' => 'SEO description',
            'description' => 'Meta description for search engines.',
            'initial' => '<p>A concise SEO description…</p>',
        ])
    </main>
@endsection

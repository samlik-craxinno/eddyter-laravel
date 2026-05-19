@extends('layouts.app')

@push('vite')
    @vite(['resources/js/editor/basic.js'])
@endpush

@section('title', 'Eddyter editor')

@section('content')
    <main style="max-width:960px;margin:0 auto;padding:24px 16px 48px;">
        <h1 style="font-size:1.25rem;font-weight:600;margin:0 0 16px;">Eddyter</h1>
        <p style="margin:0 0 16px;font-size:0.875rem;opacity:0.75;">Open the browser console for lifecycle logs.</p>
        <div
            id="editor"
            data-api-key="{{ config('services.eddyter.api_key') }}"
            style="min-height:320px;border:1px solid #e5e5e5;border-radius:8px;background:#fff;"
        ></div>
    </main>
@endsection

@extends('layouts.app')

@push('vite')
    @vite(['resources/js/blog/create.js'])
@endpush

@section('title', 'New post')

@section('content')
    <main
        class="blog-create"
        @if (session('status')) data-clear-blog-draft="1" @endif
        data-has-validation-errors="{{ $errors->any() ? '1' : '0' }}"
    >
        <header class="blog-create__header">
            <h1 class="blog-create__title">New post</h1>
            <p class="blog-create__hint">Submit checks the title on the server. This browser also keeps a local draft (localStorage).</p>
        </header>

        @if (session('status'))
            <p class="blog-create__flash blog-create__flash--success" role="status">{{ session('status') }}</p>
        @endif

        <form
            class="blog-create__form"
            id="blog-create-form"
            method="post"
            action="{{ route('blog.create.store') }}"
        >
            @csrf

            <label class="blog-create__label" for="post-title">Title</label>
            <input
                class="blog-create__input @error('title') blog-create__input--invalid @enderror"
                type="text"
                id="post-title"
                name="title"
                value="{{ old('title') }}"
                placeholder="Post title"
                autocomplete="off"
            >
            @error('title')
                <p class="blog-create__field-error" role="alert">{{ $message }}</p>
            @enderror

            <span class="blog-create__label">Body</span>
            <div
                id="blog-editor"
                class="blog-create__editor @error('content') blog-create__editor--invalid @enderror"
                data-api-key="{{ config('services.eddyter.api_key') }}"
            ></div>
            <input type="hidden" name="content" id="content-hidden" value="">
            @error('content')
                <p class="blog-create__field-error" role="alert">{{ $message }}</p>
            @enderror

            <script type="application/json" id="blog-server-state">
                @json(['content' => old('content')])
            </script>

            <div class="blog-create__actions">
                <button type="submit" class="blog-create__btn" id="submit-post">Submit post</button>
                <button type="button" class="blog-create__btn blog-create__btn--secondary" id="save-draft">Save locally</button>
                <span class="blog-create__status" id="save-status" aria-live="polite"></span>
            </div>
        </form>

        <section class="blog-create__preview-section" aria-labelledby="preview-heading">
            <h2 class="blog-create__preview-title" id="preview-heading">Preview</h2>
            <p class="blog-create__preview-note">HTML from the editor (matches what is submitted).</p>
            <div class="blog-create__preview" id="post-preview"></div>
        </section>
    </main>
@endsection

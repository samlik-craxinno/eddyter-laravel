@extends('layouts.app')

@push('vite')
    @vite(['resources/js/editor/lifecycle.js'])
@endpush

@section('title', 'Eddyter lifecycle')

@section('content')
    <main class="lifecycle-page" data-api-key="{{ config('services.eddyter.api_key') }}">
        <header class="lifecycle-page__header">
            <h1 class="lifecycle-page__title">Eddyter lifecycle</h1>
            <p class="lifecycle-page__intro">Mount loads the SDK with a dynamic import. Destroy calls <code>instance.destroy()</code>. Recreate destroys first, then mounts again.</p>
        </header>

        <section class="lifecycle-page__toolbar" aria-label="Editor controls">
            <button type="button" class="lifecycle-page__btn lifecycle-page__btn--primary" id="lifecycle-mount">Mount editor</button>
            <button type="button" class="lifecycle-page__btn" id="lifecycle-destroy">Destroy editor</button>
            <button type="button" class="lifecycle-page__btn" id="lifecycle-recreate">Recreate editor</button>
        </section>

        <div class="lifecycle-page__grid">
            <div class="lifecycle-page__col">
                <h2 class="lifecycle-page__section-title">Editor</h2>
                <div
                    id="lifecycle-editor"
                    class="lifecycle-page__editor"
                ></div>
            </div>

            <div class="lifecycle-page__col lifecycle-page__col--meta">
                <h2 class="lifecycle-page__section-title">State</h2>
                <dl class="lifecycle-page__stats">
                    <div class="lifecycle-page__stat">
                        <dt>Active instances</dt>
                        <dd id="lifecycle-instance-count">0</dd>
                    </div>
                    <div class="lifecycle-page__stat">
                        <dt>Mounted</dt>
                        <dd id="lifecycle-mounted">no</dd>
                    </div>
                    <div class="lifecycle-page__stat">
                        <dt>Last HTML length</dt>
                        <dd id="lifecycle-html-len">—</dd>
                    </div>
                    <div class="lifecycle-page__stat">
                        <dt>Last onChange</dt>
                        <dd id="lifecycle-last-change">—</dd>
                    </div>
                </dl>

                <h2 class="lifecycle-page__section-title">Lifecycle log</h2>
                <div class="lifecycle-page__log-wrap">
                    <ol class="lifecycle-page__log" id="lifecycle-log" aria-live="polite"></ol>
                </div>
            </div>
        </div>
    </main>
@endsection

@extends('layouts.app')

@push('vite')
    @vite(['resources/js/editor/modal.js'])
@endpush

@section('title', 'Modal editor')

@section('content')
    <div class="modal-page" data-api-key="{{ config('services.eddyter.api_key') }}">
        <header class="modal-page__header">
            <h1 class="modal-page__title">Modal editor</h1>
            <p class="modal-page__lede">
                The Eddyter instance is created only while the modal is open. Closing the modal
                unmounts the editor and calls <code>destroy()</code> on the SDK instance.
            </p>
        </header>

        <section class="modal-page__controls" id="modal-test-settings" aria-label="Editor options">
            <h2 class="modal-page__section-title">Toolbar &amp; scrolling</h2>

            <fieldset class="modal-page__fieldset">
                <legend>Toolbar mode</legend>
                <label class="modal-page__radio">
                    <input type="radio" name="toolbar-mode" value="sticky" checked>
                    Sticky
                </label>
                <label class="modal-page__radio">
                    <input type="radio" name="toolbar-mode" value="static">
                    Static
                </label>
            </fieldset>

            <label class="modal-page__select-label" for="modal-max-height">
                <span>Editor max height (scrollable content)</span>
                <select id="modal-max-height">
                    <option value="200px">200px</option>
                    <option value="320px" selected>320px</option>
                    <option value="480px">480px</option>
                </select>
            </label>
        </section>

        <dl class="modal-page__stats">
            <div>
                <dt>Modal</dt>
                <dd id="modal-state">closed</dd>
            </div>
            <div>
                <dt>Toolbar</dt>
                <dd id="modal-toolbar-label">sticky</dd>
            </div>
            <div>
                <dt>Max height</dt>
                <dd id="modal-height-label">320px</dd>
            </div>
            <div>
                <dt>Mount count</dt>
                <dd id="modal-mount-count">0</dd>
            </div>
            <div>
                <dt>Destroy count</dt>
                <dd id="modal-destroy-count">0</dd>
            </div>
        </dl>

        <button type="button" class="modal-page__open-btn" id="modal-open-btn">
            Open modal editor
        </button>

        <p id="modal-status" class="modal-page__status" aria-live="polite"></p>

        <dialog class="modal-page__dialog" id="editor-modal" aria-labelledby="modal-title">
            <div class="modal-page__dialog-inner">
                <header class="modal-page__dialog-header">
                    <h2 class="modal-page__dialog-title" id="modal-title">Edit in modal</h2>
                    <button
                        type="button"
                        class="modal-page__close-btn"
                        id="modal-close-btn"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </header>

                <div class="modal-page__dialog-body">
                    <div id="modal-editor-host" class="modal-page__editor-host"></div>
                    <h3 class="modal-page__preview-label">Preview</h3>
                    <div id="modal-preview" class="modal-page__preview"></div>
                </div>

                <footer class="modal-page__dialog-footer">
                    <button type="button" class="modal-page__footer-btn" id="modal-footer-close-btn">
                        Close
                    </button>
                </footer>
            </div>
        </dialog>

        <section class="modal-page__log-section">
            <h2 class="modal-page__section-title">Lifecycle log</h2>
            <ol class="modal-page__log" id="modal-lifecycle-log"></ol>
        </section>
    </div>
@endsection

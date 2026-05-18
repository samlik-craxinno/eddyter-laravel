@extends('layouts.minimal')

@push('vite')
    @vite(['resources/js/editor/modal.js'])
@endpush

@section('title', 'Eddyter modal')

@section('content')
    <main class="modal-test" data-api-key="{{ config('services.eddyter.api_key') }}">
        <header class="modal-test__header">
            <h1 class="modal-test__title">Modal editor</h1>
            <p class="modal-test__intro">The editor mounts when the modal opens and is destroyed with <code>instance.destroy()</code> when it closes. Toolbar mode and max height apply on the next open.</p>
        </header>

        <fieldset class="modal-test__settings" id="modal-test-settings">
            <legend class="modal-test__legend">Options (next open)</legend>

            <div class="modal-test__field">
                <span class="modal-test__label">Toolbar</span>
                <div class="modal-test__radios">
                    <label class="modal-test__radio">
                        <input type="radio" name="toolbar-mode" value="sticky" checked>
                        Sticky (floating when scrolling)
                    </label>
                    <label class="modal-test__radio">
                        <input type="radio" name="toolbar-mode" value="static">
                        Static (inline with editor)
                    </label>
                </div>
            </div>

            <div class="modal-test__field">
                <label class="modal-test__label" for="modal-max-height">Editor max height (px)</label>
                <input class="modal-test__input" type="number" id="modal-max-height" min="120" max="900" value="280" step="10">
                <p class="modal-test__hint">With <strong>static</strong> toolbar, the SDK applies this to the editable surface. With <strong>sticky</strong>, the outer box still uses this as a scroll cap for the modal body.</p>
            </div>
        </fieldset>

        <p class="modal-test__meta">
            <span>Modal sessions completed: <strong id="modal-cycle-count">0</strong></span>
            <span id="modal-status" class="modal-test__status" aria-live="polite"></span>
        </p>

        <button type="button" class="modal-test__open" id="modal-open-btn">Open modal</button>

        <dialog class="modal-test__dialog" id="editor-modal" aria-labelledby="modal-title">
            <div class="modal-test__dialog-inner">
                <!-- <header class="modal-test__dialog-header">
                    <h2 class="modal-test__dialog-title" id="modal-title">Editor</h2>
                    <button type="button" class="modal-test__close" id="modal-close-btn" aria-label="Close">Close</button>
                </header> -->
                <div class="modal-test__dialog-body">
                    <div id="modal-editor-host" class="modal-test__editor-host"></div>
                </div>
            </div>
        </dialog>
    </main>
@endsection

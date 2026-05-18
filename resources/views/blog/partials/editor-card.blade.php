@php
    $id = $id ?? 'editor';
    $label = $label ?? 'Editor';
    $description = $description ?? '';
    $initial = $initial ?? '<p></p>';
@endphp

<section class="editor-card" aria-labelledby="editor-{{ $id }}-label">
    <header class="editor-card__header">
        <h2 class="editor-card__label" id="editor-{{ $id }}-label">{{ $label }}</h2>
        @if (! empty($description))
            <p class="editor-card__description">{{ $description }}</p>
        @endif
    </header>

    <div
        id="editor-{{ $id }}"
        class="editor-card__editor"
        data-editor-id="{{ $id }}"
        data-editor-label="{{ $label }}"
    >{!! $initial !!}</div>

    <div class="editor-card__actions">
        <button type="button" class="editor-card__btn" data-action="save" data-editor-target="{{ $id }}">Save locally</button>
        <span class="editor-card__status" data-status-for="{{ $id }}" aria-live="polite"></span>
    </div>

    <div class="editor-card__preview-section">
        <h3 class="editor-card__preview-title">Preview</h3>
        <div class="editor-card__preview" data-preview-for="{{ $id }}"></div>
    </div>
</section>
